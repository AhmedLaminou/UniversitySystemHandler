import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, LAYOUT } from '../../utils/constants';

interface CyberCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  variant?: 'cyan' | 'purple' | 'magenta' | 'default';
  gradient?: boolean;
}

export const CyberCard: React.FC<CyberCardProps> = ({ 
  children, 
  style, 
  contentStyle,
  variant = 'cyan',
  gradient = false
}) => {
  const getBorderColor = () => {
    switch (variant) {
      case 'cyan': return COLORS.cyberCyan;
      case 'purple': return COLORS.cyberPurple;
      case 'magenta': return COLORS.cyberMagenta;
      default: return 'transparent';
    }
  };

  const borderColor = getBorderColor();

  return (
    <View style={[styles.container, style]}>
      {/* Neon Glow Layer */}
      <View style={[styles.glow, { borderColor: borderColor, shadowColor: borderColor }]} />
      
      {/* Content Layer */}
      <LinearGradient
        colors={gradient ? [COLORS.surfaceLight, COLORS.surface] : [COLORS.surface, COLORS.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.content, { borderColor: borderColor, borderWidth: 1 }, contentStyle]}
      >
        {children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: LAYOUT.radius,
    borderWidth: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5, // Android shadow
  },
  content: {
    borderRadius: LAYOUT.radius,
    padding: LAYOUT.padding,
    overflow: 'hidden',
  },
});
