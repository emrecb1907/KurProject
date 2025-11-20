import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useMemo } from 'react';

interface LifeIndicatorProps {
  currentLives: number;
  maxLives?: number;
}

export function LifeIndicator({ currentLives, maxLives = 6 }: LifeIndicatorProps) {
  const { themeVersion } = useTheme();
  const styles = useMemo(() => getStyles(), [themeVersion]);

  return (
    <View style={styles.container}>
      <Text style={styles.heartIcon}>❤️</Text>
      <Text style={styles.livesText}>
        {currentLives} / {maxLives}
      </Text>
    </View>
  );
}

const getStyles = () => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.border,
  },
  heartIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  livesText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
