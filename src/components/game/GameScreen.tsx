import { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator, Modal } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { BackHandler } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, runOnJS } from 'react-native-reanimated';
import { QuestionCard } from './QuestionCard';
import { TestPreparationOverlay } from './TestPreparationOverlay';
import { OptionButton } from './OptionButton';
import { Timer } from './Timer';
import { LifeIndicator } from './LifeIndicator';
import { Button, LoadingOverlay, PrimaryButton } from '@components/ui';
import LottieView from 'lottie-react-native';
import { useAuth } from '@/store';
import { useEnergy, useUserData } from '@/hooks/queries';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { hapticSuccess, hapticError, hapticLight } from '@/utils/haptics';
import * as Haptics from 'expo-haptics';
import { GameQuestion, GameType } from '@/types/game.types';
import { useGameCompletion, useGameAudio, useGameTimer } from '@/hooks';
import { GAME_UI_CONFIG } from '@constants/game';
import { logger } from '@/lib/logger';
import { getFeedbackPath, getCompletionFeedbackPath, FeedbackMessage } from '@/constants/feedbackMessages';
import { getXPProgress, formatXP } from '@/lib/utils/levelCalculations';
import * as Network from 'expo-network';
import { Clock, CheckCircle } from 'phosphor-react-native';

interface GameScreenProps {
    lessonId: string;
    gameType: GameType;
    questions: GameQuestion[];
    timerDuration?: number;
    hasLatinToggle?: boolean;
    onComplete?: () => void;
    source?: 'lesson' | 'test'; // Track where the game was started from
    title?: string;
}

