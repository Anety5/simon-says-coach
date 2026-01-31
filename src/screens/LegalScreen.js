import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Text } from '../components';
import { colors as COLORS, spacing as SPACING } from '../config/theme';

export default function LegalScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('privacy');

  const openWebVersion = (type) => {
    const url = type === 'privacy' 
      ? 'https://simon-says-coach.web.app/privacy-policy.html'
      : 'https://simon-says-coach.web.app/terms-of-service.html';
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Legal Information</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'privacy' && styles.activeTab]}
          onPress={() => setActiveTab('privacy')}
        >
          <Text style={[styles.tabText, activeTab === 'privacy' && styles.activeTabText]}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'terms' && styles.activeTab]}
          onPress={() => setActiveTab('terms')}
        >
          <Text style={[styles.tabText, activeTab === 'terms' && styles.activeTabText]}>
            Terms of Service
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'privacy' ? <PrivacyContent /> : <TermsContent />}
        
        <TouchableOpacity 
          style={styles.webLink}
          onPress={() => openWebVersion(activeTab)}
        >
          <Text style={styles.webLinkText}>
            View full version on web →
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function PrivacyContent() {
  return (
    <View>
      <Text style={styles.updated}>Last Updated: January 26, 2026</Text>

      <Text style={styles.sectionTitle}>1. Introduction</Text>
      <Text style={styles.paragraph}>
        Simon Says AI Coach is committed to protecting your privacy. This Privacy Policy explains 
        how we collect, use, and safeguard your information when you use our mobile application and services.
      </Text>

      <Text style={styles.sectionTitle}>2. Information We Collect</Text>
      <Text style={styles.subheading}>Account Information</Text>
      <Text style={styles.paragraph}>
        We use Firebase Authentication to create and manage your account. We collect anonymous user 
        identifiers and authentication timestamps.
      </Text>

      <Text style={styles.subheading}>User Content</Text>
      <Text style={styles.paragraph}>
        To provide personalized coaching, we store your context entries (goals, projects, background), 
        chat conversations with AI coaches, custom coach configurations, and selected preferences.
      </Text>

      <Text style={styles.subheading}>Marketplace Data</Text>
      <Text style={styles.paragraph}>
        When you interact with the Coach Marketplace, we store purchased coaches, purchase history, 
        ratings and reviews you submit, and published coaches if you're a creator.
      </Text>

      <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
      <Text style={styles.paragraph}>
        We use collected information to provide personalized AI coaching services, process your 
        conversations with Google Gemini AI, maintain chat history and context, enable marketplace 
        purchases and creator payments, and improve app functionality.
      </Text>

      <Text style={styles.sectionTitle}>4. Third-Party Services</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Google Gemini AI:</Text> Your chat messages and uploaded images 
        are sent to Google Gemini API for AI processing.{'\n\n'}
        <Text style={styles.bold}>Firebase:</Text> We use Firebase for authentication, data storage, 
        and hosting.{'\n\n'}
        <Text style={styles.bold}>RevenueCat:</Text> For marketplace purchases and creator payments.
      </Text>

      <Text style={styles.sectionTitle}>5. Data Storage and Security</Text>
      <Text style={styles.paragraph}>
        Your data is stored securely in Google Cloud Firestore with authentication-based access 
        controls, encryption in transit and at rest, and regular security monitoring.
      </Text>

      <Text style={styles.sectionTitle}>6. Your Rights</Text>
      <Text style={styles.paragraph}>
        You have the right to access your personal data, request data correction or deletion, 
        export your conversation history, opt-out of analytics, and delete your account and all data.
      </Text>

      <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
      <Text style={styles.paragraph}>
        Our service is not directed to children under 13. We do not knowingly collect personal 
        information from children under 13.
      </Text>

      <Text style={styles.sectionTitle}>8. Contact Us</Text>
      <Text style={styles.paragraph}>
        For privacy-related questions or requests:{'\n'}
        Email: privacy@simonsayscoach.com
      </Text>
    </View>
  );
}

function TermsContent() {
  return (
    <View>
      <Text style={styles.updated}>Last Updated: January 26, 2026</Text>

      <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
      <Text style={styles.paragraph}>
        By accessing or using Simon Says AI Coach, you agree to be bound by these Terms of Service. 
        If you do not agree to these Terms, do not use the Service.
      </Text>

      <Text style={styles.sectionTitle}>2. Description of Service</Text>
      <Text style={styles.paragraph}>
        Simon Says AI Coach provides AI-powered productivity coaching through text, voice, and 
        image-based conversations, six specialized coach personalities, custom coach creation tools, 
        community Coach Marketplace, and personalized context and chat history.
      </Text>

      <Text style={styles.sectionTitle}>3. Acceptable Use</Text>
      <Text style={styles.paragraph}>
        You agree NOT to use the Service for illegal purposes, attempt to harm or abuse the AI systems, 
        upload harmful or inappropriate content, reverse engineer the AI models, generate spam or 
        malicious content, impersonate others, or violate intellectual property rights.
      </Text>

      <Text style={styles.sectionTitle}>4. AI-Generated Content</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>No Guarantees:</Text> AI-generated coaching advice is provided "as is" 
        without warranties. The Service is not a substitute for professional advice (medical, legal, financial, etc.).
        {'\n\n'}
        <Text style={styles.bold}>Content Accuracy:</Text> AI responses may contain errors, biases, or 
        inaccuracies. Always verify important information independently.
      </Text>

      <Text style={styles.sectionTitle}>5. Coach Marketplace</Text>
      <Text style={styles.subheading}>Creator Terms</Text>
      <Text style={styles.paragraph}>
        When you publish a coach: You retain ownership of your design, you grant us a distribution 
        license, you receive 70% of purchase revenue (platform takes 30%), and payments are processed 
        through RevenueCat.
      </Text>

      <Text style={styles.subheading}>Buyer Terms</Text>
      <Text style={styles.paragraph}>
        Purchases are one-time, non-refundable (except for technical issues), pricing ranges from 
        $2.99 to $19.99, and you receive lifetime access to purchased coaches.
      </Text>

      <Text style={styles.sectionTitle}>6. Intellectual Property</Text>
      <Text style={styles.paragraph}>
        We own all rights to the Simon Says AI Coach application, brand, and design. You retain 
        ownership of your conversation content, context entries, and custom coaches you create.
      </Text>

      <Text style={styles.sectionTitle}>7. Disclaimers</Text>
      <Text style={styles.paragraph}>
        We strive for 99.9% uptime but do not guarantee uninterrupted service. The Service provides 
        general productivity coaching, not professional advice. AI technology has inherent limitations 
        and may produce incorrect or inappropriate responses.
      </Text>

      <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
      <Text style={styles.paragraph}>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE ARE NOT LIABLE FOR indirect, incidental, or 
        consequential damages, loss of data or profits, decisions made based on AI advice, or 
        third-party service failures.
      </Text>

      <Text style={styles.sectionTitle}>9. Contact</Text>
      <Text style={styles.paragraph}>
        For questions about these Terms:{'\n'}
        Email: support@simonsayscoach.com
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginBottom: SPACING.sm,
  },
  backText: {
    fontSize: 16,
    color: COLORS.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  updated: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  bold: {
    fontWeight: 'bold',
  },
  webLink: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
    padding: SPACING.md,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    alignItems: 'center',
  },
  webLinkText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
