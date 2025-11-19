# Kuran Öğrenimi Mobil Uygulaması — Proje Spesifikasyonu

## 📋 Proje Özeti

Duolingo tarzı oyunlaştırılmış bir Kuran öğrenimi mobil uygulaması. Kullanıcılar dersleri tamamlayarak XP kazanır, seviye atlar, can hakkını yönetir ve görevleri takip eder. Uygulama, iOS 26 Liquid Glass tasarım diliyle modern ve pürüzsüz bir kullanıcı deneyimi sunar.

**Önemli Not:** Uygulamada Arapça yazma gerektiren hiçbir özellik bulunmaz. Tüm etkileşimler çoktan seçmeli, eşleştirmeli ve dinle-seç formatındadır.

---

## 🎨 Platform ve Tasarım

### Platform
- **Birincil Hedef:** iOS
- **İkincil Hedef:** Android (opsiyonel, gelecek aşama)

### Tech Stack:
Frontend: React Native with TypeScript, Expo, and Expo Router
Backend/Database: Supabase


### Tasarım Dili
- **Stil:** iOS 26 Liquid Glass UI
- **Özellikler:**
  - Modern, soft blur efektleri
  - Cam efekti (glassmorphism)
  - Yüksek kontrastlı, okunabilir arayüz
  - Pürüzsüz animasyonlar ve geçişler
  - Skeleton loading animasyonları

### Navigasyon Yapısı
- **Üst Bar:** Sabit bilgi barı (Level, XP, Puan, Can)
- **Ana İçerik:** Oyun seçenekleri ve kurslar (kart yapısı)
- **Alt Navigasyon:** Sandık, Leaderboard, Profil

---

## 🚀 Açılış ve Ana Ekran Akışı

### Splash Screen
- Kuran öğrenimi temalı minimal tasarım
- 1–1.5 saniyelik animasyon
- Uygulama yükleme sırasında gösterilir

### Ana Sayfa Yapısı

#### Üst Bilgi Barı (Fixed)
- **Kullanıcı Level:** Mevcut seviye gösterimi
- **XP Bar:** İlerleme çubuğu (bir sonraki seviyeye kalan XP)
- **Toplam Puan:** Kümülatif puan
- **Can (Life):** Mevcut can sayısı

#### Ana İçerik Alanı
- Oyun seçenekleri ve kurslar kart yapısında gösterilir
- Her kart bir oyun modunu veya ders grubunu temsil eder
- Scrollable yapı

#### Alt Navigasyon Barı
- **Sandık:** Can kazanma ekranı
- **Leaderboard:** Liderlik tablosu
- **Profil:** Kullanıcı profili

---

## 📱 Navigasyon Menüleri

### 1. Sandık (Chest)
**Özellikler:**
- Günde **3 kez** reklam izleyerek can kazanma
- Her izlenen reklam **+1 can** kazandırır
- **Geri sayım sistemi:** Her reklam hakkı kullanıldığında 24 saatlik reset
- Görsel geri bildirim ve animasyonlar

**Kullanım Akışı:**
1. Kullanıcı Sandık ekranına girer
2. Mevcut reklam haklarını görür
3. Reklam izler → +1 can kazanır
4. 24 saatlik geri sayım başlar

### 2. Leaderboard
**Özellikler:**
- **Gösterim Formatı:** Sıra – Kullanıcı Adı – Puan
- **Lig Sistemi:** Çok sayıda kullanıcı olması durumunda ligler (Bronz, Gümüş, Altın, vb.)
- **Erişim Kısıtı:** Giriş yapmayan kullanıcılar erişemez → Üyelik ekranına yönlendirme

**Görünüm:**
```
┌─────────────────────────────┐
│ 1. Ahmet Yılmaz     15,420  │
│ 2. Ayşe Demir        12,350  │
│ 3. Mehmet Kaya       10,200  │
│ ...                         │
└─────────────────────────────┘
```

### 3. Profil
**Gösterilen Bilgiler:**
- Kullanıcı adı
- Toplam puan
- Başarı oranı (%)
- Toplam çözülen ders sayısı
- Streak (günlük devam serisi)
- Mevcut seviye

**Özellikler:**
- Profil düzenleme: Kullanıcı adı değiştirme
- Başarımlar ve rozetler görüntüleme
- İstatistikler ve ilerleme grafikleri

**Erişim Kısıtı:** Giriş yapmayan kullanıcılar erişemez → Üyelik ekranına yönlendirme

---

## 👤 Kullanıcı Sistemi ve Üyelik Mantığı

### Anonim Mod (Varsayılan)
- Uygulamaya giren herkes **anonim** olarak oynayabilir
- Cihaz özel bir **unique device ID (UUID)** üretilir
- Tüm ilerleme bu ID ile eşleştirilir ve cihazda saklanır
- Kullanıcı hiçbir kayıt işlemi yapmadan oyuna başlayabilir

