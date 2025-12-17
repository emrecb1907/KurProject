import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useMemo } from 'react';

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
  const { themeVersion } = useTheme();
  const styles = useMemo(() => getStyles(), [themeVersion]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        styles[`button_${state}`],
        pressed && !disabled && styles.pressed,
        disabled && state === 'default' && styles.disabled, // Only dim if default state
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, styles[`text_${state}`]]}>{option}</Text>
    </Pressable>
  );
}

const getStyles = () => StyleSheet.create({
  button: {
    padding: 20,
    borderRadius: 30, // Confirmed match with Next Question button
    marginBottom: 12,
    borderWidth: 2,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button_default: {
    borderColor: colors.border,
  },
  button_correct: {
    borderColor: colors.buttonGreenBorder,
    backgroundColor: colors.success,
  },
  button_incorrect: {
    borderColor: colors.errorDark,
    backgroundColor: colors.error,
  },
  button_selected: {
    borderColor: colors.buttonOrangeBorder,
    backgroundColor: colors.primary,
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
    color: colors.textOnPrimary,
    fontWeight: 'bold',
  },
  text_incorrect: {
    color: colors.textOnPrimary,
    fontWeight: 'bold',
  },
  text_selected: {
    color: colors.textOnPrimary,
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.6,
  },
});

