# 🏗️ Hybrid Architecture: Local Storage + Analytics

## 📋 Overview

**Strategy**: Store user data locally (AsyncStorage) until registration, while tracking anonymous sessions for analytics.

**Benefits**:
- ✅ **Privacy-first**: Minimal data collection
- ✅ **Fast**: No database latency during gameplay
- ✅ **Offline**: Works without internet
- ✅ **Analytics**: Track user behavior and conversion
- ✅ **Simple**: No RLS complexity for anonymous users

---

## 🗂️ Data Flow

### 1️⃣ Anonymous User (No Account)

```
┌─────────────┐
│ User Opens  │
│    App      │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│  Session Tracking (DB)      │
│  • Device ID                │
│  • Last active              │
│  • Session count            │
└─────────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  User Data (AsyncStorage)   │
│  • XP, Level                │
│  • Lives, Streak            │
│  • Progress, Badges         │
│  • Everything local!        │
└─────────────────────────────┘
```

**Where data lives**:
- ✅ **AsyncStorage**: XP, Level, Lives, Streak, Progress, Badges
- ✅ **Supabase**: Device ID, Session count, Last active (analytics only)

---

### 2️⃣ Registration / Login

```
┌─────────────────┐
│  User Registers │
│   or Logs In    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  1. Create Auth User        │
│     (Supabase Auth)         │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  2. Track Conversion        │
│     (anonymous_sessions)    │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  3. Migrate Local Data      │
│     AsyncStorage → DB       │
│     • Read from Zustand     │
│     • Write to users table  │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  4. Clear AsyncStorage      │
│     (Optional)              │
└─────────────────────────────┘
```

**Migration includes**:
- Total XP → `users.total_xp`
- Current Level → `users.current_level`
- Lives → `users.current_lives`
- Streak → `users.streak_count`
- Progress records → `user_progress` table

---

### 3️⃣ Authenticated User

```
┌─────────────────┐
│ Authenticated   │
│     User        │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  All Data in Supabase       │
│  • XP, Level, Lives         │
│  • Progress, Badges         │
│  • Synced across devices    │
│  • Backed up securely       │
└─────────────────────────────┘
```

---

## 📊 Database Tables

### `anonymous_sessions` (Analytics Only)

```sql
id              UUID
device_id       TEXT (unique)
first_opened_at TIMESTAMPTZ
last_active_at  TIMESTAMPTZ
session_count   INTEGER
created_account BOOLEAN
user_id         UUID (null until registration)
device_info     JSONB
```

**Purpose**: 
- Track how many people use the app
- Measure conversion rate (anonymous → registered)
- Understand retention (session count)

**RLS**: Public read/write (minimal security needed)

---

### `users` (Full User Data)

Only created when user registers/logs in.

```sql
id              UUID
email           TEXT
username        TEXT
is_anonymous    BOOLEAN (always false)
total_xp        INTEGER
current_level   INTEGER
current_lives   INTEGER
streak_count    INTEGER
...
```

**RLS**: User can only access their own data

---

## 📱 Implementation

### Core Files

```
src/
├── lib/
│   ├── analytics/
│   │   └── sessionTracker.ts    # Track sessions & conversions
│   ├── utils/
│   │   └── dataMigration.ts     # Migrate local → DB
│   └── supabase/
│       ├── client.ts            # Supabase client
│       └── auth.ts              # Auth service
├── hooks/
│   └── useAuth.ts               # Auth hook (simplified)
└── store/
    └── index.ts                 # Zustand store (persisted)

supabase/
└── migrations/
    └── 003_anonymous_sessions.sql
```

---

## 🔐 Security & Privacy

### What We Track (Anonymous Users)

✅ **Device ID**: Random UUID generated on first use
✅ **Session count**: How many times app was opened
✅ **Last active**: When user last used the app
✅ **Device info**: OS, version (non-personal)

### What We DON'T Track

❌ No personal information
❌ No game progress (stays local)
❌ No XP/levels (stays local)
❌ No IP addresses
❌ No location data

### KVKK/GDPR Compliance

✅ Minimal data collection
✅ Anonymous by default
✅ User data stored locally
✅ No tracking without consent
✅ Easy to delete (clear app data)

---

## 📈 Analytics Queries

### Total Users

```sql
SELECT COUNT(DISTINCT device_id) FROM anonymous_sessions;
```

### Active Users (Last 7 Days)

```sql
SELECT COUNT(*) FROM anonymous_sessions 
WHERE last_active_at > NOW() - INTERVAL '7 days';
```

### Conversion Rate

```sql
SELECT 
  COUNT(*) FILTER (WHERE created_account = true)::FLOAT / COUNT(*) * 100
FROM anonymous_sessions;
```

### Retention

```sql
SELECT 
  AVG(session_count) as avg_sessions,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY session_count) as median_sessions
FROM anonymous_sessions;
```

---

## 🚀 Benefits of This Approach

### For Users

✅ **Privacy**: Data stays on device
✅ **Fast**: No network latency
✅ **Offline**: Play without internet
✅ **Simple**: No forced registration

### For Developers

✅ **Analytics**: Understand user behavior
✅ **Conversion tracking**: Measure success
✅ **Simple RLS**: Only 1 table for anonymous users
✅ **Scalable**: Database only for active users

### For Business

✅ **Lower costs**: Less database usage
✅ **Better UX**: Faster gameplay
✅ **Higher conversion**: No friction to start
✅ **Data-driven**: Track what matters

---

## 🔄 Migration Testing

### Test Scenario 1: New User

1. Open app (first time)
2. **Check**: `anonymous_sessions` has 1 row with `session_count = 1`
3. Play game, earn XP
4. **Check**: XP stored in AsyncStorage (not DB)
5. Close and reopen app
6. **Check**: `session_count = 2`, XP persisted locally

### Test Scenario 2: Registration

1. Open app as anonymous user (100 XP, Level 2)
2. Register with email
3. **Check**: `anonymous_sessions` has `created_account = true`
4. **Check**: `users` table has new user with `total_xp = 100`
5. **Check**: AsyncStorage cleared (optional)

### Test Scenario 3: Returning User

1. Register and log out
2. Reopen app as anonymous
3. Play game (local storage)
4. Log back in
5. **Check**: Database data loads, local data discarded

---

## 📞 Support

If you encounter issues:

1. Check console logs (`console.log` statements)
2. Verify Supabase connection
3. Check `anonymous_sessions` table in dashboard
4. Review RLS policies

---

## 🎯 Next Steps

1. ✅ Run migration: `003_anonymous_sessions.sql`
2. ✅ Test session tracking
3. ✅ Test registration and migration
4. ✅ Verify analytics queries
5. 🚀 Deploy to production

