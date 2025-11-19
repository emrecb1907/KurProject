# 🚀 Supabase Migration Guide

## How to Apply Migrations

### Method 1: Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `lckjdjbhemjeimtjviwm`
3. Click **SQL Editor** in the left sidebar
4. Click **+ New Query**
5. Copy the contents of the migration file
6. Paste into the SQL editor
7. Click **Run** (or press `Ctrl + Enter`)
8. Check for success message ✅

### Method 2: Supabase CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to project
supabase link --project-ref lckjdjbhemjeimtjviwm

# Apply migrations
supabase db push
```

---

## 📋 Migration Files

### 003_anonymous_sessions.sql

**Purpose**: Create `anonymous_sessions` table for analytics tracking

**What it does**:
- ✅ Creates table for tracking anonymous users
- ✅ Adds indexes for performance
- ✅ Sets up RLS policies (public read/write)
- ✅ Creates triggers for auto-incrementing session count
- ✅ Creates analytics view for dashboard

**When to run**: Right now! This is needed for the app to track sessions.

**SQL File**: `supabase/migrations/003_anonymous_sessions.sql`

**To apply**:
1. Open Supabase Dashboard > SQL Editor
2. Copy contents from `003_anonymous_sessions.sql`
3. Paste and run
4. Verify: Check **Table Editor** for `anonymous_sessions` table

---

## ✅ Verify Migration

After running the migration, verify it worked:

### 1. Check Table Exists

```sql
SELECT * FROM anonymous_sessions LIMIT 5;
```

Expected: Empty table (no errors)

### 2. Check RLS Policies

```sql
SELECT * FROM pg_policies WHERE tablename = 'anonymous_sessions';
```

Expected: 3 policies (insert, update, select)

### 3. Check Analytics View

```sql
SELECT * FROM anonymous_analytics;
```

Expected: 
```json
{
  "total_devices": 0,
  "active_today": 0,
  "active_week": 0,
  "active_month": 0,
  "converted_users": 0,
  "conversion_rate": null
}
```

---

## 🔧 Troubleshooting

### Error: "table already exists"

**Solution**: Table was already created. Skip this migration or drop and recreate:

```sql
DROP TABLE IF EXISTS anonymous_sessions CASCADE;
-- Then re-run migration
```

### Error: "permission denied"

**Solution**: Make sure you're running as the project owner or have admin privileges.

### Error: "function already exists"

**Solution**: Drop and recreate:

```sql
DROP FUNCTION IF EXISTS update_anonymous_sessions_updated_at() CASCADE;
DROP FUNCTION IF EXISTS increment_session_count() CASCADE;
-- Then re-run migration
```

---

## 📊 Testing After Migration

After applying the migration, test in the app:

1. **Clear app data**: Press "Tüm Verileri Sil" button in the app
2. **Reload app**: Close and reopen
3. **Check console**: Should see `✅ Session tracked - Count: 1`
4. **Check database**: Go to Table Editor > `anonymous_sessions`
5. **Verify**: You should see 1 row with your device_id

---

## 🎯 Next Steps

After migration is successful:

1. ✅ Test anonymous session tracking
2. ✅ Test user registration and conversion tracking
3. ✅ Check analytics dashboard queries
4. 🚀 Deploy to production!

---

## 📞 Need Help?

- Check Supabase docs: https://supabase.com/docs/guides/database
- Check logs: Supabase Dashboard > Logs
- Verify RLS: Supabase Dashboard > Authentication > Policies
