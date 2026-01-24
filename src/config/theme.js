// Simon Says Coach - Design System
// Minimalist design inspired by Simon's portfolio

export const colors = {
  // Primary
  primary: '#E8704A',        // Terracotta accent
  primaryDark: '#D66340',    // Pressed state
  
  // Text
  textPrimary: '#1A1A1A',    // Almost black
  textSecondary: '#6B6B6B',  // Gray
  textTertiary: '#8C8C8C',   // Light gray
  
  // Backgrounds
  bgPrimary: '#FAFAFA',      // App background
  bgSecondary: '#FFFFFF',    // Cards
  bgTertiary: '#F5F5F5',     // Subtle background
  
  // Borders
  border: '#E5E5E5',         // Borders, dividers
  borderActive: '#E8704A',   // Active/focus state
  
  // Status
  success: '#4CAF50',
  error: '#EF5350',
  warning: '#FFF8E1',
};

export const typography = {
  // Font families
  fontFamily: 'System', // Will use SF Pro on iOS, Roboto on Android
  
  // Font sizes
  sizeDisplay: 40,
  sizeH1: 32,
  sizeH2: 28,
  sizeH3: 20,
  sizeBody: 17,
  sizeSmall: 14,
  sizeTiny: 12,
  
  // Font weights
  weightLight: '300',
  weightRegular: '400',
  weightMedium: '500',
  weightSemibold: '600',
  
  // Line heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.8,
  
  // Letter spacing
  letterSpacingTight: -0.4,  // -0.02em at 20px = -0.4px
  letterSpacingNormal: 0,
  letterSpacingWide: 0.3,    // 0.02em at 15px = 0.3px
};

export const spacing = {
  // 8px grid system
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 64,
};

export const layout = {
  marginHorizontal: 24,
  maxWidth: 360,
  navHeight: 64,
  buttonHeight: 56,
  inputHeight: 56,
  iconSize: 24,
  iconSizeLarge: 64,
};

export const borderRadius = {
  small: 2,    // Minimal, architectural
  medium: 8,   // Inputs
  large: 12,   // Cards (if needed)
};

export const animation = {
  durationFast: 200,
  durationNormal: 300,
  durationSlow: 400,
};

export const shadows = {
  // Minimal shadows only
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
};

// Component-specific styles
export const components = {
  button: {
    height: layout.buttonHeight,
    borderRadius: borderRadius.small,
    paddingHorizontal: spacing.lg,
  },
  input: {
    height: layout.inputHeight,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
  },
  card: {
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.small,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
};

export default {
  colors,
  typography,
  spacing,
  layout,
  borderRadius,
  animation,
  shadows,
  components,
};
