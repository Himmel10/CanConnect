import psycopg2
from datetime import datetime, timedelta
import bcrypt
import secrets
from typing import Dict, List, Optional, Tuple

class UserManager:
    """Manage user accounts, authentication, and sessions"""
    
    def __init__(self, db_host, db_name, db_user, db_pass):
        self.db_host = db_host
        self.db_name = db_name
        self.db_user = db_user
        self.db_pass = db_pass
    
    def get_connection(self):
        """Create database connection"""
        return psycopg2.connect(
            host=self.db_host,
            database=self.db_name,
            user=self.db_user,
            password=self.db_pass
        )
    
    def hash_password(self, password: str) -> str:
        """Hash password with bcrypt"""
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def verify_password(self, password: str, hash_value: str) -> bool:
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hash_value.encode('utf-8'))
    
    def create_user(self, username: str, email: str, password: str, full_name: str,
                   phone: str = None, user_type: str = 'citizen') -> Dict:
        """Create new user account"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Check if user exists
            cursor.execute(
                "SELECT id FROM users WHERE username = %s OR email = %s",
                (username, email)
            )
            if cursor.fetchone():
                return {"success": False, "message": "Username or email already exists"}
            
            # Hash password
            password_hash = self.hash_password(password)
            
            # Create user
            cursor.execute("""
                INSERT INTO users
                (username, email, password_hash, full_name, phone, user_type, status)
                VALUES (%s, %s, %s, %s, %s, %s, 'active')
                RETURNING id
            """, (username, email, password_hash, full_name, phone, user_type))
            
            user_id = cursor.fetchone()[0]
            
            # Create user preferences
            cursor.execute("""
                INSERT INTO user_preferences (user_id)
                VALUES (%s)
            """, (user_id,))
            
            conn.commit()
            
            return {
                "success": True,
                "user_id": user_id,
                "message": "User created successfully"
            }
        
        except Exception as e:
            conn.rollback()
            return {"success": False, "message": str(e)}
        finally:
            cursor.close()
            conn.close()
    
    def login(self, username_or_email: str, password: str, ip_address: str = None) -> Dict:
        """Authenticate user and create session"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Find user
            cursor.execute("""
                SELECT id, password_hash, status, user_type
                FROM users
                WHERE (username = %s OR email = %s) AND status = 'active'
            """, (username_or_email, username_or_email))
            
            result = cursor.fetchone()
            if not result:
                return {"success": False, "message": "Invalid credentials"}
            
            user_id, password_hash, status, user_type = result
            
            # Verify password
            if not self.verify_password(password, password_hash):
                return {"success": False, "message": "Invalid credentials"}
            
            # Create session
            token = secrets.token_urlsafe(32)
            expires_at = datetime.now() + timedelta(days=7)
            
            cursor.execute("""
                INSERT INTO user_sessions
                (user_id, token, ip_address, expires_at)
                VALUES (%s, %s, %s, %s)
            """, (user_id, token, ip_address, expires_at))
            
            # Update last login
            cursor.execute(
                "UPDATE users SET last_login = NOW() WHERE id = %s",
                (user_id,)
            )
            
            conn.commit()
            
            return {
                "success": True,
                "user_id": user_id,
                "token": token,
                "user_type": user_type,
                "expires_at": expires_at.isoformat(),
                "message": "Login successful"
            }
        
        except Exception as e:
            conn.rollback()
            return {"success": False, "message": str(e)}
        finally:
            cursor.close()
            conn.close()
    
    def verify_token(self, token: str) -> Optional[Dict]:
        """Verify session token"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT us.user_id, u.username, u.email, u.full_name, u.user_type, us.expires_at
                FROM user_sessions us
                JOIN users u ON us.user_id = u.id
                WHERE us.token = %s AND us.expires_at > NOW()
            """, (token,))
            
            result = cursor.fetchone()
            if result:
                return {
                    "user_id": result[0],
                    "username": result[1],
                    "email": result[2],
                    "full_name": result[3],
                    "user_type": result[4],
                    "expires_at": result[5]
                }
            return None
        finally:
            cursor.close()
            conn.close()
    
    def logout(self, token: str) -> Dict:
        """Invalidate session"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute(
                "DELETE FROM user_sessions WHERE token = %s",
                (token,)
            )
            conn.commit()
            return {"success": True, "message": "Logged out successfully"}
        except Exception as e:
            conn.rollback()
            return {"success": False, "message": str(e)}
        finally:
            cursor.close()
            conn.close()
    
    def get_user_profile(self, user_id: int) -> Optional[Dict]:
        """Get user profile information"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT u.id, u.username, u.email, u.full_name, u.phone,
                       u.address, u.barangay, u.municipality, u.province,
                       u.user_type, u.status, u.created_at, u.last_login,
                       up.notification_email, up.notification_sms, up.language, up.timezone
                FROM users u
                LEFT JOIN user_preferences up ON u.id = up.user_id
                WHERE u.id = %s
            """, (user_id,))
            
            result = cursor.fetchone()
            if result:
                return {
                    "id": result[0],
                    "username": result[1],
                    "email": result[2],
                    "full_name": result[3],
                    "phone": result[4],
                    "address": result[5],
                    "barangay": result[6],
                    "municipality": result[7],
                    "province": result[8],
                    "user_type": result[9],
                    "status": result[10],
                    "created_at": result[11],
                    "last_login": result[12],
                    "preferences": {
                        "notification_email": result[13],
                        "notification_sms": result[14],
                        "language": result[15],
                        "timezone": result[16]
                    }
                }
            return None
        finally:
            cursor.close()
            conn.close()
    
    def update_user_profile(self, user_id: int, updates: Dict) -> Dict:
        """Update user profile information"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Build update query dynamically
            update_fields = []
            values = []
            
            allowed_fields = ['full_name', 'phone', 'address', 'barangay', 'municipality', 'province']
            for field in allowed_fields:
                if field in updates:
                    update_fields.append(f"{field} = %s")
                    values.append(updates[field])
            
            if update_fields:
                values.append(user_id)
                query = f"UPDATE users SET {', '.join(update_fields)}, updated_at = NOW() WHERE id = %s"
                cursor.execute(query, values)
                conn.commit()
            
            return {"success": True, "message": "Profile updated successfully"}
        
        except Exception as e:
            conn.rollback()
            return {"success": False, "message": str(e)}
        finally:
            cursor.close()
            conn.close()
    
    def change_password(self, user_id: int, old_password: str, new_password: str) -> Dict:
        """Change user password"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Get current password hash
            cursor.execute(
                "SELECT password_hash FROM users WHERE id = %s",
                (user_id,)
            )
            result = cursor.fetchone()
            if not result:
                return {"success": False, "message": "User not found"}
            
            # Verify old password
            if not self.verify_password(old_password, result[0]):
                return {"success": False, "message": "Current password is incorrect"}
            
            # Update password
            new_hash = self.hash_password(new_password)
            cursor.execute(
                "UPDATE users SET password_hash = %s, updated_at = NOW() WHERE id = %s",
                (new_hash, user_id)
            )
            conn.commit()
            
            return {"success": True, "message": "Password changed successfully"}
        
        except Exception as e:
            conn.rollback()
            return {"success": False, "message": str(e)}
        finally:
            cursor.close()
            conn.close()
    
    def list_staff(self, department_id: int = None) -> List[Dict]:
        """List staff members"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            if department_id:
                cursor.execute("""
                    SELECT u.id, u.username, u.full_name, sr.role, d.name, u.status
                    FROM users u
                    LEFT JOIN staff_roles sr ON u.id = sr.user_id
                    LEFT JOIN departments d ON sr.department_id = d.id
                    WHERE u.user_type IN ('staff', 'admin') AND d.id = %s
                    ORDER BY u.full_name
                """, (department_id,))
            else:
                cursor.execute("""
                    SELECT u.id, u.username, u.full_name, sr.role, d.name, u.status
                    FROM users u
                    LEFT JOIN staff_roles sr ON u.id = sr.user_id
                    LEFT JOIN departments d ON sr.department_id = d.id
                    WHERE u.user_type IN ('staff', 'admin')
                    ORDER BY u.full_name
                """)
            
            staff_list = []
            for row in cursor.fetchall():
                staff_list.append({
                    "id": row[0],
                    "username": row[1],
                    "full_name": row[2],
                    "role": row[3],
                    "department": row[4],
                    "status": row[5]
                })
            
            return staff_list
        finally:
            cursor.close()
            conn.close()
    
    def get_user_statistics(self) -> Dict:
        """Get user statistics"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Total users by type
            cursor.execute("""
                SELECT user_type, COUNT(*) FROM users WHERE status = 'active'
                GROUP BY user_type
            """)
            
            stats = {
                "total_active": 0,
                "by_type": {},
                "new_users_this_month": 0
            }
            
            for row in cursor.fetchall():
                stats["by_type"][row[0]] = row[1]
                stats["total_active"] += row[1]
            
            # New users this month
            cursor.execute("""
                SELECT COUNT(*) FROM users 
                WHERE created_at >= DATE_TRUNC('month', NOW())
            """)
            stats["new_users_this_month"] = cursor.fetchone()[0]
            
            return stats
        finally:
            cursor.close()
            conn.close()
