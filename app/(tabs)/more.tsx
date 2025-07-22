import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Modal, TextInput, KeyboardAvoidingView, FlatList } from 'react-native';
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

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function MoreScreen() {
  const { logout } = useAuth();
  const router = useRouter();
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi! I\'m your AI assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');

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
      return;
    }
    
    if (item.title === 'Academic Tutoring') {
      router.push('/tutoring');
    } else if (item.title === 'Performance Dashboard') {
      router.push('/performance');
    } else {
      console.log(`Navigate to ${item.title}`);
    }
  };

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "That's a great question! I'd be happy to help you with that.",
        "I understand. Let me provide you with some information about that topic.",
        "Thanks for asking! Here's what I can tell you about that.",
        "I'm here to assist you. Could you provide a bit more context?",
        "That's interesting! I can help you explore this further.",
        "I can definitely help with that. Here are some suggestions...",
      ];

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.isUser ? styles.userMessageText : styles.aiMessageText
      ]}>
        {item.text}
      </Text>
    </View>
  );

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

        {/* Floating AI Chat Button */}
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={() => setIsChatVisible(true)}
        >
          <Ionicons name="chatbubble" size={28} color="white" />
        </TouchableOpacity>

        {/* AI Chat Modal */}
        <Modal
          visible={isChatVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.chatOverlay}>
            <SafeAreaView style={styles.chatContainer}>
            {/* Chat Header */}
            <View style={styles.chatHeader}>
              <View style={styles.chatHeaderInfo}>
                <View style={styles.aiAvatarContainer}>
                  <Ionicons name="sparkles" size={20} color="#3B82F6" />
                </View>
                <View>
                  <Text style={styles.chatHeaderTitle}>AI Assistant</Text>
                  <Text style={styles.chatHeaderSubtitle}>Always here to help</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setIsChatVisible(false);
                  setMessages([{
                    id: '1',
                    text: 'Hi! I\'m your AI assistant. How can I help you today?',
                    isUser: false,
                    timestamp: new Date(),
                  }]);
                  setInputText('');
                }}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              style={styles.messagesList}
              contentContainerStyle={styles.messagesContainer}
            />

            {/* Input Area */}
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.inputContainer}
            >
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Type your message..."
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity 
                  style={[
                    styles.sendButton,
                    inputText.trim() === '' && styles.sendButtonDisabled
                  ]}
                  onPress={sendMessage}
                  disabled={inputText.trim() === ''}
                >
                  <Ionicons 
                    name="send" 
                    size={20} 
                    color={inputText.trim() === '' ? '#9CA3AF' : 'white'} 
                  />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
            </SafeAreaView>
          </View>
        </Modal>
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
  // Floating Button Styles
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  // Chat Modal Styles
  chatOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 100, // Space for the header
  },
  chatContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  chatHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  chatHeaderSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  closeButton: {
    padding: 8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3B82F6',
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: 'white',
  },
  aiMessageText: {
    color: '#1F2937',
  },
  inputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20,
    paddingTop: 16,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
});