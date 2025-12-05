import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ChartBar, Trophy, Fire, Target, BookOpen, Lightning } from 'phosphor-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { colors } from '@constants/colors';
import { useStatusBar } from '@/hooks/useStatusBar';
import * as Haptics from 'expo-haptics';
import { useUser, useAuth } from '@/store';
import { useUserStats } from '@hooks';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function AnalysisScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { activeTheme } = useTheme();
    const { statusBarStyle } = useStatusBar();
    const { user } = useAuth();

    // Get stats
    const { data: userStats, isLoading } = useUserStats(user?.id);
    const { totalXP, streak } = useUser();

    const isDark = activeTheme === 'dark';

    // Mock data for the chart (until we have real daily XP data)
    // In a real app, this would come from a 'daily_xp_logs' table
    const weeklyData = [
        { day: 'Pzt', value: 450 },
        { day: 'Sal', value: 320 },
        { day: 'Çar', value: 550 },
        { day: 'Per', value: 400 },
        { day: 'Cum', value: 200 },
        { day: 'Cmt', value: 600 },
        { day: 'Paz', value: 150 },
    ];

    const maxChartValue = Math.max(...weeklyData.map(d => d.value));

    const styles = useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            gap: 16,
        },
        backButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.textPrimary,
        },
        content: {
            padding: 20,
        },
        summaryCard: {
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            marginBottom: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 4,
        },
        summaryTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.textSecondary,
            marginBottom: 16,
        },
        statsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        statItem: {
            alignItems: 'center',
            flex: 1,
        },
        statValue: {
            fontSize: 24,
            fontWeight: 'bold',
            color: colors.textPrimary,
            marginBottom: 4,
        },
        statLabel: {
            fontSize: 12,
            color: colors.textSecondary,
        },
        chartContainer: {
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
            marginBottom: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 4,
        },
        chartHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
        },
        chartTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textPrimary,
        },
        chart: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            height: 200,
            paddingTop: 20,
        },
        barContainer: {
            alignItems: 'center',
            flex: 1,
            gap: 8,
        },
        bar: {
            width: 12,
            borderRadius: 6,
            backgroundColor: colors.primaryLight,
        },
        barActive: {
            backgroundColor: colors.warning,
        },
        barLabel: {
            fontSize: 12,
            color: colors.textSecondary,
            fontWeight: '500',
        },
        detailsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 16,
        },
        detailCard: {
            width: (SCREEN_WIDTH - 56) / 2,
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        },
        detailIcon: {
            width: 40,
            height: 40,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
        },
        detailValue: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.textPrimary,
            marginBottom: 4,
        },
        detailLabel: {
            fontSize: 13,
            color: colors.textSecondary,
        },
    }), [activeTheme]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.back();
                    }}
                >
                    <ArrowLeft size={24} color={colors.textPrimary} weight="bold" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('premiumCenter.features.detailedAnalysis.title')}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Top Summary */}
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>{t('premiumCenter.analysis.overview')}</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Fire size={32} color={colors.primary} weight="fill" style={{ marginBottom: 8 }} />
                            <Text style={styles.statValue}>{streak}</Text>
                            <Text style={styles.statLabel}>{t('premiumCenter.analysis.streak')}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Trophy size={32} color={colors.warning} weight="fill" style={{ marginBottom: 8 }} />
                            <Text style={styles.statValue}>{totalXP}</Text>
                            <Text style={styles.statLabel}>{t('premiumCenter.analysis.totalXP')}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Target size={32} color={colors.success} weight="fill" style={{ marginBottom: 8 }} />
                            <Text style={styles.statValue}>%{userStats?.successRate || 0}</Text>
                            <Text style={styles.statLabel}>{t('premiumCenter.analysis.successRate')}</Text>
                        </View>
                    </View>
                </View>

                {/* Weekly Chart */}
                <View style={styles.chartContainer}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.chartTitle}>{t('premiumCenter.analysis.weeklyActivity')}</Text>
                        <Lightning size={24} color={colors.warning} weight="fill" />
                    </View>

                    <View style={styles.chart}>
                        {weeklyData.map((data, index) => {
                            const heightPercentage = (data.value / maxChartValue) * 100;
                            const isToday = index === 6; // Mocking today as Sunday

                            return (
                                <View key={index} style={styles.barContainer}>
                                    <View
                                        style={[
                                            styles.bar,
                                            { height: `${heightPercentage}%` },
                                            isToday && styles.barActive
                                        ]}
                                    />
                                    <Text style={[styles.barLabel, isToday && { color: colors.warning, fontWeight: 'bold' }]}>
                                        {data.day}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Detailed Stats Grid */}
                <View style={styles.detailsGrid}>
                    <View style={styles.detailCard}>
                        <View style={[styles.detailIcon, { backgroundColor: colors.primaryLight }]}>
                            <BookOpen size={24} color={colors.primary} weight="fill" />
                        </View>
                        <Text style={styles.detailValue}>{userStats?.lessonsCompleted || 0}</Text>
                        <Text style={styles.detailLabel}>{t('premiumCenter.analysis.completedLessons')}</Text>
                    </View>

                    <View style={styles.detailCard}>
                        <View style={[styles.detailIcon, { backgroundColor: '#FFF9C4' }]}>
                            <ChartBar size={24} color={colors.warning} weight="fill" />
                        </View>
                        <Text style={styles.detailValue}>{userStats?.completedTests || 0}</Text>
                        <Text style={styles.detailLabel}>{t('premiumCenter.analysis.completedTests')}</Text>
                    </View>

                    <View style={styles.detailCard}>
                        <View style={[styles.detailIcon, { backgroundColor: '#E8F5E9' }]}>
                            <Target size={24} color={colors.success} weight="fill" />
                        </View>
                        <Text style={styles.detailValue}>982</Text>
                        <Text style={styles.detailLabel}>{t('premiumCenter.analysis.correctAnswers')}</Text>
                    </View>

                    <View style={styles.detailCard}>
                        <View style={[styles.detailIcon, { backgroundColor: '#FFEBEE' }]}>
                            <Lightning size={24} color={colors.error} weight="fill" />
                        </View>
                        <Text style={styles.detailValue}>12.5s</Text>
                        <Text style={styles.detailLabel}>{t('premiumCenter.analysis.averageTime')}</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