### Üyelik Sistemi (Opsiyonel)
**Üyelik Açıldığında:**
- Kullanıcının cihazdaki tüm verileri **hesabına aktarılır**
- Başarımlar, ilerleme ve puanlar kaybolmaz
- Giriş sonrası leaderboard ve profil aktif olur
- Veriler cloud'a senkronize edilir

**Üyelik Olmadan Kısıtlamalar:**
- ❌ Leaderboard görünmez
- ❌ Profil ekranına girilemez
- ❌ Sosyal özellikler kullanılamaz
- ✅ Tüm oyun modları ve dersler erişilebilir
- ✅ İlerleme cihazda saklanır

---

## 🎮 Oyun Mekanikleri

### 1. Arapça Harfler Grubu

**Oyun Formatı:**
- Kullanıcıya bir **harf ses kaydı** dinletilir
- Ekranda **3–4 harf seçeneği** gösterilir
- Kullanıcı doğru harfi seçer

**Deaktivasyon Sistemi:**
- Sistem kullanıcı performansını sürekli takip eder
- Kullanıcı son **20 soruda %90 ve üzeri doğruluk** sağlarsa:
  - Bu grup "pekiştirildi" olarak işaretlenir
  - Harfler bölümü ana içerikten kaldırılır
  - Sadece **revizyon (hatırlatma)** kısmında tekrar oynanabilir
  - Haftalık olarak otomatik yeniden açılabilir: "Harfleri hatırlatma testi"

**Amaç:** Kullanıcıyı artık ezberlediği içerikle sıkmadan bir üst seviyeye geçmeye teşvik etmek.

---

### 2. Kavram Kartları — İslami Anahtar Kelimeler Oyunu

**Tema:** Kuran'da geçen ve İslamî açıdan önemli kelimelerden oluşan kelime havuzu.

**Oyun Yapısı:**
- Her oyun turu toplam **20 soru** içerir

**Oyun Akışı:**

**İlk 10 Soru:**
- Türkçe anlam verilir
- Kullanıcı doğru Arapça kelimeyi seçer

**Sonraki 10 Soru:**
- Arapça kelime verilir
- Kullanıcı doğru Türkçe anlamı seçer

**Zamanlama ve Geri Bildirim:**
- Her soru için **10 saniye süre**
- Süre biterse:
  - Sistem otomatik olarak doğru cevabı gösterir
  - Soru **yanlış** sayılır
- **Doğru cevap:** Seçenek yeşile döner
- **Yanlış cevap:** 
  - Seçilen şık kırmızı
  - Doğru şık yeşil olarak gösterilir
- Soru bitiminde **5 saniyelik pekiştirme aşaması**

**Amaç:** Kullanıcıya hem Arapça → Türkçe hem Türkçe → Arapça yönlü çift taraflı kelime hakimiyeti kazandırmak.

---

### 3. Ayet Parçası Tamamlama — Eksik Kelimeyi Bul

**Oyun Formatı:**
- Kullanıcıya bir **ayet veya dua parçası** gösterilir
- Bir kelime eksiktir
- Ekranda eksik kelime için **3–4 seçenek** sunulur
- Kullanıcı doğru kelimeyi seçerek ayeti tamamlar

**Çift Format Desteği:**
- Sistem soruyu iki formatta üretebilir:
  1. **Arapça metin → eksik kelime Arapça seçenekler**
  2. **Latin transkripsiyon metni → eksik kelime Latin seçenekler**

**Format Değiştirme:**
- Kullanıcı hangi formatta soru geldiyse, ekrandaki bir butona tıklayarak **diğer formatı anında görüntüleyebilir**
  - Arapça soru gelmişse → "Latince göster" butonu
  - Latince soru gelmişse → "Arapça göster" butonu

**Zamanlama ve Geri Bildirim:**
- Her soru için **10 saniye süre**
- Süre dolarsa:
  - Soru otomatik **yanlış** sayılır
  - Doğru kelime gösterilir
- **Doğru cevap:** Yeşil renk
- **Yanlış cevap:** 
  - Seçilen şık kırmızı
  - Doğru seçenek yeşil
- Ardından **5 saniyelik pekiştirme ekranı**

**Amaç:**
- Kullanıcıya hem Arapça metni hem Latin okunuşu paralel şekilde öğretmek
- Okuma bütünlüğü ve ayet hafızasını güçlendirmek
- Öğrenimi parça-parça kolaylaştırmak

---

## 💎 Can/Hak Sistemi

