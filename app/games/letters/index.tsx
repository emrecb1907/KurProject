import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { LockIcon, PlayCircleIcon } from '@hugeicons/core-free-icons';

export default function LettersGameScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { themeVersion } = useTheme();
  const styles = useMemo(() => getStyles(), [themeVersion]);

  const tests = [
    { id: '1', title: t('games.letters.tests.1'), level: 1, completed: false },
    { id: '2', title: t('games.letters.tests.2'), level: 1, completed: false },
    { id: '3', title: t('games.letters.tests.3'), level: 2, completed: false, locked: true },
    { id: '4', title: t('games.letters.tests.4'), level: 3, completed: false, locked: true },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>{t('common.back')}</Text>
        </Pressable>
        <Text style={styles.title}>{t('games.letters.title')}</Text>
      </View>

      <Text style={styles.subtitle}>
        {t('games.letters.description')}
      </Text>

      <View style={styles.testsList}>
        {tests.map((test) => (
          <Link key={test.id} href={`/games/letters/${test.id}`} asChild>
            <Pressable
              style={[
                styles.lessonCard,
                test.locked && styles.lessonCardLocked
              ]}
              disabled={test.locked}
            >
              <View style={styles.lessonInfo}>
                <Text style={[styles.lessonTitle, test.locked && styles.textLocked]}>
                  {test.title}
                </Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>{t('common.level')} {test.level}</Text>
                </View>
              </View>
              {test.locked ? (
                <HugeiconsIcon icon={LockIcon} size={24} color={colors.textSecondary} />
              ) : (
                <HugeiconsIcon icon={PlayCircleIcon} size={32} color={colors.primary} />
              )}
            </Pressable>
          </Link>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          {t('common.tip')}
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
    gap: 12,
  },
  lessonCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  lessonCardLocked: {
    opacity: 0.7,
    backgroundColor: colors.surfaceLight,
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
  textLocked: {
    color: colors.textSecondary,
  },
  levelBadge: {
    backgroundColor: colors.surfaceLight, // Changed from surfaceVariant
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  levelText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoBox: {
    backgroundColor: colors.secondaryGlow,
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.secondaryDark,
    lineHeight: 20,
  },
});
