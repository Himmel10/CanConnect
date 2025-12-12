# CanConnect REST API Backend

Flask-based REST API backend for the CanConnect e-government platform.

## Features

✅ **User Management**
- User registration and authentication
- Profile management
- Password management
- Staff organization

✅ **Document Management**
- File upload with validation
- Document retrieval and download
- Staff verification workflow
- Storage analytics

✅ **Admin Functions**
- User listing and management
- Document cleanup and archival
- System statistics and monitoring

✅ **Security**
- Bcrypt password hashing
- JWT token-based authentication
- Role-based access control
- SQL injection prevention

---

## Quick Start

### Installation

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Set up environment (copy example)
cp .env.example .env

# 3. Ensure PostgreSQL is running
psql -U postgres

# 4. Verify database exists
psql -d canconnect -c "SELECT COUNT(*) FROM users;"
```

### Run Development Server

```bash
python app.py
```

Server runs at: `http://localhost:5000`

### Test Health Endpoint

```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "ok",
  "message": "CanConnect API is running",
  "timestamp": "2025-12-09T10:00:00.000000"
}
```

---

## Project Structure

```
backend/
├── app.py                    # Main Flask application (550 lines)
├── config.py                 # Configuration management
├── requirements.txt          # Python dependencies
├── .env.example              # Environment variable template
├── API_DOCUMENTATION.md      # Complete API reference
└── README.md                 # This file
```

---

## Configuration

### Environment Variables

Create `.env` file (copy from `.env.example`):

```bash
# Database
DB_HOST=localhost
DB_NAME=canconnect
DB_USER=postgres
DB_PASS=password

# JWT Secret (generate a long random string for production)
JWT_SECRET_KEY=your-secret-key

# File Upload
MAX_FILE_SIZE_MB=10
UPLOAD_FOLDER=documents/uploads
FILE_STORAGE_PATH=documents/local
```

### Development vs Production

**Development** (default):
```bash
FLASK_ENV=development
DEBUG=True
```

**Production**:
```bash
FLASK_ENV=production
DEBUG=False
JWT_SECRET_KEY=<long-random-string>
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify` - Verify token

### Users
- `GET /api/users/{user_id}` - Get user profile
- `PUT /api/users/{user_id}` - Update profile
- `POST /api/users/{user_id}/password` - Change password

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/{request_id}` - Get documents
- `GET /api/documents/{doc_id}/download` - Download document
- `DELETE /api/documents/{doc_id}` - Delete document
- `POST /api/documents/{doc_id}/verify` - Verify document (staff)

### Admin
- `GET /api/admin/users` - List users
- `POST /api/admin/documents/cleanup` - Run cleanup
- `GET /api/admin/statistics` - Get statistics

---

## Usage Examples

### Register & Login

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "full_name": "John Doe",
    "phone": "09123456789"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "SecurePass123!"
  }'

# Save token from response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Upload Document

```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@document.pdf" \
  -F "request_id=101" \
  -F "document_type_id=1"
```

### Get User Profile

```bash
curl http://localhost:5000/api/users/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Admin Statistics

```bash
curl http://localhost:5000/api/admin/statistics \
  -H "Authorization: Bearer $TOKEN"
```

---

## Integration with Frontend

### React App

```typescript
const API_URL = 'http://localhost:5000/api';

// Login
const login = async (username, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username, password})
  });
  const data = await res.json();
  localStorage.setItem('token', data.token);
  return data;
};

// Protected request
const getProfile = async (userId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}/users/${userId}`, {
    headers: {'Authorization': `Bearer ${token}`}
  });
  return res.json();
};
```

### React Native

```javascript
// Upload document
const uploadDocument = async (requestId, docTypeId, fileUri) => {
  const token = await AsyncStorage.getItem('token');
  const formData = new FormData();
  formData.append('request_id', requestId);
  formData.append('document_type_id', docTypeId);
  formData.append('file', {uri: fileUri, type: 'application/pdf', name: 'doc.pdf'});

  const res = await fetch(`${API_URL}/documents/upload`, {
    method: 'POST',
    headers: {'Authorization': `Bearer ${token}`},
    body: formData
  });
  return res.json();
};
```

---

## Authentication

### Token-Based Authentication

1. **Register** → Get `user_id`
2. **Login** → Get `token` (valid 7 days)
3. **Use token** → Add to `Authorization: Bearer {token}` header
4. **Logout** → Invalidate token

### Token Expiry

- Tokens expire after 7 days
- User must login again for new token
- Expired tokens return 401 Unauthorized

### Authorization Levels

- **Public** (no token needed): `/api/health`, `/api/auth/register`, `/api/auth/login`
- **User** (token required): User profile, documents, basic operations
- **Staff** (token + staff role): Document verification
- **Admin** (token + admin role): User management, cleanup, statistics

---

## Database Integration

### Tables Used

- `users` - User accounts
- `user_sessions` - Active sessions/tokens
- `user_preferences` - User settings
- `staff_roles` - Staff organization
- `departments` - Department info
- `application_attachments` - Document metadata
- `service_requests` - Service applications
- `document_types` - Document classification

### Database Connection

```python
from user_management.manager import UserManager
from document_management.manager import DocumentManager