export function GameScreen({
    lessonId,
    gameType,
    questions,
    timerDuration = 10,
    hasLatinToggle = false,
    onComplete,
    source = 'lesson', // Default to lesson for backward compatibility
    title = 'Test'
}: GameScreenProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const { user } = useAuth();
    const { themeVersion } = useTheme();
    const { completeGame, isSubmitting } = useGameCompletion();
    const navigation = useNavigation();

    // Get energy and user data from React Query
    const { data: energyData } = useEnergy(user?.id);
    const { data: userData } = useUserData(user?.id);
    const currentLives = energyData?.current_energy ?? 6;
    const maxLives = energyData?.max_energy ?? 6;
    const totalXP = userData?.total_xp ?? 0;

    // Disable gestures and hardware back button
    useEffect(() => {
        // Disable swipe back gesture (iOS/Android)
        navigation.setOptions({
            gestureEnabled: false,
            // Also disable the header back button just in case (though we hide header)
            headerLeft: () => null,
        });

        // Disable hardware back button (Android)
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            // Return true to prevent default behavior (exit)
            return true;
        });

        return () => backHandler.remove();
    }, [navigation]);

    // Use extracted audio hook
    const { playFeedbackSound, playCompletionSound, playLetterAudio, stopCurrentSound } = useGameAudio(gameType);

    // Use extracted timer hook
    const { startTimeRef, durationString, isTimeUp, setIsTimeUp, resetTimer, calculateDuration } = useGameTimer();

    const isTest = source === 'test';
    // Wait for both countdown AND data to load before starting test
    const [isCountdownComplete, setIsCountdownComplete] = useState(false);
    const isDataReady = totalXP >= 0 && userData !== undefined; // Data is loaded when userData exists
    const isStarting = isTest && (!isCountdownComplete || !isDataReady);

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [isGameComplete, setIsGameComplete] = useState(false);

    // 🔐 Auto-save: XP snapshot at test start (prevents store update from affecting XP bar)
    const initialTotalXPRef = useRef<number>(totalXP);
    const hasInitializedXPRef = useRef<boolean>(false);

    // Update ref when React Query data first loads (before game starts)
    useEffect(() => {
        if (!hasInitializedXPRef.current && totalXP > 0) {
            initialTotalXPRef.current = totalXP;
            hasInitializedXPRef.current = true;
        }
    }, [totalXP]);

    // 🔐 Auto-save: Track save status for UI and retry logic
    const [hasSaved, setHasSaved] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showLatin, setShowLatin] = useState(false);

    // ⏳ Cooldown for Rate Limiting
    const [cooldownSeconds, setCooldownSeconds] = useState(0);

    // Countdown effect for cooldown
    useEffect(() => {
        if (cooldownSeconds > 0) {
            const timer = setInterval(() => {
                setCooldownSeconds((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [cooldownSeconds]);

    // XP bar animation
    const animatedXPWidth = useSharedValue(0);
    const [xpBarInitialized, setXpBarInitialized] = useState(false);

    // Feedback Message State
    const [feedbackMessage, setFeedbackMessage] = useState<FeedbackMessage | null>(null);
    const [completionMessage, setCompletionMessage] = useState<FeedbackMessage | null>(null);

    const currentQuestion = questions[currentQuestionIndex];
    const styles = useMemo(() => getStyles(), [themeVersion]);

    // Calculate completion feedback when game completes
    useEffect(() => {
        if (isGameComplete) {
            const percentage = questions.length > 0 ? (correctAnswersCount / questions.length) * 100 : 0;
            const feedbackPath = getCompletionFeedbackPath(percentage);
            const messages = t(feedbackPath, { returnObjects: true }) as FeedbackMessage[];

            if (Array.isArray(messages) && messages.length > 0) {
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                setCompletionMessage(randomMessage);
            } else {
                setCompletionMessage({
                    title: t('gameUI.congratulations', "Tebrikler!"),
                    message: t('gameUI.goodJob', "İyi iş çıkardın!")
                });
            }
        }
    }, [isGameComplete, correctAnswersCount, questions.length, t]);

    // Cleanup audio when component unmounts
    useEffect(() => {
        return () => {
            // Release the global audio players when leaving game screen is handled in useGameAudio hook
        };
    }, []);

    // Stop audio when question changes
    useEffect(() => {
        stopCurrentSound();
    }, [currentQuestionIndex, stopCurrentSound]);

    // Check lives on mount
    useEffect(() => {
        // Log game load
        logger.game(`${gameType} game loaded - Using generic GameScreen component`);

        // Start Session (Security) & Countdown Logic
        if (source === 'test') {
            const minDurationPromise = new Promise(resolve => setTimeout(resolve, 3000));
            minDurationPromise.then(() => {
                setIsCountdownComplete(true);
            });
        }
    }, []);

    const handleTimeUp = () => {
        setIsTimeUp(true);
        setIsAnswered(true);
        setIsCorrect(false); // Time up counts as incorrect/missed
        hapticError();
        playFeedbackSound(false); // Play wrong/timeout sound
    };

    const handleAnswer = async (answer: string, timeTaken: number) => {
        if (isAnswered) return;

        setSelectedOption(answer);
        const correct = hasLatinToggle && showLatin
            ? answer === currentQuestion.correctAnswerLatin
            : answer === currentQuestion.correctAnswer;

        setIsCorrect(correct);
        setIsAnswered(true);

        // Calculate success percentage including this question
        const currentCorrectCount = correct ? correctAnswersCount + 1 : correctAnswersCount;
        const currentQuestionCount = currentQuestionIndex + 1;
        const percentage = (currentCorrectCount / currentQuestionCount) * 100;

        // Get feedback path and select random message from translations
        const feedbackPath = getFeedbackPath(percentage, correct);
        const messages = t(feedbackPath, { returnObjects: true }) as FeedbackMessage[];

        if (Array.isArray(messages) && messages.length > 0) {
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            setFeedbackMessage(randomMessage);
        } else {
            // Fallback
            setFeedbackMessage({
                title: correct ? t('gameUI.congratulations') : t('gameUI.wrongAnswer', "Yanlış Cevap"),
                message: correct ? t('gameUI.goodJob') : t('gameUI.tryAgain', "Bir sonraki soruya geçelim!")
            });
        }

        if (correct) {
            hapticSuccess();
            setCorrectAnswersCount((prev) => prev + 1);
            playFeedbackSound(true);
        } else {
            hapticError();
            playFeedbackSound(false);
        }
    };

    const handleNext = () => {
        hapticLight();
        setIsAnswered(false);
        setSelectedOption(null);
        setIsCorrect(null);
        setIsTimeUp(false); // Reset time up state

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Calculate Duration when game ends
            calculateDuration();
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
        resetTimer();
    };

    // Ref to prevent double submission (more reliable than state for rapid taps)
    const isSubmittingRef = useRef(false);
    // 🔐 Track if we've already attempted to save (prevents auto-retry loops)
    const hasAttemptedSaveRef = useRef(false);

    // 🔐 handleComplete - exits immediately, save continues in background
    const handleComplete = () => {
        hapticLight();
        handleExit();
    };

    // Manual Retry Button Handler
    const handleManualRetrySave = () => {
        hapticLight();
        saveGameResult();
    };

    // 🔐 AUTO-SAVE: Automatically save result when game completes (isGameComplete becomes true)
    useEffect(() => {
        if (!isGameComplete || hasAttemptedSaveRef.current) return;
        saveGameResult();
    }, [isGameComplete]);

    const saveGameResult = async () => {
        // Lock immediately
        isSubmittingRef.current = true;
        hasAttemptedSaveRef.current = true;

        // 🛡️ NETWORK CHECK (Offline Protection)
        try {
            const networkState = await Network.getNetworkStateAsync();
            if (!networkState.isConnected) {
                isSubmittingRef.current = false;
                hasAttemptedSaveRef.current = false; // Allow retry
                Alert.alert(
                    t('errors.offlineTitle', 'Bağlantı Yok'),
                    t('errors.offlineMessage', 'İnternet bağlantısı yok. Sonucunuz kaydedilemedi.'),
                    [
                        { text: t('common.cancel', 'Vazgeç'), style: 'cancel' },
                        { text: t('common.retry', 'Tekrar Dene'), onPress: () => saveGameResult() }
                    ]
                );
                return;
            }
        } catch (netError) {
            console.warn("Network check verification failed:", netError);
        }

        // Calculate Duration for API
        const durationSeconds = calculateDuration();

        try {
            console.log('🔄 Auto-saving game result...');
            const result = await completeGame({
                lessonId,
                gameType,
                correctAnswers: correctAnswersCount,
                totalQuestions: questions.length,
                source,
                duration: durationSeconds,
                timestamp: new Date(Date.now() - (new Date().getTimezoneOffset() * 60000)).toISOString()
            });

            if (result.success) {
                console.log('✅ Auto-save successful');
                setHasSaved(true);
                if (onComplete) {
                    onComplete();
                }
            } else {
                console.error('❌ Auto-save failed:', result.error);
                isSubmittingRef.current = false;
                hasAttemptedSaveRef.current = false; // Allow retry

                // 🛑 RATE LIMIT HANDLING
                const isRateLimit = result.error?.message?.includes('RATE_LIMITED') ||
                    result.error?.message?.includes('wait') ||
                    (result.error as any)?.code === 'RATE_LIMITED';

                if (isRateLimit) {
                    setCooldownSeconds(10); // Start 10s cooldown
                } else {
                    Alert.alert(
                        t('errors.saveFailedTitle', 'Kayıt Başarısız'),
                        t('errors.saveFailedMessage', 'Sonucunuz kaydedilemedi. Lütfen internet bağlantınızı kontrol edin.'),
                        [
                            { text: t('common.cancel', 'Vazgeç'), style: 'cancel' },
                            { text: t('common.retry', 'Tekrar Dene'), onPress: () => saveGameResult() }
                        ]
                    );
                }
            }
        } catch (error: any) {
            console.error('❌ Auto-save error:', error);
            isSubmittingRef.current = false;
            hasAttemptedSaveRef.current = false; // Allow retry

            // 🛑 RATE LIMIT HANDLING (Catch Block)
            const isRateLimit = error?.message?.includes('RATE_LIMITED') ||
                error?.message?.includes('wait') ||
                error?.code === 'RATE_LIMITED';

            if (isRateLimit) {
                setCooldownSeconds(10); // Start 10s cooldown
            } else {
                Alert.alert(
                    t('errors.saveFailedTitle', 'Kayıt Başarısız'),
                    t('errors.saveFailedMessage', 'Sonucunuz kaydedilemedi. Lütfen internet bağlantınızı kontrol edin.'),
                    [
                        { text: t('common.cancel', 'Vazgeç'), style: 'cancel' },
                        { text: t('common.retry', 'Tekrar Dene'), onPress: () => saveGameResult() }
                    ]
                );
            }
        }
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

    const handlePlayAudio = () => {
        if (gameType !== 'letters' || !currentQuestion.audioFileId) {
            return;
        }
        hapticLight();
        playLetterAudio(currentQuestion.audioFileId);
    };

    const getOptionState = (option: string) => {
        if (!isAnswered) {
            return selectedOption === option ? 'selected' : 'default';
        }
        const correctAnswer = hasLatinToggle && showLatin
            ? currentQuestion.correctAnswerLatin
            : currentQuestion.correctAnswer;
        if (option === correctAnswer) return 'correct';
        if (isTimeUp) return 'default';
        if (option === selectedOption && !isCorrect) return 'incorrect';
        return 'default';
    };

    // Calculate XP progress for completion screen
    const xpEarned = correctAnswersCount;
    const { currentXPProgress, newXPProgress, leveledUp } = useMemo(() => {
        const snapshotXP = totalXP;
        const current = getXPProgress(snapshotXP);
        const newXP = snapshotXP + xpEarned;
        const newProgress = getXPProgress(newXP);
        const leveled = newProgress.currentLevel > current.currentLevel;
        return {
            currentXPProgress: current,
            newXPProgress: newProgress,
            leveledUp: leveled,
        };
    }, [xpEarned, totalXP]);

    const [showLevelUpModal, setShowLevelUpModal] = useState(false);

    // Track current displayed level for XP bar
    const [displayedLevel, setDisplayedLevel] = useState(1);
    const [displayedXP, setDisplayedXP] = useState(0);
    const [displayedRequiredXP, setDisplayedRequiredXP] = useState(100);

    const updateDisplayedLevel = (level: number, xp: number, requiredXP: number) => {
        setDisplayedLevel(level);
        setDisplayedXP(xp);
        setDisplayedRequiredXP(requiredXP);
    };

    const showLevelUp = () => {
        setShowLevelUpModal(true);
    };

    useEffect(() => {
        if (isGameComplete) {
            const timer = setTimeout(() => {
                playCompletionSound(leveledUp);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isGameComplete, leveledUp, playCompletionSound]);

    useEffect(() => {
        if (isGameComplete && !xpBarInitialized) {
            animatedXPWidth.value = currentXPProgress.progressPercentage;
            setXpBarInitialized(true);
            setDisplayedLevel(currentXPProgress.currentLevel);
            setDisplayedXP(currentXPProgress.currentLevelXP);
            setDisplayedRequiredXP(currentXPProgress.requiredXP);

            const newLevel = newXPProgress.currentLevel;
            const newXP = newXPProgress.currentLevelXP;
            const newRequired = newXPProgress.requiredXP;
            const newProgress = newXPProgress.progressPercentage;
            const isLeveledUp = leveledUp;

            const timer = setTimeout(() => {
                if (isLeveledUp) {
                    animatedXPWidth.value = withTiming(100, {
                        duration: 400,
                        easing: Easing.out(Easing.quad),
                    }, (finished) => {
                        if (finished) {
                            runOnJS(updateDisplayedLevel)(newLevel, newXP, newRequired);
                            animatedXPWidth.value = 0;
                            animatedXPWidth.value = withTiming(newProgress, {
                                duration: 400,
                                easing: Easing.out(Easing.quad),
                            }, (finished2) => {
                                if (finished2) {
                                    runOnJS(showLevelUp)();
                                }
                            });
                        }
                    });
                } else {
                    animatedXPWidth.value = withTiming(newProgress, {
                        duration: 500,
                        easing: Easing.out(Easing.quad),
                    });
                    runOnJS(updateDisplayedLevel)(newLevel, newXP, newRequired);
                }
            }, 100);
            return () => clearTimeout(timer);
        }
        if (!isGameComplete) {
            setXpBarInitialized(false);
            animatedXPWidth.value = 0;
            setShowLevelUpModal(false);
        }
    }, [isGameComplete]);

    const animatedXPStyle = useAnimatedStyle(() => ({
        width: `${animatedXPWidth.value}%`,
    }));

    if (isGameComplete) {
        return (
            <View style={styles.container}>
                <View style={styles.completeContainer}>
                    <Text style={styles.summaryHeader}>{t('gameUI.summary')}</Text>

                    <View style={{ marginBottom: 4, alignItems: 'center' }}>
                        <LottieView
                            source={require('@assets/images/lottie/Complete.json')}
                            autoPlay
                            loop={false}
                            style={{ width: 300, height: 300 }}
                        />
                    </View>

                    <Text style={styles.completeTitle}>{completionMessage?.title || "Harika İş!"}</Text>
                    <Text style={styles.completeText}>
                        {completionMessage?.message || "Beklenenden çok daha iyisini yaptın."}
                    </Text>

                    <View style={styles.statsCardsRow}>
                        <View style={styles.statsCard}>
                            <Clock size={18} color={colors.primary} weight="fill" style={{ marginBottom: 4 }} />
                            <Text style={styles.statsLabel}>{t('gameUI.totalTime')}</Text>
                            <Text style={styles.statsValue}>{durationString}</Text>
                        </View>
                        <View style={styles.statsCard}>
                            <CheckCircle size={18} color={colors.success} weight="fill" style={{ marginBottom: 4 }} />
                            <Text style={styles.statsValue}>{correctAnswersCount}/{questions.length}</Text>
                            <Text style={styles.statsLabel}>{t('gameUI.correct')}</Text>
                        </View>
                    </View>

                    <View style={styles.xpBarContainer}>
                        <Text style={styles.xpBarLabel}>
                            {xpEarned > 0
                                ? t('gameUI.levelWithXP', { level: displayedLevel, xp: xpEarned })
                                : `${t('gameUI.level')} ${displayedLevel}`
                            }
                        </Text>
                        <View style={styles.xpBarBackground}>
                            <Animated.View style={[styles.xpBarFill, animatedXPStyle]} />
                            <View style={styles.xpBarTextContainer}>
                                <Text style={styles.xpBarText}>
                                    {formatXP(displayedXP)} / {formatXP(displayedRequiredXP)} XP
                                </Text>
                            </View>
                        </View>
                    </View>

                    {isSubmitting ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
                            <ActivityIndicator size="small" color={colors.primary} style={{ marginRight: 8 }} />
                            <Text style={styles.statsLabel}>{t('common.saving', 'Kaydediliyor...')}</Text>
                        </View>
                    ) : !hasSaved ? (
                        <View style={{ gap: 12, width: '100%' }}>
                            {cooldownSeconds > 0 ? (
                                <View style={{
                                    width: '100%',
                                    padding: 16,
                                    backgroundColor: colors.surfaceLight,
                                    borderRadius: 12,
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: colors.border
                                }}>
                                    <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 4 }}>
                                        {t('errors.rateLimitWait', 'Çok hızlı gittin! Puanlar hesaplanıyor...')}
                                    </Text>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.primary }}>
                                        ⏳ {cooldownSeconds}s
                                    </Text>
                                </View>
                            ) : (
                                <PrimaryButton
                                    title={t('common.retrySave', 'Tekrar Kaydet ↻')}
                                    onPress={handleManualRetrySave}
                                    style={{ width: '100%', backgroundColor: colors.success, borderBottomColor: colors.successDark }}
                                />
                            )}

                        </View>
                    ) : (
                        <PrimaryButton
                            title={t('common.finish')}
                            onPress={handleComplete}
                            style={{ width: '100%', backgroundColor: colors.success, borderBottomColor: colors.successDark }}
                        />
                    )}
                </View>

                {showLevelUpModal && leveledUp && (
                    <Modal
                        visible={true}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setShowLevelUpModal(false)}
                    >
                        <Pressable
                            style={styles.modalOverlay}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                setShowLevelUpModal(false);
                            }}
                        >
                            <Pressable
                                style={styles.levelUpModal}
                                onPress={(e) => e.stopPropagation()}
                            >
                                <Text style={styles.levelUpEmoji}>🎉</Text>
                                <Text style={styles.levelUpTitle}>{t('gameUI.congratulations')}</Text>
                                <Text style={styles.levelUpMessage}>
                                    {t('gameUI.levelReached', { level: newXPProgress.currentLevel })}
                                </Text>
                                <Pressable
                                    style={styles.levelUpButton}
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                        setShowLevelUpModal(false);
                                    }}
                                >
                                    <Text style={styles.levelUpButtonText}>{t('common.ok')}</Text>
                                </Pressable>
                            </Pressable>
                        </Pressable>
                    </Modal>
                )}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={handleExit}>
                    <Text style={styles.backButton}>✕</Text>
                </Pressable>
                <LifeIndicator currentLives={currentLives} maxLives={maxLives} />
            </View>

            <Timer
                key={currentQuestionIndex}
                duration={timerDuration}
                onTimeUp={handleTimeUp}
                isActive={!isAnswered && !isStarting}
            />

            <View style={styles.content}>
                <View style={styles.questionContainer}>
                    <QuestionCard
                        questionNumber={currentQuestionIndex + 1}
                        totalQuestions={questions.length}
                        question={getCurrentQuestion()}
                        onPlayAudio={gameType === 'letters' && currentQuestion.audioFileId ? handlePlayAudio : undefined}
                    />
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

                <View style={{ flex: 1 }} />
            </View>

            {isAnswered && (
                <View style={styles.footer}>
                    {isCorrect ? (
                        <>
                            <Text style={styles.footerTitle}>{feedbackMessage?.title || "Tebrikler!"}</Text>
                            <Text style={styles.footerMessage}>{feedbackMessage?.message || "Bravo, böyle devam et!"}</Text>
                        </>
                    ) : isTimeUp ? (
                        <>
                            <Text style={styles.footerTitle}>Süre Doldu</Text>
                            <Text style={styles.footerMessage}>Doğru cevap yukarıda işaretlendi.</Text>
                        </>
                    ) : (
                        <>
                            <Text style={styles.footerTitle}>{feedbackMessage?.title || "Yanlış Cevap"}</Text>
                            <Text style={styles.footerMessage}>{feedbackMessage?.message || "Bir sonraki soruya geçelim!"}</Text>
                        </>
                    )}
                    <PrimaryButton
                        title={currentQuestionIndex < questions.length - 1
                            ? t('common.nextQuestion')
                            : t('common.finish')}
                        onPress={handleNext}
                        style={[
                            { backgroundColor: colors.success, marginHorizontal: 20, borderBottomColor: colors.successDark },
                            !isCorrect && { backgroundColor: colors.error, borderBottomColor: colors.errorDark }
                        ]}
                    />
                </View>
            )}

            <LoadingOverlay visible={isSubmitting} message={t('common.saving', 'Kaydediliyor...')} />
            <TestPreparationOverlay
                visible={isStarting}
                title={title}
                questionCount={questions.length}
                duration={timerDuration}
            />
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
            width: '100%',
            marginTop: 10,
            marginBottom: 0,
        },
        toggleButton: {
            marginTop: 8,
            alignSelf: 'center',
        },
        options: {
            marginTop: 10,
            gap: 10,
        },
        footer: {
            width: '100%',
            padding: 16,
            paddingTop: 24,
            paddingBottom: 24,
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            zIndex: 10,
        },
        footerTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textPrimary,
            textAlign: 'center',
            marginBottom: 4,
        },
        footerMessage: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.textPrimary,
            textAlign: 'center',
            marginBottom: 12,
        },
        completeContainer: {
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            paddingTop: 90,
            paddingBottom: 60,
        },
        summaryHeader: {
            position: 'absolute',
            top: 10,
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.textPrimary,
            letterSpacing: 2,
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
            marginBottom: 30,
            textAlign: 'center',
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
        statsCardsRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 12,
            marginTop: 16,
            marginBottom: 20,
        },
        statsCard: {
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: colors.surface,
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.border,
            minWidth: 120,
        },
        statsLabel: {
            fontSize: 12,
            color: colors.textSecondary,
            fontWeight: '500',
            marginTop: 2,
        },
        statsValue: {
            fontSize: 18,
            color: colors.textPrimary,
            fontWeight: 'bold',
        },
        motivationContainer: {
            backgroundColor: colors.surface,
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 20,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
            width: '100%',
        },
        xpBarContainer: {
            width: '100%',
            marginBottom: 20,
            paddingHorizontal: 20,
        },
        xpBarBackground: {
            height: 40,
            backgroundColor: colors.surface,
            borderRadius: 20,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: colors.border,
            position: 'relative',
            justifyContent: 'center',
        },
        xpBarFill: {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            backgroundColor: colors.xpGold,
            borderRadius: 18,
        },
        xpBarTextContainer: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
        },
        xpBarText: {
            fontSize: 14,
            fontWeight: 'bold',
            color: colors.textPrimary,
        },
        xpBarLabel: {
            fontSize: 14,
            color: colors.primary,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 8,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        levelUpModal: {
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 32,
            alignItems: 'center',
            width: '85%',
            maxWidth: 400,
            borderBottomWidth: 6,
            borderBottomColor: colors.primary,
        },
        levelUpEmoji: {
            fontSize: 64,
            marginBottom: 16,
        },
        levelUpTitle: {
            fontSize: 28,
            fontWeight: 'bold',
            color: colors.textPrimary,
            marginBottom: 12,
            textAlign: 'center',
        },
        levelUpMessage: {
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: 24,
            lineHeight: 24,
        },
        levelUpButton: {
            backgroundColor: colors.primary,
            paddingVertical: 14,
            paddingHorizontal: 32,
            borderRadius: 12,
            borderBottomWidth: 4,
            borderBottomColor: colors.buttonOrangeBorder,
            minWidth: 120,
        },
        levelUpButtonText: {
            color: colors.textOnPrimary,
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
        },
    });
