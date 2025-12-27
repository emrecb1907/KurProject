import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '@/contexts/ThemeContext';
import { useUserTitles, useSetActiveTitle } from '@/hooks/queries/useUserTitles';
import { useUserStats } from '@/hooks';
import { useAuth, useUser } from '@/store';
import { colors } from '@/constants/colors';
import { Crown, Student, ArrowLeft } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { HeaderButton } from '@/components/ui/HeaderButton';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export default function TitleSelectScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { user } = useAuth();
    const { lastSeenTitleCount, setLastSeenTitleCount } = useUser();
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
            backgroundColor: colors.surface,
        },
        newBadge: {
            backgroundColor: '#FF9600',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 10,
            marginLeft: 8,
        },
        newBadgeText: {
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: 'bold',
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

    // Mark all titles as seen when leaving the page
    const markTitlesSeen = useCallback(() => {
        const currentCount = userTitles?.length || 0;
        if (currentCount > lastSeenTitleCount) {
            setLastSeenTitleCount(currentCount);
        }
    }, [userTitles, lastSeenTitleCount, setLastSeenTitleCount]);

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
            markTitlesSeen();
            router.back();
        } catch (error) {
            console.error('Title set error:', error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert(t('common.error'), t('common.errorOccurred'));
        }
    };

    // Handle back navigation
    const handleBack = useCallback(() => {
        markTitlesSeen();
        router.back();
    }, [markTitlesSeen, router]);

    const renderItem = useCallback(({ item, index }: { item: any; index: number }) => {
        const isDefault = item.id === 'default';
        // Effective selection (fallback to activeTitle if state undefined)
        const effectiveSelection = selectedTitle !== undefined ? selectedTitle : activeTitle;
        const isSelected = isDefault ? !effectiveSelection : effectiveSelection === item.title_name;
        // Check if this is a new title (index > lastSeenTitleCount, accounting for default at index 0)
        const isNewTitle = !isDefault && index > lastSeenTitleCount;

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
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.titleName}>
                            {isDefault ? t('profile.editProfile.defaultTitle') : t(`rewards.titles.${item.title_name}`, { defaultValue: item.title_name }) as string}
                        </Text>
                        {isNewTitle && (
                            <View style={styles.newBadge}>
                                <Text style={styles.newBadgeText}>{t('common.new', 'YENİ')}</Text>
                            </View>
                        )}
                    </View>
                </View>

            </TouchableOpacity>
        );
    }, [selectedTitle, activeTitle, setActiveTitleMutation.isPending, handleSelectTitle, styles, t, lastSeenTitleCount]);

    // Combine default option with earned titles
    const data = useMemo(() => [
        { id: 'default', title_name: 'default' },
        ...(userTitles || [])
    ], [userTitles]);

    // FlatList ref for scrolling to bottom
    const flatListRef = useRef<FlatList>(null);

    // Scroll to bottom when page is focused (newest title at bottom)
    useFocusEffect(
        useCallback(() => {
            if (data.length > 1 && !isTitlesLoading) {
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 150);
            }
        }, [data.length, isTitlesLoading])
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <HeaderButton
                    title={t('common.back', 'Geri')}
                    onPress={handleBack}
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
                        ref={flatListRef}
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
