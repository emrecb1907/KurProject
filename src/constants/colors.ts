// QuranLearn Color Palette
// Dynamic Light & Dark Theme System
import { Appearance } from 'react-native';

export type ActiveTheme = 'light' | 'dark';

// DARK Theme Colors (confusingly named lightColors due to original naming issue)
// Contains: Dark backgrounds (#1F2937), Light text (#F9FAFB)
const lightColors = {
  // Primary - Orange (Duolingo style)
  primary: '#FF9600',
  primaryLight: '#FFB84D',
  primaryDark: '#E68500',
  primaryGlow: 'rgba(255, 150, 0, 0.3)',
  
  // Secondary - Blue  
  secondary: '#1CB0F6',
  secondaryLight: '#58C4F6',
  secondaryDark: '#1899D6',
  secondaryGlow: 'rgba(28, 176, 246, 0.3)',
  
  // Success - Green
  success: '#58CC02',
  successLight: '#89E219',
  successDark: '#42A500',
  successGlow: 'rgba(88, 204, 2, 0.3)',
  
  // Pink/Purple
  pink: '#FF6B9D',
  pinkDark: '#E6568A',
  pinkGlow: 'rgba(255, 107, 157, 0.3)',
  
  // Error - Red
  error: '#FF4B4B',
  errorDark: '#EA2B2B',
  errorGlow: 'rgba(255, 75, 75, 0.3)',
  
  // Warning - Yellow
  warning: '#FFC800',
  warningDark: '#E6B400',
  
  // Light Background (NOW CORRECTLY: contains DARK theme colors #1F2937)
  background: '#1F2937', // Dark blue-gray
  backgroundDarker: '#111827', // Darker
  backgroundLighter: '#374151', // Lighter panels
  
  // Surface & Cards
  surface: '#374151',
  surfaceDark: '#1F2937',
  surfaceLight: '#4B5563',
  
  // Text colors - Dark mode (white text on dark bg)
  textPrimary: '#F9FAFB', // Almost white
  textSecondary: '#D1D5DB', // Light gray
  textDisabled: '#6B7280', // Muted gray
  textOnPrimary: '#FFFFFF',
  textOnDark: '#F9FAFB',
  
  // Border colors
  border: '#4B5563',
  borderLight: '#6B7280',
  borderDark: '#374151',
  
  // Button colors (3D effect)
  buttonOrangeBorder: '#CC7700',
  buttonBlueBorder: '#1389B8',
  buttonGreenBorder: '#42A500',
  buttonPinkBorder: '#CC5678',
  buttonGrayBorder: '#4B5563',
  
  // Progress & XP
  xpGold: '#FFC800',
  xpGreen: '#58CC02',
  
  // Locked/Disabled states
  locked: '#6B7280',
  lockedBorder: '#4B5563',
  
  // Shadow & Glow
  shadow: 'rgba(0, 0, 0, 0.5)',
  shadowStrong: 'rgba(0, 0, 0, 0.7)',
  glow: 'rgba(255, 255, 255, 0.1)',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',
} as const;

