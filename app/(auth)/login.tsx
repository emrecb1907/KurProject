import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@components/ui';
import { SocialLoginButtons } from '@components/auth/SocialLoginButtons';
import { useAuthHook } from '@hooks';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, BookOpen, Eye, EyeSlash } from 'phosphor-react-native';

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signInWithEmailOrUsername } = useAuthHook();
  const { themeVersion, activeTheme } = useTheme();

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Re-calculate styles when theme changes
  const styles = useMemo(() => getStyles(activeTheme), [themeVersion, activeTheme]);

  const handleLogin = async () => {
    if (!emailOrUsername || !password) {
      setError(t('auth.errors.fillAllFields'));
      return;
    }

    setLoading(true);
    setError('');

    const { error: signInError } = await signInWithEmailOrUsername(emailOrUsername, password);

    if (signInError) {
      // Translate error messages to user-friendly messages
      let errorMessage = t('auth.errors.loginFailed');

      // 🛡️ Rate Limit kontrolü (429 Too Many Requests)
      if (signInError.message.includes('Too many requests') ||
        signInError.message.includes('rate limit') ||
        signInError.message.includes('Request rate limit')) {
        errorMessage = t('errors.rateLimit.auth.message');
      } else if (signInError.message.includes('Invalid login credentials')) {
        errorMessage = t('auth.errors.invalidCredentials');
      } else if (signInError.message.includes('Email not confirmed')) {
        errorMessage = t('auth.errors.emailNotConfirmed');
      } else if (signInError.message.includes('User not found') || signInError.message.includes('Kullanıcı adı bulunamadı')) {
        errorMessage = t('auth.errors.userNotFound', 'Kullanıcı adı veya email bulunamadı.');
      }

      setError(errorMessage);
      setLoading(false);
    } else {
      router.replace('/(tabs)');
    }
  };

  const isDark = activeTheme === 'dark';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/(tabs)');
              }
            }}
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          >
            <ArrowLeft size={24} color={colors.textPrimary} weight="bold" />
          </Pressable>
          <Text style={styles.headerTitle}>{t('auth.login.title')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <BookOpen size={48} color={colors.primary} weight="fill" />
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('auth.login.emailOrUsername')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('auth.login.emailPlaceholder')}
                placeholderTextColor={colors.textDisabled}
                value={emailOrUsername}
                onChangeText={setEmailOrUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('auth.login.password')}</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textDisabled}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? (
                    <Eye size={20} color={colors.textDisabled} />
                  ) : (
                    <EyeSlash size={20} color={colors.textDisabled} />
                  )}
                </Pressable>
              </View>
            </View>

            <Pressable
              onPress={() => router.push('/(auth)/forgot-password')}
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgotPasswordText}>
                {t('auth.login.forgotPassword') || 'Şifremi Unuttum?'}
              </Text>
            </Pressable>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Button
              title={loading ? t('auth.login.loggingIn') : t('auth.login.loginButton')}
              onPress={handleLogin}
              disabled={loading}
              fullWidth
              style={styles.submitButton}
            />

            <View style={styles.socialSection}>
              <SocialLoginButtons
                onGooglePress={() => {
                  Alert.alert(t('auth.login.comingSoon'), t('auth.login.googleComingSoon'));
                }}
                onApplePress={() => {
                  Alert.alert(t('auth.login.comingSoon'), t('auth.login.appleComingSoon'));
                }}
                loading={loading}
                variant="circular"
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('auth.login.noAccount')}</Text>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.linkText}> {t('auth.login.register')}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  backButtonPressed: {
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  iconContainer: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme === 'dark' ? '#111827' : '#F3F4F6', // Subtle circle bg
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  form: {
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
    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: colors.textPrimary,
  },
  eyeIcon: {
    padding: 16,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
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
    borderRadius: 28, // Fully rounded
  },
  socialSection: {
    marginTop: 32,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  linkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
