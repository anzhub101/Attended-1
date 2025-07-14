import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

interface MenuItem {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  comingSoon?: boolean;
}

export default function MoreScreen() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/launch');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems: MenuItem[] = [
    {
      id: 1,
      title: 'Academic Tutoring',
      description: 'Connect with peer tutors and academic support',
      icon: 'school',
      color: '#3B82F6',
    },
    {
      id: 3,
      title: 'Performance Dashboard',
      description: 'Track your academic progress and grades',
      icon: 'analytics',
      color: '#F59E0B',
    },
    {
      id: 4,
      title: 'Library Booking',
      description: 'Reserve study rooms and library resources',
      icon: 'library',
      color: '#8B5CF6',
      comingSoon: true,
    },
    {
      id: 9,
      title: 'Student Organizations',
      description: 'Join clubs and student organizations',
      icon: 'people',
      color: '#F43F5E',
      comingSoon: true,
    },
    {
      id: 5,
      title: 'Campus Map',
      description: 'Navigate the campus with interactive maps',
      icon: 'map',
      color: '#84CC16',
      comingSoon: true,

    },
    {
      id: 6,
      title: 'Dining Services',
      description: 'View menus and meal plan information',
      icon: 'restaurant',
      color: '#F97316',
      comingSoon: true,
    },
    {
      id: 7,
      title: 'Transportation',
      description: 'Campus shuttle schedules and parking info',
      icon: 'bus',
      color: '#6366F1',
      comingSoon: true,

    },
    {
      id: 8,
      title: 'Health Services',
      description: 'Book appointments and health resources',
      icon: 'medical',
      color: '#EC4899',
      comingSoon: true,
    },
  ];

  const handleMenuPress = (item: MenuItem) => {
    if (item.comingSoon) {
      // Show coming soon message
      return;
    }
    // Navigate to specific feature
    console.log(`Navigate to ${item.title}`);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>More Features</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          {/* Menu Grid */}
          <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.menuGrid}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuCard,
                    item.comingSoon && styles.menuCardDisabled
                  ]}
                  onPress={() => handleMenuPress(item)}
                  disabled={item.comingSoon}
                >
                  <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                    <Ionicons name={item.icon} size={28} color="white" />
                  </View>
                  
                  <View style={styles.menuContent}>
                    <Text style={[
                      styles.menuTitle,
                      item.comingSoon && styles.menuTitleDisabled
                    ]}>
                      {item.title}
                    </Text>
                    <Text style={[
                      styles.menuDescription,
                      item.comingSoon && styles.menuDescriptionDisabled
                    ]}>
                      {item.description}
                    </Text>
                  </View>

                  {item.comingSoon && (
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonText}>Soon</Text>
                    </View>
                  )}

                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color={item.comingSoon ? '#D1D5DB' : '#9CA3AF'} 
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Logout Section */}
            <View style={styles.logoutSection}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <View style={styles.logoutIconContainer}>
                  <Ionicons name="log-out" size={24} color="#EF4444" />
                </View>
                <View style={styles.logoutContent}>
                  <Text style={styles.logoutTitle}>Logout</Text>
                  <Text style={styles.logoutDescription}>Sign out of your account</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            {/* Support Section */}
            <View style={styles.supportSection}>
              <Text style={styles.supportTitle}>Need Help?</Text>
              
              <TouchableOpacity style={styles.supportCard}>
                <View style={styles.supportIconContainer}>
                  <Ionicons name="help-circle" size={24} color="#3B82F6" />
                </View>
                <View style={styles.supportContent}>
                  <Text style={styles.supportCardTitle}>Help Center</Text>
                  <Text style={styles.supportCardDescription}>Get answers to common questions</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.supportCard}>
                <View style={styles.supportIconContainer}>
                  <Ionicons name="chatbubble-ellipses" size={24} color="#10B981" />
                </View>
                <View style={styles.supportContent}>
                  <Text style={styles.supportCardTitle}>Contact Support</Text>
                  <Text style={styles.supportCardDescription}>Chat with our support team</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.supportCard}>
                <View style={styles.supportIconContainer}>
                  <Ionicons name="star" size={24} color="#F59E0B" />
                </View>
                <View style={styles.supportContent}>
                  <Text style={styles.supportCardTitle}>Rate the App</Text>
                  <Text style={styles.supportCardDescription}>Help us improve your experience</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
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
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  menuGrid: {
    marginBottom: 30,
  },
  menuCard: {
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
  menuCardDisabled: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  menuTitleDisabled: {
    color: '#9CA3AF',
  },
  menuDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  menuDescriptionDisabled: {
    color: '#D1D5DB',
  },
  comingSoonBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  supportSection: {
    marginBottom: 30,
  },
  supportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  supportCard: {
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
  supportIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  supportContent: {
    flex: 1,
  },
  supportCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  supportCardDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  logoutSection: {
    marginBottom: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoutContent: {
    flex: 1,
  },
  logoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 2,
  },
  logoutDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
});