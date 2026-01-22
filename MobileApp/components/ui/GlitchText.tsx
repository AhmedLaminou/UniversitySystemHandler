import React, { useEffect, useRef } from 'react';
import { Text, TextStyle, Animated } from 'react-native';
import { COLORS, FONTS } from '../../utils/constants';

interface GlitchTextProps {
  text: string;
  style?: TextStyle;
  glitchColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GlitchText: React.FC<GlitchTextProps> = ({ 
  text, 
  style, 
  glitchColor = COLORS.cyberPurple,
  size = 'md'
}) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(2000 + Math.random() * 1000),
        Animated.timing(shakeAnim, {
          toValue: 2,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -2,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        })
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const getFontSize = () => {
    switch (size) {
      case 'sm': return 14;
      case 'md': return 18;
      case 'lg': return 24;
      case 'xl': return 32;
      default: return 18;
    }
  };

  return (
    <Animated.Text 
      style={[
        { 
          color: COLORS.text,
          fontFamily: FONTS.heading,
          fontSize: getFontSize(),
          fontWeight: 'bold',
          transform: [{ translateX: shakeAnim }],
          textShadowColor: glitchColor,
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 2,
        },
        style
      ]}
    >
      {text}
    </Animated.Text>
  );
};
