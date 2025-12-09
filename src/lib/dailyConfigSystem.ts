export interface DailyGoalConfig {
    target_lessons: number;
    target_tests: number;
    reward_lessons: number;
    reward_tests: number;
}

/**
 * STRATEJİ: Basit Sayaçlar için Dinamik Yapı
 *
 * "daily_tasks" tablosu gibi karmaşık ilişkisel bir yapı yerine,
 * sadece GÜNLÜK HEDEFLERİ tutan basit bir yapı kurabiliriz.
 *
 * 1. `daily_configs` Tablosu
 *    - Bu tablo her gün için (veya genel) hedefleri tutar.
 *
 * CREATE TABLE daily_configs (
 *   id SERIAL PRIMARY KEY,
 *   active_date DATE DEFAULT CURRENT_DATE, -- Hangi gün için geçerli
 *   config JSONB NOT NULL -- Hedef sayıları burada
 * );
 *
 * Örnek Veri:
 * {
 *   "targets": { "lesson": 3, "test": 5 },
 *   "rewards": { "lesson": 50, "test": 100 }
 * }
 *
 * 2. Uygulama Mantığı (Adımlar):
 *    A. Uygulama açılırken (Splash/Home) `daily_configs` tablosundan bugünün konfigürasyonunu çeker.
 *    B. Zustand store'una (`UserSlice`) bu hedefleri kaydeder (`dailyTargets`).
 *       - Şu anki `dailyProgress` sadece yapılanı tutuyor. Yanına `dailyTargets` eklenir.
 *    C. `DailyTasks.tsx` bileşeni, hardcoded "2" ve "3" yerine store'daki bu değerleri kullanır.
 *
 * AVANTAJLARI:
 * - Tablo join'leri ile uğraşmazsınız.
 * - Admin panelinden tek bir JSON güncelleyerek yarınki hedefi "5 Ders" yapabilirsiniz.
 * - Kullanıcı bazlı (A/B testi) yapmak isterseniz JSON içine kural eklenebilir.
 */

// Örnek Store Güncellemesi (Taslak)
/*
interface UserSlice {
    // ...
    dailyTargets: {
        lessonCount: number;
        testCount: number;
        lessonReward: number;
        testReward: number;
    }
}
*/
