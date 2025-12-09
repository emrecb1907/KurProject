import { View, Text, StyleSheet, BackHandler, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { colors } from '@constants/colors';
import { Button } from '@components/ui';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function WelcomeScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { activeTheme } = useTheme();

    // Prevent going back
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                BackHandler.exitApp();
                return true;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [])
    );

    const isDark = activeTheme === 'dark';

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>

                {/* Spacer to push content down significantly, or center it. 
            The image suggests content is vertically centered but slightly top-heavy.
        */}
                <View style={{ flex: 1 }} />

                <Text style={styles.title}>{t('auth.welcome.title')}</Text>
                <Text style={styles.subtitle}>{t('auth.welcome.subtitle')}</Text>

                <View style={styles.buttonContainer}>
                    <Button
                        title={t('auth.welcome.loginButton')}
                        onPress={() => router.push('/(auth)/login')}
                        fullWidth
                        style={styles.loginButton}
                    />

                    <Button
                        title={t('auth.welcome.registerButton')}
                        onPress={() => router.push('/(auth)/register')}
                        fullWidth
                        variant="outline"
                        style={styles.registerButton}
                        textStyle={styles.registerButtonText}
                    />
                </View>

                <Text style={styles.safetyNote}>{t('auth.welcome.safetyNote')}</Text>

                <View style={{ flex: 1 }} />

                <Pressable style={styles.footer}>
                    <Text style={styles.footerText}>{t('auth.welcome.policies')}</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    title: {
        fontSize: 28, // Large title
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 48,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
        marginBottom: 24,
    },
    loginButton: {
        height: 56,
        borderRadius: 28, // Pill shape
    },
    registerButton: {
        height: 56,
        borderRadius: 28, // Pill shape
        backgroundColor: '#1F2024', // Dark background for secondary button in dark mode
        borderColor: 'transparent',
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    safetyNote: {
        fontSize: 13,
        color: colors.textSecondary,
        textAlign: 'center',
        maxWidth: '80%',
        lineHeight: 18,
    },
    footer: {
        marginBottom: 20,
    },
    footerText: {
        fontSize: 12,
        color: colors.textDisabled,
        textAlign: 'center',
    }
});
