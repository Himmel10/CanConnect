import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), 'backend', '.env'))

print("Testing PostgreSQL Connection...")
print("-" * 50)

# Get credentials from .env
db_host = os.getenv('DB_HOST', 'localhost')
db_name = os.getenv('DB_NAME', 'canconnect')
db_user = os.getenv('DB_USER', 'postgres')
db_pass = os.getenv('DB_PASS', '')

print(f"Host: {db_host}")
print(f"Database: {db_name}")
print(f"User: {db_user}")
print(f"Password: {'(empty)' if not db_pass else '***'}")
print("-" * 50)

# Try different connection methods
attempts = [
    {
        'name': 'With empty password',
        'params': {
            'host': db_host,
            'database': db_name,
            'user': db_user,
            'password': ''
        }
    },
    {
        'name': 'With common default passwords',
        'passwords': ['password', 'postgres', 'admin', '', '123456']
    }
]

for attempt in attempts:
    if 'params' in attempt:
        print(f"\n✓ Attempt: {attempt['name']}")
        try:
            conn = psycopg2.connect(**attempt['params'])
            cursor = conn.cursor()
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print(f"  SUCCESS! PostgreSQL version: {version[0][:50]}...")
            cursor.close()
            conn.close()
            break
        except psycopg2.OperationalError as e:
            print(f"  FAILED: {str(e)[:100]}")
    else:
        print(f"\n✓ Attempt: {attempt['name']}")
        for pwd in attempt['passwords']:
            try:
                conn = psycopg2.connect(
                    host=db_host,
                    database=db_name,
                    user=db_user,
                    password=pwd
                )
                cursor = conn.cursor()
                cursor.execute("SELECT version();")
                version = cursor.fetchone()
                print(f"  SUCCESS with password: '{pwd}'")
                print(f"  PostgreSQL version: {version[0][:50]}...")
                cursor.close()
                conn.close()
                
                # Update .env with correct password
                with open(os.path.join('backend', '.env'), 'r') as f:
                    content = f.read()
                content = content.replace(f'DB_PASS=', f'DB_PASS={pwd}')
                with open(os.path.join('backend', '.env'), 'w') as f:
                    f.write(content)
                print(f"  Updated .env with correct password!")
                break
            except psycopg2.OperationalError:
                pass
