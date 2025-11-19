# Supabase Setup Guide

Bu rehber QuranLearn uygulaması için Supabase veritabanını kurmayı anlatır.

## 📋 Gereksinimler

- Supabase hesabı (https://supabase.com)
- Supabase CLI (opsiyonel, local development için)

## 🚀 Adımlar

### 1. Supabase Projesi Oluşturma

1. https://app.supabase.com adresine gidin
2. "New Project" butonuna tıklayın
3. Proje bilgilerini doldurun:
   - **Name:** QuranLearn
   - **Database Password:** Güçlü bir şifre seçin (kaydedin!)
   - **Region:** Size en yakın bölgeyi seçin (örn: Europe West)

### 2. Migration Dosyalarını Çalıştırma

#### Option A: Supabase Dashboard (Önerilen)

1. Supabase projenizde **SQL Editor**'e gidin
2. `supabase/migrations/001_initial_schema.sql` dosyasının içeriğini kopyalayın
3. SQL Editor'e yapıştırın ve "Run" butonuna tıklayın
4. `supabase/migrations/002_functions_and_triggers.sql` için aynısını yapın

#### Option B: Supabase CLI

```bash
# Supabase CLI kurulumu (henüz kurmadıysanız)
npm install -g supabase

# Supabase projesine bağlanma
supabase link --project-ref YOUR_PROJECT_REF

# Migration'ları çalıştırma
supabase db push
```

### 3. Seed Data Ekleme

1. SQL Editor'e gidin
2. `supabase/seed/001_sample_lessons.sql` dosyasını çalıştırın
3. `supabase/seed/002_sample_badges.sql` dosyasını çalıştırın

### 4. Environment Variables Ayarlama

1. Supabase dashboard'dan **Settings > API** kısmına gidin
2. Aşağıdaki değerleri alın:
   - Project URL
   - anon (public) key

3. `.env` dosyanızı oluşturun:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Storage Buckets Oluşturma (Opsiyonel)

Ses dosyaları ve resimler için:

1. **Storage** bölümüne gidin
2. Yeni bucket oluşturun:
   - **audio-files** (public)
   - **badge-icons** (public)
   - **avatars** (public)

### 6. Veritabanını Test Etme

SQL Editor'de test sorguları:

```sql
-- Lessons kontrolü
SELECT category, COUNT(*) as count 
FROM lessons 
GROUP BY category;

-- Badges kontrolü
SELECT badge_type, COUNT(*) as count 
FROM badges 
GROUP BY badge_type;

-- Functions kontrolü
SELECT calculate_user_level(1000); -- Should return level based on XP
```

## ✅ Doğrulama

Aşağıdaki tabloların oluşturulduğundan emin olun:

- ✅ users
- ✅ lessons
- ✅ questions
- ✅ user_progress
- ✅ user_answers
- ✅ badges
- ✅ user_badges
- ✅ leaderboard
- ✅ user_streaks
- ✅ ad_rewards
- ✅ daily_challenges
- ✅ user_daily_challenges

## 🔒 Row Level Security

RLS politikaları otomatik olarak aktif edilmiştir:

- Kullanıcılar sadece kendi verilerini görebilir
- Lessons, questions, badges herkes tarafından okunabilir
- Leaderboard herkese açık

## 📱 Uygulama ile Test

1. React Native uygulamanızı başlatın:
```bash
cd KurProject
npm start
```

2. Uygulamada:
   - Anonim kullanıcı olarak giriş yapabilmelisiniz
   - Dersleri görmelisiniz
   - XP kazanabilmelisiniz

## 🐛 Sorun Giderme

### Hata: "relation does not exist"
- Migration dosyalarının sırasıyla çalıştırıldığından emin olun

### Hata: "permission denied"
- RLS politikalarını kontrol edin
- `auth.uid()` fonksiyonunun doğru çalıştığından emin olun

### Hata: "function does not exist"
- 002_functions_and_triggers.sql dosyasını çalıştırın

## 📚 Kaynaklar

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

