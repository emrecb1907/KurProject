import { View, Text, StyleSheet, Pressable, Dimensions, DeviceEventEmitter } from 'react-native';
import { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/colors';
import { useStatusBar } from '@/hooks/useStatusBar';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/store';
import { queryClient } from '@/lib/queryClient';

// Import new tab components
import { GenelTab, GenelTabRef } from '@/components/home/GenelTab';
import { DerslerTab, DerslerTabRef } from '@/components/home/DerslerTab';
import { TestlerTab, TestlerTabRef } from '@/components/home/TestlerTab';
import { HomeHeader } from '@/components/home/HomeHeader';

export default function HomePage() {
    const { t } = useTranslation();
    const { statusBarStyle } = useStatusBar();
    const { themeVersion, activeTheme } = useTheme();

    const { isAuthenticated, user } = useAuth();

    // 🔄 Invalidate React Query caches on focus to ensure fresh data
    useFocusEffect(
        useCallback(() => {
            if (isAuthenticated && user?.id) {
                // Invalidate user data caches - React Query will auto-refetch
                queryClient.invalidateQueries({ queryKey: ['user', user.id] });
                queryClient.invalidateQueries({ queryKey: ['completedLessons', user.id] });
            }
        }, [isAuthenticated, user?.id])
    );

    // Page Navigation State
    const [selectedCategory, setSelectedCategory] = useState<'genel' | 'dersler' | 'testler'>('genel');
    const screenWidth = Dimensions.get('window').width;

    // Refs for tab components to control scroll
    const genelTabRef = useRef<GenelTabRef>(null);
    const derslerTabRef = useRef<DerslerTabRef>(null);
    const testlerTabRef = useRef<TestlerTabRef>(null);

    // Reset scroll when tab navigation changes (bottom tab menu)
    useFocusEffect(
        useCallback(() => {
            // Reset all tab scrolls when home tab is focused
            // Use a small delay to ensure refs are ready
            const timer = setTimeout(() => {
                genelTabRef.current?.scrollToTop();
                derslerTabRef.current?.scrollToTop();
                testlerTabRef.current?.scrollToTop();
            }, 50);
            return () => clearTimeout(timer);
        }, [])
    );

    // Listen for scrollToTop event from tab bar
    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener('scrollToTop', () => {
            if (selectedCategory === 'genel') {
                genelTabRef.current?.scrollToTop();
            } else if (selectedCategory === 'dersler') {
                derslerTabRef.current?.scrollToTop();
            } else if (selectedCategory === 'testler') {
                testlerTabRef.current?.scrollToTop();
            }
        });

        return () => {
            subscription.remove();
        };
    }, [selectedCategory]);

    // Handle category change
    const handleCategoryChange = (category: 'genel' | 'dersler' | 'testler') => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedCategory(category);

        // Reset scroll position for the newly selected tab
        setTimeout(() => {
            if (category === 'genel') {
                genelTabRef.current?.scrollToTop();
            } else if (category === 'dersler') {
                derslerTabRef.current?.scrollToTop();
            } else if (category === 'testler') {
                testlerTabRef.current?.scrollToTop();
            }
        }, 0);
    };

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.backgroundDarker,
        },
        categoryBar: {
            flexDirection: 'row',
            marginHorizontal: 16,
            marginBottom: 2,
            padding: 4,
            backgroundColor: colors.surface,
            borderRadius: 32,
            gap: 8,
            // Softer shadow for category bar
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
            borderWidth: activeTheme === 'light' ? 0.2 : 0,
            borderColor: activeTheme === 'light' ? '#FF9600' : 'transparent',
        },
        categoryButton: {
            flex: 1,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
        },
        categoryButtonActive: {
            backgroundColor: '#FF9600',
        },
        categoryButtonInactive: {
            backgroundColor: 'transparent',
        },
        categoryButtonText: {
            fontSize: 14,
            fontWeight: 'bold',
        },
        categoryButtonTextActive: {
            color: activeTheme === 'light' ? '#000000' : colors.background,
        },
        categoryButtonTextInactive: {
            color: colors.textSecondary,
        },
        contentWrapper: {
            flex: 1,
            backgroundColor: colors.backgroundDarker,
        },
    }), [themeVersion, activeTheme]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style={statusBarStyle} />

            <HomeHeader />

            {/* Category Selection Bar */}
            <View style={styles.categoryBar}>
                <Pressable
                    style={[
                        styles.categoryButton,
                        selectedCategory === 'genel' ? styles.categoryButtonActive : styles.categoryButtonInactive
                    ]}
                    onPress={() => handleCategoryChange('genel')}
                >
                    <Text style={[
                        styles.categoryButtonText,
                        selectedCategory === 'genel' ? styles.categoryButtonTextActive : styles.categoryButtonTextInactive
                    ]}>
                        {t('home.general')}
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.categoryButton,
                        selectedCategory === 'dersler' ? styles.categoryButtonActive : styles.categoryButtonInactive
                    ]}
                    onPress={() => handleCategoryChange('dersler')}
                >
                    <Text style={[
                        styles.categoryButtonText,
                        selectedCategory === 'dersler' ? styles.categoryButtonTextActive : styles.categoryButtonTextInactive
                    ]}>
                        {t('home.lessons')}
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.categoryButton,
                        selectedCategory === 'testler' ? styles.categoryButtonActive : styles.categoryButtonInactive
                    ]}
                    onPress={() => handleCategoryChange('testler')}
                >
                    <Text style={[
                        styles.categoryButtonText,
                        selectedCategory === 'testler' ? styles.categoryButtonTextActive : styles.categoryButtonTextInactive
                    ]}>
                        {t('home.tests')}
                    </Text>
                </Pressable>
            </View>

            {/* Main Content Area */}
            <View style={styles.contentWrapper}>
                <View style={{ display: selectedCategory === 'genel' ? 'flex' : 'none', flex: 1 }}>
                    <GenelTab key="genel" ref={genelTabRef} screenWidth={screenWidth} />
                </View>
                <View style={{ display: selectedCategory === 'dersler' ? 'flex' : 'none', flex: 1 }}>
                    <DerslerTab key="dersler" ref={derslerTabRef} screenWidth={screenWidth} />
                </View>
                <View style={{ display: selectedCategory === 'testler' ? 'flex' : 'none', flex: 1 }}>
                    <TestlerTab key="testler" ref={testlerTabRef} screenWidth={screenWidth} />
                </View>
            </View>
        </SafeAreaView>
    );
}
