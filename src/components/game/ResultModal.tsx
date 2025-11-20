import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useEffect, useRef, useMemo } from 'react';
import { DuoButton } from '@components/ui';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface ResultModalProps {
  visible: boolean;
  success: boolean;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  xpEarned: number;
  timeSpent: string;
  onContinue: () => void;
}

export function ResultModal({
  visible,
  success,
  score,
  correctAnswers,
  totalQuestions,
  xpEarned,
  timeSpent,
  onContinue,
}: ResultModalProps) {
  const { themeVersion } = useTheme();
  const styles = useMemo(() => getStyles(), [themeVersion]);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.modal,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Duo Character */}
        <View style={styles.duoContainer}>
          <Text style={styles.duoEmoji}>{success ? '🦉' : '😢'}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {success ? 'Alıştırmayı tamamladın!' : 'İyi Deneme!'}
        </Text>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>+{xpEarned}</Text>
            <Text style={styles.statLabel}>⚡ XP</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>{accuracy}%</Text>
            <Text style={styles.statLabel}>🎯 Doğruluk</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>{timeSpent}</Text>
            <Text style={styles.statLabel}>⏱️ Süre</Text>
          </View>
        </View>

        {/* Score Display */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Toplam Puan</Text>
          <Text style={styles.scoreValue}>{score}</Text>
          <Text style={styles.scoreSubtext}>
            {correctAnswers}/{totalQuestions} doğru cevap
          </Text>
        </View>

        {/* Continue Button */}
        <DuoButton
          title="DEVAM ET"
          onPress={onContinue}
          variant="success"
          fullWidth
          size="large"
        />

        {/* Encouragement Text */}
        <Text style={styles.encouragement}>
          {success
            ? '🎉 Harika! Devam et!'
            : '💪 Bir dahaki sefere daha iyi olacak!'}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const getStyles = () => StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: colors.background,
    borderRadius: 24,
    padding: 24,
    width: width * 0.9,
    maxWidth: 400,
    alignItems: 'center',
  },
  duoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  duoEmoji: {
    fontSize: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 24,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface, // Replaced backgroundGray
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  scoreCard: {
    width: '100%',
    backgroundColor: colors.successGlow, // Replaced cardGreen
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.success,
    borderBottomWidth: 4,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.success,
    marginBottom: 8,
  },
  scoreSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  encouragement: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '600',
  },
});

