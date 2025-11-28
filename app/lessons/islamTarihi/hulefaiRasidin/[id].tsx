import { useLocalSearchParams } from 'expo-router';
import IslamicHistoryLesson, { LessonContent } from '@/components/lessons/IslamicHistoryLesson';

const islamicHistoryContent: Record<string, LessonContent> = {
  '1': {
    title: 'Hulefâ-i Râşidîn Dönemi (632–661)',
    content: [
      {
        section: 'Giriş',
        text: [
          'Hz. Muhammed\'in vefatından sonra Müslüman toplum liderlik konusunda yeni bir sürece girdi. Bu döneme "Hulefâ-i Râşidîn" yani "Doğru Yol Üzerindeki Halifeler" dönemi denir. Yaklaşık otuz yıl süren bu dönem, İslam toplumunun hem siyasi hem de sosyal açıdan şekillendiği bir geçiş sürecidir. Bu yıllar boyunca temel amaç, toplumsal düzenin korunması, adaletin sağlanması ve yeni kurulan toplum modelinin sürdürülebilir hale getirilmesiydi.',
        ],
      },
      {
        section: '1. Hz. Ebû Bekir Dönemi (632–634)',
        text: [
          'Hz. Ebû Bekir\'in hilafeti, Müslüman toplumu birlik içinde tutma ihtiyacının en yüksek olduğu bir zamanda başladı. Bu dönemin en belirgin özelliği, zorlu şartlara rağmen toplumsal istikrarın korunmasıdır.',
        ],
      },
      {
        section: 'a) Toplumsal Bütünlüğün Sağlanması',
        text: [
          'Hz. Ebû Bekir, göreve gelir gelmez farklı görüşlerin ortaya çıkmasıyla bölünme ihtimalini gördü. Bu sebeple önceliğini toplumu bir arada tutmaya verdi. Farklı kabilelerin ayrılma girişimlerine karşı durarak birlik ilkesini korudu.',
        ],
      },
      {
        section: 'b) Kurumsal Yapının İlk Adımları',
        text: [
          'Yeni devletin temel işleyişi, onun dönemindeki girişimlerle yapısal bir çerçeve kazandı. Kamu işlerinin düzenlenmesi ve toplumun ihtiyaçlarına hızlı yanıt verilebilmesi için pratik çözümler üretildi.',
        ],
      },
      {
        section: 'c) Vahiylerin Korunması',
        text: [
          'Kur\'an ayetlerinin güvenli şekilde korunması gerektiğini fark eden Hz. Ebû Bekir, vahiylerin toplanması için ilk adımı attı. Bu çalışma, ilerleyen dönemlerde Mushaf\'ın çoğaltılmasına temel oluşturdu.',
        ],
      },
      {
        section: '2. Hz. Ömer Dönemi (634–644)',
        text: [
          'Hz. Ömer dönemi, adalet ve idari düzenin belirgin biçimde güçlendiği bir dönem olarak öne çıkar. On yıl süren hilafeti boyunca toplumsal işleyişi sağlam temellere oturtan yenilikler getirdi.',
        ],
      },
      {
        section: 'a) Yönetim ve Adalet Düzenlemeleri',
        text: [
          'Hz. Ömer, yöneticilerin toplumla iç içe ve hesap verebilir olmasını önemseyen bir yaklaşım benimsedi. Mahkemeler, kamu düzeni, vergi sistemi ve askerî yapı gibi konularda kalıcı düzenlemeler yaptı. Bu düzenlemeler, ilerleyen yıllarda İslam dünyasındaki birçok yönetim modeline örnek oldu.',
        ],
      },
      {
        section: 'b) Sosyal Devlet Anlayışının Gelişmesi',
        text: [
          'Yetim, yaşlı ve kimsesizlerin korunması için sistemli bir yardımlaşma düzeni oluşturdu. Kamu kaynaklarının toplumun tüm kesimlerine ulaşmasını sağlayan bu yaklaşım, İslam sosyal politikasının ilk örneklerinden biri olarak kabul edilir.',
        ],
      },
      {
        section: 'c) Şehirleşme ve İdari Yapılanma',
        text: [
          'Yeni yerleşim alanlarının oluşturulması, güvenlik teşkilatının şekillenmesi ve halkın ihtiyaçlarının düzenli şekilde karşılanması, onun döneminin önemli gelişmelerindendir.',
        ],
      },
      {
        section: '3. Hz. Osman Dönemi (644–656)',
        text: [
          'Hz. Osman döneminin en önemli çalışması, Kur\'an\'ın tek bir Mushaf haline getirilerek çoğaltılması ve İslam coğrafyasına gönderilmesidir.',
        ],
      },
      {
        section: 'a) Mushaf\'ın Standartlaştırılması',
        text: [
          'Farklı bölgelerde okunan Kur\'an\'ın bir örnek üzerinden korunması amacıyla Mushaf\'ın çoğaltılması, İslam tarihi açısından son derece kritik bir adımdır. Bu çalışma, kitabın günümüze kadar aynı şekilde ulaşmasına zemin hazırladı.',
        ],
      },
      {
        section: 'b) Yönetimde İstikrar Arayışı',
        text: [
          'Hz. Osman döneminde İslam coğrafyası genişledi, şehir yönetimleri daha karmaşık bir hale geldi. Bu süreçte yönetimle ilgili bazı tartışmalar yaşansa da, toplumun temel yapısı korunmaya devam etti.',
        ],
      },
      {
        section: 'c) Toplumsal Farklılıkların Belirginleşmesi',
        text: [
          'Bu dönemde toplum büyüdükçe farklı görüşlerin ortaya çıkması doğal bir süreçti. Yaşanan anlaşmazlıklar ilerleyen dönemlerde daha büyük siyasi sorunların zeminini oluşturdu.',
        ],
      },
      {
        section: '4. Hz. Ali Dönemi (656–661)',
        text: [
          'Hz. Ali dönemi, İslam toplumunda iç karışıklıkların en yoğun olduğu dönemdir. Anlatımda tarafsızlık son derece önemlidir; bu nedenle bu dönem sadece olay merkezli ele alınır.',
        ],
      },
      {
        section: 'a) Yönetim Otoritesinin Sağlanması',
        text: [
          'Hz. Ali, göreve başladığında toplum zaten ciddi bir gerilim içerisindeydi. Onun temel amacı, otoriteyi yeniden tesis etmek ve toplumsal düzeni sağlamak oldu.',
        ],
      },
      {
        section: 'b) İç Çatışmalar ve Siyasi Gerginlikler',
        text: [
          'Bu dönemde meydana gelen iç çatışmalar, İslam toplumunun ilerleyen yıllardaki siyasi ayrışmalarına zemin hazırladı. Bu olaylar tarih boyunca farklı yorumlara konu olmuştur; ancak uygulamada bunları tarafsız bir dille, sadece tarihsel vakalar olarak aktarmak en doğrusudur.',
        ],
      },
      {
        section: 'c) Müzakere ve Barış Arayışları',
        text: [
          'Yaşanan tüm gerilimlere rağmen Hz. Ali, kan dökülmesini durdurmak ve toplumun birliğini yeniden sağlamak için çeşitli girişimlerde bulunmuştur.',
        ],
      },
      {
        section: 'Genel Değerlendirme',
        text: [
          'Hulefâ-i Râşidîn dönemi, İslam toplumunun hem temellerinin güçlendiği hem de önemli sınavlardan geçtiği bir süreçtir. Bu yıllarda adalet, birlik, toplumsal sorumluluk ve düzen anlayışı öne çıkmış; aynı zamanda toplumun farklı görüşlerle tanışması da kaçınılmaz olmuştur. Dönemin olayları, İslam tarihinin sonraki yüzyıllarını derinden etkilemiştir.',
          'Bu dönemi anlamak, İslam toplumunun gelişim aşamalarını kavramak açısından temel bir adımdır.',
        ],
      },
    ],
  },
};

