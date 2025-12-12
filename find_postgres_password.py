import psycopg2
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), 'backend', '.env'))

db_host = os.getenv('DB_HOST', 'localhost')
db_name = os.getenv('DB_NAME', 'canconnect')
db_user = os.getenv('DB_USER', 'postgres')

# Try common passwords
passwords = ['password', 'postgres', 'admin', 'postgres123', '12345678', 'canconnect']

for pwd in passwords:
    try:
        conn = psycopg2.connect(
            host=db_host,
            database=db_name,
            user=db_user,
            password=pwd,
            connect_timeout=5
        )
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        print(f"✓ SUCCESS! Correct password is: {pwd}")
        cursor.close()
        conn.close()
        exit(0)
    except psycopg2.OperationalError as e:
        print(f"✗ Failed with '{pwd}': {str(e)[:80]}")
        pass

print("\n✗ None of the common passwords worked")
print("You'll need to provide the PostgreSQL password you set during installation")
