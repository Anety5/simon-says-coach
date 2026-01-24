// RevenueCat Integration for Simon Says Coach
import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

const REVENUECAT_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;

// Initialize RevenueCat (call this on app startup)
export const initializePurchases = async (userId) => {
  try {
    // Skip RevenueCat on web (not supported)
    if (Platform.OS === 'web') {
      console.log('⚠️ RevenueCat not available on web - using mock mode');
      return true;
    }

    if (!REVENUECAT_API_KEY) {
      console.warn('⚠️ RevenueCat API key not found in .env');
      return false;
    }

    await Purchases.configure({
      apiKey: REVENUECAT_API_KEY,
      appUserID: userId, // Use Firebase UID
    });

    console.log('✅ RevenueCat initialized');
    return true;
  } catch (error) {
    console.error('❌ RevenueCat initialization failed:', error);
    return false;
  }
};

// Check if user has Pro subscription
export const checkProStatus = async () => {
  try {
    // On web, return false (free tier) for testing
    if (Platform.OS === 'web') {
      return false;
    }

    const customerInfo = await Purchases.getCustomerInfo();
    const hasPro = customerInfo.entitlements.active['pro'] !== undefined;
    return hasPro;
  } catch (error) {
    console.error('Error checking Pro status:', error);
    return false; // Default to free tier on error
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

    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null) {
      return offerings.current;
    }
    return null;
  } catch (error) {
    console.error('Error fetching offerings:', error);
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

    const offerings = await getOfferings();
    if (!offerings) {
      throw new Error('No offerings available');
    }

    const monthlyPackage = offerings.availablePackages.find(
      pkg => pkg.identifier === 'monthly' || pkg.identifier === '$rc_monthly'
    );

    if (!monthlyPackage) {
      throw new Error('Monthly package not found');
    }

    const purchaseResult = await Purchases.purchasePackage(monthlyPackage);
    
    // Check if purchase was successful
    if (purchaseResult.customerInfo.entitlements.active['pro']) {
      console.log('✅ Pro subscription activated!');
      return { success: true, customerInfo: purchaseResult.customerInfo };
    }

    return { success: false, error: 'Subscription not activated' };
  } catch (error) {
    if (error.userCancelled) {
      console.log('User cancelled purchase');
      return { success: false, cancelled: true };
    }
    console.error('Purchase error:', error);
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
