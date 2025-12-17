import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle, TextStyle, ActivityIndicator, View } from 'react-native';
import { colors } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';

interface PrimaryButtonProps extends TouchableOpacityProps {
    title: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    isLoading?: boolean;
}

export function PrimaryButton({ title, style, textStyle, isLoading, ...props }: PrimaryButtonProps) {
    const { activeTheme } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.button, style, isLoading && styles.loading]}
            activeOpacity={0.8}
            disabled={isLoading || props.disabled}
            {...props}
        >
            <View style={styles.contentContainer}>
                {isLoading && (
                    <ActivityIndicator
                        size="small"
                        color={activeTheme === 'light' ? '#FFFFFF' : '#000000'}
                        style={styles.spinner}
                    />
                )}
                <Text style={[styles.text, { color: activeTheme === 'light' ? '#FFFFFF' : '#000000' }, textStyle]}>
                    {title}
                </Text>
            </View>
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
        // 3D Effect (Subtle)
        borderBottomWidth: 2.5,
        borderBottomColor: colors.buttonOrangeBorder,
        // Shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },
    loading: {
        opacity: 0.8,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinner: {
        marginRight: 8,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
