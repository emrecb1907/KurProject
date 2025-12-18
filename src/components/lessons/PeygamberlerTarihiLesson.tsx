import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { Scroll } from 'phosphor-react-native';
import { HeaderButton } from '@/components/ui/HeaderButton';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useCompleteGameMutation } from '@/hooks/mutations/useGameMutations';

export interface PeygamberlerTarihiLessonContent {
    id: number;
    title: { tr: string; en: string } | string;
    description: { tr: string; en: string } | string;
    content: { tr: string; en: string } | string;
}

interface PeygamberlerTarihiLessonProps {
    lesson: PeygamberlerTarihiLessonContent;
    lessonId: string;
}

export default function PeygamberlerTarihiLesson({ lesson, lessonId }: PeygamberlerTarihiLessonProps) {
    const router = useRouter();
    const { themeVersion } = useTheme();
    const { t, i18n } = useTranslation();

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            backgroundColor: colors.surface,
        },
        titleContainer: {
            flex: 1,
            marginLeft: 24,
        },
        title: {
            fontSize: 20,
            lineHeight: 28,
            fontWeight: 'bold',
            color: colors.textPrimary,
        },
        subtitle: {
            fontSize: 14,
            color: colors.textSecondary,
        },
        content: {
            flex: 1,
            padding: 20,
        },
        scrollContent: {
            paddingBottom: 40,
        },
        bookContainer: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: colors.border,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
        },
        bookTitle: {
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.textPrimary,
            marginBottom: 8,
            textAlign: 'center',
        },
        section: {
            marginBottom: 32,
        },
        paragraph: {
            fontSize: 16,
            lineHeight: 28,
            color: colors.textPrimary,
            marginBottom: 16,
            textAlign: 'left',
        },
        summarySection: {
            backgroundColor: colors.backgroundLighter || '#f8f9fa',
            borderRadius: 12,
            padding: 20,
            marginTop: 8,
            borderLeftWidth: 4,
            borderLeftColor: colors.gray,
        },
        summaryTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.gray,
            marginBottom: 12,
        },
        summaryText: {
            fontSize: 16,
            lineHeight: 26,
            color: colors.textPrimary,
            marginBottom: 12,
        },
    }), [themeVersion]);

    const { mutate: completeGame } = useCompleteGameMutation();

    const handleComplete = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        if (lessonId) {
            completeGame({
                lessonId: lessonId.toString(),
                gameType: 'lesson',
                correctAnswers: 1,
                totalQuestions: 1,
                source: 'lesson'
            });
        }

        router.back();
    };

    const currentLang = i18n.language.split('-')[0].toLowerCase() === 'en' ? 'en' : 'tr';
    const displayTitle = typeof lesson.title === 'object' ? (lesson.title as any)[currentLang] : lesson.title;
    const displayContent = typeof lesson.content === 'object' ? (lesson.content as any)[currentLang] : lesson.content;

    const renderTextWithBold = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <Text key={index} style={{ fontWeight: 'bold' }}>
                        {part.slice(2, -2)}
                    </Text>
                );
            }
            return <Text key={index}>{part}</Text>;
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <HeaderButton
                    title={t('common.back')}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.back();
                    }}
                />
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{t('lessons.peygamberlerTarihi.title', 'History of Prophets')}</Text>
                    <Text style={styles.subtitle} numberOfLines={1}>{displayTitle}</Text>
                </View>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.bookContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                        <Scroll size={32} color={colors.gray} weight="fill" />
                    </View>
                    <Text style={styles.bookTitle}>{displayTitle}</Text>
                </View>

                <View style={styles.section}>
                    {displayContent.split('\n\n').map((paragraph: string, index: number) => {
                        const isPurpose = paragraph.trim().startsWith('📌');

                        if (isPurpose) {
                            const [title, ...rest] = paragraph.split('\n');
                            const textContent = rest.join('\n');

                            return (
                                <View key={index} style={styles.summarySection}>
                                    <Text style={styles.summaryTitle}>{title.replace('📌', '').trim()}</Text>
                                    <Text style={styles.summaryText}>{textContent}</Text>
                                </View>
                            );
                        }

                        return (
                            <Text key={index} style={styles.paragraph}>
                                {renderTextWithBold(paragraph)}
                            </Text>
                        );
                    })}
                </View>

                <PrimaryButton
                    title={t('lessons.common.completeLesson', 'Complete Lesson')}
                    onPress={handleComplete}
                    style={{ marginTop: 24 }}
                />
            </ScrollView>
        </SafeAreaView>
    );
}
