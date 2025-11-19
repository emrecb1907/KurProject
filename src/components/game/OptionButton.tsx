import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '@constants/colors';

interface OptionButtonProps {
  option: string;
  onPress: () => void;
  state?: 'default' | 'correct' | 'incorrect' | 'selected';
  disabled?: boolean;
}

export function OptionButton({
  option,
  onPress,
  state = 'default',
  disabled = false,
}: OptionButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        styles[`button_${state}`],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, styles[`text_${state}`]]}>{option}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    backgroundColor: colors.surface,
    shadowColor: colors.shadowLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button_default: {
    borderColor: colors.border,
  },
  button_correct: {
    borderColor: colors.correct,
    backgroundColor: `${colors.correct}15`,
  },
  button_incorrect: {
    borderColor: colors.incorrect,
    backgroundColor: `${colors.incorrect}15`,
  },
  button_selected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  text_default: {
    color: colors.textPrimary,
  },
  text_correct: {
    color: colors.correct,
  },
  text_incorrect: {
    color: colors.incorrect,
  },
  text_selected: {
    color: colors.primary,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.6,
  },
});

