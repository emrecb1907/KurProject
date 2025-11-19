import { Pressable, Text, StyleSheet, PressableProps, ViewStyle, TextStyle } from 'react-native';
import { colors } from '@constants/colors';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
}

export function Button({ 
  title, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  disabled = false,
  style,
  ...props 
}: ButtonProps) {
  const buttonStyle: ViewStyle[] = [
    styles.button,
    styles[`button_${size}`],
    styles[`button_${variant}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style as ViewStyle,
  ];

  const textStyle: TextStyle[] = [
    styles.text,
    styles[`text_${size}`],
    styles[`text_${variant}`],
    disabled && styles.textDisabled,
  ];

  return (
    <Pressable
      style={({ pressed }) => [
        ...buttonStyle,
        pressed && !disabled && styles.pressed,
      ]}
      disabled={disabled}
      {...props}
    >
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Sizes
  button_small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  button_medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  button_large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  
  // Variants
  button_primary: {
    backgroundColor: colors.primary,
  },
  button_secondary: {
    backgroundColor: colors.secondary,
  },
  button_success: {
    backgroundColor: colors.success,
  },
  button_error: {
    backgroundColor: colors.error,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  
  // Text
  text: {
    fontWeight: '600',
  },
  text_small: {
    fontSize: 14,
  },
  text_medium: {
    fontSize: 16,
  },
  text_large: {
    fontSize: 18,
  },
  text_primary: {
    color: colors.textLight,
  },
  text_secondary: {
    color: colors.textLight,
  },
  text_success: {
    color: colors.textLight,
  },
  text_error: {
    color: colors.textLight,
  },
  text_outline: {
    color: colors.primary,
  },
  
  // States
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    backgroundColor: colors.surfaceVariant,
    opacity: 0.5,
  },
  textDisabled: {
    color: colors.textDisabled,
  },
  fullWidth: {
    width: '100%',
  },
});

