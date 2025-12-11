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
    async updateProfile(userId: string, data: { username?: string, email?: string, avatar_url?: string }) {
      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', userId);
      return { error };
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

    // Update User XP (Add to current)
    async updateXP(userId: string, amount: number) {
      // 1. Get current stats
      const { data: stats, error: statsError } = await this.getProfile(userId);

      if (statsError || !stats) return { data: null, error: statsError };

      const currentScore = stats.stats.total_score || 0;
      const newScore = currentScore + amount;

      // 2. Update with new total
      return this.updateStats(userId, { total_score: newScore });
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

    // Start a new session (for security)
    async startSession(userId: string, sessionId: string) {
      const { data, error } = await supabase
        .from('user_sessions')
        .upsert({
          user_id: userId,
          session_id: sessionId,
          updated_at: new Date().toISOString()
        })
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
      // Use RPC for idempotent completion & secure XP (Secure V2)
      const { data, error } = await supabase.rpc('complete_lesson_secure', {
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
      duration?: number,
      client_timestamp?: string, // 🌍 Global Streak Support
      session_id?: string // 🔐 Session Security
    }) {
      // Use RPC for Secure XP Calculation (Server Side)
      const { data, error } = await supabase.rpc('submit_test_result_secure', {
        p_user_id: userId,
        p_test_id: result.test_id,
        p_correct: result.correct_answer,
        p_total: result.total_question,
        p_duration: result.duration || 10,
        p_client_timestamp: result.client_timestamp || new Date().toISOString(), // Pass client time
        p_session_id: result.session_id // Pass session ID
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

  // ==============================================================================
  // DAILY SNAPSHOTS (SECURE SERVER-SIDE)
  // ==============================================================================
  dailySnapshots: {
    // Get today's progress (server-side calculation)
    async getProgress(userId: string) {
      const { data, error } = await supabase.rpc('get_daily_progress', {
        p_user_id: userId
      });
      return { data, error };
    },

    // Claim Reward (Secure Server-Side Validation)
    async claim(userId: string, rewardType: 'lesson' | 'test') {
      const { data, error } = await supabase.rpc('claim_daily_reward_secure', {
        p_user_id: userId,
        p_reward_type: rewardType
      });
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
  },

  // ==================== WEEKLY REWARD ====================
  weeklyReward: {
    // Check if reward can be claimed (server-side validation)
    async checkStatus(userId: string) {
      const { data, error } = await supabase.rpc('check_weekly_reward_status', {
        p_user_id: userId
      });
      return { data, error };
    },

    // Claim the weekly reward (server-side validation + XP grant)
    async claim(userId: string) {
      const { data, error } = await supabase.rpc('claim_weekly_reward', {
        p_user_id: userId
      });
      return { data, error };
    }
  },

  // ==================== TIMEZONE ====================
  timezone: {
    // Get user's timezone
    async get(userId: string) {
      const { data, error } = await supabase
        .from('users')
        .select('timezone, timezone_updated_at')
        .eq('id', userId)
        .single();
      return { data, error };
    },

    // Set timezone (initial setup, no cooldown check)
    async set(userId: string, timezone: string) {
      const { data, error } = await supabase
        .from('users')
        .update({ timezone })
        .eq('id', userId)
        .select('timezone')
        .single();
      return { data, error };
    },

    // Change timezone (with 30-day cooldown via RPC)
    async change(userId: string, newTimezone: string) {
      const { data, error } = await supabase.rpc('change_user_timezone', {
        p_user_id: userId,
        p_new_timezone: newTimezone
      });
      return { data, error };
    }
  }
};
