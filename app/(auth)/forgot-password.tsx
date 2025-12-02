import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card } from '@components/ui';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase/client';
import { Envelope, ArrowLeft, CheckCircle, WarningCircle } from 'phosphor-react-native';

export default function ForgotPasswordScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { themeVersion } = useTheme();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const styles = useMemo(() => getStyles(), [themeVersion]);

    const handleResetPassword = async () => {
        if (!email) {
            setError(t('auth.errors.fillAllFields') || 'Lütfen e-posta adresinizi girin.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'quranlearn://reset-password', // Update this with your actual deep link scheme if configured
            });

            if (error) {
                throw error;
            }

            setSuccess(true);
        } catch (err: any) {
            console.error('Password reset error:', err);
            setError(err.message || 'Şifre sıfırlama bağlantısı gönderilemedi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButtonContainer}>
                        <ArrowLeft size={24} color={colors.primary} weight="bold" />
                        <Text style={styles.backButton}>{t('common.back') || 'Geri'}</Text>
                    </Pressable>
                </View>

                <View style={styles.content}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{t('auth.forgotPassword.title') || 'Şifremi Unuttum'}</Text>
                        <Text style={styles.subtitle}>
                            {t('auth.forgotPassword.subtitle') || 'E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.'}
                        </Text>
                    </View>

                    <Card style={styles.formCard}>
                        {success ? (
                            <View style={styles.successContainer}>
                                <CheckCircle size={48} color={colors.success} weight="fill" />
                                <Text style={styles.successTitle}>E-posta Gönderildi!</Text>
                                <Text style={styles.successMessage}>
                                    Lütfen e-posta kutunuzu kontrol edin. Şifre sıfırlama talimatlarını içeren bir e-posta gönderdik.
                                </Text>
                                <Button
                                    title="Giriş Yap'a Dön"
                                    onPress={() => router.replace('/(auth)/login')}
                                    fullWidth
                                    style={styles.returnButton}
                                />
                            </View>
                        ) : (
                            <>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>{t('auth.login.email') || 'E-posta'}</Text>
                                    <View style={styles.inputContainer}>
                                        <Envelope size={20} color={colors.textSecondary} weight="fill" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder={t('auth.login.emailPlaceholder') || 'ornek@email.com'}
                                            placeholderTextColor={colors.textDisabled}
                                            value={email}
                                            onChangeText={setEmail}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            autoCorrect={false}
                                        />
                                    </View>
                                </View>

                                {error && (
                                    <View style={styles.errorBox}>
                                        <WarningCircle size={20} color={colors.error} weight="fill" />
                                        <Text style={styles.errorText}>{error}</Text>
                                    </View>
                                )}

                                <Button
                                    title={loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
                                    onPress={handleResetPassword}
                                    disabled={loading}
                                    fullWidth
                                    style={styles.submitButton}
                                />
                            </>
                        )}
                    </Card>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const getStyles = () => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    backButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    backButton: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    titleContainer: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        lineHeight: 24,
    },
    formCard: {
        padding: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        backgroundColor: colors.surface,
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        fontSize: 16,
        color: colors.textPrimary,
    },
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: `${colors.error}15`,
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        gap: 8,
    },
    errorText: {
        color: colors.error,
        fontSize: 14,
        flex: 1,
    },
    submitButton: {
        marginTop: 8,
    },
    successContainer: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    successTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginTop: 16,
        marginBottom: 8,
    },
    successMessage: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    returnButton: {
        marginTop: 8,
    },
});
