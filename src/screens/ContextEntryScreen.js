// Context Entry Screen - Onboarding 1/3
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Input, Text } from '../components';
import { colors, spacing, layout } from '../config/theme';

export const ContextEntryScreen = ({ navigation, userProfile, setUserProfile }) => {
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [focus, setFocus] = useState('');

  // Load saved data on mount
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const saved = await AsyncStorage.getItem('userProfile');
      if (saved) {
        const profile = JSON.parse(saved);
        setName(profile.name || '');
        setProfession(profile.profession || '');
        setFocus(profile.focus || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const professions = [
    'Content Creator',
    'Freelancer',
    'Startup Founder',
    'Student',
    'Corporate Professional',
    'Other'
  ];

  const handleContinue = async () => {
    const profile = { name, profession, focus };
    try {
      const existing = await AsyncStorage.getItem('userProfile');
      const saved = existing ? JSON.parse(existing) : {};
      const updated = { ...saved, ...profile };
      await AsyncStorage.setItem('userProfile', JSON.stringify(updated));
      if (setUserProfile) setUserProfile(updated);
      console.log('Context saved:', updated);
    } catch (error) {
      console.error('Error saving context:', error);
    }
    navigation.navigate('tone');
  };

  const handleSkip = () => {
    console.log('Skipped context entry');
    navigation.navigate('tone');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text variant="body" color={colors.textSecondary}>←</Text>
        </TouchableOpacity>
        <Text variant="small" color={colors.textTertiary}>1/3</Text>
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
          Tell me about yourself
        </Text>

        <View style={styles.form}>
          <Input
            label="YOUR NAME"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            autoCapitalize="words"
          />

          <View style={styles.inputContainer}>
            <Text variant="tiny" style={styles.label}>YOUR PROFESSION</Text>
            <View style={styles.pickerContainer}>
              <select
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                style={styles.picker}
              >
                <option value="">Select profession...</option>
                {professions.map((prof) => (
                  <option key={prof} value={prof}>{prof}</option>
                ))}
              </select>
            </View>
          </View>

          <Input
            label="CURRENT FOCUS"
            value={focus}
            onChangeText={setFocus}
            placeholder="What are you working on?"
            multiline
            numberOfLines={4}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          variant="primary"
        />
        
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text variant="body" color={colors.textSecondary}>
            Skip for now
          </Text>
        </TouchableOpacity>
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
  subtitle: {
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.sm,
  },
  label: {
    marginBottom: spacing.xs,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.bgSecondary,
    overflow: 'hidden',
  },
  picker: {
    height: 56,
    paddingHorizontal: 16,
    fontSize: 17,
    fontFamily: 'System',
    color: colors.textPrimary,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  footer: {
    paddingHorizontal: layout.marginHorizontal,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
});

export default ContextEntryScreen;
