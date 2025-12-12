#!/usr/bin/env python
"""Quick test to verify database connection and API setup"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'streamlit_app'))

print("Testing CanConnect Backend Setup...")
print("=" * 50)

# Test 1: Import Flask
try:
    from flask import Flask
    print("✅ Flask imported successfully")
except Exception as e:
    print(f"❌ Flask import failed: {e}")
    sys.exit(1)

# Test 2: Import config
try:
    from config import config
    print("✅ Config imported successfully")
except Exception as e:
    print(f"❌ Config import failed: {e}")
    sys.exit(1)

# Test 3: Database connection
try:
    from user_management.manager import UserManager
    db_host = os.getenv('DB_HOST', 'localhost')
    db_name = os.getenv('DB_NAME', 'canconnect')
    db_user = os.getenv('DB_USER', 'postgres')
    db_pass = os.getenv('DB_PASS', 'password')
    
    print(f"\nDatabase Configuration:")
    print(f"  Host: {db_host}")
    print(f"  Name: {db_name}")
    print(f"  User: {db_user}")
    
    # Try to connect
    user_manager = UserManager(
        db_host=db_host,
        db_name=db_name,
        db_user=db_user,
        db_pass=db_pass
    )
    print("✅ Database connection successful")
except Exception as e:
    print(f"❌ Database connection failed: {e}")
    print("\nFix: Make sure PostgreSQL is running and database 'canconnect' exists")
    sys.exit(1)

# Test 4: Create Flask app
try:
    app = Flask(__name__)
    print("✅ Flask app created successfully")
except Exception as e:
    print(f"❌ Flask app creation failed: {e}")
    sys.exit(1)

print("\n" + "=" * 50)
print("✅ All tests passed! Backend is ready to run.")
print("\nTo start the backend, run: python app.py")
