// RevenueCat Integration for Simon Says Coach
import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Access RevenueCat API key from Expo config
const REVENUECAT_API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_REVENUECAT_API_KEY;

// Flag to track if RevenueCat is initialized
let isInitialized = false;

// Initialize RevenueCat (call this on app startup)
export const initializePurchases = async (userId) => {
  try {
    // Skip RevenueCat on web (not supported)
    if (Platform.OS === 'web') {
      console.log('⚠️ RevenueCat not available on web - using mock mode');
      return true;
    }

    // Only initialize on Android (iOS not configured yet)
    if (Platform.OS !== 'android') {
      console.log(`⚠️ RevenueCat only configured for Android, current platform: ${Platform.OS}`);
      return false;
    }

    // Check if API key exists and is valid format
    if (!REVENUECAT_API_KEY) {
      console.error('❌ RevenueCat API key not found!');
      console.error('Check: app.config.js extra.EXPO_PUBLIC_REVENUECAT_API_KEY');
      console.error('Check: .env file has EXPO_PUBLIC_REVENUECAT_API_KEY=goog_...');
      return false;
    }

    // Validate it's an Android SDK key (should start with goog_)
    if (!REVENUECAT_API_KEY.startsWith('goog_')) {
      console.error('❌ Invalid RevenueCat API key format!');
      console.error('Android apps need a key starting with "goog_"');
      console.error('Current key starts with:', REVENUECAT_API_KEY.substring(0, 5));
      console.error('You may have a JavaScript/Web SDK key instead of Android SDK key');
      return false;
    }

    // Prevent double initialization
    if (isInitialized) {
      console.log('⚠️ RevenueCat already initialized, skipping');
      return true;
    }

    console.log('🔄 Initializing RevenueCat SDK...');
    console.log('Platform:', Platform.OS);
    console.log('API Key prefix:', REVENUECAT_API_KEY.substring(0, 10) + '...');
    console.log('User ID:', userId);

    // Configure RevenueCat with Android-specific settings
    await Purchases.configure({
      apiKey: REVENUECAT_API_KEY,
      appUserID: userId, // Use Firebase UID or anonymous ID
    });

    // Set debug logs in development
    if (__DEV__) {
      await Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
      console.log('🐛 RevenueCat debug logging enabled');
    }

    isInitialized = true;
    console.log('✅ RevenueCat initialized successfully!');
    console.log('SDK Version:', await Purchases.getAppUserID());
    
    return true;
  } catch (error) {
    console.error('❌ RevenueCat initialization failed!');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Common error messages
    if (error.message?.includes('Invalid API key')) {
      console.error('💡 TIP: Make sure you\'re using the Android SDK key from RevenueCat dashboard');
      console.error('💡 Go to: Project Settings → API Keys → Copy "Public Android SDK Key"');
    } else if (error.message?.includes('network')) {
      console.error('💡 TIP: Check your internet connection');
    }
    
    return false;
  }
};

// Check if user has Pro subscription
export const checkProStatus = async () => {
  try {
    // On web, return false (free tier)
    if (Platform.OS === 'web') {
      console.log('⚠️ RevenueCat not available on web - free tier only');
      return false;
    }

    // Check if SDK is initialized
    if (!isInitialized) {
      console.warn('⚠️ RevenueCat not initialized, cannot check Pro status');
      return false;
    }

    console.log('🔍 Checking Pro subscription status...');
    const customerInfo = await Purchases.getCustomerInfo();
    
    // Debug: Log all active entitlements
    const activeEntitlements = Object.keys(customerInfo.entitlements.active);
    console.log('Active entitlements:', activeEntitlements.length > 0 ? activeEntitlements : 'None');
    
    const hasPro = customerInfo.entitlements.active['pro'] !== undefined;
    
    if (hasPro) {
      const proEntitlement = customerInfo.entitlements.active['pro'];
      console.log('✅ Pro subscription is ACTIVE');
      console.log('Product:', proEntitlement.productIdentifier);
      console.log('Expires:', proEntitlement.expirationDate);
    } else {
      console.log('❌ No Pro subscription found');
    }
    
    return hasPro;
  } catch (error) {
    console.error('❌ Error checking Pro status:', error.message);
    // Return false if there's an error - show paywall
    return false;
  }
};