### Can Mekanikleri
- Her ders veya oyun turuna girildiğinde **can biriminden düşer**
- Tüm canlar biterse kullanıcı **mini reklam izleyerek can kazanabilir**
- Günlük ilk 3 reklam ile ekstra can alma opsiyonu devam eder
- **24 saatlik geri sayım:** Her reklam hakkı kullanıldığında 24 saat beklemek gerekir

### Can Kazanma Yolları
1. **Sandık Ekranı:** Günde 3 kez reklam izleyerek +1 can
2. **Can Bittiğinde:** Mini reklam izleyerek acil can kazanma
3. **Zamanla Otomatik Yenileme:** (Gelecek özellik - opsiyonel)

---

## 🏆 Ödül ve Başarımlar Sistemi

### Rozetler ve Başarımlar
Kullanıcı ilerledikçe **animasyonlu rozetler ve ödüller** kazanır:

**Örnek Rozetler:**
- 🎯 "Harfleri öğrendin!" rozeti
- 📖 "10 ayet tamamlandı!" rozeti
- 🔄 "İlk Latin–Arapça eşleştirme tamamlandı!" rozeti
- ⚡ "5 gün üst üste oynadın!" rozeti
- 🏅 "100 soru doğru cevapladın!" rozeti

**Görsel Tasarım:**
- Animasyonlu rozet açılışları
- Profil ekranında rozet koleksiyonu
- Başarım ilerleme göstergeleri

**Amaç:** Motivasyonu artırmak ve UX'i zenginleştirmek.

---

## ⚡ Mini Testler / Hızlı Tur

### Özellikler
- Oyun içinde **Hızlı Tur modu** bulunur
- İçerik: Harf + kelime + ayet tamamlama soruları karışık

### Kilitleme Sistemi
- Başlangıçta **kilitlidir**
- **Sadece 10. levele ulaşıldığında açılır**
- Kilitli modda butonda: **"10. levele ulaş"** mesajı görünür
- Açıldıktan sonra kullanıcı belirli süre içinde maksimum puan ve XP kazanabilir

### Oyun Formatı
- Hızlı tempolu sorular
- Zaman sınırı
- Yüksek XP ve puan kazanımı
- Leaderboard'a özel etki

---

## 📚 Ders İçeriği ve Yapısı

### Soru Formatları
Tüm dersler aşağıdaki formatlardan oluşur:
- ✅ **Çoktan seçmeli sorular**
- ✅ **Eşleştirmeli sorular**
- ✅ **Dinle ve seç soruları**
- ❌ **Arapça yazdıran hiçbir soru türü yok**

### İçerik Kategorileri

1. **Harfler**
   - Arapça harf tanıma
   - Ses dinleme ve eşleştirme
   - Harf sıralaması

2. **Temel Okuma Egzersizleri**
   - Basit kelime okuma
   - Harf birleştirme
   - Telaffuz pratiği

3. **Namaz Duaları**
   - Namaz dualarını öğrenme
   - Eksik kelime tamamlama
   - Anlam eşleştirme

4. **Kısa Sureler**
   - Kısa sureleri parça parça öğrenme
   - Ayet tamamlama
   - Anlam ve okunuş eşleştirme

5. **Telaffuz Dinleme + Şıklı Seçim**
   - Ses kaydı dinleme
   - Doğru seçeneği bulma
   - Çoklu seçenek formatı

---

## 🎯 XP ve Level Sistemi

### XP Kazanımı
- Her doğru cevap: **+10 XP** (varsayılan)
- Zor sorular: **+15-20 XP**
- Hızlı Tur modu: **+25 XP** (bonus)
- Ders tamamlama bonusu: **+50 XP**

### Level Up Algoritması
- Her seviye için gerekli XP artarak ilerler
- Formül: `Gerekli XP = Level × 100 + (Level - 1) × 50`
- Örnek:
  - Level 1 → 2: 150 XP
  - Level 2 → 3: 250 XP
  - Level 5 → 6: 550 XP

### Level Up Animasyonları
- Seviye atlandığında özel animasyon
- Rozet ve ödül gösterimi
- Motivasyon mesajları

---

## 🛠️ Teknik Yapı

### Frontend
- **Framework:** React Native
- **Tasarım:** iOS 26 Liquid Glass UI
- **State Management:** Redux / Zustand (önerilir)
- **Navigasyon:** React Navigation
- **Animasyonlar:** React Native Reanimated / Lottie

### Backend
- **Authless Mode:** Unique device ID ile local–cloud senkron
- **Opt-in Account:** Üyelik açıldığında veri merge
- **API:** RESTful veya GraphQL

### Database Yapısı

#### Users Tablosu
```
- id (UUID)
- device_id (unique)
- username (nullable)
- email (nullable)
- created_at
- last_active
```

#### Leaderboard Tablosu
```
- user_id
- total_score
- current_level
- league (Bronz/Gümüş/Altın)
- rank
- updated_at
```

