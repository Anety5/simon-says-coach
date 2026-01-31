// Welcome Screen - First screen user sees
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button, Text } from '../components';
import { colors, spacing, layout } from '../config/theme';
import { signInWithGoogle, initializeUser } from '../utils/auth';

export const WelcomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const handleGoogleSignIn = async () => {
    // Temporarily disabled - skip directly to app
    console.log('Skipping auth for now - going directly to context');
    navigation.navigate('context');
  };

  const handleContinueAnonymous = () => {
    // Temporarily disabled - skip directly to app  
    console.log('Skipping auth for now - going directly to context');
    navigation.navigate('context');
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text variant="display" style={styles.title}>
          Simon Says
        </Text>
        
        <Text variant="body" style={styles.subtitle}>
          Personal AI coaching that{'\n'}helps you focus and achieve
        </Text>
        
        <Text variant="caption" style={styles.encouragement}>
          😊 Take a moment to smile - research shows{'\n'}that mirroring positive expressions{'\n'}primes your brain for growth
        </Text>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Button
          title={isSigningIn ? "Signing in..." : "Sign in with Google"}
          onPress={handleGoogleSignIn}
          variant="primary"
          disabled={isSigningIn}
        />
        
        <TouchableOpacity 
          style={styles.anonymousButton} 
          onPress={handleContinueAnonymous}
          disabled={isSigningIn}
        >
          <Text variant="body" style={styles.anonymousText}>
            Continue without signing in
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    paddingHorizontal: layout.marginHorizontal,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: spacing.md,
    textAlign: 'center',
    fontWeight: '300',
  },
  subtitle: {
    textAlign: 'center',
    color: colors.textSecondary,
    maxWidth: 280,
  },
  encouragement: {
    marginTop: spacing.lg,
    textAlign: 'center',
    color: colors.textTertiary,
    maxWidth: 300,
    fontStyle: 'italic',
  },
  footer: {
    paddingBottom: spacing.xl,
  },
  anonymousButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  anonymousText: {
    color: colors.textSecondary,
  },
});

export default WelcomeScreen;
