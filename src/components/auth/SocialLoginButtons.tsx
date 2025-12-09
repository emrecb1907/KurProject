import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Svg, Path, G } from 'react-native-svg';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';

interface SocialLoginButtonsProps {
    onGooglePress: () => void;
    onApplePress: () => void;
    loading?: boolean;
    variant?: 'default' | 'circular';
}

const GoogleLogo = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24">
        <G transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <Path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
            <Path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
            <Path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
            <Path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
        </G>
    </Svg>
);

const AppleLogo = ({ color }: { color?: string }) => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill={color || "currentColor"}>
        <Path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-.68-.32-1.42-.5-2.04-.5-.68 0-1.48.2-2.09.5-1.02.53-2.04.61-3.02-.4-2.07-2.15-3.52-5.47-2.93-8.85.57-3.26 3.14-5.43 5.55-5.43.83 0 1.6.32 2.19.5.53.16 1.05.17 1.56.17.58 0 1.18-.14 1.76-.37.75-.3 1.6-.61 2.5-.61 2.09 0 3.86 1.2 4.69 3.02-3.98 1.96-3.34 7.46 1.39 9.45-.53 1.37-1.2 2.73-2.24 3.77-1.4 1.39-2.89 1.53-4.24 1.53v-3.18h.01zm-3.42-14.8c.22-1.76 1.53-3.16 3.18-3.42.25 1.86-1.4 3.49-3.18 3.42z" />
    </Svg>
);

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
    onGooglePress,
    onApplePress,
    loading = false,
    variant = 'default',
}) => {
    const { themeVersion } = useTheme();
    const styles = useMemo(() => getStyles(), [themeVersion]);

    const isCircular = variant === 'circular';

    return (
        <View style={styles.container}>
            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>veya</Text>
                <View style={styles.divider} />
            </View>

            <View style={[styles.buttonsContainer, isCircular && styles.buttonsContainerCircular]}>
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        isCircular && styles.buttonCircular,
                        pressed && (isCircular ? styles.buttonCircularPressed : styles.buttonPressed),
                        loading && styles.buttonDisabled,
                    ]}
                    onPress={onGooglePress}
                    disabled={loading}
                >
                    <GoogleLogo />
                    {!isCircular && <Text style={styles.buttonText}>Google</Text>}
                </Pressable>

                {Platform.OS === 'ios' && (
                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            isCircular && styles.buttonCircular,
                            pressed && (isCircular ? styles.buttonCircularPressed : styles.buttonPressed),
                            loading && styles.buttonDisabled,
                        ]}
                        onPress={onApplePress}
                        disabled={loading}
                    >
                        <View style={styles.appleIcon}>
                            <AppleLogo color={colors.textPrimary} />
                        </View>
                        {!isCircular && <Text style={styles.buttonText}>Apple</Text>}
                    </Pressable>
                )}
            </View>
        </View>
    );
};

const getStyles = () => StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 24,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
        opacity: 0.2, // More subtle
    },
    dividerText: {
        marginHorizontal: 16,
        color: colors.textSecondary,
        fontSize: 14,
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    buttonsContainerCircular: {
        justifyContent: 'center',
        gap: 24,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 12,
        gap: 8,
    },
    buttonCircular: {
        flex: 0,
        width: 50,
        height: 50,
        borderRadius: 25,
        padding: 0,
        backgroundColor: colors.surfaceLight, // A bit lighter for contrast
        borderWidth: 0, // No border for circular style usually looks cleaner or use a very subtle one
    },
    buttonPressed: {
        backgroundColor: colors.background,
        opacity: 0.8,
    },
    buttonCircularPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.95 }],
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    appleIcon: {
        // Removed color style
    },
});
