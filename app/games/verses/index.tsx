import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, Button } from '@components/ui';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function AhlakEdepGameScreen() {
  const router = useRouter();
  const { themeVersion } = useTheme();
  const styles = useMemo(() => getStyles(), [themeVersion]);
  const { t } = useTranslation();

  const tests = [
    { id: '1', title: t('games.verses.tests.1'), questions: 10, level: 1, completed: false },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>{t('games.common.back')}</Text>
        </Pressable>
        <Text style={styles.title}>{t('games.verses.title')}</Text>
      </View>

      <Text style={styles.subtitle}>
        {t('games.verses.description')}
      </Text>

      <View style={styles.testsList}>
        {tests.map((test) => (
          <Card key={test.id} style={styles.lessonCard}>
            <View style={styles.lessonContent}>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{test.title}</Text>
                <Text style={styles.lessonMeta}>
                  {test.questions} {t('common.question')} • {t('games.common.level')} {test.level}
                </Text>
              </View>

              {test.completed ? (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>✓</Text>
                </View>
              ) : (
                <Button
                  title={t('games.common.start')}
                  size="small"
                  onPress={() => router.push(`/games/verses/${test.id}`)}
                />
              )}
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>{t('games.verses.format.title')}</Text>
        <Text style={styles.infoText}>
          {t('games.verses.format.text')}
        </Text>
      </View>
    </View>
  );
}

const getStyles = () => StyleSheet.create({
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
  testsList: {
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
    backgroundColor: colors.successGlow,
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.successDark,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.successDark,
    lineHeight: 22,
  },
});
