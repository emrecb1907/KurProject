import { useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { playSound } from '@/utils/audio';

// Sound file
const CLOCK_TICKING_SOUND = require('../../../assets/audio/effects/clockTicking.mp3');

interface TimerProps {
  duration: number; // in seconds
  onTimeUp?: () => void;
  isPaused?: boolean;
  isActive?: boolean;
}

export function Timer({ duration, onTimeUp, isPaused = false, isActive }: TimerProps) {
  const { themeVersion } = useTheme();
  const styles = useMemo(() => getStyles(), [themeVersion]);

  // If isActive is provided, it overrides isPaused (isActive = !isPaused)
  const paused = isActive !== undefined ? !isActive : isPaused;
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progressAnim] = useState(new Animated.Value(100));
  const stopTickingSoundRef = useRef<(() => Promise<void>) | null>(null);
  const isTickingRef = useRef(false);

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      if (stopTickingSoundRef.current) {
        stopTickingSoundRef.current();
      }
    };
  }, []);

  useEffect(() => {
    setTimeLeft(duration);
    progressAnim.setValue(100);
  }, [duration]);

  useEffect(() => {
    if (paused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 0.1;
        if (newTime <= 0) {
          return 0;
        }
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [paused, timeLeft > 0]); // Only re-run if paused changes or timer status changes

  // Handle ticking sound
  useEffect(() => {
    const playTicking = async () => {
      if (isTickingRef.current) return;

      isTickingRef.current = true;
      try {
        const stop = await playSound(CLOCK_TICKING_SOUND);

        // Critical check: If we were asked to stop while loading (isTickingRef became false),
        // stop immediately.
        if (!isTickingRef.current) {
          stop();
          return;
        }

        stopTickingSoundRef.current = stop;
      } catch (error) {
        console.error('Error playing ticking sound:', error);
        isTickingRef.current = false;
      }
    };

    const stopTicking = async () => {
      isTickingRef.current = false; // Signal intent to stop
      if (stopTickingSoundRef.current) {
        await stopTickingSoundRef.current();
        stopTickingSoundRef.current = null;
      }
    };

    if (timeLeft <= 5 && timeLeft > 0 && !paused) {
      playTicking();
    } else {
      stopTicking();
    }
  }, [timeLeft, paused]);

  // Handle progress animation
  useEffect(() => {
    const progress = (timeLeft / duration) * 100;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [timeLeft, duration]);

  // Handle time up
  useEffect(() => {
    if (timeLeft <= 0 && !paused && onTimeUp) {
      // Ensure we only call this once when time hits 0
      onTimeUp();
    }
  }, [timeLeft, paused]);

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
        <Text style={[styles.timerText, isUrgent && styles.urgentText]}>
          {Math.ceil(timeLeft)}s
        </Text>
      </View>
    </View>
  );
}

const getStyles = () => StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  timerBar: {
    height: 24, // Increased height for text visibility
    backgroundColor: colors.borderLight,
    borderRadius: 99,
    overflow: 'hidden',
    // borderWidth: 2, // Removed as per request
    // borderColor: colors.borderDark, // Removed as per request
    justifyContent: 'center', // Center text vertically
    position: 'relative', // For absolute positioning of text if needed, but flex centering is easier here
  },
  timerProgress: {
    height: '100%',
    borderRadius: 99,
    position: 'absolute', // Make progress absolute so text can sit on top
    left: 0,
    top: 0,
    bottom: 0,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary, // Dark text by default for visibility on light bg
    textAlign: 'center',
    width: '100%',
    zIndex: 1, // Ensure text is above progress bar
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  urgentText: {
    color: colors.error,
    fontSize: 15,
  },
});
