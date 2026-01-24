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
import { HamburgerMenu } from './src/components';
import { colors } from './src/config/theme';
import { initializeUser } from './src/utils/auth';
import { initializePurchases } from './src/utils/purchases';

export default function App() {
  const [userId, setUserId] = useState(null);

  // Initialize Firebase user on app start
  useEffect(() => {
    const initUser = async () => {
      const result = await initializeUser();
      if (result.success) {
        setUserId(result.userId);
        console.log('✅ Firebase connected! User ID:', result.userId);
        
        // Initialize RevenueCat with user ID
        await initializePurchases(result.userId);
      } else {
        console.error('❌ Firebase connection failed:', result.error);
      }
    };
    initUser();
  }, []);
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
