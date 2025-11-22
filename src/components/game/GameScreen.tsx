import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { QuestionCard } from './QuestionCard';
import { OptionButton } from './OptionButton';
import { Timer } from './Timer';
import { LifeIndicator } from './LifeIndicator';
import { Button } from '@components/ui';
import { LoadingDots } from '@components/ui/LoadingDots';
import { useStore } from '@/store';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { hapticSuccess, hapticError, hapticLight } from '@/utils/haptics';
import { GameQuestion, GameType } from '@/types/game.types';
import { useGameCompletion } from '@/hooks';
import { GAME_UI_CONFIG } from '@constants/game';
import { logger } from '@/lib/logger';

interface GameScreenProps {
    lessonId: string;
    gameType: GameType;
    questions: GameQuestion[];
    timerDuration?: number;
    hasLatinToggle?: boolean;
    onComplete?: () => void;
}

export function GameScreen({
    lessonId,
    gameType,
    questions,
    timerDuration = 10,
    hasLatinToggle = false,
    onComplete,
}: GameScreenProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const { currentLives, maxLives, removeLives } = useStore();
    const { themeVersion } = useTheme();
    const { completeGame, isSubmitting } = useGameCompletion();

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [isGameComplete, setIsGameComplete] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showLatin, setShowLatin] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const styles = useMemo(() => getStyles(), [themeVersion]);

    // Check lives on mount
    useEffect(() => {
        logger.game(`${gameType} game loaded - Using generic GameScreen component`);

        if (currentLives <= 0) {
            Alert.alert(t('errors.insufficientLives'), t('errors.insufficientLivesDesc'), [
                {
                    text: t('common.ok'),
                    onPress: handleExit,
                },
            ]);
            return;
        }

        // Deduct life
        removeLives(1);
    }, []);

    const handleTimeUp = () => {
        handleAnswer(getCurrentOptions()[0], 0);
    };

    const handleAnswer = async (answer: string, timeTaken: number) => {
        if (isAnswered) return;

        setSelectedOption(answer);
        const correct = hasLatinToggle && showLatin
            ? answer === currentQuestion.correctAnswerLatin
            : answer === currentQuestion.correctAnswer;

        setIsCorrect(correct);
        setIsAnswered(true);

        if (correct) {
            hapticSuccess();
            setCorrectAnswersCount((prev) => prev + 1);
        } else {
            hapticError();
        }
    };

    const handleNext = () => {
        hapticLight();
        setIsAnswered(false);
        setSelectedOption(null);
        setIsCorrect(null);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setIsGameComplete(true);
        }
    };

    const handleExit = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    };

    const handleRetry = () => {
        hapticLight();
        setCurrentQuestionIndex(0);
        setCorrectAnswersCount(0);
        setIsGameComplete(false);
        setIsAnswered(false);
        setSelectedOption(null);
        setIsCorrect(null);
    };

    const handleComplete = async () => {
        if (isSubmitting) return;
        hapticLight();

        // Use the centralized completion hook
        await completeGame({
            lessonId,
            gameType,
            correctAnswers: correctAnswersCount,
            totalQuestions: questions.length,
        });

        if (onComplete) {
            onComplete();
        }
        handleExit();
    };

    const getCurrentOptions = () => {
        if (hasLatinToggle && showLatin && currentQuestion.optionsLatin) {
            return currentQuestion.optionsLatin;
        }
        return currentQuestion.options;
    };

    const getCurrentQuestion = () => {
        if (hasLatinToggle && showLatin && currentQuestion.questionLatin) {
            return currentQuestion.questionLatin;
        }
        return currentQuestion.question;
    };

    const getOptionState = (option: string) => {
        if (!isAnswered) {
            return selectedOption === option ? 'selected' : 'default';
        }

        const correctAnswer = hasLatinToggle && showLatin
            ? currentQuestion.correctAnswerLatin
            : currentQuestion.correctAnswer;

        if (option === correctAnswer) {
            return 'correct';
        }

        if (option === selectedOption && !isCorrect) {
            return 'incorrect';
        }

        return 'default';
    };

    if (isGameComplete) {
        const isExcellent = correctAnswersCount >= GAME_UI_CONFIG.EXCELLENT_SCORE_THRESHOLD;

        return (
            <View style={styles.container}>
                <View style={styles.completeContainer}>
                    <Text style={styles.completeTitle}>{t('gameUI.gameComplete')}</Text>
                    <Text style={styles.completeText}>
                        {isExcellent ? t('gameUI.congratulations') : t('gameUI.goodJob')}
                    </Text>

                    <View style={styles.statsContainer}>
                        <Text style={styles.statText}>
                            {t('gameUI.question')}: {questions.length}
                        </Text>
                        <Text style={styles.statText}>
                            {t('gameUI.correctAnswers')}: {correctAnswersCount}
                        </Text>
                        <Text style={styles.statText}>XP: +{correctAnswersCount}</Text>
                    </View>

                    <Pressable
                        style={[styles.completeButton, isSubmitting && { opacity: 0.7 }]}
                        onPress={handleComplete}
                        disabled={isSubmitting}
                    >
                        <Text style={styles.completeButtonText}>
                            {isSubmitting ? t('common.loading') : t('common.finish')}
                        </Text>
                        {isSubmitting && <LoadingDots style={{ color: colors.textOnPrimary, marginLeft: 4 }} />}
                    </Pressable>

                    {!isSubmitting && (
                        <Pressable
                            style={[
                                styles.completeButton,
                                {
                                    backgroundColor: colors.primary,
                                    marginTop: 12,
                                    borderBottomColor: colors.primaryDark,
                                },
                            ]}
                            onPress={handleRetry}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.completeButtonText}>
                                {t('gameUI.playAgain').toUpperCase()}
                            </Text>
                        </Pressable>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={handleExit}>
                    <Text style={styles.backButton}>✕</Text>
                </Pressable>
                <LifeIndicator currentLives={currentLives} maxLives={maxLives} />
            </View>

            {/* Timer */}
            <Timer
                key={currentQuestionIndex}
                duration={timerDuration}
                onTimeUp={handleTimeUp}
                isActive={!isAnswered}
            />

            <ScrollView style={styles.content}>
                <View style={styles.questionContainer}>
                    {/* Question */}
                    <QuestionCard
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={questions.length}
                        question={getCurrentQuestion()}
                    />

                    {/* Latin Toggle Button (only for verses) */}
                    {hasLatinToggle && (
                        <Button
                            title={showLatin ? t('common.showArabic') : t('common.showLatin')}
                            variant="outline"
                            size="small"
                            onPress={() => setShowLatin(!showLatin)}
                            style={styles.toggleButton}
                        />
                    )}
                </View>

                {/* Options */}
                <View style={styles.options}>
                    {getCurrentOptions().map((option, index) => (
                        <OptionButton
                            key={index}
                            option={option}
                            state={getOptionState(option)}
                            onPress={() => handleAnswer(option, 0)}
                            disabled={isAnswered}
                        />
                    ))}
                </View>
            </ScrollView>

            {/* Next Button Footer */}
            {isAnswered && (
                <View style={styles.footer}>
                    <Pressable style={styles.nextButton} onPress={handleNext}>
                        <Text style={styles.nextButtonText}>
                            {currentQuestionIndex < questions.length - 1
                                ? t('common.nextQuestion')
                                : t('common.finish')}
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const getStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            paddingTop: 60,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            marginBottom: 16,
        },
        backButton: {
            fontSize: 24,
            color: colors.textPrimary,
            fontWeight: '600',
        },
        content: {
            flex: 1,
            paddingHorizontal: 16,
        },
        questionContainer: {
            marginBottom: 16,
        },
        toggleButton: {
            marginTop: 8,
        },
        options: {
            marginTop: 8,
            paddingBottom: GAME_UI_CONFIG.FOOTER_PADDING,
        },
        footer: {
            position: 'absolute',
            bottom: 20,
            left: 0,
            right: 0,
            padding: 16,
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.border,
        },
        nextButton: {
            backgroundColor: colors.success,
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: 'center',
            borderBottomWidth: 4,
            borderBottomColor: colors.successDark,
            marginHorizontal: 20,
        },
        nextButtonText: {
            color: colors.textOnPrimary,
            fontSize: 18,
            fontWeight: 'bold',
        },
        completeContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        completeTitle: {
            fontSize: 32,
            fontWeight: 'bold',
            color: colors.textPrimary,
            marginBottom: 16,
        },
        completeText: {
            fontSize: 18,
            color: colors.textSecondary,
            marginBottom: 32,
        },
        statsContainer: {
            backgroundColor: colors.surface,
            padding: 20,
            borderRadius: 16,
            width: '100%',
            marginBottom: 32,
            alignItems: 'center',
            gap: 12,
        },
        statText: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.textPrimary,
        },
        completeButton: {
            backgroundColor: colors.success,
            paddingVertical: 16,
            paddingHorizontal: 48,
            borderRadius: 16,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            borderBottomWidth: 4,
            borderBottomColor: colors.successDark,
        },
        completeButtonText: {
            color: colors.textOnPrimary,
            fontSize: 18,
            fontWeight: 'bold',
        },
    });