#### Lessons Tablosu
```
- id
- title
- category (Harfler/Kelime/Ayet)
- difficulty_level
- content (JSON)
- is_active
```

#### Progress Tablosu
```
- user_id
- lesson_id
- completion_rate
- last_attempted
- is_mastered
- streak_count
```

#### Rewards Tablosu
```
- user_id
- badge_id
- earned_at
- progress_percentage
```

### Reklam Entegrasyonu
- **Reklam Tipi:** Rewarded ads (ödüllü reklamlar)
- **Kullanım Alanları:**
  - Sandık ekranında can kazanma
  - Can bittiğinde acil can kazanma
- **SDK:** Google AdMob / Facebook Audience Network

---

## 📊 Gelecek Genişlemeler (İsteğe Bağlı)

### Kısa Vadeli
- [ ] Lig sistemi detaylandırma
- [ ] Günlük görevler sistemi
- [ ] Özel etkinlikler ve kampanyalar

### Orta Vadeli
- [ ] Arkadaş ekleme ve sosyal özellikler
- [ ] Çoklu dil desteği
- [ ] Offline mod geliştirme

### Uzun Vadeli
- [ ] Ses analizi (telaffuz değerlendirme)
- [ ] AI destekli kişiselleştirilmiş öğrenme yolu
- [ ] Topluluk özellikleri ve forum

---

## 📝 Önemli Notlar ve Tasarım Prensipleri

### UX Prensipleri
- Uygulama tamamen **oyun gibi** hissettirecek
- Tasarım modern, akış pürüzsüz olmalı
- iOS 26 Liquid Glass ahengini koruyacak
- Her etkileşimde görsel ve haptik geri bildirim

### İçerik Prensipleri
- **Arapça yazma gerektiren hiçbir özellik yok**
- Tüm öğrenme pasif etkileşimlerle (seçme, eşleştirme, dinleme)
- İçerik doğruluğu ve dini hassasiyetler gözetilerek hazırlanmalı

### Performans
- Skeleton loading tüm veri yükleme ekranlarında
- Optimize edilmiş animasyonlar
- Hızlı sayfa geçişleri
- Offline-first yaklaşım (mümkün olduğunca)

---

## 🎨 Tasarım Örnekleri ve Referanslar

### Liquid Glass Özellikleri
- **Blur Efektleri:** Arka plan blur, cam efekti
- **Renkler:** Yüksek kontrast, okunabilir palet
- **Tipografi:** Modern, okunabilir fontlar
- **İkonlar:** Minimal, anlaşılır ikon seti
- **Animasyonlar:** Pürüzsüz, doğal geçişler

### Ekran Örnekleri
1. **Splash Screen:** Minimal logo, yumuşak animasyon
2. **Ana Sayfa:** Kart yapısı, blur arka plan
3. **Oyun Ekranı:** Büyük, okunabilir sorular, renkli geri bildirimler
4. **Profil:** İstatistik kartları, rozet koleksiyonu

---

## ✅ Proje Checklist

### Faz 1: Temel Yapı
- [ ] React Native proje kurulumu
- [ ] Navigasyon yapısı
- [ ] Tasarım sistemi (Liquid Glass)
- [ ] Splash screen
- [ ] Ana sayfa layout

### Faz 2: Oyun Mekanikleri
- [ ] Harfler oyunu
- [ ] Kavram kartları oyunu
- [ ] Ayet tamamlama oyunu
- [ ] Can sistemi
- [ ] XP ve level sistemi

### Faz 3: Kullanıcı Sistemi
- [ ] Device ID yönetimi
- [ ] Üyelik sistemi (opsiyonel)
- [ ] Veri senkronizasyonu
- [ ] Profil ekranı
- [ ] Leaderboard

### Faz 4: Özellikler
- [ ] Sandık (reklam entegrasyonu)
- [ ] Rozet sistemi
- [ ] Hızlı Tur modu
- [ ] Skeleton loading
- [ ] Animasyonlar

### Faz 5: Test ve Optimizasyon
- [ ] Unit testler
- [ ] Integration testler
- [ ] Performans optimizasyonu
- [ ] Bug düzeltmeleri
- [ ] Kullanıcı testleri

---

---

## 🗄️ Supabase Veritabanı Şeması (Detaylı)

### 1. users (Kullanıcılar)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT UNIQUE NOT NULL,
  username TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  total_score INTEGER DEFAULT 0,
  current_lives INTEGER DEFAULT 5,
  max_lives INTEGER DEFAULT 5,
  streak_count INTEGER DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_anonymous BOOLEAN DEFAULT TRUE,
  league TEXT DEFAULT 'Bronze' CHECK (league IN ('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'))
);

