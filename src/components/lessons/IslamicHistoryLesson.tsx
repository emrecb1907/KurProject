import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@constants/colors';
import { ArrowLeft, BookOpen } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useUser, useAuth } from '@/store';
import { useCompleteGameMutation } from '@/hooks/mutations/useGameMutations';

export interface SectionContent {
  section: string;
  text: string[];
}

export interface LessonContent {
  title: string;
  content: SectionContent[];
}

interface IslamicHistoryLessonProps {
  lesson: LessonContent;
  lessonId: string;
}

export default function IslamicHistoryLesson({ lesson, lessonId }: IslamicHistoryLessonProps) {
  const router = useRouter();
  const { themeVersion } = useTheme();
  const { t } = useTranslation();
  const { incrementDailyLessons } = useUser();

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

  const { mutate: completeGame, isPending } = useCompleteGameMutation();
  const { user } = useAuth();
  const { completedTests } = useUser(); // Assuming completedTests tracks completed lessons too, or we need a new selector
  // Actually, useUser doesn't seem to expose completedLessons array directly. 
  // We might need to fetch it or check against a list.
  // For now, let's just implement the completion logic.

  const isCompleted = useMemo(() => {
    // This logic needs to be robust. For now, we rely on the button action.
    // Ideally, we pass isCompleted as a prop or fetch it.
    return false;
  }, []);

  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (lessonId) {
      completeGame({
        lessonId: lessonId.toString(),
        gameType: 'lesson',
        correctAnswers: 1, // Dummy values for lesson completion
        totalQuestions: 1,
        source: 'lesson'
      });
    }

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