// LIGHT Theme Colors (confusingly named darkColors due to original naming issue)
// Contains: Light backgrounds (#F5F5F0, #FFFFFF), Dark text (#1F2937)
const darkColors = {
  // Primary - Orange (Same as light, good contrast)
  primary: '#FF9600',
  primaryLight: '#FFB84D',
  primaryDark: '#E68500',
  primaryGlow: 'rgba(255, 150, 0, 0.2)',
  
  // Secondary - Blue  
  secondary: '#1CB0F6',
  secondaryLight: '#58C4F6',
  secondaryDark: '#1389B8',
  secondaryGlow: 'rgba(28, 176, 246, 0.2)',
  
  // Success - Green
  success: '#58CC02',
  successLight: '#89E219',
  successDark: '#42A500',
  successGlow: 'rgba(88, 204, 2, 0.2)',
  
  // Pink/Purple
  pink: '#FF6B9D',
  pinkDark: '#E6568A',
  pinkGlow: 'rgba(255, 107, 157, 0.2)',
  
  // Error - Red
  error: '#FF4B4B',
  errorDark: '#EA2B2B',
  errorGlow: 'rgba(255, 75, 75, 0.2)',
  
  // Warning - Yellow
  warning: '#FFC800',
  warningDark: '#E6B400',
  
  // Dark Background (NOW CORRECTLY: contains LIGHT theme colors #F5F5F0 - Bej/Beyaz)
  background: '#F5F5F0', // Hafif bej (for LIGHT theme)
  backgroundDarker: '#FFFFFF', // Beyaz (for LIGHT theme)
  backgroundLighter: '#FAFAF7', // Açık bej (for LIGHT theme)
  
  // Surface & Cards (Beyaz for LIGHT theme)
  surface: '#FFFFFF', // Beyaz card
  surfaceDark: '#F5F5F0', // Hafif bej
  surfaceLight: '#FAFAF7', // Çok açık bej
  
  // Text colors - Light mode (Dark text on light bg)
  textPrimary: '#1F2937', // Koyu gri (okunabilir)
  textSecondary: '#6B7280', // Orta gri
  textDisabled: '#9CA3AF', // Açık gri
  textOnPrimary: '#FFFFFF', // Butonlar üzerinde beyaz
  textOnDark: '#1F2937',
  
  // Border colors
  border: '#E5E7EB', // Açık border
  borderLight: '#D1D5DB',
  borderDark: '#9CA3AF',
  
  // Button colors (3D effect - biraz daha soft)
  buttonOrangeBorder: '#CC7700',
  buttonBlueBorder: '#1389B8',
  buttonGreenBorder: '#42A500',
  buttonPinkBorder: '#CC5678',
  buttonGrayBorder: '#D1D5DB',
  
  // Progress & XP
  xpGold: '#FFC800',
  xpGreen: '#58CC02',
  
  // Locked/Disabled states
  locked: '#9CA3AF',
  lockedBorder: '#D1D5DB',
  
  // Shadow & Glow (Light mode için daha soft)
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowStrong: 'rgba(0, 0, 0, 0.2)',
  glow: 'rgba(0, 0, 0, 0.05)',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.4)',
  overlayLight: 'rgba(0, 0, 0, 0.2)',
} as const;

// Current theme holder (will be updated dynamically)
// Initialize based on system color scheme if available
const systemTheme = Appearance.getColorScheme();
let currentTheme: ActiveTheme = (systemTheme === 'light' ? 'light' : 'dark');

// INVERTED: lightColors has dark palette, darkColors has light palette
// So we use OPPOSITE logic:
let currentColors = currentTheme === 'light' ? darkColors : lightColors;

console.log('🎨 Initial theme detected:', currentTheme, '(system:', systemTheme, ')');
console.log('🎨 Using', currentTheme === 'light' ? 'darkColors (light)' : 'lightColors (dark)', 'for theme:', currentTheme);

// Listen to system theme changes
Appearance.addChangeListener(({ colorScheme }) => {
  // This will be overridden by ThemeContext if user has a preference
  console.log('📱 System theme changed to:', colorScheme);
});

/**
 * Set the active theme
 * Call this when theme changes in ThemeContext
 */
export function setActiveTheme(theme: ActiveTheme) {
  console.log('🎨 setActiveTheme called with:', theme);
  currentTheme = theme;
  
  // INVERTED: lightColors has dark palette, darkColors has light palette
  currentColors = theme === 'light' ? darkColors : lightColors;
  
  console.log('✅ Theme applied:', theme, '→ Using', theme === 'light' ? 'darkColors (light palette)' : 'lightColors (dark palette)');
  console.log('🎨 background:', currentColors.background);
  console.log('🎨 textPrimary:', currentColors.textPrimary);
}

/**
 * Get current active theme
 */
export function getActiveTheme(): ActiveTheme {
  return currentTheme;
}

/**
 * Get colors for the current theme
 * This is the main export that components should use
 */
export const colors = new Proxy({} as typeof darkColors, {
  get(target, prop: keyof typeof darkColors) {
    return currentColors[prop];
  }
});

/**
 * Get colors for a specific theme (useful for comparisons)
 */
export function getThemeColors(theme: ActiveTheme) {
  // INVERTED: lightColors has dark palette, darkColors has light palette
  return theme === 'light' ? darkColors : lightColors;
}

export type Color = keyof typeof darkColors;
