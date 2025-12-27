import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Animated as RNAnimated,
    useColorScheme,
    Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    interpolate,
    interpolateColor,
    Extrapolation,
    SharedValue,
} from 'react-native-reanimated';
import { Lightning, ArrowRight, Warning, X } from 'phosphor-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore, useUser } from '@/store';
import { QuestionCard } from '@/components/game/QuestionCard';
import { OptionButton } from '@/components/game/OptionButton';
import { colors } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

// --- DATA ---
const SLIDES = [
    {
        id: 1,
        animation: require('../assets/images/onboarding/Quran.json'),
        titleKey: 'onboarding.slides.slide1.title',
        descriptionKey: 'onboarding.slides.slide1.description',
    },
    {
        id: 2,
        animation: require('../assets/images/onboarding/QuranChild.json'),
        titleKey: 'onboarding.slides.slide2.title',
        descriptionKey: 'onboarding.slides.slide2.description',
    },
    {
        id: 3,
        animation: require('../assets/images/onboarding/QuranLearn.json'),
        titleKey: 'onboarding.slides.slide3.title',
        descriptionKey: 'onboarding.slides.slide3.description',
    },
    {
        id: 4,
        isStartScreen: true,
    }
];

const QUESTIONS = [
    {
        questionKey: "onboarding.quiz.questions.q1",
        options: ["10", "20", "30", "40"],
        correctIndex: 2 // 30
    },
    {
        questionKey: "onboarding.quiz.questions.q2",
        options: ["Fatiha", "Alak", "Bakara", "Yasin"],
        correctIndex: 1 // Alak
    },
    {
        questionKey: "onboarding.quiz.questions.q3",
        options: ["Yasin", "Rahman", "Mülk", "Nebe"],
        correctIndex: 0 // Yasin
    },
    {
        questionKey: "onboarding.quiz.questions.q4",
        options: ["Ali İmran", "Bakara", "Nisa", "Maide"],
        correctIndex: 1 // Bakara
    },
    {
        questionKey: "onboarding.quiz.questions.q5",
        options: ["Tevbe", "Enfal", "Mücadele", "Talak"],
        correctIndex: 0 // Tevbe
    }
];

const PaginationDot = ({ index, scrollX }: { index: number, scrollX: SharedValue<number> }) => {
    // colors is imported globally, so no need for useTheme specifically for colors unless triggering re-render.
    // However, global 'colors' object is a proxy that reflects current theme.
    // If theme changes, we want this component to re-render.
    const { activeTheme } = useTheme(); // Keep for re-render on theme change

    // Resolve colors on JS thread to ensure they are strings for the Worklet
    // Reanimated worklets (UI thread) might not handle Proxies correctly.
    const primaryColor = colors.primary;
    const borderColor = colors.border;

    const animatedStyle = useAnimatedStyle(() => {
        const widthAnim = interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [8, 24, 8],
            Extrapolation.CLAMP
        );

        const colorAnim = interpolateColor(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [borderColor, primaryColor, borderColor]
        );

        return {
            width: widthAnim,
            backgroundColor: colorAnim
        };
    });

    return <Animated.View style={[styles.dot, animatedStyle]} />;
};

