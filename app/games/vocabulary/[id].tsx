import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { QuestionCard, OptionButton, Timer, LifeIndicator } from '@components/game';
import { useStore } from '@store';
import { colors } from '@constants/colors';
import { QUESTION_TIME_LIMITS, REINFORCEMENT_DURATION } from '@constants/game';

export default function VocabularyGamePlayScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { currentLives } = useStore();

  // Mock questions
  const mockQuestions = [
    {
      id: '1',
      questionText: 'Kitap',
      questionType: 'tr_to_ar', // First 10: Turkish to Arabic
      correctAnswer: 'كِتَاب',
      options: ['كِتَاب', 'قَلَم', 'دَرْس', 'مَدْرَسَة'],
    },
    {
      id: '11',
      questionText: 'صَلَاة',
      questionType: 'ar_to_tr', // Last 10: Arabic to Turkish
      correctAnswer: 'Namaz',
      options: ['Namaz', 'Oruç', 'Zekât', 'Hac'],
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showReinforcement, setShowReinforcement] = useState(false);

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const isFirstHalf = currentQuestionIndex < 10;

  const handleTimeUp = () => {
    handleAnswer(currentQuestion.options[0], 0);
  };

  const handleAnswer = (answer: string, timeTaken: number) => {
    if (showReinforcement) return;

    setSelectedOption(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    setShowReinforcement(true);
    setTimeout(() => {
      setShowReinforcement(false);
      setSelectedOption(null);
      setIsCorrect(null);
      
      if (currentQuestionIndex < mockQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        router.push('/games/vocabulary/result');
      }
    }, REINFORCEMENT_DURATION * 1000);
  };

  const getOptionState = (option: string) => {
    if (!showReinforcement) {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>✕</Text>
        </Pressable>
        <View style={styles.phaseIndicator}>
          <Text style={styles.phaseText}>
            {isFirstHalf ? 'Türkçe → Arapça' : 'Arapça → Türkçe'}
          </Text>
        </View>
        <LifeIndicator currentLives={currentLives} maxLives={5} />
      </View>

      <Timer
        duration={QUESTION_TIME_LIMITS.VOCABULARY}
        onTimeUp={handleTimeUp}
        isActive={!showReinforcement}
      />

      <ScrollView style={styles.content}>
        <QuestionCard
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={20}
          questionText={currentQuestion.questionText}
        />

        <View style={styles.options}>
          {currentQuestion.options.map((option) => (
            <OptionButton
              key={option}
              option={option}
              state={getOptionState(option)}
              onPress={() => handleAnswer(option, 0)}
              disabled={showReinforcement}
            />
          ))}
        </View>

        {showReinforcement && (
          <View style={[styles.reinforcement, isCorrect ? styles.correct : styles.incorrect]}>
            <Text style={styles.reinforcementIcon}>
              {isCorrect ? '✓' : '✗'}
            </Text>
            <Text style={styles.reinforcementText}>
              {isCorrect ? 'Mükemmel!' : `Doğru cevap: ${currentQuestion.correctAnswer}`}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  phaseIndicator: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  phaseText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  options: {
    marginTop: 16,
  },
  reinforcement: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  correct: {
    backgroundColor: `${colors.correct}20`,
  },
  incorrect: {
    backgroundColor: `${colors.incorrect}20`,
  },
  reinforcementIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  reinforcementText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.textPrimary,
  },
});

