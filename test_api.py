#!/usr/bin/env python3
import requests
import json

API_URL = "http://127.0.0.1:5000/api"

print("Testing Backend API...")
print("-" * 50)

# Test 1: Check health
print("\n1. Testing health endpoint...")
try:
    response = requests.get(f"{API_URL}/health")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
except Exception as e:
    print(f"   Error: {e}")

# Test 2: Test registration with proper data
print("\n2. Testing registration endpoint...")
test_data = {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "09123456789",
    "password": "password123"
}
try:
    response = requests.post(
        f"{API_URL}/auth/register",
        json=test_data,
        headers={"Content-Type": "application/json"}
    )
    print(f"   Status: {response.status_code}")
    print(f"   Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"   Error: {e}")

# Test 3: Test login
print("\n3. Testing login endpoint...")
login_data = {
    "email": "john@example.com",
    "password": "password123"
}
try:
    response = requests.post(
        f"{API_URL}/auth/login",
        json=login_data,
        headers={"Content-Type": "application/json"}
    )
    print(f"   Status: {response.status_code}")
    print(f"   Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"   Error: {e}")
