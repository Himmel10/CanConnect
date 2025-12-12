# Frontend → Backend Authentication Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     REACT FRONTEND (Port 8080)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Auth Page (src/pages/Auth.tsx)                                 │
│  ├─ Login Form                                                  │
│  └─ Signup Form                                                 │
│         ↓ User submits                                          │
│  Auth Service (src/lib/authService.ts)                         │
│  ├─ register() → POST /auth/register                           │
│  ├─ login() → POST /auth/login                                 │
│  ├─ logout() → POST /auth/logout                               │
│  ├─ verifyToken() → GET /auth/verify                          │
│  └─ updateProfile() → PUT /users/{id}                         │
│         ↓ API calls                                            │
│  Auth Context (src/lib/authContext.tsx)                       │
│  ├─ Global state (user, token, isAuth)                        │
│  └─ useAuth() hook for components                             │
│         ↓ State updates                                        │
│  Protected Routes (src/components/ProtectedRoute.tsx)         │
│  ├─ Check authentication                                       │
│  ├─ Check authorization (roles)                               │
│  └─ Redirect if unauthorized                                  │
│         ↓ Route guards                                         │
│  Dashboard & Service Pages                                    │
│  └─ All protected, display real user data                     │
│                                                                │
│  LocalStorage                                                 │
│  ├─ auth_token: JWT token (7-day expiry)                     │
│  ├─ auth_user: { id, email, name, role, ... }               │
│  └─ Persists across page refreshes                            │
│                                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↑ ↓
                         HTTP Requests
                         (CORS enabled)
                              ↑ ↓
