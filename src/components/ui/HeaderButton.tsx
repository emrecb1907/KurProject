import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface HeaderButtonProps extends TouchableOpacityProps {
    title: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export function HeaderButton({ title, style, textStyle, ...props }: HeaderButtonProps) {
    return (
        <TouchableOpacity style={[styles.button, style]} activeOpacity={0.7} {...props}>
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary, // #FF9600
        borderRadius: 20, // Pill shape
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#000000', // Black text on Orange
        fontSize: 14,
        fontWeight: '600',
    },
});
