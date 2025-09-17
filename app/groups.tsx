import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

interface Group {d
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  memberCount: number;
  campus: 'Al Ain Campus' | 'Abu Dhabi Campus';
  image: string;
  isJoined: boolean;
}

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Employability and Alumni Relations Office',
    description: 'Connect with alumni and enhance your career prospects through networking events, career workshops, and mentorship programs. We help students transition from university to professional life.',
    shortDescription: 'Career development and alumni networking',
    category: 'Career Services',
    memberCount: Math.floor(Math.random() * 500) + 100,
    campus: Math.random() > 0.5 ? 'Al Ain Campus' : 'Abu Dhabi Campus',
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    isJoined: false,
  },
  {
    id: '2',
    name: 'Student Affairs - Al Ain Campus',
    description: 'Supporting student life and well-being at Al Ain Campus. We organize events, provide student services, and ensure a vibrant campus community for all students.',
    shortDescription: 'Student life and campus community support',
    category: 'Student Services',
    memberCount: Math.floor(Math.random() * 500) + 100,
    campus: 'Al Ain Campus',
    image: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    isJoined: false,
  },
  {
    id: '3',
    name: 'Student Support Office',
    description: 'Providing comprehensive support services including academic advising, counseling, disability services, and financial aid guidance to help students succeed.',
    shortDescription: 'Academic and personal support services',
    category: 'Support Services',
    memberCount: Math.floor(Math.random() * 500) + 100,
    campus: Math.random() > 0.5 ? 'Al Ain Campus' : 'Abu Dhabi Campus',
    image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    isJoined: false,
  },
  {
    id: '4',
    name: 'Student Engagement Office',
    description: 'Fostering student involvement through clubs, organizations, leadership opportunities, and campus activities. Join us to make your university experience memorable.',
    shortDescription: 'Student activities and leadership development',
    category: 'Student Life',
    memberCount: Math.floor(Math.random() * 500) + 100,
    campus: Math.random() > 0.5 ? 'Al Ain Campus' : 'Abu Dhabi Campus',
    image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    isJoined: false,
  },
  {
    id: '5',
    name: 'Housing & Residential Life',
    description: 'Creating a home away from home for residential students. We provide safe, comfortable living spaces and organize community-building activities.',
    shortDescription: 'On-campus housing and residential community',
    category: 'Housing',
    memberCount: Math.floor(Math.random() * 500) + 100,
    campus: Math.random() > 0.5 ? 'Al Ain Campus' : 'Abu Dhabi Campus',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    isJoined: false,
  },
  {
    id: '6',
    name: 'Sports and Wellness Office',
    description: 'Promoting physical fitness and mental wellness through sports programs, fitness facilities, wellness workshops, and recreational activities for all skill levels.',
    shortDescription: 'Sports, fitness, and wellness programs',
    category: 'Health & Wellness',
    memberCount: Math.floor(Math.random() * 500) + 100,
    campus: Math.random() > 0.5 ? 'Al Ain Campus' : 'Abu Dhabi Campus',
    image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    isJoined: false,
  },
  {
    id: '7',
    name: 'Student Affairs Department',
    description: 'Coordinating comprehensive student services across all campuses. We work to enhance student experience through various programs and support initiatives.',
    shortDescription: 'Comprehensive student services coordination',
    category: 'Administration',
    memberCount: Math.floor(Math.random() * 500) + 100,
    campus: Math.random() > 0.5 ? 'Al Ain Campus' : 'Abu Dhabi Campus',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    isJoined: false,
  },
  {
    id: '8',
    name: 'Academic Success Center',
    description: 'Supporting academic excellence through tutoring services, study skills workshops, writing assistance, and academic coaching to help students achieve their goals.',
    shortDescription: 'Academic support and tutoring services',
    category: 'Academic Support',
    memberCount: Math.floor(Math.random() * 500) + 100,
    campus: Math.random() > 0.5 ? 'Al Ain Campus' : 'Abu Dhabi Campus',
    image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    isJoined: false,
  },
  {
    id: '9',
    name: 'College of Engineering',
    description: 'Join fellow engineering students in academic discussions, project collaborations, industry networking, and professional development activities.',
    shortDescription: 'Engineering student community and networking',
    category: 'Academic College',
    memberCount: Math.floor(Math.random() * 500) + 100,
    campus: Math.random() > 0.5 ? 'Al Ain Campus' : 'Abu Dhabi Campus',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    isJoined: false,
  },
  {
    id: '10',
    name: 'College of Business',
    description: 'Connect with business students and faculty for networking opportunities, case study competitions, entrepreneurship programs, and career development.',
    shortDescription: 'Business student networking and development',
    category: 'Academic College',
    memberCount: Math.floor(Math.random() * 500) + 100,
    campus: Math.random() > 0.5 ? 'Al Ain Campus' : 'Abu Dhabi Campus',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    isJoined: false,
  },
];