┌─────────────────────────────────────────────────────────────────┐
│                   FLASK BACKEND (Port 5000)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Routes (backend/app.py)                                        │
│  ├─ POST /api/auth/register    → Create user                  │
│  ├─ POST /api/auth/login       → Generate JWT                 │
│  ├─ GET /api/auth/verify       → Validate token               │
│  ├─ POST /api/auth/logout      → Invalidate session            │
│  ├─ PUT /api/users/{id}        → Update profile               │
│  └─ POST /api/users/{id}/password → Change password          │
│         ↓                                                       │
│  Authentication Decorators                                    │
│  ├─ @token_required    → Verify JWT                          │
│  ├─ @admin_required    → Check admin role                    │
│  └─ @staff_or_admin_required → Check staff/admin role        │
│         ↓                                                       │
│  Business Logic                                               │
│  ├─ UserManager (user_management/manager.py)                 │
│  │  ├─ create_user(first_name, last_name, email, ...)       │
│  │  ├─ login(email, password) → returns JWT token            │
│  │  ├─ verify_token(token)    → returns user data            │
│  │  ├─ get_user_profile(user_id)                             │
│  │  ├─ update_user_profile(user_id, updates)                 │
│  │  └─ change_password(user_id, current, new)               │
│  │                                                             │
│  └─ Database (PostgreSQL)                                    │
│     ├─ users table (id, email, password_hash, role)         │
│     ├─ user_sessions table (token, expiry)                   │
│     ├─ user_preferences table (theme, language)             │
│     └─ staff_roles table (user_id, department)              │
│                                                                │
│  Security                                                     │
│  ├─ Bcrypt hashing (password_hash = bcrypt(password))       │
│  ├─ JWT tokens (exp: now + 7 days)                          │
│  ├─ Parameterized queries (SQL injection prevention)         │
│  ├─ CORS headers (allow origin: http://localhost:8080)      │
│  └─ Input validation (email, phone, password strength)      │
│                                                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1️⃣ Registration Flow

### Step-by-Step

```
User clicks "Sign Up" tab
      ↓
User fills form:
  - First Name: Juan
  - Last Name: Dela Cruz
  - Email: juan@example.com
  - Phone: +63 912 345 6789
  - Password: MyPassword123
  - Confirm: MyPassword123
      ↓
Form validation (React):
  ✓ All fields filled
  ✓ Password = Confirm Password
      ↓
authService.register(firstName, lastName, email, phone, password) called
      ↓
HTTP Request Sent:
  Method: POST
  URL: http://localhost:5000/api/auth/register
  Headers: Content-Type: application/json
  Body: {
    "first_name": "Juan",
    "last_name": "Dela Cruz",
    "email": "juan@example.com",
    "phone": "+63 912 345 6789",
    "password": "MyPassword123"
  }
      ↓
Backend receives request:
  - Validates input
  - Checks email not already used
  - Hashes password: password_hash = bcrypt("MyPassword123", salt_rounds=11)
  - Creates database record in users table
  - Returns success response
      ↓
Response received:
  Status: 200 OK
  Body: {
    "success": true,
    "message": "User created successfully",
    "user_id": "uuid-12345"
  }
      ↓
Frontend shows toast:
  "Account created successfully! Please login."
      ↓
Form clears, switches to Login tab automatically
```

### Database After Registration

```sql
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, created_at)
VALUES (
  'uuid-12345',
  'juan@example.com',
  '$2b$11$abcdef...xyz',  -- bcrypt hash
  'Juan',
  'Dela Cruz',
  '+63 912 345 6789',
  'citizen',
  NOW()
);
```

---

## 2️⃣ Login Flow

### Step-by-Step

```
User enters email: juan@example.com
User enters password: MyPassword123
User clicks "Login" button
      ↓
Form validation (React):
  ✓ Email field not empty
  ✓ Password field not empty
      ↓
authService.login(email, password) called
      ↓
HTTP Request Sent:
  Method: POST
  URL: http://localhost:5000/api/auth/login
  Headers: Content-Type: application/json
  Body: {
    "email": "juan@example.com",
    "password": "MyPassword123"
  }
      ↓
Backend receives request:
  1. Query database: SELECT * FROM users WHERE email = 'juan@example.com'
  2. Check user exists
  3. Verify password: bcrypt.verify("MyPassword123", password_hash)
  4. Generate JWT token:
     token = jwt.encode({
       "user_id": "uuid-12345",
       "email": "juan@example.com",
       "role": "citizen",
       "exp": now + 7 days
     }, secret_key)
  5. Store session (optional)
  6. Return token and user data
      ↓
Response received:
  Status: 200 OK
  Body: {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-12345",
      "email": "juan@example.com",
      "first_name": "Juan",
      "last_name": "Dela Cruz",
      "phone": "+63 912 345 6789",
      "role": "citizen",
      "created_at": "2025-12-09T10:30:00Z"
    }
  }
      ↓
Frontend processes response:
  1. Store token: localStorage.setItem("auth_token", token)
  2. Store user: localStorage.setItem("auth_user", JSON.stringify(user))
  3. Update Auth Context state
  4. Show toast: "Login successful!"
      ↓
useNavigate() redirects to /dashboard
      ↓
Dashboard component renders:
  - Displays user name: "Welcome, Juan!"
  - Shows user email
  - Displays profile menu with logout option
```

### LocalStorage After Login

```javascript
localStorage.getItem("auth_token")
// Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

localStorage.getItem("auth_user")
// Returns: {
//   "id": "uuid-12345",
//   "email": "juan@example.com",
//   "first_name": "Juan",
//   "last_name": "Dela Cruz",
//   "phone": "+63 912 345 6789",
//   "role": "citizen",
//   "created_at": "2025-12-09T10:30:00Z"
// }
```

---

## 3️⃣ Session Verification Flow

### On App Load (Automatic)

```
App.tsx mounts
      ↓
AuthProvider component initializes
      ↓
useEffect checks: authService.isAuthenticated()
      ↓
Token in localStorage? 
  YES ↓                                    NO ↓
      Get token from storage                Set isLoading = false
      Call verifyToken()                    Exit
          ↓
      HTTP Request Sent:
        Method: GET
        URL: http://localhost:5000/api/auth/verify
        Headers: Authorization: Bearer <token>
          ↓
      Backend receives request:
        1. Extract token from header
        2. Verify JWT signature
        3. Check token not expired
        4. Query user from database
        5. Return user data
          ↓
      Is token valid?
        YES ↓                              NO ↓
            Response 200                      Response 401
            User data returned                Error: "Invalid token"
                ↓                                ↓
            Auth state = authenticated      Clear localStorage
            useAuth() returns user          Auth state = not authenticated
                ↓
            User components render          Redirect to /auth
            with real data
```

### After Page Refresh

```
User is logged in, views /dashboard
User presses F5 (refresh)
      ↓
Page reloads, App.tsx mounts again
      ↓
AuthProvider checks localStorage:
  ✓ auth_token exists
  ✓ auth_user exists
      ↓
Calls /api/auth/verify with token
      ↓
Backend validates token (JWT signature + expiry)
      ↓
Token still valid? (< 7 days old)
  YES ↓
      Return user data
      Auth state = authenticated
      Dashboard re-renders with user info ✓
      
  NO ↓
      Clear token from localStorage
      Redirect to /auth
      User must log in again
```

---

## 4️⃣ Protected Route Access

### Accessing a Service Page

```
User tries: http://localhost:8080/services/business-permit
      ↓
App checks route: /services/business-permit
      ↓
Route is wrapped with: <ProtectedRoute><BusinessPermit /></ProtectedRoute>
      ↓
ProtectedRoute component checks:
  1. useAuth().isAuthenticated?
  2. useAuth().isLoading?
      ↓
Is user authenticated?
  YES ↓                              NO ↓
      Is component loading?          Redirect to /auth
      YES ↓        NO ↓              <Navigate to="/auth" />
          Show spinner  Render component
                        ✓ BusinessPermit
                        ✓ Display real user data
                        ✓ Can submit forms
                        
Admin-only routes also check role:
  requiredRole="admin"? → isAdmin === true?
    YES ✓ Allowed                NO ✗ Redirect to /dashboard
```

---

## 5️⃣ Making Authenticated API Calls

### Example: Update Profile

```tsx
// In any React component:
const { user, updateProfile } = useAuth();

async function handleProfileUpdate(address, barangay) {
  const result = await updateProfile({ address, barangay });
  
  if (result.success) {
    toast.success("Profile updated!");
  }
}
```

### What Happens Behind the Scenes

```
updateProfile() called
      ↓
authService.updateProfile({address, barangay}) called
      ↓
HTTP Request Sent:
  Method: PUT
  URL: http://localhost:5000/api/users/uuid-12345
  Headers: {
    Content-Type: application/json,
    Authorization: "Bearer eyJhbGciOiJIUzI1NiI..."
  }
  Body: {
    "address": "123 Main St, Cantilan",
    "barangay": "Poblacion"
  }
      ↓
Backend receives request:
  1. Extract token from Authorization header
  2. Verify token (is it valid?)
  3. Get user_id from token
  4. Check user has permission (token user = target user)
  5. Validate input (address, barangay)
  6. Update database:
     UPDATE users SET address = '123 Main St', barangay = 'Poblacion'
     WHERE id = 'uuid-12345'
  7. Return updated user
      ↓
Response:
  Status: 200 OK
  Body: {
    "success": true,
    "user": {
      "id": "uuid-12345",
      "email": "juan@example.com",
      "first_name": "Juan",
      "address": "123 Main St, Cantilan",
      "barangay": "Poblacion",
      ...
    }
  }
      ↓
Frontend:
  1. Update Auth Context with new user data
  2. Save to localStorage
  3. Components re-render with new data
  4. Show success toast
```

---

## 6️⃣ Logout Flow

### Step-by-Step

```
User clicks "Log Out" in dropdown menu
      ↓
handleLogout() triggered
      ↓
logout() method called
      ↓
HTTP Request Sent (optional, for cleanup):
  Method: POST
  URL: http://localhost:5000/api/auth/logout
  Headers: Authorization: Bearer <token>
      ↓
Backend receives (optional):
  - Marks session as invalid
  - Clears any session records
  - Logs logout event
      ↓
Frontend:
  1. Clear auth_token from localStorage
  2. Clear auth_user from localStorage
  3. Clear Auth Context state
  4. Navigate to home page
      ↓
Result:
  - User is logged out ✓
  - No valid token available ✓
  - Protected routes redirect to /auth ✓
  - Dashboard shows "Please log in" ✓
```

---

## 📊 Request/Response Examples

### Registration Request

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "first_name": "Juan",
  "last_name": "Dela Cruz",
  "email": "juan@example.com",
  "phone": "+63 912 345 6789",
  "password": "MyPassword123"
}

