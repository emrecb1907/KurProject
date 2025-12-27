import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { X, Lock, Eye, EyeSlash, Check, WarningCircle, Info } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/store';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@components/ui/Button';
import { HeaderButton } from '@components/ui';
import { mapDatabaseError } from '@/lib/utils/mapDatabaseError';

export default function ChangePasswordScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { hasPassword: hasPasswordParam } = useLocalSearchParams<{ hasPassword?: string }>();
    const { themeVersion } = useTheme();
    const { user: storeUser } = useAuth();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(!hasPasswordParam); // Skip check if param provided
    const [hasPassword, setHasPassword] = useState(hasPasswordParam === '1');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const scrollViewRef = useRef<ScrollView>(null);

    // Check if user has a password (from user_metadata)
    useEffect(() => {
        const checkPasswordStatus = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    // Check for Apple relay email - these users can't use email/password
                    const userEmail = user.email || '';
                    if (userEmail.endsWith('@privaterelay.appleid.com')) {
                        console.log('🚫 Relay email user cannot set password, redirecting...');
                        router.back();
                        return;
                    }

                    // has_password metadata is the definitive source
                    // When user sets a password, this flag is set to true
                    const hasPasswordMeta = user.user_metadata?.has_password === true;
                    setHasPassword(hasPasswordMeta);
                }
            } catch (err) {
                console.error('Error checking password status:', err);
            } finally {
                setIsChecking(false);
            }
        };
        checkPasswordStatus();
    }, []);

    useFocusEffect(
        useCallback(() => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        }, [])
    );

    const validatePassword = (password: string) => {
        return password.length >= 6;
    };

    const handleUpdatePassword = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setError(null);
        setSuccess(false);

        // Basic validation
        if (hasPassword && !oldPassword) {
            setError(t('home.changePassword.errors.fillAll'));
            return;
        }

        if (!newPassword || !confirmPassword) {
            setError(t('home.changePassword.errors.fillAll'));
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(t('home.changePassword.errors.notMatch'));
            return;
        }

        if (!validatePassword(newPassword)) {
            setError(t('home.changePassword.errors.tooShort'));
            return;
        }

        if (hasPassword && oldPassword === newPassword) {
            setError(t('home.changePassword.errors.sameAsOld'));
            return;
        }

        setIsLoading(true);

        try {
            if (hasPassword) {
                // MODE: Change Password (user has existing password)
                const { data: { user } } = await supabase.auth.getUser();
                if (!user?.email) {
                    throw new Error(t('home.changePassword.errors.userNotFound'));
                }

                // 1. Verify old password by attempting to sign in
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: user.email,
                    password: oldPassword,
                });

                if (signInError) {
                    setError(t('home.changePassword.errors.wrongPassword'));
                    setIsLoading(false);
                    return;
                }
            }

            // 2. Update to new password (works for both modes)
            // Also set has_password flag in user metadata for future detection
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
                data: { has_password: true }
            });

            if (updateError) {
                throw updateError;
            }

            // Update local state
            setHasPassword(true);

            setSuccess(true);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');

            // Optional: Navigate back after a delay
            setTimeout(() => {
                router.back();
            }, 2000);

        } catch (err: any) {
            console.error('Password update error:', err);
            setError(mapDatabaseError(err.message, t, t('home.changePassword.errors.general')));
        } finally {
            setIsLoading(false);
        }
    };

    // Dynamic title and button text
    const pageTitle = isChecking
        ? t('common.loading')
        : hasPassword
            ? t('home.changePassword.title')
            : t('home.setPassword.title');

    const buttonText = hasPassword
        ? t('home.changePassword.updateButton')
        : t('home.setPassword.setButton');

    const successMessage = hasPassword
        ? t('home.changePassword.success')
        : t('home.setPassword.success');

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        backButton: {
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
        },
        headerTitleContainer: {
            position: 'absolute',
            left: 0,
            right: 0,
            alignItems: 'center',
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.textPrimary,
            textAlign: 'center',
            position: 'absolute',
            left: 0,
            right: 0,
            zIndex: -1,
        },
        headerSpacer: {
            width: 40,
        },
        content: {
            flex: 1,
        },
        scrollContent: {
            padding: 24,
        },
        infoContainer: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            backgroundColor: colors.primary + '15',
            padding: 16,
            borderRadius: 12,
            marginBottom: 24,
            gap: 12,
        },
        infoText: {
            color: colors.textPrimary,
            fontSize: 14,
            flex: 1,
            lineHeight: 20,
        },
        formGroup: {
            marginBottom: 24,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.textSecondary,
            marginBottom: 8,
            marginLeft: 4,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderWidth: 2,
            borderColor: colors.border,
            borderRadius: 16,
            paddingHorizontal: 16,
            height: 56,
        },
        inputContainerFocused: {
            borderColor: colors.primary,
        },
        inputIcon: {
            marginRight: 12,
        },
        input: {
            flex: 1,
            fontSize: 16,
            color: colors.textPrimary,
            height: '100%',
        },
        eyeButton: {
            padding: 8,
        },
        requirements: {
            marginTop: -12,
            marginBottom: 24,
            paddingHorizontal: 4,
        },
        requirementText: {
            fontSize: 12,
            color: colors.textSecondary,
            marginTop: 4,
        },
        errorContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFE5E5',
            padding: 12,
            borderRadius: 12,
            marginBottom: 24,
            gap: 8,
        },
        errorText: {
            color: '#D32F2F',
            fontSize: 14,
            flex: 1,
        },
        successContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#E8F5E9',
            padding: 12,
            borderRadius: 12,
            marginBottom: 24,
            gap: 8,
        },
        successText: {
            color: '#2E7D32',
            fontSize: 14,
            flex: 1,
        },
        updateButton: {
            backgroundColor: '#FF9600',
            height: 56,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 8,
        },
        updateButtonText: {
            color: '#000000',
            fontSize: 18,
            fontWeight: 'bold',
        },
        updateButtonDisabled: {
            backgroundColor: '#D1D5DB',
            opacity: 0.6,
        },
    });

    const isButtonDisabled = isLoading ||
        (hasPassword && !oldPassword) ||
        !newPassword ||
        !confirmPassword;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={{ flex: 1 }}>
                    {/* Header */}
                    <View style={styles.header}>
                        <HeaderButton
                            title={t('common.back')}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                router.back();
                            }}
                            style={{ marginLeft: -8 }}
                        />
                        <Text style={styles.headerTitle}>{pageTitle}</Text>
                    </View>

                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.content}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Info box for OAuth users (no password yet) */}
                        {!hasPassword && (
                            <View style={styles.infoContainer}>
                                <Info size={24} color={colors.primary} weight="fill" />
                                <Text style={styles.infoText}>
                                    {t('home.setPassword.info')}
                                </Text>
                            </View>
                        )}

                        {/* Error Message */}
                        {error && (
                            <View style={styles.errorContainer}>
                                <WarningCircle size={20} color="#D32F2F" weight="fill" />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        {/* Success Message */}
                        {
                            success && (
                                <View style={styles.successContainer}>
                                    <Check size={20} color="#2E7D32" weight="fill" />
                                    <Text style={styles.successText}>{successMessage}</Text>
                                </View>
                            )
                        }

                        {/* Old Password - Only show if user HAS password */}
                        {hasPassword && (
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>{t('home.changePassword.currentPassword')}</Text>
                                <View style={styles.inputContainer}>
                                    <Lock size={20} color={colors.textSecondary} weight="fill" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        value={oldPassword}
                                        onChangeText={setOldPassword}
                                        placeholder={t('home.changePassword.currentPasswordPlaceholder')}
                                        placeholderTextColor={colors.textDisabled}
                                        secureTextEntry={!showOldPassword}
                                        autoCapitalize="none"
                                    />
                                    <Pressable
                                        style={styles.eyeButton}
                                        onPress={() => setShowOldPassword(!showOldPassword)}
                                    >
                                        {showOldPassword ? (
                                            <EyeSlash size={20} color={colors.textSecondary} />
                                        ) : (
                                            <Eye size={20} color={colors.textSecondary} />
                                        )}
                                    </Pressable>
                                </View>
                            </View>
                        )}

                        {/* New Password */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>{t('home.changePassword.newPassword')}</Text>
                            <View style={styles.inputContainer}>
                                <Lock size={20} color={colors.textSecondary} weight="fill" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    placeholder={t('home.changePassword.newPasswordPlaceholder')}
                                    placeholderTextColor={colors.textDisabled}
                                    secureTextEntry={!showNewPassword}
                                    autoCapitalize="none"
                                />
                                <Pressable
                                    style={styles.eyeButton}
                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? (
                                        <EyeSlash size={20} color={colors.textSecondary} />
                                    ) : (
                                        <Eye size={20} color={colors.textSecondary} />
                                    )}
                                </Pressable>
                            </View>
                        </View>

                        <View style={styles.requirements}>
                            <Text style={styles.requirementText}>• {t('home.changePassword.requirement')}</Text>
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>{t('home.changePassword.confirmPassword')}</Text>
                            <View style={styles.inputContainer}>
                                <Lock size={20} color={colors.textSecondary} weight="fill" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder={t('home.changePassword.confirmPasswordPlaceholder')}
                                    placeholderTextColor={colors.textDisabled}
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize="none"
                                />
                                <Pressable
                                    style={styles.eyeButton}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeSlash size={20} color={colors.textSecondary} />
                                    ) : (
                                        <Eye size={20} color={colors.textSecondary} />
                                    )}
                                </Pressable>
                            </View>
                        </View>

                        {/* Update Button */}
                        <TouchableOpacity
                            style={[
                                styles.updateButton,
                                isButtonDisabled && styles.updateButtonDisabled
                            ]}
                            onPress={handleUpdatePassword}
                            disabled={isButtonDisabled}
                        >
                            <Text style={styles.updateButtonText}>
                                {isLoading ? t('profile.editProfile.saving') : buttonText}
                            </Text>
                        </TouchableOpacity>

                    </ScrollView >
                </View >
            </KeyboardAvoidingView >
        </SafeAreaView>
    );
}
