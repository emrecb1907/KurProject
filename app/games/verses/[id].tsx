import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { QuestionCard, OptionButton, Timer, LifeIndicator } from '@components/game';
import { Button } from '@components/ui';
import { useStore } from '@store';
import { colors } from '@constants/colors';
import { QUESTION_TIME_LIMITS, REINFORCEMENT_DURATION } from '@constants/game';

export default function VersesGamePlayScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { currentLives } = useStore();

  // Mock questions
  const mockQuestions = [
    {
      id: '1',
      questionText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ __',
      questionTextLatin: 'Bismillahir-Rahmanir-__',
      correctAnswer: 'الرَّحِيمِ',
      correctAnswerLatin: 'Rahim',
      options: ['الرَّحِيمِ', 'الْكَرِيمِ', 'الْحَكِيمِ', 'الْعَظِيمِ'],
      optionsLatin: ['Rahim', 'Karim', 'Hakim', 'Azim'],
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showReinforcement, setShowReinforcement] = useState(false);
  const [showLatin, setShowLatin] = useState(false);

  const currentQuestion = mockQuestions[currentQuestionIndex];

  const handleTimeUp = () => {
    handleAnswer(getCurrentOptions()[0], 0);
  };

  const handleAnswer = (answer: string, timeTaken: number) => {
    if (showReinforcement) return;

    setSelectedOption(answer);
    const correct = showLatin
      ? answer === currentQuestion.correctAnswerLatin
      : answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    setShowReinforcement(true);
    setTimeout(() => {
      setShowReinforcement(false);
      setSelectedOption(null);
      setIsCorrect(null);
      
      if (currentQuestionIndex < mockQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        router.push('/games/verses/result');
      }
    }, REINFORCEMENT_DURATION * 1000);
  };

  const getCurrentOptions = () => {
    return showLatin ? currentQuestion.optionsLatin : currentQuestion.options;
  };

  const getCurrentQuestion = () => {
    return showLatin ? currentQuestion.questionTextLatin : currentQuestion.questionText;
  };

  const getOptionState = (option: string) => {
    if (!showReinforcement) {
      return selectedOption === option ? 'selected' : 'default';
    }
    
    const correctAnswer = showLatin
      ? currentQuestion.correctAnswerLatin
      : currentQuestion.correctAnswer;
    
    if (option === correctAnswer) {
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
        <LifeIndicator currentLives={currentLives} maxLives={5} />
      </View>

      <Timer
        duration={QUESTION_TIME_LIMITS.VERSES}
        onTimeUp={handleTimeUp}
        isActive={!showReinforcement}
      />

      <ScrollView style={styles.content}>
        <View style={styles.questionContainer}>
          <QuestionCard
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={mockQuestions.length}
            questionText={getCurrentQuestion()}
            questionTextLatin={showLatin ? undefined : currentQuestion.questionTextLatin}
            showLatin={showLatin}
          />

          <Button
            title={showLatin ? 'Arapça Göster' : 'Latin Göster'}
            variant="outline"
            size="small"
            onPress={() => setShowLatin(!showLatin)}
            style={styles.toggleButton}
          />
        </View>

        <View style={styles.options}>
          {getCurrentOptions().map((option, index) => (
            <OptionButton
              key={index}
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
              {isCorrect ? 'Harika!' : 'Doğru kelime:'}
            </Text>
            {!isCorrect && (
              <>
                <Text style={styles.correctAnswer}>
                  {currentQuestion.correctAnswer}
                </Text>
                <Text style={styles.correctAnswerLatin}>
                  ({currentQuestion.correctAnswerLatin})
                </Text>
              </>
            )}
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
  questionContainer: {
    marginBottom: 16,
  },
  toggleButton: {
    marginTop: 8,
  },
  options: {
    marginTop: 8,
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
    marginBottom: 8,
  },
  correctAnswer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.success,
    marginTop: 8,
  },
  correctAnswerLatin: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
});

