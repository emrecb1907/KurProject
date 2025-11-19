import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '@constants/colors';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp?: () => void;
  isPaused?: boolean;
}

export function Timer({ duration, onTimeUp, isPaused = false }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progressAnim] = useState(new Animated.Value(100));

  useEffect(() => {
    setTimeLeft(duration);
    progressAnim.setValue(100);
  }, [duration]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 0.1;
        
        if (newTime <= 0) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }

        // Animate progress
        const progress = (newTime / duration) * 100;
        Animated.timing(progressAnim, {
          toValue: progress,
          duration: 100,
          useNativeDriver: false,
        }).start();

        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [timeLeft, isPaused, duration, onTimeUp]);

  const getProgressColor = () => {
    const percentage = (timeLeft / duration) * 100;
    if (percentage > 50) return colors.progressGreen;
    if (percentage > 25) return colors.progressYellow;
    return colors.progressOrange;
  };

  const isUrgent = timeLeft <= duration * 0.25;

  return (
    <View style={styles.container}>
      <View style={styles.timerBar}>
        <Animated.View
          style={[
            styles.timerProgress,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: getProgressColor(),
            },
          ]}
        />
      </View>
      
      {isUrgent && (
        <Text style={[styles.timerText, styles.urgentText]}>
          {Math.ceil(timeLeft)}s
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  timerBar: {
    height: 16,
    backgroundColor: colors.borderLight,
    borderRadius: 99,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.borderDark,
  },
  timerProgress: {
    height: '100%',
    borderRadius: 99,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  urgentText: {
    color: colors.error,
    fontSize: 16,
  },
});
