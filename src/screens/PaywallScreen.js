// Paywall Screen - Pro Subscription
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Button } from '../components';
import { colors, spacing, layout, typography } from '../config/theme';
import { purchasePro, restorePurchases, getOfferings } from '../utils/purchases';

const PRO_FEATURES = [
  { icon: '∞', title: 'Unlimited Messages', description: 'No daily limits' },
  { icon: '◎', title: 'All 6 Coaches', description: 'Switch anytime' },
  { icon: '🎙', title: 'Voice Responses', description: 'Hear your coach speak' },
  { icon: '🎤', title: 'Voice Input', description: 'Talk to your coach' },
  { icon: '⚡', title: 'Custom Coach Creator', description: 'Design your own personality' },
  { icon: '💾', title: 'Unlimited History', description: 'All conversations saved' },
];

export default function PaywallScreen({ navigation, onDismiss }) {
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [price, setPrice] = useState('$9.99');

  useEffect(() => {
    loadPrice();
  }, []);

  const loadPrice = async () => {
    try {
      const offerings = await getOfferings();
      if (offerings && offerings.availablePackages.length > 0) {
        const monthlyPkg = offerings.availablePackages.find(p => p.identifier === 'monthly');
        if (monthlyPkg) {
          setPrice(monthlyPkg.product.priceString);
        }
      }
    } catch (error) {
      console.error('Error loading price:', error);
    }
  };

  const handlePurchase = async () => {
    setLoading(true);
    const result = await purchasePro();
    setLoading(false);

    if (result.success) {
      alert('🎉 Welcome to Pro! All features unlocked.');
      if (onDismiss) {
        onDismiss(true);
      } else {
        navigation.navigate('library');
      }
    } else if (!result.cancelled) {
      alert('Purchase failed: ' + (result.error || 'Unknown error'));
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    const result = await restorePurchases();
    setRestoring(false);

    if (result.success && result.hasPro) {
      alert('✅ Purchases restored! Pro features activated.');
      if (onDismiss) {
        onDismiss(true);
      } else {
        navigation.navigate('library');
      }
    } else if (result.success) {
      alert('No active subscriptions found.');
    } else {
      alert('Restore failed: ' + (result.error || 'Unknown error'));
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            if (onDismiss) {
              onDismiss(false);
            } else {
              navigation.navigate('library');
            }
          }}
          style={styles.closeButton}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Text variant="h3" color={colors.textSecondary}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text variant="display" style={styles.title}>
          Upgrade to Pro
        </Text>
        
        <Text variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Unlock unlimited coaching potential
        </Text>

        {/* Pricing */}
        <View style={styles.pricingCard}>
          <Text variant="h1" style={styles.price}>{price}</Text>
          <Text variant="small" color={colors.textSecondary}>per month</Text>
          <View style={styles.trialBadge}>
            <Text variant="tiny" color={colors.primary}>● CANCEL ANYTIME</Text>
          </View>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {PRO_FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Text variant="h2" style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureText}>
                <Text variant="h3" style={styles.featureTitle}>{feature.title}</Text>
                <Text variant="small" color={colors.textSecondary}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Free Tier Comparison */}
        <View style={styles.comparisonCard}>
          <Text variant="tiny" color={colors.textTertiary} style={styles.comparisonLabel}>
            FREE TIER LIMITS
          </Text>
          <Text variant="small" color={colors.textSecondary}>
            • 20 messages per day{'\n'}
            • 1 active coach only{'\n'}
            • No custom coaches{'\n'}
            • Text responses only
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.footer}>
        <Button
          title={loading ? 'Processing...' : `Subscribe for ${price}/month`}
          onPress={handlePurchase}
          variant="primary"
          disabled={loading || restoring}
        />
        
        {loading && <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />}
        
        <TouchableOpacity onPress={handleRestore} style={styles.restoreButton} disabled={restoring}>
          <Text variant="small" color={colors.textSecondary}>
            {restoring ? 'Restoring...' : 'Restore Purchases'}
          </Text>
        </TouchableOpacity>

        <Text variant="tiny" color={colors.textTertiary} style={styles.disclaimer}>
          Subscription renews automatically. Cancel anytime in your app store settings.
        </Text>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: layout.marginHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  closeButton: {
    padding: spacing.xs,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: layout.marginHorizontal,
    paddingBottom: spacing.xl,
  },
  title: {
    marginBottom: spacing.xs,
    fontWeight: '300',
  },
  subtitle: {
    marginBottom: spacing.lg,
  },
  pricingCard: {
    backgroundColor: colors.bgSecondary,
    padding: spacing.lg,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  price: {
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  trialBadge: {
    marginTop: spacing.sm,
  },
  featuresContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  featureIcon: {
    fontSize: 32,
    width: 40,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    marginBottom: 2,
    letterSpacing: typography.letterSpacingTight,
  },
  comparisonCard: {
    backgroundColor: colors.bgTertiary,
    padding: spacing.md,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  comparisonLabel: {
    marginBottom: spacing.xs,
    letterSpacing: typography.letterSpacingWide,
  },
  footer: {
    paddingHorizontal: layout.marginHorizontal,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  disclaimer: {
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: typography.lineHeightNormal * typography.sizeTiny,
  },
  loader: {
    marginTop: spacing.sm,
  },
});
