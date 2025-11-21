import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@components/ui';
import { colors } from '@constants/colors';
import { useTranslation } from 'react-i18next';

export default function LettersResultScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  // Mock data - gerçekte gameState'den gelecek
  const result = {
    correctAnswers: 18,
    totalQuestions: 20,
    xpEarned: 180,
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.scoreContainer}>
          <Text style={styles.title}>{t('gameUI.gameComplete')}</Text>
          <Text style={styles.subtitle}>{t('gameUI.congratulations')}</Text>

          <View style={styles.statsBox}>
            <Text style={styles.statText}>{t('gameUI.totalScore')}: {result.xpEarned}</Text>
            <Text style={styles.statText}>{t('gameUI.correctAnswers')}: {result.correctAnswers}/{result.totalQuestions}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title={t('common.tryAgain')}
            variant="primary"
            fullWidth
            onPress={() => router.back()}
            style={styles.button}
          />

          <Button
            title={t('common.mainMenu')}
            variant="outline"
            fullWidth
            onPress={() => router.push('/(tabs)')}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: colors.textSecondary,
    marginBottom: 30,
  },
  statsBox: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  actions: {
    paddingHorizontal: 16,
    marginTop: 20,
    width: '100%',
  },
  button: {
    marginBottom: 12,
  },
});
