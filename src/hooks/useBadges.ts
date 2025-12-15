import { useMemo } from 'react';
import { BADGES } from '@/data/badges';
import { UserStats } from '@/types/user.types';
import { Badge, BadgeWithProgress } from '@/types/badge.types';

// Define a minimal interface for what we need, compatible with both full UserStats and the simplified stats from useUserStats
interface BadgeUserStats {
    total_tests_completed?: number;
    total_lessons_completed?: number;
    completedTests?: number;
}

export const useBadges = (userStats: BadgeUserStats | null | undefined, currentLevel: number = 0) => {
    const badges: BadgeWithProgress[] = useMemo(() => {
        if (!userStats) {
            // Return badges with 0 progress if no stats are available
            return BADGES.map((badge) => ({
                ...badge,
                created_at: new Date().toISOString(), // Mock date for now since it's client-side static
                is_active: true,
                user_progress: {
                    progress_percentage: 0,
                    current_value: 0,
                    is_claimed: false,
                },
            }));
        }

        const totalLessons = userStats.total_lessons_completed || 0;
        const totalTests = userStats.total_tests_completed || userStats.completedTests || 0;

        return BADGES.map((badge) => {
            let isUnlocked = false;
            let progress = 0;
            let currentValue = 0;

            if (badge.requirement_type === 'lessons_completed') {
                currentValue = totalLessons;
                isUnlocked = totalLessons >= badge.requirement_value;
                progress = Math.min(100, (totalLessons / badge.requirement_value) * 100);
            } else if (badge.requirement_type === 'level_reached') {
                currentValue = currentLevel;
                isUnlocked = currentLevel >= badge.requirement_value;
                progress = Math.min(100, (currentLevel / badge.requirement_value) * 100);
            } else if (badge.requirement_type === 'tests_completed') {
                currentValue = totalTests;
                isUnlocked = totalTests >= badge.requirement_value;
                progress = Math.min(100, (totalTests / badge.requirement_value) * 100);
            }

            return {
                ...badge,
                created_at: new Date().toISOString(),
                is_active: true,
                user_progress: {
                    progress_percentage: progress,
                    current_value: currentValue,
                    is_claimed: isUnlocked, // Treating unlocked as 'claimed' for visual simplicity
                },
            } as BadgeWithProgress;
        });
    }, [userStats, currentLevel]);

    return { badges };
};