-- İndeksler
CREATE INDEX idx_users_device_id ON users(device_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_league ON users(league);
CREATE INDEX idx_users_total_score ON users(total_score DESC);
```

### 2. lessons (Dersler/Kategoriler)
```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('letters', 'vocabulary', 'verses', 'prayers', 'quick_quiz')),
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 10),
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  unlock_level INTEGER DEFAULT 1,
  xp_reward INTEGER DEFAULT 50,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX idx_lessons_category ON lessons(category);
CREATE INDEX idx_lessons_order ON lessons(order_index);
CREATE INDEX idx_lessons_unlock_level ON lessons(unlock_level);
```

### 3. questions (Sorular)
```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  question_type TEXT NOT NULL CHECK (question_type IN ('audio_match', 'word_match', 'fill_blank', 'multiple_choice')),
  question_text TEXT,
  question_text_latin TEXT,
  audio_url TEXT,
  correct_answer TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of options
  explanation TEXT,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  xp_value INTEGER DEFAULT 10,
  time_limit_seconds INTEGER DEFAULT 10,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX idx_questions_lesson_id ON questions(lesson_id);
CREATE INDEX idx_questions_type ON questions(question_type);
CREATE INDEX idx_questions_order ON questions(order_index);
```

### 4. user_progress (Kullanıcı İlerlemesi)
```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT FALSE,
  is_mastered BOOLEAN DEFAULT FALSE,
  completion_rate DECIMAL(5,2) DEFAULT 0.00,
  correct_answers INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  last_attempted TIMESTAMP WITH TIME ZONE,
  mastered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- İndeksler
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_lesson_id ON user_progress(lesson_id);
CREATE INDEX idx_user_progress_mastered ON user_progress(is_mastered);
```

### 5. user_answers (Kullanıcı Cevapları)
```sql
CREATE TABLE user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken_seconds INTEGER,
  xp_earned INTEGER DEFAULT 0,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX idx_user_answers_user_id ON user_answers(user_id);
CREATE INDEX idx_user_answers_question_id ON user_answers(question_id);
CREATE INDEX idx_user_answers_lesson_id ON user_answers(lesson_id);
CREATE INDEX idx_user_answers_date ON user_answers(answered_at DESC);
```

### 6. badges (Rozetler)
```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  badge_type TEXT NOT NULL CHECK (badge_type IN ('achievement', 'milestone', 'streak', 'special')),
  icon_url TEXT,
  requirement_type TEXT NOT NULL, -- 'lessons_completed', 'questions_correct', 'streak_days', etc.
  requirement_value INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX idx_badges_type ON badges(badge_type);
```

### 7. user_badges (Kullanıcı Rozetleri)
```sql
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress_percentage DECIMAL(5,2) DEFAULT 0.00,
  is_claimed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, badge_id)
);

-- İndeksler
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_badges_earned_at ON user_badges(earned_at DESC);
```

### 8. leaderboard (Liderlik Tablosu)
```sql
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  username TEXT NOT NULL,
  total_score INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  league TEXT DEFAULT 'Bronze',
  rank INTEGER,
  weekly_score INTEGER DEFAULT 0,
  monthly_score INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX idx_leaderboard_league ON leaderboard(league);
CREATE INDEX idx_leaderboard_total_score ON leaderboard(total_score DESC);
CREATE INDEX idx_leaderboard_weekly ON leaderboard(weekly_score DESC);
CREATE INDEX idx_leaderboard_rank ON leaderboard(rank);
```

### 9. user_streaks (Kullanıcı Serileri)
```sql
CREATE TABLE user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  streak_freeze_count INTEGER DEFAULT 0, -- Gelecek özellik için
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX idx_user_streaks_user_id ON user_streaks(user_id);
CREATE INDEX idx_user_streaks_current ON user_streaks(current_streak DESC);
```

### 10. ad_rewards (Reklam Ödülleri)
```sql
CREATE TABLE ad_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('life', 'xp', 'special')),
  reward_value INTEGER DEFAULT 1,
  ad_slot INTEGER CHECK (ad_slot BETWEEN 1 AND 3), -- Günlük 3 slot
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_expired BOOLEAN DEFAULT FALSE
);

-- İndeksler
CREATE INDEX idx_ad_rewards_user_id ON ad_rewards(user_id);
CREATE INDEX idx_ad_rewards_claimed_at ON ad_rewards(claimed_at DESC);
CREATE INDEX idx_ad_rewards_expires_at ON ad_rewards(expires_at);
```

### 11. daily_challenges (Günlük Görevler - Gelecek Özellik)
```sql
CREATE TABLE daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  challenge_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 100,
  life_reward INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  valid_from DATE NOT NULL,
  valid_to DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 12. user_daily_challenges (Kullanıcı Günlük Görevleri)