HTTP/1.1 200 OK
{
  "success": true,
  "message": "User created successfully",
  "user_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Login Request

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "MyPassword123"
}

HTTP/1.1 200 OK
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIiwicm9sZSI6ImNpdGl6ZW4iLCJleHAiOjE3NjMyMTA2MDB9.abc123...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "juan@example.com",
    "first_name": "Juan",
    "last_name": "Dela Cruz",
    "phone": "+63 912 345 6789",
    "role": "citizen",
    "created_at": "2025-12-09T10:30:00Z"
  }
}
```

### Verify Token Request

```http
GET http://localhost:5000/api/auth/verify
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

HTTP/1.1 200 OK
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "juan@example.com",
    "first_name": "Juan",
    "last_name": "Dela Cruz",
    "phone": "+63 912 345 6789",
    "role": "citizen",
    "created_at": "2025-12-09T10:30:00Z"
  }
}
```

### Error Response Example

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "WrongPassword"
}

HTTP/1.1 401 Unauthorized
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## 🔑 How Tokens Work

### JWT Token Structure

```
Header . Payload . Signature

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.
eyJ1c2VyX2lkIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIiwicm9sZSI6ImNpdGl6ZW4iLCJleHAiOjE3NjMyMTA2MDB9
.
H7P0K9K3Y4R5v8J2W6X9Q2L4N7D1M3P5
```

### Header
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### Payload (User Data)
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "juan@example.com",
  "role": "citizen",
  "exp": 1763210600  // Expires in 7 days
}
```

