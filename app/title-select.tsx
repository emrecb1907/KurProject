import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserTitles, useSetActiveTitle } from '@/hooks/queries/useUserTitles';
import { useUserStats } from '@/hooks';
import { useAuth } from '@/store';
import { colors } from '@/constants/colors';
import { Crown, Student, ArrowLeft } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { HeaderButton } from '@/components/ui/HeaderButton';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export default function TitleSelectScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { user, isAnonymous } = useAuth();
    const { activeTheme } = useTheme();

    // Styles with theme support
    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        backButton: {
            padding: 8,
            marginLeft: -8,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            position: 'absolute',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex: -1,
            color: colors.textPrimary,
        },
        listContent: {
            padding: 16,
        },
        titleItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderRadius: 16,
            borderWidth: 1,
            marginBottom: 12,
            backgroundColor: colors.surface,
            borderColor: colors.border,
        },
        iconContainer: {
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.05)',
            borderRadius: 20,
            marginRight: 12,
        },
        titleInfo: {
            flex: 1,
        },
        titleName: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.textPrimary,
        },
        selectButton: {
            minWidth: 80,
            alignItems: 'flex-end',
        },
        selectedBadge: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
            backgroundColor: colors.primary,
        },
        selectedText: {
            fontSize: 12,
            fontWeight: 'bold',
            color: colors.textOnPrimary,
        },
        selectText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.primary,
        },
        centerContent: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        emptyContainer: {
            padding: 32,
            alignItems: 'center',
        },
        emptyText: {
            fontSize: 16,
            textAlign: 'center',
            color: colors.textSecondary,
        },
        footer: {
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.surface, // Now dynamic
        },
    }), [activeTheme]);

    // Fetch user titles
    const { data: userTitles, isLoading: isTitlesLoading } = useUserTitles(user?.id);

    // Get active title
    const { userData } = useUserStats(user?.id);
    const activeTitle = userData?.active_title;

    // Selection State
    const [selectedTitle, setSelectedTitle] = useState<string | null | undefined>(undefined);

    // Sync activeTitle when loaded
    useEffect(() => {
        if (activeTitle !== undefined && selectedTitle === undefined) {
            setSelectedTitle(activeTitle);
        }
    }, [activeTitle]);

    // Mutation
    const setActiveTitleMutation = useSetActiveTitle();

    const handleSelectTitle = useCallback((titleName: string | null) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedTitle(titleName);
    }, []);

    const handleSave = async () => {
        if (!user?.id || selectedTitle === undefined) return;

        // If no change, just go back (optional optimization)
        if (selectedTitle === activeTitle) {
            router.back();
            return;
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        try {
            await setActiveTitleMutation.mutateAsync({
                userId: user.id,
                titleName: selectedTitle
            });
            router.back();
        } catch (error) {
            console.error('Title set error:', error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert(t('common.error'), t('common.errorOccurred'));
        }
    };

    const renderItem = useCallback(({ item }: { item: any }) => {
        const isDefault = item.id === 'default';
        // Effective selection (fallback to activeTitle if state undefined)
        const effectiveSelection = selectedTitle !== undefined ? selectedTitle : activeTitle;
        const isSelected = isDefault ? !effectiveSelection : effectiveSelection === item.title_name;

        return (
            <TouchableOpacity
                style={[
                    styles.titleItem,
                    isSelected && { borderColor: colors.primary, borderWidth: 2 }
                ]}
                onPress={() => handleSelectTitle(isDefault ? null : item.title_name)}
                disabled={setActiveTitleMutation.isPending}
                activeOpacity={0.7}
            >
                <View style={styles.iconContainer}>
                    {isDefault ? (
                        <Student size={24} color={isSelected ? colors.primary : colors.textSecondary} weight="fill" />
                    ) : (
                        <Crown size={24} color={isSelected ? colors.primary : '#FFD700'} weight="fill" />
                    )}
                </View>

                <View style={styles.titleInfo}>
                    <Text style={styles.titleName}>
                        {isDefault ? t('profile.editProfile.defaultTitle') : t(`rewards.titles.${item.title_name}`, { defaultValue: item.title_name }) as string}
                    </Text>
                </View>

            </TouchableOpacity>
        );
    }, [selectedTitle, activeTitle, setActiveTitleMutation.isPending, handleSelectTitle, styles, t]);

    // Combine default option with earned titles
    const data = useMemo(() => [
        { id: 'default', title_name: 'default' },
        ...(userTitles || [])
    ], [userTitles]);

    if (isAnonymous) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: colors.textPrimary }}>{t('profile.loginPrompt.description')}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <HeaderButton
                    title={t('common.back', 'Geri')}
                    onPress={() => router.back()}
                    showIcon={true}
                    style={{ marginLeft: -8 }}
                />
                <Text style={styles.headerTitle}>{t('profile.editProfile.selectTitlePage')}</Text>
            </View>

            {isTitlesLoading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>{t('profile.editProfile.noTitles')}</Text>
                            </View>
                        }
                    />

                    {/* Save Button Footer */}
                    <View style={styles.footer}>
                        <PrimaryButton
                            title={t('common.save', 'Kaydet')}
                            onPress={handleSave}
                            isLoading={setActiveTitleMutation.isPending}
                            disabled={selectedTitle === undefined || setActiveTitleMutation.isPending}
                        />
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}
