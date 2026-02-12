// RevenueCat Debug & Test Screen
// Use this to verify your RevenueCat configuration is working
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Button } from '../components';
import { colors, spacing } from '../config/theme';
import { 
  initializePurchases, 
  checkProStatus, 
  getOfferings,
  purchasePro,
  restorePurchases,
  getSubscriptionInfo
} from '../utils/purchases';
import Constants from 'expo-constants';

export default function RevenueCatDebugScreen({ navigation }) {
  const [status, setStatus] = useState('Not tested');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [proStatus, setProStatus] = useState(null);
  const [offerings, setOfferings] = useState(null);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    setLogs(prev => [`[${timestamp}] ${icon} ${message}`, ...prev].slice(0, 50));
  };

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = () => {
    addLog('Checking configuration...', 'info');
    
    // Check environment variables
    const apiKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_REVENUECAT_API_KEY;
    
    if (!apiKey) {
      addLog('ERROR: API key not found in app.config.js', 'error');
      setStatus('❌ Configuration Error');
      return;
    }
    
    if (!apiKey.startsWith('goog_')) {
      addLog('ERROR: Invalid API key format (should start with goog_)', 'error');
      addLog(`Current key starts with: ${apiKey.substring(0, 5)}`, 'error');
      setStatus('❌ Invalid API Key');
      return;
    }
    
    addLog('API key format is correct (goog_...)', 'success');
    addLog(`Key prefix: ${apiKey.substring(0, 15)}...`, 'info');
    setStatus('✅ Configuration OK');
  };

  const testInitialization = async () => {
    setLoading(true);
    addLog('Testing SDK initialization...', 'info');
    
    try {
      const userId = 'test_user_' + Date.now();
      const result = await initializePurchases(userId);
      
      if (result) {
        addLog('SDK initialized successfully!', 'success');
        setStatus('✅ SDK Initialized');
      } else {
        addLog('SDK initialization returned false', 'error');
        setStatus('❌ Init Failed');
      }
    } catch (error) {
      addLog(`Initialization error: ${error.message}`, 'error');
      setStatus('❌ Init Error');
    }
    
    setLoading(false);
  };

  const testCheckProStatus = async () => {
    setLoading(true);
    addLog('Checking Pro subscription status...', 'info');
    
    try {
      const hasPro = await checkProStatus();
      setProStatus(hasPro);
      
      if (hasPro) {
        addLog('User has Pro subscription!', 'success');
      } else {
        addLog('User does not have Pro subscription', 'warning');
      }
    } catch (error) {
      addLog(`Error checking status: ${error.message}`, 'error');
    }
    
    setLoading(false);
  };

  const testGetOfferings = async () => {
    setLoading(true);
    addLog('Fetching offerings from RevenueCat...', 'info');
    
    try {
      const result = await getOfferings();
      setOfferings(result);
      
      if (result) {
        addLog(`Found ${result.availablePackages.length} packages`, 'success');
        result.availablePackages.forEach(pkg => {
          addLog(`  Package: ${pkg.identifier} - ${pkg.product.priceString}`, 'info');
        });
      } else {
        addLog('No offerings found - check RevenueCat dashboard!', 'error');
        addLog('Make sure "default" offering is set as Current', 'warning');
      }
    } catch (error) {
      addLog(`Error fetching offerings: ${error.message}`, 'error');
    }
    
    setLoading(false);
  };

  const testPurchase = async () => {
    setLoading(true);
    addLog('Testing purchase flow...', 'info');
    addLog('NOTE: This will open Google Play billing', 'warning');
    
    try {
      const result = await purchasePro();
      
      if (result.success) {
        addLog('Purchase successful! Pro activated!', 'success');
        setProStatus(true);
      } else if (result.cancelled) {
        addLog('Purchase cancelled by user', 'warning');
      } else {
        addLog(`Purchase failed: ${result.error}`, 'error');
      }
    } catch (error) {
      addLog(`Purchase error: ${error.message}`, 'error');
    }
    
    setLoading(false);
  };

  const testRestore = async () => {
    setLoading(true);
    addLog('Testing restore purchases...', 'info');
    
    try {
      const result = await restorePurchases();
      
      if (result.success && result.hasPro) {
        addLog('Purchases restored! Pro active!', 'success');
        setProStatus(true);
      } else if (result.success) {
        addLog('No previous purchases found', 'warning');
      } else {
        addLog(`Restore failed: ${result.error}`, 'error');
      }
    } catch (error) {
      addLog(`Restore error: ${error.message}`, 'error');
    }
    
    setLoading(false);
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('Logs cleared', 'info');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text variant="h3">← Back</Text>
        </TouchableOpacity>
        <Text variant="h2">RevenueCat Debug</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusCard}>
            <Text variant="body">{status}</Text>
            {proStatus !== null && (
              <Text variant="small" color={colors.textSecondary}>
                Pro Status: {proStatus ? '✅ Active' : '❌ Not Active'}
              </Text>
            )}
          </View>
        </View>

        {/* Test Buttons */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Tests</Text>
          
          <Button
            title="1. Test SDK Initialization"
            onPress={testInitialization}
            disabled={loading}
            style={styles.testButton}
          />
          
          <Button
            title="2. Check Pro Status"
            onPress={testCheckProStatus}
            disabled={loading}
            style={styles.testButton}
          />
          
          <Button
            title="3. Get Offerings"
            onPress={testGetOfferings}
            disabled={loading}
            style={styles.testButton}
          />
          
          <Button
            title="4. Test Purchase (Real!)"
            onPress={testPurchase}
            disabled={loading}
            style={styles.testButton}
            variant="secondary"
          />
          
          <Button
            title="5. Test Restore"
            onPress={testRestore}
            disabled={loading}
            style={styles.testButton}
          />
        </View>

        {/* Offerings Info */}
        {offerings && (
          <View style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>Offerings</Text>
            <View style={styles.infoCard}>
              {offerings.availablePackages.map((pkg, index) => (
                <View key={index} style={styles.packageInfo}>
                  <Text variant="body">
                    {pkg.identifier}: {pkg.product.title}
                  </Text>
                  <Text variant="small" color={colors.textSecondary}>
                    {pkg.product.identifier} - {pkg.product.priceString}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Console Logs */}
        <View style={styles.section}>
          <View style={styles.logHeader}>
            <Text variant="h3" style={styles.sectionTitle}>Console Logs</Text>
            <TouchableOpacity onPress={clearLogs}>
              <Text variant="small" color={colors.primary}>Clear</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.logContainer}>
            {logs.length === 0 ? (
              <Text variant="small" color={colors.textTertiary}>
                No logs yet. Run a test above.
              </Text>
            ) : (
              logs.map((log, index) => (
                <Text key={index} variant="tiny" style={styles.logEntry}>
                  {log}
                </Text>
              ))
            )}
          </View>
        </View>

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text variant="small" color={colors.textSecondary} style={styles.loadingText}>
              Testing...
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginBottom: spacing.sm,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  statusCard: {
    backgroundColor: colors.cardBackground,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  testButton: {
    marginBottom: spacing.sm,
  },
  infoCard: {
    backgroundColor: colors.cardBackground,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  packageInfo: {
    marginBottom: spacing.sm,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logContainer: {
    backgroundColor: '#1a1a1a',
    padding: spacing.md,
    borderRadius: 8,
    maxHeight: 400,
  },
  logEntry: {
    color: '#00ff00',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.sm,
  },
});