```sql
CREATE TABLE user_daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES daily_challenges(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- İndeksler
CREATE INDEX idx_user_daily_challenges_user_id ON user_daily_challenges(user_id);
```

### Row Level Security (RLS) Politikaları

```sql
-- Users tablosu için RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id OR is_anonymous = true);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- User_progress için RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Diğer tablolar için benzer RLS politikaları...
```

### Database Functions (Özel Fonksiyonlar)

```sql
-- Kullanıcı seviyesini hesaplama
CREATE OR REPLACE FUNCTION calculate_user_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN FLOOR((-100 + SQRT(10000 + 400 * xp)) / 100) + 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Leaderboard sıralamasını güncelleme
CREATE OR REPLACE FUNCTION update_leaderboard_ranks()
RETURNS VOID AS $$
BEGIN
  UPDATE leaderboard
  SET rank = subquery.new_rank
  FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY league ORDER BY total_score DESC) as new_rank
    FROM leaderboard
  ) AS subquery
  WHERE leaderboard.id = subquery.id;
END;
$$ LANGUAGE plpgsql;

-- Streak güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_last_activity DATE;
  v_current_streak INTEGER;
BEGIN
  SELECT last_activity_date, current_streak INTO v_last_activity, v_current_streak
  FROM user_streaks WHERE user_id = p_user_id;
  
  IF v_last_activity = CURRENT_DATE THEN
    -- Bugün zaten aktivite var
    RETURN;
  ELSIF v_last_activity = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Dün aktivite vardı, streak devam ediyor
    UPDATE user_streaks
    SET current_streak = current_streak + 1,
        longest_streak = GREATEST(longest_streak, current_streak + 1),
        last_activity_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE user_id = p_user_id;
  ELSE
    -- Streak kırıldı
    UPDATE user_streaks
    SET current_streak = 1,
        last_activity_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
```

### Triggers (Tetikleyiciler)

```sql
-- Kullanıcı oluşturulduğunda streak kaydı oluştur
CREATE OR REPLACE FUNCTION create_user_streak()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_streaks (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_user_streak
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_streak();

-- XP güncellendiğinde seviyeyi otomatik hesapla
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.current_level = calculate_user_level(NEW.total_xp);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_level
  BEFORE UPDATE ON users
  FOR EACH ROW
  WHEN (OLD.total_xp IS DISTINCT FROM NEW.total_xp)
  EXECUTE FUNCTION update_user_level();
```

---

## 📁 Optimal Proje Klasör Yapısı

### React Native + Expo + TypeScript Yapısı

