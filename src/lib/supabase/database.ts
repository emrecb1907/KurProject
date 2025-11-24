import { supabase } from './client';
import { User, UserProgress, LeaderboardEntry } from '@types/user.types';
import { Lesson } from '@types/lesson.types';
import { Question, UserAnswer } from '@types/question.types';
import { Badge, UserBadge } from '@types/badge.types';

export const database = {
  // ==================== USERS ====================
  users: {
    async getById(userId: string) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      return { data: data as User | null, error };
    },

    async getByDeviceId(deviceId: string) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('device_id', deviceId)
        .single();
      return { data: data as User | null, error };
    },

    async create(userData: Partial<User>) {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();
      return { data: data as User | null, error };
    },

    async update(userId: string, updates: Partial<User>) {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      return { data: data as User | null, error };
    },

    async updateXP(userId: string, xpToAdd: number) {
      // Get current user to calculate new values
      const { data: user } = await this.getById(userId);
      if (!user) return { data: null, error: new Error('User not found') };

      const newTotalXP = user.total_xp + xpToAdd;
      const newScore = user.total_score + xpToAdd;

      const { data, error } = await supabase
        .from('users')
        .update({
          total_xp: newTotalXP,
          total_score: newScore,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();
      return { data: data as User | null, error };
    },

    async updateLives(userId: string, livesChange: number) {
      const { data: user } = await this.getById(userId);
      if (!user) return { data: null, error: new Error('User not found') };

      const newLives = Math.max(0, Math.min(user.max_lives, user.current_lives + livesChange));

      const { data, error } = await supabase
        .from('users')
        .update({ current_lives: newLives })
        .eq('id', userId)
        .select()
        .single();
      return { data: data as User | null, error };
    },

    async incrementStats(userId: string, stats: { lessons?: number, questions?: number, correct?: number, wrong?: number }) {
      const { error } = await supabase.rpc('increment_user_stats', {
        p_user_id: userId,
        p_lessons_completed: stats.lessons || 0,
        p_questions_solved: stats.questions || 0,
        p_correct_answers: stats.correct || 0,
        p_wrong_answers: stats.wrong || 0,
      });
      return { error };
    },

    async getLeaderboard(limit: number = 50) {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, email, total_xp, current_level, league')
        .eq('is_anonymous', false) // Only show authenticated users
        .order('total_xp', { ascending: false })
        .limit(limit);

      return { data: data as LeaderboardEntry[] | null, error };
    },

    async getUserRank(userId: string) {
      // Get user's data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, username, email, total_xp, current_level, league')
        .eq('id', userId)
        .single();

      if (userError || !userData) {
        return { data: null, error: userError };
      }

      // Count how many users have more XP (to get rank)
      const { count, error: countError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('is_anonymous', false)
        .gt('total_xp', userData.total_xp);

      if (countError) {
        return { data: null, error: countError };
      }

      const rank = (count || 0) + 1;

      return {
        data: {
          rank,
          user: userData as LeaderboardEntry,
        },
        error: null,
      };
    },
  },

  // ==================== LESSONS ====================
  lessons: {
    async getAll() {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      return { data: data as Lesson[] | null, error };
    },

    async getByCategory(category: string) {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('order_index');
      return { data: data as Lesson[] | null, error };
    },

    async getById(lessonId: string) {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();
      return { data: data as Lesson | null, error };
    },
  },

  // ==================== QUESTIONS ====================
  questions: {
    async getByLessonId(lessonId: string) {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('lesson_id', lessonId)
        .eq('is_active', true)
        .order('order_index');
      return { data: data as Question[] | null, error };
    },

    async getById(questionId: string) {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .single();
      return { data: data as Question | null, error };
    },
  },

  // ==================== USER PROGRESS ====================
  progress: {
    async getByUserId(userId: string) {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);
      return { data: data as UserProgress[] | null, error };
    },

    async getByUserAndLesson(userId: string, lessonId: string) {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .single();
      return { data: data as UserProgress | null, error };
    },

    async upsert(progressData: Partial<UserProgress>) {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert(progressData)
        .select()
        .single();
      return { data: data as UserProgress | null, error };
    },

    async updateCompletion(userId: string, lessonId: string, correct: number, total: number) {
      console.log('🔄 updateCompletion called:', { userId, lessonId, correct, total });

      try {
        const completionRate = (correct / total) * 100;
        const isCompleted = true; // Always mark as completed regardless of score

        // 1. Get existing progress (Safe fetch)
        let currentCount = 0;
        const { data: existingProgress, error: fetchError } = await supabase
          .from('user_progress')
          .select('completion_count')
          .eq('user_id', userId)
          .eq('lesson_id', lessonId)
          .single();

        if (!fetchError && existingProgress) {
          currentCount = existingProgress.completion_count || 0;
        }

        const newCount = currentCount + 1;

        // 2. Upsert User Progress
        const { data, error: upsertError } = await supabase
          .from('user_progress')
          .upsert({
            user_id: userId,
            lesson_id: lessonId,
            completion_rate: completionRate,
            correct_answers: correct,
            total_attempts: total,
            is_completed: isCompleted,
            completion_count: newCount,
            last_attempted: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id,lesson_id' })
          .select()
          .single();

        if (upsertError) {
          console.error('❌ Error updating user_progress:', upsertError);
          return { data: null, error: upsertError };
        }

        // 3. Update User Stats (RPC)
        const wrong = total - correct;
        const { error: rpcError } = await supabase.rpc('increment_user_stats', {
          p_user_id: userId,
          p_lessons_completed: 1,
          p_questions_solved: total,
          p_correct_answers: correct,
          p_wrong_answers: wrong,
        });

        if (rpcError) {
          console.error('❌ Error incrementing user stats:', rpcError);
          // We don't return error here because progress was saved successfully
        } else {
          console.log('✅ User stats incremented successfully');
        }

        return { data: data as UserProgress | null, error: null };

      } catch (err) {
        console.error('❌ Unexpected error in updateCompletion:', err);
        return { data: null, error: err as any };
      }
    },
  },

  // ==================== USER ANSWERS ====================
  answers: {
    async create(answerData: Partial<UserAnswer>) {
      const { data, error } = await supabase
        .from('user_answers')
        .insert(answerData)
        .select()
        .single();
      return { data: data as UserAnswer | null, error };
    },

    async getByUserId(userId: string, limit = 100) {
      const { data, error } = await supabase
        .from('user_answers')
        .select('*')
        .eq('user_id', userId)
        .order('answered_at', { ascending: false })
        .limit(limit);
      return { data: data as UserAnswer[] | null, error };
    },

    async getWeeklyActivity(userId: string) {
      // Get activity for the last 7 days
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);

      const { data, error } = await supabase
        .from('user_answers')
        .select('answered_at')
        .eq('user_id', userId)
        .gte('answered_at', sevenDaysAgo.toISOString())
        .order('answered_at', { ascending: false });

      return { data: data as { answered_at: string }[] | null, error };
    },
  },

  // ==================== LEADERBOARD ====================
  leaderboard: {
    async getByLeague(league: string, limit = 100) {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('league', league)
        .order('total_score', { ascending: false })
        .limit(limit);
      return { data: data as LeaderboardEntry[] | null, error };
    },

    async getGlobal(limit = 100) {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('total_score', { ascending: false })
        .limit(limit);
      return { data: data as LeaderboardEntry[] | null, error };
    },

    async upsert(userId: string, username: string, totalScore: number, currentLevel: number, league: string) {
      const { data, error } = await supabase
        .from('leaderboard')
        .upsert({
          user_id: userId,
          username,
          total_score: totalScore,
          current_level: currentLevel,
          league,
          last_updated: new Date().toISOString(),
        })
        .select()
        .single();
      return { data: data as LeaderboardEntry | null, error };
    },
  },

  // ==================== BADGES ====================
  badges: {
    async getAll() {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .eq('is_active', true);
      return { data: data as Badge[] | null, error };
    },

    async getUserBadges(userId: string) {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*, badges(*)')
        .eq('user_id', userId);
      return { data: data as UserBadge[] | null, error };
    },

    async awardBadge(userId: string, badgeId: string) {
      const { data, error } = await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_id: badgeId,
          earned_at: new Date().toISOString(),
          is_claimed: false,
        })
        .select()
        .single();
      return { data: data as UserBadge | null, error };
    },
  },

  // ==================== STREAKS ====================
  streaks: {
    async getByUserId(userId: string) {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .single();
      return { data, error };
    },

    async updateStreak(userId: string) {
      const { data, error } = await supabase.rpc('update_user_streak', {
        p_user_id: userId,
      });
      return { data, error };
    },
  },

  // ==================== DAILY ACTIVITY ====================
  dailyActivity: {
    async record(userId: string) {
      const toLocalISOString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const today = new Date();
      const todayStr = toLocalISOString(today); // YYYY-MM-DD (Local)

      // Get current user data
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('streak, last_activity_date, weekly_activity')
        .eq('id', userId)
        .single();

      if (fetchError || !user) return { error: fetchError };

      const lastActivityStr = user.last_activity_date;

      // 1. Calculate Streak
      let newStreak = user.streak || 0;

      if (lastActivityStr === todayStr) {
        // Already active today, do nothing to streak
      } else {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = toLocalISOString(yesterday);

        if (lastActivityStr === yesterdayStr) {
          // Active yesterday, increment streak
          newStreak += 1;
        } else {
          // Missed a day (or more), reset streak to 1
          newStreak = 1;
        }
      }

      // 2. Update Weekly Activity
      let weeklyActivity: string[] = [];
      if (Array.isArray(user.weekly_activity)) {
        weeklyActivity = user.weekly_activity as string[];
      }

      // Check if we need to reset for a new week
      // CHANGED: We now keep a rolling window of 30 days instead of resetting on Monday
      // This supports the new "Streak View" which can start on any day
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      const thirtyDaysAgoStr = toLocalISOString(thirtyDaysAgo);

      // Filter out dates older than 30 days
      weeklyActivity = weeklyActivity.filter(dateStr => dateStr >= thirtyDaysAgoStr);

      // Add today if not present
      if (!weeklyActivity.includes(todayStr)) {
        weeklyActivity.push(todayStr);
      }

      // 3. Save to DB
      const { error: updateError } = await supabase
        .from('users')
        .update({
          streak: newStreak,
          last_activity_date: todayStr,
          weekly_activity: weeklyActivity,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      return { error: updateError };
    },

    async getStats(userId: string) {
      const { data, error } = await supabase
        .from('users')
        .select('streak, weekly_activity')
        .eq('id', userId)
        .single();
      return { data, error };
    }
  },
};
