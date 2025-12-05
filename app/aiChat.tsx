import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, Trash, Sparkle } from 'phosphor-react-native';
import { colors } from '@constants/colors';
import { useStatusBar } from '@/hooks/useStatusBar';
import { useTheme } from '@/contexts/ThemeContext';
import { useChatStore } from '@/store/chatStore';
import { sendMessage, ChatMessage } from '@/lib/ai/gemini';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

export default function AIChatScreen() {
    const router = useRouter();
    const { statusBarStyle } = useStatusBar();
    const { activeTheme } = useTheme();
    const { i18n, t } = useTranslation();
    const scrollViewRef = useRef<ScrollView>(null);

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

    // Scroll to bottom when new message arrives
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages.length]);

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

            {/* Messages */}
            <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                keyboardShouldPersistTaps="handled"
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
