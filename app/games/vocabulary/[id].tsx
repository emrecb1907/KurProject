import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { QuestionCard, OptionButton, Timer, LifeIndicator } from '@components/game';
import { useStore, useAuth } from '@/store';
import { colors } from '@constants/colors';
import { database } from '@/lib/supabase/database';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function VocabularyGamePlayScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { currentLives, maxLives, removeLives, addXP } = useStore();
  const { isAuthenticated, user } = useAuth();
  const { themeVersion } = useTheme();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);

  // Dynamic styles
  const styles = useMemo(() => getStyles(), [themeVersion]);

  // Mock questions - 20 total, 10 will be randomly selected
  const allMockQuestions = [
    {
      id: '1',
      question: 'Kitap',
      questionType: 'tr_to_ar',
      correctAnswer: 'كِتَاب',
      options: ['كِتَاب', 'قَلَم', 'دَرْس', 'مَدْرَسَة'],
    },
    {
      id: '2',
      question: 'Kalem',
      questionType: 'tr_to_ar',
      correctAnswer: 'قَلَم',
      options: ['قَلَم', 'كِتَاب', 'دَفْتَر', 'مِفْتَاح'],
    },
    {
      id: '3',
      question: 'Ders',
      questionType: 'tr_to_ar',
      correctAnswer: 'دَرْس',
      options: ['دَرْس', 'مَدْرَسَة', 'مُعَلِّم', 'طَالِب'],
    },
    {
      id: '4',
      question: 'Okul',
      questionType: 'tr_to_ar',
      correctAnswer: 'مَدْرَسَة',
      options: ['مَدْرَسَة', 'بَيْت', 'مَسْجِد', 'سُوق'],
    },
    {
      id: '5',
      question: 'Öğretmen',
      questionType: 'tr_to_ar',
      correctAnswer: 'مُعَلِّم',
      options: ['مُعَلِّم', 'طَالِب', 'طَبِيب', 'مُهَنْدِس'],
    },
    {
      id: '6',
      question: 'Öğrenci',
      questionType: 'tr_to_ar',
      correctAnswer: 'طَالِب',
      options: ['طَالِب', 'مُعَلِّم', 'وَالِد', 'أَخ'],
    },
    {
      id: '7',
      question: 'Ev',
      questionType: 'tr_to_ar',
      correctAnswer: 'بَيْت',
      options: ['بَيْت', 'مَدْرَسَة', 'مَسْجِد', 'حَدِيقَة'],
    },
    {
      id: '8',
      question: 'Cami',
      questionType: 'tr_to_ar',
      correctAnswer: 'مَسْجِد',
      options: ['مَسْجِد', 'كَنِيسَة', 'بَيْت', 'مَدْرَسَة'],
    },
    {
      id: '9',
      question: 'Su',
      questionType: 'tr_to_ar',
      correctAnswer: 'مَاء',
      options: ['مَاء', 'حَلِيب', 'عَصِير', 'شَاي'],
    },
    {
      id: '10',
      question: 'Ekmek',
      questionType: 'tr_to_ar',
      correctAnswer: 'خُبْز',
      options: ['خُبْز', 'لَحْم', 'أَرُزّ', 'فَاكِهَة'],
    },
    {
      id: '11',
      question: 'صَلَاة',
      questionType: 'ar_to_tr',
      correctAnswer: 'Namaz',
      options: ['Namaz', 'Oruç', 'Zekât', 'Hac'],
    },
    {
      id: '12',
      question: 'صَوْم',
      questionType: 'ar_to_tr',
      correctAnswer: 'Oruç',
      options: ['Oruç', 'Namaz', 'Dua', 'Tesbih'],
    },
    {
      id: '13',
      question: 'زَكَاة',
      questionType: 'ar_to_tr',
      correctAnswer: 'Zekât',
      options: ['Zekât', 'Sadaka', 'Hac', 'Umre'],
    },
    {
      id: '14',
      question: 'حَجّ',
      questionType: 'ar_to_tr',
      correctAnswer: 'Hac',
      options: ['Hac', 'Umre', 'Ziyaret', 'Seyahat'],
    },
    {
      id: '15',
      question: 'قُرْآن',
      questionType: 'ar_to_tr',
      correctAnswer: 'Kuran',
      options: ['Kuran', 'Tevrat', 'İncil', 'Zebur'],
    },
    {
      id: '16',
      question: 'نَبِيّ',
      questionType: 'ar_to_tr',
      correctAnswer: 'Peygamber',
      options: ['Peygamber', 'Melek', 'İnsan', 'Sahabe'],
    },
    {
      id: '17',
      question: 'مَلَك',
      questionType: 'ar_to_tr',
      correctAnswer: 'Melek',
      options: ['Melek', 'Peygamber', 'Cin', 'İnsan'],
    },
    {
      id: '18',
      question: 'جَنَّة',
      questionType: 'ar_to_tr',
      correctAnswer: 'Cennet',
      options: ['Cennet', 'Cehennem', 'Dünya', 'Ahiret'],
    },
    {
      id: '19',
      question: 'نَار',
      questionType: 'ar_to_tr',
      correctAnswer: 'Cehennem',
      options: ['Cehennem', 'Cennet', 'Ateş', 'Azap'],
    },
    {
      id: '20',
      question: 'إِيمَان',
      questionType: 'ar_to_tr',
      correctAnswer: 'İman',
      options: ['İman', 'İslam', 'İhsan', 'İbadet'],
    },
  ];

  // Select 10 random questions on component mount
  const [mockQuestions] = useState(() => {
    const shuffled = [...allMockQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = mockQuestions[currentQuestionIndex];

  useEffect(() => {
    // Check lives
    if (currentLives <= 0) {
      Alert.alert(t('errors.insufficientLives'), t('errors.insufficientLivesDesc'), [
        {
          text: t('common.ok'), onPress: () => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/');
            }
          }
        }
      ]);
      return;
    }

    // Deduct life
    removeLives(1);
  }, []);

  const handleTimeUp = () => {
    handleAnswer(currentQuestion.options[0], 0);
  };

  const handleAnswer = async (answer: string, timeTaken: number) => {
    if (isAnswered) return;

    setSelectedOption(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      setCorrectAnswersCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedOption(null);
    setIsCorrect(null);

    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsGameComplete(true);
    }
  };

  const handleExit = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    console.log('🏁 Vocabulary handleComplete called');

    // Add XP locally
    if (correctAnswersCount > 0) {
      addXP(correctAnswersCount);

      // Sync with DB if authenticated
      if (isAuthenticated && user?.id) {
        try {
          console.log('🔄 Syncing Vocabulary XP to DB:', correctAnswersCount);
          await database.users.updateXP(user.id, correctAnswersCount);

          console.log('📝 Calling updateCompletion for Vocabulary:', {
            userId: user.id,
            lessonId: id,
            correct: correctAnswersCount,
            total: mockQuestions.length
          });

          // Save progress to enable weekly activity tracking
          const { error: completionError } = await database.progress.updateCompletion(
            user.id,
            id as string, // lesson_id
            correctAnswersCount,
            mockQuestions.length
          );

          if (completionError) {
            console.error('❌ Vocabulary updateCompletion failed:', completionError);
          } else {
            console.log('✅ Vocabulary updateCompletion success');
          }

          // Record daily activity (optimized)
          await database.dailyActivity.record(user.id);

          console.log('✅ Vocabulary game progress saved');
        } catch (error) {
          console.error('❌ Failed to sync XP:', error);
        }
      } else {
        console.log('⚠️ User not authenticated, skipping DB sync');
      }
    } else {
      // Even if 0 correct, we should update completion (since we removed threshold)
      if (isAuthenticated && user?.id) {
        try {
          console.log('📝 Calling updateCompletion for Vocabulary (0 correct):', {
            userId: user.id,
            lessonId: id,
            correct: 0,
            total: mockQuestions.length
          });

          const { error: completionError } = await database.progress.updateCompletion(
            user.id,
            id as string,
            0,
            mockQuestions.length
          );

          if (completionError) {
            console.error('❌ Vocabulary updateCompletion failed (0 correct):', completionError);
          } else {
            console.log('✅ Vocabulary updateCompletion success (0 correct)');
          }
        } catch (error) {
          console.error('❌ Failed to sync progress (0 correct):', error);
        }
      }
    }
    handleExit();
  };

  const getOptionState = (option: string) => {
    if (!isAnswered) {
      return selectedOption === option ? 'selected' : 'default';
    }

    if (option === currentQuestion.correctAnswer) {
      return 'correct';
    }

    if (option === selectedOption && !isCorrect) {
      return 'incorrect';
    }

    return 'default';
  };

  if (isGameComplete) {
    return (
      <View style={styles.container}>
        disabled={isSubmitting}
          >
        <Text style={styles.completeButtonText}>
          {isSubmitting ? t('common.loading') : t('common.finish')}
        </Text>
      </Pressable>
        </View >
      </View >
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleExit}>
          <Text style={styles.backButton}>✕</Text>
        </Pressable>
        <LifeIndicator currentLives={currentLives} maxLives={maxLives} />
      </View>

      {/* Timer - Key forces reset on question change */}
      <Timer
        key={currentQuestionIndex}
        duration={10}
        onTimeUp={handleTimeUp}
        isActive={!isAnswered}
      />

      <ScrollView style={styles.content}>
        {/* Question */}
        <QuestionCard
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={10}
          question={currentQuestion.question}
        />

        {/* Options */}
        <View style={styles.options}>
          {currentQuestion.options.map((option) => (
            <OptionButton
              key={option}
              option={option}
              state={getOptionState(option)}
              onPress={() => handleAnswer(option, 0)}
              disabled={isAnswered}
            />
          ))}
        </View>
      </ScrollView>

      {/* Next Button Footer */}
      {isAnswered && (
        <View style={styles.footer}>
          <Pressable style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex < mockQuestions.length - 1 ? 'Sonraki Soru' : 'Bitir'}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const getStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButton: {
    fontSize: 24,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  options: {
    marginTop: 16,
    paddingBottom: 100, // Space for footer
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  nextButton: {
    backgroundColor: colors.success,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: colors.successDark,
    marginHorizontal: 20,
  },
  nextButtonText: {
    color: colors.textOnPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  completeText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  statsContainer: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    width: '100%',
    marginBottom: 32,
    alignItems: 'center',
    gap: 12,
  },
  statText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  completeButton: {
    backgroundColor: colors.success,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: colors.successDark,
  },
  completeButtonText: {
    color: colors.textOnPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
