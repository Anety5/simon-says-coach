// Text Component - Typography Variants
import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { colors, typography } from '../config/theme';

export const Text = ({ 
  children, 
  variant = 'body', 
  color,
  style,
  ...props 
}) => {
  const textStyle = [
    styles[variant],
    color && { color },
    style
  ];

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  display: {
    fontSize: typography.sizeDisplay,
    fontWeight: typography.weightLight,
    color: colors.textPrimary,
    lineHeight: typography.sizeDisplay * typography.lineHeightTight,
    letterSpacing: typography.letterSpacingTight,
  },
  h1: {
    fontSize: typography.sizeH1,
    fontWeight: typography.weightLight,
    color: colors.textPrimary,
    lineHeight: typography.sizeH1 * typography.lineHeightTight,
    letterSpacing: typography.letterSpacingTight,
  },
  h2: {
    fontSize: typography.sizeH2,
    fontWeight: typography.weightRegular,
    color: colors.textPrimary,
    lineHeight: typography.sizeH2 * typography.lineHeightNormal,
    letterSpacing: typography.letterSpacingTight,
  },
  h3: {
    fontSize: typography.sizeH3,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
    lineHeight: typography.sizeH3 * typography.lineHeightNormal,
  },
  body: {
    fontSize: typography.sizeBody,
    fontWeight: typography.weightRegular,
    color: colors.textPrimary,
    lineHeight: typography.sizeBody * typography.lineHeightNormal,
  },
  small: {
    fontSize: typography.sizeSmall,
    fontWeight: typography.weightRegular,
    color: colors.textSecondary,
    lineHeight: typography.sizeSmall * typography.lineHeightNormal,
  },
  tiny: {
    fontSize: typography.sizeTiny,
    fontWeight: typography.weightMedium,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacingWide,
  },
  quote: {
    fontSize: typography.sizeBody,
    fontWeight: typography.weightLight,
    fontStyle: 'italic',
    color: colors.textSecondary,
    lineHeight: typography.sizeBody * typography.lineHeightRelaxed,
    textAlign: 'center',
  },
});

export default Text;
