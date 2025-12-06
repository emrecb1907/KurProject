import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@constants/colors';
import { ArrowLeft, BookOpen } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/store';

// İslam Tarihi ders içerikleri
interface SectionContent {
  section: string;
  text: string[];
}

interface LessonContent {
  title: string;
  content: SectionContent[];
}

const islamicHistoryContent: Record<string, LessonContent> = {
  '407': {
    title: 'Endülüs Emevîleri ve Avrupa ile Etkileşim (711–1492)',
    content: [
      {
        section: 'Giriş',
        text: [
          'Endülüs dönemi, İslam medeniyetinin batıya açıldığı ve Avrupa ile yoğun bir kültürel etkileşimin yaşandığı uzun bir süreçtir. Bu dönem sadece siyasi bir hâkimiyet değil; aynı zamanda bilim, sanat, düşünce ve eğitim alanlarında iki büyük dünya arasında karşılıklı bir etkileşim anlamına gelir. Bu sebeple Endülüs, İslam tarihinin en renkli ve en çok yönlü bölümlerinden biridir.',
        ],
      },
      {
        section: '1. Endülüs\'ün Ortaya Çıkışı',
        text: [
          '711 yılında İber Yarımadası\'na ulaşan Müslümanlar, kısa sürede bölgenin büyük bir kısmında istikrar sağlayarak burada yeni bir yönetim kurdular. Endülüs Emevîleri olarak anılan bu yapı, Abbâsîlerden ayrı bir siyasi çizgide gelişti. Farklı milletlerin ve inanç gruplarının birlikte yaşadığı çok kültürlü bir yapı oluştu.',
          'Bu dönem, tek bir topluma ait değil; Araplar, Berberiler, İspanyollar ve Yahudi topluluklarının bir arada yaşadığı geniş bir medeniyet örneğiydi.',
        ],
      },
      {
        section: '2. Kurtuba\'nın Bir Bilim ve Kültür Merkezi Haline Gelmesi',
        text: [
          'Endülüs\'ün yükselişinde en belirgin şehir Kurtuba\'dır. Şehir, aynı dönemdeki pek çok Avrupa şehrinden daha gelişmiş bir altyapıya sahipti. Geniş kütüphaneleri, eğitim kurumları ve bilimle ilgilenen entelektüel çevreleriyle tanınıyordu.',
        ],
      },
      {
        section: 'a) Kütüphaneler ve Eğitim',
        text: [
          'Kurtuba\'da yüzbinlerce eseri barındıran kütüphaneler bulunuyordu. Bu kütüphaneler yalnızca dinî metinlere değil; tıp, matematik, felsefe, astronomi ve edebiyat gibi pek çok alana ait eserlere ev sahipliği yapıyordu. Eğitim, toplumun her kesimine açık bir faaliyet hâline geldi.',
        ],
      },
      {
        section: 'b) Bilim ve Felsefe Çalışmaları',
        text: [
          'Endülüs\'te yürütülen çalışmalar, özellikle tıp ve felsefe alanlarında Avrupa\'yı derinden etkiledi. Antik Yunan düşüncesi burada yeniden işlenmiş, geliştirilmiş ve sistematik hâle getirilmişti. Bu üretim daha sonra Avrupa\'ya taşınarak Orta Çağ düşüncesinin dönüşmesinde önemli rol oynadı.',
        ],
      },
      {
        section: '3. Çok Kültürlü Bir Toplum Modeli',
        text: [
          'Endülüs\'ün en dikkat çekici özelliklerinden biri, farklı din ve kültürlerin bir arada yaşayabilmesiydi. Müslümanlar, Hristiyanlar ve Yahudiler aynı şehirlerde ortak bir yaşam modeli geliştirdiler.',
          'Bu yapı hem ekonomik hem de kültürel gelişimi destekledi. Farklı topluluklar arasında bilgi alışverişi, sanat ve zanaatta yeniliklerin ortaya çıkmasına katkı sağladı. Endülüs bu yönüyle tarihte barışçıl bir çok kültürlülük örneği olarak değerlendirilir.',
        ],
      },
      {
        section: '4. Avrupa ile Bilimsel ve Kültürel Etkileşim',
        text: [
          'Endülüs\'ün Avrupa üzerindeki etkisi yalnızca siyasi değil; daha çok bilimsel ve kültürel düzeyde gerçekleşti.',
        ],
      },
      {
        section: 'a) Bilginin Doğu\'dan Batı\'ya Aktarılması',
        text: [
          'Endülüs, İslam dünyasında geliştirilen matematik, astronomi, tıp ve felsefe çalışmalarını Avrupa\'ya taşıyan köprü işlevi gördü. Latin dünyası, pek çok bilimsel esere ilk kez Endülüs üzerinden ulaşabildi. Bu etkileşim, Avrupa\'daki bilimsel canlanmanın temel hazırlayıcılarından biri oldu.',
        ],
      },
      {
        section: 'b) Çeviri Hareketleri',
        text: [
          'Toledo, bu dönemde önemli bir çeviri merkezine dönüştü. Müslüman, Hristiyan ve Yahudi bilginler birlikte çalışarak Arapça eserleri Latince\'ye çevirdiler. Bu çalışmalar, Avrupa\'daki düşünce ve eğitim sisteminin dönüşmesini hızlandırdı.',
        ],
      },
      {
        section: '5. Sanat, Mimari ve Şehir Kültürü',
        text: [
          'Endülüs mimarisi, bugün hâlâ ayakta duran eserleriyle dikkat çeker. Kurtuba Camii, Elhamra Sarayı ve Giralda gibi yapılar, dönemin estetik anlayışını ve mimari ustalığını yansıtır.',
          'Şehirler:',
          '-Planlı sokak düzenleri,',
          '-Temiz su sistemleri,',
          '-Bahçeler ve kamusal alanlarla',
          'dönemin Avrupa şehirlerine kıyasla oldukça ileri bir seviyedeydi.',
        ],
      },
      {
        section: '6. Endülüs\'ün Zayıflaması ve Sürecin Sonu (1492)',
        text: [
          'Zamanla iç çekişmeler, siyasi parçalanma ve dış baskılar Endülüs\'ü zayıflattı. 1492\'de Granada\'nın düşmesiyle Endülüs dönemi sona erdi. Ancak bu bitiş, medeniyetin bıraktığı etkilerin ortadan kalktığı anlamına gelmez. Bu birikim, hem İslam dünyasında hem de Avrupa\'da uzun süre yaşamaya devam etti.',
        ],
      },
      {
        section: 'Genel Değerlendirme',
        text: [
          'Endülüs dönemi, bilim, sanat ve kültürün birlikte geliştiği; farklı toplumların barış içinde bir arada yaşayabildiği eşsiz bir tarih sürecidir. Avrupa ile kurulan bilimsel köprüler, bilginin doğudan batıya aktarılmasını sağlayarak dünya tarihinin yönünü değiştirmiştir. Endülüs\'ü anlamak, İslam medeniyetinin evrensel karakterinin nasıl şekillendiğini görmek açısından önem taşır.',

        ]
      }
    ]
  }
};

export default function IslamicHistoryLessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { themeVersion } = useTheme();
  const { t } = useTranslation();
  const { incrementDailyLessons, completeLesson } = useUser();

  const lesson = islamicHistoryContent[id || '407'];
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
    completeLesson(id || '407');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']} >
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
    </SafeAreaView >
  );
}

