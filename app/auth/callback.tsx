import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@constants/colors';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { token_hash, type } = params;

        if (!token_hash || !type) {
          console.error('Missing token_hash or type in callback');
          router.replace('/(tabs)');
          return;
        }

        // Verify email with Supabase
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token_hash as string,
          type: type as any,
        });

        if (error) {
          console.error('Email verification error:', error);
          alert('Email doğrulama hatası: ' + error.message);
          router.replace('/(tabs)');
          return;
        }

        // Success!
        alert('✅ Email başarıyla doğrulandı! Şimdi giriş yapabilirsin.');
        router.replace('/(auth)/login');
      } catch (error) {
        console.error('Callback error:', error);
        router.replace('/(tabs)');
      }
    };

    handleCallback();
  }, [params]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>Email doğrulanıyor...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    gap: 16,
  },
  text: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

