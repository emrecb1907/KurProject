import { View, Text, StyleSheet, BackHandler, Pressable, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { colors } from '@constants/colors';
import { Button } from '@components/ui';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { usePremium } from '@/contexts/AdaptyProvider';
import * as Haptics from 'expo-haptics';

export default function WelcomeScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { activeTheme } = useTheme();

    const styles = useMemo(() => getStyles(activeTheme), [activeTheme]);
    const { restore } = usePremium();
    const [isRestoring, setIsRestoring] = useState(false);

    // Restore handler - direkt sorgu yap, onay isteme
    const handleRestore = useCallback(async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsRestoring(true);

        try {
            const success = await restore();
            if (success) {
                // Abonelik bulundu - giriş yapması gerektiğini söyle
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert(
                    t('auth.welcome.subscriptionFound.title'),
                    t('auth.welcome.subscriptionFound.message'),
                    [{ text: t('common.ok') }]
                );
            } else {
                // Abonelik bulunamadı
                Alert.alert(
                    t('premiumpaywall.restoreResult.noSubscription.title'),
                    t('premiumpaywall.restoreResult.noSubscription.message')
                );
            }
        } catch (error) {
            console.error('Restore error:', error);
            Alert.alert(
                t('common.error'),
                t('premiumpaywall.errors.restoreFailed')
            );
        } finally {
            setIsRestoring(false);
        }
    }, [restore, t]);

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

    return (
        <View style={styles.container}>
            <View style={styles.content}>

                {/* Spacer to push content down significantly, or center it. 
            The image suggests content is vertically centered but slightly top-heavy.
        */}
                <View style={{ flex: 1 }} />

                {/* Logo */}
                <Image
                    source={require('../../assets/splashlogo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

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

                <View style={styles.footer}>
                    <View style={styles.footerLinks}>
                        <Pressable>
                            <Text style={styles.footerText}>{t('auth.welcome.policies')}</Text>
                        </Pressable>
                        <Text style={styles.footerDivider}>•</Text>
                        <Pressable onPress={handleRestore} disabled={isRestoring}>
                            {isRestoring ? (
                                <ActivityIndicator size="small" color={colors.textDisabled} />
                            ) : (
                                <Text style={styles.footerText}>{t('premiumpaywall.restore')}</Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}

const getStyles = (activeTheme: string) => StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 24,
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
        backgroundColor: activeTheme === 'light' ? colors.surface : '#1F2024',
        borderColor: activeTheme === 'light' ? colors.border : 'transparent',
        borderWidth: activeTheme === 'light' ? 1 : 0,
    },
    registerButtonText: {
        color: activeTheme === 'light' ? colors.textPrimary : '#FFFFFF',
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
    footerLinks: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    footerDivider: {
        fontSize: 12,
        color: colors.textDisabled,
    },
    footerText: {
        fontSize: 12,
        color: colors.textDisabled,
        textAlign: 'center',
    }
});
