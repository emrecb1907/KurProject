import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card } from '@components/ui';
import { useAuthHook } from '@hooks';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { validateText } from '@/utils/profanityFilter';
import { ArrowLeft, CheckCircle, Eye, EyeSlash } from 'phosphor-react-native';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signUp } = useAuthHook();
  const { themeVersion, activeTheme } = useTheme();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Re-calculate styles when theme changes
  const styles = useMemo(() => getStyles(activeTheme), [themeVersion, activeTheme]);
  const isDark = activeTheme === 'dark';

  const handleRegister = async () => {
    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError(t('auth.errors.fillAllFields'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.errors.passwordMismatch'));
      return;
    }

    if (!termsAccepted) {
      setError('Lütfen kullanım şartlarını kabul edin.'); // Basic fallback
      return;
    }

    // Validate Username (Profanity & Safety Check)
    const validation = validateText(username);
    if (!validation.isValid) {
      setError(validation.error || 'Geçersiz kullanıcı adı.');
      return;
    }

    if (password.length < 6) {
      setError(t('auth.errors.passwordTooShort'));
      return;
    }

    setLoading(true);
    setError('');

    const { error: signUpError } = await signUp(email, password, username);

    if (signUpError) {
      // Translate error messages to user-friendly messages
      let errorMessage = t('auth.errors.registerFailed');

      // 🛡️ Rate Limit kontrolü (429 Too Many Requests)
      if (signUpError.message.includes('Too many requests') ||
        signUpError.message.includes('rate limit') ||
        signUpError.message.includes('Request rate limit')) {
        errorMessage = t('errors.rateLimit.auth.message');
      } else if (signUpError.message.includes('User already registered')) {
        errorMessage = t('auth.errors.emailAlreadyExists');
      } else if (signUpError.message.includes('kullanıcı adı zaten kullanılıyor')) {
        errorMessage = signUpError.message; // Already in Turkish
      } else if (signUpError.message.includes('Password should be at least')) {
        errorMessage = t('auth.errors.passwordTooShort');
      } else if (signUpError.message.includes('Invalid email')) {
        errorMessage = t('auth.errors.invalidEmail');
      }

      setError(errorMessage);
      setLoading(false);
    } else {
      // Success! User is automatically logged in
      setLoading(false);
      Alert.alert(
        t('auth.register.successTitle'),
        t('auth.register.successMessage'),
        [
          {
            text: t('auth.register.successButton'),
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
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
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(auth)/login');
            }
          }}
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          >
            <ArrowLeft size={24} color={colors.textPrimary} weight="bold" />
          </Pressable>
          <Text style={styles.headerTitle}>{t('auth.register.title')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <Card style={styles.formCard}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('auth.register.email')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('auth.register.emailPlaceholder')}
                placeholderTextColor={colors.textDisabled}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>

            {/* Username Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('auth.register.username')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('auth.register.usernamePlaceholder')}
                placeholderTextColor={colors.textDisabled}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('auth.register.password')}</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={t('auth.register.passwordPlaceholder')}
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

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('auth.register.confirmPassword')}</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={t('auth.register.confirmPasswordPlaceholder')}
                  placeholderTextColor={colors.textDisabled}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  {showConfirmPassword ? (
                    <Eye size={20} color={colors.textDisabled} />
                  ) : (
                    <EyeSlash size={20} color={colors.textDisabled} />
                  )}
                </Pressable>
              </View>
            </View>
          </Card>

          {/* Terms Checkbox */}
          <Pressable
            style={styles.checkboxContainer}
            onPress={() => setTermsAccepted(!termsAccepted)}
          >
            {termsAccepted ? (
              <CheckCircle size={24} color={colors.primary} weight="fill" />
            ) : (
              <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.textSecondary }} />
            )}
            <Text style={[styles.checkboxText, { color: termsAccepted ? colors.textPrimary : colors.textSecondary }]}>
              {t('auth.register.termsAndPrivacy')}
            </Text>
          </Pressable>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Button
            title={loading ? t('auth.register.registering') : t('auth.register.registerButton')}
            onPress={handleRegister}
            disabled={loading}
            fullWidth
            style={styles.submitButton}
          />

          {/* Progress Note */}
          <Text style={styles.progressNote}>
            {t('auth.register.progressNote')}
          </Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('auth.register.hasAccount')}</Text>
            <Pressable onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.linkText}> {t('auth.register.login')}</Text>
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  progressNote: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
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
