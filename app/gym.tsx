import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

interface GymGroup {
  id: string;
  name: string;
  description: string;
  category: 'weightlifting' | 'calisthenics' | 'martial-arts' | 'cardio' | 'yoga' | 'sports';
  memberCount: number;
  campus: 'Al Ain Campus' | 'Abu Dhabi Campus';
  schedule: string[];
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  image: string;
  isJoined: boolean;
}

interface GymReservation {
  id: string;
  date: string;
  timeSlot: string;
  equipment?: string;
  purpose: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const mockGymGroups: GymGroup[] = [
  {
    id: '1',
    name: 'Iron Warriors Weightlifting',
    description: 'Serious weightlifting group focused on strength training, powerlifting, and bodybuilding techniques.',
    category: 'weightlifting',
    memberCount: Math.floor(Math.random() * 50) + 20,
    campus: Math.random() > 0.5 ? 'Al Ain Campus' : 'Abu Dhabi Campus',
    schedule: ['Mon 6-8 PM', 'Wed 6-8 PM', 'Fri 6-8 PM'],
    instructor: 'Coach Ahmed',
    level: 'Intermediate',
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    isJoined: false,
  },
  {
    id: '2',
    name: 'Calisthenics Masters',
    description: 'Bodyweight training group focusing on pull-ups, push-ups, muscle-ups, and advanced calisthenics movements.',
    category: 'calisthenics',
    memberCount: Math.floor(Math.random() * 50) + 20,
    campus: Math.random() > 0.5 ? 'Al Ain Campus' : 'Abu Dhabi Campus',
    schedule: ['Tue 5-7 PM', 'Thu 5-7 PM', 'Sat 9-11 AM'],
    instructor: 'Coach Sarah',
    level: 'All Levels',
    image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    isJoined: false,
  },
  {
    id: '3',
    name: 'Karate Club',
    description: 'Traditional karate training with focus on discipline, technique, and self-defense.',
    category: 'martial-arts',
    memberCount: Math.floor(Math.random() * 50) + 20,
    campus: Math.random() > 0.5 ? 'Al Ain Campus' : 'Abu Dhabi Campus',
    schedule: ['Mon 7-9 PM', 'Wed 7-9 PM', 'Sat 10-12 PM'],
    instructor: 'Sensei Omar',
    level: 'All Levels',
    image: 'https://images.pexels.com/photos/7045617/pexels-photo-7045617.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    isJoined: false,
  },
  {
    id: '4',
    name: 'Boxing Fitness',
    description: 'High-intensity boxing workouts combining technique training with cardio fitness.',
    category: 'martial-arts',
    memberCount: Math.floor(Math.random() * 50) + 20,
    campus: Math.random() > 0.5 ? 'Al Ain Campus' : 'Abu Dhabi Campus',
    schedule: ['Tue 6-8 PM', 'Thu 6-8 PM', 'Sun 4-6 PM'],
    instructor: 'Coach Fatima',
    level: 'Intermediate',
    image: 'https://images.pexels.com/photos/4754146/pexels-photo-4754146.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    isJoined: false,
  },
  {
    id: '5',
    name: 'HIIT Cardio Blast',
    description: 'High-intensity interval training sessions for maximum calorie burn and cardiovascular fitness.',
    category: 'cardio',
    memberCount: Math.floor(Math.random() * 50) + 20,
    campus: Math.random() > 0.5 ? 'Al Ain Campus' : 'Abu Dhabi Campus',
    schedule: ['Mon 7-8 AM', 'Wed 7-8 AM', 'Fri 7-8 AM'],
    instructor: 'Coach Layla',
    level: 'All Levels',
    image: 'https://images.pexels.com/photos/4162438/pexels-photo-4162438.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    isJoined: false,
  },
  {
    id: '6',
    name: 'Zen Yoga Flow',
    description: 'Peaceful yoga sessions focusing on flexibility, mindfulness, and stress relief.',
    category: 'yoga',
    memberCount: Math.floor(Math.random() * 50) + 20,
    campus: Math.random() > 0.5 ? 'Al Ain Campus' : 'Abu Dhabi Campus',
    schedule: ['Tue 8-9 AM', 'Thu 8-9 AM', 'Sat 8-9 AM'],
    instructor: 'Instructor Maryam',
    level: 'All Levels',
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    isJoined: false,
  },
  {
    id: '7',
    name: 'Basketball League',
    description: 'Competitive basketball games and training sessions for all skill levels.',
    category: 'sports',
    memberCount: Math.floor(Math.random() * 50) + 20,
    campus: Math.random() > 0.5 ? 'Al Ain Campus' : 'Abu Dhabi Campus',
    schedule: ['Wed 8-10 PM', 'Fri 8-10 PM', 'Sun 6-8 PM'],
    instructor: 'Coach Khalid',
    level: 'All Levels',
    image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    isJoined: false,
  },
  {
    id: '8',
    name: 'Powerlifting Elite',
    description: 'Advanced powerlifting group focusing on squat, bench press, and deadlift competitions.',
    category: 'weightlifting',
    memberCount: Math.floor(Math.random() * 50) + 20,
    campus: Math.random() > 0.5 ? 'Al Ain Campus' : 'Abu Dhabi Campus',
    schedule: ['Mon 5-7 PM', 'Thu 5-7 PM', 'Sat 2-4 PM'],
    instructor: 'Coach Hassan',
    level: 'Advanced',
    image: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    isJoined: false,
  },
];

const timeSlots = [
  '6:00 AM - 7:00 AM',
  '7:00 AM - 8:00 AM',
  '8:00 AM - 9:00 AM',
  '5:00 PM - 6:00 PM',
  '6:00 PM - 7:00 PM',
  '7:00 PM - 8:00 PM',
  '8:00 PM - 9:00 PM',
];

export default function GymScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'groups' | 'reserve'>('groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<GymGroup | null>(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [gymGroups, setGymGroups] = useState<GymGroup[]>(mockGymGroups);
  const [reservations, setReservations] = useState<GymReservation[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [equipment, setEquipment] = useState('');
  const [purpose, setPurpose] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const filteredGroups = gymGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.level.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      weightlifting: '#EF4444',
      calisthenics: '#3B82F6',
      'martial-arts': '#8B5CF6',
      cardio: '#F59E0B',
      yoga: '#10B981',
      sports: '#F97316',
    };
    return colors[category] || '#6B7280';
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      weightlifting: 'barbell',
      calisthenics: 'fitness',
      'martial-arts': 'hand-left',
      cardio: 'heart',
      yoga: 'leaf',
      sports: 'basketball',
    };
    return icons[category] || 'fitness';
  };

  const handleGroupPress = (group: GymGroup) => {
    setSelectedGroup(group);
    setShowGroupModal(true);
  };

  const handleJoinGroup = (groupId: string) => {
    setGymGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? { 
              ...group, 
              isJoined: !group.isJoined, 
              memberCount: group.isJoined ? group.memberCount - 1 : group.memberCount + 1 
            }
          : group
      )
    );
    setSelectedGroup(prev => 
      prev ? { 
        ...prev, 
        isJoined: !prev.isJoined, 
        memberCount: prev.isJoined ? prev.memberCount - 1 : prev.memberCount + 1 
      } : null
    );
  };

  const submitGymReservation = () => {
    if (!selectedTimeSlot || !purpose.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newReservation: GymReservation = {
      id: Date.now().toString(),
      date: selectedDate.toDateString(),
      timeSlot: selectedTimeSlot,
      equipment: equipment.trim() || undefined,
      purpose: purpose.trim(),
      status: 'pending',
    };

    setReservations(prev => [...prev, newReservation]);
    setShowReservationModal(false);
    setSelectedTimeSlot('');
    setEquipment('');
    setPurpose('');
    
    Alert.alert('Success', 'Your gym reservation has been submitted and is pending approval.');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gym & Fitness</Text>
          <TouchableOpacity style={styles.historyButton}>
            <Ionicons name="time" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
              onPress={() => setActiveTab('groups')}
            >
              <Ionicons 
                name="people" 
                size={20} 
                color={activeTab === 'groups' ? 'white' : '#6B7280'} 
              />
              <Text style={[
                styles.tabText, 
                activeTab === 'groups' && styles.activeTabText
              ]}>
                Groups
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'reserve' && styles.activeTab]}
              onPress={() => setActiveTab('reserve')}
            >
              <Ionicons 
                name="calendar" 
                size={20} 
                color={activeTab === 'reserve' ? 'white' : '#6B7280'} 
              />
              <Text style={[
                styles.tabText, 
                activeTab === 'reserve' && styles.activeTabText
              ]}>
                Reserve
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'groups' ? (
            <>
              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                  <Ionicons name="search" size={20} color="#9CA3AF" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search fitness groups..."
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

              {/* Groups List */}
              <ScrollView style={styles.groupsContainer} showsVerticalScrollIndicator={false}>
                {filteredGroups.map((group) => (
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
                          <Ionicons 
                            name={getCategoryIcon(group.category) as any} 
                            size={12} 
                            color="white" 
                          />
                          <Text style={styles.categoryText}>{group.category.replace('-', ' ')}</Text>
                        </View>
                        {group.isJoined && (
                          <View style={styles.joinedBadge}>
                            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                            <Text style={styles.joinedText}>Joined</Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.groupName}>{group.name}</Text>
                      <Text style={styles.groupDescription} numberOfLines={2}>
                        {group.description}
                      </Text>

                      <View style={styles.groupDetails}>
                        <View style={styles.detailItem}>
                          <Ionicons name="person" size={14} color="#6B7280" />
                          <Text style={styles.detailText}>{group.instructor}</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Ionicons name="trophy" size={14} color="#6B7280" />
                          <Text style={styles.detailText}>{group.level}</Text>
                        </View>
                      </View>

                      <View style={styles.groupFooter}>
                        <Text style={styles.memberCount}>{group.memberCount} members</Text>
                        <Text style={styles.campus}>{group.campus}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          ) : (
            /* Gym Reservation Tab */
            <ScrollView style={styles.reservationContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.reservationCard}>
                <Text style={styles.reservationTitle}>Reserve Gym Time</Text>
                <Text style={styles.reservationSubtitle}>
                  Book your personal gym session or equipment time
                </Text>

                <TouchableOpacity
                  style={styles.reserveGymButton}
                  onPress={() => setShowReservationModal(true)}
                >
                  <Ionicons name="calendar" size={20} color="white" />
                  <Text style={styles.reserveGymButtonText}>Make Reservation</Text>
                </TouchableOpacity>
              </View>

              {/* Available Time Slots */}
              <View style={styles.timeSlotsCard}>
                <Text style={styles.timeSlotsTitle}>Available Time Slots Today</Text>
                {timeSlots.map((slot, index) => (
                  <View key={index} style={styles.timeSlotItem}>
                    <Ionicons name="time" size={16} color="#6B7280" />
                    <Text style={styles.timeSlotText}>{slot}</Text>
                    <View style={styles.availabilityBadge}>
                      <Text style={styles.availabilityText}>Available</Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
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

              <ScrollView style={styles.modalContent}>
                <Image source={{ uri: selectedGroup.image }} style={styles.modalGroupImage} />
                
                <View style={styles.modalGroupInfo}>
                  <View style={styles.modalGroupHeader}>
                    <View
                      style={[
                        styles.modalCategoryBadge,
                        { backgroundColor: getCategoryColor(selectedGroup.category) },
                      ]}
                    >
                      <Ionicons 
                        name={getCategoryIcon(selectedGroup.category) as any} 
                        size={16} 
                        color="white" 
                      />
                      <Text style={styles.modalCategoryText}>
                        {selectedGroup.category.replace('-', ' ')}
                      </Text>
                    </View>
                    {selectedGroup.isJoined && (
                      <View style={styles.modalJoinedBadge}>
                        <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                        <Text style={styles.modalJoinedText}>Joined</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.modalGroupName}>{selectedGroup.name}</Text>
                  <Text style={styles.modalGroupDescription}>{selectedGroup.description}</Text>

                  <View style={styles.modalGroupStats}>
                    <View style={styles.modalStatItem}>
                      <Ionicons name="people" size={20} color="#6B7280" />
                      <Text style={styles.modalStatText}>{selectedGroup.memberCount} members</Text>
                    </View>
                    <View style={styles.modalStatItem}>
                      <Ionicons name="person" size={20} color="#6B7280" />
                      <Text style={styles.modalStatText}>{selectedGroup.instructor}</Text>
                    </View>
                    <View style={styles.modalStatItem}>
                      <Ionicons name="trophy" size={20} color="#6B7280" />
                      <Text style={styles.modalStatText}>{selectedGroup.level}</Text>
                    </View>
                    <View style={styles.modalStatItem}>
                      <Ionicons name="location" size={20} color="#6B7280" />
                      <Text style={styles.modalStatText}>{selectedGroup.campus}</Text>
                    </View>
                  </View>

                  <View style={styles.scheduleSection}>
                    <Text style={styles.scheduleTitle}>Schedule</Text>
                    {selectedGroup.schedule.map((time, index) => (
                      <View key={index} style={styles.scheduleItem}>
                        <Ionicons name="time" size={16} color="#6B7280" />
                        <Text style={styles.scheduleText}>{time}</Text>
                      </View>
                    ))}
                  </View>

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

        {/* Gym Reservation Modal */}
        <Modal
          visible={showReservationModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowReservationModal(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={() => setShowReservationModal(false)} 
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Reserve Gym</Text>
              <TouchableOpacity 
                onPress={submitGymReservation}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Date</Text>
                <TouchableOpacity 
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                  <Text style={styles.dateButtonText}>{selectedDate.toDateString()}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Time Slot *</Text>
                {timeSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.timeSlotOption,
                      selectedTimeSlot === slot && styles.selectedTimeSlot
                    ]}
                    onPress={() => setSelectedTimeSlot(slot)}
                  >
                    <Text style={[
                      styles.timeSlotOptionText,
                      selectedTimeSlot === slot && styles.selectedTimeSlotText
                    ]}>
                      {slot}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Equipment (Optional)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Specific equipment needed..."
                  value={equipment}
                  onChangeText={setEquipment}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Purpose *</Text>
                <TextInput
                  style={styles.purposeInput}
                  placeholder="Describe your workout plan..."
                  value={purpose}
                  onChangeText={setPurpose}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setSelectedDate(date);
                }}
              />
            )}
          </SafeAreaView>
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
  historyButton: {
    padding: 8,
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#DC2626',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: 'white',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
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
  },
  groupDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  groupDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberCount: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  campus: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  reservationContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  reservationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reservationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  reservationSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  reserveGymButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  reserveGymButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  timeSlotsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeSlotsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  timeSlotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  timeSlotText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  availabilityBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  modalCategoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
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
    marginBottom: 12,
  },
  modalGroupDescription: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 20,
  },
  modalGroupStats: {
    gap: 12,
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
  scheduleSection: {
    marginBottom: 24,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  scheduleText: {
    fontSize: 14,
    color: '#4B5563',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  leaveButton: {
    backgroundColor: '#6B7280',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  submitButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
  formSection: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#1F2937',
  },
  timeSlotOption: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedTimeSlot: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  timeSlotOptionText: {
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'center',
  },
  selectedTimeSlotText: {
    color: 'white',
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  purposeInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    textAlignVertical: 'top',
    minHeight: 100,
  },
});