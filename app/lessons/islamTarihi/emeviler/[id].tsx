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
  '1': {
    title: 'Erken İslam Devletleri ve Emevîler Dönemi (661–750)',
    content: [
      {
        section: 'Giriş',
        text: [
          'Hulefâ-i Râşidîn döneminin ardından Müslüman toplum yeni bir yönetim biçimiyle tanıştı. Bu süreç, siyasal yapının kurumsallaşmaya başladığı ve devlet mekanizmasının daha belirgin hale geldiği bir dönemdir. Emevîler, bu geçişin ilk büyük temsilcisi olarak İslam tarihinin erken evresine damga vurdu.',
        ],
      },
      {
        section: '1. Yeni Bir Yönetim Modeline Geçiş',
        text: [
          'Emevîlerin iktidara gelişi, İslam toplumunda merkezi otoritenin güçlendirilmesi ihtiyacının öne çıktığı bir döneme denk gelir. Bu dönemde devlet yönetimi, daha sistemli ve idari kurulları belirgin hâle gelen bir yapıya doğru evrildi. Yönetimde süreklilik ve kamu düzeninin korunması, Emevî siyaseti açısından temel hedeflerden biriydi.',
        ],
      },
      {
        section: '2. Şam\'ın Merkez Olarak Seçilmesi',
        text: [
          'Emevî devleti, başkenti Şam\'a taşıyarak İslam coğrafyasının idari merkezini Arap Yarımadası\'nın dışına çıkardı. Şam; ticaret yolları, nüfus yoğunluğu ve bölgesel bağlar açısından güçlü bir şehirdi. Bu nedenle devletin yönetimsel işleyişi burada daha hızlı organize edilebildi. Bu tercih, aynı zamanda İslam dünyasının kültürel ve siyasi ufkunun genişlemesinde önemli bir rol oynadı.',
        ],
      },
      {
        section: '3. Devlet Teşkilatının Gelişmesi',
        text: [
          'Emevîler döneminde idari birimler daha sistemli bir hale geldi. Vergi düzeni, askerî yapı, posta teşkilatı ve eyalet yönetimleri yeniden düzenlendi. Devletin geniş bir coğrafyayı yönetebilmesi için gerekli olan bürokratik yapı bu dönemde belirginleşti. Bu yapısal düzenlemeler, sonraki dönem devletlerine model teşkil edecek bir temel oluşturdu.',
        ],
      },
      {
        section: '4. Toplumsal ve Kültürel Çeşitlilik',
        text: [
          'İslam coğrafyası Emevîler döneminde daha da genişledi. Farklı kültürler, diller ve topluluklar bu süreçte İslam dünyasının bir parçası haline geldi. Bu genişleme, farklı bölgelerde yeni şehirlerin ortaya çıkmasına ve kültürel etkileşimlerin artmasına yol açtı. Devlet yönetimi, bu çeşitliliği idare etmek için hem yerel yöneticilerle hem de halkla dengeli ilişkiler kurmaya çalıştı.',
        ],
      },
      {
        section: '5. Bilgi ve Eğitim Alanındaki Gelişmeler',
        text: [
          'Bu süreçte eğitim faaliyetleri belli merkezlerde toplandı. Camiler, ilim halkalarının oluşturulduğu ve dini ilimlerin öğretildiği yerler haline geldi. Kur\'an, hadis ve dil ilimlerinin temellerinin kurumsallaşması bu dönemin önemli özelliklerindendir. Her ne kadar ilerleyen "Altın Çağ" kadar yoğun bir entelektüel hareket olmasa da, temel altyapı bu dönemde oluşturuldu.',
        ],
      },
      {
        section: '6. Toplumsal Düzen ve Kamu Güvenliği',
        text: [
          'Emevî yönetimi, geniş bir coğrafyada istikrarı sağlamak için güçlü bir güvenlik politikası yürüttü. Yol güvenliğinin artırılması, şehirler arası ulaşımın geliştirilmesi ve kamu huzurunun korunması devletin öncelikleri arasındaydı. Bu çalışmalar sayesinde ticaret yolları daha güvenli hale geldi ve toplum düzeni korunmaya çalışıldı.',
        ],
      },
      {
        section: '7. Tartışmalı Olayların Nötr Değerlendirilmesi',
        text: [
          'Emevîler dönemi, İslam tarihinin en çok tartışılan zaman dilimlerinden biridir. Bu tartışmaların pek çoğu siyasi ve toplumsal çekişmelerden kaynaklanır. Uygulamada bu dönemi anlatırken tarafsız olmak esastır. Bu nedenle anlatımda:',
          '-Olaylar kişi odaklı değil,',
          '-Tarihsel süreç odaklı ele alınır.',
          'Bu yaklaşımla dönem, geniş bir coğrafyanın nasıl yönetildiği ve devlet yapısının nasıl şekillendiği üzerinden değerlendirilir.',
        ],
      },
      {
        section: '8. Dönemin Genel Değerlendirmesi',
        text: [
          'Emevîler, İslam tarihinin erken döneminde devlet kurumlarının güçlenmesine, şehirleşmenin artmasına ve İslam toplumunun coğrafi olarak genişlemesine katkı sağladı. Bu dönem, toplumsal çeşitliliğin belirginleştiği, idari yapının oturduğu ve İslam dünyasının siyasi sınırlarının önemli ölçüde büyüdüğü bir süreçtir.',
          'Emevîler\'in ardından İslam dünyası, Abbâsîler döneminde daha kültürel ve bilimsel derinliği yüksek bir evreye geçecektir. Bu nedenle Emevî dönemi, İslam medeniyetinin sonraki büyük sıçraması için hazırlayıcı bir zemin olarak değerlendirilir.',
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

