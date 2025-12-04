import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { X, Lock, Eye, EyeSlash, Check, WarningCircle } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/store';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@components/ui/Button';

export default function ChangePasswordScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { themeVersion } = useTheme();
    const { user } = useAuth();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const scrollViewRef = useRef<ScrollView>(null);

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
        if (!oldPassword || !newPassword || !confirmPassword) {
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

        if (oldPassword === newPassword) {
            setError(t('home.changePassword.errors.sameAsOld'));
            return;
        }

        setIsLoading(true);

        try {
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

            // 2. Update to new password
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (updateError) {
                throw updateError;
            }

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
            setError(err.message || t('home.changePassword.errors.general'));
        } finally {
            setIsLoading(false);
        }
    };

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
            paddingTop: 60,
            paddingBottom: 16,
            backgroundColor: colors.backgroundDarker,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        backButton: {
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.textPrimary,
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
            backgroundColor: colors.primary,
            height: 56,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 8,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
        },
        updateButtonText: {
            color: colors.textOnPrimary,
            fontSize: 18,
            fontWeight: 'bold',
        },
        updateButtonDisabled: {
            backgroundColor: colors.textDisabled,
            shadowOpacity: 0,
            elevation: 0,
        },
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { flex: 1 }]}
        >
            <View style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable
                        style={styles.backButton}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.back();
                        }}
                    >
                        <X size={24} color={colors.textPrimary} weight="bold" />
                    </Pressable>
                    <Text style={styles.headerTitle}>{t('home.changePassword.title')}</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                    ref={scrollViewRef}
                    style={styles.content}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
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
                                <Text style={styles.successText}>{t('home.changePassword.success')}</Text>
                            </View>
                        )
                    }

                    {/* Old Password */}
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
                    <Pressable
                        style={[
                            styles.updateButton,
                            (isLoading || !oldPassword || !newPassword || !confirmPassword) && styles.updateButtonDisabled
                        ]}
                        onPress={handleUpdatePassword}
                        disabled={isLoading || !oldPassword || !newPassword || !confirmPassword}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={colors.textOnPrimary} />
                        ) : (
                            <Text style={styles.updateButtonText}>{t('home.changePassword.updateButton')}</Text>
                        )}
                    </Pressable>

                </ScrollView >
            </View >
        </KeyboardAvoidingView >
    );
}
