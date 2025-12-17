import { colors } from '@/constants/colors';
import { BookOpen, HandPalm, Star } from 'phosphor-react-native';

export const namazBilgisi = [
    {
        id: 301,
        title: {
            tr: 'Namaz Nedir?',
            en: 'What is Salah?'
        },
        description: {
            tr: 'Namazın anlamı ve önemi',
            en: 'The meaning and importance of Salah'
        },
        content: {
            tr: `Namaz, İslam’ın beş temel ibadetinden biridir ve Müslüman’ın Allah ile kurduğu en düzenli ve sürekli ibadet ilişkisidir. Günün belirli vakitlerinde yerine getirilir ve kulun hem bedeniyle hem de kalbiyle Allah’a yönelmesini sağlar.

Namaz, yalnızca belirli hareketlerin tekrar edilmesi değildir. İçinde duruş, eğilme, secde ve oturuş gibi fiziksel eylemler bulunur; fakat bu eylemler, Allah’ı anma, O’na hamd etme ve kulluğu ifade etme amacı taşır. Bu yönüyle namaz, beden, dil ve kalbin birlikte katıldığı kapsamlı bir ibadettir.

İslam’da namaz, kulun günlük hayatın yoğunluğu içinde Allah ile bağını canlı tutmasını sağlar. Günün farklı zamanlarında namaz kılmak, kişiye düzen kazandırır ve hayatın merkezine ibadeti yerleştirir. Bu düzen, sadece ibadet bilincini değil, aynı zamanda sorumluluk ve disiplin duygusunu da güçlendirir.

Akıllı ve ergenlik çağına ulaşmış her Müslüman için namaz farzdır. Namaz, kişinin imanını canlı tutmasına, yanlışlardan sakınmasına ve manevi farkındalığının artmasına vesile olur. Bu sebeple namaz, İslam’da vazgeçilmez bir ibadet olarak kabul edilir.

Namazın kimlere farz olduğu, hangi şartlarda kılındığı ve nasıl yerine getirildiği gibi konular, ilerleyen derslerde adım adım ele alınacaktır.

📌 Dersin amacı:
Bu ders, namazın ne olduğunu ve neden önemli olduğunu kavratmayı hedefler.
Detaylı uygulama ve kurallar, sonraki derslerde açıklanacaktır.`,
            en: `Salah (ritual prayer) is one of the five fundamental pillars of Islam and represents the most regular and continuous act of worship establishing a bond between a Muslim and Allah. Performed at specific times of the day, it allows the servant to turn towards Allah with both their body and heart.

Salah is not merely the repetition of certain movements. It involves physical actions such as standing, bowing, prostrating, and sitting; however, these actions serve the purpose of remembering Allah, praising Him, and expressing servitude. In this respect, Salah is a comprehensive act of worship in which the body, tongue, and heart participate together.

In Islam, Salah enables the servant to keep their connection with Allah alive amidst the busyness of daily life. Performing ritual prayers at different times of the day brings order to a person's life and places worship at its center. This order strengthens not only the consciousness of worship but also the sense of responsibility and discipline.

Salah is obligatory (fard) for every Muslim who has reached the age of puberty and possesses a sound mind. It serves as a means for a person to keep their faith alive, refrain from wrongdoing, and increase their spiritual awareness. For this reason, Salah is considered an indispensable act of worship in Islam.

Topics such as who is obligated to perform Salah, the conditions under which it is performed, and how it is carried out will be discussed step by step in the following lessons.

📌 Purpose of the lesson:
This lesson aims to provide an understanding of what Salah is and why it is important.
Detailed practices and rules will be explained in subsequent lessons.`
        },
        level: 1,
        unlocked: true,
        color: colors.success,
        borderColor: colors.buttonGreenBorder,
        icon: HandPalm,
        route: '/lessons/namaz-bilgisi/301',
    },
    {
        id: 302,
        title: {
            tr: 'Namaz Kimlere Farzdır?',
            en: 'Who is Obliged to Perform Salah?'
        },
        description: {
            tr: 'Namazın farz olma şartları',
            en: 'Conditions for Salah to be obligatory'
        },
        content: {
            tr: `Namaz, İslam’da belirli şartları taşıyan Müslümanlara farz kılınmış bir ibadettir. Herkes için aynı sorumluluk geçerli değildir; namazın farz olması bazı temel şartlara bağlıdır.

Öncelikle namaz, Müslüman olan kişiler için geçerlidir. İslam’a inanmayan bir kimse namazla sorumlu tutulmaz. Namaz, imanla anlam kazanan bir ibadet olduğu için, bu sorumluluğun temeli imandır.

Namazın farz olabilmesi için kişinin akıllı olması gerekir. Akıl sağlığı yerinde olmayan kişiler, ibadetle sorumlu tutulmaz. Aynı şekilde ergenlik çağına ulaşmamış çocuklar için namaz farz değildir. Ancak çocukların küçük yaşlardan itibaren namaza alıştırılması, İslam’da tavsiye edilen bir davranıştır.

Hastalık, yolculuk veya yaşlılık gibi durumlar, namazın farz olma hükmünü ortadan kaldırmaz. Bu gibi durumlarda namazın kılınış şekli değişebilir; ancak namaz sorumluluğu devam eder. Kişi gücü yettiği ölçüde namazını yerine getirir.

Kadın ve erkek arasında namaz sorumluluğu bakımından bir fark yoktur. Her iki cinsiyet için de namaz, aynı şartlar altında farzdır.

Sonuç olarak namaz, Müslüman, akıllı ve ergenlik çağına ulaşmış her birey için farz bir ibadettir. Özel durumlar namazı terk etmeyi değil, kolaylaştırmayı gerektirir.

📌 Dersin amacı:
Bu ders, namazın kimler için farz olduğunu ve kimlerin bu sorumluluğun dışında kaldığını netleştirmeyi amaçlar.`,
            en: `Salah is an act of worship obligated (fard) in Islam for Muslims who meet specific conditions. The responsibility is not the same for everyone; the obligation of Salah depends on some fundamental conditions.

Firstly, Salah applies to those who are Muslim. A person who does not believe in Islam is not held responsible for Salah. Since Salah is an act of worship that gains meaning with faith, the basis of this responsibility is faith.

For Salah to be obligatory, a person must be of sound mind. Individuals who are not mentally sound are not held responsible for worship. Similarly, Salah is not obligatory for children who have not reached the age of puberty. However, accustoming children to Salah from a young age is a recommended behavior in Islam.

Situations such as illness, travel, or old age do not eliminate the ruling of Salah being obligatory. In such cases, the manner of performing Salah may change; however, the responsibility of Salah continues. The person performs their prayer to the extent of their ability.

There is no difference between men and women in terms of the responsibility of Salah. For both genders, Salah is obligatory under the same conditions.

In conclusion, Salah is an obligatory act of worship for every individual who is Muslim, of sound mind, and has reached the age of puberty. Special circumstances require facilitating Salah, not abandoning it.

📌 Purpose of the lesson:
This lesson aims to clarify for whom Salah is obligatory and who is excluded from this responsibility.`
        },
        level: 1,
        unlocked: true,
        color: colors.success,
        borderColor: colors.buttonGreenBorder,
        icon: HandPalm,
        route: '/lessons/namaz-bilgisi/302',
    },
    {
        id: 303,
        title: {
            tr: 'Namazın Şartları',
            en: 'Conditions of Salah'
        },
        description: {
            tr: 'Namaza hazırlık şartları (Dışındaki Farzlar)',
            en: 'Conditions for preparation for Salah (Prerequisites)'
        },
        content: {
            tr: `Namazın geçerli olabilmesi için, namaza başlamadan önce yerine getirilmesi gereken bazı şartlar vardır. Bu şartlar tamamlanmadan kılınan namaz sahih olmaz. Bu nedenle namazın şartları, ibadetin temelini oluşturur.

Namazın şartları, kişinin namaza hazırlık sürecini ifade eder. Bu şartlar, namazın içine değil, namazdan önce yerine getirilir.

**1. Hadesten Taharet (Abdestli Olmak)**
Namaz kılacak kişinin abdestsiz olmaması gerekir. Abdest, namaz için gerekli olan manevi temizliği sağlar. Bazı durumlarda ise gusül abdesti almak gerekir. Abdest veya gusül olmadan namaz kılınmaz.

**2. Necasetten Taharet (Maddi Temizlik)**
Namaz kılarken kişinin bedeni, elbisesi ve namaz kıldığı yer temiz olmalıdır. Üzerinde veya bulunduğu yerde namaza engel olacak bir pislik varsa, namaz geçerli olmaz. Bu şart, namazın hem fiziksel hem de manevi temizliğe dayandığını gösterir.

**3. Setr-i Avret (Örtünme)**
Namazda örtülmesi gereken yerlerin örtülmesi şarttır. Bu örtünme, namazın ciddiyetini ve edebini ifade eder. Örtünme şartı, kişinin namaz sırasında mahremiyetine dikkat etmesini sağlar.

**4. Kıbleye Yönelmek**
Namaz kılarken Kâbe yönüne dönmek gerekir. Kıbleye yönelmek, Müslümanların ibadette birlik içinde olmalarını simgeler. Kıble yönü bilinmiyorsa, kişinin elinden geldiğince yön tayin etmesi yeterlidir.

**5. Vakit**
Her namazın kendine ait belirli bir vakti vardır. Namaz, ancak vakti girdikten sonra kılınabilir. Vakti çıkmadan kılınan namaz geçerli olur; vakti girmeden kılınan namaz ise geçerli sayılmaz.

**6. Niyet**
Namaz kılarken hangi namazın kılındığını kalben belirlemek gerekir. Niyet, sözle ifade edilmek zorunda değildir; esas olan kalpten niyet etmektir. Niyet, yapılan ibadetin bilinçli bir şekilde gerçekleştirildiğini gösterir.

Namazın şartları, namaza başlamadan önce yerine getirilmesi gereken hazırlıklardır. Bu şartlar tamamlandıktan sonra, namazın içindeki farzlar devreye girer.

📌 Dersin amacı:
Bu ders, namazdan önce yerine getirilmesi gereken şartları açıklayarak, namaza bilinçli bir hazırlık yapılmasını sağlamayı hedefler.`,
            en: `For Salah (ritual prayer) to be valid, there are certain conditions that must be fulfilled before starting the prayer. A prayer performed without completing these conditions is not valid. Therefore, the conditions of Salah form the foundation of this worship.

The conditions of Salah refer to the person's preparation process for prayer. These conditions are fulfilled before the prayer, not during it.

**1. Purification from Ritual Impurity**
The person who will perform Salah must not be in a state of ritual impurity. Ablution provides the spiritual cleanliness necessary for Salah. In some cases, full ablution is required. Salah cannot be performed without ablution or full ablution.

**2. Physical Cleanliness**
When performing Salah, the person's body, clothes, and the place of prayer must be clean. If there is any impurity that prevents prayer on the person or in the place, the prayer is not valid. This condition shows that Salah is based on both physical and spiritual cleanliness.

**3. Covering the Awrah**
It is obligatory to cover the parts of the body that need to be covered during Salah. This covering expresses the seriousness and etiquette of the prayer. The condition of covering ensures that the person pays attention to their privacy during prayer.

**4. Facing the Qibla**
When performing Salah, one must turn towards the Kaaba. Facing the Qibla symbolizes the unity of Muslims in worship. If the direction of the Qibla is unknown, it is sufficient for the person to determine the direction to the best of their ability.

**5. Time**
Each Salah has a specific time. Salah can only be performed after its time has entered. A prayer performed before its time exits is valid; a prayer performed before its time enters is not valid.

**6. Intention**
When performing Salah, one must determine in their heart which prayer is being performed. Intention does not have to be expressed verbally; the essential part is to intend from the heart. Intention shows that the act of worship is performed consciously.

The conditions of Salah are preparations that must be fulfilled before starting the prayer. Once these conditions are completed, the obligatory acts within the prayer come into play.

📌 Purpose of the lesson:
This lesson aims to ensure a conscious preparation for Salah by explaining the conditions that must be fulfilled before prayer.`
        },
        level: 1,
        unlocked: true,
        color: colors.success,
        borderColor: colors.buttonGreenBorder,
        icon: HandPalm,
        route: '/lessons/namaz-bilgisi/303',
    },
    {
        id: 304,
        title: {
            tr: 'Namazın Farzları (1)',
            en: 'Obligatory Acts of Salah (1)'
        },
        description: {
            tr: 'Namazdan Önceki Farzlar',
            en: 'Prerequisites (Obligatory acts before Salah)'
        },
        content: {
            tr: `Namazın farzları, namazın geçerli olabilmesi için mutlaka yerine getirilmesi gereken temel hükümlerdir. Bu farzlardan biri eksik olursa, namaz sahih olmaz.

Namazın farzları iki gruba ayrılır:
Namazdan önce yerine getirilen farzlar
Namazın içinde yerine getirilen farzlar

Bu derste, namaza başlamadan önce tamamlanması gereken farzlar ele alınacaktır.

**1. Hadesten Taharet**
Hadesten taharet, namaz kılacak kişinin abdestsiz olmaması anlamına gelir. Abdest, namaz için gerekli olan manevi temizliği sağlar. Bazı durumlarda ise gusül abdesti almak farzdır. Abdest veya gusül olmadan kılınan namaz geçerli değildir.

Bu farz, namazın sadece fiziksel değil, aynı zamanda manevi bir hazırlık gerektirdiğini gösterir.

**2. Necasetten Taharet**
Necasetten taharet, kişinin bedeni, elbisesi ve namaz kıldığı yerin temiz olması demektir. Namaza engel olacak bir pislik bulunuyorsa, namaz sahih olmaz.

Bu farz, namazın temizlik ve düzen üzerine kurulu bir ibadet olduğunu hatırlatır.

**3. Setr-i Avret**
Setr-i avret, namazda örtülmesi gereken yerlerin örtülmesi anlamına gelir. Bu örtünme, namazın edebine ve ciddiyetine uygun olmalıdır.

Setr-i avret şartı, kişinin namaz esnasında hem kendisine hem de ibadete saygı göstermesini ifade eder.

**4. Kıbleye Yönelmek**
Namaz kılarken Kâbe yönüne dönmek farzdır. Kıbleye yönelmek, Müslümanların ibadette birlik içinde olmalarını simgeler.

Kıble yönü bilinmiyorsa, kişinin elinden geldiğince doğru yönü bulmaya çalışması yeterlidir.

**5. Vakit**
Her namazın kendine ait bir vakti vardır. Namaz, vakti girdikten sonra kılınabilir. Vakti girmeden kılınan namaz geçerli değildir.

Bu farz, namazın belli bir düzen ve zaman bilinci içinde yerine getirildiğini gösterir.

**6. Niyet**
Niyet, kılınacak namazın hangi namaz olduğunu kalben belirlemektir. Niyetin dil ile söylenmesi şart değildir; esas olan kalpten niyet etmektir.

Niyet, yapılan ibadetin bilinçli ve farkında olarak gerçekleştirildiğini ifade eder.

Namazdan önceki farzlar, namaza hazırlık aşamasını oluşturur. Bu hazırlık tamamlandıktan sonra, namazın içindeki farzlar yerine getirilir.

📌 Dersin amacı:
Bu ders, namaza başlamadan önce yerine getirilmesi gereken farzları açıklayarak, namazın bilinçli ve geçerli bir şekilde kılınmasını sağlamayı hedefler.`,
            en: `The obligatory acts (fard) of Salah are fundamental rulings that must be fulfilled for the prayer to be valid. If one of these obligatory acts is missing, the prayer is not valid.

The obligatory acts of Salah are divided into two groups:
Obligatory acts performed before Salah
Obligatory acts performed within Salah

In this lesson, the obligatory acts that must be completed before starting Salah will be discussed.

**1. Purification from Ritual Impurity**
Purification from ritual impurity means that the person who will perform Salah must not be in a state of ritual impurity. Ablution provides the spiritual cleanliness necessary for Salah. In some cases, full ablution is obligatory. A prayer performed without ablution or full ablution is not valid.

This obligatory act shows that Salah requires not only physical but also spiritual preparation.

**2. Physical Cleanliness**
Physical cleanliness means that the person's body, clothes, and the place of prayer must be clean. If there is any impurity that prevents prayer, the prayer is not valid.

This obligatory act reminds us that Salah is an act of worship based on cleanliness and order.

**3. Covering the Awrah**
Covering the awrah means covering the parts of the body that need to be covered during Salah. This covering must be appropriate to the etiquette and seriousness of the prayer.

The condition of covering the awrah expresses the person's respect for both themselves and the act of worship during prayer.

**4. Facing the Qibla**
It is obligatory to turn towards the Kaaba when performing Salah. Facing the Qibla symbolizes the unity of Muslims in worship.

If the direction of the Qibla is unknown, it is sufficient for the person to try to find the correct direction to the best of their ability.

**5. Time**
Each Salah has its own specific time. Salah can be performed after its time has entered. A prayer performed before its time enters is not valid.

This obligatory act shows that Salah is performed within a certain order and time consciousness.

**6. Intention**
Intention is determining in the heart which prayer is to be performed. It is not a condition to say the intention with the tongue; the essential part is to intend from the heart.

Intention expresses that the act of worship is performed consciously and with awareness.

The obligatory acts before Salah constitute the preparation phase for prayer. After this preparation is completed, the obligatory acts within the prayer are performed.

📌 Purpose of the lesson:
This lesson aims to ensure that Salah is performed consciously and validly by explaining the obligatory acts that must be fulfilled before starting Salah.`
        },
        level: 1,
        unlocked: true,
        color: colors.success,
        borderColor: colors.buttonGreenBorder,
        icon: HandPalm,
        route: '/lessons/namaz-bilgisi/304',
    },
    {
        id: 305,
        title: {
            tr: 'Namazın Farzları (2)',
            en: 'Obligatory Acts of Salah (2)'
        },
        description: {
            tr: 'Namazın İçindeki Farzlar',
            en: 'Essentials (Obligatory acts within Salah)'
        },
        content: {
            tr: `Namazın içindeki farzlar, namaz başladıktan sonra yerine getirilmesi gereken temel unsurlardır. Bu farzlar, namazın asıl yapısını oluşturur. Namazın içindeki farzlardan biri eksik olursa, namaz geçerli olmaz.

Bu farzlar, namaza iftitah tekbiriyle girildikten sonra yerine getirilir ve namazın akışı bu farzlar üzerine kuruludur.

**1. İftitah Tekbiri**
Namaza “Allahu Ekber” diyerek başlamak farzdır. Bu tekbirle birlikte kişi, namaz dışındaki tüm davranışlardan ayrılır ve namazın içine girmiş olur.

İftitah tekbiri alınmadan namaz başlamış sayılmaz.

**2. Kıyam**
Kıyam, namazda ayakta durmaktır. Gücü yeten kişi için kıyam farzdır. Ayakta durmaya gücü olmayanlar ise durumlarına uygun şekilde namaz kılarlar.

Kıyam, kulun Allah’ın huzurunda durduğunu ifade eden temel duruştur.

**3. Kıraat**
Kıraat, namazda Kur’an’dan okumaktır. Namazın ayakta durulan bölümünde Kur’an’dan okunması farzdır. Okumanın doğru ve anlaşılır olması gerekir.

Kıraat, namazın Allah’ın kelamıyla yapılan yönünü temsil eder.

**4. Rükû**
Rükû, belden eğilerek yapılan duruştur. Bu duruşta kısa bir süre durmak gerekir. Rükû, kulun Allah karşısında tevazu göstermesini ifade eder.

Rükû yapılmadan namazın farzları tamamlanmış olmaz.

**5. Secde**
Secde, alnı ve burnu yere koyarak yapılan duruştur. Namazda iki secde yapmak farzdır. Secde, namazın en önemli ve en derin anlam taşıyan bölümlerinden biridir.

Secde, kulun Allah’a en yakın olduğu an olarak kabul edilir.

**6. Ka‘de-i Ahîre (Son Oturuş)**
Namazın sonunda, belirli bir süre oturmak farzdır. Bu oturuşta namaz tamamlanmaya yaklaşır ve selamdan önceki son aşama gerçekleşir.

Son oturuş yapılmadan namaz tamamlanmış sayılmaz.

Namazın içindeki farzlar, namazın iskeletini oluşturur. Bu farzlar yerine getirildiğinde namaz geçerli olur. Ancak namazın daha güzel ve bilinçli kılınabilmesi için vacipler ve sünnetler de büyük önem taşır.

📌 Dersin amacı:
Bu ders, namazın içinde mutlaka yerine getirilmesi gereken farzları tanıtarak, namazın temel yapısını kavratmayı amaçlar.`,
            en: `The obligatory acts (fard) within Salah are the fundamental elements that must be fulfilled after the prayer has started. These acts form the actual structure of the prayer. If one of these obligatory acts within Salah is missing, the prayer is not valid.

These acts are performed after entering the prayer with the Opening Takbir, and the flow of the prayer is built upon them.

**1. Opening Takbir**
It is obligatory to start the prayer by saying "Allahu Akbar". With this Takbir, the person separates themselves from all behaviors outside of prayer and enters into the prayer.

The prayer is not considered to have started without the Opening Takbir.

**2. Standing**
This refers to standing during the prayer. Standing is obligatory for those who have the ability. Those who are unable to stand perform the prayer in a manner suitable to their condition.

Standing is the fundamental posture expressing that the servant is standing in the presence of Allah.

**3. Recitation**
This refers to reading from the Quran during the prayer. It is obligatory to read from the Quran during the standing part of the prayer. The reading must be correct and understandable.

Recitation represents the aspect of prayer performed with the word of Allah.

**4. Bowing**
This is the posture made by bending from the waist. It is necessary to remain in this posture for a short time. Bowing expresses the servant's humility before Allah.

The obligatory acts of Salah are not completed without performing the bowing.

**5. Prostration**
This is the posture made by placing the forehead and nose on the ground. It is obligatory to perform two prostrations in prayer. Prostration is one of the most important and deeply meaningful parts of the prayer.

Prostration is accepted as the moment when the servant is closest to Allah.

**6. Final Sitting**
It is obligatory to sit for a specific duration at the end of the prayer. In this sitting, the prayer approaches completion, and the final stage before the Salams takes place.

The prayer is not considered completed without performing the final sitting.

The obligatory acts within Salah form the skeleton of the prayer. When these acts are fulfilled, the prayer becomes valid. However, necessary (wajib) and Sunnah acts are also of great importance for the prayer to be performed more beautifully and consciously.

📌 Purpose of the lesson:
This lesson aims to provide an understanding of the basic structure of Salah by introducing the obligatory acts that must be fulfilled within the prayer.`
        },
        level: 1,
        unlocked: true,
        color: colors.success,
        borderColor: colors.buttonGreenBorder,
        icon: HandPalm,
        route: '/lessons/namaz-bilgisi/305',
    },
    {
        id: 306,
        title: {
            tr: 'Namazın Vacipleri',
            en: 'Necessary Acts of Salah (Wajib)'
        },
        description: {
            tr: 'Namazın eksiksiz olması için gerekenler',
            en: 'Essentials for a complete Salah'
        },
        content: {
            tr: `Namazın vacipleri, namazın farzları kadar temel olmamakla birlikte, namazın doğru ve eksiksiz kılınması için yerine getirilmesi gereken hususlardır. Vacipler, farz ile sünnet arasında yer alır.

Vaciplerden biri kasten terk edilirse namaz geçersiz olur. Yanılarak terk edilirse, namaz bozulmaz; ancak bu eksiklik sehiv secdesiyle telafi edilir. Bu yönüyle vacipler, namazda dikkat edilmesi gereken önemli unsurlardır.

**Vacip ile Farz Arasındaki Fark**
Farzlar, namazın olmazsa olmazlarıdır ve eksik bırakıldığında namaz geçerli olmaz.
Vacipler ise namazın düzenini ve bütünlüğünü sağlar.

Bu nedenle vacipler, “önemsiz” değil; bilinçli şekilde yerine getirilmesi gereken hükümlerdir.

**Namazın Başlıca Vacipleri**
Aşağıda namazda en çok karşılaşılan vacipler yer almaktadır:

**Fâtiha Suresi’ni okumak**
Namazda Fâtiha Suresi’nin okunması vaciptir.

**Fâtiha’dan sonra Kur’an’dan bir sure veya ayet okumak**
Farz namazların ilk iki rekâtında ve sünnet namazlarda Fâtiha’dan sonra ek okuma yapılır.

**Secdede ve rükûda tam durmak**
Bu duruşlarda acele etmeden kısa bir süre durmak gerekir.

**İki secde arasında oturmak**
Secdeler arasında kısa bir oturuş yapmak vaciptir.

**Son oturuşta Ettehiyyatü’yü okumak**
Namazın sonunda yapılan oturuşta Ettehiyyatü duasının okunması vaciptir.

**Namazda sıraya riayet etmek**
Namazın bölümleri, belirlenen sıraya göre yapılmalıdır.

**Selam ile namazdan çıkmak**
Namaz, sağa ve sola selam verilerek tamamlanır.

**Vacip Terk Edilirse Ne Olur?**
Vaciplerden biri bilerek terk edilirse, namaz bozulur ve yeniden kılınması gerekir.
Vacip unutularak veya yanılarak terk edilirse, namazın sonunda sehiv secdesi yapılır.

Bu durum, namazda dikkatli olmanın önemini gösterir.

Namazın vacipleri, namazın daha düzgün, bilinçli ve eksiksiz kılınmasını sağlar. Farzlar namazın temelini oluştururken, vacipler bu temelin sağlam ve düzenli olmasına katkı sunar.

📌 Dersin amacı:
Bu ders, namazın vaciplerini ve bunların neden önemli olduğunu kavratmayı hedefler.`,
            en: `The necessary acts (wajib) of Salah are matters that must be fulfilled for the prayer to be performed correctly and completely, although they are not as fundamental as the obligatory acts. Necessary acts fall between obligatory acts and Sunnah acts.

If one of the necessary acts is omitted intentionally, the prayer becomes invalid. If omitted by mistake, the prayer is not broken; however, this deficiency is compensated by the prostration of forgetfulness (sehiv secdesi). In this respect, necessary acts are important elements that require attention in prayer.

**Difference Between Necessary and Obligatory Acts**
Obligatory acts are the essentials of prayer, and if omitted, the prayer is not valid.
Necessary acts ensure the order and integrity of the prayer.

Therefore, necessary acts are not "unimportant"; they are rulings that must be fulfilled consciously.

**Principal Necessary Acts of Salah**
The most common necessary acts encountered in prayer are listed below:

**Reading Surah Al-Fatiha**
It is necessary to read Surah Al-Fatiha in prayer.

**Reading a Surah or Verse after Fatiha**
In the first two rak'ahs of obligatory prayers and in Sunnah prayers, additional recitation is performed from the Quran after Fatiha.

**Standing Fully in Prostration and Bowing**
It is necessary to remain for a short time in these postures without rushing.

**Sitting Between Two Prostrations**
It is necessary to sit briefly between prostrations.

**Reading At-Tahiyyat in the Final Sitting**
It is necessary to read the At-Tahiyyat supplication in the sitting performed at the end of the prayer.

**Observing Order in Prayer**
The parts of the prayer must be performed according to the determined order.

**Exiting Prayer with Salam**
The prayer is completed by giving Salam to the right and left.

**What Happens If a Necessary Act Is Omitted?**
If one of the necessary acts is omitted intentionally, the prayer is broken and must be performed again.
If a necessary act is omitted forgetfully or by mistake, the prostration of forgetfulness is performed at the end of the prayer.

This situation shows the importance of being careful in prayer.

The necessary acts of Salah ensure that the prayer is performed more properly, consciously, and completely. While obligatory acts form the foundation of prayer, necessary acts contribute to this foundation being solid and orderly.

📌 Purpose of the lesson:
This lesson aims to provide an understanding of the necessary acts of Salah and why they are important.`
        },
        level: 1,
        unlocked: true,
        color: colors.success,
        borderColor: colors.buttonGreenBorder,
        icon: HandPalm,
        route: '/lessons/namaz-bilgisi/306',
    },
    {
        id: 307,
        title: {
            tr: 'Namazın Sünnetleri',
            en: 'Sunnah Acts of Salah'
        },
        description: {
            tr: 'Namazı güzelleştiren uygulamalar',
            en: 'Practices that beautify Salah'
        },
        content: {
            tr: `Namazın sünnetleri, Peygamber Efendimiz’in (s.a.v.) namazda düzenli olarak yaptığı ve tavsiye ettiği uygulamalardır. Sünnetler, namazın geçerliliği için farz ve vacipler kadar zorunlu değildir; ancak namazın daha güzel, daha bilinçli ve daha faziletli kılınmasını sağlar.

Sünnetler, namazın ruhunu ve edebini tamamlayan unsurlardır. Farzlar namazın iskeletini oluştururken, sünnetler bu iskeleti güzelleştirir.

**Sünnet Nedir?**
Sünnet, Peygamber Efendimiz’in sözleri, davranışları ve onayladığı uygulamalardır. Namazdaki sünnetler de, Resûlullah’ın namazı nasıl kıldığını bize gösteren örneklerdir.

Bu nedenle sünnetlere uymak, sadece bir alışkanlık değil; bilinçli bir tercih ve Peygamber’e bağlılık göstergesidir.

**Namazdaki Başlıca Sünnetler**
Namazda yaygın olarak bilinen bazı sünnetler şunlardır:

**Namaza başlarken elleri kaldırmak**
İftitah tekbiri alırken ellerin kaldırılması sünnettir.

**Sübhaneke duasını okumak**
Namazın başında Sübhaneke duasının okunması sünnettir.

**Eûzü–Besmele çekmek**
Fâtiha’dan önce Eûzü–Besmele okunması sünnettir.

**Rükû ve secdelerde tesbihleri üçten fazla söylemek**
Asgari ölçü yerine, daha fazla tesbih söylemek sünnettir.

**Rükûdan doğrulurken ve secdeler arasında dua etmek**
Bu bölümlerde yapılan dualar sünnettir.

**Oturma şekline dikkat etmek**
Namazda oturuşlarda edebe uygun şekilde oturmak sünnettir.

**Sünnetlerin Namazdaki Yeri**
Sünnetler terk edilirse namaz bozulmaz. Ancak sünnetlerin sürekli terk edilmesi, namazın ruhunu zayıflatır. Sünnetlere dikkat etmek, namazı sadece bir görev olmaktan çıkarıp bilinçli bir ibadete dönüştürür.

Farzlar olmadan namaz olmaz; vacipler namazın düzenini sağlar; sünnetler ise namazı tam ve güzel hale getirir.

Namazın sünnetleri, ibadeti Peygamberimizin örnekliğine uygun şekilde yerine getirmeye yardımcı olur. Bu da namazın hem şekil hem de anlam bakımından zenginleşmesini sağlar.

📌 Dersin amacı:
Bu ders, namazın sünnetlerini tanıtarak, namazı daha bilinçli ve özenli kılma alışkanlığı kazandırmayı hedefler.`,
            en: `The Sunnah acts of Salah are practices that the Prophet (pbuh) regularly performed and recommended in prayer. Sunnah acts are not as mandatory as obligatory (fard) and necessary (wajib) acts for the validity of the prayer; however, they ensure that the prayer is performed more beautifully, consciously, and virtuously.

Sunnah acts are elements that complete the spirit and etiquette of the prayer. While obligatory acts form the skeleton of the prayer, Sunnah acts beautify this skeleton.

**What is Sunnah?**
Sunnah refers to the words, actions, and approved practices of the Prophet. Sunnah acts in prayer are examples showing us how the Messenger of Allah performed the prayer.

Therefore, following the Sunnah is not just a habit; it is a conscious choice and a sign of devotion to the Prophet.

**Principal Sunnah Acts in Salah**
Some of the commonly known Sunnah acts in prayer are as follows:

**Raising Hands When Starting Prayer**
Raising the hands while saying the Opening Takbir is Sunnah.

**Reading the Subhanaka Supplication**
Reading the Subhanaka supplication at the beginning of the prayer is Sunnah.

**Reciting Isti'adhah and Basmalah**
Reciting Isti'adhah and Basmalah before Fatiha is Sunnah.

**Saying Tasbihs More Than Three Times in Bowing and Prostration**
Saying tasbihs more than the minimum amount is Sunnah.

**Supplicating When Rising from Bowing and Between Prostrations**
Supplications made in these parts are Sunnah.

**Paying Attention to Sitting Posture**
Sitting in accordance with proper etiquette during the sittings in prayer is Sunnah.

**The Place of Sunnahs in Salah**
If Sunnah acts are omitted, the prayer is not broken. However, constantly omitting Sunnah acts weakens the spirit of the prayer. Paying attention to Sunnah acts transforms prayer from being just a duty into a conscious act of worship.

There is no prayer without obligatory acts; necessary acts ensure the order of the prayer; and Sunnah acts make the prayer complete and beautiful.

The Sunnah acts of Salah help to perform the worship in accordance with the example of our Prophet. This enriches the prayer in terms of both form and meaning.

📌 Purpose of the lesson:
This lesson aims to instill the habit of performing prayer more consciously and carefully by introducing the Sunnah acts of Salah.`
        },
        level: 1,
        unlocked: true,
        color: colors.success,
        borderColor: colors.buttonGreenBorder,
        icon: HandPalm,
        route: '/lessons/namaz-bilgisi/307',
    },
    {
        id: 308,
        title: {
            tr: 'Namazı Bozan Şeyler',
            en: 'Things That Invalidate Salah'
        },
        description: {
            tr: 'Namazı geçersiz kılan durumlar',
            en: 'Acts that invalidate Salah'
        },
        content: {
            tr: `Namaz kılarken yapılan bazı davranışlar, namazın geçersiz olmasına sebep olur. Bu tür durumlara “namazı bozan şeyler” denir. Bu davranışlardan biri gerçekleştiğinde namaz sona erer ve yeniden kılınması gerekir.

Namazı bozan durumlar genellikle bilerek yapılanlar ve namazla bağdaşmayan davranışlar olarak öne çıkar. Bu ders, namaz sırasında nelerden kaçınılması gerektiğini netleştirmeyi amaçlar.

**1. Konuşmak**
Namaz kılarken bilerek konuşmak namazı bozar. Az veya çok olması fark etmez; namazla ilgisi olmayan bir söz, namazın geçersiz olmasına sebep olur.

Yanılarak veya unutularak söylenen kısa ifadeler de namazın bozulmasına yol açar.

**2. Gülmek**
Namaz esnasında kahkaha ile gülmek namazı bozar. Hatta bazı durumlarda abdesti de bozar. Hafif tebessüm ise namazı bozmaz; ancak namazın ciddiyetine aykırıdır.

**3. Yeme ve İçme**
Namaz sırasında bilerek bir şey yemek veya içmek namazı bozar. Ağızda kalan küçük bir yiyecek parçasının yutulması da namazın geçersiz olmasına sebep olabilir.

**4. Abdesti Bozan Bir Durumun Meydana Gelmesi**
Namaz esnasında abdesti bozan bir durum gerçekleşirse, namaz da bozulur. Bu durumda namaz bırakılır, abdest tazelenir ve namaz yeniden kılınır.

**5. Namaz Dışında Sayılan Büyük Hareketler**
Namazla ilgisi olmayan ve dışarıdan bakıldığında namaz kılmadığı izlenimi veren büyük hareketler namazı bozar. Örneğin, yer değiştirmek veya gereksiz şekilde uzun süre hareket etmek bu kapsamdadır.

**6. Kıbleye Sırtını Dönmek**
Bilerek kıble yönünden tamamen dönmek namazı bozar. Kıbleye yönelmek namazın temel şartlarından biridir.

**7. Namazda Okunması Gerekenleri Bilerek Terk Etmek**
Namazda yapılması farz veya vacip olan bir davranışı bilerek terk etmek, namazın bozulmasına sebep olur.

Namazı bozan şeyleri bilmek, namaz sırasında daha dikkatli olunmasını sağlar. Bu bilgiler, namazın geçerliliğini korumak açısından büyük önem taşır.

📌 Dersin amacı:
Bu ders, namazı geçersiz kılan durumları tanıtarak, namazın bilinçli ve dikkatli şekilde kılınmasını sağlamayı hedefler.`,
            en: `Certain actions performed during Salah cause the prayer to be invalid. These situations are called "things that invalidate Salah". When one of these actions occurs, the prayer ends and must be performed again.

Situations that invalidate Salah usually stand out as intentional actions and behaviors incompatible with prayer. This lesson aims to clarify what should be avoided during Salah.

**1. Speaking**
Speaking intentionally during Salah invalidates the prayer. It does not matter if it is a little or a lot; a word unrelated to prayer causes the prayer to be invalid.

Short phrases said by mistake or forgetfully also lead to the invalidation of the prayer.

**2. Laughing**
Laughing with a loud voice (laughter) during Salah invalidates the prayer. In some cases, it even invalidates the ablution. A slight smile does not invalidate the prayer; however, it is contrary to the seriousness of the prayer.

**3. Eating and Drinking**
Eating or drinking something intentionally during Salah invalidates the prayer. Swallowing a small piece of food remaining in the mouth can also cause the prayer to be invalid.

**4. Breaking Ablution**
If a situation invalidating ablution occurs during Salah, the prayer is also invalidated. In this case, the prayer is abandoned, ablution is renewed, and the prayer is performed again.

**5. Excessive Movement**
Major movements unrelated to prayer that give the impression to an outsider that the person is not praying invalidate the prayer. For example, changing places or moving for an unnecessarily long time falls into this scope.

**6. Turning Away from the Qibla**
Turning one's back completely away from the Qibla direction intentionally invalidates the prayer. Facing the Qibla is one of the fundamental conditions of Salah.

**7. Intentionally Omitting Obligatory Acts**
Intentionally abandoning an action that is obligatory or necessary in Salah causes the prayer to be broken.

Knowing the things that invalidate Salah ensures more care during prayer. This information is of great importance for maintaining the validity of the prayer.

📌 Purpose of the lesson:
This lesson aims to ensure that Salah is performed consciously and carefully by introducing the situations that invalidate the prayer.`
        },
        level: 1,
        unlocked: true,
        color: colors.success,
        borderColor: colors.buttonGreenBorder,
        icon: HandPalm,
        route: '/lessons/namaz-bilgisi/308',
    },
    {
        id: 309,
        title: {
            tr: 'Namazda Yapılan Yaygın Hatalar (1)',
            en: 'Common Mistakes in Salah (1)'
        },
        description: {
            tr: 'Fiziksel Hatalar',
            en: 'Physical Mistakes'
        },
        content: {
            tr: `Namaz kılarken yapılan hataların bir kısmı, doğrudan bedenle yapılan davranışlardan kaynaklanır. Bu hatalar çoğu zaman fark edilmeden alışkanlık hâline gelir ve namazın ruhunu zayıflatır.

Bu derste, namaz sırasında en sık karşılaşılan fiziksel hatalar ele alınacaktır.

**1. Namazı Aceleyle Kılmak**
Namazı hızlıca bitirme isteği, en yaygın hatalardan biridir. Rükû ve secdelerde yeterince durmadan yapılan namaz, şeklen tamamlanmış gibi görünse de gereken huzur ve dikkat sağlanamaz.

Namaz, aceleyle geçilecek bir görev değil; bilinçle yerine getirilecek bir ibadettir.

**2. Rükû ve Secdede Yeterince Durmamak**
Rükû ve secde, namazın en önemli duruşlarıdır. Bu duruşlarda kısa da olsa durmak gerekir. Eğilip doğrulmak veya secdeye kapanıp hemen kalkmak, namazın düzenini bozar.

Bu hata çoğu zaman fark edilmeden yapılır.

**3. Duruş Bozuklukları**
Namazda ayakta dururken, rükûda veya secdede bedenin olması gereken hâlinden çok uzak durması da yaygın bir hatadır. Özellikle rükûda sırtın tamamen eğilmemesi veya secdede doğru temas noktalarının ihmal edilmesi bu kapsamdadır.

Duruşlar, namazın edebini ve ciddiyetini yansıtır.

**4. Gereksiz ve Sürekli Hareket Etmek**
Namaz sırasında kıyafetle oynamak, etrafa bakmak veya sürekli yer değiştirmek namazın huzurunu bozar. Büyük hareketler namazı bozabileceği gibi, küçük ama sürekli hareketler de namazın anlamını zayıflatır.

**5. Oturuşlara Dikkat Etmemek**
İki secde arasındaki oturuş veya son oturuş sırasında çok kısa durmak ya da tamamen atlamak, namazın düzenine zarar verir. Oturuşlar, namazın tamamlayıcı parçalarıdır.

Fiziksel hatalar, namazın şekil yönünü olumsuz etkiler. Ancak bu hatalar genellikle bilinç kazanıldığında kolayca düzeltilebilir.

📌 Dersin amacı:
Bu ders, namaz sırasında yapılan fiziksel hataları tanıtarak, daha düzenli ve özenli bir namaz kılma bilinci kazandırmayı hedefler.`,
            en: `Some mistakes made while performing Salah stem directly from physical actions. These mistakes often become habits without being noticed and weaken the spirit of the prayer.

In this lesson, the most common physical mistakes encountered during prayer will be discussed.

**1. Performing Salah in Haste**
The desire to finish the prayer quickly is one of the most common mistakes. A prayer performed without pausing sufficiently in bowing and prostration may seem complete in form, but the required tranquility and attention cannot be achieved.

Salah is not a duty to be rushed through; it is an act of worship to be performed consciously.

**2. Not Pausing Sufficiently in Bowing and Prostration**
Bowing and prostration are the most important postures of prayer. It is necessary to pause, even if briefly, in these postures. Bowing and rising immediately or prostrating and getting up immediately disrupts the order of the prayer.

This mistake is often made without realizing it.

**3. Poor Posture**
It is also a common mistake for the body to be far from the required state while standing, bowing, or prostrating in prayer. Especially not bending the back fully in bowing or neglecting proper contact points in prostration falls into this scope.

Postures reflect the etiquette and seriousness of the prayer.

**4. Unnecessary and Continuous Movement**
Playing with clothes, looking around, or constantly shifting position during prayer disrupts the tranquility of the prayer. While major movements can invalidate the prayer, small but constant movements also weaken the meaning of the prayer.

**5. Not Paying Attention to Sittings**
Pausing too briefly or completely skipping the sitting between two prostrations or the final sitting damages the order of the prayer. Sittings are complementary parts of the prayer.

Physical mistakes negatively affect the formal aspect of the prayer. However, these mistakes can usually be easily corrected once awareness is gained.

📌 Purpose of the lesson:
This lesson aims to instill a consciousness of performing a more orderly and careful prayer by introducing physical mistakes made during prayer.`
        },
        level: 1,
        unlocked: true,
        color: colors.success,
        borderColor: colors.buttonGreenBorder,
        icon: HandPalm,
        route: '/lessons/namaz-bilgisi/309',
    },
    {
        id: 310,
        title: {
            tr: 'Namazda Yapılan Yaygın Hatalar (2)',
            en: 'Common Mistakes in Salah (2)'
        },
        description: {
            tr: 'Zihinsel Hatalar',
            en: 'Mental Mistakes'
        },
        content: {
            tr: `Namazda yapılan hataların bir bölümü bedenden değil, zihinden kaynaklanır. Bu tür hatalar, namazın şeklen doğru olsa bile anlam ve bilinç yönünden zayıflamasına sebep olur.

Zihinsel hatalar çoğu zaman fark edilmez; çünkü kişi namaz kıldığını düşünürken aslında zihni başka yerlerdedir.

**1. Niyeti Bilinçsizce Yapmak**
Namaza başlarken niyet etmek farzdır. Ancak niyetin sadece alışkanlıkla, ne kılındığı bilinmeden yapılması yaygın bir hatadır.

Niyet, sadece “başlamak” değil; hangi namazın, kimin için ve neden kılındığını fark etmektir.

**2. Okunanları Hiç Bilmemek**
Namazda okunan sure ve duaların anlamını hiç bilmemek, namazı mekanik bir harekete dönüştürebilir. Anlam bilinmese bile, okunan şeyin dua ve Allah’a hitap olduğu bilinci korunmalıdır.

Bu hata, namazın kalple bağlantısını zayıflatır.

**3. Sürekli Dalgınlık**
Namaz sırasında zihnin sürekli günlük düşüncelere kayması çok yaygındır. Yapılacak işler, geçmiş olaylar veya gelecek planları namazın önüne geçebilir.

Dalgınlık tamamen yok edilemeyebilir; ancak fark edilip tekrar namaza odaklanmak mümkündür.

**4. Namazı Sadece Bir Görev Gibi Görmek**
Namazı sadece “yapılması gereken bir sorumluluk” olarak görmek, ibadetin anlamını zayıflatır. Bu yaklaşım, namazın manevi yönünü arka plana iter.

Namaz, bir görevden çok bilinçli bir yöneliştir.

**5. Hata Yaptığını Fark Etmemek veya Önemsememek**
Namazda yapılan hataları fark etmemek ya da “önemli değil” diyerek geçiştirmek, namaz bilincini zayıflatır. Hataları fark etmek ve düzeltmeye çalışmak, namazı daha sağlam hâle getirir.

Zihinsel hatalar, zamanla farkındalık kazanıldığında azaltılabilir. Namazda amaç, kusursuzluk değil; bilinçli yöneliştir.

📌 Dersin amacı:
Bu ders, namaz sırasında yapılan zihinsel hataları tanıtarak, namazı daha bilinçli ve anlamlı kılma alışkanlığı kazandırmayı hedefler.`,
            en: `Some mistakes made in Salah stem not from the body, but from the mind. Such mistakes cause the prayer to weaken in terms of meaning and consciousness, even if it is formally correct.

Mental mistakes are often unnoticed because while the person thinks they are praying, their mind is actually elsewhere.

**1. Making the Intention Unconsciously**
It is obligatory to make an intention when starting Salah. However, making the intention merely out of habit, without knowing what is being prayed, is a common mistake.

Intention is not just "starting"; it is realizing which prayer is being performed, for whom, and why.

**2. Not Knowing the Meaning of What is Recited**
Knowing nothing about the meaning of the Surahs and supplications recited in prayer can turn the prayer into a mechanical action. Even if the meaning is not known word for word, the consciousness that what is being recited is a prayer and an address to Allah must be maintained.

This mistake weakens the connection of the prayer with the heart.

**3. Constant Distraction**
It is very common for the mind to constantly drift to daily thoughts during Salah. Tasks to be done, past events, or future plans can get in the way of the prayer.

Distraction may not be eliminated completely; however, it is possible to notice it and refocus on the prayer.

**4. Viewing Salah Merely as a Duty**
Viewing Salah only as a "responsibility that must be done" weakens the meaning of the worship. This approach pushes the spiritual aspect of Salah to the background.

Salah is a conscious orientation rather than just a duty.

**5. Not Noticing or Disregarding Mistakes**
Not noticing mistakes made in prayer or dismissing them by saying "it doesn't matter" weakens the consciousness of Salah. Noticing mistakes and trying to correct them makes the prayer more solid.

Mental mistakes can be reduced as awareness is gained over time. The goal in Salah is not perfection; it is conscious orientation.

📌 Purpose of the lesson:
This lesson aims to instill the habit of making Salah more conscious and meaningful by introducing mental mistakes made during prayer.`
        },
        level: 1,
        unlocked: true,
        color: colors.success,
        borderColor: colors.buttonGreenBorder,
        icon: HandPalm,
        route: '/lessons/namaz-bilgisi/310',
    },
    {
        id: 311,
        title: {
            tr: 'Namazda Okunanlar – Ne, Ne Zaman?',
            en: 'What is Recited in Salah – What and When?'
        },
        description: {
            tr: 'Namazın bölümlerine göre okunanlar',
            en: 'Recitations according to the parts of Salah'
        },
        content: {
            tr: `Namaz, belirli duruşlardan oluştuğu gibi, bu duruşlarda okunan dua ve ayetlerle tamamlanan bir ibadettir. Namazda neyin, hangi aşamada okunacağını bilmek; namazı daha düzenli, bilinçli ve doğru kılar.

Bu derste, namazın bölümlerine göre okunanlar ele alınacaktır. Detaylı metinler ve ezberler, ilgili dua derslerinde yer almaktadır.

**1. Namaza Başlarken Okunanlar**
Namaza iftitah tekbiri ile girilir. Ardından, namazın başında bazı okumalar yapılır. Bu okumalar, namaza manevi bir giriş niteliği taşır.

Bu bölümde yapılan okumalar, kişinin Allah’a yönelişini ve namaza hazırlanışını ifade eder.

**2. Kıyamda Okunanlar**
Kıyam, ayakta durulan ve Kur’an okunan bölümdür.

Bu aşamada:
Fâtiha Suresi okunur
Ardından Kur’an’dan bir sure veya ayetler okunur

Fâtiha, namazın temel duasıdır ve her rekâtta okunur. Fâtiha’dan sonra yapılan okumalar, namazın tamamlayıcı parçasıdır.

**3. Rükûda Okunanlar**
Rükû, eğilerek yapılan duruştur. Bu aşamada Allah’ın yüceliği tesbih edilir.

Rükûda yapılan okumalar, kulun tevazu ve teslimiyetini ifade eder.

**4. Rükûdan Doğrulurken Okunanlar**
Rükûdan doğrulurken ve doğrulduktan sonra yapılan okumalar, Allah’a hamd etmeyi ifade eder.

Bu aşama, namazın akışında kısa ama anlamlı bir duraktır.

**5. Secdede Okunanlar**
Secde, namazın en önemli ve en derin anlam taşıyan bölümüdür. Bu duruşta Allah’a yakınlık ifade edilir ve tesbih yapılır.

Secde, dua için de önemli bir fırsattır.

**6. Oturuşlarda Okunanlar**
Namazda oturulan bölümlerde belirli dualar okunur. Özellikle son oturuşta okunan dualar, namazın tamamlanmasına giden süreci oluşturur.

Bu okumalar, kulun Allah’a bağlılığını ve Peygamber’e olan bağlılığını ifade eder.

**7. Namazı Selamla Tamamlama**
Namaz, sağa ve sola selam verilerek tamamlanır. Selam, namazdan çıkışı ifade eder ve ibadetin sona erdiğini gösterir.

Namazda okunanları bilmek, namazın sadece hareketlerden ibaret olmadığını; dua, hamd ve yönelişten oluşan bütünlüklü bir ibadet olduğunu anlamayı sağlar.

📌 Dersin amacı:
Bu ders, namazın hangi bölümünde ne okunduğunu kavratarak, namazı daha bilinçli ve düzenli kılmayı hedefler.`,
            en: `Salah consists of specific postures and is an act of worship completed with supplications and verses recited in these postures. Knowing what to read and at what stage makes the prayer more orderly, conscious, and correct.

In this lesson, recitations according to the parts of Salah will be discussed. Detailed texts and memorizations are included in the relevant supplication lessons.

**1. Recitations at the Beginning of Prayer**
Salah is entered with the Opening Takbir. Then, some recitations are performed at the beginning of the prayer. These recitations serve as a spiritual introduction to the prayer.

The recitations performed in this section express the person's orientation towards Allah and preparation for prayer.

**2. Recitations in Standing**
Standing is the section where one stands and recites the Quran.

At this stage:
Surah Al-Fatiha is read
Then a Surah or verses from the Quran are read

Fatiha is the fundamental prayer of Salah and is read in every rak'ah. Recitations performed after Fatiha are a complementary part of the prayer.

**3. Recitations in Bowing**
Bowing is the posture performed by bending over. At this stage, the greatness of Allah is glorified.

Recitations performed in bowing express the servant's humility and submission.

**4. Recitations When Rising from Bowing**
Recitations performed while rising from bowing and after rising express praising Allah.

This stage is a short but meaningful stop in the flow of the prayer.

**5. Recitations in Prostration**
Prostration is the most important part of the prayer carrying the deepest meaning. In this posture, closeness to Allah is expressed and glorification is performed.

Prostration is also an important opportunity for supplication (dua).

**6. Recitations in Sittings**
Specific supplications are read in the sitting parts of the prayer. Especially the supplications read in the final sitting form the process leading to the completion of the prayer.

These recitations express the servant's devotion to Allah and to the Prophet.

**7. Completing Salah with Salam**
The prayer is completed by giving Salam to the right and left. Salam expresses the exit from the prayer and indicates the end of the worship.

Knowing what is recited in Salah ensures understanding that Salah is not just about movements; it is a holistic act of worship consisting of supplication, praise, and orientation.

📌 Purpose of the lesson:
This lesson aims to ensure a more conscious and orderly prayer by explaining what is read in which part of the prayer.`
        },
        level: 1,
        unlocked: true,
        color: colors.success,
        borderColor: colors.buttonGreenBorder,
        icon: HandPalm,
        route: '/lessons/namaz-bilgisi/311',
    },
    {
        id: 312,
        title: {
            tr: 'Rekât Mantığı',
            en: 'Logic of Rak\'ah'
        },
        description: {
            tr: 'Namazın temel yapı taşı',
            en: 'The fundamental building block of Salah'
        },
        content: {
            tr: `Namaz, belirli sayıda tekrar eden bölümlerden oluşur. Bu tekrar eden bölümlere rekât denir. Rekât, namazın temel yapı taşıdır ve namazın düzenli bir şekilde ilerlemesini sağlar.

Bir rekât; ayakta durma, okuma, rükû, secde ve oturuşlardan oluşan tam bir ibadet döngüsüdür. Namazın kaç rekâttan oluşacağı, kılınan namazın türüne göre değişir.

**Rekât Nedir?**
Rekât, namazın baştan sona kadar tekrar eden temel bölümüdür. Bir rekât içinde yapılan hareketler ve okumalar, namazın iskeletini oluşturur.

Namaz kılarken aslında aynı ibadet döngüsü, belirli sayıda tekrar edilir.

**Namazlarda Rekât Sayıları**
Namazların rekât sayıları farklıdır. Bu farklılık, namazın vakti ve türüyle ilgilidir.

Örneğin:
Sabah namazı iki rekâttır
Öğle, ikindi ve yatsı namazlarının farzları dört rekâttır
Akşam namazı üç rekâttır

Bu farklılıklar, namazın düzenini ve çeşitliliğini oluşturur.

**İlk Oturuş ve Son Oturuş**
Birden fazla rekâttan oluşan namazlarda oturuşlar önemlidir.

İlk oturuş, iki rekâttan sonra yapılan kısa oturuştur.
Son oturuş, namazın sonunda yapılan ve namazın tamamlanmasına hazırlık olan oturuştur.

Bu iki oturuşun yeri ve önemi farklıdır.

**Farz ve Sünnet Rekâtlar**
Namazlarda bazı rekâtlar farz, bazıları ise sünnettir.

Farz rekâtlar, mutlaka kılınması gereken rekâtlardır.
Sünnet rekâtlar, Peygamberimizin düzenli olarak kıldığı ve tavsiye ettiği rekâtlardır.

Bu ayrım, namazın hem zorunlu hem de tamamlayıcı yönünü gösterir.

**Rekât Mantığını Bilmenin Önemi**
Rekât mantığını kavramak, namazda nerede olunduğunu bilmeye yardımcı olur. Bu bilgi, özellikle şaşırma durumlarında daha bilinçli hareket etmeyi sağlar.

Rekât sistemi, namazın rastgele değil; düzenli ve bilinçli bir ibadet olduğunu gösterir.

📌 Dersin amacı:
Bu ders, rekât kavramını ve namazdaki yerini açıklayarak, namazın yapısının daha iyi anlaşılmasını sağlamayı hedefler.`,
            en: `Salah consists of sections that repeat a certain number of times. These repeating sections are called rak'ahs. Rak'ah is the fundamental building block of Salah and ensures that the prayer proceeds in an orderly manner.

A rak'ah is a complete cycle of worship consisting of standing, recitation, bowing, prostration, and sittings. How many rak'ahs a prayer consists of depends on the type of prayer being performed.

**What is a Rak'ah?**
A rak'ah is the fundamental section of prayer that repeats from beginning to end. The movements and recitations performed within a rak'ah form the skeleton of the prayer.

While praying, essentially the same cycle of worship is repeated a specific number of times.

**Number of Rak'ahs in Prayers**
The number of rak'ahs in prayers varies. This difference is related to the time and type of the prayer.

For example:
Fajr prayer is two rak'ahs
The obligatory parts of Dhuhr, Asr, and Isha prayers are four rak'ahs
Maghrib prayer is three rak'ahs

These differences create the order and variety of the prayer.

**First Sitting and Final Sitting**
Sittings are important in prayers consisting of more than one rak'ah.

The first sitting is the short sitting performed after two rak'ahs.
The final sitting is the sitting performed at the end of the prayer, serving as preparation for its completion.

The place and importance of these two sittings are different.

**Obligatory and Sunnah Rak'ahs**
In prayers, some rak'ahs are obligatory (fard), while others are Sunnah.

Obligatory rak'ahs are those that must be performed.
Sunnah rak'ahs are those that our Prophet regularly performed and recommended.

This distinction shows both the mandatory and complementary aspects of Salah.

**Importance of Understanding the Logic of Rak'ah**
Understanding the logic of rak'ah helps to know where one is in the prayer. This knowledge ensures more conscious action, especially in cases of confusion.

The rak'ah system shows that Salah is not random; it is an organized and conscious act of worship.

📌 Purpose of the lesson:
This lesson aims to ensure a better understanding of the structure of Salah by explaining the concept of rak'ah and its place in prayer.`
        },
        level: 1,
        unlocked: true,
        color: colors.success,
        borderColor: colors.buttonGreenBorder,
        icon: HandPalm,
        route: '/lessons/namaz-bilgisi/312',
    },
    {
        id: 313,
        title: {
            tr: 'Namaz ve Huşû',
            en: 'Salah and Khushu (Reverence)'
        },
        description: {
            tr: 'Namazın özü ve ruhu',
            en: 'The essence and spirit of Salah'
        },
        content: {
            tr: `Namazın şekli doğru olabilir; ancak namazı değerli kılan asıl unsur huşûdur. Huşû, namazda kalbin de ibadete katılması, kişinin Allah’ın huzurunda olduğunun farkında olmasıdır.

Huşû, kusursuz bir dikkat hâli değildir. Aksine, namaz boyunca farkındalığı korumaya çalışmak ve dağınıklık fark edildiğinde yeniden namaza yönelmektir.

**Huşû Nedir?**
Huşû; saygı, teslimiyet ve içtenlik hâlidir. Namazda yapılan her duruşun, okunan her sözün bir anlam taşıdığını bilmektir.

Huşû, sadece duygusal bir hâl değil; bilinçli bir yöneliştir.

**Neden Huşû Zor Olur?**
Günlük hayatın yoğunluğu, zihnin sürekli meşgul olması ve alışkanlık hâline gelen ibadet anlayışı huşûyu zorlaştırabilir. Namaz sırasında düşüncelerin dağılması, birçok kişinin yaşadığı ortak bir durumdur.

Bu durum, namazın değersiz olduğu anlamına gelmez; insanın doğasıyla ilgilidir.

**Huşû Kazanmak İçin Dikkat Edilebilecek Noktalar**
Namaza başlamadan önce kısa bir duraklama yapmak
Kılınan namazın hangisi olduğunu bilerek niyet etmek
Okunan duaların en azından ne için okunduğunu bilmek
Acele etmeden, duruşlarda kısa da olsa durmak

Bu adımlar, huşûyu artırmaya yardımcı olur.

**Huşû Olmadan Namaz Kabul Olmaz mı?**
Huşû, namazın kabul şartı değildir. Namaz, farzları ve şartları yerine getirildiğinde geçerli olur. Ancak huşû, namazın manevi değerini artırır.

Amaç, kusursuz huşû değil; her namazda biraz daha bilinç kazanmaktır.

**Namazı Alışkanlık Olmaktan Çıkarmak**
Namazı sadece bir görev gibi görmek, huşûyu zayıflatır. Namazı bir buluşma, bir yöneliş ve bir bilinç anı olarak görmek ise ibadetin anlamını derinleştirir.

Her namaz, bir öncekinden daha bilinçli kılınabilir.

Namaz ve huşû konusu, namaz bilgisinin manevi tamamlayıcısıdır. Şekil öğrenildikten sonra, anlam ve bilinç ön plana çıkar.

📌 Dersin amacı:
Bu ders, namazın sadece şekil değil; bilinç ve farkındalıkla kılınması gerektiğini kavratarak, ibadeti daha anlamlı hâle getirmeyi hedefler.`,
            en: `The form of Salah might be correct; however, the main element that makes Salah valuable is Khushu (reverence). Khushu is the participation of the heart in worship and the person being aware that they are in the presence of Allah.

Khushu is not a state of perfect attention. On the contrary, it is trying to maintain awareness throughout the prayer and returning to the prayer when distraction is noticed.

**What is Khushu?**
Khushu is a state of respect, submission, and sincerity. It is knowing that every posture performed and every word recited in Salah carries a meaning.

Khushu is not just an emotional state; it is a conscious orientation.

**Why is Khushu Difficult?**
The busyness of daily life, the mind being constantly occupied, and the understanding of worship becoming a habit can make Khushu difficult. Thoughts wandering during Salah is a common situation experienced by many people.

This situation does not mean that the prayer is worthless; it is related to human nature.

**Points to Consider to Gain Khushu**
Making a short pause before starting Salah
Making the intention knowing which prayer is being performed
Knowing at least why the recited supplications are read
Pausing briefly in postures without rushing

These steps help to increase Khushu.

**Is Salah Not Accepted Without Khushu?**
Khushu is not a condition for the acceptance of Salah. Salah becomes valid when its obligatory acts and conditions are fulfilled. However, Khushu increases the spiritual value of Salah.

The goal is not perfect Khushu; it is to gain a little more consciousness in every prayer.

**Breaking Salah from Being Just a Habit**
Viewing Salah only as a duty weakens Khushu. Viewing Salah as a meeting, an orientation, and a moment of consciousness deepens the meaning of worship.

Every prayer can be performed more consciously than the previous one.

The subject of Salah and Khushu is the spiritual complement of Salah knowledge. After the form is learned, meaning and consciousness come to the forefront.

📌 Purpose of the lesson:
This lesson aims to make the worship more meaningful by explaining that Salah should be performed not only with form but also with consciousness and awareness.`
        },
        level: 1,
        unlocked: true,
        color: colors.success,
        borderColor: colors.buttonGreenBorder,
        icon: HandPalm,
        route: '/lessons/namaz-bilgisi/313',
    }
];
