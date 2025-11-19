import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@constants/colors';

interface ScoreDisplayProps {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
}

export function ScoreDisplay({
  currentQuestion,
  totalQuestions,
  score,
}: ScoreDisplayProps) {
  return (
    <View style={styles.container}>
      <View style={styles.progressInfo}>
        <Text style={styles.questionCount}>
          {currentQuestion} / {totalQuestions}
        </Text>
      </View>
      
      <View style={styles.scoreBox}>
        <Text style={styles.scoreLabel}>Puan</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  progressInfo: {
    flex: 1,
  },
  questionCount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
});
