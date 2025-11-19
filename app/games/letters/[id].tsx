import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { QuestionCard, OptionButton, Timer, LifeIndicator } from '@components/game';
import { Button } from '@components/ui';
import { useGameSession } from '@hooks';
import { useStore } from '@store';
import { colors } from '@constants/colors';
import { QUESTION_TIME_LIMITS, REINFORCEMENT_DURATION } from '@constants/game';

export default function LettersGamePlayScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { gameState, isAnswering, startGameSession, answerQuestion, completeGame } = useGameSession();
  const { currentLives } = useStore();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showReinforcement, setShowReinforcement] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMITS.LETTERS);

  // Mock questions - Bu gerçek Supabase'den gelecek
  const mockQuestions = [
    {
      id: '1',
      questionText: '🔊 Dinle',
      correctAnswer: 'أ',
      options: ['أ', 'ب', 'ت', 'ث'],
    },
    {
      id: '2',
      questionText: '🔊 Dinle',
      correctAnswer: 'ب',
      options: ['أ', 'ب', 'ت', 'ث'],
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = mockQuestions[currentQuestionIndex];

  useEffect(() => {
    // Initialize game
    // startGameSession(id as string);
  }, []);

  const handleTimeUp = () => {
    // Auto-submit with wrong answer
    handleAnswer(currentQuestion.options[0], 0);
  };

  const handleAnswer = async (answer: string, timeTaken: number) => {
    if (isAnswering || showReinforcement) return;

    setSelectedOption(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    // Save answer
    // await answerQuestion(currentQuestion.id, answer, currentQuestion.correctAnswer, timeTaken);

    // Show reinforcement
    setShowReinforcement(true);
    setTimeout(() => {
      setShowReinforcement(false);
      setSelectedOption(null);
      setIsCorrect(null);
      
      // Next question or complete
      if (currentQuestionIndex < mockQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(QUESTION_TIME_LIMITS.LETTERS);
      } else {
        router.push('/games/letters/result');
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
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>✕</Text>
        </Pressable>
        <LifeIndicator currentLives={currentLives} maxLives={5} />
      </View>

      {/* Timer */}
      <Timer
        duration={timeLeft}
        onTimeUp={handleTimeUp}
        isActive={!showReinforcement}
      />

      <ScrollView style={styles.content}>
        {/* Question */}
        <QuestionCard
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={mockQuestions.length}
          questionText={currentQuestion.questionText}
        />

        {/* Options */}
        <View style={styles.options}>
          {currentQuestion.options.map((option) => (
            <OptionButton
              key={option}
              option={option}
              state={getOptionState(option)}
              onPress={() => handleAnswer(option, QUESTION_TIME_LIMITS.LETTERS - timeLeft)}
              disabled={showReinforcement}
            />
          ))}
        </View>

        {/* Reinforcement Message */}
        {showReinforcement && (
          <View style={[styles.reinforcement, isCorrect ? styles.correct : styles.incorrect]}>
            <Text style={styles.reinforcementIcon}>
              {isCorrect ? '✓' : '✗'}
            </Text>
            <Text style={styles.reinforcementText}>
              {isCorrect ? 'Doğru!' : `Yanlış! Doğru cevap: ${currentQuestion.correctAnswer}`}
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

