import React from 'react';
import { View, Text, StyleSheet, Modal, Dimensions } from 'react-native';
import { colors } from '@/constants/colors';
import { useTranslation } from 'react-i18next';
import { Clock, Question, BookOpen } from 'phosphor-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface TestPreparationOverlayProps {
    visible: boolean;
    title: string;
    questionCount: number;
    duration: number; // in seconds
}

const { width } = Dimensions.get('window');

export function TestPreparationOverlay({
    visible,
    title,
    questionCount,
    duration
}: TestPreparationOverlayProps) {
    const { t } = useTranslation();
    const { activeTheme } = useTheme();
    const isLight = activeTheme === 'light';

    if (!visible) return null;

    // Design Colors match mockup & Home Page Theme
    const bgColor = isLight ? '#F5F5F0' : '#050B14'; // Home Background Cream vs Dark Blue
    const chipBg = isLight ? '#FFF9F0' : '#111827';  // Home Surface Cream vs Dark Gray
    const textColor = isLight ? '#1F2937' : '#F9FAFB';
    const subTextColor = isLight ? '#6B7280' : '#6B7280';
    const accentColor = '#F59E0B';

    return (
        <Modal
            visible={visible}
            transparent={false}
            animationType="fade"
            statusBarTranslucent
        >
            <View style={[styles.container, { backgroundColor: bgColor }]}>
                <View style={styles.content}>
                    {/* SPINNER SECTION */}
                    <View style={styles.spinnerWrapper}>
                        <LoadingSpinner size={130} color={accentColor} />
                    </View>

                    <Text style={[styles.loadingText, { color: subTextColor }]}>
                        {t('gameUI.loadingTest').toUpperCase()}
                    </Text>

                    {/* CHIPS SECTION - Directly below text with specific gap */}
                    <View style={styles.infoSection}>
                        {/* Row 1: Title & Question Count */}
                        <View style={styles.chipRow}>
                            <View style={[styles.chip, { backgroundColor: chipBg }]}>
                                <BookOpen size={20} color={accentColor} weight="fill" />
                                <Text style={[styles.chipText, { color: textColor }]}>
                                    {title}
                                </Text>
                            </View>

                            <View style={[styles.chip, { backgroundColor: chipBg }]}>
                                <Question size={20} color={accentColor} weight="fill" />
                                <Text style={[styles.chipText, { color: textColor }]}>
                                    {questionCount} {t('common.questions')}
                                </Text>
                            </View>
                        </View>

                        {/* Row 2: Duration */}
                        <View style={styles.chipRow}>
                            <View style={[styles.chip, { backgroundColor: chipBg }]}>
                                <Clock size={20} color={accentColor} weight="fill" />
                                <Text style={[styles.chipText, { color: textColor }]}>
                                    {duration} {t('common.seconds')}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    spinnerWrapper: {
        marginBottom: 24,
    },
    loadingText: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 2,
        marginBottom: 60, // Space between "TEST YÜKLENİYOR" and the chips
    },
    infoSection: {
        alignItems: 'center',
        gap: 16, // Vertical gap between chip rows
        width: '100%',
    },
    chipRow: {
        flexDirection: 'row',
        gap: 12, // Horizontal gap between chips
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 24,
        gap: 8,
        minWidth: 120, // Consistent minimum width
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)', // Subtle border for dark mode
        // Soft Shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
    },
    chipText: {
        fontSize: 15,
        fontWeight: '600',
    }
});
