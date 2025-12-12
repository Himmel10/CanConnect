import psycopg2
from datetime import datetime
import random
import string

class PaymentGateway:
    """Mock payment gateway for CanConnect system"""
    
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
    
    def process_payment(self, request_id, amount, payment_method, citizen_name, email):
        """Process mock payment"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Generate mock transaction ID
            transaction_id = self._generate_transaction_id()
            
            # Simulate payment processing (90% success rate)
            import random
            is_successful = random.random() < 0.9
            
            payment_status = "Completed" if is_successful else "Failed"
            
            # Check if payment record exists, if so update, else insert
            cursor.execute(
                """
                INSERT INTO payments 
                (request_id, amount, payment_method, transaction_id, status, paid_at)
                VALUES (%s, %s, %s, %s, %s, NOW())
                ON CONFLICT (request_id) DO UPDATE 
                SET status = %s, transaction_id = %s, paid_at = NOW()
                """,
                (request_id, amount, payment_method, transaction_id, payment_status, payment_status, transaction_id)
            )
            
            # Update service request status
            if is_successful:
                cursor.execute(
                    "UPDATE service_requests SET status = 'For Payment Verification' WHERE id = %s",
                    (request_id,)
                )
            
            conn.commit()
            
            return {
                "success": is_successful,
                "transaction_id": transaction_id,
                "status": payment_status,
                "amount": amount,
                "method": payment_method,
                "timestamp": datetime.now().isoformat(),
                "message": "Payment processed successfully!" if is_successful else "Payment failed. Please try again."
            }
            
        except Exception as e:
            conn.rollback()
            return {
                "success": False,
                "status": "Error",
                "message": f"Database error: {str(e)}"
            }
        finally:
            cursor.close()
            conn.close()
    
    def verify_payment(self, transaction_id):
        """Verify payment status"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute(
                "SELECT * FROM payments WHERE transaction_id = %s",
                (transaction_id,)
            )
            payment = cursor.fetchone()
            
            if payment:
                return {
                    "found": True,
                    "transaction_id": payment[3],
                    "amount": payment[2],
                    "status": payment[4],
                    "paid_at": payment[5]
                }
            else:
                return {"found": False, "message": "Transaction not found"}
                
        finally:
            cursor.close()
            conn.close()
    
    def get_payment_history(self, citizen_name=None, limit=10):
        """Get payment history"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            if citizen_name:
                cursor.execute(
                    """
                    SELECT p.*, sr.service_type, sr.citizen_name 
                    FROM payments p
                    JOIN service_requests sr ON p.request_id = sr.id
                    WHERE sr.citizen_name = %s
                    ORDER BY p.paid_at DESC LIMIT %s
                    """,
                    (citizen_name, limit)
                )
            else:
                cursor.execute(
                    """
                    SELECT p.*, sr.service_type, sr.citizen_name 
                    FROM payments p
                    JOIN service_requests sr ON p.request_id = sr.id
                    ORDER BY p.paid_at DESC LIMIT %s
                    """,
                    (limit,)
                )
            
            payments = cursor.fetchall()
            return payments
            
        finally:
            cursor.close()
            conn.close()
    
    def _generate_transaction_id(self):
        """Generate unique transaction ID"""
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        return f"CC{timestamp}{random_suffix}"
    
    def get_payment_stats(self):
        """Get payment statistics"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Total payments
            cursor.execute("SELECT COUNT(*) FROM payments")
            total_payments = cursor.fetchone()[0]
            
            # Total amount
            cursor.execute("SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'Completed'")
            total_amount = cursor.fetchone()[0]
            
            # Successful payments
            cursor.execute("SELECT COUNT(*) FROM payments WHERE status = 'Completed'")
            successful = cursor.fetchone()[0]
            
            # Failed payments
            cursor.execute("SELECT COUNT(*) FROM payments WHERE status = 'Failed'")
            failed = cursor.fetchone()[0]
            
            return {
                "total_payments": total_payments,
                "total_amount": total_amount,
                "successful": successful,
                "failed": failed,
                "success_rate": (successful / total_payments * 100) if total_payments > 0 else 0
            }
            
        finally:
            cursor.close()
            conn.close()