### How It's Used

```
1. Login → Backend creates token
2. Token sent to frontend
3. Frontend stores in localStorage
4. Every request includes: Authorization: Bearer <token>
5. Backend verifies signature matches
6. Backend checks expiry time
7. If valid: Process request
8. If invalid: Return 401 Unauthorized
```

### Token Expiry

```javascript
// Encoded in token:
exp: 1763210600  // Unix timestamp for 7 days from now

// Backend checks:
if (current_time > token.exp) {
  // Token expired
  return 401 Unauthorized
}

// Frontend behavior:
// After 7 days, next request fails with 401
// Frontend clears token and redirects to login
// User must login again to get new token
```

---

## 🛡️ Security Measures

### Password Security
```
Plain password: "MyPassword123"
      ↓ (Backend only, never sent to frontend)
Bcrypt hashing with 11 salt rounds
      ↓
Stored hash: "$2b$11$abcdef..."
      ↓
Later: bcrypt.verify("MyPassword123", stored_hash) → true/false
```

### Token Security
```
Created with: jwt.encode(payload, secret_key, algorithm="HS256")
      ↓
Token: "eyJh..." (valid for 7 days)
      ↓
Every API call: Authorization: Bearer eyJh...
      ↓
Backend verifies: jwt.decode(token, secret_key) → payload
      ↓
If signature invalid: jwt.exceptions.InvalidTokenError
If expired: jwt.exceptions.ExpiredSignatureError
```

### Data Protection
```
All API calls via HTTP/HTTPS
      ↓
CORS headers ensure only frontend domain allowed
      ↓
Token in Authorization header (not in URL)
      ↓
Passwords never logged or returned
      ↓
Error messages don't leak sensitive info
```

---

## ✅ Verification Checklist

To verify everything is connected:

- [ ] Flask backend running on http://localhost:5000
- [ ] React app running on http://localhost:8080
- [ ] `.env.local` has `VITE_API_URL=http://localhost:5000/api`
- [ ] Can register new user
- [ ] Can login with registered email/password
- [ ] Dashboard shows logged-in user's name
- [ ] Page refresh preserves login session
- [ ] Logout clears session
- [ ] Protected routes redirect to /auth when not logged in
- [ ] Browser DevTools shows auth_token in LocalStorage after login
- [ ] Network tab shows POST /api/auth/login request

All 10 points checked ✅ = System is working correctly!

---

**Your authentication system is fully functional!** 🎉
