import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { X, CaretRight, Sun, Moon, Desktop, Lightbulb, Globe, SignOut, Trash } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import Constants from 'expo-constants';
import { useAuthHook } from '@/hooks';
import { useAuth } from '@/store';
import { supabase } from '@/lib/supabase/client';
import { Modal } from '@components/ui/Modal';
import { HeaderButton } from '@components/ui';
import { getCurrentLanguage } from '@/lib/i18n';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { usePremium } from '@/contexts/AdaptyProvider';

interface SettingsOption {
  id: string;
  title: string;
  onPress?: () => void;
}

interface SettingsSection {
  title: string;
  options: SettingsOption[];
}

function SettingsContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const { themeVersion, themeMode, activeTheme, setThemeMode } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<'tr' | 'en'>(getCurrentLanguage());
  const { signOut } = useAuthHook();
  const { isAuthenticated, isAnonymous, user } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [triggerError, setTriggerError] = useState(false); // 🧪 Test için
  const [isRestoring, setIsRestoring] = useState(false);
  const { restore } = usePremium();

  // Check if user has a password (email provider)
  const [hasPassword, setHasPassword] = useState(true);

  // Animation values for logout modal
  const [logoutScaleAnim] = useState(new Animated.Value(0));
  const [logoutFadeAnim] = useState(new Animated.Value(0));

  // Animation values for delete account modal
  const [deleteScaleAnim] = useState(new Animated.Value(0));
  const [deleteFadeAnim] = useState(new Animated.Value(0));

  // Animate logout modal
  useEffect(() => {
    if (showLogoutModal) {
      logoutScaleAnim.setValue(0);
      logoutFadeAnim.setValue(0);
      Animated.parallel([
        Animated.spring(logoutScaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoutFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showLogoutModal]);

  // Animate delete account modal
  useEffect(() => {
    if (showDeleteAccountModal) {
      deleteScaleAnim.setValue(0);
      deleteFadeAnim.setValue(0);
      Animated.parallel([
        Animated.spring(deleteScaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(deleteFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showDeleteAccountModal]);

  // ScrollView ref for resetting scroll position
  const scrollViewRef = useRef<ScrollView>(null);

  // Reset scroll position and refresh language when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      setSelectedLanguage(getCurrentLanguage());

      // Check if user has password (from user_metadata or email identity)
      const checkPasswordStatus = async () => {
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser) {
            // has_password metadata is the definitive source
            // When user sets a password, this flag is set to true
            const hasPasswordMeta = authUser.user_metadata?.has_password === true;

            // Only consider email identity if it was from signup (not from updateUser)
            // If has_password is explicitly false or undefined, user doesn't have password
            // even if they have email identity (e.g., anonymous converted via updateUser)
            setHasPassword(hasPasswordMeta);
          }
        } catch (err) {
          console.error('Error checking password status:', err);
        }
      };
      checkPasswordStatus();
    }, [])
  );

  // Handle logout
  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowLogoutModal(false);
    await signOut();
    router.replace('/(auth)/welcome');
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowDeleteAccountModal(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      if (!user?.id) {
        setShowDeleteAccountModal(false);
        return;
      }

      // Delete user data from database
      const { error: dbError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (dbError) {
        console.error('Error deleting user data:', dbError);
        setShowDeleteAccountModal(false);
        return;
      }

      // Sign out (auth user deletion requires admin API)
      // In production, you might want to use a server-side function for complete deletion
      await signOut();
      setShowDeleteAccountModal(false);
      router.replace('/(auth)/welcome');
    } catch (error) {
      console.error('Error deleting account:', error);
      setShowDeleteAccountModal(false);
    }
  };

  // Settings sections and options
  const settingsSections: SettingsSection[] = useMemo(() => {
    // Base account options (always shown)
    const accountOptions: SettingsOption[] = [
      {
        id: 'preferences',
        title: t('profile.settings.account.preferences'),
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push('/preferences');
        },
      },
      {
        id: 'notifications',
        title: t('profile.settings.account.notifications'),
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          // TODO: Navigate to notifications page
        },
      },
      {
        id: 'timezone',
        title: t('profile.settings.account.timezone', 'Saat Dilimi'),
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push('/timezone-settings');
        },
      },
    ];

    // Add change-password option only for non-anonymous users
    if (!isAnonymous) {
      accountOptions.unshift({
        id: 'change-password',
        title: hasPassword
          ? t('profile.settings.account.changePassword')
          : t('profile.settings.account.setPassword'),
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push({ pathname: '/change-password', params: { hasPassword: hasPassword ? '1' : '0' } });
        },
      });
    }

    return [
      {
        title: t('profile.settings.account.title'),
        options: accountOptions,
      },
      {
        title: t('profile.settings.general.title'),
        options: [
          {
            id: 'subscription',
            title: t('profile.settings.general.subscription'),
            onPress: () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/subscription');
            },
          },
          {
            id: 'terms',
            title: t('profile.settings.general.terms'),
            onPress: () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // TODO: Navigate to terms page
            },
          },
          {
            id: 'privacy',
            title: t('profile.settings.general.privacy'),
            onPress: () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // TODO: Navigate to privacy policy page
            },
          },
          {
            id: 'credits',
            title: t('profile.settings.general.credits'),
            onPress: () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // TODO: Navigate to credits page
            },
          },
        ],
      },
    ];
  }, [t, isAnonymous, hasPassword]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backButtonText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    headerTitleContainer: {
      position: 'absolute',
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.textPrimary,
      textAlign: 'center',
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: -1,
    },
    headerSpacer: {
      width: 40,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingTop: 8,
    },
    section: {
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.textPrimary,
      paddingHorizontal: 16,
      marginBottom: 16,
      marginTop: 8,
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    optionText: {
      fontSize: 16,
      fontWeight: '400',
      color: colors.textPrimary,
    },
    optionIcon: {
      color: colors.textSecondary,
    },
    themeSection: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    themeSectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
    },
    themeSectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    themeContainer: {
      marginTop: 8,
    },
    themeButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    themeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 30,
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
    },
    themeButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.buttonOrangeBorder,
    },
    themeButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    themeButtonTextActive: {
      color: colors.textOnPrimary,
    },
    themeHint: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: 'center',
    },
    languageSection: {
      paddingHorizontal: 16,
      paddingTop: 24,
      paddingBottom: 8,
    },
    languageSectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
    },
    languageSectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    languageItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    languageItemText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.textPrimary,
    },
    languageItemValue: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    versionContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 24,
      marginTop: 16,
    },
    versionText: {
      fontSize: 12,
      color: colors.textSecondary,
      opacity: 0.6,
      textAlign: 'center',
    },
    accountSection: {
      paddingHorizontal: 16,
      paddingTop: 24,
      paddingBottom: 8,
    },
    accountButtons: {
      gap: 12,
    },
    restoreButton: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 30,
    },
    restoreButtonDisabled: {
      opacity: 0.6,
    },
    restoreButtonText: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '500',
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.error,
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 30,
    },
    logoutButtonText: {
      color: colors.textOnPrimary,
      fontSize: 16,
      fontWeight: 'bold',
    },
    deleteAccountButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.error,
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 30,
      opacity: 0.8,
    },
    deleteAccountButtonText: {
      color: colors.textOnPrimary,
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalContent: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    modalEmojiContainer: {
      marginBottom: 16,
    },
    modalEmoji: {
      fontSize: 64,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 12,
    },
    modalMessage: {
      fontSize: 16,
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 22,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
      width: '100%',
    },
    modalButton: {
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalButtonCancel: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalButtonConfirm: {
      backgroundColor: colors.error,
    },
    modalButtonDelete: {
      backgroundColor: colors.error,
    },
    modalButtonCancelText: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalButtonConfirmText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalButtonDeleteText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  }), [themeVersion]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <HeaderButton
          title={t('common.back')}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={{ marginLeft: -8 }}
        />
        <Text style={styles.headerTitle}>{t('profile.settings.title')}</Text>
      </View>

      {/* Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Theme Section */}
        <View style={styles.themeSection}>
          <View style={styles.themeSectionHeader}>
            <Lightbulb size={24} color={colors.textPrimary} weight="fill" />
            <Text style={styles.themeSectionTitle}>{t('profile.theme.label')}</Text>
          </View>

          <View style={styles.themeContainer}>
            <View style={styles.themeButtons}>
              <Pressable
                style={[
                  styles.themeButton,
                  themeMode === 'light' && styles.themeButtonActive
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setThemeMode('light');
                }}
              >
                <Sun
                  size={20}
                  color={themeMode === 'light' ? colors.textOnPrimary : colors.textSecondary}
                  weight="fill"
                />
                <Text style={[
                  styles.themeButtonText,
                  themeMode === 'light' && styles.themeButtonTextActive
                ]}>
                  {t('profile.theme.light')}
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.themeButton,
                  themeMode === 'dark' && styles.themeButtonActive
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setThemeMode('dark');
                }}
              >
                <Moon
                  size={20}
                  color={themeMode === 'dark' ? colors.textOnPrimary : colors.textSecondary}
                  weight="fill"
                />
                <Text style={[
                  styles.themeButtonText,
                  themeMode === 'dark' && styles.themeButtonTextActive
                ]}>
                  {t('profile.theme.dark')}
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.themeButton,
                  themeMode === 'system' && styles.themeButtonActive
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setThemeMode('system');
                }}
              >
                <Desktop
                  size={20}
                  color={themeMode === 'system' ? colors.textOnPrimary : colors.textSecondary}
                  weight="fill"
                />
                <Text style={[
                  styles.themeButtonText,
                  themeMode === 'system' && styles.themeButtonTextActive
                ]}>
                  {t('profile.theme.system')}
                </Text>
              </Pressable>
            </View>
            <Text style={styles.themeHint}>
              {themeMode === 'system'
                ? `${t('profile.theme.activeTheme')}: ${activeTheme === 'light' ? t('profile.theme.light') : t('profile.theme.dark')} (${t('profile.theme.systemSettings')})`
                : `${t('profile.theme.activeTheme')}: ${themeMode === 'light' ? t('profile.theme.light') : t('profile.theme.dark')}`}
            </Text>
          </View>
        </View>

        {/* Language Section */}
        <View style={styles.languageSection}>
          <View style={styles.languageSectionHeader}>
            <Globe size={24} color={colors.textPrimary} weight="fill" />
            <Text style={styles.languageSectionTitle}>{t('profile.settings.language.title')}</Text>
          </View>

          <Pressable
            style={styles.languageItem}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/language-settings');
            }}
          >
            <Text style={styles.languageItemText}>{t('profile.settings.language.select')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.languageItemValue}>
                {selectedLanguage === 'tr' ? t('profile.settings.language.turkish') : t('profile.settings.language.english')}
              </Text>
              <CaretRight size={20} color={colors.textSecondary} weight="bold" />
            </View>
          </Pressable>
        </View>

        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.options.map((option, optionIndex) => (
              <Pressable
                key={option.id}
                style={styles.optionItem}
                onPress={option.onPress}
              >
                <Text style={styles.optionText}>{option.title}</Text>
                <CaretRight size={20} color={colors.textSecondary} weight="bold" />
              </Pressable>
            ))}
          </View>
        ))}

        {/* Account Actions - Only show if authenticated AND not anonymous */}
        {isAuthenticated && !isAnonymous && (
          <View style={styles.accountSection}>
            <View style={styles.accountButtons}>
              {/* Restore Purchases Button - Apple Requirement */}
              <Pressable
                style={[styles.restoreButton, isRestoring && styles.restoreButtonDisabled]}
                onPress={() => {
                  if (isRestoring) return;
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                  Alert.alert(
                    t('premiumpaywall.restoreConfirm.title'),
                    t('premiumpaywall.restoreConfirm.message'),
                    [
                      {
                        text: t('premiumpaywall.restoreConfirm.cancel'),
                        style: 'cancel'
                      },
                      {
                        text: t('premiumpaywall.restoreConfirm.continue'),
                        onPress: async () => {
                          setIsRestoring(true);
                          try {
                            const restored = await restore();
                            if (restored) {
                              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                              Alert.alert(
                                t('premiumpaywall.restoreResult.success.title'),
                                t('premiumpaywall.restoreResult.success.message')
                              );
                            } else {
                              Alert.alert(
                                t('premiumpaywall.restoreResult.noSubscription.title'),
                                t('premiumpaywall.restoreResult.noSubscription.message')
                              );
                            }
                          } catch (error) {
                            Alert.alert(
                              t('common.error', 'Hata'),
                              t('premiumpaywall.errors.restoreFailed')
                            );
                          } finally {
                            setIsRestoring(false);
                          }
                        }
                      }
                    ]
                  );
                }}
                disabled={isRestoring}
              >
                {isRestoring ? (
                  <ActivityIndicator size="small" color={colors.textPrimary} />
                ) : (
                  <Text style={styles.restoreButtonText}>{t('profile.settings.restorePurchases')}</Text>
                )}
              </Pressable>

              <Pressable
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <SignOut size={20} color={colors.textOnPrimary} weight="fill" />
                <Text style={styles.logoutButtonText}>{t('profile.settings.logout.button')}</Text>
              </Pressable>

              <Pressable
                style={styles.deleteAccountButton}
                onPress={handleDeleteAccount}
              >
                <Trash size={20} color={colors.textOnPrimary} weight="fill" />
                <Text style={styles.deleteAccountButtonText}>{t('profile.settings.deleteAccount.button')}</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>
            {t('profile.settings.version')} {Constants.expoConfig?.version || '1.0.0'}
          </Text>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        onClose={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setShowLogoutModal(false);
        }}
        showCloseButton={false}
        transparent
      >
        <Animated.View
          style={[
            styles.modalContent,
            {
              opacity: logoutFadeAnim,
              transform: [{ scale: logoutScaleAnim }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.modalEmojiContainer,
              {
                transform: [{ scale: logoutScaleAnim }],
              },
            ]}
          >
            <Text style={styles.modalEmoji}>🚪</Text>
          </Animated.View>
          <Text style={styles.modalTitle}>{t('profile.settings.logout.title')}</Text>
          <Text style={styles.modalMessage}>
            {t('profile.settings.logout.message')}
          </Text>
          <View style={styles.modalButtons}>
            <Pressable
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowLogoutModal(false);
              }}
            >
              <Text style={styles.modalButtonCancelText}>{t('profile.settings.logout.cancel')}</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, styles.modalButtonConfirm]}
              onPress={confirmLogout}
            >
              <Text style={styles.modalButtonConfirmText}>{t('profile.settings.logout.confirm')}</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal
        visible={showDeleteAccountModal}
        onClose={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setShowDeleteAccountModal(false);
        }}
        showCloseButton={false}
        transparent
      >
        <Animated.View
          style={[
            styles.modalContent,
            {
              opacity: deleteFadeAnim,
              transform: [{ scale: deleteScaleAnim }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.modalEmojiContainer,
              {
                transform: [{ scale: deleteScaleAnim }],
              },
            ]}
          >
            <Text style={styles.modalEmoji}>⚠️</Text>
          </Animated.View>
          <Text style={styles.modalTitle}>{t('profile.settings.deleteAccount.title')}</Text>
          <Text style={styles.modalMessage}>
            {t('profile.settings.deleteAccount.message')}
          </Text>
          <View style={styles.modalButtons}>
            <Pressable
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowDeleteAccountModal(false);
              }}
            >
              <Text style={styles.modalButtonCancelText}>{t('profile.settings.deleteAccount.cancel')}</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, styles.modalButtonDelete]}
              onPress={confirmDeleteAccount}
            >
              <Text style={styles.modalButtonDeleteText}>{t('profile.settings.deleteAccount.confirm')}</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView >
  );
}

// Wrap with ErrorBoundary
export default function SettingsScreen() {
  const router = useRouter();

  return (
    <ErrorBoundary
      fallbackScreen="settings"
      onGoHome={() => router.replace('/')}
    >
      <SettingsContent />
    </ErrorBoundary>
  );
}
