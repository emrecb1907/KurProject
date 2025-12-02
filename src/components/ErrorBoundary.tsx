import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { errorHandler, ErrorSeverity } from '@/lib/errorHandler';
import { colors } from '@/constants/colors';
import { WarningCircle, ArrowClockwise } from 'phosphor-react-native';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        errorHandler.handleError({
            code: 'REACT_RENDER_ERROR',
            message: error.message,
            userMessage: 'Görünüm oluşturulurken bir hata meydana geldi.',
            severity: ErrorSeverity.HIGH,
            originalError: error,
            context: {
                componentStack: errorInfo.componentStack,
            }
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.content}>
                        <WarningCircle size={64} color={colors.error} weight="fill" style={styles.icon} />

                        <Text style={styles.title}>Bir şeyler ters gitti</Text>

                        <Text style={styles.message}>
                            Uygulama beklenmedik bir hatayla karşılaştı. Endişelenmeyin, hatayı kaydettik ve üzerinde çalışacağız.
                        </Text>

                        {__DEV__ && this.state.error && (
                            <View style={styles.debugBox}>
                                <Text style={styles.debugText}>{this.state.error.message}</Text>
                            </View>
                        )}

                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                pressed && styles.buttonPressed
                            ]}
                            onPress={this.handleReset}
                        >
                            <ArrowClockwise size={20} color={colors.textOnPrimary} weight="bold" />
                            <Text style={styles.buttonText}>Tekrar Dene</Text>
                        </Pressable>
                    </View>
                </SafeAreaView>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    icon: {
        marginBottom: 24,
        opacity: 0.9,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textPrimary,
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    debugBox: {
        backgroundColor: colors.surface,
        padding: 12,
        borderRadius: 8,
        marginBottom: 32,
        width: '100%',
        borderWidth: 1,
        borderColor: colors.border,
    },
    debugText: {
        fontSize: 12,
        color: colors.error,
        fontFamily: 'monospace',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 16,
        gap: 8,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    buttonText: {
        color: colors.textOnPrimary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
