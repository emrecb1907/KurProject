import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import { useMemo } from 'react';
import { colors } from '@constants/colors';
import { BookOpen, ShareNetwork } from 'phosphor-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

// Import hadis JSON
const hadisData = require('@assets/hadis/tr/hadis.json');

interface HadisItem {
    id: number;
    hadis: string;
    kaynak: string;
}

// Calculate day of year (1-365 or 1-366 for leap years)
function getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

// Check if year is leap year
function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// Get hadis ID based on current date
function getHadisId(): number {
    const today = new Date();
    const dayOfYear = getDayOfYear(today);
    const year = today.getFullYear();

    // If it's a leap year and day is 366, use id 365
    if (isLeapYear(year) && dayOfYear === 366) {
        return 365;
    }

    // Otherwise use the day of year as id (1-365)
    return Math.min(dayOfYear, 365);
}

export function DailyHadith() {
    const { t } = useTranslation();
    const { themeVersion, activeTheme } = useTheme();

    // Light theme specific border color
    const lightBorderColor = '#BCAAA4';
    const isLight = activeTheme === 'light';

    // Get today's hadis dynamically
    const hadith = useMemo(() => {
        const hadisId = getHadisId();
        const hadisItem = (hadisData as HadisItem[]).find(item => item.id === hadisId);

        if (hadisItem) {
            return {
                text: hadisItem.hadis,
                source: hadisItem.kaynak,
            };
        }

        // Fallback to first hadis if not found
        return {
            text: hadisData[0]?.hadis || "Mü'minin en fazîletlisi, ahlâkı en güzel olanıdır.",
            source: hadisData[0]?.kaynak || "Buhârî",
        };
    }, []);

    // Dynamic styles
    const styles = useMemo(() => StyleSheet.create({
        container: {
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 10,
            marginBottom: 14,
            // iOS 18 style shadow - more depth, softer spread
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 4,
            borderWidth: isLight ? 0.2 : 0,
            borderColor: isLight ? '#FFC800' : 'transparent',
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
            alignItems: 'center',
            gap: 8,
        },
        sourceText: {
            fontSize: 13,
            color: colors.textDisabled,
            fontWeight: '500',
        },
        shareButton: {
            padding: 4,
        },
    }), [themeVersion, activeTheme]);

    // Handle share functionality
    const handleShare = async () => {
        try {
            const shareMessage = `"${hadith.text}" - ${hadith.source}`;
            const result = await Share.share({
                message: shareMessage,
            });

            if (result.action === Share.sharedAction) {
                // Share was successful
            } else if (result.action === Share.dismissedAction) {
                // Share was dismissed
            }
        } catch (error: any) {
            Alert.alert('Error', t('home.dailyHadith.shareError'));
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.title}>{t('home.dailyHadith.title')}</Text>
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
                <TouchableOpacity
                    style={styles.shareButton}
                    onPress={handleShare}
                    activeOpacity={0.7}
                >
                    <ShareNetwork size={18} color={colors.textDisabled} weight="regular" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
