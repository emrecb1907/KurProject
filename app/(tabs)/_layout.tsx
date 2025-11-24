import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useMemo } from 'react';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { House, Trophy, User, Gift } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';

import * as Haptics from 'expo-haptics';

export default function TabLayout() {
  const { t } = useTranslation();
  const { activeTheme, themeVersion } = useTheme();

  // Dynamic styles that update when theme changes
  const styles = useMemo(() => StyleSheet.create({
    tabBar: {
      backgroundColor: colors.backgroundDarker,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      height: 75,
      paddingBottom: 12,
      paddingTop: 10,
      paddingHorizontal: 8,
    },
    tabBarLabel: {
      fontSize: 11,
      fontWeight: '600',
    },
    tabBarItem: {
      paddingHorizontal: 2,
    },
    tabItem: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      paddingHorizontal: 12,
      paddingVertical: 17,
      borderRadius: 12,
      minWidth: 68,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    tabItemActive: {
      backgroundColor: colors.surface,
      borderColor: colors.primary,
    },
    label: {
      fontSize: 10,
      fontWeight: '600',
      color: colors.textDisabled,
      textAlign: 'center',
    },
    labelActive: {
      color: colors.textPrimary,
    },
  }), [themeVersion]); // Use themeVersion to capture color changes

  // Capture color values at render time with themeVersion dependency
  const screenOptions = useMemo(() => ({
    headerShown: false,
    tabBarStyle: styles.tabBar,
    tabBarActiveTintColor: colors.textPrimary, // Captured when themeVersion changes
    tabBarInactiveTintColor: colors.textDisabled, // Captured when themeVersion changes
    tabBarLabelStyle: styles.tabBarLabel,
    tabBarItemStyle: styles.tabBarItem,
  }), [themeVersion, styles]);

  return (
    <Tabs
      screenOptions={screenOptions}
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <House
                size={18}
                color={focused ? colors.textPrimary : colors.textDisabled}
                weight={focused ? 'fill' : 'regular'}
              />
              <Text style={[styles.label, focused && styles.labelActive]}>{t('tabs.home')}</Text>
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: t('tabs.leaderboard'),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <Trophy
                size={18}
                color={focused ? colors.textPrimary : colors.textDisabled}
                weight={focused ? 'fill' : 'regular'}
              />
              <Text style={[styles.label, focused && styles.labelActive]}>{t('tabs.leaderboard')}</Text>
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="chest"
        options={{
          title: t('tabs.rewards'),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <Gift
                size={18}
                color={focused ? colors.textPrimary : colors.textDisabled}
                weight={focused ? 'fill' : 'regular'}
              />
              <Text style={[styles.label, focused && styles.labelActive]}>{t('tabs.rewards')}</Text>
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <User
                size={18}
                color={focused ? colors.textPrimary : colors.textDisabled}
                weight={focused ? 'fill' : 'regular'}
              />
              <Text style={[styles.label, focused && styles.labelActive]}>{t('tabs.profile')}</Text>
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
    </Tabs>
  );
}
