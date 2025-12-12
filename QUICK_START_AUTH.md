# ⚡ QUICK START - 5 Minutes

## 1️⃣ Start Backend
```bash
cd backend
python app.py
```
✓ You should see: `Running on http://127.0.0.1:5000`

## 2️⃣ Setup Frontend
```bash
cd CanConnect
cp .env.example .env.local
npm run dev
```
✓ App opens at http://localhost:8080

## 3️⃣ Test Registration
1. Click "Get Started" button
2. Go to "Sign Up" tab
3. Fill in test data:
   - First: Juan
   - Last: Dela Cruz
   - Email: juan@test.com
   - Phone: +63 912 345 6789
   - Password: Test123!
   - Confirm: Test123!
4. Click "Create Account"

✓ **Success**: See "Account created successfully!"

## 4️⃣ Test Login
1. Click "Login" tab
2. Enter: juan@test.com / Test123!
3. Click "Login"

✓ **Success**: Redirected to dashboard showing your name!

---

## 🎯 What You Just Did

- ✅ Registered a real user in PostgreSQL database
- ✅ Password was securely hashed with bcrypt
- ✅ Backend created JWT token for your session
- ✅ Token stored in browser (localStorage)
- ✅ Logged in securely with email/password
- ✅ Protected routes now accessible
- ✅ User data displayed in real-time

---

## 🧪 More Tests (Optional)

### Test Session Persistence
1. After login, refresh page (F5)
2. **Expected**: Still logged in, dashboard visible ✓

### Test Protected Routes
1. Click "Log Out"
2. Try: http://localhost:8080/services/business-permit
3. **Expected**: Redirected to login ✓
4. Login again
5. **Expected**: Now can access service ✓

### Check Admin Role
1. Create a second user with admin role (requires database update)
2. Login as admin
3. See "Admin Dashboard" link in user menu ✓

---

## 🔐 Behind the Scenes

```
Registration:
Email + Password → Backend → bcrypt hash → PostgreSQL → Success!

Login:
Email + Password → Backend → Hash verification → JWT created → localStorage

Session:
Token in localStorage → Every request includes it → Backend verifies → Access granted

Logout:
Click logout → Clear token from localStorage → Redirect to home
```

---

## 📁 Key Files

| File | What It Does |
|------|--------------|
| `src/lib/authService.ts` | Talks to backend API |
| `src/lib/authContext.tsx` | Manages auth state |
| `src/components/ProtectedRoute.tsx` | Protects routes |
| `src/pages/Auth.tsx` | Login/signup forms |
| `backend/app.py` | Flask API server |

---

## ⚠️ If Something Doesn't Work

| Issue | Fix |
|-------|-----|
| Can't connect to API | Is Flask running? (python backend/app.py) |
| Login fails | Check email exists, correct password |
| Still on auth page after login | Check browser console for errors |
| Session lost after refresh | Check .env.local has correct API URL |

---

## 🎉 That's It!

Your authentication is **fully working**. You now have:

✅ Real user registration
✅ Real secure login
✅ Real session management
✅ Real protected routes
✅ Real user data from database

**Total setup time: ~5 minutes** ⏱️

---

## 📚 Want to Learn More?

- `REAL_AUTHENTICATION_SETUP.md` - Complete guide
- `FRONTEND_BACKEND_CONNECTION.md` - Architecture & diagrams
- `backend/API_DOCUMENTATION.md` - API endpoints

---

**Status**: ✅ READY TO USE