```
ProjeNew/
│
├── app/                          # Expo Router (Ana uygulama dosyaları)
│   ├── (tabs)/                   # Tab navigasyon grubu
│   │   ├── index.tsx             # Ana sayfa (Oyunlar)
│   │   ├── chest.tsx             # Sandık ekranı
│   │   ├── leaderboard.tsx       # Liderlik tablosu
│   │   └── profile.tsx           # Profil ekranı
│   │
│   ├── (auth)/                   # Auth navigasyon grubu
│   │   ├── login.tsx             # Giriş ekranı
│   │   ├── register.tsx          # Kayıt ekranı
│   │   └── _layout.tsx           # Auth layout
│   │
│   ├── games/                    # Oyun ekranları
│   │   ├── letters/              # Harfler oyunu
│   │   │   ├── index.tsx         # Oyun ana ekranı
│   │   │   ├── [id].tsx          # Dinamik ders ekranı
│   │   │   └── result.tsx        # Sonuç ekranı
│   │   │
│   │   ├── vocabulary/           # Kelime kartları
│   │   │   ├── index.tsx
│   │   │   ├── [id].tsx
│   │   │   └── result.tsx
│   │   │
│   │   ├── verses/               # Ayet tamamlama
│   │   │   ├── index.tsx
│   │   │   ├── [id].tsx
│   │   │   └── result.tsx
│   │   │
│   │   └── quick-quiz/           # Hızlı tur
│   │       ├── index.tsx
│   │       └── result.tsx
│   │
│   ├── _layout.tsx               # Root layout
│   ├── +not-found.tsx            # 404 ekranı
│   └── splash.tsx                # Splash screen
│
├── src/
│   ├── components/               # Yeniden kullanılabilir bileşenler
│   │   ├── ui/                   # UI bileşenleri
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── GlassCard.tsx    # Liquid Glass efekti
│   │   │   └── index.ts
│   │   │
│   │   ├── game/                 # Oyun bileşenleri
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── OptionButton.tsx
│   │   │   ├── Timer.tsx
│   │   │   ├── ScoreDisplay.tsx
│   │   │   ├── LifeIndicator.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── navigation/           # Navigasyon bileşenleri
│   │   │   ├── TopBar.tsx        # Üst bilgi barı
│   │   │   ├── TabBar.tsx        # Alt navigasyon
│   │   │   └── index.ts
│   │   │
│   │   └── badges/               # Rozet bileşenleri
│   │       ├── BadgeCard.tsx
│   │       ├── BadgeModal.tsx
│   │       └── index.ts
│   │
│   ├── lib/                      # Kütüphaneler ve yapılandırma
│   │   ├── supabase/             # Supabase client ve yapılandırma
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── database.ts
│   │   │   └── storage.ts
│   │   │
│   │   ├── admob/                # Reklam entegrasyonu
│   │   │   ├── config.ts
│   │   │   ├── rewarded.ts
│   │   │   └── interstitial.ts
│   │   │
│   │   └── utils/                # Yardımcı fonksiyonlar
│   │       ├── device.ts         # Device ID yönetimi
│   │       ├── storage.ts        # AsyncStorage yönetimi
│   │       ├── date.ts           # Tarih formatları
│   │       └── validators.ts     # Validasyon fonksiyonları
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts            # Auth hook
│   │   ├── useUser.ts            # Kullanıcı verisi hook
│   │   ├── useGame.ts            # Oyun mantığı hook
│   │   ├── useLives.ts           # Can sistemi hook
│   │   ├── useStreak.ts          # Streak hook
│   │   ├── useLeaderboard.ts     # Leaderboard hook
│   │   ├── useProgress.ts        # İlerleme hook
│   │   ├── useAudio.ts           # Ses çalma hook
│   │   └── index.ts
│   │
│   ├── store/                    # State management (Zustand)
│   │   ├── slices/
│   │   │   ├── authSlice.ts      # Auth state
│   │   │   ├── userSlice.ts      # Kullanıcı state
│   │   │   ├── gameSlice.ts      # Oyun state
│   │   │   ├── progressSlice.ts  # İlerleme state
│   │   │   └── uiSlice.ts        # UI state
│   │   │
│   │   ├── index.ts              # Store birleştirme
│   │   └── persist.ts            # Persistence yapılandırma
│   │
│   ├── services/                 # API ve servis katmanı
│   │   ├── auth.service.ts       # Auth servisleri
│   │   ├── user.service.ts       # Kullanıcı servisleri
│   │   ├── lesson.service.ts     # Ders servisleri
│   │   ├── question.service.ts   # Soru servisleri
│   │   ├── progress.service.ts   # İlerleme servisleri
│   │   ├── leaderboard.service.ts # Leaderboard servisleri
│   │   ├── badge.service.ts      # Rozet servisleri
│   │   ├── streak.service.ts     # Streak servisleri
│   │   └── ad.service.ts         # Reklam servisleri
│   │
│   ├── types/                    # TypeScript tipleri
│   │   ├── database.types.ts     # Supabase otomatik tipler
│   │   ├── user.types.ts         # Kullanıcı tipleri
│   │   ├── game.types.ts         # Oyun tipleri
│   │   ├── lesson.types.ts       # Ders tipleri
│   │   ├── question.types.ts     # Soru tipleri
│   │   ├── badge.types.ts        # Rozet tipleri
│   │   └── index.ts
│   │
│   ├── constants/                # Sabitler
│   │   ├── colors.ts             # Renk paleti
│   │   ├── fonts.ts              # Font yapılandırması
│   │   ├── spacing.ts            # Spacing sabitleri
│   │   ├── game.ts               # Oyun sabitleri
│   │   ├── xp.ts                 # XP formülleri
│   │   └── index.ts
│   │
│   ├── theme/                    # Tema yapılandırması
│   │   ├── liquidGlass.ts        # Liquid Glass tema
│   │   ├── animations.ts         # Animasyon yapılandırmaları
│   │   └── index.ts
│   │
│   └── animations/               # Lottie ve animasyon dosyaları
│       ├── splash.json
│       ├── levelUp.json
│       ├── badgeUnlock.json
│       ├── correct.json
│       ├── incorrect.json
│       └── chest.json
│
├── assets/                       # Statik dosyalar
│   ├── images/                   # Görseller
│   │   ├── badges/               # Rozet görselleri
│   │   ├── icons/                # İkonlar
│   │   └── backgrounds/          # Arka plan görselleri
│   │
│   ├── audio/                    # Ses dosyaları
│   │   ├── letters/              # Harf sesleri
│   │   ├── words/                # Kelime sesleri
│   │   ├── verses/               # Ayet sesleri
│   │   └── effects/              # Ses efektleri
│   │
│   └── fonts/                    # Custom fontlar
│       ├── Arabic-Regular.ttf
│       ├── Arabic-Bold.ttf
│       └── ...
│
├── supabase/                     # Supabase yapılandırma (yerel geliştirme)
│   ├── migrations/               # Database migration dosyaları
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_indexes.sql
│   │   ├── 003_add_functions.sql
│   │   └── ...
│   │
│   └── seed/                     # Seed data
│       ├── lessons.sql
│       ├── questions.sql
│       └── badges.sql
│
├── docs/                         # Dokümantasyon
│   ├── ProjectFlow.md            # Bu dosya
│   ├── API.md                    # API dokümantasyonu
│   ├── DATABASE.md               # Veritabanı dokümantasyonu
│   └── DEPLOYMENT.md             # Deployment rehberi
│
├── scripts/                      # Yardımcı scriptler
│   ├── generate-types.sh         # Supabase tiplerini oluşturma
│   ├── seed-database.sh          # Database seeding
│   └── build.sh                  # Build script
│
├── __tests__/                    # Test dosyaları
│   ├── unit/                     # Unit testler
│   │   ├── utils/
│   │   ├── services/
│   │   └── hooks/
│   │
│   ├── integration/              # Integration testler
│   │   ├── auth.test.ts
│   │   ├── game.test.ts
│   │   └── progress.test.ts
│   │
│   └── e2e/                      # End-to-end testler
│       ├── game-flow.test.ts
│       └── user-journey.test.ts
│
├── .env.example                  # Örnek environment değişkenleri
├── .env                          # Environment değişkenleri (gitignore'da)
├── .gitignore
├── app.json                      # Expo yapılandırması
├── babel.config.js               # Babel yapılandırması
├── tsconfig.json                 # TypeScript yapılandırması
├── package.json
├── README.md
└── eas.json                      # Expo Application Services yapılandırması
```

