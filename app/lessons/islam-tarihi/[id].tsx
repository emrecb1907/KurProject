import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@constants/colors';
import { ArrowLeft, BookOpen } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

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
    title: 'İslam Öncesi Dönem (Cahiliye)',
    content: [
      {
        section: '1. Dönemin Genel Tanımı',
        text: [
          '"Cahiliye" kelimesi İslam kaynaklarında, İslam öncesi Arap toplumunun sosyal ve inanç yapısını tanımlamak için kullanılan bir dönem adıdır.',
          'Bu ifade, bir toplumu küçültmek için değil, İslam\'ın gelişinden önceki kültürel yapıyı tarif etmek için kullanılan tarihsel bir kavramdır.',
          'Arap Yarımadası bu dönemde farklı kabilelerden oluşuyordu ve bu kabilelerin her biri kendi yönetişim yapısına sahipti.',
        ],
      },
      {
        section: '2. Toplumsal Yapı: Kabile Düzeni',
        text: [
          'Arap toplumunda kabileler, bireyin güvenlik ve kimlik sağlayıcısıydı.',
          '-Kabile bağları oldukça güçlüydü.',
          '-Toplumsal düzen bu bağlar üzerine kuruluydu.',
          '-Devlet benzeri merkezi bir otorite olmadığından, kabileler arası ilişkiler zaman zaman rekabete dönüşebiliyordu.',
          'Bu yapı, dönemin sosyal dinamiklerini anlamayı kolaylaştırır.',
        ],
      },
      {
        section: '3. İnanç Yapısı ve Dinî Çeşitlilik',
        text: [
          'İslam öncesi Arabistan\'da farklı inanç anlayışları bir arada bulunuyordu:',
          '-Çok tanrıcılık yaygındı ve Kâbe gibi kutsal mekânlar bulunuyordu.',
          '-Bazı bölgelerde Yahudilik, Hristiyanlık ve Haniflik gibi tektanrıcı inançlara mensup gruplar da vardı.',
          '-Geleneksel uygulamalar arasında sembolik ritüeller ve kehanet anlayışı yer alıyordu.',
          'Bu dönem, inanç açısından çeşitliliğin yoğun olduğu bir kültürel ortamdır.',
        ],
      },
      {
        section: '4. Sosyal Yaşam ve Ahlaki Yapı',
        text: [
          'Toplum, dönemin koşulları gereği farklı alışkanlıklara ve geleneklere sahipti.',
          '-Misafirperverlik, cömertlik ve sözünde durmak önemli değerlerdi.',
          '-Bazı uygulamalar ise günümüz etik anlayışıyla uyumlu görülmeyebilir; bu uygulamalar dönemin sosyo-kültürel şartları içinde değerlendirilmelidir.',
          '-Kadınların hakları bölgeler arasında farklılık gösterebiliyordu.',
          'Buradaki amaç, dönemi günümüz değerleriyle karşılaştırmak değil, kültürel bir gerçeklik olarak anlamaktır.',
        ],
      },
      {
        section: '5. Ekonomi ve Ticaret',
        text: [
          'Arap Yarımadası, önemli ticaret yolları üzerinde olduğu için:',
          '-Mekke ve çevresi ticarette merkez konumdaydı.',
          '-Panayırlar ekonomik ve kültürel buluşma alanıydı.',
          '-Ticaret, toplumda prestij kazandıran bir faaliyet olarak görülüyordu.',
          'Coğrafi koşullar nedeniyle tarım sınırlı olsa da ticaret oldukça gelişmişti.',
        ],
      },
      {
        section: '6. Kültür ve Edebiyat',
        text: [
          'İslam öncesi Arap toplumunda sözlü kültür güçlüydü.',
          '-Şiir ve hitabet, toplumun en önemli ifade biçimlerindendi.',
          '-"Muallakat" gibi ünlü şiirler kültürel hafızanın önemli parçalarıydı.',
          '-Edebi yarışmalar ve panayır etkinlikleri, toplumsal iletişimin önemli unsuruydu.',
          'Bu zengin kültür, İslam\'ın gelişiyle birlikte yeni bir içerik kazanarak devam etmiştir.',
        ],
      },
      {
        section: '7. Bu Döneme Neden "Cahiliye" Deniyor?',
        text: [
          'İslam literatüründeki "cahiliye" terimi:',
          '-Bir değer yargısı olarak değil,',
          '-İslam öncesi dönemi tanımlayan tarihsel bir kavram olarak kullanılır.',
          'Buradaki anlam "bilgisizlik" değil; İslam\'ın getirdiği yeni düzenin henüz ortaya çıkmadığı dönem demektir.',
        ],
      },
      {
        section: 'Ders Özeti',
        text: [
          'Cahiliye dönemi, Arap toplumunun İslam öncesindeki sosyal, kültürel ve inanç yapısını ifade eden tarihsel bir dönem adıdır.',
          'Bu dönem, farklı kabilelerin, çeşitli inançların ve zengin bir sözlü kültürün bir arada yaşadığı dinamik bir yapıya sahiptir.',
          'İslam\'ın gelişiyle, bu toplumsal zemin yeni bir değer sistemiyle birleşerek daha bütüncül bir medeniyetin oluşmasına katkı sağlamıştır.',
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
            {section.section === t('lessons.islamicHistory.lessonSummary') && (
              <View style={styles.summarySection}>
                <Text style={styles.summaryTitle}>{t('lessons.islamicHistory.summary')}</Text>
                {section.text.map((text, tIndex) => {
                  const isBulletPoint = text.trim().startsWith('-');
                  const textContent = isBulletPoint ? text.trim().substring(1).trim() : text;
                  
                  if (isBulletPoint) {
                    return (
                      <View key={tIndex} style={styles.bulletContainer}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={[styles.summaryText, { marginBottom: 0 }]}>{textContent}</Text>
                      </View>
                    );
                  }
                  
                  return (
                    <Text key={tIndex} style={styles.summaryText}>
                      {textContent}
                    </Text>
                  );
                })}
              </View>
            )}
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

