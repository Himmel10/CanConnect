# 🚀 Complete Setup Guide - Fix "Failed to Fetch" Error

## The Problem
Your React app is trying to connect to the backend API, but:
1. ❌ `.env.local` file was missing (now created)
2. ❌ Backend is likely not running
3. ❌ Database might not be configured

## Solution: 4-Step Setup

---

## Step 1: Setup PostgreSQL Database ✅

### Option A: Already Have PostgreSQL Running?
```bash
# Test connection
psql -U postgres -h localhost
# If this works, skip to Step 2
```

### Option B: Install PostgreSQL
Download from: https://www.postgresql.org/download/windows/

Then run:
```bash
# Create database
psql -U postgres -c "CREATE DATABASE canconnect;"
psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'password';"
```

### Option C: Use Docker (Easiest)
```bash
docker run --name canconnect-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=canconnect -p 5432:5432 -d postgres
```

---

## Step 2: Create Database Tables

Run this in PowerShell:

```bash
cd c:\Users\Admin\Desktop\CanConnect\streamlit_app

# Check if database_schema.sql exists
ls database_schema.sql

# Run it (requires psql to be installed and in PATH)
psql -U postgres -d canconnect -f database_schema.sql
```

**If you don't have psql in PATH**, download the schema file content and run it manually in pgAdmin or DBeaver.

---

## Step 3: Install Backend Dependencies

```bash
cd c:\Users\Admin\Desktop\CanConnect\backend

# Install required packages
pip install -r requirements.txt

# Expected output:
# Successfully installed flask==2.3.2
# Successfully installed flask-cors==4.0.0
# Successfully installed psycopg2-binary==2.9.6
# Successfully installed bcrypt==4.0.1
# etc.
```

---

## Step 4: Start the Backend

Open a **NEW PowerShell terminal** and run:

```bash
cd c:\Users\Admin\Desktop\CanConnect\backend
python app.py
```

**Expected output**:
```
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

If you see this, ✅ **Backend is working!**

---

## Step 5: Test Backend Connection

Open another PowerShell and test:

```bash
# Test health endpoint
curl http://localhost:5000/api/health
```

**Should return**:
```json
{"message": "API is healthy"}
```

If you get this, ✅ **Backend is accessible!**

---

## Step 6: Frontend Already Configured

Your React app now has:
- ✅ `.env.local` created with `VITE_API_URL=http://localhost:5000/api`
- ✅ Auth service set up to call backend
- ✅ Protected routes configured

Just make sure you're running:
```bash
npm run dev
```

---

## Complete Checklist

Before testing login, verify ALL of these:

- [ ] PostgreSQL running (test: `psql -U postgres`)
- [ ] Database created: `canconnect`
- [ ] Tables created (from `database_schema.sql`)
- [ ] Backend dependencies installed: `pip install -r requirements.txt`
- [ ] Backend running: `python app.py` (should see "Running on http://...")
- [ ] Backend accessible: `curl http://localhost:5000/api/health` (returns JSON)
- [ ] Frontend running: `npm run dev` (should see Vite dev server)
- [ ] `.env.local` exists with `VITE_API_URL=http://localhost:5000/api`

---

## Testing Login

Once everything above is checked:

1. Go to http://localhost:8080
2. Click "Get Started"
3. Sign Up with:
   - First: Juan
   - Last: Dela Cruz
   - Email: test@example.com
   - Phone: +63 912 345 6789
   - Password: Test123!

4. Click "Create Account"
   - ✅ Should see: "Account created successfully!"

5. Login with:
   - Email: test@example.com
   - Password: Test123!

6. ✅ Should redirect to dashboard showing your name!

---

## If Still Getting "Failed to Fetch"

### Check 1: Is Backend Running?
```bash
# In PowerShell, check process
Get-Process python | Where-Object {$_.Handles -gt 0}

# Or test manually
curl http://localhost:5000/api/health
```

### Check 2: Check Browser Console
Press `F12` in browser, look at:
- **Console tab**: Any JavaScript errors?
- **Network tab**: What's the error response?
  - 404? Backend route not found
  - 500? Backend error
  - "Network error"? Backend not running

### Check 3: Check Backend Logs
Look at the terminal where you ran `python app.py`
- Are there any error messages?
- Did it crash?

### Check 4: Check .env.local
```bash
cat c:\Users\Admin\Desktop\CanConnect\.env.local
```
Should show:
```
VITE_API_URL=http://localhost:5000/api
```

### Check 5: Verify Database
```bash
# Test connection
psql -U postgres -d canconnect -c "SELECT * FROM users LIMIT 1;"
```

---

## Quick Command Summary

```bash
# Terminal 1: Backend
cd c:\Users\Admin\Desktop\CanConnect\backend
python app.py

# Terminal 2: Frontend
cd c:\Users\Admin\Desktop\CanConnect
npm run dev

# Terminal 3: Test
curl http://localhost:5000/api/health
```

---

## Environment Files Created

✅ `c:\Users\Admin\Desktop\CanConnect\.env.local`
```
VITE_API_URL=http://localhost:5000/api
```

✅ `c:\Users\Admin\Desktop\CanConnect\backend\.env`
```
FLASK_ENV=development
DB_HOST=localhost
DB_NAME=canconnect
DB_USER=postgres
DB_PASS=password
JWT_SECRET_KEY=canconnect-secret-key-development-change-in-production
```

---

## Common Issues & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Cannot GET /api/health" | Backend not running | Run `python app.py` |
| "Connection refused" | Backend not on port 5000 | Check `FLASK_RUN_PORT` in `.env` |
| "CORS error" | Frontend URL not whitelisted | `.env` has `CORS_ORIGINS=*` |
| "Connection refused (database)" | PostgreSQL not running | Start PostgreSQL service |
| "Failed to fetch" after 60s | Backend crashed | Check backend console for errors |

---

## Next Steps

1. **Set up PostgreSQL** (if not already done)
2. **Create database tables** from `database_schema.sql`
3. **Install backend dependencies** with pip
4. **Start backend** with `python app.py`
5. **Start frontend** with `npm run dev`
6. **Test login** with test credentials

That's it! Your authentication should now work! 🎉

---

**Status**: Configuration files created ✅
**Next**: Follow the 6 steps above to get everything running
