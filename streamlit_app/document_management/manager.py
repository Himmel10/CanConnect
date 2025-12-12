import os
import shutil
from datetime import datetime, timedelta
from pathlib import Path
import psycopg2
from typing import Dict, List, Optional, Tuple
import mimetypes

class DocumentManager:
    """Manage document uploads, storage, validation, and retrieval"""
    
    def __init__(self, db_host, db_name, db_user, db_pass, storage_path="documents"):
        self.db_host = db_host
        self.db_name = db_name
        self.db_user = db_user
        self.db_pass = db_pass
        self.storage_path = storage_path
        self.local_storage_dir = os.path.join(storage_path, "local")
        
        # Create storage directories
        os.makedirs(self.local_storage_dir, exist_ok=True)
        
        # Allowed file types
        self.allowed_formats = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']
        self.max_file_size_mb = 10  # Default 10MB
    
    def get_connection(self):
        """Create database connection"""
        return psycopg2.connect(
            host=self.db_host,
            database=self.db_name,
            user=self.db_user,
            password=self.db_pass
        )
    
    def validate_file(self, file_path: str, max_size_mb: int = None) -> Tuple[bool, str]:
        """
        Validate file format and size
        
        Returns: (is_valid, error_message)
        """
        if max_size_mb is None:
            max_size_mb = self.max_file_size_mb
        
        # Check if file exists
        if not os.path.exists(file_path):
            return False, "File does not exist"
        
        # Check file size
        file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
        if file_size_mb > max_size_mb:
            return False, f"File size ({file_size_mb:.2f}MB) exceeds limit ({max_size_mb}MB)"
        
        # Check file extension
        file_extension = Path(file_path).suffix.lower().lstrip('.')
        if file_extension not in self.allowed_formats:
            return False, f"File format .{file_extension} not allowed. Allowed: {', '.join(self.allowed_formats)}"
        
        return True, ""
    
    def upload_document(self, request_id: int, user_id: int, file_path: str, 
                       document_type_id: int = None, expiry_days: int = 365) -> Dict:
        """
        Upload and store document
        
        Args:
            request_id: Service request ID
            user_id: User uploading the document
            file_path: Path to the file to upload
            document_type_id: Type of document (optional)
            expiry_days: Days until document expires (default 1 year)
        
        Returns: Dictionary with upload result
        """
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Validate file
            is_valid, error_msg = self.validate_file(file_path)
            if not is_valid:
                return {"success": False, "message": error_msg}
            
            # Get file info
            file_name = os.path.basename(file_path)
            file_size = os.path.getsize(file_path)
            file_extension = Path(file_path).suffix.lower().lstrip('.')
            
            # Create organized storage path
            storage_subpath = f"req_{request_id}/{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file_name}"
            destination_path = os.path.join(self.local_storage_dir, storage_subpath)
            os.makedirs(os.path.dirname(destination_path), exist_ok=True)
            
            # Copy file to storage
            shutil.copy2(file_path, destination_path)
            
            # Calculate expiry date
            expiry_date = datetime.now() + timedelta(days=expiry_days)
            
            # Insert into database
            cursor.execute("""
                INSERT INTO application_attachments
                (request_id, document_type_id, user_id, file_name, file_path, 
                 file_type, file_size_bytes, storage_type, expiry_date, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                request_id, document_type_id, user_id, file_name, destination_path,
                file_extension, file_size, 'local', expiry_date, 'active'
            ))
            
            document_id = cursor.fetchone()[0]
            conn.commit()
            
            return {
                "success": True,
                "document_id": document_id,
                "file_name": file_name,
                "file_size_mb": round(file_size / (1024 * 1024), 2),
                "storage_path": destination_path,
                "expiry_date": expiry_date.isoformat(),
                "message": "Document uploaded successfully"
            }
        
        except Exception as e:
            conn.rollback()
            return {"success": False, "message": f"Upload failed: {str(e)}"}
        finally:
            cursor.close()
            conn.close()
    
    def get_document(self, document_id: int) -> Optional[Dict]:
        """Get document details by ID"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT id, file_name, file_path, file_type, file_size_bytes, 
                       upload_date, expiry_date, storage_type, status
                FROM application_attachments
                WHERE id = %s
            """, (document_id,))
            
            result = cursor.fetchone()
            if result:
                return {
                    "id": result[0],
                    "file_name": result[1],
                    "file_path": result[2],
                    "file_type": result[3],
                    "file_size_bytes": result[4],
                    "upload_date": result[5],
                    "expiry_date": result[6],
                    "storage_type": result[7],
                    "status": result[8]
                }
            return None
        finally:
            cursor.close()
            conn.close()
    
    def download_document(self, document_id: int) -> Optional[str]:
        """Get file path for download"""
        doc = self.get_document(document_id)
        if doc and os.path.exists(doc['file_path']):
            return doc['file_path']
        return None
    
    def get_request_documents(self, request_id: int) -> List[Dict]:
        """Get all documents for a service request"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT id, file_name, file_type, file_size_bytes, upload_date, 
                       is_verified, status, document_type_id
                FROM application_attachments
                WHERE request_id = %s AND status = 'active'
                ORDER BY upload_date DESC
            """, (request_id,))
            
            documents = []
            for row in cursor.fetchall():
                file_size_mb = round(row[3] / (1024 * 1024), 2)
                if file_size_mb < 1:
                    file_size_formatted = f"{round(row[3] / 1024, 2)} KB"
                else:
                    file_size_formatted = f"{file_size_mb} MB"
                
                documents.append({
                    "id": row[0],
                    "file_name": row[1],
                    "file_type": row[2],
                    "file_size_mb": file_size_mb,
                    "file_size_formatted": file_size_formatted,
                    "upload_date": row[4],
                    "is_verified": row[5],
                    "status": row[6],
                    "document_type_id": row[7]
                })
            
            return documents
        finally:
            cursor.close()
            conn.close()
    
    def verify_document(self, document_id: int, verified_by_user_id: int) -> Dict:
        """Mark document as verified"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                UPDATE application_attachments
                SET is_verified = TRUE, verified_by = %s, verified_at = NOW()
                WHERE id = %s
            """, (verified_by_user_id, document_id))
            
            conn.commit()
            return {"success": True, "message": "Document verified"}
        except Exception as e:
            conn.rollback()
            return {"success": False, "message": str(e)}
        finally:
            cursor.close()
            conn.close()
    
    def delete_document(self, document_id: int) -> Dict:
        """Delete/archive document"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Get file path first
            cursor.execute(
                "SELECT file_path FROM application_attachments WHERE id = %s",
                (document_id,)
            )
            result = cursor.fetchone()
            
            if result:
                file_path = result[0]
                
                # Delete from filesystem
                if os.path.exists(file_path):
                    os.remove(file_path)
                
                # Mark as deleted in database
                cursor.execute(
                    "UPDATE application_attachments SET status = 'deleted' WHERE id = %s",
                    (document_id,)
                )
                conn.commit()
                
                return {"success": True, "message": "Document deleted"}
            else:
                return {"success": False, "message": "Document not found"}
        
        except Exception as e:
            conn.rollback()
            return {"success": False, "message": str(e)}
        finally:
            cursor.close()
            conn.close()
    
    def cleanup_expired_documents(self) -> Dict:
        """Delete expired documents (retention policy)"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT id, file_path FROM application_attachments
                WHERE expiry_date <= NOW() AND status = 'active'
            """)
            
            expired_docs = cursor.fetchall()
            deleted_count = 0
            
            for doc_id, file_path in expired_docs:
                try:
                    if os.path.exists(file_path):
                        os.remove(file_path)
                    
                    cursor.execute(
                        "UPDATE application_attachments SET status = 'archived' WHERE id = %s",
                        (doc_id,)
                    )
                    deleted_count += 1
                except:
                    pass
            
            conn.commit()
            return {
                "success": True,
                "deleted_count": deleted_count,
                "message": f"Cleaned up {deleted_count} expired documents"
            }
        
        except Exception as e:
            conn.rollback()
            return {"success": False, "message": str(e)}
        finally:
            cursor.close()
            conn.close()
    
    def get_storage_stats(self) -> Dict:
        """Get document storage statistics"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Total documents
            cursor.execute("SELECT COUNT(*) FROM application_attachments WHERE status = 'active'")
            total_docs = cursor.fetchone()[0]
            
            # Total storage size
            cursor.execute("""
                SELECT SUM(file_size_bytes) 
                FROM application_attachments 
                WHERE status = 'active'
            """)
            total_size = cursor.fetchone()[0] or 0
            
            # By storage type
            cursor.execute("""
                SELECT storage_type, COUNT(*), SUM(file_size_bytes)
                FROM application_attachments
                WHERE status = 'active'
                GROUP BY storage_type
            """)
            
            storage_by_type = []
            for row in cursor.fetchall():
                storage_by_type.append({
                    "storage_type": row[0],
                    "count": row[1],
                    "total_size_mb": round((row[2] or 0) / (1024*1024), 2)
                })
            
            # By file type
            cursor.execute("""
                SELECT file_type, COUNT(*), SUM(file_size_bytes)
                FROM application_attachments
                WHERE status = 'active'
                GROUP BY file_type
            """)
            
            format_data = []
            for row in cursor.fetchall():
                format_data.append({
                    "file_type": row[0],
                    "count": row[1],
                    "total_size_mb": round((row[2] or 0) / (1024*1024), 2)
                })
            
            return {
                "total_documents": total_docs,
                "total_size_gb": round(total_size / (1024*1024*1024), 2),
                "avg_file_size_mb": round((total_size / (1024*1024)) / max(total_docs, 1), 2),
                "by_storage_type": storage_by_type,
                "by_file_type": format_data
            }
        finally:
            cursor.close()
            conn.close()
