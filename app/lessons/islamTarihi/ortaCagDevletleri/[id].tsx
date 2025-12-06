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
  '408': {
    title: 'Orta Çağ İslam Coğrafyasında Bölgesel Devletler',
    content: [
      {
        section: 'Giriş',
        text: [
          'Abbâsîlerin etkisinin zayıflamasıyla İslam dünyasının farklı bölgelerinde yeni siyasi yapılar ortaya çıktı. Bu devletler, etnik veya coğrafi kimliklerinden bağımsız biçimde, kendi bölgelerinde düzeni sağlama, ilmi ve kültürel faaliyetleri geliştirme, ticareti ayakta tutma gibi önemli görevler üstlendiler. Bu nedenle bu dönem, tek merkezli bir yapıdan çok, geniş bir coğrafyada birden fazla gücün birlikte var olduğu bir süreç olarak değerlendirilir.',
        ],
      },
      {
        section: '1. Büyük Selçuklular (1040–1157)',
        text: [
          'Selçuklular, Orta Asya\'dan gelen bir topluluk olsalar da kısa sürede İslam dünyasında güçlü bir siyasi denge unsuru hâline geldiler. Yönetimleri, Abbâsî halifesini dış tehditlerden koruma ve merkezî otoriteyi güçlendirme amacı taşıyordu.',
        ],
      },
      {
        section: 'a) İdari Düzen ve Medreseler',
        text: [
          'Selçuklular, Nizâmülmülk\'ün öncülüğünde medrese sistemini kurumsallaştırdı. Bu kurumlar yalnızca eğitim merkezleri değil; aynı zamanda toplumsal düzenin ve düşünce hayatının gelişmesine katkı sağlayan yapılardı.',
        ],
      },
      {
        section: 'b) Coğrafi Güç ve Siyasi Etki',
        text: [
          'Geniş coğrafyayı kontrol etmeleri, İslam dünyasında uzun süre istikrarın korunmasına yardımcı oldu. Selçuklular, farklı toplulukları aynı yönetsel çatı altında bir arada tutmayı başardılar.',
        ],
      },
      {
        section: '2. Gazneliler (10.–12. yüzyıllar)',
        text: [
          'Gazneliler, Horasan ve Hindistan\'ın kuzey bölgelerinde etkinlik gösterdi. Bu devlet, yalnızca askerî gücüyle değil; bölgedeki ilmi faaliyetleri desteklemesiyle de dikkat çekti.',
        ],
      },
      {
        section: 'a) Bilim ve Kültür Ortamı',
        text: [
          'Gazneli sarayları, bilginler, şairler ve tarihçiler için bir merkez hâline geldi. Bu ortam, Farsça edebiyatın gelişmesinde büyük rol oynadı.',
        ],
      },
      {
        section: 'b) Bölgesel İstikrar',
        text: [
          'Gazneliler, ticaret yollarını koruyarak bölgenin ekonomik canlılığını sürdürdü. Hindistan coğrafyasında kurdukları düzen, kültürel etkileşimi artırdı.',
        ],
      },
      {
        section: '3. Fatımîler (909–1171)',
        text: [
          'Fatımîler, Kuzey Afrika merkezli bir devletti ve ardından Mısır\'a yerleşerek Kahire\'yi güçlü bir kültür ve yönetim merkezine dönüştürdü.',
        ],
      },
      {
        section: 'a) Kahire\'nin Yükselişi',
        text: [
          'Kahire, camileri, kütüphaneleri ve eğitim kurumlarıyla dönemin önemli kültür merkezlerinden biri oldu. Bu dönemde kurulan el-Ezher kurumu, İslam eğitim geleneğinin önemli bir unsuru hâline geldi.',
        ],
      },
      {
        section: 'b) Akdeniz Ticaretindeki Etkileri',
        text: [
          'Fatımîler, Akdeniz ticaret yollarını düzenleyerek bölgede ekonomik istikrar sağladı. Bu durum Mısır\'ın refah seviyesini artırdı.',
        ],
      },
      {
        section: '4. Büveyhîler (945–1055)',
        text: [
          'Büveyhîler, Abbâsî halifesinin devam ettiği Bağdat çevresinde etkin bir bölgesel güç haline geldiler. Halifenin dini otoritesine dokunmadan, idari ve askeri yapıya yön verdiler.',
        ],
      },
      {
        section: 'a) Bağdat\'ın Kültürel Canlılığı',
        text: [
          'Bu dönemde Bağdat\'ta edebiyat, felsefe ve tıp alanlarında üretim yoğunlaşmıştır. Bilim insanları saray ve şehir merkezlerinde desteklenmiştir.',
        ],
      },
      {
        section: 'b) Yönetimde Esneklik',
        text: [
          'Büveyhîler farklı etnik ve kültürel unsurları yönetime dahil ederek çok sesli bir yapıyı korumaya çalıştılar.',
        ],
      },
      {
        section: '5. Memlûkler (1250–1517)',
        text: [
          'Memlûkler, özellikle Mısır ve Suriye bölgesinde güçlü bir devlet yapısı kurdular. Moğol istilasının hızla yayıldığı bir dönemde, bölgeyi koruyarak İslam dünyasının önemli merkezlerini savundular.',
        ],
      },
      {
        section: 'a) Savunma Başarıları',
        text: [
          'Memlûkler, Moğollara karşı kazandıkları kritik mücadelelerle İslam dünyasının batı bölgelerinin yıkıma uğramasını engellediler. Bu başarı, dönemin siyasi dengelerini önemli ölçüde etkiledi.',
        ],
      },
      {
        section: 'b) Kültürel Hayat ve Mimari',
        text: [
          'Kahire, Memlûk döneminde sanat ve mimari açısından en parlak dönemlerinden birini yaşadı. Medreseler, camiler ve hanlar bu dönemin karakteristik mimari yapılarıdır.',
        ],
      },
      {
        section: 'Genel Değerlendirme',
        text: [
          'Orta Çağ İslam coğrafyasında ortaya çıkan bu devletlerin ortak özelliği, bulundukları bölgelerde düzeni sağlama, ekonomik hayatı canlı tutma ve bilimsel-kültürel faaliyetleri destekleme yönündeki çabalarıdır. Bu devletler:',
          '-Farklı kimliklere sahip olmalarına rağmen,',
          '-Aynı medeniyet alanı içinde,',
          '-Üretim, eğitim, savunma ve şehirleşme konularında güçlü katkılar sağlamışlardır.',
          'Bu nedenle söz konusu dönem, İslam medeniyetinin bölgesel çeşitlilik içinde olgunlaştığı bir evre olarak değerlendirilir.',

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

  const lesson = islamicHistoryContent[id || '408'];
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
    completeLesson(id || '408');
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

