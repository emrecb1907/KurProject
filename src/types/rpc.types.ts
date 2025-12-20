/**
 * RPC Response Types
 * 
 * Type definitions for all Supabase RPC function responses.
 * Provides type safety for server-side function returns.
 */

// ═══════════════════════════════════════════════════════════════
// Base Response Types
// ═══════════════════════════════════════════════════════════════

export interface RPCSuccessResponse<T = unknown> {
    success: true;
    data?: T;
}

export interface RPCErrorResponse {
    success: false;
    error: string;
    message?: string;
    code?: string;
}

export type RPCResponse<T = unknown> = RPCSuccessResponse<T> | RPCErrorResponse;

// ═══════════════════════════════════════════════════════════════
// Test Result Submission (submit_test_result_secure)
// ═══════════════════════════════════════════════════════════════

export interface SubmitTestResultResponse {
    success: boolean;
    error?: string;
    message?: string;
    xp_earned?: number;
    new_streak?: number;
    new_level?: number;
    total_score?: number;
}

// ═══════════════════════════════════════════════════════════════
// Energy System (sync_user_energy, consume_energy, add_energy)
// ═══════════════════════════════════════════════════════════════

export interface SyncEnergyResponse {
    current_energy: number;
    max_energy: number;
    last_update: string | null;
    last_replenish_time?: string | null;
}

export interface ConsumeEnergyResponse {
    success: boolean;
    current_energy: number;
    session_id?: string;
    error?: string;
}

export interface AddEnergyResponse {
    success: boolean;
    current_energy: number;
    error?: string;
}

// ═══════════════════════════════════════════════════════════════
// Daily Progress (get_daily_progress, claim_daily_reward_secure)
// ═══════════════════════════════════════════════════════════════

export interface DailyProgressResponse {
    lessons_today: number;
    tests_today: number;
    lesson_claimed: boolean;
    test_claimed: boolean;
    date: string;
}

export interface ClaimDailyRewardResponse {
    success: boolean;
    xp_awarded?: number;
    error?: string;
}

// ═══════════════════════════════════════════════════════════════
// Weekly Reward (check_weekly_reward_status, claim_weekly_reward)
// ═══════════════════════════════════════════════════════════════

export interface WeeklyRewardStatusResponse {
    can_claim: boolean;
    active_days: number;
    last_claim_date?: string;
}

export interface ClaimWeeklyRewardResponse {
    success: boolean;
    xp_awarded?: number;
    error?: string;
}

// ═══════════════════════════════════════════════════════════════
// Lesson Completion (complete_lesson_secure)
// ═══════════════════════════════════════════════════════════════

export interface CompleteLessonResponse {
    success: boolean;
    xp_earned?: number;
    error?: string;
}

// ═══════════════════════════════════════════════════════════════
// Type Guards
// ═══════════════════════════════════════════════════════════════

export function isRPCError(response: unknown): response is RPCErrorResponse {
    return (
        typeof response === 'object' &&
        response !== null &&
        'success' in response &&
        (response as RPCErrorResponse).success === false
    );
}

export function isRPCSuccess<T>(response: unknown): response is RPCSuccessResponse<T> {
    return (
        typeof response === 'object' &&
        response !== null &&
        'success' in response &&
        (response as RPCSuccessResponse<T>).success === true
    );
}
