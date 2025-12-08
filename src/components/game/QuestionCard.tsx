import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useMemo } from 'react';

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
  const { themeVersion } = useTheme();
  const styles = useMemo(() => getStyles(), [themeVersion]);

  return (
    <View style={styles.container}>
      {/* Progress Indicator */}
      {questionNumber && totalQuestions && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(questionNumber / totalQuestions) * 100}%` }
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            Soru {questionNumber} / {totalQuestions}
          </Text>
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
        {(showArabic ? questionArabic : question) && (
          <Text style={[styles.questionText, showArabic && styles.arabicText]}>
            {showArabic ? questionArabic : question}
          </Text>
        )}

        {/* Audio Button */}
        {onPlayAudio && (
          <Pressable style={styles.audioButton} onPress={onPlayAudio}>
            <Text style={styles.audioIcon}>🔊</Text>
            <Text style={styles.audioText}>Dinle</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const getStyles = () => StyleSheet.create({
  container: {
    marginBottom: 0, // Removed built-in margin, let parent control spacing
    alignItems: 'center',
    width: '100%',
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
    padding: 16, // Reduced padding for compact layout
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.borderDark,
    borderBottomWidth: 4,
    width: '100%',
    minHeight: 140, // Reduced minHeight for small screens
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12, // Reduced gap
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
