# ✅ Setup Checklist - Hybrid Architecture

## 🎯 Quick Start Guide

Follow these steps to enable the new hybrid architecture (local storage + analytics).

---

## Step 1: Run Supabase Migration

### Option A: Supabase Dashboard (Easiest)

1. Go to https://supabase.com/dashboard/project/lckjdjbhemjeimtjviwm
2. Click **SQL Editor** in sidebar
3. Click **+ New Query**
4. Open file: `KurProject/supabase/migrations/003_anonymous_sessions.sql`
5. Copy all contents
6. Paste into SQL Editor
7. Click **Run** (or press `Ctrl + Enter`)
8. ✅ Check for success message

### Verify Migration

Run this query in SQL Editor:

```sql
SELECT * FROM anonymous_sessions LIMIT 5;
```

**Expected**: Empty table (no errors)

---

## Step 2: Test in App

### 1. Clear Existing Data

In the app:
- Go to **Profile** tab
- Scroll down to developer tools
- Press **"🗑️ Tüm Verileri Sil"**
- Press **"Tamam"**

### 2. Reload App

- Close and reopen the app (or press `r` in Metro)

### 3. Check Console Logs

You should see:

```
✅ Supabase client initialized
📡 URL: https://lckjdjbhemjeimtjviwm.supabase.co
🔄 Initializing auth...
📊 Tracking session for device: ios_1763502...
📋 Session: No session
👤 Anonymous user - using local storage only
✅ Session tracked - Count: 1
✅ Auth initialization complete
```

**Important**: No more RLS errors! 🎉

### 4. Check Supabase Database

- Go to **Table Editor** > `anonymous_sessions`
- You should see **1 row** with:
  - `device_id`: Your device ID
  - `session_count`: 1
  - `created_account`: false
  - `last_active_at`: Current timestamp

---

## Step 3: Test Session Tracking

1. **Close app completely**
2. **Reopen app**
3. **Check console**: Should see `✅ Session tracked - Count: 2`
4. **Check database**: `session_count` should be `2`

✅ **Success!** Session tracking is working.

---

## Step 4: Test Registration & Migration

### 1. Play as Anonymous User

- Open app
- Press **"+100 XP Ekle"** button a few times
- Note your XP (e.g., 300 XP, Level 3)

### 2. Register

- Go to **Profile** tab
- Press **"Giriş Yap / Kayıt Ol"**
- Press **"Kayıt Ol"**
- Fill in:
  - Username: `testuser`
  - Email: `test@example.com`
  - Password: `test123456`
  - Confirm Password: `test123456`
- Press **"Kayıt Ol"**

### 3. Check Logs

Should see:

```
✅ SignUp Success! User: xxxxx
🎯 Tracking conversion for device: ios_1763502...
✅ Conversion tracked successfully
🔄 Starting data migration for user: xxxxx
📦 Migrating local data: { totalXP: 300, currentLives: 5, ... }
✅ Data migration successful!
```

### 4. Verify Database

**Table: `anonymous_sessions`**
- `created_account`: **true** ✅
- `user_id`: Your new user ID ✅

**Table: `users`**
- New row with your email ✅
- `total_xp`: 300 ✅
- `current_level`: 3 ✅

✅ **Success!** Registration and migration working.

---

## Step 5: Test Login

1. **Sign out** (Profile > developer tools)
2. **Close and reopen app**
3. **Login** with same credentials
4. **Check**: Your XP/Level should be loaded from database

✅ **Success!** Login and data sync working.

---

## 🐛 Troubleshooting

### Issue: "table does not exist"

**Solution**: Run the migration again (Step 1)

### Issue: Still seeing RLS errors

**Solution**: Make sure you ran the migration successfully. Check Supabase Dashboard > Table Editor for `anonymous_sessions` table.

### Issue: Session not tracking

**Check**:
1. Supabase URL in `.env` file
2. Internet connection
3. Console logs for error messages

### Issue: Data not migrating

**Check**:
1. Console logs for migration errors
2. User exists in `users` table
3. User has permission to write

---

## 📊 Analytics Dashboard

View your analytics:

```sql
-- Total unique devices
SELECT COUNT(DISTINCT device_id) FROM anonymous_sessions;

-- Active users (last 7 days)
SELECT COUNT(*) FROM anonymous_sessions 
WHERE last_active_at > NOW() - INTERVAL '7 days';

-- Conversion rate
SELECT 
  COUNT(*) FILTER (WHERE created_account = true)::FLOAT / COUNT(*) * 100 as conversion_rate
FROM anonymous_sessions;

-- Average session count
SELECT AVG(session_count) FROM anonymous_sessions;
```

---

## 🎉 You're Done!

Your app now has:

✅ **Anonymous user support** (local storage)
✅ **Session tracking** (analytics)
✅ **Registration & migration** (seamless upgrade)
✅ **Privacy-first** (minimal data collection)

Next steps:
- Implement game mechanics
- Add lesson content
- Build leaderboard
- Add badges & achievements

🚀 Happy coding!

