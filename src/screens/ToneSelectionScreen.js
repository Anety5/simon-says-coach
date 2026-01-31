// Tone Selection Screen - Onboarding 2/3
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Text } from '../components';
import { colors, spacing, layout, typography } from '../config/theme';

const Slider = ({ label, value, onChange, minLabel, maxLabel }) => {
  return (
    <View style={styles.sliderContainer}>
      <Text variant="tiny" style={styles.sliderLabel}>{label}</Text>
      <View style={styles.sliderButtons}>
        {[1, 2, 3, 4, 5].map((val) => (
          <TouchableOpacity
            key={val}
            style={[
              styles.sliderButton,
              value === val && styles.sliderButtonActive
            ]}
            onPress={() => onChange(val)}
          >
            <Text style={[
              styles.sliderButtonText,
              value === val && styles.sliderButtonTextActive
            ]}>{val}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.sliderLabels}>
        <Text variant="small" color={colors.textTertiary}>{minLabel}</Text>
        <Text variant="small" color={colors.textTertiary}>{maxLabel}</Text>
      </View>
    </View>
  );
};

export const ToneSelectionScreen = ({ navigation, userProfile, setUserProfile }) => {
  const [formality, setFormality] = useState(3);
  const [directness, setDirectness] = useState(4);
  const [detail, setDetail] = useState(3);

  // Load saved preferences on mount
  useEffect(() => {
    loadSavedPreferences();
  }, []);

  const loadSavedPreferences = async () => {
    try {
      const saved = await AsyncStorage.getItem('userProfile');
      if (saved) {
        const profile = JSON.parse(saved);
        if (profile.formality) setFormality(profile.formality);
        if (profile.directness) setDirectness(profile.directness);
        if (profile.detail) setDetail(profile.detail);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleContinue = async () => {
    const tonePrefs = { formality, directness, detail };
    try {
      const existing = await AsyncStorage.getItem('userProfile');
      const saved = existing ? JSON.parse(existing) : {};
      const updated = { ...saved, ...tonePrefs };
      await AsyncStorage.setItem('userProfile', JSON.stringify(updated));
      if (setUserProfile) setUserProfile(updated);
      console.log('Tone preferences saved:', updated);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
    navigation.navigate('library');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text variant="body" color={colors.textSecondary}>â†</Text>
        </TouchableOpacity>
        <Text variant="small" color={colors.textTertiary}>2/3</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="display" style={styles.simonSays}>
          Simon Says
        </Text>
        
        <Text variant="h2" style={styles.instruction}>
          Choose your coaching style
        </Text>
        
        <Text variant="small" color={colors.textSecondary} style={styles.subtitle}>
          Adjust how your coach communicates
        </Text>

        <View style={styles.slidersContainer}>
          <Slider
            label="FORMALITY"
            value={formality}
            onChange={setFormality}
            minLabel="Casual"
            maxLabel="Professional"
          />

          <Slider
            label="DIRECTNESS"
            value={directness}
            onChange={setDirectness}
            minLabel="Gentle"
            maxLabel="Direct"
          />

          <Slider
            label="DETAIL"
            value={detail}
            onChange={setDetail}
            minLabel="Brief"
            maxLabel="Thorough"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue to Coaches"
          onPress={handleContinue}
          variant="primary"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.marginHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: layout.marginHorizontal,
    paddingTop: spacing.xl,
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
    marginBottom: spacing.sm,
  },
  subtitle: {
    marginBottom: spacing.xl,
  },
  slidersContainer: {
    gap: spacing.lg,
  },
  sliderContainer: {
    marginBottom: spacing.md,
  },
  sliderLabel: {
    marginBottom: spacing.sm,
  },
  sliderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  sliderButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sliderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  sliderButtonTextActive: {
    color: '#fff',
  },
  sliderTrack: {
    marginBottom: spacing.xs,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    paddingHorizontal: layout.marginHorizontal,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
});

export default ToneSelectionScreen;

