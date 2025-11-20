import { View, StyleSheet, ViewProps, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '@constants/colors';

interface GlassCardProps extends ViewProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  padding?: number;
}

export function GlassCard({
  intensity = 20,
  tint = 'light',
  padding = 16,
  style,
  children,
  ...props
}: GlassCardProps) {
  if (Platform.OS === 'web') {
    // Fallback for web - use semi-transparent background
    return (
      <View
        style={[
          styles.webFallback,
          { padding },
          style
        ]}
        {...props}
      >
        {children}
      </View>
    );
  }

  return (
    <BlurView
      intensity={intensity}
      tint={tint}
      style={[
        styles.container,
        { padding },
        style
      ]}
      {...props}
    >
      <View style={styles.overlay} />
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  webFallback: {
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadowLight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});

