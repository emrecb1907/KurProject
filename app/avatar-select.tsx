import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, Check } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { HeaderButton } from '@components/ui';
import { useUser } from '@/store';
import { AVATAR_SOURCES } from '@/constants/avatars';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AVATAR_SIZE = (SCREEN_WIDTH - 80) / 3; // 3 avatars per row with padding

// Avatar data
interface Avatar {
    id: string;
    source: any;
}

// Avatar list from constants
const AVATARS: Avatar[] = Object.entries(AVATAR_SOURCES).map(([id, source]) => ({
    id,
    source,
}));

export default function AvatarSelectScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { themeVersion } = useTheme();
    const { selectedAvatar: storeAvatar, setSelectedAvatar } = useUser();
    const [selectedAvatar, setLocalSelectedAvatar] = useState<string>(storeAvatar);

    const handleAvatarSelect = (avatar: Avatar) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setLocalSelectedAvatar(avatar.id);
    };

    const handleContinue = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        // Save selected avatar to store
        setSelectedAvatar(selectedAvatar);
        router.back();
    };

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: {
                    flex: 1,
                    backgroundColor: colors.background,
                },
                header: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    paddingBottom: 16,
                    backgroundColor: colors.backgroundDarker,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                },
                backButton: {
                    width: 40,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                headerTitle: {
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: colors.textPrimary,
                },
                headerSpacer: {
                    width: 40,
                },
                content: {
                    flex: 1,
                    paddingHorizontal: 16,
                },
                description: {
                    fontSize: 16,
                    color: colors.textSecondary,
                    textAlign: 'center',
                    marginTop: 24,
                    marginBottom: 8,
                    lineHeight: 22,
                },
                descriptionSecondary: {
                    fontSize: 16,
                    color: colors.textSecondary,
                    textAlign: 'center',
                    marginBottom: 24,
                    lineHeight: 22,
                },
                avatarGrid: {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 16,
                    paddingBottom: 24,
                },
                avatarContainer: {
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE,
                    position: 'relative',
                },
                avatarContainerSelected: {
                    // No special styles needed, border is on imageWrapper
                },
                avatarImageWrapper: {
                    width: '100%',
                    height: '100%',
                    borderRadius: AVATAR_SIZE / 2,
                    overflow: 'hidden',
                },
                avatarImageWrapperSelected: {
                    borderWidth: 3,
                    borderColor: '#FF9600',
                },
                avatarImage: {
                    width: '108%',
                    height: '100%',
                    borderRadius: AVATAR_SIZE / 2,
                    transform: [{ translateX: -8 }],
                },
                avatarPlaceholder: {
                    width: '100%',
                    height: '100%',
                    borderRadius: AVATAR_SIZE / 2,
                    backgroundColor: colors.surface,
                    borderWidth: 2,
                    borderColor: colors.border,
                    borderStyle: 'dashed',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                lockedOverlay: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: AVATAR_SIZE / 2,
                },
                lockIconContainer: {
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                selectedBadge: {
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#FF9600',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: colors.background,
                },
                addAvatarButton: {
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE,
                    borderRadius: AVATAR_SIZE / 2,
                    borderWidth: 2,
                    borderColor: colors.border,
                    borderStyle: 'dashed',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.surface,
                },
                footer: {
                    padding: 16,
                    paddingBottom: 32,
                    backgroundColor: colors.background,
                },
                continueButton: {
                    backgroundColor: '#FF9600',
                    borderRadius: 30,
                    paddingVertical: 16,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 8,
                },
                continueButtonText: {
                    color: '#000000',
                    fontSize: 18,
                    fontWeight: 'bold',
                },
            }),
        [themeVersion]
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <HeaderButton
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.back();
                    }}
                    title={t('common.back')}
                />
                <Text style={styles.headerTitle}>
                    {t('profile.avatarSelect.title')}
                </Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Content */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Description */}
                <Text style={styles.description}>
                    {t('profile.avatarSelect.description1')}
                </Text>
                <Text style={styles.descriptionSecondary}>
                    {t('profile.avatarSelect.description2')}
                </Text>

                {/* Avatar Grid */}
                <View style={styles.avatarGrid}>
                    {AVATARS.map((avatar) => (
                        <Pressable
                            key={avatar.id}
                            style={styles.avatarContainer}
                            onPress={() => handleAvatarSelect(avatar)}
                        >
                            <View style={[
                                styles.avatarImageWrapper,
                                selectedAvatar === avatar.id && styles.avatarImageWrapperSelected,
                            ]}>
                                <Image
                                    source={avatar.source}
                                    style={styles.avatarImage}
                                    resizeMode="cover"
                                />
                            </View>

                            {/* Selected badge */}
                            {selectedAvatar === avatar.id && (
                                <View style={styles.selectedBadge}>
                                    <Check
                                        size={18}
                                        color="#000000"
                                        weight="bold"
                                    />
                                </View>
                            )}
                        </Pressable>
                    ))}
                </View>
            </ScrollView>

            {/* Footer with Continue Button */}
            <View style={styles.footer}>
                <Pressable
                    style={styles.continueButton}
                    onPress={handleContinue}
                >
                    <Text style={styles.continueButtonText}>
                        {t('profile.avatarSelect.continue')}
                    </Text>
                    <ArrowLeft
                        size={20}
                        color="#000000"
                        weight="bold"
                        style={{ transform: [{ rotate: '180deg' }] }}
                    />
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
