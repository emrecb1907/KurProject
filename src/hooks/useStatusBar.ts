import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Hook to automatically set StatusBar style based on active theme
 * Usage: useStatusBar() at the top of your screen component
 */
export function useStatusBar() {
  const { activeTheme, themeVersion } = useTheme();
  
  // StatusBar style: 'light' for dark theme, 'dark' for light theme
  const statusBarStyle = activeTheme === 'dark' ? 'light' : 'dark';
  
  return { statusBarStyle, activeTheme, themeVersion };
}

