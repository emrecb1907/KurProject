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
        text: "Mü'minin en fazîletlisi, ahlâkı en güzel olanıdır.",
        source: "Buhârî",
    };

    // Dynamic styles
    const styles = useMemo(() => StyleSheet.create({
        container: {
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 10,
            marginBottom: 18,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        },
        headerTextContainer: {
            flex: 1,
        },
        subtitle: {
            fontSize: 13,
            color: colors.textSecondary,
            marginBottom: 4,
            fontWeight: '500',
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textPrimary,
            paddingLeft: 6,
        },
        iconContainer: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(255, 200, 0, 0.1)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            marginBottom: 16,
            paddingLeft: 5,
        },
        hadithText: {
            fontSize: 16,
            lineHeight: 24,
            color: colors.textSecondary,
            fontWeight: '400',
        },
        sourceContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
        },
        sourceText: {
            fontSize: 13,
            color: colors.textDisabled,
            fontWeight: '500',
        },
    }), [themeVersion]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.title}>Günün Hadisi</Text>
                </View>
                <View style={styles.iconContainer}>
                    <BookOpen size={20} color={colors.warning} weight="fill" />
                </View>
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
