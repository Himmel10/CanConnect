import os
from datetime import timedelta

class Config:
    """Base configuration"""
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = os.getenv('DEBUG', True)
    TESTING = False
    
    # Database
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_NAME = os.getenv('DB_NAME', 'canconnect')
    DB_USER = os.getenv('DB_USER', 'postgres')
    DB_PASS = os.getenv('DB_PASS', 'password')
    
    # JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    
    # File Upload
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'documents/uploads')
    MAX_FILE_SIZE_MB = 10
    ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'}
    
    # CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*')
    
    # Pagination
    ITEMS_PER_PAGE = 20
    
    # File Storage
    FILE_STORAGE_PATH = os.getenv('FILE_STORAGE_PATH', 'documents/local')

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')  # Must be set in production
    
class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True
    DB_NAME = 'canconnect_test'

# Config dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
