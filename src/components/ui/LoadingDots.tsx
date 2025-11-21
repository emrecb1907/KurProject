import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface LoadingDotsProps {
    style?: TextStyle;
}

export function LoadingDots({ style }: LoadingDotsProps) {
    const [dots, setDots] = useState('.');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => {
                if (prev === '...') return '.';
                return prev + '.';
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return <Text style={[styles.text, style]}>{dots}</Text>;
}

const styles = StyleSheet.create({
    text: {
        // Inherit styles from parent Text component usually, but can add defaults here
    }
});
