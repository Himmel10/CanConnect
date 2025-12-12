# ✅ Setup Complete! Here's How to Start Your App

## ✅ What's Done

- ✅ Installed all Python dependencies (Flask, psycopg2, bcrypt, JWT, etc.)
- ✅ Created `.env.local` for React frontend
- ✅ Created `.env` for Flask backend
- ✅ Created `start_backend.bat` for easy startup

## 🚀 Starting Your App (3 Simple Steps)

### Option 1: Quick Start (Easiest)

**Step 1: Double-click this file**
```
C:\Users\Admin\Desktop\CanConnect\start_backend.bat
```

This opens a terminal and starts your backend at `http://localhost:5000`

**Step 2: In another terminal, start frontend**
```bash
cd C:\Users\Admin\Desktop\CanConnect
npm run dev
```

**Step 3: Open browser**
```
http://localhost:8080
```

Done! ✅

---

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd C:\Users\Admin\Desktop\CanConnect
.venv\Scripts\activate.bat
cd backend
python app.py
```

Expected output:
```
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

**Terminal 2 - Frontend:**
```bash
cd C:\Users\Admin\Desktop\CanConnect
npm run dev
```

Expected output:
```
Local: http://localhost:8080
```

---

## ⚠️ Important: PostgreSQL Database

Before testing login, you MUST have PostgreSQL running:

### Check if PostgreSQL is Running
```bash
psql -U postgres -h localhost -c "SELECT 1;"
```

If you see an error, PostgreSQL is not running. See below.

### Install/Start PostgreSQL

**Option A: Already have PostgreSQL installed?**
```bash
# Windows - Start PostgreSQL service
net start postgresql-x64-16  (or your version number)

# Or use pgAdmin to verify it's running
```

**Option B: Use Docker (Easiest)**
```bash
docker run --name canconnect-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=canconnect -p 5432:5432 -d postgres
```

**Option C: Download & Install**
https://www.postgresql.org/download/windows/

---

## 🧪 Test Everything Works

### 1. Backend is Running
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"message": "API is healthy"}
```

### 2. Frontend is Running
Visit: http://localhost:8080

Should see login page ✅

### 3. Database is Connected
Check backend terminal for any error messages

Should NOT see:
```
psycopg2.OperationalError: could not connect to server
```

---

## 🎯 Test Registration & Login

1. Go to http://localhost:8080
2. Click "Get Started"
3. Sign up with:
   - First: Juan
   - Last: Dela Cruz
   - Email: test@example.com
   - Phone: +63 912 345 6789
   - Password: Test123!

4. Click "Create Account"
   - ✅ Should see: "Account created successfully!"
5. Login with same credentials
   - ✅ Should redirect to dashboard!

---

## 🛠️ Files Created

- ✅ `C:\Users\Admin\Desktop\CanConnect\.env.local` - Frontend config
- ✅ `C:\Users\Admin\Desktop\CanConnect\backend\.env` - Backend config
- ✅ `C:\Users\Admin\Desktop\CanConnect\start_backend.bat` - Quick start script
- ✅ `C:\Users\Admin\Desktop\CanConnect\backend\requirements.txt` - Updated with correct versions

---

## 📋 Checklist Before Testing

- [ ] PostgreSQL is running (test: `psql -U postgres`)
- [ ] Backend dependencies installed (pip install complete)
- [ ] `.env` file exists in backend folder
- [ ] `.env.local` file exists in CanConnect folder
- [ ] `VITE_API_URL=http://localhost:5000/api` in `.env.local`
- [ ] `DB_HOST=localhost` in backend `.env`

---

## 🚀 Full Command Reference

```bash
# Setup (one time only)
cd C:\Users\Admin\Desktop\CanConnect
.venv\Scripts\activate.bat
pip install -r backend\requirements.txt

# Start Backend
start_backend.bat
# OR manually:
# .venv\Scripts\activate.bat
# cd backend
# python app.py

# Start Frontend (new terminal)
npm run dev

# Test Backend
curl http://localhost:5000/api/health

# Visit App
# http://localhost:8080
```

---

## 🐛 If You Get Errors

### Error: "Module not found: flask"
```bash
# Make sure you activated venv:
.venv\Scripts\activate.bat
# Then reinstall:
pip install -r backend\requirements.txt
```

### Error: "Connection refused" on login
```bash
# Check backend is running:
curl http://localhost:5000/api/health

# If it fails, start backend:
start_backend.bat
```

### Error: "Cannot connect to PostgreSQL"
```bash
# Start PostgreSQL (if installed):
net start postgresql-x64-16

# Or use Docker:
docker run --name canconnect-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=canconnect -p 5432:5432 -d postgres

# Test connection:
psql -U postgres -h localhost
```

### Error: "Failed to fetch" in browser
```bash
# Check:
1. Is backend running? (check terminal)
2. Is it on port 5000? (check terminal output)
3. Is .env.local correct? (cat .env.local)
4. Check browser console (F12) for actual error
```

---

## ✨ Summary

You now have:
- ✅ Complete authentication system
- ✅ Real database integration
- ✅ Working Flask REST API
- ✅ Secure JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Protected React routes

**Just follow the 3 steps above to start!** 🎉

---

## 📞 Quick Links

- Frontend code: `C:\Users\Admin\Desktop\CanConnect\src\pages\Auth.tsx`
- Backend code: `C:\Users\Admin\Desktop\CanConnect\backend\app.py`
- Backend API docs: `C:\Users\Admin\Desktop\CanConnect\backend\API_DOCUMENTATION.md`
- Setup guide: `C:\Users\Admin\Desktop\CanConnect\SETUP_FIX_FAILED_TO_FETCH.md`

**Status**: ✅ Ready to run!
