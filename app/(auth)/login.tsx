import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card } from '@components/ui';
import { SocialLoginButtons } from '@components/auth/SocialLoginButtons';
import { useAuthHook } from '@hooks';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInWithGoogle, signInWithApple } = useAuthHook();
  const { themeVersion } = useTheme(); // Trigger re-render on theme change

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Re-calculate styles when theme changes
  const styles = useMemo(() => getStyles(), [themeVersion]);

  const handleLogin = async () => {
    console.log('🔵 LoginScreen.handleLogin called');
    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    setError('');

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      // Translate error messages to user-friendly Turkish
      let errorMessage = 'Giriş başarısız';

      if (signInError.message.includes('Invalid login credentials')) {
        errorMessage = 'Email veya şifre hatalı';
      } else if (signInError.message.includes('Email not confirmed')) {
        errorMessage = 'Lütfen email adresinizi onaylayın';
      } else if (signInError.message.includes('User not found')) {
        errorMessage = 'Kullanıcı bulunamadı';
      }

      setError(errorMessage);
      setLoading(false);
    } else {
      router.replace('/(tabs)');
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
          <Pressable onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)');
            }
          }}>
            <Text style={styles.backButton}>← Geri</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Hoş Geldin! 👋</Text>
          <Text style={styles.subtitle}>
            Hesabına giriş yap ve ilerlemeni kaydet
          </Text>

          <Card style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="ornek@email.com"
                placeholderTextColor={colors.textDisabled}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Şifre</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={colors.textDisabled}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Button
              title={loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              onPress={handleLogin}
              disabled={loading}
              fullWidth
              style={styles.submitButton}
            />
          </Card>

          <SocialLoginButtons
            onGooglePress={() => {
              Alert.alert('Yakında', 'Google ile giriş özelliği çok yakında eklenecek!');
            }}
            onApplePress={() => {
              Alert.alert('Yakında', 'Apple ile giriş özelliği çok yakında eklenecek!');
            }}
            loading={loading}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Hesabın yok mu?</Text>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.linkText}>Kayıt Ol</Text>
            </Pressable>
          </View>

          <Pressable onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.skipText}>Şimdilik Atla →</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles are defined in a function to be re-evaluated when theme changes
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
  backButton: {
    fontSize: 16,
    color: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
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
    marginBottom: 32,
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
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  skipText: {
    fontSize: 14,
    color: colors.textDisabled,
    textAlign: 'center',
    marginTop: 24,
  },
});
