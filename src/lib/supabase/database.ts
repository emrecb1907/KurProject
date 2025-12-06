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

    // Generic update for migration or bulk updates
    async update(userId: string, data: {
      total_xp?: number,
      current_level?: number,
      current_lives?: number,
      streak_count?: number
    }) {
      let firstError = null;

      // 1. Update Stats (total_xp => total_score)
      if (data.total_xp !== undefined || data.current_level !== undefined || data.current_lives !== undefined) {
        const statsUpdates: any = {};
        if (data.total_xp !== undefined) statsUpdates.total_score = data.total_xp;
        if (data.current_level !== undefined) statsUpdates.current_level = data.current_level;
        if (data.current_lives !== undefined) statsUpdates.current_lives = data.current_lives;

        const { error } = await this.updateStats(userId, statsUpdates);
        if (error) firstError = error;
      }

      // 2. Update Streak
      if (data.streak_count !== undefined) {
        const { error } = await supabase
          .from('user_streaks')
          .update({ streak: data.streak_count })
          .eq('user_id', userId);
        if (error && !firstError) firstError = error;
      }

      return { error: firstError };
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

    // Alias for updating lives (backward compatibility)
    async updateLives(userId: string, lives: number) {
      return this.updateStats(userId, { current_lives: lives });
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
    },

    // Get Leaderboard (Top 50)
    async getLeaderboard(limit: number = 50) {
      const { data, error } = await supabase
        .from('user_stats')
        .select(`
          total_score,
          league,
          user_id,
          users:users (
            id,
            username,
            avatar_url,
            email
          )
        `)
        .order('total_score', { ascending: false })
        .limit(limit);

      if (error) return { data: null, error };
      if (!data) return { data: [], error: null };

      // Transform to expected format
      const leaderboardData = data.map((item: any) => ({
        id: item.users?.id || item.user_id,
        username: item.users?.username || item.users?.email?.split('@')[0] || 'Unknown User',
        email: item.users?.email,
        total_xp: item.total_score, // Map total_score to total_xp
        league: item.league || 'Bronze',
        avatar_url: item.users?.avatar_url
      }));

      return { data: leaderboardData, error: null };
    },

    // Get User Rank
    async getUserRank(userId: string) {
      // Since we can't easily get row number in Supabase without a window function RPC,
      // we'll fetch the user's stats first, then count how many users have more XP.

      // 1. Get user's score
      const { data: userStats, error: statsError } = await supabase
        .from('user_stats')
        .select('total_score')
        .eq('user_id', userId)
        .single();

      if (statsError || !userStats) return { data: null, error: statsError };

      // 2. Count users with more XP
      const { count, error: countError } = await supabase
        .from('user_stats')
        .select('*', { count: 'exact', head: true })
        .gt('total_score', userStats.total_score);

      if (countError) return { data: null, error: countError };

      // Rank is count + 1
      const rank = (count || 0) + 1;

      // 3. Get user details for the return object
      const { data: userData } = await supabase
        .from('users')
        .select('username, email, league')
        .eq('id', userId)
        .single();

      return {
        data: {
          rank,
          user: {
            id: userId,
            username: userData?.username,
            email: userData?.email,
            league: userData?.league || 'Bronze',
            total_xp: userStats.total_score
          }
        },
        error: null
      };
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
  },

  // ==================== ENERGY SYSTEM ====================
  energy: {
    // Sync energy (Passive Regeneration)
    async sync(userId: string) {
      const { data, error } = await supabase.rpc('sync_user_energy', {
        p_user_id: userId
      });
      return { data, error };
    },

    // Consume energy (Start Test)
    async consume(userId: string) {
      const { data, error } = await supabase
        .rpc('consume_energy', { p_user_id: userId });
      return { data, error };
    },

    // Add energy (Rewards)
    async add(userId: string, amount: number) {
      const { data, error } = await supabase
        .rpc('add_energy', { p_user_id: userId, p_amount: amount });
      return { data, error };
    }
  }
};

