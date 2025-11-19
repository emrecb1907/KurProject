import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScoreDisplay } from '@components/game';
import { Button } from '@components/ui';
import { colors } from '@constants/colors';

export default function LettersResultScreen() {
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
        <ScoreDisplay
          correctAnswers={result.correctAnswers}
          totalQuestions={result.totalQuestions}
          xpEarned={result.xpEarned}
        />

        <View style={styles.actions}>
          <Button
            title="Tekrar Oyna"
            variant="primary"
            fullWidth
            onPress={() => router.back()}
            style={styles.button}
          />
          
          <Button
            title="Ana Sayfaya Dön"
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
  },
  actions: {
    paddingHorizontal: 16,
    marginTop: 32,
  },
  button: {
    marginBottom: 12,
  },
});

