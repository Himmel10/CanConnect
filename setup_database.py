import psycopg2
from psycopg2 import sql
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), 'backend', '.env'))

db_host = os.getenv('DB_HOST', 'localhost')
db_user = os.getenv('DB_USER', 'postgres')
db_pass = os.getenv('DB_PASS', 'postgres')
db_name = os.getenv('DB_NAME', 'canconnect')

print(f"Setting up database: {db_name}")
print("-" * 50)

try:
    # Connect to default postgres database
    conn = psycopg2.connect(
        host=db_host,
        database='postgres',
        user=db_user,
        password=db_pass
    )
    conn.autocommit = True
    cursor = conn.cursor()
    
    # Check if database exists
    cursor.execute(
        "SELECT 1 FROM pg_database WHERE datname = %s",
        (db_name,)
    )
    
    if cursor.fetchone():
        print(f"✓ Database '{db_name}' already exists")
    else:
        print(f"✗ Database '{db_name}' does not exist, creating...")
        cursor.execute(sql.SQL("CREATE DATABASE {}").format(
            sql.Identifier(db_name)
        ))
        print(f"✓ Database '{db_name}' created successfully")
    
    cursor.close()
    conn.close()
    
    # Now connect to the new database and create tables
    print("\nCreating tables...")
    conn = psycopg2.connect(
        host=db_host,
        database=db_name,
        user=db_user,
        password=db_pass
    )
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(255),
            phone VARCHAR(20),
            user_type VARCHAR(50) DEFAULT 'citizen',
            status VARCHAR(50) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    print("✓ Created users table")
    
    # Create user_preferences table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_preferences (
            id SERIAL PRIMARY KEY,
            user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            language VARCHAR(10) DEFAULT 'en',
            notifications_enabled BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    print("✓ Created user_preferences table")
    
    # Create user_sessions table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_sessions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            token VARCHAR(500) NOT NULL,
            ip_address VARCHAR(45),
            user_agent TEXT,
            expires_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    print("✓ Created user_sessions table")
    
    # Create documents table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS documents (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            document_type VARCHAR(100) NOT NULL,
            file_path VARCHAR(500),
            file_name VARCHAR(255),
            file_size INTEGER,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    print("✓ Created documents table")
    
    # Create service_requests table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS service_requests (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            service_type VARCHAR(100) NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    print("✓ Created service_requests table")
    
    conn.commit()
    cursor.close()
    conn.close()
    
    print("\n" + "=" * 50)
    print("✓ Database setup completed successfully!")
    print("=" * 50)
    
except Exception as e:
    print(f"✗ Error: {str(e)}")
    exit(1)
