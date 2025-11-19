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

    async getLeaderboard(limit: number = 50) {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, email, total_xp, current_level, league')
        .eq('is_anonymous', false) // Only show authenticated users
        .order('total_xp', { ascending: false })
        .limit(limit);
      
      return { data: data as LeaderboardEntry[] | null, error };
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
      const completionRate = (correct / total) * 100;
      const isCompleted = completionRate >= 70; // 70% completion threshold

      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          completion_rate: completionRate,
          correct_answers: correct,
          total_attempts: total,
          is_completed: isCompleted,
          last_attempted: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      return { data: data as UserProgress | null, error };
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
};

