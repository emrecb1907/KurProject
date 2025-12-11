export const getFeedbackCategory = (percentage: number): 'low' | 'mid' | 'high' => {
    if (percentage >= 70) {
        return 'high';
    } else if (percentage >= 40) {
        return 'mid';
    } else {
        return 'low';
    }
};

export const getFeedbackPath = (
    percentage: number,
    isCorrect: boolean
): string => {
    const category = getFeedbackCategory(percentage);
    const type = isCorrect ? 'correct' : 'wrong';
    return `gameUI.feedback.${category}.${type}`;
};

export const getCompletionFeedbackPath = (percentage: number): string => {
    if (percentage <= 10) return 'gameUI.completionFeedback.range_0_10';
    if (percentage <= 20) return 'gameUI.completionFeedback.range_11_20';
    if (percentage <= 30) return 'gameUI.completionFeedback.range_21_30';
    if (percentage <= 40) return 'gameUI.completionFeedback.range_31_40';
    if (percentage <= 50) return 'gameUI.completionFeedback.range_41_50';
    if (percentage <= 60) return 'gameUI.completionFeedback.range_51_60';
    if (percentage <= 70) return 'gameUI.completionFeedback.range_61_70';
    if (percentage <= 80) return 'gameUI.completionFeedback.range_71_80';
    if (percentage <= 90) return 'gameUI.completionFeedback.range_81_90';
    return 'gameUI.completionFeedback.range_91_100';
};

export interface FeedbackMessage {
    title: string;
    message: string;
}
