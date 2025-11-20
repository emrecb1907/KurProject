import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { colors } from '@constants/colors';

interface DuoButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function DuoButton({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: DuoButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    const base: ViewStyle = {
      ...styles.base,
      ...styles[size],
    };

    if (fullWidth) {
      base.width = '100%';
    }

    if (disabled || loading) {
      base.opacity = 0.5;
      return base;
    }

    switch (variant) {
      case 'primary':
        return { ...base, ...styles.primary };
      case 'secondary':
        return { ...base, ...styles.secondary };
      case 'success':
        return { ...base, ...styles.success };
      case 'error':
        return { ...base, ...styles.error };
      case 'outline':
        return { ...base, ...styles.outline };
      case 'ghost':
        return { ...base, ...styles.ghost };
      default:
        return { ...base, ...styles.primary };
    }
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = styles.text;

    if (variant === 'outline') {
      return { ...base, color: colors.textPrimary };
    }

    if (variant === 'ghost') {
      return { ...base, color: colors.textSecondary };
    }

    return { ...base, color: colors.textOnPrimary };
  };

  return (
    <Pressable
      style={({ pressed }) => [
        getButtonStyle(),
        pressed && !disabled && !loading && styles.pressed,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={colors.textOnPrimary} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondaryDark,
  },
  success: {
    backgroundColor: colors.success,
    borderColor: colors.successDark,
  },
  error: {
    backgroundColor: colors.error,
    borderColor: colors.errorDark,
  },
  outline: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  pressed: {
    transform: [{ translateY: 2 }],
    borderBottomWidth: 2,
  },
  text: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

