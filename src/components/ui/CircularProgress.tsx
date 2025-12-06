import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';

interface CircularProgressProps {
    size: number;
    strokeWidth: number;
    progress: number; // 0 to 1
    correct: number;
    total: number;
}

export function CircularProgress({ size, strokeWidth, progress, correct, total }: CircularProgressProps) {
    const { themeVersion } = useTheme();
    // Re-calculate styles when theme changes
    const styles = useMemo(() => getStyles(), [themeVersion]);

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress * circumference);

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                {/* Background Track */}
                <Circle
                    stroke="#1F2937"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Progress Circle */}
                <Circle
                    stroke="#FFC800"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>
            <View style={styles.contentContainer}>
                <Text style={styles.scoreText}>{correct}/{total}</Text>
                <Text style={styles.labelText}>Doğru</Text>
            </View>
        </View>
    );
}

const getStyles = () => StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    contentContainer: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 48, // Large text for "8/10"
        fontWeight: '800',
        color: colors.textPrimary, // Dynamic color (White in dark, Dark in light)
        marginBottom: 0,
    },
    labelText: {
        fontSize: 16,
        color: '#9CA3AF',
        fontWeight: '600',
        marginTop: 4, // Small gap between x/x and Doğru
    },
});
