import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@constants/colors';

interface QuestionCardProps {
  question: string;
  questionNumber?: number;
  totalQuestions?: number;
  questionArabic?: string;
  showArabic?: boolean;
  onToggleFormat?: () => void;
  audioUrl?: string;
  onPlayAudio?: () => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  questionArabic,
  showArabic = false,
  onToggleFormat,
  onPlayAudio,
}: QuestionCardProps) {
  return (
    <View style={styles.container}>
      {/* Progress Indicator */}
      {questionNumber && totalQuestions && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Soru {questionNumber} / {totalQuestions}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(questionNumber / totalQuestions) * 100}%` }
              ]}
            />
          </View>
        </View>
      )}

      {/* Format Toggle Button */}
      {questionArabic && onToggleFormat && (
        <Pressable style={styles.toggleButton} onPress={onToggleFormat}>
          <Text style={styles.toggleText}>
            {showArabic ? '🔤 Latin göster' : '🕌 Arapça göster'}
          </Text>
        </Pressable>
      )}

      {/* Question Text */}
      <View style={styles.questionBox}>
        <Text style={[styles.questionText, showArabic && styles.arabicText]}>
          {showArabic ? questionArabic : question}
        </Text>
      </View>

      {/* Audio Button */}
      {onPlayAudio && (
        <Pressable style={styles.audioButton} onPress={onPlayAudio}>
          <Text style={styles.audioIcon}>🔊</Text>
          <Text style={styles.audioText}>Dinle</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: 16,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  questionBox: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.borderDark,
    borderBottomWidth: 4,
    width: '100%',
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 32,
  },
  arabicText: {
    fontSize: 28,
    fontFamily: 'System', // Arabic font support
    lineHeight: 42,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.secondaryDark,
    borderBottomWidth: 4,
    marginTop: 16,
  },
  audioIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  audioText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 20,
    gap: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
});
