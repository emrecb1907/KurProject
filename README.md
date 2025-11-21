# 📖 QuranLearn - Kuran Öğrenme Uygulaması

Duolingo tarzı oyunlaştırılmış bir Kuran öğrenme mobil uygulaması. React Native, Expo ve Supabase ile geliştirilmiştir.

## 🌟 Özellikler

### 🎮 Oyun Mekanikleri

#### 📊 XP & Level Sistemi
- **Formül**: `required_xp = round(10 * level^1.4)`
- **Başlangıç**: Level 1, 0 XP
- **Seviye Sınırı**: Yok (sınırsız ilerleme)
- **Örnek İlerleme**:
  | Level | XP Aralığı | Gereken XP |
  |-------|------------|------------|
  | 1 | 0 - 10 | 10 |
  | 2 | 10 - 37 | 27 |
  | 5 | 70 - 141 | 71 |
  | 10 | 280 - 531 | 251 |
  | 50 | 18,232 - 21,543 | 3,311 |
  | 100 | ~100K | 10,000 |

#### 🎯 Diğer Mekanikler
- **Can Sistemi**: 5 can ile başla, yanlış cevaplarda can kaybet
- **Rozet Sistemi**: Başarılar için rozetler kazan
- **Seri (Streak)**: Ardışık günlerde oyna, seri yap
- **Liderlik Tablosu**: Diğer kullanıcılarla yarış

### 🎯 Oyun Türleri
1. **🔤 Arapça Harfler**: Harf seslerini dinle ve doğru harfi seç
2. **📚 Kavram Kartları**: İslami anahtar kelimeleri öğren
3. **📖 Ayet Tamamlama**: Eksik kelimeleri bularak ayetleri tamamla
4. **⚡ Hızlı Tur**: Karışık sorularla hızlı pratik (Level 10'da açılır)

### 👤 Kullanıcı Sistemi
- **Anonim Kullanım**: Hesap oluşturmadan oynayabilme (veriler local'de)
- **Hesap Oluşturma**: İsterseniz hesap oluşturarak ilerlemeni kaydet
- **Veri Geçişi**: Local veriler hesap oluşturduktan sonra database'e aktarılır
- **Privacy-First**: Anonim kullanıcı verileri sadece telefonunda, minimal analytics tracking

### 💰 Monetizasyon
- **AdMob Entegrasyonu**: Reklam izleyerek can kazan
- **Sandık Sistemi**: Günde 3 kez reklam izleyerek can kazanabilme

## 🏗️ Teknoloji Stack

- **Frontend**: React Native + Expo
- **Routing**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + Anonymous Users
- **Ads**: react-native-google-mobile-ads
- **Language**: TypeScript
- **Design**: Liquid Glass UI (iOS 26 inspired)

## 📁 Proje Yapısı

```
KurProject/
├── app/                      # Expo Router screens
│   ├── (tabs)/              # Tab navigation
│   │   ├── index.tsx        # Home screen
│   │   ├── chest.tsx        # Chest screen (ads for lives)
│   │   ├── leaderboard.tsx  # Leaderboard
│   │   └── profile.tsx      # User profile
│   ├── (auth)/              # Authentication
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── games/               # Game screens
│       ├── letters/
│       ├── vocabulary/
│       └── verses/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   └── game/            # Game-specific components
│   ├── hooks/               # Custom hooks
│   ├── store/               # Zustand store
│   ├── services/            # API services
│   ├── lib/                 # Libraries
│   │   ├── supabase/        # Supabase client & services
│   │   └── utils/           # Utility functions
│   ├── types/               # TypeScript types
│   ├── constants/           # App constants
│   └── theme/               # Theme configuration
├── supabase/
│   ├── migrations/          # Database migrations
│   └── seed/                # Seed data
├── assets/                  # Images, fonts, etc.
└── docs/                    # Documentation
```

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+
- npm veya yarn
- Expo CLI
- Supabase hesabı

### Adımlar

1. **Depoyu klonla**
```bash
git clone <repo-url>
cd KurProject
```

2. **Bağımlılıkları yükle**
```bash
npm install
```

3. **Environment variables ayarla**

`.env` dosyası oluştur:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Supabase'i kur**

`scripts/setup-supabase.md` dosyasındaki talimatları takip et.

5. **Uygulamayı başlat**
```bash
npm start
```

## 📊 Veritabanı

### Tablolar

- `users` - Kullanıcı bilgileri
- `lessons` - Dersler ve kategoriler
- `questions` - Sorular
- `user_progress` - Kullanıcı ilerlemesi
- `user_answers` - Kullanıcı cevapları
- `badges` - Rozetler
- `user_badges` - Kullanıcı rozetleri
- `leaderboard` - Liderlik tablosu
- `user_streaks` - Kullanıcı serileri
- `ad_rewards` - Reklam ödülleri
- `daily_challenges` - Günlük görevler
- `user_daily_challenges` - Kullanıcı görevleri

### Migrations

```bash
# Migration dosyaları
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_functions_and_triggers.sql
```

### Seed Data

```bash
# Örnek veri dosyaları
supabase/seed/001_sample_lessons.sql
supabase/seed/002_sample_badges.sql
```

## 🎨 Tasarım Sistemi

### Liquid Glass UI

iOS 26'dan esinlenilen modern, şeffaf ve cam efektli tasarım:

- Soft blur efektleri
- Glass card'lar
- Yüksek kontrast
- Minimal ve temiz arayüz

### Renkler

```typescript
Primary: #007AFF
Success: #34C759
Warning: #FF9500
Error: #FF3B30
```

## 🧪 Test

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e
```

## 📱 Build

### Android
```bash
eas build --platform android
```

### iOS
```bash
eas build --platform ios
```

## 🔐 Güvenlik

- Row Level Security (RLS) aktif
- Kullanıcılar sadece kendi verilerini görebilir
- API key'ler environment variables'da
- Secure authentication flow

## 📈 XP & Level Sistemi

**XP Formülü**:
- Her soru: 10-50 XP (zorluk seviyesine göre)
- Ders tamamlama bonusu: 50-100 XP
- Ardışık gün bonusu: 25 XP/gün

**Level Formülü**:
```
Level = FLOOR((-100 + SQRT(10000 + 400 * XP)) / 100) + 1
```

## 🎯 Roadmap

- [x] Temel uygulama yapısı
- [x] Authentication sistemi
- [x] Oyun mekanikleri
- [x] AdMob entegrasyonu
- [x] Database & migrations
- [ ] Ses dosyaları entegrasyonu
- [ ] Push notifications
- [ ] Sosyal özellikler
- [ ] Offline mode
- [ ] Analytics

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır. Büyük değişiklikler için önce bir issue açın.

## 📄 Lisans

MIT

## 👨‍💻 Geliştirici

Emre Can Biçici

## 📞 İletişim

- **GitHub**: [your-github]
- **Email**: [your-email]

---