export default function OnboardingScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { activeTheme } = useTheme();
    const colorScheme = useColorScheme();
    const isDark = activeTheme === 'dark';
    const scrollX = useSharedValue(0);
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewState, setViewState] = useState<'SLIDES' | 'QUIZ' | 'RESULT'>('SLIDES');

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizScore, setQuizScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    // Modal State
    const [showSkipModal, setShowSkipModal] = useState(false);

    const { signInAnonymously, isAuthenticated, isProfileReady } = useStore();

    // 1. Immediate Anonymous Auth
    useEffect(() => {
        const initAuth = async () => {
            if (!isAuthenticated) {
                console.log('👻 Starting anonymous session...');
                await signInAnonymously();
            }
        };
        initAuth();
    }, []);

    // Scroll Handler
    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    // --- LOGIC ---

    const handleNextSlide = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        }
    };

    const handleStartTest = () => {
        setViewState('QUIZ');
    };

    const handleOptionSelect = (index: number) => {
        if (isAnswered) return;

        setSelectedOption(index);
        const correct = index === QUESTIONS[currentQuestionIndex].correctIndex;
        setIsAnswerCorrect(correct);
        setIsAnswered(true);

        if (correct) {
            setQuizScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = async () => {
        if (currentQuestionIndex < QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setIsAnswered(false);
            setSelectedOption(null);
            setIsAnswerCorrect(null);
        } else {
            setViewState('RESULT');
            await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        }
    };

    const handleContinueAnonymous = async () => {
        setShowSkipModal(false);
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        router.replace('/(tabs)');
    };

    const handleLogin = async () => {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        router.push('/(auth)/login');
    };

    const handleSignup = async () => {
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        router.push('/(auth)/register');
    };

    const getOptionState = (index: number) => {
        if (!isAnswered) {
            return selectedOption === index ? 'selected' : 'default';
        }

        const correctIndex = QUESTIONS[currentQuestionIndex].correctIndex;

        if (index === correctIndex) {
            return 'correct';
        }

        if (index === selectedOption && !isAnswerCorrect) {
            return 'incorrect';
        }

        return 'default';
    };


    // --- RENDERS ---

    const renderSlideItem = ({ item, index }: { item: typeof SLIDES[0]; index: number }) => {
        // Special 4th Slide (Start Test Screen)
        if (item.isStartScreen) {
            return (
                <View style={[styles.slide, { width, backgroundColor: colors.background }]}>
                    <View style={styles.startScreenContainer}>
                        <View style={[styles.iconContainer, { borderColor: colors.primary, backgroundColor: colors.primary + '20' }]}>
                            <Lightning size={64} color={colors.primary} weight="fill" />
                        </View>

                        <Text style={[styles.startTitle, { color: colors.textPrimary }]}>
                            {t('onboarding.startScreen.title')}
                        </Text>

                        <Text style={[styles.startDescription, { color: colors.textSecondary }]}>
                            {t('onboarding.startScreen.description')}
                        </Text>

                        <View style={{ height: 40 }} />

                        <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={handleStartTest}>
                            <Text style={styles.primaryButtonText}>{t('onboarding.startScreen.startButton')}</Text>
                        </TouchableOpacity>

                        <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
                            {t('onboarding.startScreen.disclaimer')}
                        </Text>
                    </View>
                </View>
            );
        }

        // Standard Slides
        return (
            <View style={[styles.slide, { width }]}>
                <View style={styles.animationContainer}>
                    <LottieView
                        source={item.animation}
                        autoPlay
                        loop
                        style={styles.lottie}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>{t(item.titleKey || '')}</Text>
                    <Text style={[styles.description, { color: colors.textSecondary }]}>{t(item.descriptionKey || '')}</Text>
                </View>
            </View>
        );
    };

    const renderPagination = () => {
        // Show dots for all slides including Start Screen
        return (
            <View style={styles.paginationContainer}>
                {SLIDES.map((_, index) => (
                    <PaginationDot
                        key={index}
                        index={index}
                        scrollX={scrollX}
                    />
                ))}
            </View>
        );
    };

    // --- QUIZ VIEW ---
    if (viewState === 'QUIZ') {
        const question = QUESTIONS[currentQuestionIndex];
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                {/* Simplified Header for Onboarding - Removed Progress Bar to match GameScreen */}
                <View style={styles.quizHeader}>
                    {/* Empty header or close button if needed, but removing duplicate bar */}
                </View>

                <View style={styles.quizContent}>
                    <View style={styles.questionContainer}>
                        <QuestionCard
                            questionNumber={currentQuestionIndex + 1}
                            totalQuestions={QUESTIONS.length}
                            question={t(question.questionKey)}
                        />
                    </View>

                    <View style={styles.options}>
                        {question.options.map((option, idx) => (
                            <OptionButton
                                key={idx}
                                option={option}
                                state={getOptionState(idx)}
                                onPress={() => handleOptionSelect(idx)}
                                disabled={isAnswered}
                            />
                        ))}
                    </View>
                    <View style={{ flex: 1 }} />
                </View>

                {/* Feedback Footer */}
                {isAnswered && (
                    <View style={styles.quizFooter}>
                        {isAnswerCorrect ? (
                            <>
                                <Text style={styles.footerTitle}>{t('onboarding.quiz.feedback.correct')}</Text>
                                <Text style={styles.footerMessage}>{t('onboarding.quiz.feedback.correctMessage')}</Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.footerTitle}>{t('onboarding.quiz.feedback.incorrect')}</Text>
                                <Text style={styles.footerMessage}>{t('onboarding.quiz.feedback.incorrectMessage')}</Text>
                            </>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.quizNextButton,
                                !isAnswerCorrect && styles.nextButtonError
                            ]}
                            onPress={handleNextQuestion}
                        >
                            <Text style={styles.nextButtonText}>
                                {currentQuestionIndex < QUESTIONS.length - 1 ? t('onboarding.quiz.nextQuestion') : t('onboarding.quiz.finish')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>
        );
    }

    // --- RESULT VIEW ---
    if (viewState === 'RESULT') {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.resultContainer}>
                    <Text style={[styles.resultTitle, { color: colors.textPrimary }]}>{t('onboarding.result.title')}</Text>
                    <Text style={[styles.resultSubtitle, { color: colors.textSecondary }]}>{t('onboarding.result.subtitle')}</Text>

                    <View style={styles.scoreCircle}>
                        <View style={styles.scoreInner}>
                            <Text style={[styles.scoreText, { color: colors.textPrimary }]}>{quizScore}/{QUESTIONS.length}</Text>
                            <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>{t('onboarding.result.correct')}</Text>
                        </View>
                        {/* Simple SVG ring mockup with border since we don't have SVG lib imported handy */}
                        <View style={[styles.scoreRing, {
                            borderBottomColor: quizScore > 2 ? colors.primary : colors.border,
                            borderLeftColor: quizScore > 3 ? colors.primary : colors.border,
                            borderColor: colors.border // Base border
                        }]} />
                    </View>

                    <Text style={[styles.xpText, { color: colors.xpGold }]}>+{quizScore * 5} XP</Text>
                    <View style={[styles.xpBarBg, { backgroundColor: colors.surface }]}>
                        <View style={{ width: '50%', height: '100%', backgroundColor: colors.primary, borderRadius: 4 }} />
                    </View>

                    <View style={{ flex: 1 }} />

                    <Text style={styles.authPromptText}>
                        {t('onboarding.result.authPrompt')}
                    </Text>

                    <TouchableOpacity style={[styles.loginButton, { borderColor: colors.textSecondary }]} onPress={handleLogin}>
                        <Text style={[styles.loginButtonText, { color: colors.textPrimary }]}>{t('onboarding.result.loginButton')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={handleSignup}>
                        <Text style={styles.primaryButtonText}>{t('onboarding.result.signupButton')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.textButton, !isProfileReady && { opacity: 0.5 }]}
                        onPress={() => setShowSkipModal(true)}
                        disabled={!isProfileReady}
                    >
                        <Text style={[styles.textButtonText, { color: colors.textSecondary }]}>
                            {isProfileReady ? t('onboarding.result.skipButton') : t('onboarding.result.loadingProfile')}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* WARNING MODAL */}
                <Modal
                    visible={showSkipModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowSkipModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                            <View style={[styles.modalIconBg, { backgroundColor: colors.primary + '20' }]}>
                                <Warning size={32} color={colors.primary} weight="fill" />
                            </View>
                            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{t('onboarding.skipModal.title')}</Text>
                            <Text style={[styles.modalText, { color: colors.textSecondary }]}>
                                {t('onboarding.skipModal.message')}
                            </Text>

                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={styles.modalSecondaryButton}
                                    onPress={() => setShowSkipModal(false)}
                                >
                                    <Text style={[styles.modalSecondaryText, { color: colors.textSecondary }]}>{t('onboarding.skipModal.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalPrimaryButton, { backgroundColor: colors.primary }]}
                                    onPress={handleContinueAnonymous}
                                >
                                    <Text style={styles.modalPrimaryText}>{t('onboarding.skipModal.confirm')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        );
    }

    // --- SLIDES VIEW ---
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'} />

            {/* Skip Button (Only on regular slides) */}
            {currentIndex < 3 && (
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => flatListRef.current?.scrollToIndex({ index: 3 })}>
                        <Text style={[styles.skipText, { color: colors.textSecondary }]}>{t('onboarding.skip')}</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Animated.FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={renderSlideItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            />

            <View style={styles.footer}>
                {renderPagination()}

                {currentIndex < 3 && (
                    <TouchableOpacity onPress={handleNextSlide}>
                        <View style={[styles.slideNextButton, { backgroundColor: colors.primary }]}>
                            <ArrowRight size={24} color="#FFF" />
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Standard Slide Styles
    animationContainer: {
        width: width * 0.8,
        height: width * 0.8,
        marginBottom: 40,
    },
    lottie: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 24,
    },
    header: {
        position: 'absolute',
        top: 60,
        right: 20,
        zIndex: 10,
    },
    skipText: {
        color: '#9CA3AF',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 40,
        height: 100,
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
    paginationContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    slideNextButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFC800',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Start Screen Styles
    startScreenContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        width: '100%',
        paddingBottom: 80,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 200, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        borderWidth: 2,
        borderColor: '#FFC800',
    },
    startTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 16,
    },
    startDescription: {
        fontSize: 18,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 28,
    },
    primaryButton: {
        backgroundColor: '#FFC800',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    disclaimerText: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 20,
    },
    // Quiz Styles
    quizHeader: {
        paddingHorizontal: 20,
        paddingTop: 10,
        height: 10, // Minimal height as it's empty now
    },
    quizContent: {
        flex: 1,
        paddingHorizontal: 20,
    },
    questionContainer: {
        marginTop: 10,
    },
    options: {
        gap: 12,
        marginTop: 24, // Doubled distance
    },
    quizFooter: {
        width: '100%',
        // backgroundColor handled inline
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 24,
        borderTopWidth: 1,
        // borderTopColor handled inline
    },
    footerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    footerMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: '600',
    },
    quizNextButton: {
        backgroundColor: '#58CC02',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        borderBottomWidth: 4,
        borderBottomColor: '#059669',
        width: '100%',
    },
    nextButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    nextButtonError: {
        backgroundColor: '#FF4B4B',
        borderBottomColor: '#991B1B',
    },
    // Result Styles
    resultContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 32,
        paddingTop: 60,
    },
    resultTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    resultSubtitle: {
        fontSize: 18,
        color: '#94A3B8',
        marginBottom: 40,
    },
    scoreCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 8,
        borderColor: '#334155',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        position: 'relative',
    },
    scoreRing: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 8,
        borderColor: 'transparent',
        transform: [{ rotate: '-45deg' }],
    },
    scoreInner: {
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFF',
    },
    scoreLabel: {
        fontSize: 14,
        color: '#94A3B8',
        marginTop: 4,
    },
    xpText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFC800',
        marginBottom: 12,
    },
    xpBarBg: {
        width: 200,
        height: 8,
        backgroundColor: '#334155',
        borderRadius: 4,
        marginBottom: 48,
        overflow: 'hidden',
    },
    authPromptText: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    loginButton: {
        paddingVertical: 16,
        width: '100%',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#94A3B8',
        borderRadius: 16,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
    textButton: {
        paddingVertical: 12,
    },
    textButtonText: {
        fontSize: 14,
        color: '#94A3B8',
        textDecorationLine: 'underline',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#1E293B',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
    },
    modalIconBg: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255, 200, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
    },
    modalText: {
        fontSize: 16,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 24,
    },
    modalActions: {
        flexDirection: 'row',
        marginTop: 24,
        gap: 12,
        width: '100%',
    },
    modalSecondaryButton: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalSecondaryText: {
        color: '#94A3B8',
        fontSize: 16,
        fontWeight: '600',
    },
    modalPrimaryButton: {
        flex: 1,
        backgroundColor: '#FFC800',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalPrimaryText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});


