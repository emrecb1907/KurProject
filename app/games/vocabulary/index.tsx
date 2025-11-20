import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Button } from '@components/ui';
import { colors } from '@constants/colors';

export default function VocabularyGameScreen() {
  const router = useRouter();

  const lessons = [
    { id: '1', title: 'Temel Kelimeler', words: 20, level: 1, completed: false },
    { id: '2', title: 'İslami Terimler 1', words: 20, level: 2, completed: false, locked: true },
    { id: '3', title: 'İslami Terimler 2', words: 20, level: 3, completed: false, locked: true },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/');
          }
        }}>
          <Text style={styles.backButton}>← Geri</Text>
        </Pressable>
        <Text style={styles.title}>Kavram Kartları</Text>
      </View>

      <Text style={styles.subtitle}>
        İslami anahtar kelimeleri öğren (Türkçe ↔ Arapça)
      </Text>

      <View style={styles.lessonsList}>
        {lessons.map((lesson) => (
          <Card key={lesson.id} style={styles.lessonCard}>
            <View style={styles.lessonContent}>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonMeta}>
                  {lesson.words} kelime • Level {lesson.level}
                </Text>
              </View>

              {lesson.locked ? (
                <View style={styles.lockedBadge}>
                  <Text style={styles.lockedText}>🔒</Text>
                </View>
              ) : lesson.completed ? (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>✓</Text>
                </View>
              ) : (
                <Button
                  title="Başla"
                  size="small"
                  onPress={() => router.push(`/games/vocabulary/${lesson.id}`)}
                />
              )}
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>📚 Oyun Formatı:</Text>
        <Text style={styles.infoText}>
          • İlk 10 soru: Türkçe → Arapça{'\n'}
          • Son 10 soru: Arapça → Türkçe{'\n'}
          • Her soru için 10 saniye süre
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  backButton: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  lessonsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  lessonCard: {
    marginBottom: 12,
  },
  lessonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  lessonMeta: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  lockedBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: {
    fontSize: 20,
  },
  completedBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 20,
    color: colors.textLight,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#f3e5f5',
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6a1b9a',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6a1b9a',
    lineHeight: 22,
  },
});

