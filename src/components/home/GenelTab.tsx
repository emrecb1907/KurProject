import React from 'react';
import { View, Text, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors } from '@/constants/colors';
import { useUser, useAuth, useStore } from '@/store';
import { database } from '@/lib/supabase/database';
import { supabase } from '@/lib/supabase/client';
import { formatXP } from '@/lib/utils/levelCalculations';

import { WeeklyActivity } from './WeeklyActivity';
import { DailyHadith } from './DailyHadith';
import { DailyTasks } from './DailyTasks';

interface GenelTabProps {
    screenWidth: number;
}

export const GenelTab: React.FC<GenelTabProps> = ({ screenWidth }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const { user } = useUser();
    const { isAuthenticated } = useAuth();
    const {
        totalXP,
        addXP,
        setTotalXP,
        resetUserData,
        addLives,
        removeLives
    } = useStore();

    // 🧪 TEST: Add 100 XP
    const handleAddXP = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        addXP(100);

        // If authenticated, sync to database
        if (isAuthenticated && user?.id) {
            try {
                await database.users.updateXP(user.id, 100);
                console.log('✅ XP synced to database');
            } catch (error) {
                console.error('❌ Failed to sync XP to database:', error);
            }
        }

        Alert.alert(t('home.xpAdded'), `+100 XP!\n\n${t('common.success')}: ${formatXP(totalXP + 100)} XP`);
    };

    // 🧪 TEST: Add 1000 XP
    const handleAdd1000XP = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        addXP(1000);

        // If authenticated, sync to database
        if (isAuthenticated && user?.id) {
            try {
                await database.users.updateXP(user.id, 1000);
                console.log('✅ XP synced to database');
            } catch (error) {
                console.error('❌ Failed to sync XP to database:', error);
            }
        }

        Alert.alert('⚡ Bonus!', `+1000 XP!\n\n${t('common.success')}: ${formatXP(totalXP + 1000)} XP`);
    };

    // 🔄 TEST: Sync XP to Database
    const handleSyncXP = async () => {
        if (!isAuthenticated || !user?.id) {
            Alert.alert(t('common.error'), t('errors.authRequired'));
            return;
        }

        try {
            // Get current database XP
            const { data: userData } = await database.users.getById(user.id);
            const dbXP = userData?.total_xp || 0;
            const localXP = totalXP;

            console.log('🔄 Syncing XP:', { dbXP, localXP });

            if (localXP > dbXP) {
                // Update database with local XP
                await database.users.update(user.id, {
                    total_xp: localXP,
                    total_score: localXP,
                });

                Alert.alert(
                    t('home.xpSynced'),
                    `Database: ${formatXP(dbXP)} XP\nLocal: ${formatXP(localXP)} XP`
                );
                console.log('✅ XP synced successfully');
            } else if (dbXP > localXP) {
                // Database has more XP than local
                setTotalXP(dbXP);
                Alert.alert(
                    'ℹ️ Local XP Updated',
                    `Local: ${formatXP(localXP)} XP\nDatabase: ${formatXP(dbXP)} XP`
                );
                console.log('✅ Local XP updated from database');
            } else {
                Alert.alert('ℹ️ Synced', t('home.xpSynced'));
            }
        } catch (error) {
            console.error('❌ Sync error:', error);
            Alert.alert(t('common.error'), 'Sync failed');
        }
    };

    // 🧹 TEST: Clear all user progress
    const handleClearData = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        Alert.alert(
            t('home.resetProgress'),
            'Are you sure?',
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.ok'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            console.log('🗑️ Resetting user progress...');

                            // 1. Reset database user data (if authenticated)
                            if (isAuthenticated && user?.id) {
                                await database.users.update(user.id, {
                                    total_xp: 0,
                                    current_level: 1,
                                    total_score: 0,
                                    current_lives: 5,
                                    streak_count: 0,
                                    updated_at: new Date().toISOString(),
                                });
                            }

                            // 2. Sign out from Supabase Auth
                            const { logout } = useStore.getState();
                            await supabase.auth.signOut();

                            // 3. Clear AsyncStorage
                            await AsyncStorage.clear();

                            // 4. Reset Zustand store
                            logout();
                            resetUserData();

                            Alert.alert(t('common.success'), 'Reset complete', [
                                {
                                    text: t('common.ok'),
                                    onPress: () => {
                                        router.replace('/');
                                    },
                                },
                            ]);
                        } catch (error) {
                            console.error('❌ Reset progress error:', error);
                            Alert.alert(t('common.error'), 'Reset failed');
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={{ width: screenWidth, flex: 1 }}>
            <ScrollView
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                    <DailyHadith />
                    <WeeklyActivity />
                    <DailyTasks
                        devToolsContent={
                            <View style={styles.testContainer}>
                                {/* Add XP Buttons */}
                                <View style={styles.testButtonRow}>
                                    <Pressable style={[styles.testButton, styles.testButtonHalf]} onPress={handleAddXP}>
                                        <Text style={styles.testButtonText}>➕ +100 {t('home.xp')}</Text>
                                    </Pressable>

                                    <Pressable style={[styles.testButton, styles.testButtonHalf]} onPress={handleAdd1000XP}>
                                        <Text style={styles.testButtonText}>⚡ +1000 {t('home.xp')}</Text>
                                    </Pressable>
                                </View>

                                {/* Lives Debug Buttons */}
                                <View style={styles.testButtonRow}>
                                    <Pressable
                                        style={[styles.testButton, styles.testButtonHalf, { backgroundColor: colors.error }]}
                                        onPress={() => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                            removeLives(1);
                                        }}
                                    >
                                        <Text style={styles.testButtonText}>❤️ -1 {t('home.lives')}</Text>
                                    </Pressable>

                                    <Pressable
                                        style={[styles.testButton, styles.testButtonHalf, { backgroundColor: colors.success }]}
                                        onPress={() => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                            addLives(1);
                                        }}
                                    >
                                        <Text style={styles.testButtonText}>❤️ +1 {t('home.lives')}</Text>
                                    </Pressable>
                                </View>

                                {/* Sync XP Button */}
                                <Pressable style={styles.testButtonSync} onPress={handleSyncXP}>
                                    <Text style={styles.testButtonText}>🔄 {t('home.syncXP')}</Text>
                                </Pressable>

                                {/* Reset Progress Button */}
                                <Pressable style={styles.testButtonDanger} onPress={handleClearData}>
                                    <Text style={styles.testButtonText}>🔄 {t('home.resetProgress')}</Text>
                                </Pressable>

                                {/* Reset XP Only Button */}
                                <Pressable style={[styles.testButtonDanger, { backgroundColor: colors.warning }]} onPress={async () => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                    try {
                                        setTotalXP(0);
                                        if (isAuthenticated && user?.id) {
                                            await database.users.update(user.id, {
                                                total_xp: 0,
                                                current_level: 1,
                                                total_score: 0,
                                                updated_at: new Date().toISOString(),
                                            });
                                        }
                                        Alert.alert(t('common.success'), 'XP reset.');
                                    } catch (error) {
                                        console.error('❌ Reset XP error:', error);
                                    }
                                }}>
                                    <Text style={styles.testButtonText}>🔄 Reset XP Only</Text>
                                </Pressable>

                                {/* Logout Button */}
                                <Pressable style={[styles.testButtonDanger, { backgroundColor: colors.textSecondary }]} onPress={async () => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                    try {
                                        const { logout } = useStore.getState();
                                        await supabase.auth.signOut();
                                        logout();
                                        resetUserData();
                                        Alert.alert(t('common.success'), t('home.logout'));
                                        router.replace('/(auth)/login');
                                    } catch (error) {
                                        console.error('❌ Logout error:', error);
                                        Alert.alert(t('common.error'), 'Logout failed');
                                    }
                                }}>
                                    <Text style={styles.testButtonText}>🚪 {t('home.logout')}</Text>
                                </Pressable>
                            </View>
                        }
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    testContainer: {
        marginTop: 24,
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    testButtonRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    testButton: {
        backgroundColor: colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 10,
        borderBottomWidth: 4,
        borderBottomColor: colors.buttonOrangeBorder,
    },
    testButtonHalf: {
        flex: 1,
        marginBottom: 0,
    },
    testButtonSync: {
        backgroundColor: colors.secondary,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 10,
        borderBottomWidth: 4,
        borderBottomColor: colors.buttonBlueBorder,
    },
    testButtonDanger: {
        backgroundColor: colors.error,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 16,
        borderBottomWidth: 4,
        borderBottomColor: colors.errorDark,
    },
    testButtonText: {
        color: colors.textOnPrimary,
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
