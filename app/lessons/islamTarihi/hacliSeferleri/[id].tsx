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
  '409': {
    title: 'Haçlı Seferleri Dönemi ve İslam Dünyasının Durumu (11.–13. yüzyıllar)',
    content: [
      {
        section: 'Giriş',
        text: [
          'Haçlı Seferleri, Orta Çağ boyunca Avrupa ve İslam dünyası arasında yaşanan uzun soluklu bir karşılaşmalar dizisidir. Bu süreç dinî gerekçelerle başlamış olsa da zamanla siyasi, ekonomik ve toplumsal etkileri olan çok yönlü bir döneme dönüşmüştür. Bu dönemi anlamak için, hem İslam dünyasının iç yapısına hem de dış baskılara karşı verdiği tepkilere bakmak gerekir.',
        ],
      },
      {
        section: '1. Haçlı Seferlerinin Ortaya Çıkışı',
        text: [
          '11. yüzyılın sonlarında Avrupa\'da sosyal, ekonomik ve siyasi sıkıntılar artmıştı. Bu atmosfer, dinî liderlerin etkisiyle kutsal topraklara yönelik bir sefer düşüncesini güçlendirdi. Seferlerin temel söylemi dinî olsa da, arka planda ekonomik ve siyasi beklentiler de bulunuyordu.',
          'Bu süreçte İslam dünyası tek bir merkezden yönetilmiyordu; farklı devletler coğrafyanın farklı bölgelerinde etkinlik gösteriyordu. Bu durum, ilk karşılaşmalarda savunma gücünün dağınık kalmasına yol açtı.',
        ],
      },
      {
        section: '2. İlk Karşılaşmalar ve Bölgesel Mücadeleler',
        text: [
          'Haçlı orduları 1090\'lı yıllarda İslam coğrafyasının batı bölgelerine ulaştığında, bölgedeki devletler kendi iç meseleleriyle meşguldü. Bu da başlangıçta Haçlıların hızlı ilerlemesine zemin hazırladı.',
        ],
      },
      {
        section: 'a) Şehirlerin Direnişi',
        text: [
          'İslam şehirleri, konumlarına ve imkânlarına göre farklı ölçülerde direniş gösterdi. Bazı bölgeler kısa sürede düşerken, bazıları uzun süre savunma yaptı.',
        ],
      },
      {
        section: 'b) Yerel Güçlerin Rolü',
        text: [
          'Bu dönemde Selçukluların farklı kolları, Suriye ve Filistin bölgesindeki diğer yönetimlerle birlikte savunma süreçlerine katkıda bulundu.',
        ],
      },
      {
        section: '3. İslam Dünyasının Yeniden Örgütlenmesi',
        text: [
          'Zamanla İslam dünyasında seferlerin kalıcı bir tehdit olduğu anlaşıldı ve farklı bölgelerde savunma stratejileri daha sistemli şekilde geliştirildi.',
        ],
      },
      {
        section: 'a) Birlik Arayışı',
        text: [
          'Bağımsız devletlerin bulunduğu bölgelerde işbirliği arayışları başladı. Bu işbirliği, önce bölgesel, sonra daha geniş bir düzeyde şekillendi.',
        ],
      },
      {
        section: 'b) Liderlerin Ortaya Çıkışı',
        text: [
          'Bu süreçte bazı liderler, savunmanın güçlendirilmesi ve şehirlerin geri alınması konusunda etkili rol oynadı. Bu liderler, savaşın seyrini değiştiren askeri ve siyasi düzenlemeler yaptı.',
        ],
      },
      {
        section: '4. Şehirlerin Yeniden Kazanılması',
        text: [
          '12. yüzyılın sonlarına doğru İslam dünyası savunmadan çıkıp düzenli bir karşı hamleye geçti.',
        ],
      },
      {
        section: 'a) Bölgesel İstikrarın Sağlanması',
        text: [
          'Daha güçlü ordular, daha iyi organize olmuş yönetimler ve yerel halkla kurulan dayanışma sayesinde pek çok şehir geri alındı.',
        ],
      },
      {
        section: 'b) Siyasi Dengenin Değişmesi',
        text: [
          'Bu süreç yalnızca askeri başarı değil; aynı zamanda İslam dünyasında birlik duygusunun güçlenmesine de katkı sağladı.',
        ],
      },
      {
        section: '5. Haçlı Seferlerinin İslam Dünyasına Etkileri',
        text: [
          'Haçlı Seferleri uzun süreli bir mücadele olduğu için etkileri yalnızca savaş alanıyla sınırlı değildir.',
        ],
      },
      {
        section: 'a) Savunma Yapılarının Gelişmesi',
        text: [
          'Kaleler, şehir surları ve askeri düzenlemeler bu dönemde güçlendi. Şehirlerin yeniden inşasında güvenlik önlemleri ön planda tutuldu.',
        ],
      },
      {
        section: 'b) Ekonomik ve Ticari Değişimler',
        text: [
          'Bazı ticaret yolları kesintiye uğramış olsa da, yeni güzergâhlar oluşturularak ticaretin devam etmesi sağlandı. Doğu ile Batı arasındaki ticaret ilişkileri bu süreçten önemli ölçüde etkilendi.',
        ],
      },
      {
        section: 'c) Kültürel Temaslar',
        text: [
          'Her ne kadar savaş dönemi olsa da, karşılıklı etkileşim tamamen kesilmedi. Bilimsel eserler, tıbbi bilgiler ve bazı teknolojiler farklı şekillerde iki dünya arasında aktarılmaya devam etti.',
        ],
      },
      {
        section: '6. Seferlerin Sonu ve Genel Değerlendirme',
        text: [
          '13. yüzyılın ortalarında Haçlı Seferleri etkisini kaybetmeye başladı. Bunun nedenleri arasında:',
          '-Avrupa\'daki siyasi dengelerin değişmesi,',
          '-İslam dünyasında daha güçlü bölgesel yönetimlerin oluşması,',
          '-Ekonomik koşulların değişmesi',
          'gibi etkenler bulunuyordu.',
          'Haçlı Seferleri sona erdiğinde, İslam dünyası hem büyük sınavlardan geçmiş hem de bir yandan kendi iç yapısını güçlendirmişti. Bu dönem, İslam tarihinin dönüm noktalarından biri olarak kabul edilir.',
        ],
      },
      {
        section: 'Genel Değerlendirme',
        text: [
          'Haçlı Seferleri, tek yönlü bir askerî mücadele değil; iki dünyanın uzun süre temas ettiği çok yönlü bir süreçtir. İslam dünyası bu dönemde:',
          '-Savunma stratejilerini güçlendirmiş,',
          '-Bölgesel işbirliklerini artırmış,',
          '-Şehirleşme ve güvenlik alanında yeni adımlar atmış,',
          '-Siyasi ve toplumsal tecrübeler kazanmıştır.',
          'Bu süreç, İslam tarihinin ilerleyen dönemlerini derinden etkilemiştir.',

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

  const lesson = islamicHistoryContent[id || '409'];
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
    completeLesson(id || '409');
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

