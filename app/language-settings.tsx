import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage } from '@/lib/i18n';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

type Language = 'tr' | 'en';

interface LanguageOption {
    id: Language;
    label: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
    { id: 'tr', label: 'Türkçe' },
    { id: 'en', label: 'English' },
];

export default function LanguageSettingsScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { themeVersion } = useTheme();
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(getCurrentLanguage());

    const handleConfirm = async () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await changeLanguage(selectedLanguage);
        router.back();
    };

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingTop: 60,
            paddingBottom: 16,
            backgroundColor: colors.backgroundDarker,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        backButton: {
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
        },
        headerTitle: {
            flex: 1,
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.textPrimary,
            textAlign: 'center',
            marginRight: 40, // To center the title accounting for back button
        },
        content: {
            flex: 1,
            padding: 16,
        },
        optionsContainer: {
            gap: 12,
        },
        optionItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 16,
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.border,
        },
        optionItemSelected: {
            borderColor: colors.primary,
            backgroundColor: colors.surface,
        },
        optionText: {
            fontSize: 16,
            fontWeight: '500',
            color: colors.textPrimary,
        },
        radioOuter: {
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
        },
        radioOuterSelected: {
            borderColor: colors.primary,
        },
        radioInner: {
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: colors.primary,
        },
        footer: {
            padding: 16,
            paddingBottom: 32,
        },
    }), [themeVersion]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.back();
                    }}
                >
                    <ArrowLeft size={24} color={colors.textPrimary} weight="bold" />
                </Pressable>
                <Text style={styles.headerTitle}>{t('profile.settings.language.select')}</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.optionsContainer}>
                    {LANGUAGE_OPTIONS.map((option) => (
                        <Pressable
                            key={option.id}
                            style={[
                                styles.optionItem,
                                selectedLanguage === option.id && styles.optionItemSelected
                            ]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setSelectedLanguage(option.id);
                            }}
                        >
                            <Text style={styles.optionText}>{option.label}</Text>
                            <View style={[
                                styles.radioOuter,
                                selectedLanguage === option.id && styles.radioOuterSelected
                            ]}>
                                {selectedLanguage === option.id && (
                                    <View style={styles.radioInner} />
                                )}
                            </View>
                        </Pressable>
                    ))}
                </View>
            </View>

            {/* Footer with Confirm Button */}
            <View style={styles.footer}>
                <PrimaryButton
                    title={t('profile.settings.language.save')}
                    onPress={handleConfirm}
                />
            </View>
        </View>
    );
}
