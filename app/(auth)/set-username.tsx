import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card } from '@components/ui';
import { useAuthHook } from '../../src/hooks';
import { colors } from '@constants/colors';
import { supabase } from '@/lib/supabase/client';

export default function SetUsernameScreen() {
    const router = useRouter();
    const { user, signOut } = useAuthHook();

    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreate = async () => {
        if (!username.trim()) {
            setError('Lütfen bir kullanıcı adı girin');
            return;
        }

        if (username.length < 3) {
            setError('Kullanıcı adı en az 3 karakter olmalı');
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
                .single();

            if (existingUser) {
                setError('Bu kullanıcı adı zaten kullanımda');
                setLoading(false);
                return;
            }

            // Create user record
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
                // Use metadata if available
                avatar_url: user.user_metadata?.avatar_url || null,
                full_name: user.user_metadata?.full_name || null,
            });

            if (dbError) throw dbError;

            // Success
            router.replace('/(tabs)');
        } catch (err: any) {
            console.error('Error creating user:', err);
            setError(err.message || 'Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        Alert.alert(
            'İptal Et',
            'İşlemi iptal ederseniz giriş yapamazsınız. Emin misiniz?',
            [
                { text: 'Hayır', style: 'cancel' },
                {
                    text: 'Evet',
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                        router.replace('/(auth)/login');
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
                    <Text style={styles.title}>Son Bir Adım! 🚀</Text>
                    <Text style={styles.subtitle}>
                        Uygulamada seni tanıyabilmemiz için kendine bir kullanıcı adı seç.
                    </Text>

                    <Card style={styles.formCard}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Kullanıcı Adı</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Kullanıcı adın"
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
                            title={loading ? 'Oluşturuluyor...' : 'Oluştur ve Başla'}
                            onPress={handleCreate}
                            disabled={loading}
                            fullWidth
                            style={styles.submitButton}
                        />

                        <Button
                            title="Vazgeç"
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    content: {
        padding: 24,
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
        marginBottom: 12,
    },
    cancelButton: {
        borderColor: colors.error,
    },
});
