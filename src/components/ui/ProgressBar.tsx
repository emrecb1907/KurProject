import { View, StyleSheet, ViewProps } from 'react-native';
import { colors } from '@constants/colors';

interface ProgressBarProps extends ViewProps {
  progress: number; // 0 to 100
  color?: string;
  backgroundColor?: string;
  height?: number;
}

export function ProgressBar({
  progress,
  color = colors.primary,
  backgroundColor = colors.surfaceVariant,
  height = 8,
  style,
  ...props
}: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <View
      style={[
        styles.container,
        { backgroundColor, height, borderRadius: height / 2 },
        style
      ]}
      {...props}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress}%`,
            backgroundColor: color,
            borderRadius: height / 2,
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});

