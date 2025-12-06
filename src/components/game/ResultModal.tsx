import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useEffect, useRef, useMemo } from 'react';
import { DuoButton, CircularProgress } from '@components/ui';
import { LoadingDots } from '@components/ui/LoadingDots';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

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
  onRetry?: () => void;
  isLoading?: boolean;
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
  onRetry,
  isLoading = false,
}: ResultModalProps) {
  const { t } = useTranslation();
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
        {/* Circular Progress */}
        <View style={{ marginBottom: 24, alignItems: 'center' }}>
          <CircularProgress
            size={200}
            strokeWidth={20}
            progress={totalQuestions > 0 ? correctAnswers / totalQuestions : 0}
            correct={correctAnswers}
            total={totalQuestions}
          />
        </View>

        {/* Success Text */}
        <Text style={styles.mainTitle}>
          Harika İş!
        </Text>
        <Text style={styles.subTitle}>
          Beklenenden çok daha iyisini yaptın.
        </Text>

        <View style={{ height: 30 }} />

        {/* Continue Button */}
        <DuoButton
          title={isLoading ? t('common.loading') : t('common.continue').toUpperCase()}
          onPress={onContinue}
          variant="success"
          fullWidth
          size="large"
          disabled={isLoading}
          rightIcon={isLoading ? <LoadingDots style={{ color: 'white', marginLeft: 4 }} /> : undefined}
        />

        {/* Retry Button */}
        {onRetry && (
          <DuoButton
            title={t('gameUI.playAgain').toUpperCase()}
            onPress={onRetry}
            variant="primary"
            fullWidth
            size="large"
            style={{ marginTop: 12 }}
            disabled={isLoading}
          />
        )}

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
    backgroundColor: colors.background, // Should ensure this is dark in dark mode
    borderRadius: 24,
    padding: 24,
    width: width * 0.9,
    maxWidth: 400,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
});
