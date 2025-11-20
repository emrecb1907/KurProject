import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { QuestionCard, OptionButton, Timer, LifeIndicator } from '@components/game';
import { useStore, useAuth } from '@/store';
import { colors } from '@constants/colors';
import { database } from '@/lib/supabase/database';
import { useTheme } from '@/contexts/ThemeContext';

export default function LettersGamePlayScreen() {
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

  // Mock questions
  const mockQuestions = [
    {
      id: '1',
      question: '🔊 Dinle',
      correctAnswer: 'أ',
      options: ['أ', 'ب', 'ت', 'ث'],
    },
    {
      id: '2',
      question: '🔊 Dinle',
      correctAnswer: 'ب',
      options: ['أ', 'ب', 'ت', 'ث'],
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = mockQuestions[currentQuestionIndex];

  useEffect(() => {
    // Check lives
    if (currentLives <= 0) {
      Alert.alert('Yetersiz Can', 'Canın kalmadı! Reklam izleyerek veya bekleyerek can kazanabilirsin.', [
        {
          text: 'Tamam', onPress: () => {
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
    // Auto-submit with wrong answer
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

    // Add XP locally
    if (correctAnswersCount > 0) {
      addXP(correctAnswersCount);

      // Sync with DB if authenticated
      if (isAuthenticated && user?.id) {
        try {
          console.log('🔄 Syncing Letters XP to DB:', correctAnswersCount);
          await database.users.updateXP(user.id, correctAnswersCount);

          // Save progress to enable weekly activity tracking
          await database.progress.updateCompletion(
            user.id,
            id as string, // lesson_id
            correctAnswersCount,
            mockQuestions.length
          );

          // Record daily activity (optimized)
          await database.dailyActivity.record(user.id);

          console.log('✅ Letters game progress saved');
        } catch (error) {
          console.error('❌ Failed to sync XP:', error);
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
        <View style={styles.completeContainer}>
          <Text style={styles.completeTitle}>Tebrikler!</Text>
          <Text style={styles.completeText}>Dersi başarıyla tamamladın.</Text>

          <View style={styles.statsContainer}>
            <Text style={styles.statText}>Doğru Cevap: {correctAnswersCount}/{mockQuestions.length}</Text>
            <Text style={styles.statText}>Kazanılan XP: +{correctAnswersCount}</Text>
          </View>

          <Pressable
            style={[styles.completeButton, isSubmitting && { opacity: 0.7 }]}
            onPress={handleComplete}
            disabled={isSubmitting}
          >
            <Text style={styles.completeButtonText}>
              {isSubmitting ? 'Kaydediliyor...' : 'Tamamla!'}
            </Text>
          </Pressable>
        </View>
      </View>
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
          totalQuestions={mockQuestions.length}
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
