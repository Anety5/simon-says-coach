// Marketplace Screen - Browse and purchase community coaches
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '../components';
import { colors, spacing, layout, typography } from '../config/theme';
import { getMarketplaceCoaches } from '../utils/firestore';

export default function MarketplaceScreen({ navigation }) {
  const [coaches, setCoaches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMarketplaceCoaches();
  }, []);

  const loadMarketplaceCoaches = async () => {
    setIsLoading(true);
    const result = await getMarketplaceCoaches();
    if (result.success) {
      setCoaches(result.coaches);
    }
    setIsLoading(false);
  };

  const handleCoachPress = (coach) => {
    navigation.navigate('coachProfile', { coach });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading coaches...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text variant="h2" style={styles.title}>Coach Marketplace</Text>
        <Text style={styles.subtitle}>Discover AI coaches created by the community</Text>
      </View>

      {/* Coach Grid */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.coachGrid}>
        {coaches.map((coach) => (
          <TouchableOpacity
            key={coach.id}
            style={styles.coachCard}
            onPress={() => handleCoachPress(coach)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.coachName}>{coach.name}</Text>
              <View style={styles.priceTag}>
                <Text style={styles.price}>${coach.price}</Text>
              </View>
            </View>

            <Text style={styles.description} numberOfLines={2}>
              {coach.description}
            </Text>

            <View style={styles.creatorInfo}>
              <Text style={styles.creatorLabel}>by </Text>
              <Text style={styles.creatorName}>{coach.creatorName}</Text>
            </View>

            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>⭐ {coach.rating}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{coach.purchases} purchases</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgPrimary,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  header: {
    paddingHorizontal: layout.marginHorizontal,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginBottom: spacing.sm,
  },
  backText: {
    fontSize: 28,
    color: colors.textPrimary,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.sizeBody,
  },
  scrollView: {
    flex: 1,
  },
  coachGrid: {
    paddingHorizontal: layout.marginHorizontal,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  coachCard: {
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  coachName: {
    flex: 1,
    fontSize: typography.sizeH3,
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
  },
  priceTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 2,
  },
  price: {
    color: '#FFFFFF',
    fontSize: typography.sizeSmall,
    fontWeight: typography.weightSemibold,
  },
  description: {
    fontSize: typography.sizeBody,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: typography.lineHeightNormal * typography.sizeBody,
  },
  creatorInfo: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  creatorLabel: {
    fontSize: typography.sizeSmall,
    color: colors.textTertiary,
  },
  creatorName: {
    fontSize: typography.sizeSmall,
    color: colors.textPrimary,
    fontWeight: typography.weightMedium,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.sizeSmall,
    color: colors.textTertiary,
  },
});
