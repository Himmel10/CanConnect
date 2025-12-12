from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
from datetime import datetime, timedelta
import jwt
from functools import wraps

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'streamlit_app'))

from user_management.manager import UserManager
from document_management.manager import DocumentManager
from config import config

# Initialize Flask app
app = Flask(__name__)

# Load configuration
env = os.getenv('FLASK_ENV', 'development')
app.config.from_object(config[env])

# Enable CORS
CORS(app, origins=app.config['CORS_ORIGINS'])

# Initialize managers
user_manager = UserManager(
    db_host=app.config['DB_HOST'],
    db_name=app.config['DB_NAME'],
    db_user=app.config['DB_USER'],
    db_pass=app.config['DB_PASS']
)

doc_manager = DocumentManager(
    db_host=app.config['DB_HOST'],
    db_name=app.config['DB_NAME'],
    db_user=app.config['DB_USER'],
    db_pass=app.config['DB_PASS'],
    storage_path=app.config['FILE_STORAGE_PATH']
)

# Create upload folder
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# ===========================
# Authentication Middleware
# ===========================

def token_required(f):
    """Decorator to require valid token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from headers
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]  # Bearer <token>
            except IndexError:
                return jsonify({'success': False, 'message': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'success': False, 'message': 'Token is missing'}), 401
        
        # Verify token
        user_info = user_manager.verify_token(token)
        if not user_info:
            return jsonify({'success': False, 'message': 'Token is invalid or expired'}), 401
        
        # Store user info in request context
        request.user = user_info
        request.token = token
        
        return f(*args, **kwargs)
    
    return decorated

def admin_required(f):
    """Decorator to require admin role"""
    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        if request.user['user_type'] != 'admin':
            return jsonify({'success': False, 'message': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated

def staff_or_admin_required(f):
    """Decorator to require staff or admin role"""
    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        if request.user['user_type'] not in ['staff', 'admin']:
            return jsonify({'success': False, 'message': 'Staff access required'}), 403
        return f(*args, **kwargs)
    return decorated

# ===========================
# Health Check
# ===========================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'CanConnect API is running',
        'timestamp': datetime.now().isoformat()
    }), 200

# ===========================
# Authentication Endpoints
# ===========================

@app.route('/api/auth/register', methods=['POST', 'OPTIONS'])
def register():
    """Register new user"""
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No JSON data received'}), 400
        
        # Validate required fields
        required = ['first_name', 'last_name', 'email', 'password', 'phone']
        missing = [field for field in required if field not in data]
        if missing:
            return jsonify({'success': False, 'message': f'Missing required fields: {", ".join(missing)}'}), 400
        
        # Create username from email
        username = data['email'].split('@')[0]
        # Create full name from first and last name
        full_name = f"{data['first_name']} {data['last_name']}"
        
        # Create user
        result = user_manager.create_user(
            username=username,
            email=data['email'],
            password=data['password'],
            full_name=full_name,
            phone=data.get('phone'),
            user_type=data.get('user_type', 'citizen')
        )
        
        return jsonify(result), 201 if result['success'] else 400
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'Server error: {str(e)}'}), 500

@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
def login():
    """Login user"""
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No JSON data received'}), 400
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'success': False, 'message': 'Email and password required'}), 400
        
        # Get IP address
        ip_address = request.remote_addr
        
        # Perform login (using email as both username and email)
        result = user_manager.login(
            username_or_email=data['email'],
            password=data['password'],
            ip_address=ip_address
        )
        
        return jsonify(result), 200 if result['success'] else 401
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'Server error: {str(e)}'}), 500

@app.route('/api/auth/logout', methods=['POST'])
@token_required
def logout():
    """Logout user"""
    try:
        result = user_manager.logout(request.token)
        return jsonify(result), 200 if result['success'] else 400
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/auth/verify', methods=['GET'])
@token_required
def verify_token():
    """Verify current token"""
    return jsonify({
        'success': True,
        'user': request.user
    }), 200

# ===========================
# User Endpoints
# ===========================

@app.route('/api/users/<int:user_id>', methods=['GET'])
@token_required
def get_user(user_id):
    """Get user profile"""
    try:
        # Check authorization (user can view own profile or admins can view any)
        if request.user['user_id'] != user_id and request.user['user_type'] != 'admin':
            return jsonify({'success': False, 'message': 'Unauthorized'}), 403
        
        profile = user_manager.get_user_profile(user_id)
        if profile:
            return jsonify({'success': True, 'user': profile}), 200
        else:
            return jsonify({'success': False, 'message': 'User not found'}), 404
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/users/<int:user_id>', methods=['PUT'])
@token_required
def update_user(user_id):
    """Update user profile"""
    try:
        # Check authorization
        if request.user['user_id'] != user_id and request.user['user_type'] != 'admin':
            return jsonify({'success': False, 'message': 'Unauthorized'}), 403
        
        data = request.get_json()
        result = user_manager.update_user_profile(user_id, data)
        
        return jsonify(result), 200 if result['success'] else 400
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/users/<int:user_id>/password', methods=['POST'])
@token_required
def change_password(user_id):
    """Change user password"""
    try:
        # Check authorization
        if request.user['user_id'] != user_id:
            return jsonify({'success': False, 'message': 'Unauthorized'}), 403
        
        data = request.get_json()
        
        if not data.get('old_password') or not data.get('new_password'):
            return jsonify({'success': False, 'message': 'Old and new passwords required'}), 400
        
        result = user_manager.change_password(
            user_id=user_id,
            old_password=data['old_password'],
            new_password=data['new_password']
        )
        
        return jsonify(result), 200 if result['success'] else 400
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ===========================
# Document Endpoints
# ===========================

@app.route('/api/documents/upload', methods=['POST'])
@token_required
def upload_document():
    """Upload document"""
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'message': 'No file provided'}), 400
        
        file = request.files['file']
        request_id = request.form.get('request_id', type=int)
        document_type_id = request.form.get('document_type_id', type=int)
        
        if not request_id or not document_type_id:
            return jsonify({'success': False, 'message': 'Request ID and document type required'}), 400
        
        # Save file temporarily
        temp_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        file.save(temp_path)
        
        # Validate file
        is_valid, error_msg = doc_manager.validate_file(temp_path)
        if not is_valid:
            os.remove(temp_path)
            return jsonify({'success': False, 'message': error_msg}), 400
        
        # Upload document
        result = doc_manager.upload_document(
            request_id=request_id,
            user_id=request.user['user_id'],
            file_path=temp_path,
            document_type_id=document_type_id,
            expiry_days=365
        )
        
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        return jsonify(result), 201 if result['success'] else 400
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/documents/<int:request_id>', methods=['GET'])
@token_required
def get_documents(request_id):
    """Get documents for request"""
    try:
        documents = doc_manager.get_request_documents(request_id)
        return jsonify({
            'success': True,
            'documents': documents,
            'count': len(documents)
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/documents/<int:doc_id>/download', methods=['GET'])
@token_required
def download_document(doc_id):
    """Download document"""
    try:
        file_path = doc_manager.download_document(doc_id)
        
        if not file_path or not os.path.exists(file_path):
            return jsonify({'success': False, 'message': 'Document not found'}), 404
        
        return {
            'success': True,
            'file_path': file_path,
            'file_name': os.path.basename(file_path)
        }, 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/documents/<int:doc_id>', methods=['DELETE'])
@token_required
def delete_document(doc_id):
    """Delete document"""
    try:
        result = doc_manager.delete_document(doc_id)
        return jsonify(result), 200 if result['success'] else 400
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/documents/<int:doc_id>/verify', methods=['POST'])
@staff_or_admin_required
def verify_document(doc_id):
    """Verify document (staff only)"""
    try:
        result = doc_manager.verify_document(doc_id, request.user['user_id'])
        return jsonify(result), 200 if result['success'] else 400
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ===========================
# Admin Endpoints
# ===========================

@app.route('/api/admin/users', methods=['GET'])
@admin_required
def admin_list_users():
    """List all users (admin only)"""
    try:
        users = user_manager.list_staff()  # Returns all staff
        return jsonify({
            'success': True,
            'users': users,
            'count': len(users)
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/admin/documents/cleanup', methods=['POST'])
@admin_required
def admin_cleanup_documents():
    """Run document cleanup (admin only)"""
    try:
        result = doc_manager.cleanup_expired_documents()
        return jsonify(result), 200 if result['success'] else 400
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/admin/statistics', methods=['GET'])
@admin_required
def admin_statistics():
    """Get system statistics (admin only)"""
    try:
        user_stats = user_manager.get_user_statistics()
        doc_stats = doc_manager.get_storage_stats()
        
        return jsonify({
            'success': True,
            'users': user_stats,
            'documents': doc_stats,
            'timestamp': datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ===========================
# Error Handlers
# ===========================

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'success': False, 'message': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'success': False, 'message': 'Internal server error'}), 500

@app.errorhandler(403)
def forbidden(error):
    """Handle 403 errors"""
    return jsonify({'success': False, 'message': 'Forbidden'}), 403

# ===========================
# Main
# ===========================

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=app.config['DEBUG']
    )
