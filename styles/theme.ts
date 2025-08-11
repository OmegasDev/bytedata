export const theme = {
  colors: {
    // Primary colors
    primary: '#FFCB05', // Yellow/Gold
    secondary: '#4FD1C7', // Teal
    accent: '#FF6B6B', // Coral
    
    // Background colors
    background: '#0F1419', // Very dark blue
    dark: '#1A1F36', // Dark navy
    card: '#252A41', // Lighter dark
    
    // Text colors
    text: '#FFFFFF', // White
    textSecondary: '#8E94A8', // Light gray
    textMuted: '#5A6079', // Muted gray
    
    // Status colors
    success: '#4CAF50', // Green
    error: '#F44336', // Red  
    warning: '#FF9800', // Orange
    info: '#2196F3', // Blue
    
    // Border colors
    border: '#2C3142', // Dark border
    borderLight: '#3D4556', // Lighter border
  },
  
  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.18,
      shadowRadius: 2.0,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 4.0,
      elevation: 4,
    },
  },
} as const;