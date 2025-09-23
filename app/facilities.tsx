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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Facility {
  id: string;
  name: string;
  type: 'classroom' | 'library' | 'lab' | 'meeting';
  capacity: number;
  location: string;
  campus: 'Al Ain Campus' | 'Abu Dhabi Campus';
  amenities: string[];
  isAvailable: boolean;
  nextAvailable?: string;
}

interface Reservation {
  id: string;
  facilityId: string;
  facilityName: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const mockFacilities: Facility[] = [
  {
    id: '1',
    name: 'Classroom A-101',
    type: 'classroom',
    capacity: 30,
    location: 'Building A, Floor 1',
    campus: 'Al Ain Campus',
    amenities: ['Projector', 'Whiteboard', 'Air Conditioning', 'WiFi'],
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Library Study Room 1',
    type: 'library',
    capacity: 8,
    location: 'Main Library, Floor 2',
    campus: 'Al Ain Campus',
    amenities: ['Whiteboard', 'Power Outlets', 'Quiet Environment'],
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Computer Lab B-205',
    type: 'lab',
    capacity: 25,
    location: 'Building B, Floor 2',
    campus: 'Abu Dhabi Campus',
    amenities: ['25 Computers', 'Projector', 'Software Suite', 'Printer'],
    isAvailable: false,
    nextAvailable: '2:00 PM',
  },
  {
    id: '4',
    name: 'Meeting Room C-301',
    type: 'meeting',
    capacity: 12,
    location: 'Building C, Floor 3',
    campus: 'Al Ain Campus',
    amenities: ['Conference Table', 'Video Conferencing', 'Projector', 'WiFi'],
    isAvailable: true,
  },
  {
    id: '5',
    name: 'Classroom D-102',
    type: 'classroom',
    capacity: 40,
    location: 'Building D, Floor 1',
    campus: 'Abu Dhabi Campus',
    amenities: ['Smart Board', 'Sound System', 'Air Conditioning', 'WiFi'],
    isAvailable: true,
  },
  {
    id: '6',
    name: 'Library Study Room 2',
    type: 'library',
    capacity: 6,
    location: 'Main Library, Floor 1',
    campus: 'Abu Dhabi Campus',
    amenities: ['Whiteboard', 'Power Outlets', 'Quiet Environment', 'Books Access'],
    isAvailable: false,
    nextAvailable: '4:30 PM',
  },
];

export default function FacilitiesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [purpose, setPurpose] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const filteredFacilities = mockFacilities.filter(facility =>
    facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    facility.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    facility.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    facility.campus.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFacilityIcon = (type: string) => {
    switch (type) {
      case 'classroom': return 'school';
      case 'library': return 'library';
      case 'lab': return 'desktop';
      case 'meeting': return 'people';
      default: return 'business';
    }
  };

  const getFacilityColor = (type: string) => {
    switch (type) {
      case 'classroom': return '#3B82F6';
      case 'library': return '#10B981';
      case 'lab': return '#F59E0B';
      case 'meeting': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const handleReserveFacility = (facility: Facility) => {
    if (!facility.isAvailable) {
      Alert.alert('Unavailable', `This facility is currently unavailable. Next available at ${facility.nextAvailable}`);
      return;
    }
    setSelectedFacility(facility);
    setShowReservationModal(true);
  };

  const submitReservation = () => {
    if (!selectedFacility || !purpose.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newReservation: Reservation = {
      id: Date.now().toString(),
      facilityId: selectedFacility.id,
      facilityName: selectedFacility.name,
      date: selectedDate.toDateString(),
      startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      purpose: purpose.trim(),
      status: 'pending',
    };

    setReservations(prev => [...prev, newReservation]);
    setShowReservationModal(false);
    setPurpose('');
    
    Alert.alert('Success', 'Your reservation request has been submitted and is pending approval.');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Facilities</Text>
          <TouchableOpacity style={styles.historyButton}>
            <Ionicons name="time" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search facilities..."
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

          {/* Quick Filters */}
          <View style={styles.filtersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity style={styles.filterChip}>
                <Ionicons name="school" size={16} color="#3B82F6" />
                <Text style={styles.filterText}>Classrooms</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}>
                <Ionicons name="library" size={16} color="#10B981" />
                <Text style={styles.filterText}>Library Rooms</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}>
                <Ionicons name="desktop" size={16} color="#F59E0B" />
                <Text style={styles.filterText}>Labs</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterChip}>
                <Ionicons name="people" size={16} color="#8B5CF6" />
                <Text style={styles.filterText}>Meeting Rooms</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Facilities List */}
          <ScrollView style={styles.facilitiesContainer} showsVerticalScrollIndicator={false}>
            {filteredFacilities.map((facility) => (
              <View key={facility.id} style={styles.facilityCard}>
                <View style={styles.facilityHeader}>
                  <View style={[styles.facilityIcon, { backgroundColor: getFacilityColor(facility.type) }]}>
                    <Ionicons name={getFacilityIcon(facility.type) as any} size={24} color="white" />
                  </View>
                  <View style={styles.facilityInfo}>
                    <Text style={styles.facilityName}>{facility.name}</Text>
                    <Text style={styles.facilityLocation}>{facility.location}</Text>
                    <Text style={styles.facilityCampus}>{facility.campus}</Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: facility.isAvailable ? '#10B981' : '#EF4444' }
                  ]}>
                    <Text style={styles.statusText}>
                      {facility.isAvailable ? 'Available' : 'Busy'}
                    </Text>
                  </View>
                </View>

                <View style={styles.facilityDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="people-outline" size={16} color="#6B7280" />
                    <Text style={styles.detailText}>Capacity: {facility.capacity} people</Text>
                  </View>
                  {!facility.isAvailable && facility.nextAvailable && (
                    <View style={styles.detailRow}>
                      <Ionicons name="time-outline" size={16} color="#6B7280" />
                      <Text style={styles.detailText}>Next available: {facility.nextAvailable}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.amenitiesContainer}>
                  {facility.amenities.slice(0, 3).map((amenity, index) => (
                    <View key={index} style={styles.amenityTag}>
                      <Text style={styles.amenityText}>{amenity}</Text>
                    </View>
                  ))}
                  {facility.amenities.length > 3 && (
                    <Text style={styles.moreAmenities}>+{facility.amenities.length - 3} more</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.reserveButton,
                    !facility.isAvailable && styles.reserveButtonDisabled
                  ]}
                  onPress={() => handleReserveFacility(facility)}
                  disabled={!facility.isAvailable}
                >
                  <Ionicons 
                    name={facility.isAvailable ? "calendar" : "time"} 
                    size={20} 
                    color="white" 
                  />
                  <Text style={styles.reserveButtonText}>
                    {facility.isAvailable ? 'Reserve Now' : 'Not Available'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Reservation Modal */}
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
              <Text style={styles.modalTitle}>Reserve Facility</Text>
              <TouchableOpacity 
                onPress={submitReservation}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {selectedFacility && (
                <>
                  <View style={styles.facilityPreview}>
                    <Text style={styles.previewTitle}>{selectedFacility.name}</Text>
                    <Text style={styles.previewLocation}>{selectedFacility.location}</Text>
                    <Text style={styles.previewCapacity}>Capacity: {selectedFacility.capacity} people</Text>
                  </View>

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

                  <View style={styles.timeSection}>
                    <View style={styles.timeInput}>
                      <Text style={styles.formLabel}>Start Time</Text>
                      <TouchableOpacity 
                        style={styles.timeButton}
                        onPress={() => setShowStartTimePicker(true)}
                      >
                        <Ionicons name="time-outline" size={20} color="#6B7280" />
                        <Text style={styles.timeButtonText}>
                          {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.timeInput}>
                      <Text style={styles.formLabel}>End Time</Text>
                      <TouchableOpacity 
                        style={styles.timeButton}
                        onPress={() => setShowEndTimePicker(true)}
                      >
                        <Ionicons name="time-outline" size={20} color="#6B7280" />
                        <Text style={styles.timeButtonText}>
                          {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.formLabel}>Purpose *</Text>
                    <TextInput
                      style={styles.purposeInput}
                      placeholder="Describe the purpose of your reservation..."
                      value={purpose}
                      onChangeText={setPurpose}
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                </>
              )}
            </ScrollView>

            {/* Date/Time Pickers */}
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
            {showStartTimePicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                display="default"
                onChange={(event, time) => {
                  setShowStartTimePicker(false);
                  if (time) setStartTime(time);
                }}
              />
            )}
            {showEndTimePicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                display="default"
                onChange={(event, time) => {
                  setShowEndTimePicker(false);
                  if (time) setEndTime(time);
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
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  facilitiesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  facilityCard: {
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
  facilityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  facilityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  facilityInfo: {
    flex: 1,
  },
  facilityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  facilityLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  facilityCampus: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  facilityDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  amenityTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  amenityText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  moreAmenities: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  reserveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  reserveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  reserveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  submitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  submitButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  facilityPreview: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  previewLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  previewCapacity: {
    fontSize: 14,
    color: '#4B5563',
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
  timeSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  timeInput: {
    flex: 1,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  timeButtonText: {
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