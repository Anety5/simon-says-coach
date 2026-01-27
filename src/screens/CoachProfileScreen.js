// Coach Profile Screen - View and purchase individual coach
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Text, Button } from '../components';
import { colors, spacing, layout, typography } from '../config/theme';
import { recordCoachPurchase } from '../utils/firestore';
import { getCurrentUser } from '../utils/auth';

export default function CoachProfileScreen({ navigation, route }) {
  const { coach } = route.params;
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = async () => {
    setIsPurchasing(true);

    try {
      // Get current user
      const user = await getCurrentUser();
      if (!user) {
        Alert.alert('Error', 'Please sign in to purchase coaches');
        setIsPurchasing(false);
        return;
      }

      // In production, this would call RevenueCat
      // For demo, we'll simulate the purchase
      Alert.alert(
        'Purchase Confirmation',
        `Purchase ${coach.name} for $${coach.price}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setIsPurchasing(false)
          },
          {
            text: 'Buy Now',
            onPress: async () => {
              // Record purchase in Firestore
              const result = await recordCoachPurchase(user.uid, coach.id);
              
              if (result.success) {
                Alert.alert(
                  'Success!',
                  `${coach.name} has been added to your library`,
                  [
                    {
                      text: 'Start Coaching',
                      onPress: () => navigation.navigate('chat', { coachType: coach.id })
                    }
                  ]
                );
              } else {
                Alert.alert('Error', 'Purchase failed. Please try again.');
              }
              
              setIsPurchasing(false);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
      setIsPurchasing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Coach Title */}
        <Text variant="h1" style={styles.coachName}>{coach.name}</Text>
        
        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>One-time purchase</Text>
          <Text style={styles.price}>${coach.price}</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Coach</Text>
          <Text style={styles.description}>{coach.description}</Text>
        </View>

        {/* Creator Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Creator</Text>
          <View style={styles.creatorCard}>
            <Text style={styles.creatorName}>{coach.creatorName}</Text>
            {coach.creatorBio && (
              <Text style={styles.creatorBio}>{coach.creatorBio}</Text>
            )}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>⭐ {coach.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{coach.purchases}</Text>
            <Text style={styles.statLabel}>Purchases</Text>
          </View>
        </View>

        {/* Sample Conversation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What You'll Get</Text>
          <View style={styles.featureList}>
            <Text style={styles.feature}>✓ Specialized coaching in this domain</Text>
            <Text style={styles.feature}>✓ Custom prompts and methodology</Text>
            <Text style={styles.feature}>✓ Available 24/7 in your library</Text>
            <Text style={styles.feature}>✓ Works with all features (voice, image)</Text>
          </View>
        </View>
      </ScrollView>

      {/* Purchase Button */}
      <View style={styles.footer}>
        <Button
          title={isPurchasing ? 'Processing...' : `Buy for $${coach.price}`}
          onPress={handlePurchase}
          variant="primary"
          disabled={isPurchasing}
        />
        {isPurchasing && (
          <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
        )}
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
    paddingHorizontal: layout.marginHorizontal,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  backButton: {
    marginBottom: spacing.sm,
  },
  backText: {
    fontSize: 28,
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: layout.marginHorizontal,
    paddingBottom: spacing.xl,
  },
  coachName: {
    marginBottom: spacing.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  priceLabel: {
    fontSize: typography.sizeSmall,
    color: colors.textTertiary,
  },
  price: {
    fontSize: typography.sizeH2,
    fontWeight: typography.weightSemibold,
    color: colors.primary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizeH3,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.sizeBody,
    color: colors.textSecondary,
    lineHeight: typography.lineHeightRelaxed * typography.sizeBody,
  },
  creatorCard: {
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: spacing.md,
  },
  creatorName: {
    fontSize: typography.sizeBody,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  creatorBio: {
    fontSize: typography.sizeSmall,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.sizeH3,
    fontWeight: typography.weightSemibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizeSmall,
    color: colors.textTertiary,
  },
  featureList: {
    gap: spacing.sm,
  },
  feature: {
    fontSize: typography.sizeBody,
    color: colors.textSecondary,
    lineHeight: typography.lineHeightNormal * typography.sizeBody,
  },
  footer: {
    paddingHorizontal: layout.marginHorizontal,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bgSecondary,
  },
  loader: {
    marginTop: spacing.sm,
  },
});
