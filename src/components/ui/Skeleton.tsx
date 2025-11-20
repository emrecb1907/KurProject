import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewProps } from 'react-native';
import { colors } from '@constants/colors';

interface SkeletonProps extends ViewProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  variant?: 'text' | 'rectangular' | 'circular';
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 8,
  variant = 'rectangular',
  style,
  ...props
}: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const getVariantStyle = () => {
    switch (variant) {
      case 'text':
        return { height: 16, borderRadius: 4 };
      case 'circular':
        return {
          width: height,
          height,
          borderRadius: height / 2
        };
      case 'rectangular':
      default:
        return {};
    }
  };

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        getVariantStyle(),
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.backgroundLighter,
  },
});

