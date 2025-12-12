import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
    withSpring,
    runOnJS,
    Easing,
    ZoomIn,
    FadeOut
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { colors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';

interface GetReadyOverlayProps {
    visible: boolean;
    onComplete: () => void;
}

const { width } = Dimensions.get('window');

export function GetReadyOverlay({ visible, onComplete }: GetReadyOverlayProps) {
    const count = useSharedValue(3);
    const opacity = useSharedValue(1);
    const scale = useSharedValue(0.5);

    useEffect(() => {
        if (visible) {
            // Sequence: 3 -> 2 -> 1 -> GO
            startCountdown();
        }
    }, [visible]);

    const startCountdown = () => {
        // Initial Haptic
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Animate 3
        count.value = 3;
        scale.value = 0.5;
        opacity.value = 1;

        scale.value = withSpring(1.2, { damping: 10 });

        setTimeout(() => {
            // Animate 2
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            count.value = 2;
            scale.value = 0.5;
            scale.value = withSpring(1.2, { damping: 10 });

            setTimeout(() => {
                // Animate 1
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                count.value = 1;
                scale.value = 0.5;
                scale.value = withSpring(1.2, { damping: 10 });

                setTimeout(() => {
                    // Animate GO / Başla
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    count.value = 0; // 0 represents "Başla!"
                    scale.value = 0.5;
                    scale.value = withSpring(1.5, { damping: 8 });

                    setTimeout(() => {
                        // Finish
                        runOnJS(onComplete)();
                    }, 800);
                }, 1000);
            }, 1000);
        }, 1000);
    };

    const animatedTextStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            opacity: opacity.value
        };
    });

    if (!visible) return null;

    return (
        <View style={styles.container}>
            <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />
            <Animated.View style={[styles.content, animatedTextStyle]}>
                <Text style={styles.countText}>
                    {count.value === 0 ? "BAŞLA!" : count.value}
                </Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999, // Ensure it's on top of everything
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    countText: {
        fontSize: 120,
        fontWeight: '900',
        color: colors.primary,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
        textAlign: 'center',
    }
});