// Get available offerings
export const getOfferings = async () => {
  try {
    // On web, return mock offering
    if (Platform.OS === 'web') {
      return {
        availablePackages: [
          {
            identifier: '$rc_monthly',
            product: {
              identifier: 'simon_says_pro_monthly',
              title: 'Pro Monthly',
              priceString: '$9.99'
            }
          }
        ]
      };
    }

    if (!isInitialized) {
      console.error('❌ Cannot get offerings - RevenueCat not initialized');
      return null;
    }

    console.log('📝 Fetching offerings from RevenueCat...');
    const offerings = await Purchases.getOfferings();
    
    console.log('Available offerings:', Object.keys(offerings.all).join(', ') || 'None');
    console.log('Current offering:', offerings.current?.identifier || 'None');
    
    if (offerings.current !== null) {
      const packages = offerings.current.availablePackages;
      console.log(`Found ${packages.length} packages in current offering:`);
      packages.forEach(pkg => {
        console.log(`  - ${pkg.identifier}: ${pkg.product.title} (${pkg.product.priceString})`);
      });
      return offerings.current;
    }
    
    console.error('❌ No current offering configured in RevenueCat dashboard!');
    console.error('💡 Go to RevenueCat → Offerings → Make sure "default" is set as Current');
    return null;
  } catch (error) {
    console.error('❌ Error fetching offerings:', error.message);
    console.error('💡 Check: RevenueCat dashboard → Offerings → Make sure you have an active offering');
    return null;
  }
};

// Purchase Pro subscription
export const purchasePro = async () => {
  try {
    // On web, simulate successful purchase
    if (Platform.OS === 'web') {
      console.log('⚠️ Web purchase simulation - redirecting to payment page');
      alert('Web payments not supported in test mode. On mobile, this would open the App Store/Play Store.');
      return { success: false, message: 'Web purchases not supported' };
    }

    console.log('💳 Starting purchase flow...');
    
    const offerings = await getOfferings();
    if (!offerings) {
      throw new Error('No offerings available. Check RevenueCat dashboard configuration.');
    }

    // Look for monthly package (this is critical!)
    const monthlyPackage = offerings.availablePackages.find(
      pkg => pkg.identifier === 'monthly' || pkg.identifier === '$rc_monthly'
    );

    if (!monthlyPackage) {
      console.error('❌ Monthly package not found!');
      console.error('Available packages:', offerings.availablePackages.map(p => p.identifier).join(', '));
      console.error('💡 Go to RevenueCat → Offerings → default → Add Package with identifier "monthly"');
      throw new Error('Monthly package not found. Check package identifier in RevenueCat.');
    }

    console.log('📦 Found package:', monthlyPackage.identifier);
    console.log('Product:', monthlyPackage.product.identifier);
    console.log('Price:', monthlyPackage.product.priceString);
    console.log('🛍️ Initiating purchase with Google Play...');
    
    const purchaseResult = await Purchases.purchasePackage(monthlyPackage);
    
    console.log('🎉 Purchase completed!');
    console.log('Customer Info:', purchaseResult.customerInfo);
    
    // Check if purchase was successful
    if (purchaseResult.customerInfo.entitlements.active['pro']) {
      console.log('✅ Pro subscription activated!');
      console.log('Product:', purchaseResult.customerInfo.entitlements.active['pro'].productIdentifier);
      return { success: true, customerInfo: purchaseResult.customerInfo };
    }

    console.error('⚠️ Purchase completed but Pro entitlement not active');
    return { success: false, error: 'Subscription not activated' };
  } catch (error) {
    if (error.userCancelled) {
      console.log('🚫 User cancelled purchase');
      return { success: false, cancelled: true };
    }
    
    console.error('❌ Purchase error:', error.message);
    console.error('Error code:', error.code);
    
    // Provide helpful error messages
    if (error.message?.includes('product')) {
      console.error('💡 Product not found in Google Play Console');
      console.error('💡 Make sure product ID "simon_says_pro_monthly" exists in Play Console');
    } else if (error.message?.includes('billing')) {
      console.error('💡 Google Play Billing issue - make sure app is signed correctly');
    }
    
    return { success: false, error: error.message };
  }
};

// Restore purchases
export const restorePurchases = async () => {
  try {
    // On web, return no subscriptions
    if (Platform.OS === 'web') {
      console.log('⚠️ Restore not available on web');
      return { success: true, hasPro: false };
    }

    const customerInfo = await Purchases.restorePurchases();
    const hasPro = customerInfo.entitlements.active['pro'] !== undefined;
    
    if (hasPro) {
      console.log('✅ Purchases restored - Pro active');
      return { success: true, hasPro: true };
    } else {
      console.log('No active subscriptions found');
      return { success: true, hasPro: false };
    }
  } catch (error) {
    console.error('Restore error:', error);
    return { success: false, error: error.message };
  }
};

// Get subscription info
export const getSubscriptionInfo = async () => {
  try {
    // On web, return no subscription
    if (Platform.OS === 'web') {
      return { isActive: false };
    }

    const customerInfo = await Purchases.getCustomerInfo();
    const proEntitlement = customerInfo.entitlements.active['pro'];
    
    if (proEntitlement) {
      return {
        isActive: true,
        expirationDate: proEntitlement.expirationDate,
        willRenew: proEntitlement.willRenew,
        productIdentifier: proEntitlement.productIdentifier,
      };
    }
    
    return { isActive: false };
  } catch (error) {
    console.error('Error getting subscription info:', error);
    return { isActive: false };
  }
};
