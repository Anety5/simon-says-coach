// Input Component - Minimal Text Fields
import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, components } from '../config/theme';

export const Input = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder,
  multiline = false,
  numberOfLines = 1,
  style,
  error,
  ...props 
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          isFocused && styles.focusedInput,
          error && styles.errorInput
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        multiline={multiline}
        numberOfLines={numberOfLines}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: typography.sizeTiny,
    fontWeight: typography.weightMedium,
    color: colors.textTertiary,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
    letterSpacing: typography.letterSpacingWide,
  },
  input: {
    height: components.input.height,
    borderRadius: components.input.borderRadius,
    borderWidth: components.input.borderWidth,
    borderColor: colors.border,
    paddingHorizontal: components.input.paddingHorizontal,
    fontSize: typography.sizeBody,
    fontWeight: typography.weightRegular,
    color: colors.textPrimary,
    backgroundColor: colors.bgSecondary,
  },
  multilineInput: {
    height: 120,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    textAlignVertical: 'top',
  },
  focusedInput: {
    borderWidth: 2,
    borderColor: colors.borderActive,
  },
  errorInput: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: typography.sizeSmall,
    color: colors.error,
    marginTop: spacing.xs,
  },
});

export default Input;
