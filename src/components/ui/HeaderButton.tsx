import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle, TextStyle, View } from 'react-native';
import { colors } from '@/constants/colors';
import { CaretLeft } from 'phosphor-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface HeaderButtonProps extends TouchableOpacityProps {
    title: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    showIcon?: boolean; // Show left arrow icon
}

export function HeaderButton({ title, style, textStyle, showIcon = true, ...props }: HeaderButtonProps) {
    const { activeTheme } = useTheme();
    const isLight = activeTheme === 'light';

    // Light theme: white text, Dark theme: black text
    const textColor = isLight ? '#FFFFFF' : '#000000';

    return (
        <TouchableOpacity style={[styles.button, style]} activeOpacity={0.7} {...props}>
            <View style={styles.content}>
                {showIcon && <CaretLeft size={16} color={textColor} weight="bold" />}
                <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
            </View>
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
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
    },
});
