import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { colors } from '@constants/colors';
import { BookOpen } from 'phosphor-react-native';
import { useAuthHook } from '@/hooks';

export default function SplashScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { isInitialized } = useAuthHook();

  useEffect(() => {
    // Check environment variables
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      setError('⚠️ Environment variables missing!\nPlease set up .env file');
      return;
    }

    // Wait for auth to initialize before navigating
    if (isInitialized) {
      console.log('🚀 Auth initialized, navigating to home...');
      const timer = setTimeout(() => {
        try {
          router.replace('/(tabs)');
        } catch (err) {
          setError(`Navigation error: ${err}`);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isInitialized]);

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* Logo/Icon */}
      <View style={styles.logoContainer}>
        <BookOpen size={60} color={colors.textOnPrimary} weight="fill" />
      </View>

      {/* Title */}
      <Text style={styles.title}>QuranLearn</Text>
      <Text style={styles.subtitle}>Eğlenceli Kuran Öğrenme</Text>

      {/* Loading or Error */}
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            style={styles.button}
            onPress={handleSkip}
          >
            <Text style={styles.buttonText}>Devam Et</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
      )}

      {/* Footer */}
      <Text style={styles.footer}>Powered by Duolingo Design</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundDarker,
    padding: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 8,
    borderBottomColor: colors.buttonOrangeBorder,
    shadowColor: colors.shadowStrong,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 12,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 40,
  },
  loadingContainer: {
    marginTop: 20,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  dot1: {
    opacity: 0.3,
  },
  dot2: {
    opacity: 0.6,
  },
  dot3: {
    opacity: 1,
  },
  errorBox: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 16,
    marginTop: 20,
    alignItems: 'center',
    maxWidth: 300,
    borderBottomWidth: 4,
    borderBottomColor: colors.border,
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderBottomWidth: 4,
    borderBottomColor: colors.buttonBlueBorder,
  },
  buttonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    fontSize: 11,
    color: colors.textDisabled,
  },
});

