import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, BackHandler, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card } from '@components/ui';
import { useAuthHook } from '../../src/hooks';
import { colors } from '@constants/colors';
import { supabase } from '@/lib/supabase/client';
import { mapDatabaseError } from '@/lib/utils/mapDatabaseError';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '@/contexts/ThemeContext';

export default function SetUsernameScreen() {
    const router = useRouter();
    const { user, signOut, initializeAuth } = useAuthHook();
    const { t } = useTranslation();
    const { activeTheme } = useTheme();

    const styles = useMemo(() => getStyles(activeTheme), [activeTheme]);

    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Prevent back navigation - username is required
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                Alert.alert(
                    t('auth.setUsername.usernameRequired'),
                    t('auth.setUsername.usernameRequiredMessage'),
                    [{ text: t('common.ok') }]
                );
                return true; // Prevent default back action
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => subscription.remove();
        }, [t])
    );

    const handleCreate = async () => {
        if (!username.trim()) {
            setError(t('auth.setUsername.errors.enterUsername'));
            return;
        }

        if (username.length < 3) {
            setError(t('auth.setUsername.errors.minLength'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (!user) throw new Error('Kullanıcı bulunamadı');

            // Check if username is taken
            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('username', username)
                .neq('id', user.id) // Exclude current user
                .single();

            if (existingUser) {
                setError(t('auth.setUsername.errors.usernameTaken'));
                setLoading(false);
                return;
            }

            // Check if user already exists in DB (Apple/Google OAuth creates the record)
            const { data: currentUser } = await supabase
                .from('users')
                .select('id')
                .eq('id', user.id)
                .single();

            if (currentUser) {
                // User exists (OAuth flow) - UPDATE username
                const { error: updateError } = await supabase
                    .from('users')
                    .update({ username: username })
                    .eq('id', user.id);

                if (updateError) throw updateError;
            } else {
                // New user - INSERT (legacy flow, shouldn't happen with Apple)
                const { error: dbError } = await supabase.from('users').insert({
                    id: user.id,
                    email: user.email,
                    username: username,
                    is_anonymous: false,
                    current_lives: 5,
                    max_lives: 5,
                    total_xp: 0,
                    current_level: 1,
                    total_score: 0,
                    streak_count: 0,
                    league: 'Bronze',
                    avatar_url: user.user_metadata?.avatar_url || null,
                    full_name: user.user_metadata?.full_name || null,
                });

                if (dbError) throw dbError;
            }

            // Re-initialize auth to fetch updated user data
            await initializeAuth();

            // Success
            router.replace('/(tabs)');
        } catch (err: any) {
            console.error('Error creating/updating user:', err);
            setError(mapDatabaseError(err.message, t));
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        Alert.alert(
            t('auth.setUsername.cancel.title'),
            t('auth.setUsername.cancel.message'),
            [
                { text: t('common.no'), style: 'cancel' },
                {
                    text: t('common.yes'),
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                        router.replace('/(auth)/welcome');
                    }
                }
            ]
        );
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
                <View style={styles.content}>
                    {/* Logo */}
                    <Image
                        source={require('../../assets/splashlogo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text style={styles.title}>{t('auth.setUsername.title')}</Text>
                    <Text style={styles.subtitle}>
                        {t('auth.setUsername.subtitle')}
                    </Text>

                    <Card style={styles.formCard}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>{t('auth.setUsername.usernameLabel')}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={t('auth.setUsername.usernamePlaceholder')}
                                placeholderTextColor={colors.textDisabled}
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        {error ? (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        <Button
                            title={loading ? t('auth.setUsername.creating') : t('auth.setUsername.createButton')}
                            onPress={handleCreate}
                            disabled={loading}
                            fullWidth
                            style={styles.submitButton}
                        />

                        <Button
                            title={t('auth.setUsername.cancelButton')}
                            onPress={handleCancel}
                            disabled={loading}
                            variant="outline"
                            fullWidth
                            style={styles.cancelButton}
                        />
                    </Card>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const getStyles = (activeTheme: string) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 40,
    },
    content: {
        padding: 24,
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 24,
        tintColor: activeTheme === 'light' ? '#000000' : undefined,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 32,
        textAlign: 'center',
        lineHeight: 24,
    },
    formCard: {
        marginBottom: 24,
        width: '100%',
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
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: colors.textPrimary,
        backgroundColor: colors.surface,
    },
    errorBox: {
        backgroundColor: `${colors.error}15`,
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        color: colors.error,
        fontSize: 14,
        textAlign: 'center',
    },
    submitButton: {
        height: 56,
        borderRadius: 28,
        marginBottom: 12,
    },
    cancelButton: {
        height: 56,
        borderRadius: 28,
        backgroundColor: activeTheme === 'light' ? colors.surface : '#1F2024',
        borderColor: activeTheme === 'light' ? colors.border : 'transparent',
        borderWidth: activeTheme === 'light' ? 1 : 0,
    },
});