### Klasör Yapısı Açıklamaları

#### `/app` - Expo Router
- **File-based routing** sistemi kullanılır
- Her dosya bir rota oluşturur
- `(tabs)` ve `(auth)` gibi gruplar özel layout'lar için kullanılır
- `[id].tsx` gibi dosyalar dinamik rotalar oluşturur

#### `/src/components` - Bileşenler
- **ui/**: Genel kullanım için temel UI bileşenleri
- **game/**: Oyunlara özel bileşenler
- **navigation/**: Navigasyon bileşenleri
- Her klasör kendi `index.ts` dosyasına sahip (barrel exports)

#### `/src/lib` - Kütüphaneler
- **supabase/**: Supabase client ve veritabanı fonksiyonları
- **admob/**: Reklam entegrasyonu
- **utils/**: Genel yardımcı fonksiyonlar

#### `/src/hooks` - Custom Hooks
- Her özellik için ayrı custom hook
- Business logic bileşenlerden ayrılır
- Yeniden kullanılabilirlik artırılır

#### `/src/store` - State Management
- Zustand ile global state yönetimi
- Slice pattern ile ayrılmış state'ler
- Persist ile local storage entegrasyonu

#### `/src/services` - Servis Katmanı
- API çağrıları bu katmanda yapılır
- Her özellik için ayrı servis dosyası
- Error handling merkezi yönetim

#### `/src/types` - TypeScript Tipleri
- Supabase'den otomatik oluşturulan tipler
- Custom tipler ve interface'ler
- Type safety sağlanır

### Naming Conventions (İsimlendirme Kuralları)

#### Dosya İsimleri
- **Components**: PascalCase → `Button.tsx`, `QuestionCard.tsx`
- **Hooks**: camelCase, "use" prefix → `useAuth.ts`, `useGame.ts`
- **Services**: camelCase, ".service" suffix → `auth.service.ts`
- **Types**: camelCase, ".types" suffix → `user.types.ts`
- **Utils**: camelCase → `device.ts`, `validators.ts`

#### Component Klasör Yapısı
```
components/ui/Button/
  ├── Button.tsx           # Ana component
  ├── Button.styles.ts     # Styles (opsiyonel)
  ├── Button.test.tsx      # Test dosyası
  └── index.ts             # Export
```

### Import Yolu Yapılandırması

`tsconfig.json` içinde path aliasları:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@services/*": ["./src/services/*"],
      "@store/*": ["./src/store/*"],
      "@types/*": ["./src/types/*"],
      "@constants/*": ["./src/constants/*"],
      "@lib/*": ["./src/lib/*"],
      "@theme/*": ["./src/theme/*"]
    }
  }
}
```

Kullanım:
```typescript
import { Button } from '@components/ui';
import { useAuth } from '@hooks';
import { authService } from '@services/auth.service';
import type { User } from '@types';
```

---

**Doküman Versiyonu:** 1.0  
**Son Güncelleme:** 2024  
**Hazırlayan:** Proje Ekibi

