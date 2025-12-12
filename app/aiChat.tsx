import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useStatusBar } from '@/hooks/useStatusBar';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, Trash, Sparkle } from 'phosphor-react-native';
import { colors } from '@/constants/colors';
import { StatusBar } from 'expo-status-bar';
import { useChatStore } from '@/store/chatStore';
import { sendMessage, ChatMessage } from '@/lib/ai/gemini';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function AIChatContent() {
    const router = useRouter();
    const { statusBarStyle } = useStatusBar();
    const { activeTheme, themeVersion } = useTheme();
    const { i18n, t } = useTranslation();
    const scrollViewRef = useRef<ScrollView>(null);
    const styles = useMemo(() => getStyles(), [themeVersion]);

    const { messages, isLoading, error, addMessage, setLoading, setError, clearChat } = useChatStore();

    const isDark = activeTheme === 'dark';

    // Scroll to bottom when screen is focused (returning to screen)
    useFocusEffect(
        useCallback(() => {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: false });
            }, 600);
        }, [])
    );

    const scrollToBottom = (animated = true) => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated });
        }
    };

    // Scroll when messages change
    useEffect(() => {
        if (messages.length > 0) {
            // Small delay to ensure content is rendered
            setTimeout(() => scrollToBottom(), 100);
        }
    }, [messages.length]);

    // Scroll to bottom when keyboard opens using Layout detection
    const [listHeight, setListHeight] = useState(0);

    const handleLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        // If height decreased (keyboard opened), or we just want to ensure bottom visibility
        if (listHeight > height && height > 0) {
            setTimeout(() => scrollToBottom(), 100);
        }
        setListHeight(height);
    };

    const handleSendMessage = async (text: string) => {
        // Add user message
        const userMessage: ChatMessage = {
            role: 'user',
            parts: text,
            timestamp: Date.now(),
        };
        addMessage(userMessage);

        // Set loading state
        setLoading(true);
        setError(null);

        // Use scrollToBottom to ensure user sees their own message
        setTimeout(() => scrollToBottom(), 100);

        try {
            // Get AI response with user's language
            const userLanguage = i18n.language || 'tr';
            const response = await sendMessage(text, messages, userLanguage);

            if (response.error) {
                setError(response.error);
            } else if (response.text) {
                const aiMessage: ChatMessage = {
                    role: 'model',
                    parts: response.text,
                    timestamp: Date.now(),
                };
                addMessage(aiMessage);
            }
        } catch (err) {
            setError(t('aiChat.error'));
        } finally {
            setLoading(false);
            // Scroll again after response
            setTimeout(() => scrollToBottom(), 100);
        }
    };

    const handleClearChat = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert(
            t('aiChat.clearChat.title'),
            t('aiChat.clearChat.message'),
            [
                { text: t('aiChat.clearChat.cancel'), style: 'cancel' },
                {
                    text: t('aiChat.clearChat.confirm'),
                    style: 'destructive',
                    onPress: () => {
                        clearChat();
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar style={statusBarStyle} />

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.back();
                    }}
                    style={styles.headerButton}
                >
                    <ArrowLeft size={24} color={colors.textPrimary} weight="bold" />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <View style={styles.headerTitleContainer}>
                        <Sparkle size={20} weight="fill" color={colors.warning} />
                        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                            {t('aiChat.title')}
                        </Text>
                    </View>
                    <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                        {t('aiChat.subtitle')}
                    </Text>
                </View>

                {messages.length > 0 && (
                    <TouchableOpacity
                        onPress={handleClearChat}
                        style={styles.headerButton}
                    >
                        <Trash size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Messages & Input wrapped in KeyboardAvoidingView */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
            >
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    keyboardShouldPersistTaps="always"
                    onContentSizeChange={() => scrollToBottom()}
                    onLayout={handleLayout}
                >
                    {messages.length === 0 && !isLoading && (
                        <View style={styles.emptyState}>
                            <Sparkle size={48} weight="fill" color={colors.warning} />
                            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                                {t('aiChat.welcomeTitle')}
                            </Text>
                            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                                {t('aiChat.welcomeSubtitle')}
                            </Text>
                            <View style={styles.exampleQuestions}>
                                <Text style={[styles.exampleTitle, { color: colors.textSecondary }]}>
                                    {t('aiChat.exampleQuestionsTitle')}
                                </Text>
                                <Text style={[styles.exampleQuestion, { color: colors.textSecondary }]}>
                                    • "{t('aiChat.examples.q1')}"
                                </Text>
                                <Text style={[styles.exampleQuestion, { color: colors.textSecondary }]}>
                                    • "{t('aiChat.examples.q2')}"
                                </Text>
                                <Text style={[styles.exampleQuestion, { color: colors.textSecondary }]}>
                                    • "{t('aiChat.examples.q3')}"
                                </Text>
                            </View>
                        </View>
                    )}

                    {messages.map((msg, index) => (
                        <MessageBubble
                            key={index}
                            message={msg.parts}
                            isUser={msg.role === 'user'}
                            timestamp={msg.timestamp}
                        />
                    ))}

                    {isLoading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color={colors.warning} />
                            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                                {t('aiChat.loading')}
                            </Text>
                        </View>
                    )}

                    {error && (
                        <View style={[styles.errorContainer, { backgroundColor: colors.error + '20' }]}>
                            <Text style={[styles.errorText, { color: colors.error }]}>
                                {error}
                            </Text>
                        </View>
                    )}
                </ScrollView>

                {/* Input */}
                <ChatInput onSend={handleSendMessage} disabled={isLoading} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const getStyles = () => StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        paddingVertical: 16,
        flexGrow: 1,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
    },
    exampleQuestions: {
        alignSelf: 'stretch',
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 12,
        // Ensure no hardcoded shadow or dark border if it was there (it wasn't visibly, but checking)
    },
    exampleTitle: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
    },
    exampleQuestion: {
        fontSize: 13,
        marginVertical: 4,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    loadingText: {
        fontSize: 14,
    },
    errorContainer: {
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 12,
        borderRadius: 8,
    },
    errorText: {
        fontSize: 14,
        textAlign: 'center',
    },
});

// Wrap with ErrorBoundary
export default function AIChatScreen() {
    const router = useRouter();

    return (
        <ErrorBoundary
            fallbackScreen="chat"
            onGoHome={() => router.replace('/')}
        >
            <AIChatContent />
        </ErrorBoundary>
    );
}
