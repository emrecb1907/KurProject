# 🔐 Supabase Authentication Setup for React Native

## Problem
Email onaylama linkleri `localhost` adresine yönlendiriyor ve mobil uygulamada çalışmıyor.

## Çözüm: Deep Linking Yapılandırması

---

## 📱 1. Supabase Dashboard Ayarları

### A. URL Configuration

1. **Supabase Dashboard**'a git
2. Sol menüden **Authentication** → **URL Configuration** seç
3. Aşağıdaki ayarları yap:

#### Site URL
```
quranlearn://
```

#### Redirect URLs (Her satır ayrı URL)
```
quranlearn://
quranlearn://auth/callback
exp://localhost:8081
http://localhost:8081
```

**"Add URL"** butonuna tıklayarak her birini ekle.

---

### B. Email Templates (Opsiyonel ama Önerilen)

1. **Authentication** → **Email Templates** git
2. **Confirm signup** template'ini seç
3. Şu kodu bul:
   ```html
   <a href="{{ .ConfirmationURL }}">Confirm your mail</a>
   ```

4. Şununla değiştir:
   ```html
   <a href="quranlearn://auth/callback?token_hash={{ .TokenHash }}&type=signup">Emaili Onayla</a>
   ```

5. **Save** butonuna tıkla

---

## 🔧 2. Expo Configuration (Zaten Yapıldı ✅)

`app.json` dosyasında zaten yapılandırılmış:

```json
{
  "expo": {
    "scheme": "quranlearn"
  }
}
```

`app/auth/callback.tsx` dosyası oluşturuldu ve email doğrulamayı handle ediyor.

---

## 🧪 3. Test Etme

### Development Ortamında Test

1. **Yeni bir kullanıcı kaydet**:
   ```typescript
   const { error } = await supabase.auth.signUp({
     email: 'test@example.com',
     password: 'password123'
   });
   ```

2. **Email'ini kontrol et**
   - Supabase'den gelen email'i aç
   - "Emaili Onayla" linkine tıkla

3. **Link şu formatta olmalı**:
   ```
   quranlearn://auth/callback?token_hash=xxxxx&type=signup
   ```

4. **Uygulama otomatik açılır** ve email doğrulanır

---

## 🚀 4. Production için Ek Ayarlar

### iOS için `app.json` güncellemesi:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.quranlearn.app",
      "associatedDomains": [
        "applinks:your-project-ref.supabase.co"
      ]
    }
  }
}
```

### Android için `app.json` güncellemesi:
```json
{
  "expo": {
    "android": {
      "package": "com.quranlearn.app",
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "your-project-ref.supabase.co",
              "pathPrefix": "/auth/v1/callback"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

---

## 🔍 Troubleshooting

### Email linki çalışmıyor
1. Supabase Dashboard'da **Redirect URLs**'i kontrol et
2. `quranlearn://auth/callback` eklendiğinden emin ol
3. Email template'inde `{{ .TokenHash }}` kullanıldığından emin ol

### Uygulama açılmıyor
1. `app.json`'da `scheme: "quranlearn"` var mı?
2. Uygulamayı **restart** et (Metro bundler'ı kapat ve tekrar aç)
3. `npx expo start -c` (cache temizle)

### "Invalid token" hatası
1. Email linki **10 dakika içinde** kullanılmalı
2. Link sadece **1 kez** kullanılabilir
3. Yeni bir kayıt yap ve tekrar dene

---

## 📝 Login/Register Flow

### Register (Kayıt)
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    emailRedirectTo: 'quranlearn://auth/callback',
  }
});

if (error) {
  alert('Kayıt hatası: ' + error.message);
} else {
  alert('✅ Kayıt başarılı! Emailini kontrol et.');
}
```

### Verify Email (Email Doğrulama)
- Kullanıcı email linkine tıklar
- `quranlearn://auth/callback?token_hash=xxx&type=signup` açılır
- `app/auth/callback.tsx` otomatik handle eder
- ✅ Email doğrulanır!

### Login (Giriş)
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

if (error) {
  alert('Giriş hatası: ' + error.message);
} else {
  alert('✅ Giriş başarılı!');
  // Kullanıcıyı ana sayfaya yönlendir
  router.replace('/(tabs)');
}
```

---

## ✅ Checklist

- [ ] Supabase Dashboard → URL Configuration → Site URL: `quranlearn://`
- [ ] Redirect URLs: `quranlearn://auth/callback` eklendi
- [ ] Email template güncellendi (opsiyonel)
- [ ] `app/auth/callback.tsx` oluşturuldu
- [ ] `app.json`'da `scheme: "quranlearn"` var
- [ ] Test kaydı yapıldı ve email linki tıklandı
- [ ] Email başarıyla doğrulandı

---

## 📚 Ek Kaynaklar

- [Supabase Auth Deep Linking](https://supabase.com/docs/guides/auth/native-mobile-deep-linking)
- [Expo Linking](https://docs.expo.dev/guides/linking/)
- [Expo Router Deep Linking](https://docs.expo.dev/router/reference/linking/)

---

**Son Güncelleme**: 2024
**Durum**: ✅ Yapılandırma Tamamlandı

