import React, { Component, ErrorInfo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowClockwise, Warning, House, WifiSlash, Clock, SpeakerX, Database, Lock } from 'phosphor-react-native';
import { colors } from '@/constants/colors';
import i18n from '@/lib/i18n';

interface Props {
    children: React.ReactNode;
    fallbackScreen?: 'game' | 'lesson' | 'chat' | 'settings' | 'premium';
    onReset?: () => void;
    onGoHome?: () => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorType: ErrorType;
}

type ErrorType = 'generic' | 'network' | 'timeout' | 'audio' | 'data' | 'auth' | 'permission' | 'storage';

// Classify error based on message content
function classifyError(error: Error): ErrorType {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    // Network errors
    if (
        message.includes('network') ||
        message.includes('fetch') ||
        message.includes('failed to fetch') ||
        message.includes('networkerror') ||
        message.includes('no internet') ||
        message.includes('connection')
    ) {
        return 'network';
    }

    // Timeout errors
    if (
        message.includes('timeout') ||
        message.includes('timed out') ||
        message.includes('aborted')
    ) {
        return 'timeout';
    }

    // Audio errors
    if (
        message.includes('audio') ||
        message.includes('sound') ||
        message.includes('playback') ||
        message.includes('media') ||
        name.includes('audio')
    ) {
        return 'audio';
    }

    // Auth errors
    if (
        message.includes('auth') ||
        message.includes('session') ||
        message.includes('token') ||
        message.includes('unauthorized') ||
        message.includes('401')
    ) {
        return 'auth';
    }

    // Permission errors
    if (
        message.includes('permission') ||
        message.includes('denied') ||
        message.includes('not allowed')
    ) {
        return 'permission';
    }

    // Storage errors
    if (
        message.includes('storage') ||
        message.includes('quota') ||
        message.includes('disk')
    ) {
        return 'storage';
    }

    // Data/parsing errors
    if (
        message.includes('undefined') ||
        message.includes('null') ||
        message.includes('parse') ||
        message.includes('json') ||
        message.includes('cannot read')
    ) {
        return 'data';
    }

    return 'generic';
}

// Get icon for error type
function getErrorIcon(errorType: ErrorType) {
    const iconProps = { size: 64, weight: 'fill' as const, style: styles.icon };
    
    switch (errorType) {
        case 'network':
            return <WifiSlash {...iconProps} color={colors.error} />;
        case 'timeout':
            return <Clock {...iconProps} color={colors.warning} />;
        case 'audio':
            return <SpeakerX {...iconProps} color={colors.error} />;
        case 'auth':
            return <Lock {...iconProps} color={colors.warning} />;
        case 'data':
            return <Database {...iconProps} color={colors.error} />;
        default:
            return <Warning {...iconProps} color={colors.error} />;
    }
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorType: 'generic'
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorType: classifyError(error)
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log to console for debugging (in production, send to Sentry/Crashlytics)
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        // TODO: Send to error tracking service
        // Sentry.captureException(error, { extra: errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorType: 'generic' });
        this.props.onReset?.();
    };

    handleGoHome = () => {
        this.setState({ hasError: false, error: null, errorType: 'generic' });
        this.props.onGoHome?.();
    };

    getErrorContent() {
        const { fallbackScreen } = this.props;
        const { errorType } = this.state;

        // Screen-specific error messages take priority
        if (fallbackScreen) {
            return {
                title: i18n.t(`errors.screen.${fallbackScreen}.title`),
                message: i18n.t(`errors.screen.${fallbackScreen}.message`)
            };
        }

        // Otherwise use error type based messages
        return {
            title: i18n.t(`errors.boundary.${errorType}.title`),
            message: i18n.t(`errors.boundary.${errorType}.message`)
        };
    }

    render() {
        if (this.state.hasError) {
            const { title, message } = this.getErrorContent();
            const { onGoHome } = this.props;

            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.content}>
                        {getErrorIcon(this.state.errorType)}

                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.message}>{message}</Text>

                        <View style={styles.buttonContainer}>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.button,
                                    styles.primaryButton,
                                    pressed && styles.buttonPressed
                                ]}
                                onPress={this.handleReset}
                            >
                                <ArrowClockwise size={20} color={colors.textOnPrimary} weight="bold" />
                                <Text style={styles.buttonText}>
                                    {i18n.t('errors.action.retry')}
                                </Text>
                            </Pressable>

                            {onGoHome && (
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.button,
                                        styles.secondaryButton,
                                        pressed && styles.buttonPressed
                                    ]}
                                    onPress={this.handleGoHome}
                                >
                                    <House size={20} color={colors.textPrimary} weight="bold" />
                                    <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                                        {i18n.t('errors.action.goHome')}
                                    </Text>
                                </Pressable>
                            )}
                        </View>
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
        paddingHorizontal: 16,
    },
    buttonContainer: {
        flexDirection: 'column',
        gap: 12,
        width: '100%',
        maxWidth: 280,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
    },
    primaryButton: {
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    secondaryButton: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    buttonPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    buttonText: {
        color: colors.textOnPrimary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButtonText: {
        color: colors.textPrimary,
    },
});