export default function IslamicHistoryLessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { themeVersion } = useTheme();
  const { t } = useTranslation();
  const { incrementDailyLessons } = useUser();

  const lesson = islamicHistoryContent[id || '1'];
  if (!lesson) {
    return null;
  }

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
    backButton: {
      padding: 8,
      marginRight: 8,
      borderRadius: 12,
      backgroundColor: colors.backgroundLighter,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    bookContainer: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    bookTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: 8,
      textAlign: 'center',
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 16,
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
      paddingBottom: 8,
    },
    paragraph: {
      fontSize: 16,
      lineHeight: 28,
      color: colors.textPrimary,
      marginBottom: 16,
      textAlign: 'left',
    },
    bulletContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    bullet: {
      fontSize: 20,
      color: colors.primary,
      marginRight: 12,
      marginTop: 4,
    },
    bulletText: {
      flex: 1,
      fontSize: 16,
      lineHeight: 28,
      color: colors.textPrimary,
    },
    summarySection: {
      backgroundColor: colors.backgroundLighter,
      borderRadius: 12,
      padding: 20,
      marginTop: 8,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    summaryTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 12,
    },
    summaryText: {
      fontSize: 16,
      lineHeight: 26,
      color: colors.textPrimary,
      marginBottom: 12,
    },
    completeButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 24,
      borderBottomWidth: 4,
      borderBottomColor: colors.primaryDark,
    },
    completeButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.textOnPrimary,
    },
  }), [themeVersion]);

  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    incrementDailyLessons();
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <ArrowLeft size={24} color={colors.textPrimary} weight="bold" />
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t('lessons.islamicHistory.title')}</Text>
          <Text style={styles.subtitle}>{lesson.title}</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bookContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <BookOpen size={32} color={colors.primary} weight="fill" />
          </View>
          <Text style={styles.bookTitle}>{lesson.title}</Text>
        </View>

        {lesson.content.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            {section.text.map((paragraph, pIndex) => {
              const isBulletPoint = paragraph.trim().startsWith('-');
              const text = isBulletPoint ? paragraph.trim().substring(1).trim() : paragraph;
              
              if (isBulletPoint) {
                return (
                  <View key={pIndex} style={styles.bulletContainer}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{text}</Text>
                  </View>
                );
              }
              
              return (
                <Text key={pIndex} style={styles.paragraph}>
                  {text}
                </Text>
              );
            })}
          </View>
        ))}

        <Pressable
          style={styles.completeButton}
          onPress={handleComplete}
        >
          <Text style={styles.completeButtonText}>{t('lessons.islamicHistory.completeLesson')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

