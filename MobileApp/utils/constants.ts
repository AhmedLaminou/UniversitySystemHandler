export const COLORS = {
  // Cyber Palette
  cyberCyan: '#00FFFF',
  cyberPurple: '#9D00FF',
  cyberMagenta: '#FF00E5',
  neonGreen: '#00FF00',
  
  // Backgrounds
  background: '#0A0E27',
  surface: '#12162D',
  surfaceLight: '#1A1F3A',
  surfaceDark: '#050714',
  
  // Functional
  text: '#E0E6ED',
  textMuted: '#8B92A8',
  primary: '#00FFFF',
  secondary: '#9D00FF',
  accent: '#FF00E5',
  error: '#FF3333',
  success: '#00FF00',
  border: '#2A3042',
  
  // Gradients
  gradientPrimary: ['#9D00FF', '#00FFFF'] as const,
  gradientSecondary: ['#FF00E5', '#9D00FF'] as const,
  gradientDark: ['#0A0E27', '#12162D'] as const,
};

export const FONTS = {
  heading: 'Orbitron',
  body: 'Inter',
};

export const API_URLS = {
  // Replace with local IP for physical device testing
  // Run 'ipconfig' or 'ifconfig' to find your IP
  BASE_URL: 'http://10.0.2.2', // Standard Android Emulator localhost
  
  // Ports matching docker-compose
  AUTH: '5001',
  STUDENT: '5002', 
  GRADE: '5003',
  BILLING: '5004',
  COURSE: '8082', // SOAP Service
  AI: '9000',
};

export const LAYOUT = {
  padding: 16,
  radius: 12,
  headerHeight: 60,
};
