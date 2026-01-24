import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Animated } from 'react-native';
import { Text } from './Text';
import { colors, spacing, typography } from '../config/theme';

export const HamburgerMenu = ({ currentScreen, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { key: 'library', label: 'COACHES', icon: '◎' },
    { key: 'conversations', label: 'HISTORY', icon: '◈' },
    { key: 'settings', label: 'SETTINGS', icon: '◐' },
  ];

  return (
    <>
      {/* Hamburger Icon - Three minimal lines */}
      <TouchableOpacity 
        style={styles.hamburger} 
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <View style={styles.line} />
        <View style={styles.line} />
        <View style={styles.line} />
      </TouchableOpacity>

      {/* Expandable Menu Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.menuContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.menuItem,
                  currentScreen === item.key && styles.menuItemActive
                ]}
                onPress={() => {
                  onNavigate(item.key);
                  setIsOpen(false);
                }}
              >
                <Text 
                  variant="h3" 
                  style={styles.menuIcon}
                  color={currentScreen === item.key ? colors.primary : colors.textSecondary}
                >
                  {item.icon}
                </Text>
                <Text 
                  variant="small" 
                  style={styles.menuLabel}
                  color={currentScreen === item.key ? colors.primary : colors.textSecondary}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
            
            {/* Close indicator */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setIsOpen(false)}
            >
              <Text variant="tiny" color={colors.textTertiary}>TAP TO CLOSE</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  hamburger: {
    padding: spacing.sm,
    justifyContent: 'space-around',
    width: 48,
    height: 48,
  },
  line: {
    width: 24,
    height: 2,
    backgroundColor: colors.textPrimary,
    marginVertical: 3,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 2,
    padding: spacing.lg,
    minWidth: 240,
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemActive: {
    borderLeftWidth: 2,
    borderLeftColor: colors.primary,
  },
  menuIcon: {
    marginRight: spacing.sm,
    fontSize: 24,
  },
  menuLabel: {
    letterSpacing: typography.letterSpacingWide,
    fontWeight: typography.weightMedium,
  },
  closeButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
  },
});
