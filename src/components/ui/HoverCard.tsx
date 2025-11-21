import React from 'react';
import { Pressable, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    WithSpringConfig
} from 'react-native-reanimated';

interface HoverCardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
    disabled?: boolean;
    lightColor?: string; // Kept for compatibility but unused
}

export const HoverCard: React.FC<HoverCardProps> = ({
    children,
    style,
    onPress,
    disabled,
}) => {
    const scale = useSharedValue(1);
    const translateY = useSharedValue(0);

    const springConfig: WithSpringConfig = {
        damping: 12,
        stiffness: 120,
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: scale.value },
                { translateY: translateY.value }
            ]
        };
    });

    const handlePressIn = () => {
        if (disabled) return;
        scale.value = withSpring(1.05, springConfig);
        translateY.value = withSpring(-8, springConfig);
    };

    const handlePressOut = () => {
        if (disabled) return;
        scale.value = withSpring(1, springConfig);
        translateY.value = withSpring(0, springConfig);
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
            style={({ pressed }) => [
                { flex: 1 }, // Ensure pressable takes space if needed
            ]}
        >
            <Animated.View style={[style, animatedStyle, styles.container]}>
                {children}
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
});
