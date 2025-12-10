import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface PrimaryButtonProps extends TouchableOpacityProps {
    title: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export function PrimaryButton({ title, style, textStyle, ...props }: PrimaryButtonProps) {
    return (
        <TouchableOpacity style={[styles.button, style]} activeOpacity={0.8} {...props}>
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary, // #FF9600
        borderRadius: 30, // Premium style roundedness
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
        // Shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },
    text: {
        color: '#000000', // Black text on Orange for high contrast (Premium style)
        fontSize: 18,
        fontWeight: 'bold',
    },
});
