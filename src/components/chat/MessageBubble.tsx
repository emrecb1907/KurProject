import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';

interface MessageBubbleProps {
    message: string;
    isUser: boolean;
    timestamp: number;
}

export function MessageBubble({ message, isUser, timestamp }: MessageBubbleProps) {
    const { activeTheme } = useTheme();
    const isDark = activeTheme === 'dark';

    const formatTime = (ts: number) => {
        const date = new Date(ts);
        return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
            <View style={[
                styles.bubble,
                isUser ? styles.userBubble : styles.aiBubble,
                { backgroundColor: isUser ? colors.warning : colors.surface }
            ]}>
                <Text style={[
                    styles.messageText,
                    { color: isUser ? '#000' : colors.textPrimary }
                ]}>
                    {message}
                </Text>
                <Text style={[
                    styles.timestamp,
                    { color: isUser ? 'rgba(0,0,0,0.5)' : colors.textSecondary }
                ]}>
                    {formatTime(timestamp)}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    userContainer: {
        alignItems: 'flex-end',
    },
    aiContainer: {
        alignItems: 'flex-start',
    },
    bubble: {
        maxWidth: '80%',
        borderRadius: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    userBubble: {
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
        marginBottom: 4,
    },
    timestamp: {
        fontSize: 11,
        textAlign: 'right',
    },
});
