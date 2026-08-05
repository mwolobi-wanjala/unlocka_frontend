// components/TypingText.tsx - Typewriter effect
import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

interface TypingTextProps {
  texts: string[];
  speed?: number;
  style?: object;
}

const TypingText: React.FC<TypingTextProps> = ({ texts, speed = 100, style }) => {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (charIndex < texts[textIndex].length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + texts[textIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setDisplayText('');
        setCharIndex(0);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [charIndex, textIndex]);

  return (
    <Text style={[{ color: COLORS.gray, fontSize: FONTS.sizes.sm, textAlign: 'center' }, style]}>
      {displayText}
      <Text style={{ opacity: 0.5 }}>|</Text>
    </Text>
  );
};

export default TypingText;
