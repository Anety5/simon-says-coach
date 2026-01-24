// Conversations Screen - View conversation history
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Text } from '../components';
import { colors, spacing, layout, typography } from '../config/theme';
import { getCurrentUser } from '../utils/auth';
import { getUserConversations } from '../utils/firestore';

const COACH_INFO = {
  productivity: { title: 'PRODUCTIVITY', icon: '⚡' },
  strategy: { title: 'STRATEGY', icon: '◎' },
  growth: { title: 'GROWTH', icon: '↑' },
  focus: { title: 'FOCUS', icon: '◈' },
  wellness: { title: 'WELLNESS', icon: '◐' },
  creative: { title: 'CREATIVE', icon: '◇' },
};

export default function ConversationsScreen({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const user = getCurrentUser();
      if (!user) {
        console.error('No user found');
        setLoading(false);
        return;
      }

      const result = await getUserConversations(user.uid);
      if (result.success) {
        setConversations(result.data);
        console.log(`Loaded ${result.data.length} conversations`);
      } else {
        console.error('Error loading conversations:', result.error);
      }
    } catch (error) {
      console.error('Error in loadConversations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadConversations();
  };

  const handleConversationPress = (conversation) => {
    // Navigate to chat with this conversation
    navigation.navigate('chat', { 
      coachType: conversation.coachId,
      conversationId: conversation.id,
      resuming: true
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return minutes < 1 ? 'Just now' : `${minutes}m ago`;
    }
    
    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }
    
    // Less than 7 days
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}d ago`;
    }
    
    // Show date
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text variant="body" color={colors.textSecondary}>←</Text>
          </TouchableOpacity>
          <Text variant="h3">Conversations</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text variant="small" color={colors.textSecondary} style={styles.loadingText}>
            Loading conversations...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text variant="body" color={colors.textSecondary}>←</Text>
        </TouchableOpacity>
        <Text variant="h3">Conversations</Text>
        <TouchableOpacity onPress={handleRefresh}>
          <Text variant="body" color={colors.textSecondary}>↻</Text>
        </TouchableOpacity>
      </View>

      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="h1" style={styles.emptyIcon}>◈</Text>
          <Text variant="h3" style={styles.emptyTitle}>No conversations yet</Text>
          <Text variant="small" color={colors.textSecondary} style={styles.emptyText}>
            Start coaching to see your conversation history here
          </Text>
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => navigation.navigate('library')}
          >
            <Text variant="body" color={colors.primary}>Choose a Coach →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {conversations.map((conversation) => {
            const coach = COACH_INFO[conversation.coachId] || { title: 'UNKNOWN', icon: '◎' };
            return (
              <TouchableOpacity
                key={conversation.id}
                onPress={() => handleConversationPress(conversation)}
                activeOpacity={0.7}
              >
                <View style={styles.conversationCard}>
                  <View style={styles.conversationHeader}>
                    <View style={styles.coachInfo}>
                      <Text variant="h2" style={styles.coachIcon}>{coach.icon}</Text>
                      <View style={styles.coachDetails}>
                        <Text variant="h3" style={styles.coachTitle}>{coach.title}</Text>
                        <Text variant="tiny" color={colors.textTertiary}>
                          {conversation.messageCount || 0} messages
                        </Text>
                      </View>
                    </View>
                    <Text variant="tiny" color={colors.textTertiary}>
                      {formatDate(conversation.lastMessageAt)}
                    </Text>
                  </View>
                  
                  <View style={styles.conversationFooter}>
                    <Text variant="small" color={colors.textSecondary}>
                      Tap to resume →
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.marginHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: layout.marginHorizontal,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
    opacity: 0.3,
  },
  emptyTitle: {
    marginBottom: spacing.xs,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: spacing.lg,
    maxWidth: 280,
  },
  startButton: {
    paddingVertical: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: layout.marginHorizontal,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xxl,
  },
  conversationCard: {
    backgroundColor: colors.bgSecondary,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  coachInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  coachIcon: {
    fontSize: 32,
    marginRight: spacing.sm,
  },
  coachDetails: {
    flex: 1,
  },
  coachTitle: {
    marginBottom: 2,
    letterSpacing: typography.letterSpacingTight,
  },
  conversationFooter: {
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
