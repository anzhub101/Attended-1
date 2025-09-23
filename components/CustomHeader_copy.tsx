import React, { useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, sub } from 'date-fns';
import * as Haptics from 'expo-haptics';
import EventForm, { EventData } from './EventForm';

export enum CalendarViewType {
  OneDay = "1 day",
  ThreeDays = "3 days",
  FiveDays = "5 days"
}

// Export the initial events, but don't use this for state management
export const initialEvents = [
  {
    id: "1",
    title: "CSC303",
    subtitle: "Dr. Anzeem",
    location: "HF09",
    description : "University lecture details",
    start: { dateTime: "2025-04-06T10:00:00" },
    end: { dateTime: "2025-04-06T11:00:00" },
    color: "#4285F4",
  },
  {
    id: "2",
    title: " CEN425",
    subtitle: "Dr. Aazmeen",
    location: "AG09",
    description : "University lecture details",
    start: { dateTime: "2025-04-07T12:00:00" },
    end: { dateTime: "2025-04-07T13:00:00" },
    color: "#512B58",
  },
  {
    id: "3",
    title: "CEN201",
    subtitle: "Dr. Sajitha",
    location: "AF11",
    description : "University lecture details",
    start: { dateTime: "2025-04-08T15:00:00" },
    end: { dateTime: "2025-04-08T16:00:00" },
    color: "#251",
  },
  {
    id: "4",
    title: "FWS310",
    subtitle: "Dr. Sara",
    location: "GF06",
    description : "University lecture details",
    start: { dateTime: "2025-04-09T09:00:00" },
    end: { dateTime: "2025-04-09T10:00:00" },
    color: "#f42525",
  },
  {
    id: "5", 
    title: "CSC202",
    subtitle: "Dr. Arief",
    location: "AH07",
    description : "University lecture details",
    start: { dateTime: "2025-04-10T08:00:00" },
    end: { dateTime: "2025-04-10T09:00:00" },
    color: "#c9b100", 
  },
];

interface CustomHeaderProps {
  onDateSelect?: (date: Date) => void;
  onAddEvent?: () => void;
  onViewChange: (view: CalendarViewType) => void;
  currentView?: CalendarViewType;
  selectedDate?: Date;
  onEventAdded: (newEvent: EventData) => void; // Add this prop
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  onDateSelect,
  onViewChange,
  currentView = CalendarViewType.OneDay,
  selectedDate: initialDate,
  onEventAdded, // Receive the event handler
}) => {
  const viewOptions = Object.values(CalendarViewType);

  const [viewSelectorVisible, setViewSelectorVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(initialDate || new Date());
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const onAddEvent = () => {
    setIsModalVisible(true);
  };

  const handleSubmit = (newEvent: EventData) => {
    // Pass the new event up to the parent
    onEventAdded(newEvent);
    console.log('New event submitted');
  };

  const toggleViewSelector = useCallback(() => {
    setViewSelectorVisible(prev => !prev);
  }, []);
  
  const selectView = useCallback((view: CalendarViewType) => {
    onViewChange(view);
    setViewSelectorVisible(false);
  }, [onViewChange]);

  const handleDateChange = useCallback((event: unknown, date?: Date) => {
    if (date) setTempDate(date);
  }, []);

  const handleDatePickerClose = useCallback(() => {
    setShowDatePicker(false);
    setSelectedDate(tempDate);
    onDateSelect?.(tempDate);
  }, [tempDate, onDateSelect]);

  const showToday = useCallback(() => {
    const today = new Date();
    setTempDate(today);
    setSelectedDate(today);
    onDateSelect?.(today);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [onDateSelect]);
  
  const formattedDate = format(selectedDate, 'MMM d, yyyy');
  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  // Function to handle the "Move to Date!" button press
  const handleMoveToDate = useCallback(() => {
    setSelectedDate(tempDate);
    onDateSelect?.(tempDate);
    setShowDatePicker(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [tempDate, onDateSelect]);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        <TouchableOpacity 
          style={styles.dateSelector} 
          onPress={() => setShowDatePicker(true)} 
          onLongPress={showToday} 
          delayLongPress={500}
        >
          <Ionicons name="calendar-outline" size={24} color="black" />
          <Text style={styles.dateText}>{isToday ? 'Today' : formattedDate}</Text>
        </TouchableOpacity>

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
                
                {/* New Move to Date button */}
                <TouchableOpacity 
                  style={styles.moveToDateButton}
                  onPress={handleMoveToDate}
                >
                  <Text style={styles.moveToDateText}>
                    Move to Date...</Text>
                  
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>

      <View>
        <TouchableOpacity style={styles.addButton} onPress={onAddEvent}>
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>
        <EventForm
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSubmit={handleSubmit}
        />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Schedule</Text>
      </View>

      <View style={styles.rightContainer}>
        <TouchableOpacity 
          style={styles.viewSelector} 
          onPress={toggleViewSelector}
        >
          <Ionicons name="menu-outline" size={24} color="black" />
        </TouchableOpacity>

        <Modal transparent visible={viewSelectorVisible} onRequestClose={() => setViewSelectorVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setViewSelectorVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={[styles.viewSelectorPopup, styles.viewSelectorPosition]}>
                {viewOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.viewOption, currentView === option && styles.selectedViewOption]}
                    onPress={() => selectView(option)}
                  >
                    <Text style={[styles.viewOptionText, currentView === option && styles.selectedViewOptionText]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  dateText: {
    marginLeft: 4,
    fontSize: 14,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  viewSelector: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'flex-end',
  },
  datePickerWrapper: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: Dimensions.get('window').height * 0.04,
    alignSelf: 'center',
    width: Dimensions.get('window').width - 40,
  },
  viewSelectorPopup: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 95,
  },
  viewSelectorPosition: {
    position: 'absolute',
    top: 115,
    right: 20,
  },
  viewOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  selectedViewOption: {
    backgroundColor: '#f0f0f0',
  },
  viewOptionText: {
    fontSize: 14,
  },
  selectedViewOptionText: {
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  eventItem: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  moveToDateButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moveToDateText: {
    fontSize: 20,
    color: '#f5f5f5',
    fontWeight: '500',
  },
});

export default CustomHeader;