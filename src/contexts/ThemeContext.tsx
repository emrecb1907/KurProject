import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { setActiveTheme as setColorsTheme } from '@/constants/colors';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ActiveTheme = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  activeTheme: ActiveTheme;
  themeVersion: number; // Incrementing counter to force re-renders
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'quranlearn-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemTheme = useColorScheme(); // 'light' | 'dark' | null
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);
  const [themeVersion, setThemeVersion] = useState(0);

  // Calculate active theme based on mode
  const activeTheme: ActiveTheme =
    themeMode === 'system'
      ? (systemTheme === 'light' ? 'light' : 'dark')
      : themeMode;

  // Load theme preference on mount
  useEffect(() => {
    loadTheme();
  }, []);

  // Save theme to storage when it changes
  useEffect(() => {
    if (isLoaded) {
      saveTheme(themeMode);
    }
  }, [themeMode, isLoaded]);

  // Update colors when active theme changes (ALWAYS, not just when loaded)
  useEffect(() => {
    setColorsTheme(activeTheme);
    setThemeVersion(prev => prev + 1); // Increment to force re-renders
  }, [activeTheme]);

  async function loadTheme() {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
        setThemeModeState(savedTheme as ThemeMode);

        // Immediately apply colors for the loaded theme
        const loadedActiveTheme: ActiveTheme =
          savedTheme === 'system'
            ? (systemTheme === 'light' ? 'light' : 'dark')
            : savedTheme;

        setColorsTheme(loadedActiveTheme);
      } else {
        // Apply system theme colors immediately
        const systemActiveTheme: ActiveTheme = systemTheme === 'light' ? 'light' : 'dark';
        setColorsTheme(systemActiveTheme);
      }
    } catch (error) {
      console.error('❌ Failed to load theme:', error);
    } finally {
      setIsLoaded(true);
    }
  }

  async function saveTheme(mode: ThemeMode) {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('❌ Failed to save theme:', error);
    }
  }

  function setThemeMode(mode: ThemeMode) {
    setThemeModeState(mode);
  }

  function toggleTheme() {
    setThemeModeState(prev => {
      if (prev === 'system') return 'dark';
      if (prev === 'dark') return 'light';
      return 'dark'; // from light to dark
    });
  }

  return (
    <ThemeContext.Provider value={{ themeMode, activeTheme, themeVersion, setThemeMode, toggleTheme }}>
      {/* Don't render children until theme is loaded from storage */}
      {isLoaded ? children : null}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