export default function GroupsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showGroupModal, setShowGroupModal] = useState(false);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGroupPress = (group: Group) => {
    setSelectedGroup(group);
    setShowGroupModal(true);
  };

  const handleJoinGroup = (groupId: string) => {
    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? { ...group, isJoined: !group.isJoined, memberCount: group.isJoined ? group.memberCount - 1 : group.memberCount + 1 }
          : group
      )
    );
    setSelectedGroup(prev => 
      prev ? { ...prev, isJoined: !prev.isJoined, memberCount: prev.isJoined ? prev.memberCount - 1 : prev.memberCount + 1 } : null
    );
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Career Services': '#3B82F6',
      'Student Services': '#10B981',
      'Support Services': '#8B5CF6',
      'Student Life': '#F59E0B',
      'Housing': '#EF4444',
      'Health & Wellness': '#06B6D4',
      'Administration': '#6B7280',
      'Academic Support': '#84CC16',
      'Academic College': '#F97316',
    };
    return colors[category] || '#6B7280';
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Groups</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search groups..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Results Header */}
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsText}>
              {filteredGroups.length} group{filteredGroups.length !== 1 ? 's' : ''} available
            </Text>
          </View>

          {/* Groups List */}
          <ScrollView style={styles.groupsContainer} showsVerticalScrollIndicator={false}>
            {filteredGroups.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={64} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>No groups found</Text>
                <Text style={styles.emptyText}>
                  Try adjusting your search terms or browse all available groups
                </Text>
              </View>
            ) : (
              filteredGroups.map((group) => (
                <TouchableOpacity
                  key={group.id}
                  style={styles.groupCard}
                  onPress={() => handleGroupPress(group)}
                >
                  <Image source={{ uri: group.image }} style={styles.groupImage} />
                  
                  <View style={styles.groupContent}>
                    <View style={styles.groupHeader}>
                      <View
                        style={[
                          styles.categoryBadge,
                          { backgroundColor: getCategoryColor(group.category) },
                        ]}
                      >
                        <Text style={styles.categoryText}>{group.category}</Text>
                      </View>
                      {group.isJoined && (
                        <View style={styles.joinedBadge}>
                          <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                          <Text style={styles.joinedText}>Joined</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.groupName} numberOfLines={2}>
                      {group.name}
                    </Text>
                    
                    <Text style={styles.groupDescription} numberOfLines={2}>
                      {group.shortDescription}
                    </Text>

                    <View style={styles.groupFooter}>
                      <View style={styles.groupStats}>
                        <View style={styles.statItem}>
                          <Ionicons name="people-outline" size={16} color="#6B7280" />
                          <Text style={styles.statText}>{group.memberCount} members</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Ionicons name="location-outline" size={16} color="#6B7280" />
                          <Text style={styles.statText}>{group.campus}</Text>
                        </View>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        {/* Group Detail Modal */}
        <Modal
          visible={showGroupModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowGroupModal(false)}
        >
          {selectedGroup && (
            <SafeAreaView style={styles.modalContainer}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  onPress={() => setShowGroupModal(false)} 
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Group Details</Text>
                <View style={styles.modalPlaceholder} />
              </View>

              <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                {/* Group Image */}
                <Image source={{ uri: selectedGroup.image }} style={styles.modalGroupImage} />
                
                {/* Group Info */}
                <View style={styles.modalGroupInfo}>
                  <View style={styles.modalGroupHeader}>
                    <View
                      style={[
                        styles.modalCategoryBadge,
                        { backgroundColor: getCategoryColor(selectedGroup.category) },
                      ]}
                    >
                      <Text style={styles.modalCategoryText}>{selectedGroup.category}</Text>
                    </View>
                    {selectedGroup.isJoined && (
                      <View style={styles.modalJoinedBadge}>
                        <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                        <Text style={styles.modalJoinedText}>Joined</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.modalGroupName}>{selectedGroup.name}</Text>
                  
                  <View style={styles.modalGroupStats}>
                    <View style={styles.modalStatItem}>
                      <Ionicons name="people" size={20} color="#6B7280" />
                      <Text style={styles.modalStatText}>{selectedGroup.memberCount} members</Text>
                    </View>
                    <View style={styles.modalStatItem}>
                      <Ionicons name="location" size={20} color="#6B7280" />
                      <Text style={styles.modalStatText}>{selectedGroup.campus}</Text>
                    </View>
                  </View>

                  <Text style={styles.modalGroupDescription}>{selectedGroup.description}</Text>

                  {/* Join/Leave Button */}
                  <TouchableOpacity
                    style={[
                      styles.joinButton,
                      selectedGroup.isJoined && styles.leaveButton
                    ]}
                    onPress={() => handleJoinGroup(selectedGroup.id)}
                  >
                    <Ionicons 
                      name={selectedGroup.isJoined ? "remove-circle" : "add-circle"} 
                      size={20} 
                      color="white" 
                    />
                    <Text style={styles.joinButtonText}>
                      {selectedGroup.isJoined ? 'Leave Group' : 'Join Group'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </SafeAreaView>
          )}
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  resultsText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  groupsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  groupCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groupImage: {
    width: '100%',
    height: 150,
  },
  groupContent: {
    padding: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  joinedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  joinedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 24,
  },
  groupDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupStats: {
    flex: 1,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCloseButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalPlaceholder: {
    width: 34,
  },
  modalContent: {
    flex: 1,
  },
  modalGroupImage: {
    width: '100%',
    height: 200,
  },
  modalGroupInfo: {
    padding: 20,
    backgroundColor: 'white',
  },
  modalGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalCategoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  modalCategoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  modalJoinedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalJoinedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  modalGroupName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    lineHeight: 32,
  },
  modalGroupStats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  modalStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalStatText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  modalGroupDescription: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 24,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  leaveButton: {
    backgroundColor: '#6B7280',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});