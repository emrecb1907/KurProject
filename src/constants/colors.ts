// QuranLearn Color Palette
// Dynamic Light & Dark Theme System
import { Appearance } from 'react-native';

export type ActiveTheme = 'light' | 'dark';

// DARK Theme Colors (Dark Background, Light Text)
const darkThemeColors = {
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

  // Answer Feedback
  correct: '#58CC02',
  incorrect: '#FF4B4B',

  // Warning - Yellow -> Orange (User Request)
  warning: '#FF9600',
  warningDark: '#E68500',

  // Dark Background
  background: '#050816', // Updated Dark Blue/Black
  backgroundDarker: '#050816', // Updated Dark Blue/Black
  backgroundLighter: '#111827', // Lighter panels (Surface color)

  // Surface & Cards
  surface: '#111827', // Updated Card Background
  surfaceDark: '#0B101E',
  surfaceLight: '#1F2937',

  // Text colors - Dark mode (white text on dark bg)
  textPrimary: '#FFFFFF', // Pure White
  textSecondary: '#D1D5DB', // Light gray
  textDisabled: '#6B7280', // Muted gray
  textOnPrimary: '#FFFFFF',
  textOnDark: '#FFFFFF',
  textLight: '#FFFFFF',

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
  xpGold: '#FF9600',
  xpGreen: '#58CC02',

  // Timer Progress
  progressGreen: '#58CC02',
  progressYellow: '#FF9600',
  progressOrange: '#FF4B4B',

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

// LIGHT Theme Colors (Light Background, Dark Text)
const lightThemeColors = {
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

  // Answer Feedback
  correct: '#58CC02',
  incorrect: '#FF4B4B',

  // Warning - Yellow -> Orange (User Request)
  warning: '#FF9600',
  warningDark: '#E68500',

  // Light Background
  background: '#F5F5F0', // Hafif bej
  backgroundDarker: '#FFFFFF', // Beyaz
  backgroundLighter: '#FAFAF7', // Açık bej

  // Surface & Cards
  surface: '#FFF9F0', // Bej card
  surfaceDark: '#F5F5F0', // Hafif bej
  surfaceLight: '#FAFAF7', // Çok açık bej

  // Text colors - Light mode (Dark text on light bg)
  textPrimary: '#1F2937', // Koyu gri
  textSecondary: '#6B7280', // Orta gri
  textDisabled: '#9CA3AF', // Açık gri
  textOnPrimary: '#FFFFFF', // Butonlar üzerinde beyaz
  textOnDark: '#1F2937',
  textLight: '#FFFFFF',

  // Border colors
  border: '#E5E7EB', // Açık border
  borderLight: '#D1D5DB',
  borderDark: '#9CA3AF',

  // Button colors (3D effect)
  buttonOrangeBorder: '#CC7700',
  buttonBlueBorder: '#1389B8',
  buttonGreenBorder: '#42A500',
  buttonPinkBorder: '#CC5678',
  buttonGrayBorder: '#D1D5DB',

  // Progress & XP
  xpGold: '#FF9600',
  xpGreen: '#58CC02',

  // Timer Progress
  progressGreen: '#58CC02',
  progressYellow: '#FF9600',
  progressOrange: '#FF4B4B',

  // Locked/Disabled states
  locked: '#9CA3AF',
  lockedBorder: '#D1D5DB',

  // Shadow & Glow
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

// Initialize currentColors based on theme
let currentColors = currentTheme === 'light' ? lightThemeColors : darkThemeColors;

console.log('🎨 Initial theme detected:', currentTheme, '(system:', systemTheme, ')');
console.log('🎨 Using', currentTheme === 'light' ? 'lightThemeColors' : 'darkThemeColors', 'for theme:', currentTheme);

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

  currentColors = theme === 'light' ? lightThemeColors : darkThemeColors;

  console.log('✅ Theme applied:', theme, '→ Using', theme === 'light' ? 'lightThemeColors' : 'darkThemeColors');
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
export const colors = new Proxy({} as typeof lightThemeColors, {
  get(target, prop: keyof typeof lightThemeColors) {
    return currentColors[prop];
  }
});

/**
 * Get colors for a specific theme (useful for comparisons)
 */
export function getThemeColors(theme: ActiveTheme) {
  return theme === 'light' ? lightThemeColors : darkThemeColors;
}

export type Color = keyof typeof lightThemeColors;
