import React, { useState, useRef, useCallback, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Platform, Dimensions } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import {
  CalendarBody,
  CalendarContainer,
  CalendarHeader,
  CalendarKitHandle,
  PackedEvent
} from "@howljs/calendar-kit";
import { EventData } from "../../components/EventForm";
import EventForm from "../../components/EventForm";

export enum CalendarViewType {
  OneDay = 'OneDay',
  ThreeDays = 'ThreeDays',
  FiveDays = 'FiveDays',
}

export const initialEvents: EventData[] = [
  {
    id: '1',
    title: 'CSC303',
    subtitle: 'Dr. Ahmed Hassan',
    description: 'Database Systems - Advanced SQL Queries',
    location: 'A-2F-13',
    start: { dateTime: '2025-07-14T05:00:00.000Z' },
    end: { dateTime: '2025-07-14T06:45:00.000Z' },
    color: '#4285F4',
  },
  {
    id: '2',
    title: 'MTT205',
    subtitle: 'Prof. Sarah Jamal',
    description: 'Linear Algebra',
    location: 'H1-11-A',
    start: { dateTime: '2025-07-14T11:00:00.000Z' },
    end: { dateTime: '2025-07-14T12:40:00.000Z' },
    color: '#DB4437',
  },
  {
    id: '3',
    title: 'PHY201',
    subtitle: 'Dr. Huma Zia',
    description: 'Physics II - Applications',
    location: 'D-0F-15',
    start: { dateTime: '2025-07-14T08:50:00.000Z' },
    end: { dateTime: '2025-07-14T10:20:00.000Z' },
    color: '#0F9D58',
  },
  {
    id: '4',
    title: 'CSC303',
    subtitle: 'Dr. Ahmed Hassan',
    description: 'Database Systems - Advanced SQL Queries',
    location: 'A-2F-13',
    start: { dateTime: '2025-07-16T05:00:00.000Z' },
    end: { dateTime: '2025-07-16T06:45:00.000Z' },
    color: '#4285F4',
  },
  {
    id: '5',
    title: 'MTT205',
    subtitle: 'Prof. Sarah Jamal',
    description: 'Linear Algebra',
    location: 'H1-11-A',
    start: { dateTime: '2025-07-16T11:00:00.000Z' },
    end: { dateTime: '2025-07-16T12:40:00.000Z' },
    color: '#DB4437',
  },
  {
    id: '6',
    title: 'PHY201',
    subtitle: 'Dr. Huma Zia',
    description: 'Physics II - Applications',
    location: 'D-0F-15',
    start: { dateTime: '2025-07-16T08:50:00.000Z' },
    end: { dateTime: '2025-07-16T10:20:00.000Z' },
    color: '#0F9D58',
  },
  {
    id: '7',
    title: 'CEN320',
    subtitle: 'Dr. Mary Jose',
    description: 'Signals and Systems',
    location: 'D-0F-12',
    start: { dateTime: '2025-07-15T12:55:00.000Z' },
    end: { dateTime: '2025-07-15T14:20:00.000Z' },
    color: '#F4B400',
  },
  {
    id: '8',
    title: 'FWS310',
    subtitle: 'Dr. Rubina Qureshi',
    description: 'Innovation Entrepreneurship',
    location: 'A-1F-02',
    start: { dateTime: '2025-07-15T07:00:00.000Z' },
    end: { dateTime: '2025-07-15T08:45:00.000Z' },
    color: '#9C27B0',
  },  
  {
    id: '9',
    title: 'CEN320',
    subtitle: 'Dr. Mary Jose',
    description: 'Signals and Systems',
    location: 'D-0F-12',
    start: { dateTime: '2025-07-17T12:55:00.000Z' },
    end: { dateTime: '2025-07-17T14:20:00.000Z' },
    color: '#F4B400',
  },
  {
    id: '10',
    title: 'FWS310',
    subtitle: 'Dr. Rubina Qureshi',
    description: 'Innovation Entrepreneurship',
    location: 'A-1F-02',
    start: { dateTime: '2025-07-17T07:00:00.000Z' },
    end: { dateTime: '2025-07-17T08:45:00.000Z' },
    color: '#9C27B0',
  },
  {
    id: '11',
    title: 'EEN320',
    subtitle: 'Prof. Hamdan',
    description: 'Electric Circuits',
    location: 'Studio H101',
    start: { dateTime: '2025-07-18T05:00:00.000Z' },
    end: { dateTime: '2025-07-18T06:40:00.000Z' },
    color: '#3F51B5',
  },
  {
    id: '12',
    title: 'EEN320',
    subtitle: 'Prof. Hamdan',
    description: 'Electric Circuits',
    location: 'Studio H101',
    start: { dateTime: '2025-07-18T06:50:00.000Z' },
    end: { dateTime: '2025-07-18T08:30:00.000Z' },
    color: '#3F51B5',
  },
];

