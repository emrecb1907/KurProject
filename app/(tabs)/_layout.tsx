import { Tabs } from 'expo-router';
import { StyleSheet, Text, View, DeviceEventEmitter, Animated } from 'react-native';
import { useMemo, useEffect, useRef } from 'react';
import { colors } from '@constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { House, Trophy, User, TreasureChest, Crown } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { useMissions, useUserTitles } from '@/hooks/queries';
import { useAuth, useUser } from '@/store';

import * as Haptics from 'expo-haptics';

export default function TabLayout() {
  const { t } = useTranslation();
  const { activeTheme, themeVersion } = useTheme();
  const { user } = useAuth();
  const { lastSeenTitleCount } = useUser();

  // Check for new titles
  const { data: userTitles } = useUserTitles(user?.id);
  const hasNewTitle = useMemo(() => {
    const earnedCount = userTitles?.length || 0;
    return earnedCount > lastSeenTitleCount && lastSeenTitleCount > 0;
  }, [userTitles, lastSeenTitleCount]);

  // Check for claimable milestones
  const { data: testMissions } = useMissions(user?.id, 'test');
  const { data: lessonMissions } = useMissions(user?.id, 'lesson');

  const hasClaimable = useMemo(() => {
    const checkGroupsForClaimable = (missions: typeof testMissions) => {
      if (!missions?.groups) return false;
      return missions.groups.some(group =>
        group.milestones?.some((milestone, index) => {
          const isReached = group.is_repeatable
            ? group.current_count >= milestone.target_count
            : missions.total_count >= milestone.target_count;
          const isPreviousClaimed = index === 0 || group.milestones[index - 1]?.is_claimed;
          return isReached && !milestone.is_claimed && isPreviousClaimed;
        })
      );
    };
    return checkGroupsForClaimable(testMissions) || checkGroupsForClaimable(lessonMissions);
  }, [testMissions, lessonMissions]);

  // Pulsing Dot Component
  const PulsingDot = () => {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.8,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }, []);

    return (
      <View style={styles.notificationDotContainer}>
        <Animated.View
          style={[
            styles.pulseRing,
            {
              transform: [{ scale: pulseAnim }],
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.8],
                outputRange: [0.6, 0],
              }),
            },
          ]}
        />
        <View style={styles.notificationDot} />
      </View>
    );
  };


  // Dynamic styles that update when theme changes
  const styles = useMemo(() => StyleSheet.create({
    tabBar: {
      backgroundColor: colors.backgroundDarker,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      height: 75,
      paddingBottom: 12,
      paddingTop: 12,
      paddingHorizontal: 8,
    },
    tabBarLabel: {
      fontSize: 11,
      fontWeight: '600',
    },
    tabBarItem: {
      paddingHorizontal: 0,
    },
    tabItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: 55,
      height: 55,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    tabItemActive: {
      backgroundColor: colors.surface,
      borderColor: colors.primary,
    },
    notificationDotContainer: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 14,
      height: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notificationDot: {
      position: 'absolute',
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#FF9600',
      borderWidth: 2,
      borderColor: colors.backgroundDarker,
    },
    pulseRing: {
      position: 'absolute',
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: '#FF9600',
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
                size={28}
                color={focused ? colors.textPrimary : colors.textDisabled}
                weight={focused ? 'fill' : 'regular'}
              />
            </View>
          ),
          tabBarLabel: () => null,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (navigation.isFocused()) {
              DeviceEventEmitter.emit('scrollToTop');
            }
          },
        })}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: t('tabs.leaderboard'),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <Trophy
                size={28}
                color={focused ? colors.textPrimary : colors.textDisabled}
                weight={focused ? 'fill' : 'regular'}
              />
            </View>
          ),
          tabBarLabel: () => null,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (navigation.isFocused()) {
              DeviceEventEmitter.emit('scrollToTopLeaderboard');
            }
          },
        })}
      />
      <Tabs.Screen
        name="chest"
        options={{
          title: t('tabs.rewards'),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <TreasureChest
                size={28}
                color={focused ? colors.textPrimary : colors.textDisabled}
                weight={focused ? 'fill' : 'regular'}
              />
              {hasClaimable && !focused && <PulsingDot />}
            </View>
          ),
          tabBarLabel: () => null,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (navigation.isFocused()) {
              DeviceEventEmitter.emit('scrollToTopChest');
            }
          },
        })}
      />
      <Tabs.Screen
        name="premium"
        options={{
          title: t('tabs.premium'),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <Crown
                size={28}
                color={focused ? colors.textPrimary : colors.textDisabled}
                weight={focused ? 'fill' : 'regular'}
              />
            </View>
          ),
          tabBarLabel: () => null,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (navigation.isFocused()) {
              DeviceEventEmitter.emit('scrollToTopPremium');
            }
          },
        })}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, focused && styles.tabItemActive]}>
              <User
                size={28}
                color={focused ? colors.textPrimary : colors.textDisabled}
                weight={focused ? 'fill' : 'regular'}
              />
              {hasNewTitle && !focused && <PulsingDot />}
            </View>
          ),
          tabBarLabel: () => null,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (navigation.isFocused()) {
              DeviceEventEmitter.emit('scrollToTopProfile');
            }
          },
        })}
      />
      <Tabs.Screen
        name="premiumCenter"
        options={{
          href: null, // Tab bar'da görünmesin
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
