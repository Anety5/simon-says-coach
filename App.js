import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import WelcomeScreen from './src/screens/WelcomeScreen';
import ContextEntryScreen from './src/screens/ContextEntryScreen';
import ToneSelectionScreen from './src/screens/ToneSelectionScreen';
import CoachLibraryScreen from './src/screens/CoachLibraryScreen';
import ChatScreen from './src/screens/ChatScreen';
import PaywallScreen from './src/screens/PaywallScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ConversationsScreen from './src/screens/ConversationsScreen';
import MarketplaceScreen from './src/screens/MarketplaceScreen';
import CoachProfileScreen from './src/screens/CoachProfileScreen';
import LegalScreen from './src/screens/LegalScreen';
import { HamburgerMenu } from './src/components';
import { colors } from './src/config/theme';
import { initializeUser } from './src/utils/auth';
import { initializePurchases } from './src/utils/purchases';

export default function App() {
  const [userId, setUserId] = useState(null);
  const [isPurchasesInitialized, setIsPurchasesInitialized] = useState(false);

  // Initialize RevenueCat on app start
  useEffect(() => {
    const setupRevenueCat = async () => {
      try {
        // Initialize with anonymous user ID (will be updated when user signs in)
        const anonymousId = 'anonymous_' + Date.now();
        await initializePurchases(anonymousId);
        setIsPurchasesInitialized(true);
        console.log('✅ RevenueCat initialized in App.js');
      } catch (error) {
        console.error('Failed to initialize RevenueCat:', error);
        setIsPurchasesInitialized(true); // Continue anyway
      }
    };
    
    setupRevenueCat();
  }, []);

  // Note: User initialization happens on WelcomeScreen when user clicks begin
  // No auto-initialization needed here to avoid auth conflicts
  
  const [currentScreen, setCurrentScreen] = useState('welcome');

  // State for navigation with params
  const [navigationParams, setNavigationParams] = useState({});
  const [userProfile, setUserProfile] = useState({});

  // Enhanced navigation object
  const navigation = {
    navigate: (screen, params = {}) => {
      setNavigationParams(params);
      setCurrentScreen(screen);
    },
    goBack: () => {
      if (currentScreen === 'context') setCurrentScreen('welcome');
      if (currentScreen === 'tone') setCurrentScreen('context');
      if (currentScreen === 'library') setCurrentScreen('tone');
      if (currentScreen === 'chat') setCurrentScreen('library');
    },
  };

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen navigation={navigation} />;
      case 'context':
        return <ContextEntryScreen navigation={navigation} userProfile={userProfile} setUserProfile={setUserProfile} />;
      case 'tone':
        return <ToneSelectionScreen navigation={navigation} userProfile={userProfile} setUserProfile={setUserProfile} />;
      case 'library':
        return <CoachLibraryScreen navigation={navigation} />;
      case 'chat':
        return <ChatScreen navigation={navigation} route={{ params: navigationParams }} />;
      case 'paywall':
        return <PaywallScreen navigation={navigation} />;
      case 'settings':
        return <SettingsScreen navigation={navigation} />;
      case 'conversations':
        return <ConversationsScreen navigation={navigation} />;
      case 'marketplace':
        return <MarketplaceScreen navigation={navigation} />;
      case 'coachProfile':
        return <CoachProfileScreen navigation={navigation} route={{ params: navigationParams }} />;
      case 'legal':
        return <LegalScreen navigation={navigation} />;
      default:
        return <WelcomeScreen navigation={navigation} />;
    }
  };

  // Only show hamburger menu after onboarding
  const showHamburger = ['library', 'chat', 'settings'].includes(currentScreen);

  return (
    <SafeAreaView style={styles.container}>
      {/* Hamburger Menu - only on main screens */}
      {showHamburger && (
        <View style={styles.headerContainer}>
          <HamburgerMenu 
            currentScreen={currentScreen}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        </View>
      )}

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {renderScreen()}
      </View>

      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contentContainer: {
    flex: 1,
  },
});
