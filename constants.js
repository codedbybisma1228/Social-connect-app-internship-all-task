export const COLORS = {
  // Primary gradient colors (used for backgrounds, main buttons)
  primary: "#667eea",
  primaryDark: "#764ba2",
  secondary: "#f093fb",
  secondaryLight: "#f5f7fa",

  // Accent colors (used for highlights, active states)
  accent: "#ff6b6b",
  accentLight: "#ffeaa7",

  // Social media inspired colors
  like: "#e74c3c",
  comment: "#3498db",
  share: "#2ecc71",
  success: "#27ae60",
  warning: "#f39c12",
  error: "#e74c3c",

  // Global Neutral colors (used across themes for specific elements)
  white: "#ffffff",
  black: "#2c3e50",
  gray: "#7f8c8d",
  darkGray: "#34495e", // Used for text in light theme, or backgrounds in dark theme

  // Light Theme Specific Colors
  light: {
    background: "#F8F9FA", // Light background
    cardBackground: "#FFFFFF", // White cards
    textPrimary: "#2D3436", // Dark text
    textSecondary: "#636E72", // Medium gray text
    textMuted: "#B2BEC3", // Light gray text
    separator: "#E0E0E0", // Light separator lines
    inputBackground: "rgba(255,255,255,0.95)", // Input background
    inputBorder: "#E1E1E1", // Input border
    iconBackground: "#F2F2F7", // Light icon background
  },

  // Dark Theme Specific Colors
  dark: {
    background: "#121212", // Very dark background
    cardBackground: "#1E1E1E", // Darker cards
    textPrimary: "#FFFFFF", // White text
    textSecondary: "#B0B0B0", // Light gray text
    textMuted: "#888888", // Darker gray text
    separator: "#333333", // Dark separator lines
    inputBackground: "rgba(30,30,30,0.95)", // Input background
    inputBorder: "#3A3A3C", // Input border
    iconBackground: "#3A3A3C", // Dark icon background
  },

  // Specific colors for settings page icons (can be used in both themes)
  settingsIcon1: ["#6C5CE7", "#A29BFE"], // Purple
  settingsIcon2: ["#00CEC9", "#81ECEC"], // Teal
  settingsIcon3: ["#FD79A8", "#FDCB6E"], // Pink/Orange
  settingsIcon4: ["#5D62F0", "#8B90F5"], // Another blue/purple
  settingsIcon5: ["#FF6B6B", "#FFA07A"], // Red/Orange
  settingsIcon6: ["#2ECC71", "#27AE60"], // Green
  settingsIcon7: ["#FFC312", "#F79F1F"], // Yellow/Orange
  settingsIcon8: ["#12CBC4", "#0652DD"], // Cyan/Blue
}

export const GRADIENTS = {
  // General purpose gradients
  primary: [COLORS.primary, COLORS.primaryDark],
  secondary: [COLORS.secondary, COLORS.secondaryLight],
  sunset: ["#ff9a9e", "#fecfef"],
  ocean: ["#667eea", "#764ba2"],

  // Card gradients (dynamic based on theme)
  cardLight: ["rgba(255,255,255,0.95)", "rgba(255,255,255,0.85)"],
  cardDark: ["rgba(30,30,30,0.95)", "rgba(30,30,30,0.85)"],

  // Header gradients (dynamic based on theme)
  headerLight: [COLORS.primary, COLORS.secondary],
  headerDark: [COLORS.dark.cardBackground, COLORS.dark.cardBackground], // Solid dark for header

  // Input gradients (dynamic based on theme)
  inputLight: ["rgba(255,255,255,0.95)", "rgba(255,255,255,0.85)"],
  inputDark: ["rgba(30,30,30,0.95)", "rgba(30,30,30,0.85)"],

  // Specific gradients for settings page icons (from COLORS.settingsIconX)
  settingsIcon1: COLORS.settingsIcon1,
  settingsIcon2: COLORS.settingsIcon2,
  settingsIcon3: COLORS.settingsIcon3,
  settingsIcon4: COLORS.settingsIcon4,
  settingsIcon5: COLORS.settingsIcon5,
  settingsIcon6: COLORS.settingsIcon6,
  settingsIcon7: COLORS.settingsIcon7,
  settingsIcon8: COLORS.settingsIcon8,
  danger: [COLORS.error, COLORS.error], // Ensure danger is always an array
}

export const SIZES = {
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
}

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
}
