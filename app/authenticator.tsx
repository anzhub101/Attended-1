import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';

interface AuthMethod {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  enabled: boolean;
  setupRequired: boolean;
}

export default function AuthenticatorScreen() {
  const router = useRouter();
  
  const [authMethods, setAuthMethods] = useState<AuthMethod[]>([
    {
      id: 'passkey',
      title: 'Passkey',
      description: 'Use biometric authentication or device PIN for secure login',
      icon: 'finger-print',
      enabled: false,
      setupRequired: true,
    },
    {
      id: 'totp',
      title: 'Authenticator App (TOTP)',
      description: 'Use Microsoft Authenticator for 2FA codes',
      icon: 'time',
      enabled: false,
      setupRequired: true,
    },
    {
      id: 'sms',
      title: 'SMS Verification',
      description: 'Receive verification codes via text message',
      icon: 'chatbubble',
      enabled: true,
      setupRequired: false,
    },
  ]);

  const [showQRCode, setShowQRCode] = useState(false);
  const [totpSecret, setTotpSecret] = useState('JBSWY3DPEHPK3PXP');

  const toggleAuthMethod = (id: string) => {
    const method = authMethods.find(m => m.id === id);
    
    if (method?.setupRequired && !method.enabled) {
      handleSetupMethod(id);
    } else {
      setAuthMethods(prev => 
        prev.map(method => 
          method.id === id 
            ? { ...method, enabled: !method.enabled }
            : method
        )
      );
    }
  };

  const handleSetupMethod = (id: string) => {
    switch (id) {
      case 'passkey':
        Alert.alert(
          'Setup Passkey',
          'This will use your device biometrics or PIN for authentication.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Setup', 
              onPress: () => {
                // Simulate passkey setup
                setAuthMethods(prev => 
                  prev.map(method => 
                    method.id === id 
                      ? { ...method, enabled: true, setupRequired: false }
                      : method
                  )
                );
                Alert.alert('Success', 'Passkey has been set up successfully!');
              }
            },
          ]
        );
        break;
      
      case 'totp':
        setShowQRCode(true);
        break;
      
      default:
        Alert.alert('Setup', `Setting up ${id}...`);
    }
  };

  const completeTOTPSetup = () => {
    setAuthMethods(prev => 
      prev.map(method => 
        method.id === 'totp' 
          ? { ...method, enabled: true, setupRequired: false }
          : method
      )
    );
    setShowQRCode(false);
    Alert.alert('Success', 'TOTP authentication has been set up successfully!');
  };

  const generateBackupCodes = () => {
    const codes = Array.from({ length: 8 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
    
    Alert.alert(
      'Backup Codes Generated',
      `Save these codes in a secure location:\n\n${codes.join('\n')}\n\nEach code can only be used once.`,
      [{ text: 'I\'ve Saved Them', style: 'default' }]
    );
  };

  const getMethodColor = (method: AuthMethod) => {
    if (!method.enabled) return '#9CA3AF';
    switch (method.id) {
      case 'passkey': return '#10B981';
      case 'qr-code': return '#3B82F6';
      case 'totp': return '#8B5CF6';
      case 'sms': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Authenticator</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {/* Security Overview */}
            <View style={styles.overviewSection}>
              <View style={styles.overviewCard}>
                <View style={styles.overviewHeader}>
                  <Ionicons name="shield-checkmark" size={32} color="#10B981" />
                  <Text style={styles.overviewTitle}>Account Security</Text>
                </View>
                <Text style={styles.overviewDescription}>
                  Secure your account with multiple authentication methods. 
                  We recommend enabling at least two methods for maximum security.
                </Text>
                <View style={styles.securityStatus}>
                  <Text style={styles.securityStatusText}>
                    {authMethods.filter(m => m.enabled).length} of {authMethods.length} methods enabled
                  </Text>
                  <View style={styles.securityIndicator}>
                    <View 
                      style={[
                        styles.securityBar, 
                        { 
                          width: `${(authMethods.filter(m => m.enabled).length / authMethods.length) * 100}%`,
                          backgroundColor: authMethods.filter(m => m.enabled).length >= 2 ? '#10B981' : '#F59E0B'
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Authentication Methods */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Authentication Methods</Text>
              
              {authMethods.map((method) => (
                <View key={method.id} style={styles.methodCard}>
                  <View style={styles.methodHeader}>
                    <View style={[styles.methodIcon, { backgroundColor: getMethodColor(method) }]}>
                      <Ionicons name={method.icon} size={24} color="white" />
                    </View>
                    <View style={styles.methodInfo}>
                      <Text style={styles.methodTitle}>{method.title}</Text>
                      <Text style={styles.methodDescription}>{method.description}</Text>
                      {method.setupRequired && !method.enabled && (
                        <Text style={styles.setupRequired}>Setup required</Text>
                      )}
                    </View>
                    <Switch
                      value={method.enabled}
                      onValueChange={() => toggleAuthMethod(method.id)}
                      trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                      thumbColor={method.enabled ? 'white' : '#9CA3AF'}
                    />
                  </View>
                  
                  {method.enabled && method.id === 'qr-code' && (
                    <View style={styles.qrSection}>
                      <Text style={styles.qrTitle}>Your Login QR Code</Text>
                      <View style={styles.qrContainer}>
                        <QRCode
                          value={`adu-auth://login?user=1095305&token=${Date.now()}`}
                          size={120}
                          color="black"
                          backgroundColor="white"
                        />
                      </View>
                      <Text style={styles.qrDescription}>
                        Scan this code from another device to login quickly
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Security Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Security Actions</Text>
              
              <TouchableOpacity style={styles.actionCard} onPress={generateBackupCodes}>
                <View style={styles.actionIcon}>
                  <Ionicons name="key" size={24} color="#3B82F6" />
                </View>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>Generate Backup Codes</Text>
                  <Text style={styles.actionDescription}>
                    Create one-time backup codes for account recovery
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard}>
                <View style={styles.actionIcon}>
                  <Ionicons name="list" size={24} color="#8B5CF6" />
                </View>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>Active Sessions</Text>
                  <Text style={styles.actionDescription}>
                    View and manage your active login sessions
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Security Tips */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Security Tips</Text>
              <View style={styles.tipsCard}>
                <View style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.tipText}>Enable multiple authentication methods</Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.tipText}>Keep backup codes in a secure location</Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.tipText}>Regularly review active sessions</Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.tipText}>Never share authentication codes</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* TOTP Setup Modal */}
        {showQRCode && (
          <View style={styles.modalOverlay}>
            <View style={styles.totpModal}>
              <View style={styles.totpHeader}>
                <Text style={styles.totpTitle}>Setup Authenticator App</Text>
                <TouchableOpacity onPress={() => setShowQRCode(false)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.totpInstructions}>
                1. Install Google Authenticator or similar app{'\n'}
                2. Scan this QR code with your app{'\n'}
                3. Enter the 6-digit code to verify
              </Text>
              
              <View style={styles.totpQRContainer}>
                <QRCode
                  value={`otpauth://totp/ADU:1095305@adu.ac.ae?secret=${totpSecret}&issuer=ADU`}
                  size={200}
                  color="black"
                  backgroundColor="white"
                />
              </View>
              
              <Text style={styles.totpSecret}>
                Manual entry key: {totpSecret}
              </Text>
              
              <TouchableOpacity style={styles.totpCompleteButton} onPress={completeTOTPSetup}>
                <Text style={styles.totpCompleteText}>Complete Setup</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DC2626',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#DC2626',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  settingsButton: {
    padding: 8,
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  overviewSection: {
    marginBottom: 25,
  },
  overviewCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  overviewDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  securityStatus: {
    marginTop: 8,
  },
  securityStatusText: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 8,
  },
  securityIndicator: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  securityBar: {
    height: '100%',
    borderRadius: 2,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  methodCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  setupRequired: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
    marginTop: 4,
  },
  qrSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
  },
  qrDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  tipsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  totpModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  totpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  totpInstructions: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  totpQRContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  totpSecret: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  totpCompleteButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  totpCompleteText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});