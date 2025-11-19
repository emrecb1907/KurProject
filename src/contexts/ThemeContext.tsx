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
  
  console.log('🎨 ThemeProvider render:');
  console.log('   systemTheme:', systemTheme);
  console.log('   themeMode:', themeMode);
  console.log('   activeTheme:', activeTheme);
  console.log('   isLoaded:', isLoaded);

  // Load theme from storage on mount
  useEffect(() => {
    loadTheme();
  }, []);

  // Save theme to storage when it changes
  useEffect(() => {
    console.log('💾 Save effect triggered - themeMode:', themeMode, 'isLoaded:', isLoaded);
    if (isLoaded) {
      console.log('✅ Saving theme to storage:', themeMode);
      saveTheme(themeMode);
    } else {
      console.log('⏳ Not saving yet - waiting for initial load to complete');
    }
  }, [themeMode, isLoaded]);

  // Update colors when active theme changes (ALWAYS, not just when loaded)
  useEffect(() => {
    console.log('🎨 ThemeContext: activeTheme changed to:', activeTheme);
    setColorsTheme(activeTheme);
    setThemeVersion(prev => prev + 1); // Increment to force re-renders
    console.log('🎨 setColorsTheme called with:', activeTheme, '- version:', themeVersion + 1);
  }, [activeTheme]); // No isLoaded dependency!

  async function loadTheme() {
    try {
      console.log('📖 loadTheme started - reading key:', THEME_STORAGE_KEY);
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      console.log('📖 Raw value from AsyncStorage:', JSON.stringify(savedTheme));
      console.log('📖 Type of saved value:', typeof savedTheme);
      
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
        console.log('✅ Valid saved theme found:', savedTheme);
        setThemeModeState(savedTheme as ThemeMode);
        
        // Immediately apply colors for the loaded theme
        const loadedActiveTheme: ActiveTheme = 
          savedTheme === 'system' 
            ? (systemTheme === 'light' ? 'light' : 'dark')
            : savedTheme;
        
        console.log('🎨 Applying colors immediately for loaded theme:', loadedActiveTheme);
        setColorsTheme(loadedActiveTheme);
      } else {
        console.log('⚠️ No valid saved theme (value was:', savedTheme, ')');
        console.log('✅ Using default: system (follows device settings)');
        // Apply system theme colors immediately
        const systemActiveTheme: ActiveTheme = systemTheme === 'light' ? 'light' : 'dark';
        console.log('🎨 Applying colors immediately for system theme:', systemActiveTheme);
        setColorsTheme(systemActiveTheme);
      }
    } catch (error) {
      console.error('❌ Failed to load theme:', error);
    } finally {
      console.log('✅ loadTheme completed - setting isLoaded to true');
      setIsLoaded(true);
    }
  }

  async function saveTheme(mode: ThemeMode) {
    try {
      console.log('💾 Attempting to save theme:', mode, 'with key:', THEME_STORAGE_KEY);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      console.log('✅ Theme successfully saved to AsyncStorage');
      
      // Verify it was saved
      const verify = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      console.log('🔍 Verification read from storage:', verify);
    } catch (error) {
      console.error('❌ Failed to save theme:', error);
    }
  }

  function setThemeMode(mode: ThemeMode) {
    console.log('🎨 setThemeMode called with:', mode);
    console.log('🎨 Current isLoaded state:', isLoaded);
    setThemeModeState(mode);
    console.log('🎨 setThemeModeState completed for:', mode);
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

