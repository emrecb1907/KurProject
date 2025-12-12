import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/store';
import { database } from '@/lib/supabase/database';
import { supabase } from '@/lib/supabase/client';
import { validateText } from '@/utils/profanityFilter';
import { mapDatabaseError } from '@/lib/utils/mapDatabaseError';
import { User, Check, Warning } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { HeaderButton } from '@components/ui';

export default function EditProfileScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { themeVersion } = useTheme();
    const { user, setUser } = useAuth();

    const [username, setUsername] = useState(user?.username || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingTop: 16,
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
            padding: 24,
        },
        inputGroup: {
            marginBottom: 24,
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
            marginRight: 12,
        },
        input: {
            flex: 1,
            paddingVertical: 16,
            fontSize: 16,
            color: colors.textPrimary,
        },
        helperText: {
            fontSize: 12,
            color: colors.textSecondary,
            marginTop: 8,
            lineHeight: 18,
        },
        errorBox: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: `${colors.error}15`,
            padding: 12,
            borderRadius: 8,
            marginBottom: 24,
            gap: 8,
        },
        errorText: {
            flex: 1,
            color: colors.error,
            fontSize: 14,
        },
        successBox: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: `${colors.success}15`,
            padding: 12,
            borderRadius: 8,
            marginBottom: 24,
            gap: 8,
        },
        successText: {
            flex: 1,
            color: colors.success,
            fontSize: 14,
        },
        saveButton: {
            backgroundColor: '#FF9600',
            borderRadius: 30,
            paddingVertical: 16,
            alignItems: 'center',
            marginTop: 16,
        },
        saveButtonDisabled: {
            opacity: 0.7,
        },
        saveButtonText: {
            color: '#000000',
            fontSize: 18,
            fontWeight: 'bold',
        },
    }), [themeVersion]);

    const handleSave = async () => {
        if (!user?.id) return;

        // 1. Validate Input (Profanity & Safety Check)
        const validation = validateText(username);

        if (!validation.isValid) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setError(validation.error || t('profile.editProfile.invalidUsername'));
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // 2. Check if username is already taken (excluding current user)
            // Note: This check should ideally be done via an RPC or Edge Function for security,
            // but for now we'll do a client-side check.
            if (username !== user.username) {
                const { data: existingUser, error: checkError } = await supabase
                    .from('users')
                    .select('id')
                    .ilike('username', username)
                    .neq('id', user.id)
                    .single();

                if (existingUser) {
                    throw new Error('Bu kullanıcı adı zaten kullanılıyor.');
                }

                // Ignore "no rows found" error as that's what we want
                if (checkError && checkError.code !== 'PGRST116') {
                    console.error('Error checking username:', checkError);
                    // Proceed cautiously or throw error depending on strictness
                }
            }

            // 3. Update User in Database
            const { error: updateError } = await database.users.updateProfile(user.id, {
                username: username.trim(),
            });

            if (updateError) throw updateError;

            // 4. Update Local State
            setUser({ ...user, username: username.trim() });

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setSuccess(t('profile.editProfile.successMessage'));

            // Go back after a short delay
            setTimeout(() => {
                router.back();
            }, 1500);

        } catch (err: any) {
            console.error('Update profile error:', err);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            // 🛡️ Kullanıcı dostu hata mesajı (ham SQL hatalarını gizle)
            setError(mapDatabaseError(err.message, t));
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <HeaderButton
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.back();
                    }}
                    title={t('common.back')}
                />
                <Text style={styles.headerTitle}>{t('profile.editProfile.title')}</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>{t('profile.editProfile.username')}</Text>
                    <View style={styles.inputContainer}>
                        <User size={20} color={colors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={(text) => {
                                setUsername(text);
                                setError('');
                            }}
                            placeholder={t('profile.editProfile.usernamePlaceholder')}
                            placeholderTextColor={colors.textDisabled}
                            autoCapitalize="none"
                            autoCorrect={false}
                            maxLength={20}
                        />
                    </View>
                    <Text style={styles.helperText}>
                        {t('profile.editProfile.usernameHelper')}
                    </Text>
                </View>

                {error ? (
                    <View style={styles.errorBox}>
                        <Warning size={20} color={colors.error} weight="fill" />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                {success ? (
                    <View style={styles.successBox}>
                        <Check size={20} color={colors.success} weight="fill" />
                        <Text style={styles.successText}>{success}</Text>
                    </View>
                ) : null}

                <TouchableOpacity
                    style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    <Text style={styles.saveButtonText}>
                        {loading ? t('profile.editProfile.saving') : t('common.save')}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
