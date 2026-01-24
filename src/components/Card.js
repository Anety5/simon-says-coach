// Card Component - Minimalist Coach Cards
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, components } from '../config/theme';

export const Card = ({ children, active = false, style }) => {
  const cardStyle = [
    styles.card,
    active && styles.activeCard,
    style
  ];

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: components.card.backgroundColor,
    borderRadius: components.card.borderRadius,
    borderWidth: components.card.borderWidth,
    borderColor: components.card.borderColor,
    padding: components.card.padding,
  },
  activeCard: {
    borderWidth: 2,
    borderColor: colors.borderActive,
  },
});

export default Card;
