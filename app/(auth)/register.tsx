import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Card } from '@components/ui';
import { SocialLoginButtons } from '@components/auth/SocialLoginButtons';
import { useAuthHook } from '@hooks';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp, signInWithGoogle, signInWithApple } = useAuthHook();
  const { themeVersion } = useTheme();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Re-calculate styles when theme changes
  const styles = useMemo(() => getStyles(), [themeVersion]);

  const handleRegister = async () => {
    console.log('🔵 RegisterScreen.handleRegister called');
    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı');
      return;
    }

    setLoading(true);
    setError('');

    const { error: signUpError } = await signUp(email, password, username);

    if (signUpError) {
      // Translate error messages to user-friendly Turkish
      let errorMessage = 'Kayıt başarısız';

      if (signUpError.message.includes('User already registered')) {
        errorMessage = 'Bu email adresi zaten kayıtlı';
      } else if (signUpError.message.includes('kullanıcı adı zaten kullanılıyor')) {
        errorMessage = signUpError.message; // Already in Turkish
      } else if (signUpError.message.includes('Password should be at least')) {
        errorMessage = 'Şifre en az 6 karakter olmalı';
      } else if (signUpError.message.includes('Invalid email')) {
        errorMessage = 'Geçersiz email adresi';
      }

      setError(errorMessage);
      setLoading(false);
    } else {
      // Success! User is automatically logged in
      setLoading(false);
      Alert.alert(
        '🎉 Hoş Geldin!',
        'Hesabın oluşturuldu ve giriş yapıldı. Şimdi öğrenmeye başlayabilirsin!',
        [
          {
            text: 'Hadi Başlayalım!',
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
      >
        <View style={styles.header}>
          <Pressable onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(auth)/login');
            }
          }}>
            <Text style={styles.backButton}>← Geri</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Hesap Oluştur ✨</Text>
          <Text style={styles.subtitle}>
            Kayıt olarak ilerlemeni kaydet ve liderlik tablosuna katıl
          </Text>

          <Card style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kullanıcı Adı</Text>
              <TextInput
                style={styles.input}
                placeholder="Kullanıcı adın"
                placeholderTextColor={colors.textDisabled}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

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
                placeholder="En az 6 karakter"
                placeholderTextColor={colors.textDisabled}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Şifre Tekrar</Text>
              <TextInput
                style={styles.input}
                placeholder="Şifreni tekrar gir"
                placeholderTextColor={colors.textDisabled}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
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
              title={loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
              onPress={handleRegister}
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

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              🎉 Kayıt olduğunda mevcut ilerlemen hesabına aktarılacak ve hemen giriş yapılacak!
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Zaten hesabın var mı?</Text>
            <Pressable onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.linkText}>Giriş Yap</Text>
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
    marginBottom: 16,
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
  infoBox: {
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 13,
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 18,
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
