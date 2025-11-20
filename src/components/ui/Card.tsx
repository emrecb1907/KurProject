import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useMemo } from 'react';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: number;
}

export function Card({
  variant = 'default',
  padding = 16,
  style,
  children,
  ...props
}: CardProps) {
  const { themeVersion } = useTheme();
  const styles = useMemo(() => getStyles(), [themeVersion]);

  const cardStyle: ViewStyle[] = [
    styles.card,
    styles[`card_${variant}`],
    { padding },
    style as ViewStyle,
  ];

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
}

const getStyles = () => StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  card_default: {
    shadowColor: colors.shadowLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  card_elevated: {
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  card_outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
});
