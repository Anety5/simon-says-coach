import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Button, Card } from '../components';
import { colors, spacing, typography, layout } from '../config/theme';
import { checkProStatus } from '../utils/purchases';

const COACHES = [
  {
    id: 'productivity',
    title: 'PRODUCTIVITY',
    description: 'Tactical systems for managing tasks, time, and output',
    icon: '⚡',
  },
  {
    id: 'strategy',
    title: 'STRATEGY',
    description: 'Long-term thinking, decision frameworks, planning',
    icon: '◎',
  },
  {
    id: 'growth',
    title: 'GROWTH',
    description: 'Skills development, learning paths, career progression',
    icon: '↑',
  },
  {
    id: 'focus',
    title: 'FOCUS',
    description: 'Concentration, deep work, eliminating distractions',
    icon: '◈',
  },
  {
    id: 'wellness',
    title: 'WELLNESS',
    description: 'Balance, energy management, sustainable performance',
    icon: '◐',
  },
  {
    id: 'creative',
    title: 'CREATIVE',
    description: 'Idea generation, creative process, experimentation',
    icon: '◇',
  },
];

export default function CoachLibraryScreen({ navigation }) {
  const [activeCoach, setActiveCoach] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [scaleAnims] = useState(COACHES.map(() => new Animated.Value(1)));

  useEffect(() => {
    loadActiveCoach();
    checkSubscription();
  }, []);

  const loadActiveCoach = async () => {
    try {
      const saved = await AsyncStorage.getItem('activeCoach');
      if (saved) {
        setActiveCoach(saved);
      }
    } catch (error) {
      console.error('Error loading active coach:', error);
    }
  };

  const checkSubscription = async () => {
    const proStatus = await checkProStatus();
    setIsPro(proStatus);
  };

  const handleCoachSelect = async (coachId, index) => {
    // Animate press
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 0.97,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnims[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();

    // Free tier: only 1 active coach allowed (or upgrade to Pro)
    if (!isPro && activeCoach && activeCoach !== coachId) {
      alert('💡 Free tier allows 1 active coach. Upgrade to Pro to access all 6 coaches!');
      navigation.navigate('paywall');
      return;
    }

    setActiveCoach(coachId);
    try {
      await AsyncStorage.setItem('activeCoach', coachId);
    } catch (error) {
      console.error('Error saving active coach:', error);
    }
  };

  const handleStartChat = () => {
    if (activeCoach) {
      navigation.navigate('chat', { coachType: activeCoach });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="display" style={styles.simonSays}>
          Simon Says
        </Text>
        <Text variant="h2" style={styles.instruction}>Choose your coach</Text>
        <Text variant="small" color={colors.textSecondary} style={styles.subtitle}>
          Select one to start (Free tier)
        </Text>
      </View>

      {/* Coach Grid */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {COACHES.map((coach, index) => (
          <Animated.View
            key={coach.id}
            style={{ transform: [{ scale: scaleAnims[index] }] }}
          >
            <TouchableOpacity
              onPress={() => handleCoachSelect(coach.id, index)}
              activeOpacity={0.9}
            >
              <View style={[
                styles.coachCard,
                activeCoach === coach.id && styles.coachCardActive
              ]}>
                <Text variant="h1" style={styles.coachIcon}>{coach.icon}</Text>
                <Text variant="h3" style={styles.coachTitle}>{coach.title}</Text>
                <Text 
                  variant="small" 
                  color={colors.textSecondary}
                  style={styles.coachDescription}
                >
                  {coach.description}
                </Text>
                
                {/* Status */}
                <View style={styles.statusContainer}>
                  {activeCoach === coach.id ? (
                    <View style={styles.activeBadge}>
                      <Text variant="tiny" color={colors.primary}>● ACTIVE</Text>
                    </View>
                  ) : (
                    <Text variant="tiny" color={colors.textTertiary}>TAP TO ACTIVATE</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* Custom Coach - Pro Feature */}
        <TouchableOpacity
          onPress={() => {
            if (isPro) {
              alert('Custom coach creator coming soon!');
            } else {
              navigation.navigate('paywall');
            }
          }}
          activeOpacity={0.9}
        >
          <View style={styles.proCard}>
            <Text variant="h3" style={styles.proTitle}>CREATE CUSTOM COACH</Text>
            <Text variant="small" color={colors.textSecondary} style={styles.proDescription}>
              Design your own coaching personality
            </Text>
            <View style={styles.lockBadge}>
              <Text variant="tiny" color={colors.textTertiary}>
                {isPro ? '🔓 COMING SOON' : '🔒 PRO FEATURE'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Action */}
      {activeCoach && (
        <View style={styles.footer}>
          <Button 
            title="START COACHING SESSION" 
            onPress={handleStartChat}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    paddingHorizontal: layout.marginHorizontal,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  simonSays: {
    fontWeight: '300',
    marginBottom: spacing.xs,
    color: colors.textTertiary,
  },
  instruction: {
    marginBottom: spacing.sm,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    lineHeight: typography.lineHeightNormal * typography.sizeSmall,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.marginHorizontal,
    paddingBottom: spacing.xxl,
  },
  coachCard: {
    backgroundColor: colors.bgSecondary,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  coachCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.bgSecondary,
  },
  coachIcon: {
    fontSize: 40,
    marginBottom: spacing.xs,
  },
  coachTitle: {
    marginBottom: spacing.xs,
    letterSpacing: typography.letterSpacingWide,
  },
  coachDescription: {
    marginBottom: spacing.sm,
    lineHeight: typography.lineHeightNormal * typography.sizeSmall,
  },
  statusContainer: {
    marginTop: spacing.xs,
  },
  activeBadge: {
    alignSelf: 'flex-start',
  },
  proCard: {
    backgroundColor: colors.bgTertiary,
    padding: spacing.md,
    marginTop: spacing.md,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  proTitle: {
    marginBottom: spacing.xs,
    letterSpacing: typography.letterSpacingWide,
  },
  proDescription: {
    marginBottom: spacing.sm,
    lineHeight: typography.lineHeightNormal * typography.sizeSmall,
  },
  lockBadge: {
    marginTop: spacing.xs,
  },
  footer: {
    padding: layout.marginHorizontal,
    backgroundColor: colors.bgSecondary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
