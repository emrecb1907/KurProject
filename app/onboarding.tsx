import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    useColorScheme,
    StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    interpolate,
    Extrapolation,
    useAnimatedScrollHandler,
    runOnJS,
    interpolateColor,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight, Check } from 'phosphor-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        id: 1,
        animation: require('../assets/images/onboarding/Quran.json'),
        title: 'Temiz bir başlangıç. Kur’an öğrenmeye ilk adım.',
        description: 'Modern ve anlaşılır Kur’an dersleri seni bekliyor.',
        color: '#FFC800', // App Theme Yellow
        accent: '#FFD700', // Gold
    },
    {
        id: 2,
        animation: require('../assets/images/onboarding/QuranChild.json'),
        title: 'Eğlenceli öğrenme. Çocuklar için bile kolaylaştırılmış sistem.',
        description: 'Her ders sonrası testler, XP puanı, level atlama.',
        color: '#D97706', // Warm Orange
        accent: '#FEF3C7', // Soft Yellow
    },
    {
        id: 3,
        animation: require('../assets/images/onboarding/QuranLearn.json'),
        title: 'Birlikte öğrenme. Aile ile öğrenme kültürünü destekleyen yapı.',
        description: 'Gelişimini izle, seviyeni yükselt ve liderlik sıralamasına gir.',
        color: '#58CC02', // App Theme Green
        accent: '#D1FAE5', // Mint
    },
];

const OnboardingScreen = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const scrollX = useSharedValue(0);
    const flatListRef = useRef<Animated.FlatList<any>>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const lottieRef = useRef<LottieView>(null);

    // Reset animation on slide change
    useEffect(() => {
        if (lottieRef.current) {
            lottieRef.current.reset();
            lottieRef.current.play();
        }
    }, [currentIndex]);

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

    const handleNext = async () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        } else {
            // Mark onboarding as seen
            await AsyncStorage.setItem('hasSeenOnboarding', 'true');
            router.replace('/(tabs)');
        }
    };

    const handleSkip = async () => {
        // Mark onboarding as seen
        await AsyncStorage.setItem('hasSeenOnboarding', 'true');
        router.replace('/(tabs)');
    };

    const SlideItem = ({ item, index }: { item: typeof SLIDES[0]; index: number }) => {
        const animatedStyle = useAnimatedStyle(() => {
            const inputRange = [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
            ];

            const scale = interpolate(
                scrollX.value,
                inputRange,
                [0.9, 1, 0.9],
                Extrapolation.CLAMP
            );

            const opacity = interpolate(
                scrollX.value,
                inputRange,
                [0, 1, 0],
                Extrapolation.CLAMP
            );

            const translateY = interpolate(
                scrollX.value,
                inputRange,
                [50, 0, 50],
                Extrapolation.CLAMP
            );

            return {
                transform: [{ scale }, { translateY }],
                opacity,
            };
        });

        const textAnimatedStyle = useAnimatedStyle(() => {
            const inputRange = [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
            ];

            const translateY = interpolate(
                scrollX.value,
                inputRange,
                [-50, 0, -50],
                Extrapolation.CLAMP
            );

            const opacity = interpolate(
                scrollX.value,
                inputRange,
                [0, 1, 0],
                Extrapolation.CLAMP
            );

            return {
                transform: [{ translateY }],
                opacity,
            };
        });

        return (
            <View style={[styles.slide, { width }]}>
                <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
                    <Text style={[
                        styles.title,
                        { color: isDark ? '#F3F4F6' : '#1F2937' }
                    ]}>
                        {item.title}
                    </Text>
                    <Text style={[
                        styles.description,
                        { color: isDark ? '#9CA3AF' : '#4B5563' }
                    ]}>
                        {item.description}
                    </Text>
                </Animated.View>

                <Animated.View style={[styles.animationContainer, animatedStyle]}>
                    <LottieView
                        ref={index === currentIndex ? lottieRef : null}
                        source={item.animation}
                        autoPlay={index === currentIndex}
                        loop={true}
                        style={styles.lottie}
                        resizeMode="contain"
                    />
                </Animated.View>
            </View>
        );
    };

    const Pagination = () => {
        return (
            <View style={styles.paginationContainer}>
                {SLIDES.map((_, index) => {
                    const animatedDotStyle = useAnimatedStyle(() => {
                        const inputRange = [
                            (index - 1) * width,
                            index * width,
                            (index + 1) * width,
                        ];

                        const widthAnim = interpolate(
                            scrollX.value,
                            inputRange,
                            [8, 24, 8],
                            Extrapolation.CLAMP
                        );

                        const opacity = interpolate(
                            scrollX.value,
                            inputRange,
                            [0.5, 1, 0.5],
                            Extrapolation.CLAMP
                        );

                        const backgroundColor = interpolateColor(
                            scrollX.value,
                            SLIDES.map((_, i) => i * width),
                            SLIDES.map(s => s.color)
                        );

                        return {
                            width: widthAnim,
                            opacity,
                            backgroundColor: index === currentIndex ? backgroundColor : (isDark ? '#4B5563' : '#D1D5DB'),
                        };
                    });

                    return (
                        <Animated.View
                            key={index}
                            style={[
                                styles.dot,
                                animatedDotStyle,
                            ]}
                        />
                    );
                })}
            </View>
        );
    };

    const buttonAnimatedStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            scrollX.value,
            SLIDES.map((_, i) => i * width),
            SLIDES.map(s => s.color)
        );
        return { backgroundColor };
    });

    return (
        <SafeAreaView style={[
            styles.container,
            { backgroundColor: isDark ? '#111827' : '#F9FAFB' }
        ]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={styles.header}>
                <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                    <Text style={[styles.skipText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                        Geç
                    </Text>
                </TouchableOpacity>
            </View>

            <Animated.FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={({ item, index }) => <SlideItem item={item} index={index} />}
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
                <Pagination />

                <TouchableOpacity
                    onPress={handleNext}
                >
                    <Animated.View style={[styles.button, buttonAnimatedStyle]}>
                        <Text style={styles.buttonText}>
                            {currentIndex === SLIDES.length - 1 ? 'Haydi Başla' : 'Devam Et'}
                        </Text>
                        {currentIndex === SLIDES.length - 1 ? (
                            <Check size={20} color="#FFF" weight="bold" />
                        ) : (
                            <ArrowRight size={20} color="#FFF" weight="bold" />
                        )}
                    </Animated.View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    skipButton: {
        padding: 10,
    },
    skipText: {
        fontSize: 16,
        fontWeight: '600',
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    animationContainer: {
        width: width * 0.9,
        height: width * 0.9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 40,
        letterSpacing: -0.5,
    },
    description: {
        fontSize: 17,
        textAlign: 'center',
        lineHeight: 24,
        fontWeight: '400',
        letterSpacing: -0.2,
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paginationContainer: {
        flexDirection: 'row',
        height: 10,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '600',
        marginRight: 8,
    },
});

export default OnboardingScreen;
