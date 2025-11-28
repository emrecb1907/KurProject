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
    title: 'Abbâsîler Dönemi ve İslam\'ın Altın Çağı (750–1258)',
    content: [
      {
        section: 'Giriş',
        text: [
          'Abbâsîler dönemi, İslam tarihinin yalnızca siyasi olarak değil; kültür, bilim, sanat ve düşünce alanlarında da en parlak dönemlerinden biri olarak kabul edilir. Yaklaşık beş yüzyıl süren bu dönem, farklı milletlerin ve kültürlerin bir araya gelerek ortak bir medeniyet inşa ettiği çok yönlü bir süreçtir. Bu nedenle "İslam\'ın Altın Çağı" olarak anılır.',
        ],
      },
      {
        section: '1. Başkentin Bağdat\'a Taşınması ve Yeni Merkez',
        text: [
          'Abbâsîlerin iktidara gelmesiyle İslam dünyasının merkezi Şam\'dan Bağdat\'a taşındı. Bağdat, kurulduğu günden itibaren bilim ve kültürle iç içe gelişen bir şehir oldu. Ticaret yollarının kesişme noktasında bulunması, farklı toplumların bilimsel birikimini bu şehirde buluşturdu. Bu coğrafi avantaj, Abbâsî medeniyetinin yükselişini hızlandırdı.',
        ],
      },
      {
        section: '2. Bilim ve Düşünce Hayatının Yükselişi',
        text: [
          'Altın Çağ denildiğinde akla ilk gelen başlık, bilimde yaşanan olağanüstü ilerlemedir. Abbâsîler, farklı kültürlerde biriken bilgileri araştıran, tercüme eden ve geliştiren büyük bir hareket başlattı.',
        ],
      },
      {
        section: 'a) Beytü\'l-Hikme (Bilgelik Evi)',
        text: [
          'Bağdat\'ta kurulan Beytü\'l-Hikme, sadece bir kütüphane değil; aynı zamanda dünyanın ilk büyük araştırma merkezlerinden biriydi. Grekçe, Süryanice, Farsça, Sanskritçe gibi dillerdeki eserler Arapçaya çevrildi. Bu çalışmalar sayesinde matematik, astronomi, tıp, felsefe ve mühendislik gibi alanlar yeni bir ivme kazandı.',
        ],
      },
      {
        section: 'b) Bilim İnsanları ve Katkıları',
        text: [
          'Bu dönemde yetişen onlarca düşünür, dünya bilim tarihine yön verdi. Bu kişilerin kimlikleri veya milletleri değil, ürettikleri bilginin evrenselliği öne çıkmıştır. Matematikte cebir, tıpta anatomi ve farmakoloji, astronomide gözlem teknikleri gibi birçok alan bu dönemde sistematik hâle geldi.',
        ],
      },
      {
        section: 'c) Düşünce Özgürlüğü ve Farklı Ekoller',
        text: [
          'Abbâsî yönetimi, bilim faaliyetlerinin çeşitlenmesine izin verecek bir entelektüel ortam oluşturdu. Bu dönemde fıkıh, kelam, felsefe ve edebiyat alanlarında farklı düşünce akımları ortaya çıktı. Tartışmalar çoğu zaman üretimi teşvik eden bir çeşitlilik sağladı.',
        ],
      },
      {
        section: '3. Kültürel ve Sanatsal Gelişim',
        text: [
          'Altın Çağ sadece bilimsel ilerlemeyle sınırlı değildir. Mimari, hat sanatı, şehir planlaması, musiki ve edebiyat gibi alanlar da güçlü bir gelişim gösterdi. Bağdat, Basra, Kufe, Rey, Buhara ve Semerkant gibi şehirler kültürel merkezler haline geldi.',
        ],
      },
      {
        section: 'a) Mimari ve Şehircilik',
        text: [
          'Yeni şehirler kurulmuş, mevcut şehirler modernleştirilmiştir. Köprüler, camiler, medreseler ve saraylar bu dönemin mimarisini temsil eder.',
        ],
      },
      {
        section: 'b) Edebiyat ve Dil',
        text: [
          'Arapça, ilim ve kültür dili olarak güçlendi. Şiir, hikâye ve felsefi metinlerden oluşan büyük bir edebiyat birikimi ortaya çıktı. Bu dönemde kaleme alınan eserlerin birçoğu hâlâ dünya kütüphanelerinde temel kaynak olarak kabul edilir.',
        ],
      },
      {
        section: '4. Toplumsal Yapı ve Yönetim',
        text: [
          'Abbâsî yönetimi çok kültürlü bir devlet yapısına sahipti. Araplar, Farslar, Türkler, Berberiler, Hintliler ve daha birçok topluluk devletin bünyesinde görev aldı. Bu çeşitlilik, medeniyetin kapsayıcı karakterini güçlendirdi. Yönetimde bürokrasi gelişti, posta teşkilatı ve idari sistemler olgunlaştı.',
        ],
      },
      {
        section: '5. Ekonomik Canlılık ve Ticaret',
        text: [
          'Abbâsî coğrafyası, Asya\'dan Avrupa\'ya uzanan ticaret yollarının merkezindeydi. Bu durum hem şehirlerin zenginleşmesini hem de bilgi akışının hızlanmasını sağladı. Ticaret, tarım ve zanaat üretimi ekonomik yapının temelini oluşturdu.',
        ],
      },
      {
        section: '6. Moğol İstilası ve Dönemin Sona Ermesi (1258)',
        text: [
          'Abbâsîlerin yükselişi kadar uzun süren bu parlak dönem, Moğol istilasıyla ağır bir darbe aldı. 1258\'de Bağdat\'ın düşmesi, Altın Çağ\'ın siyasi anlamda sonu olarak kabul edilir. Ancak bilimsel ve kültürel birikim başka bölgelere taşınarak etkisini yüzyıllarca sürdürdü. Bu nedenle Abbâsî dönemi sona ermiş olsa bile, medeniyetin bıraktığı izler kalıcı oldu.',
        ],
      },
      {
        section: 'Genel Değerlendirme',
        text: [
          'Abbâsîler dönemi, İslam tarihinin en kapsamlı kültürel ve bilimsel üretim dönemidir. Bu süreçte:',
          '-Bilim insanları özgür bir ortamda çalıştı,',
          '-Farklı kültürler ortak bir medeniyet içinde buluştu,',
          '-Şehirler bilgi merkezlerine dönüştü,',
          '-Bilimsel ve entelektüel birikim dünya tarihini şekillendirdi.',
          'Bu nedenle Abbâsîler, İslam medeniyetinin "evrensel" karakterinin en güçlü şekilde ortaya çıktığı dönem olarak kabul edilir.',
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

