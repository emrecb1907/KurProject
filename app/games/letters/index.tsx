import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Button } from '@components/ui';
import { colors } from '@constants/colors';

export default function LettersGameScreen() {
  const router = useRouter();

  const lessons = [
    { id: '1', title: 'Temel Harfler 1', level: 1, completed: false },
    { id: '2', title: 'Temel Harfler 2', level: 1, completed: false },
    { id: '3', title: 'İleri Harfler 1', level: 2, completed: false, locked: true },
    { id: '4', title: 'İleri Harfler 2', level: 3, completed: false, locked: true },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>← Geri</Text>
        </Pressable>
        <Text style={styles.title}>Arapça Harfler</Text>
      </View>

      <Text style={styles.subtitle}>
        Harf seslerini dinleyerek doğru harfi seç
      </Text>

      <View style={styles.lessonsList}>
        {lessons.map((lesson) => (
          <Card key={lesson.id} style={styles.lessonCard}>
            <View style={styles.lessonContent}>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonLevel}>Level {lesson.level}</Text>
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
                  onPress={() => router.push(`/games/letters/${lesson.id}`)}
                />
              )}
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 İpucu: Son 20 soruda %90 başarı ile bu bölüm "pekiştirildi" olarak işaretlenir
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
  lessonLevel: {
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
    backgroundColor: '#e3f2fd',
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#1565c0',
    lineHeight: 20,
  },
});

