import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

interface Tutor {
  id: string;
  name: string;
  studentId: string;
  year: string;
  major: string;
  profileImage: string;
  bio: string;
  subjects: string[];
  availableTimes: string[];
  rating: number;
  totalSessions: number;
  email: string;
  phone?: string;
}

const mockTutors: Tutor[] = [
  {
    id: '1',
    name: 'Sarah Ahmed',
    studentId: '1092345',
    year: '4th Year',
    major: 'Computer Engineering',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Passionate about helping students excel in programming and mathematics. I have 3 years of tutoring experience and specialize in making complex concepts easy to understand.',
    subjects: ['CSC303', 'CSC202', 'MTT205', 'CSC101'],
    availableTimes: ['Mon 2-4 PM', 'Wed 10-12 PM', 'Fri 3-5 PM'],
    rating: 4.8,
    totalSessions: 45,
    email: '1092345@adu.ac.ae',
    phone: '+971 50 123 4567',
  },
  {
    id: '2',
    name: 'Ahmed Hassan',
    studentId: '1091234',
    year: '3rd Year',
    major: 'Electrical Engineering',
    profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Engineering student with strong foundation in physics and mathematics. I enjoy breaking down complex problems into simple steps.',
    subjects: ['PHY201', 'MTT205', 'EEN320', 'MTT101'],
    availableTimes: ['Tue 1-3 PM', 'Thu 11-1 PM', 'Sat 9-11 AM'],
    rating: 4.6,
    totalSessions: 32,
    email: '1091234@adu.ac.ae',
  },
  {
    id: '3',
    name: 'Fatima Al-Zahra',
    studentId: '1093456',
    year: '4th Year',
    major: 'Business Administration',
    profileImage: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Business major with expertise in economics, statistics, and business fundamentals. I love helping students understand real-world applications.',
    subjects: ['BUS101', 'ECO201', 'STA205', 'MGT301'],
    availableTimes: ['Mon 10-12 PM', 'Wed 2-4 PM', 'Thu 3-5 PM'],
    rating: 4.9,
    totalSessions: 58,
    email: '1093456@adu.ac.ae',
    phone: '+971 55 987 6543',
  },
  {
    id: '4',
    name: 'Omar Khalil',
    studentId: '1094567',
    year: '3rd Year',
    major: 'Mechanical Engineering',
    profileImage: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Mechanical engineering student passionate about physics and engineering design. I focus on practical problem-solving approaches.',
    subjects: ['PHY201', 'ENG201', 'MEC301', 'MTT205'],
    availableTimes: ['Tue 9-11 AM', 'Thu 2-4 PM', 'Fri 1-3 PM'],
    rating: 4.7,
    totalSessions: 28,
    email: '1094567@adu.ac.ae',
  },
  {
    id: '5',
    name: 'Layla Mohammed',
    studentId: '1095678',
    year: '4th Year',
    major: 'Computer Science',
    profileImage: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Computer Science senior with strong programming skills. I specialize in algorithms, data structures, and software development.',
    subjects: ['CSC303', 'CSC401', 'CSC202', 'CSC350'],
    availableTimes: ['Mon 3-5 PM', 'Wed 1-3 PM', 'Fri 10-12 PM'],
    rating: 4.8,
    totalSessions: 41,
    email: '1095678@adu.ac.ae',
    phone: '+971 52 456 7890',
  },
  {
    id: '6',
    name: 'Khalid Al-Rashid',
    studentId: '1096789',
    year: '3rd Year',
    major: 'Civil Engineering',
    profileImage: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Civil engineering student with expertise in structural analysis and mathematics. I enjoy helping students build strong foundations.',
    subjects: ['CIV201', 'MTT205', 'PHY201', 'ENG101'],
    availableTimes: ['Tue 10-12 PM', 'Thu 9-11 AM', 'Sat 2-4 PM'],
    rating: 4.5,
    totalSessions: 23,
    email: '1096789@adu.ac.ae',
  },
];