export default function ScheduleScreen() {
  const [events, setEvents] = useState<EventData[]>(initialEvents);
  const [tempCalendarEvents, setTempCalendarEvents] = useState<EventData[]>([]);
  const [numberOfDays, setNumberOfDays] = useState<number>(5);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<PackedEvent | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewSelectorVisible, setViewSelectorVisible] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const calendarRef = useRef<CalendarKitHandle>(null);

  // Combine regular events with temporary calendar events
  const allEvents = [...events, ...tempCalendarEvents];

  // Function to add temporary calendar event
  const addTempCalendarEvent = (eventData: any) => {
    const calendarEvent: EventData = {
      id: `temp-${Date.now()}`,
      title: eventData.title,
      subtitle: `Organized by ${eventData.author}`,
      description: eventData.description,
      location: eventData.location,
      start: { dateTime: eventData.event_date },
      end: { dateTime: new Date(new Date(eventData.event_date).getTime() + 2 * 60 * 60 * 1000).toISOString() },
      color: '#4285F4',
    };
    
    setTempCalendarEvents(prev => [...prev, calendarEvent]);
  };

  // Expose the function globally so events page can use it
  React.useEffect(() => {
    (global as any).addTempCalendarEvent = addTempCalendarEvent;
    return () => {
      delete (global as any).addTempCalendarEvent;
    };
  }, []);
  const handleEventAdded = (newEvent: EventData) => {
    setEvents(currentEvents => [...currentEvents, newEvent]);
    setShowEventForm(false);
  };

  const handleViewChange = (view: CalendarViewType) => {
    console.log("View selected:", view);
    let days: number;
    
    switch (view) {
      case CalendarViewType.OneDay:
        days = 1;
        break;
      case CalendarViewType.ThreeDays:
        days = 3;
        break;
      case CalendarViewType.FiveDays:
      default:
        days = 5;
        break;
    }
    
    setNumberOfDays(days);
    setViewSelectorVisible(false);
  };

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    setTempDate(date);
    calendarRef.current?.goToDate({
      date: date.toISOString(),
      animatedDate: true,
      hourScroll: true,
    });
  }, []);

  const handleDateChange = useCallback((event: unknown, date?: Date) => {
    if (date) setTempDate(date);
  }, []);

  const handleDatePickerClose = useCallback(() => {
    setShowDatePicker(false);
  }, []);

  const handleMoveToDate = useCallback(() => {
    setSelectedDate(tempDate);
    calendarRef.current?.goToDate({
      date: tempDate.toISOString(),
      animatedDate: true,
      hourScroll: true,
    });
    setShowDatePicker(false);
  }, [tempDate]);

  const showToday = useCallback(() => {
    const today = new Date();
    setTempDate(today);
    setSelectedDate(today);
    calendarRef.current?.goToDate({
      date: today.toISOString(),
      animatedDate: true,
      hourScroll: true,
    });
  }, []);

  const highlightDates = useMemo(
    () => ({
      '6': { dayNumber: { color: 'blue' }, dayName: { color: 'blue' } },
      '7': { dayNumber: { color: 'red' }, dayName: { color: 'red' } },
    }),
    []
  );

  const currentView: CalendarViewType = numberOfDays === 1 
    ? CalendarViewType.OneDay 
    : numberOfDays === 3 
      ? CalendarViewType.ThreeDays 
      : CalendarViewType.FiveDays;
  
  const renderEvent = useCallback(
    (event: PackedEvent) => (
      <View style={{ width: "100%", height: "100%", padding: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop:2 }}>
        <Ionicons name="calendar" size={10} color="white" />
        <Text style={{ color: 'white', fontSize: 9, flexShrink: 1 }}>
          {event.title}
        </Text>
      </View>
        <Text style={{ color: 'white', fontSize: 9, marginTop: 3 }}>{event.subtitle}</Text>
        <Text style={{ color: 'white', fontSize: 9, marginTop: 3 }}>{event.location}</Text>
      </View>
    ),
    []
  );

  const handleEventPress = (event: PackedEvent) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  const deleteEvent = (eventId: string) => {
    setEvents(currentEvents => currentEvents.filter(e => e.id !== eventId));
    setModalVisible(false);
    setSelectedEvent(null);
  };

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formattedDate = format(selectedDate, 'MMM d, yyyy');
  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  // Always show current date in center section
  const currentDate = new Date();

  const viewOptions = [
    { type: CalendarViewType.OneDay, label: '1 Day' },
    { type: CalendarViewType.ThreeDays, label: '3 Days' },
    { type: CalendarViewType.FiveDays, label: '5 Days' },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Custom Header */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <View style={styles.leftSection}>
              <TouchableOpacity 
                style={styles.todayButton}
                onPress={() => setShowDatePicker(true)}
                onLongPress={showToday}
                delayLongPress={500}
              >
                <Ionicons name="calendar-outline" size={16} color="white" />
                <Text style={styles.todayText}>{isToday ? 'Today' : formattedDate}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setShowEventForm(true)}
              >
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.centerSection}>
              <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
            </View>

            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => setViewSelectorVisible(true)}
            >
              <Ionicons name="menu" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Full Width Calendar */}
        <View style={styles.calendarWrapper}>
          <CalendarContainer
            events={allEvents} 
            ref={calendarRef}
            numberOfDays={numberOfDays}
            scrollByDay={true}
            allowPinchToZoom={true}
            initialTimeIntervalHeight={50}
            maxTimeIntervalHeight={60}
            minTimeIntervalHeight={35}
            hourWidth={55}
            onPressEvent={handleEventPress}
            onLongPressEvent={(event) => deleteEvent(event.id)} 
            highlightDates={highlightDates}
            initialDate={selectedDate}
            useHaptic
            onDragCreateEventStart={() => {
            }}
            onDragEventEnd={async (event) => {
              console.log("onDragEventEnd", event);
              await new Promise((resolve) => setTimeout(resolve, 100));
            }}
          >
            <CalendarHeader />
            <CalendarBody renderEvent={renderEvent} />
          </CalendarContainer>
        </View>

        {/* Date Picker Modal */}
        <Modal transparent visible={showDatePicker} onRequestClose={handleDatePickerClose}>
          <TouchableWithoutFeedback onPress={handleDatePickerClose}>
            <View style={styles.modalOverlay}>
              <View style={styles.datePickerWrapper}>
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  textColor="black" 
                  themeVariant="light"
                  onChange={handleDateChange}
                />
                
                <TouchableOpacity 
                  style={styles.moveToDateButton}
                  onPress={handleMoveToDate}
                >
                  <Text style={styles.moveToDateText}>Move to Date!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* View Selector Modal */}
        <Modal 
          transparent 
          visible={viewSelectorVisible} 
          onRequestClose={() => setViewSelectorVisible(false)}
          animationType="fade"
        >
          <TouchableWithoutFeedback onPress={() => setViewSelectorVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.viewSelectorPopup}>
                {viewOptions.map((option) => (
                  <TouchableOpacity
                    key={option.type}
                    style={[
                      styles.viewOption, 
                      currentView === option.type && styles.selectedViewOption
                    ]}
                    onPress={() => handleViewChange(option.type)}
                  >
                    <Text style={[
                      styles.viewOptionText, 
                      currentView === option.type && styles.selectedViewOptionText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Event Form Modal */}
        <Modal
          visible={showEventForm}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowEventForm(false)}
        >
          <EventForm
            onSave={handleEventAdded}
            onCancel={() => setShowEventForm(false)}
            selectedDate={selectedDate}
          />
        </Modal>

        {/* Event Details Modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={closeModal}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={[styles.modalContent, { backgroundColor: selectedEvent?.color || "#4285F4" }]}>
                  <Text style={styles.modalTitle}>{selectedEvent?.title}</Text>
                  {selectedEvent?.subtitle && (
                    <Text style={styles.modalSubtitle}>{selectedEvent.subtitle}</Text>
                  )}
                  {selectedEvent?.description && (
                    <Text style={styles.description}>Description: {selectedEvent.description}</Text>
                  )}
                  {selectedEvent?.location && (
                    <View style={styles.modalDetailRow}>
                      <Ionicons name="location" size={18} color="white" />
                      <Text style={styles.modalDetailText}>{selectedEvent.location}</Text>
                    </View>
                  )}
                  {selectedEvent?.start?.dateTime && selectedEvent?.end?.dateTime && (
                    <View style={styles.modalDetailRow}>
                      <Ionicons name="time" size={18} color="white" />
                      <Text style={styles.modalDetailText}>
                        {formatTime(selectedEvent.start.dateTime)} - {formatTime(selectedEvent.end.dateTime)}
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => deleteEvent(selectedEvent?.id || "")}>
                    <Ionicons name="trash" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DC2626",
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#DC2626',
    paddingTop: 5,
    paddingBottom: 3,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 5,
  },
  todayText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 5,
  },
  calendarWrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerWrapper: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    alignSelf: 'center',
    width: Dimensions.get('window').width - 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  moveToDateButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moveToDateText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  viewSelectorPopup: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 90,
    position: 'absolute',
    top: 120,
    right: 20,
  },
  viewOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  selectedViewOption: {
    backgroundColor: '#DC2626',
  },
  viewOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
  },
  selectedViewOptionText: {
    color: 'white',
    fontWeight: '600',
  },
  modalContent: {
    width: "80%",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 7,
  },
  modalSubtitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 15,
  },
  description: {
    color: "white",
    fontSize: 12,
    marginBottom: 20,
  },
  modalDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  modalDetailText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
  deleteButton: {
    position: "absolute",
    top: 15,
    right: 15,
    padding: 5,
  },
});