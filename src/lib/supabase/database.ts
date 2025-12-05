import { supabase } from './client';

// ==============================================================================
// DATABASE CLIENT (SKELETON)
// ==============================================================================
// This file has been reset. We will rebuild methods as we define new tables.
// ==============================================================================

// ==============================================================================
// DATABASE CLIENT (REBUILD PHASE 1)
// ==============================================================================

export const database = {

  // ==================== USERS & STATS ====================
  users: {
    // Get full user profile (User + Stats + Streak)
    async getProfile(userId: string) {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) return { data: null, error: userError };

      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      const { data: streak } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .single();

      return {
        data: {
          ...user,
          stats: stats || {},
          streak: streak || {}
        },
        error: null
      };
    },

    // Update User Stats (Score, Level, Lives, League)
    async updateStats(userId: string, updates: {
      total_score?: number,
      current_level?: number,
      current_lives?: number,
      league?: string
    }) {
      const { data, error } = await supabase
        .from('user_stats')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();
      return { data, error };
    },

    // Update User Streak
    async updateStreak(userId: string, streak: number, activityDate: string) {
      // 1. Get current activity days
      const { data: currentData } = await supabase
        .from('user_streaks')
        .select('activity_days')
        .eq('user_id', userId)
        .single();

      let activityDays = currentData?.activity_days || [];
      if (!activityDays.includes(activityDate)) {
        activityDays.push(activityDate);
      }

      const { data, error } = await supabase
        .from('user_streaks')
        .update({
          streak: streak,
          last_activity_date: activityDate,
          activity_days: activityDays,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      return { data, error };
    }
  },

  // ==================== LESSON PROGRESS ====================
  lessons: {
    async complete(userId: string, lessonId: string) {
      // Use RPC for idempotent completion
      const { data, error } = await supabase.rpc('complete_lesson', {
        p_user_id: userId,
        p_lesson_id: lessonId
      });
      return { data, error };
    },

    async getCompleted(userId: string) {
      const { data, error } = await supabase
        .from('user_lessons')
        .select('lesson_id')
        .eq('user_id', userId)
        .eq('is_completed', true);

      // Return simple array of completed lesson IDs
      const completedIds = data ? data.map(l => l.lesson_id) : [];
      return { data: completedIds, error };
    }
  },

  // ==================== TEST RESULTS ====================
  tests: {
    async saveResult(userId: string, result: {
      test_id: string,
      correct_answer: number,
      total_question: number,
      percent: number,
      new_level?: number // Optional: Client calculated level
    }) {
      // Use RPC for cumulative logic + XP + Streak
      const { data, error } = await supabase.rpc('submit_test_result', {
        p_user_id: userId,
        p_test_id: result.test_id,
        p_correct: result.correct_answer,
        p_total: result.total_question,
        p_new_level: result.new_level
      });
      return { data, error };
    },

    async getHistory(userId: string) {
      const { data, error } = await supabase
        .from('user_test_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data, error };
    }
  },

  // ==================== DAILY ACTIVITY ====================
  dailyActivity: {
    async getStats(userId: string) {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) {
        return {
          data: {
            ...data,
            weekly_activity: data.activity_days
          },
          error
        };
      }
      return { data, error };
    }
  }
};

