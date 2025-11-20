import { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface LevelUpModalProps {
  visible: boolean;
  onClose: () => void;
  newLevel: number;
  xpEarned: number;
  totalXP: number;
}

export function LevelUpModal({
  visible,
  onClose,
  newLevel,
  xpEarned,
  totalXP,
}: LevelUpModalProps) {
  const { themeVersion } = useTheme();
  const styles = useMemo(() => getStyles(), [themeVersion]);

  const [scaleAnim] = useState(new Animated.Value(0));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
      fadeAnim.setValue(0);

      // Start animations
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal visible={visible} onClose={onClose} showCloseButton={false} transparent>
      <View style={styles.container}>
        {/* Star/Trophy Icon with Animation */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: scaleAnim }, { rotate }],
            },
          ]}
        >
          <Text style={styles.icon}>🏆</Text>
        </Animated.View>

        {/* Level Up Text */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title}>Seviye Atladın! 🎉</Text>
          <Text style={styles.levelText}>Seviye {newLevel}</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Bu Oyun</Text>
              <Text style={styles.statValue}>+{xpEarned} XP</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Toplam XP</Text>
              <Text style={styles.statValue}>{totalXP}</Text>
            </View>
          </View>

          {/* Rewards Info */}
          <View style={styles.rewardsBox}>
            <Text style={styles.rewardsTitle}>✨ Ödüller</Text>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardEmoji}>❤️</Text>
              <Text style={styles.rewardText}>Can sayın yenilendi!</Text>
            </View>
            {newLevel % 5 === 0 && (
              <View style={styles.rewardItem}>
                <Text style={styles.rewardEmoji}>🎁</Text>
                <Text style={styles.rewardText}>Özel rozet kazandın!</Text>
              </View>
            )}
            {newLevel === 10 && (
              <View style={styles.rewardItem}>
                <Text style={styles.rewardEmoji}>⚡</Text>
                <Text style={styles.rewardText}>Hızlı Tur kilidi açıldı!</Text>
              </View>
            )}
          </View>

          {/* Continue Button */}
          <Button
            title="Harika! 🎊"
            onPress={onClose}
            variant="primary"
            fullWidth
            style={styles.button}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

const getStyles = () => StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: colors.primaryLight,
    borderRadius: 60,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  rewardsBox: {
    backgroundColor: colors.successLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  rewardsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.success,
    marginBottom: 12,
    textAlign: 'center',
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rewardEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  rewardText: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  button: {
    marginTop: 8,
  },
});