user_mgr = UserManager(
    db_host="localhost",
    db_name="canconnect",
    db_user="postgres",
    db_pass="password"
)

doc_mgr = DocumentManager(
    db_host="localhost",
    db_name="canconnect",
    db_user="postgres",
    db_pass="password"
)
```

---

## Error Handling

### HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Testing

### Unit Tests

```python
# Test registration
def test_register():
    response = client.post('/api/auth/register', json={
        'username': 'test',
        'email': 'test@example.com',
        'password': 'TestPass123!',
        'full_name': 'Test User'
    })
    assert response.status_code == 201

# Test login
def test_login():
    response = client.post('/api/auth/login', json={
        'username': 'test',
        'password': 'TestPass123!'
    })
    assert response.status_code == 200
    assert 'token' in response.json
```

### Integration Tests

- End-to-end registration → login → profile flow
- Document upload → verify → retrieve flow
- Admin operations with role validation
- Token expiry behavior

### Load Testing

```bash
# Install locust
pip install locust

# Create locustfile.py with test scenarios
# Run: locust -f locustfile.py
```

---

## Deployment

### Development

```bash
python app.py
```

### Production with Gunicorn

```bash
# Install gunicorn
pip install gunicorn

# Run with 4 workers
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Docker (Optional)

```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

Build and run:
```bash
docker build -t canconnect-api .
docker run -p 5000:5000 canconnect-api
```

### Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Update .env with production values
nano .env

# Run migrations (if needed)
python -m flask db upgrade

# Start server
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

---

## Monitoring & Logs

### View Logs

```bash
# Running logs
tail -f app.log

# Search logs
grep ERROR app.log

# Recent logs
tail -100 app.log
```

### Health Check

```bash
# Check API status
curl http://localhost:5000/api/health

# Check database connection
curl http://localhost:5000/api/health
```

---

## Security Best Practices

✅ **Password Security**
- Bcrypt hashing with salt
- Minimum 8 characters
- Mixed case + numbers recommended

✅ **Token Security**
- 32-byte cryptographic tokens
- 7-day expiration
- Invalid on logout
- HTTPS recommended in production

✅ **Database Security**
- Parameterized queries (SQL injection prevention)
- Transaction rollback on errors
- Password hashes stored (never plain text)
- Audit logging enabled

✅ **API Security**
- CORS enabled (configure in production)
- Rate limiting (can be added)
- Request validation
- Error messages don't leak sensitive info

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Run on different port
python app.py --port 5001
```

### Database Connection Error

```bash
# Check PostgreSQL running
psql --version

# Test connection
psql -U postgres -d canconnect -c "SELECT 1;"

# Check credentials in .env
cat .env | grep DB_
```

### Token Invalid

- Token expires after 7 days
- User must login again
- Check token format: `Bearer {token}`

### CORS Error

- Check CORS_ORIGINS in .env
- In development: `CORS_ORIGINS=*`
- In production: Set to actual domain

---

## Performance Tips

- Use connection pooling (psycopg2 pool)
- Cache frequently accessed data
- Index database columns properly
- Compress API responses
- Use CDN for static files
- Monitor query performance

---

## Next Steps

1. ✅ REST API backend complete
2. ⏳ Integration with React web app
3. ⏳ Integration with React Native mobile
4. ⏳ Email/SMS notifications
5. ⏳ Advanced analytics dashboard

---

## Support

For issues:
1. Check error message in response
2. Review logs: `tail -f app.log`
3. Test endpoint with curl
4. Verify database connection
5. Check token validity

---

**Version**: 1.0  
**Status**: ✅ Production Ready  
**Last Updated**: December 9, 2025  

API Reference: See `API_DOCUMENTATION.md` for complete endpoint documentation.
