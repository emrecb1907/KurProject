import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing,
    cancelAnimation
} from 'react-native-reanimated';
import { colors } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';

interface LoadingSpinnerProps {
    size?: number;
    color?: string;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function LoadingSpinner({ size = 60, color }: LoadingSpinnerProps) {
    const { activeTheme } = useTheme();
    const isLight = activeTheme === 'light';

    // Setup Shared Values
    const rotation = useSharedValue(0);
    const arcLength = useSharedValue(0.25); // Start small

    const primaryColor = color || colors.primary;
    const trackColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';

    useEffect(() => {
        // Continuous Rotation - Slower for premium feel
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 1500,
                easing: Easing.linear,
            }),
            -1
        );

        // Breathing Arc (Indeterminate Effect)
        // Cycles between short and long arc
        arcLength.value = withRepeat(
            withSequence(
                withTiming(0.75, { duration: 1000, easing: Easing.inOut(Easing.cubic) }), // Grow
                withTiming(0.25, { duration: 1000, easing: Easing.inOut(Easing.cubic) })  // Shrink
            ),
            -1,
            true // Reverse
        );

        return () => {
            cancelAnimation(rotation);
            cancelAnimation(arcLength);
        };
    }, []);

    // Rotate the Container (Robust)
    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    // Animate Stroke Dash Array (Breathing)
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const animatedCircleProps = useAnimatedProps(() => {
        const length = circumference * arcLength.value;
        // SVG strokeDasharray: "length gap"
        return {
            strokeDasharray: [length, circumference - length],
        };
    });

    return (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
            <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
                {/* Track Circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={trackColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
            </Svg>

            {/* Rotating Layer */}
            <Animated.View style={[StyleSheet.absoluteFill, containerStyle, { justifyContent: 'center', alignItems: 'center' }]}>
                <Svg width={size} height={size}>
                    <AnimatedCircle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={primaryColor}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeLinecap="round" // Round caps for premium feel
                        animatedProps={animatedCircleProps}
                        rotation="-90"
                        origin={`${size / 2}, ${size / 2}`}
                    />
                </Svg>
            </Animated.View>
        </View>
    );
}
