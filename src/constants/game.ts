// Game Constants

// Question Time Limits (in seconds)
export const QUESTION_TIME_LIMITS = {
  LETTERS: 10,
  VOCABULARY: 10,
  VERSES: 10,
  QUICK_QUIZ: 8,
} as const;

// Reinforcement Duration (in seconds)
export const REINFORCEMENT_DURATION = 5;

// Question Types
export const QUESTION_TYPES = {
  AUDIO_MATCH: 'audio_match',
  WORD_MATCH: 'word_match',
  FILL_BLANK: 'fill_blank',
  MULTIPLE_CHOICE: 'multiple_choice',
} as const;

// Game Categories
export const GAME_CATEGORIES = {
  LETTERS: 'letters',
  VOCABULARY: 'vocabulary',
  VERSES: 'verses',
  PRAYERS: 'prayers',
  QUICK_QUIZ: 'quick_quiz',
} as const;

// Lives System
export const LIVES_CONFIG = {
  MAX_LIVES: 5,
  INITIAL_LIVES: 5,
  AD_REWARD_LIVES: 1,
  MAX_DAILY_AD_SLOTS: 3,
  AD_SLOT_RESET_HOURS: 24,
} as const;

// Mastery System
export const MASTERY_CONFIG = {
  REQUIRED_QUESTIONS: 20,
  REQUIRED_ACCURACY: 0.9, // 90%
  WEEKLY_REVIEW_ENABLED: true,
} as const;

// Quick Quiz Unlock
export const QUICK_QUIZ_UNLOCK_LEVEL = 10;

// Question Counts
export const QUESTIONS_PER_LESSON = {
  LETTERS: 20,
  VOCABULARY: 20, // 10 TR->AR + 10 AR->TR
  VERSES: 15,
  PRAYERS: 15,
  QUICK_QUIZ: 30,
} as const;

