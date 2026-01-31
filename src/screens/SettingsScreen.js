// Settings Screen - User preferences and account management
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Button, Input } from '../components';
import { colors, spacing, layout, typography } from '../config/theme';
import { getSubscriptionInfo, checkProStatus } from '../utils/purchases';
import { getCurrentUser } from '../utils/auth';

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

export default function SettingsScreen({ navigation }) {
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const [focus, setFocus] = useState('');
  const [formality, setFormality] = useState(3);
  const [directness, setDirectness] = useState(4);
  const [detail, setDetail] = useState(3);
  const [isPro, setIsPro] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadSettings();
    loadSubscription();
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('userProfile');
      if (saved) {
        const profile = JSON.parse(saved);
        setName(profile.name || '');
        setProfession(profile.profession || '');
        setFocus(profile.focus || '');
        setFormality(profile.formality || 3);
        setDirectness(profile.directness || 4);
        setDetail(profile.detail || 3);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadSubscription = async () => {
    const proStatus = await checkProStatus();
    setIsPro(proStatus);
    
    if (proStatus) {
      const info = await getSubscriptionInfo();
      setSubscriptionInfo(info);
    }
  };

  const handleSave = async () => {
    try {
      const profile = {
        name,
        profession,
        focus,
        formality,
        directness,
        detail,
      };
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      Alert.alert('Success', 'Settings saved!');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text variant="body" color={colors.textSecondary}>←</Text>
        </TouchableOpacity>
        <Text variant="h3">Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Subscription Status */}
        <View style={styles.section}>
          <Text variant="tiny" style={styles.sectionLabel}>SUBSCRIPTION</Text>
          <View style={styles.subscriptionCard}>
            {isPro ? (
              <>
                <Text variant="h3" color={colors.primary}>PRO ACTIVE ✓</Text>
                {subscriptionInfo && subscriptionInfo.expirationDate && (
                  <Text variant="small" color={colors.textSecondary} style={styles.subText}>
                    Renews: {new Date(subscriptionInfo.expirationDate).toLocaleDateString()}
                  </Text>
                )}
              </>
            ) : (
              <>
                <Text variant="h3">Free Tier</Text>
                <Text variant="small" color={colors.textSecondary} style={styles.subText}>
                  20 messages/day • 1 coach
                </Text>
                <Button
                  title="Upgrade to Pro"
                  onPress={() => navigation.navigate('paywall')}
                  variant="primary"
                  style={styles.upgradeButton}
                />
              </>
            )}
          </View>
        </View>

        {/* Profile */}
        <View style={styles.section}>
          <Text variant="tiny" style={styles.sectionLabel}>PROFILE</Text>
          
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
              {professions.map((prof) => (
                <TouchableOpacity
                  key={prof}
                  style={[
                    styles.professionButton,
                    profession === prof && styles.professionButtonActive
                  ]}
                  onPress={() => setProfession(prof)}
                >
                  <Text style={[
                    styles.professionText,
                    profession === prof && styles.professionTextActive
                  ]}>{prof}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Input
            label="CURRENT FOCUS"
            value={focus}
            onChangeText={setFocus}
            placeholder="What are you working on?"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Coaching Style */}
        <View style={styles.section}>
          <Text variant="tiny" style={styles.sectionLabel}>COACHING STYLE</Text>
          
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

        {/* Account Info */}
        {user && (
          <View style={styles.section}>
            <Text variant="tiny" style={styles.sectionLabel}>ACCOUNT</Text>
            <View style={styles.infoCard}>
              <Text variant="small" color={colors.textSecondary}>
                User ID: {user.uid.substring(0, 8)}...
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <Button
          title="Save Changes"
          onPress={handleSave}
          variant="primary"
        />
      </View>
    </View>
  );
}

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
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    marginBottom: spacing.sm,
    letterSpacing: typography.letterSpacingWide,
  },
  subscriptionCard: {
    backgroundColor: colors.bgSecondary,
    padding: spacing.md,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  subText: {
    marginTop: spacing.xs,
  },
  upgradeButton: {
    marginTop: spacing.sm,
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
  professionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgSecondary,
  },
  professionButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  professionText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  professionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  sliderTrack: {
    marginBottom: spacing.xs,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCard: {
    backgroundColor: colors.bgTertiary,
    padding: spacing.sm,
    borderRadius: 2,
  },
  footer: {
    paddingHorizontal: layout.marginHorizontal,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
