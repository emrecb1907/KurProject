import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/store';
import { database } from '@/lib/supabase/database';
import { supabase } from '@/lib/supabase/client';
import { validateText } from '@/utils/profanityFilter';
import { X, User, Check, Warning } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

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
            backgroundColor: colors.primary,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 8,
        },
        saveButtonDisabled: {
            opacity: 0.7,
        },
        saveButtonText: {
            color: colors.textOnPrimary,
            fontSize: 16,
            fontWeight: 'bold',
        },
    }), [themeVersion]);

    const handleSave = async () => {
        if (!user?.id) return;

        // 1. Validate Input (Profanity & Safety Check)
        const validation = validateText(username);

        if (!validation.isValid) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setError(validation.error || 'Geçersiz kullanıcı adı.');
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
            const { error: updateError } = await database.users.update(user.id, {
                username: username.trim(),
            });

            if (updateError) throw updateError;

            // 4. Update Local State
            setUser({ ...user, username: username.trim() });

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setSuccess('Profiliniz başarıyla güncellendi!');

            // Go back after a short delay
            setTimeout(() => {
                router.back();
            }, 1500);

        } catch (err: any) {
            // Only log unexpected errors to console
            if (err.message !== 'Bu kullanıcı adı zaten kullanılıyor.') {
                console.error('Update profile error:', err);
            }

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setError(err.message || 'Profil güncellenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
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
                <Text style={styles.headerTitle}>Profili Düzenle</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Kullanıcı Adı</Text>
                    <View style={styles.inputContainer}>
                        <User size={20} color={colors.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={(text) => {
                                setUsername(text);
                                setError('');
                            }}
                            placeholder="Kullanıcı adı"
                            placeholderTextColor={colors.textDisabled}
                            autoCapitalize="none"
                            autoCorrect={false}
                            maxLength={20}
                        />
                    </View>
                    <Text style={styles.helperText}>
                        Kullanıcı adınız benzersiz olmalıdır. Sadece harf, rakam ve alt çizgi (_) kullanabilirsiniz.
                        Uygunsuz, hakaret içeren veya dini değerlere saygısızlık eden kullanıcı adları yasaktır.
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

                <Pressable
                    style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={colors.textOnPrimary} />
                    ) : (
                        <Text style={styles.saveButtonText}>Kaydet</Text>
                    )}
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}
