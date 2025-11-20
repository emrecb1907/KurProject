# 🚀 Proje Teknoloji ve Özellik Dökümantasyonu

Bu belge, projede kullanılan teknoloji yığınını ve başarıyla entegre edilip tamamlanan özellikleri listeler.

## 🛠 Teknoloji Yığını (Tech Stack)

### Çekirdek (Core)
- **React Native (Expo SDK 52):** Uygulama çatısı.
- **TypeScript:** Tip güvenliği ve kod kalitesi için.
- **Expo Router:** Dosya tabanlı navigasyon sistemi (Next.js benzeri).

### Backend & Veri (Backend & Data)
- **Supabase:**
  - **Auth:** Kullanıcı kimlik doğrulama (Email/Şifre).
  - **Database (PostgreSQL):** Kullanıcı verileri, ilerleme ve oyun verileri.
- **Expo Secure Store:** Hassas verilerin (Auth token) cihazda şifreli olarak saklanması.
- **AsyncStorage:** Basit ayarların (Tema tercihi vb.) saklanması.

### Durum Yönetimi (State Management)
- **Zustand:** Global state yönetimi (Kullanıcı XP'si, can hakları, seriler vb. için hafif ve performanslı çözüm).
- **Context API:** Tema yönetimi (`ThemeContext`) için.

### Arayüz & Tasarım (UI & Design)
- **Custom Design System:** `src/constants/colors.ts` üzerinden yönetilen merkezi renk paleti.
- **Dinamik Tema Motoru:** Sistem, Açık ve Koyu modlar arasında anlık geçiş yapabilen, `useMemo` tabanlı stil yapısı.
- **HugeIcons:** Modern ve tutarlı ikon seti.
- **SVG:** `react-native-svg` ile özel vektörel çizimler (Google/Apple logoları vb.).

---

## ✅ Tamamlanan Özellikler (Completed Features)

### 1. Kimlik Doğrulama (Authentication)
- [x] **Kayıt Ol (Register):** Kullanıcı adı, email ve şifre ile hesap oluşturma.
- [x] **Giriş Yap (Login):** Email ve şifre ile güvenli giriş.
- [x] **Oturum Sürekliliği (Persistency):** Uygulama kapatılıp açıldığında oturumun korunması (`ExpoSecureStoreAdapter` ile).
- [x] **Çıkış Yap (Logout):** Güvenli çıkış ve navigasyon geçmişinin temizlenmesi.
- [x] **Sosyal Giriş Altyapısı:** Google ve Apple giriş butonları ve UI hazırlığı (Backend konfigürasyonu bekleniyor).

### 2. Navigasyon ve Yönlendirme
- [x] **Korumalı Rotalar (Protected Routes):** Giriş yapmamış kullanıcıların ana sayfaya erişiminin engellenmesi.
- [x] **Tab Navigasyonu:** Ana Sayfa, Liderlik, Can ve Profil sekmeleri arası geçiş.
- [x] **Akıllı Geri Tuşu:** Login ekranında geçmiş yoksa "Ana Sayfa"ya, varsa "Geri"ye yönlendirme.

### 3. Profil ve Ayarlar
- [x] **Dinamik Tema Değiştirme:** Uygulama içinden Açık/Koyu/Sistem teması seçimi.
- [x] **Anlık Tema Güncellemesi:** Tema değiştiğinde sayfa yenilenmeden (reload olmadan) renklerin güncellenmesi.
- [x] **Kullanıcı İstatistikleri:** Toplam XP, Günlük Seri, Başarı Oranı gösterimi.
- [x] **Rozet Sistemi:** Kazanılan başarıların listelenmesi.

### 4. Oyunlaştırma (Gamification) Altyapısı
- [x] **XP ve Seviye Sistemi:** Kazanılan XP'ye göre seviye hesaplama (`utils/levelCalculations`).
- [x] **Can (Heart) Sistemi:** Yanlış cevaplarda can azalması ve zamanla yenilenme mantığı.
- [x] **Seri (Streak) Takibi:** Günlük giriş serilerinin takibi.

### 5. Güvenlik ve Performans
- [x] **Secure Storage Entegrasyonu:** Supabase tokenlarının cihazda şifreli saklanması.
- [x] **Performanslı Listeler:** `FlashList` (hazırlık aşamasında) ve optimize edilmiş `ScrollView` kullanımı.
- [x] **Hata Yönetimi:** Giriş/Kayıt işlemlerinde kullanıcı dostu hata mesajları.