export default function TutoringScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [showTutorModal, setShowTutorModal] = useState(false);

  const filteredTutors = mockTutors.filter(tutor => {
    const query = searchQuery.toLowerCase();
    return (
      tutor.name.toLowerCase().includes(query) ||
      tutor.subjects.some(subject => subject.toLowerCase().includes(query)) ||
      tutor.major.toLowerCase().includes(query) ||
      tutor.studentId.includes(query)
    );
  });

  const getSubjectColor = (subject: string) => {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
      '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
    ];
    const index = subject.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleTutorPress = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setShowTutorModal(true);
  };

  const handleContactTutor = (tutor: Tutor) => {
    // In a real app, this would open email client or messaging
    console.log(`Contacting ${tutor.name} at ${tutor.email}`);
    setShowTutorModal(false);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={14} color="#F59E0B" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={14} color="#F59E0B" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={14} color="#D1D5DB" />);
    }
    
    return stars;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Peer Tutoring</Text>
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
                placeholder="Search by name, course code, or major..."
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
              {filteredTutors.length} tutor{filteredTutors.length !== 1 ? 's' : ''} available
            </Text>
          </View>

          {/* Tutors List */}
          <ScrollView style={styles.tutorsContainer} showsVerticalScrollIndicator={false}>
            {filteredTutors.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="school-outline" size={64} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>No tutors found</Text>
                <Text style={styles.emptyText}>
                  Try adjusting your search terms or browse all available tutors
                </Text>
              </View>
            ) : (
              filteredTutors.map((tutor) => (
                <TouchableOpacity
                  key={tutor.id}
                  style={styles.tutorCard}
                  onPress={() => handleTutorPress(tutor)}
                >
                  <View style={styles.tutorHeader}>
                    <Image source={{ uri: tutor.profileImage }} style={styles.tutorImage} />
                    <View style={styles.tutorInfo}>
                      <Text style={styles.tutorName}>{tutor.name}</Text>
                      <Text style={styles.tutorDetails}>
                        {tutor.year} • {tutor.major}
                      </Text>
                      <View style={styles.ratingContainer}>
                        <View style={styles.starsContainer}>
                          {renderStars(tutor.rating)}
                        </View>
                        <Text style={styles.ratingText}>
                          {tutor.rating} ({tutor.totalSessions} sessions)
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>

                  <Text style={styles.tutorBio} numberOfLines={2}>
                    {tutor.bio}
                  </Text>

                  {/* Subjects Tags */}
                  <View style={styles.subjectsContainer}>
                    {tutor.subjects.map((subject) => (
                      <View
                        key={subject}
                        style={[
                          styles.subjectTag,
                          { backgroundColor: getSubjectColor(subject) }
                        ]}
                      >
                        <Text style={styles.subjectText}>{subject}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Available Times */}
                  <View style={styles.timesContainer}>
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text style={styles.timesText}>
                      {tutor.availableTimes.slice(0, 2).join(', ')}
                      {tutor.availableTimes.length > 2 && ` +${tutor.availableTimes.length - 2} more`}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        {/* Tutor Detail Modal */}
        <Modal
          visible={showTutorModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowTutorModal(false)}
        >
          {selectedTutor && (
            <SafeAreaView style={styles.modalContainer}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  onPress={() => setShowTutorModal(false)} 
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Tutor Profile</Text>
                <View style={styles.modalPlaceholder} />
              </View>

              <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                  <Image source={{ uri: selectedTutor.profileImage }} style={styles.profileImage} />
                  <Text style={styles.profileName}>{selectedTutor.name}</Text>
                  <Text style={styles.profileDetails}>
                    {selectedTutor.year} • {selectedTutor.major}
                  </Text>
                  <Text style={styles.profileStudentId}>ID: {selectedTutor.studentId}</Text>
                  
                  <View style={styles.profileRating}>
                    <View style={styles.starsContainer}>
                      {renderStars(selectedTutor.rating)}
                    </View>
                    <Text style={styles.profileRatingText}>
                      {selectedTutor.rating} • {selectedTutor.totalSessions} sessions completed
                    </Text>
                  </View>
                </View>

                {/* Bio Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>About</Text>
                  <Text style={styles.bioText}>{selectedTutor.bio}</Text>
                </View>

                {/* Subjects Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Tutoring Subjects</Text>
                  <View style={styles.modalSubjectsContainer}>
                    {selectedTutor.subjects.map((subject) => (
                      <View
                        key={subject}
                        style={[
                          styles.modalSubjectTag,
                          { backgroundColor: getSubjectColor(subject) }
                        ]}
                      >
                        <Text style={styles.modalSubjectText}>{subject}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Available Times Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Available Times</Text>
                  {selectedTutor.availableTimes.map((time, index) => (
                    <View key={index} style={styles.timeSlot}>
                      <Ionicons name="time-outline" size={16} color="#6B7280" />
                      <Text style={styles.timeSlotText}>{time}</Text>
                    </View>
                  ))}
                </View>

                {/* Contact Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Contact Information</Text>
                  <View style={styles.contactItem}>
                    <Ionicons name="mail-outline" size={16} color="#6B7280" />
                    <Text style={styles.contactText}>{selectedTutor.email}</Text>
                  </View>
                  {selectedTutor.phone && (
                    <View style={styles.contactItem}>
                      <Ionicons name="call-outline" size={16} color="#6B7280" />
                      <Text style={styles.contactText}>{selectedTutor.phone}</Text>
                    </View>
                  )}
                </View>

                {/* Contact Button */}
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() => handleContactTutor(selectedTutor)}
                >
                  <Ionicons name="chatbubble-outline" size={20} color="white" />
                  <Text style={styles.contactButtonText}>Contact Tutor</Text>
                </TouchableOpacity>
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
  tutorsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tutorCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tutorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tutorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  tutorInfo: {
    flex: 1,
  },
  tutorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  tutorDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#6B7280',
  },
  tutorBio: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  subjectTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  timesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timesText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  profileStudentId: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  profileRating: {
    alignItems: 'center',
    gap: 4,
  },
  profileRatingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  modalSubjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  modalSubjectTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modalSubjectText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  timeSlotText: {
    fontSize: 16,
    color: '#4B5563',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#4B5563',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});