import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import * as Network from 'expo-network';
import { WifiSlash } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export function OfflineBanner() {
    const { t } = useTranslation();
    const [isOffline, setIsOffline] = useState(false);
    const [slideAnim] = useState(new Animated.Value(-60));
    const insets = useSafeAreaInsets();

    useEffect(() => {
        let isMounted = true;

        const checkConnection = async () => {
            try {
                const state = await Network.getNetworkStateAsync();
                if (isMounted) {
                    setIsOffline(!state.isConnected);
                }
            } catch (error) {
                console.warn('Network check failed:', error);
            }
        };

        // Initial check
        checkConnection();

        // Poll every 3 seconds (expo-network doesn't have event listeners)
        const interval = setInterval(checkConnection, 3000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    // Animate banner in/out
    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: isOffline ? 0 : -60,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isOffline, slideAnim]);

    if (!isOffline) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    paddingTop: insets.top + 8,
                    transform: [{ translateY: slideAnim }]
                }
            ]}
        >
            <WifiSlash size={18} color="#FFFFFF" weight="bold" />
            <Text style={styles.text}>{t('common.noInternet', 'İnternet bağlantısı yok')}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#DC2626',
        paddingBottom: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        zIndex: 9999,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});
