import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Platform } from 'react-native';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNews } from '../../hooks/usedSupabaseData';
import { useRouter } from 'expo-router';
import { useSupabaseInsert, useCampusEvents, useUserEventRegistrations, useEvents } from '../../hooks/usedSupabaseData';
import QRTicket from '../../components/QRTicket';
import { useAuth } from '../../contexts/AuthContext';

interface RegisteredEvent {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  event_date: string;
  event_time: string;
  author: string;
  category: string;
}

export default function EventsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { data: campusEvents, loading, error } = useCampusEvents();
  const { 
    registrations: registeredEvents, 
    registerForEvent, 
    unregisterFromEvent,
    loading: registrationsLoading 
  } = useUserEventRegistrations();
  const { refetch: refetchEvents } = useEvents();
  const { insert: insertEvent } = useSupabaseInsert('events');
  const [showQRTicket, setShowQRTicket] = useState(false);
  const [selectedEventForTicket, setSelectedEventForTicket] = useState<any>(null);
  const [showRegisteredEvents, setShowRegisteredEvents] = useState(false);
  
  const categories = [
    { name: 'All', icon: 'grid-outline' },
    { name: 'Academic', icon: 'school-outline' },
    { name: 'Social', icon: 'people-outline' },
    { name: 'Sports', icon: 'fitness-outline' },
    { name: 'Career', icon: 'briefcase-outline' },
    { name: 'Workshop', icon: 'construct-outline' }
  ];
  

  // Use campus events directly
  const events = campusEvents.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    image: item.image_url || 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    category: item.category,
    author: item.author,
    location: item.location,
    event_date: item.event_date,
    event_time: item.event_time,
    max_attendees: item.max_attendees,
    current_attendees: item.current_attendees,
  }));

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleRegistration = async (eventId: string) => {
    if (registeredEvents.includes(eventId)) {
      await unregisterFromEvent(eventId);
    } else {
      await registerForEvent(eventId);
    }
  };

  const addToCalendar = async (event: any) => {
    // Create a calendar event from the news/event item
    const calendarEvent = {
      title: event.title,
      subtitle: `Organized by ${event.author}`,
      description: event.description,
      location: event.location,
      start_time: event.event_date,
      end_time: new Date(new Date(event.event_date).getTime() + 2 * 60 * 60 * 1000).toISOString(), // Add 2 hours
      color: '#4285F4',
      category: 'event',
    };

    const success = await insertEvent(calendarEvent);
    
    if (success) {
      // Mark as registered and refresh events
      await registerForEvent(event.id);
      refetchEvents(); // Refresh calendar events
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const showTicket = (event: any) => {
    setSelectedEventForTicket(event);
    setShowQRTicket(true);
  };

  const getRegisteredEventsList = (): RegisteredEvent[] => {
    return events.filter(event => registeredEvents.includes(event.id));
  };

  const showRegisteredEventsList = () => {
    setShowRegisteredEvents(true);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Events</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.ticketButton}
              onPress={showRegisteredEventsList}
            >
              <Ionicons name="ticket" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Area with Light Grey Background */}
        <View style={styles.contentArea}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search events..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Categories */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.name && styles.categoryChipActive
                ]}
                onPress={() => setSelectedCategory(category.name)}
              >
                <Ionicons 
                  name={category.icon as any} 
                  size={14} 
                  color={selectedCategory === category.name ? 'white' : '#6B7280'} 
                />
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.name && styles.categoryTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Events List */}
          <ScrollView style={styles.eventsContainer} showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading events...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error loading events: {error}</Text>
              </View>
            ) : filteredEvents.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No events found</Text>
              </View>
            ) : (
              filteredEvents.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <Image source={{ uri: event.image }} style={styles.eventImage} />
                <View style={styles.eventContent}>
                  <View style={styles.eventHeader}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{event.category}</Text>
                    </View>
                    {registeredEvents.includes(event.id) && (
                      <View style={styles.registeredBadge}>
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                        <Text style={styles.registeredText}>Registered</Text>
                      </View>
                    )}
                  </View>
                  
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  
                  <View style={styles.eventDetails}>
                    <View style={styles.eventDetailRow}>
                      <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                      <Text style={styles.eventDetailText}>
                        {formatEventDate(event.event_date)} at {event.event_time}
                      </Text>
                    </View>
                    <View style={styles.eventDetailRow}>
                      <Ionicons name="location-outline" size={16} color="#6B7280" />
                      <Text style={styles.eventDetailText}>{event.location}</Text>
                    </View>
                    <View style={styles.eventDetailRow}>
                      <Ionicons name="people-outline" size={16} color="#6B7280" />
                      <Text style={styles.eventDetailText}>
                        {event.current_attendees}/{event.max_attendees} registered
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.eventDescription}>{event.description}</Text>
                  
                  <TouchableOpacity
                    style={[
                      styles.registerButton,
                      registeredEvents.includes(event.id) && styles.registeredButton
                    ]}
                    onPress={() => {
                      if (registeredEvents.includes(event.id)) {
                        toggleRegistration(event.id);
                      } else {
                        addToCalendar(event);
                      }
                    }}
                  >
                    <Ionicons 
                      name={registeredEvents.includes(event.id) ? "checkmark-circle" : "calendar"} 
                      size={20} 
                      color="white" 
                    />
                    <Text style={styles.registerButtonText}>
                      {registeredEvents.includes(event.id) ? 'Registered' : 'Add to calendar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              {/* Show Ticket Button for registered events */}
                  {registeredEvents.includes(event.id) && (
                <TouchableOpacity
                  style={styles.ticketButtonSmall}
                  onPress={() => showTicket(event)}
                >
                  <Ionicons name="ticket" size={16} color="#DC2626" />
                  <Text style={styles.ticketButtonText}>View Ticket</Text>
                </TouchableOpacity>
              )}
                </View>
              
              ))
            )}
          </ScrollView>
        </View>
        
        {/* QR Ticket Modal */}
        <QRTicket
          visible={showQRTicket}
          onClose={() => setShowQRTicket(false)}
          event={selectedEventForTicket}
        />

        {/* Registered Events Modal */}
        <Modal
          visible={showRegisteredEvents}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowRegisteredEvents(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={() => setShowRegisteredEvents(false)} 
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#1F2937" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>My Tickets</Text>
              <View style={styles.modalPlaceholder} />
            </View>

            {/* Registered Events List */}
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {getRegisteredEventsList().length === 0 ? (
                <View style={styles.emptyTicketsContainer}>
                  <Ionicons name="ticket-outline" size={64} color="#D1D5DB" />
                  <Text style={styles.emptyTicketsTitle}>No Tickets Yet</Text>
                  <Text style={styles.emptyTicketsText}>
                    Register for events to see your tickets here
                  </Text>
                </View>
              ) : (
                getRegisteredEventsList().map((event) => (
                  <TouchableOpacity
                    key={event.id}
                    style={styles.ticketEventCard}
                    onPress={() => {
                      setSelectedEventForTicket(event);
                      setShowRegisteredEvents(false);
                      setShowQRTicket(true);
                    }}
                  >
                    <View style={styles.ticketEventContent}>
                      <View style={styles.ticketEventHeader}>
                        <Text style={styles.ticketEventTitle}>{event.title}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                      </View>
                      
                      <View style={styles.ticketEventDetails}>
                        <View style={styles.ticketEventDetailRow}>
                          <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                          <Text style={styles.ticketEventDetailText}>
                            {formatEventDate(event.event_date)} at {event.event_time}
                          </Text>
                        </View>
                        <View style={styles.ticketEventDetailRow}>
                          <Ionicons name="location-outline" size={14} color="#6B7280" />
                          <Text style={styles.ticketEventDetailText}>{event.location}</Text>
                        </View>
                      </View>

                      <View style={styles.ticketBadge}>
                        <Ionicons name="ticket" size={12} color="#DC2626" />
                        <Text style={styles.ticketBadgeText}>Tap to view ticket</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  filterButton: {
    padding: 8,
  },
  ticketButton: {
    padding: 8,
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
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
  categoriesContainer: {
    paddingLeft: 20,
    marginBottom: 15,
    maxHeight: 32,
  },
  categoriesContent: {
    paddingRight: 20,
    alignItems: 'center',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'white',
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 4,
    height: 32,
  },
  categoryChipActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: 'white',
  },
  eventsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  eventImage: {
    width: '100%',
    height: 200,
  },
  eventContent: {
    padding: 20,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  registeredText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    lineHeight: 24,
  },
  eventDetails: {
    marginBottom: 12,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  eventDetailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  eventDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  registeredButton: {
    backgroundColor: '#10B981',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  ticketButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 6,
  },
  ticketButtonText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
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
  emptyTicketsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTicketsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyTicketsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  ticketEventCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketEventContent: {
    padding: 16,
  },
  ticketEventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketEventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  ticketEventDetails: {
    marginBottom: 12,
  },
  ticketEventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  ticketEventDetailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  ticketBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  ticketBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#DC2626',
  },
});