import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from '@constants/colors';
import { PaperPlaneRight } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [message, setMessage] = useState('');
    const inputRef = useRef<TextInput>(null);

    // Auto-focus input when component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const handleSend = () => {
        if (message.trim() && !disabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onSend(message.trim());
            setMessage('');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.container}>
                <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
                    <TextInput
                        ref={inputRef}
                        style={[styles.input, { color: colors.textPrimary }]}
                        placeholder="Bir soru sor..."
                        placeholderTextColor={colors.textSecondary}
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        maxLength={500}
                        editable={!disabled}
                        onSubmitEditing={handleSend}
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            { backgroundColor: message.trim() && !disabled ? colors.warning : colors.border }
                        ]}
                        onPress={handleSend}
                        disabled={!message.trim() || disabled}
                    >
                        <PaperPlaneRight
                            size={20}
                            color={message.trim() && !disabled ? '#000' : colors.textSecondary}
                            weight="fill"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    input: {
        flex: 1,
        fontSize: 15,
        maxHeight: 100,
        paddingVertical: 8,
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
});
