import React, { useMemo, useRef, useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { X, CaretRight, Sun, Moon, Desktop, Lightbulb, Globe } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import Constants from 'expo-constants';

interface SettingsOption {
  id: string;
  title: string;
  onPress?: () => void;
}

interface SettingsSection {
  title: string;
  options: SettingsOption[];
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { themeVersion, themeMode, activeTheme, setThemeMode } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<'tr' | 'en'>('tr');

  // ScrollView ref for resetting scroll position
  const scrollViewRef = useRef<ScrollView>(null);

  // Reset scroll position when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [])
  );

  // Settings sections and options
  const settingsSections: SettingsSection[] = useMemo(() => [
    {
      title: 'HESAP',
      options: [
        {
          id: 'preferences',
          title: 'Tercihler',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            // TODO: Navigate to preferences page
          },
        },
        {
          id: 'notifications',
          title: 'Bildirimler',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            // TODO: Navigate to notifications page
          },
        },
      ],
    },
    {
      title: 'GENEL',
      options: [
        {
          id: 'subscription',
          title: 'Abonelik',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            // TODO: Navigate to subscription page
          },
        },
        {
          id: 'terms',
          title: 'Şartlar',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            // TODO: Navigate to terms page
          },
        },
        {
          id: 'privacy',
          title: 'Gizlilik Politikası',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            // TODO: Navigate to privacy policy page
          },
        },
        {
          id: 'credits',
          title: 'Teşekkürler',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            // TODO: Navigate to credits page
          },
        },
      ],
    },
  ], []);

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
      paddingTop: 60,
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
    backButtonText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
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
    },
    scrollContent: {
      paddingTop: 8,
    },
    section: {
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      paddingHorizontal: 16,
      marginBottom: 8,
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
      fontSize: 22,
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
      borderRadius: 12,
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
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    languageContainer: {
      marginTop: 8,
    },
    languageButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    languageButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
    },
    languageButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.buttonOrangeBorder,
    },
    languageButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    languageButtonTextActive: {
      color: colors.textOnPrimary,
    },
    languageHint: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: 'center',
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
  }), [themeVersion]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <X size={24} color={colors.textPrimary} weight="bold" />
        </Pressable>
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <View style={styles.headerSpacer} />
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
            <Text style={styles.themeSectionTitle}>Tema</Text>
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
            <Text style={styles.languageSectionTitle}>Dil</Text>
          </View>
          
          <View style={styles.languageContainer}>
            <View style={styles.languageButtons}>
              <Pressable
                style={[
                  styles.languageButton,
                  selectedLanguage === 'tr' && styles.languageButtonActive
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  // TODO: Implement language change
                  setSelectedLanguage('tr');
                }}
              >
                <Text style={[
                  styles.languageButtonText,
                  selectedLanguage === 'tr' && styles.languageButtonTextActive
                ]}>
                  Türkçe
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.languageButton,
                  selectedLanguage === 'en' && styles.languageButtonActive
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  // TODO: Implement language change
                  setSelectedLanguage('en');
                }}
              >
                <Text style={[
                  styles.languageButtonText,
                  selectedLanguage === 'en' && styles.languageButtonTextActive
                ]}>
                  English
                </Text>
              </Pressable>
            </View>
            <Text style={styles.languageHint}>
              Dil değişikliği yakında aktif olacak
            </Text>
          </View>
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

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>
            Sürüm {Constants.expoConfig?.version || '1.0.0'}
          </Text>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

