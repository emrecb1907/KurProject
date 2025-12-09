export interface TaskDefinition {
    id: string;
    title_key: string;
    description_key?: string;
    type: TaskType;
    criteria: TaskCriteria; // JSONB in DB
    reward: {
        xp: number;
        energy?: number;
        item?: string;
    };
    is_active: boolean;
}

export type TaskType = 'daily' | 'weekly' | 'achievement';

// Flexible Criteria using JSON
export interface TaskCriteria {
    action: 'complete_lesson' | 'complete_test' | 'login' | 'spend_time';
    count: number; // Target count (e.g., 5 lessons)

    // Optional filters
    category_id?: string; // Only lessons in this category
    min_score?: number;   // Only tests with score > 80
    min_duration?: number; // Only tests longer than 60s
    specific_id?: string; // Specific lesson ID
}

// The Event that happens in the app
export interface UserAction {
    type: 'lesson_completed' | 'test_completed' | 'app_opened';
    payload: {
        id?: string;
        category_id?: string;
        score?: number;
        duration?: number;
    };
}

/**
 * Logic to check if an action contributes to a task
 */
export const checkTaskProgress = (task: TaskDefinition, action: UserAction): boolean => {
    const { criteria } = task;

    // 1. Check Action Type Mismatch
    // Map Action Type to Task Criteria Action
    if (action.type === 'lesson_completed' && criteria.action !== 'complete_lesson') return false;
    if (action.type === 'test_completed' && criteria.action !== 'complete_test') return false;

    // 2. Check Specific Filters
    if (criteria.category_id && action.payload.category_id !== criteria.category_id) return false;
    if (criteria.min_score && (action.payload.score || 0) < criteria.min_score) return false;
    if (criteria.specific_id && action.payload.id !== criteria.specific_id) return false;

    // If we pass all filters, this action counts!
    return true;
};

/**
 * Proposed DB Schema SQL:
 * 
 * CREATE TABLE daily_tasks (
 *   id SERIAL PRIMARY KEY,
 *   title_key TEXT NOT NULL,
 *   reward_xp INTEGER DEFAULT 10,
 *   criteria JSONB NOT NULL, -- The magic column
 *   is_active BOOLEAN DEFAULT true,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * Example Row:
 * id: 1
 * title_key: "task_high_score_test"
 * criteria: { "action": "complete_test", "count": 1, "min_score": 90 }
 * 
 */
