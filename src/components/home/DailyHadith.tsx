import { View, Text, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { colors } from '@constants/colors';
import { BookOpen } from 'phosphor-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

export function DailyHadith() {
    const { t } = useTranslation();
    const { themeVersion } = useTheme();

    // Static hadith for now (will be dynamic later)
    const hadith = {
        text: "Mü’minin en fazîletlisi, ahlâkı en güzel olanıdır.",
        source: "Buhârî",
    };

    // Dynamic styles
    const styles = useMemo(() => StyleSheet.create({
        container: {
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 24,
            borderBottomWidth: 4,
            borderBottomColor: colors.border,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textPrimary,
        },
        content: {
            marginBottom: 8,
            paddingVertical: 12,
            paddingHorizontal: 8,
        },
        hadithText: {
            fontSize: 16,
            lineHeight: 26,
            color: colors.textPrimary,
            textAlign: 'center',
            fontWeight: '500',
            fontStyle: 'italic',
        },
        sourceContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        sourceText: {
            fontSize: 13,
            color: colors.primary,
            fontWeight: 'bold',
        },
    }), [themeVersion]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <BookOpen size={24} color={colors.primary} weight="fill" />
                <Text style={styles.title}>Günün Hadisi</Text>
            </View>

            {/* Hadith Content */}
            <View style={styles.content}>
                <Text style={styles.hadithText}>
                    "{hadith.text}"
                </Text>
            </View>

            {/* Source */}
            <View style={styles.sourceContainer}>
                <Text style={styles.sourceText}>{hadith.source}</Text>
            </View>
        </View>
    );
}

