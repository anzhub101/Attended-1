import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EventForm, { EventData } from './EventForm';

export enum CalendarViewType {
  OneDay = 'OneDay',
  ThreeDays = 'ThreeDays',
  FiveDays = 'FiveDays',
}

export const initialEvents: EventData[] = [
  {
    id: '1',
    title: 'CEN75',
    subtitle: 'Dr. Yameen',
    description: 'Computer Networks Lecture',
    location: 'A007',
    start: { dateTime: '2025-01-20T09:00:00.000Z' },
    end: { dateTime: '2025-01-20T10:30:00.000Z' },
    color: '#4285F4',
  },
  {
    id: '2',
    title: 'CEN75',
    subtitle: 'Dr. Corie',
    description: 'Computer Networks Lab',
    location: 'A005',
    start: { dateTime: '2025-01-20T11:00:00.000Z' },
    end: { dateTime: '2025-01-20T12:30:00.000Z' },
    color: '#DB4437',
  },
  {
    id: '3',
    title: 'CEN75',
    subtitle: 'Dr. Kelvin',
    description: 'Advanced Networks',
    location: 'A006',
    start: { dateTime: '2025-01-22T11:00:00.000Z' },
    end: { dateTime: '2025-01-22T12:30:00.000Z' },
    color: '#0F9D58',
  },
];

interface CustomHeaderProps {
  onViewChange: (view: CalendarViewType) => void;
  currentView: CalendarViewType;
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
  onEventAdded: (event: EventData) => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  onViewChange,
  currentView,
  onDateSelect,
  selectedDate,
  onEventAdded,
}) => {
  const [showEventForm, setShowEventForm] = useState(false);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const handleAddEvent = (eventData: EventData) => {
    onEventAdded(eventData);
    setShowEventForm(false);
    Alert.alert('Success', 'Event added successfully!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <TouchableOpacity style={styles.todayButton}>
            <Ionicons name="calendar-outline" size={16} color="white" />
            <Text style={styles.todayText}>Today</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowEventForm(true)}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.centerSection}>
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        </View>

        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.viewSelector}>
        <TouchableOpacity
          style={[
            styles.viewButton,
            currentView === CalendarViewType.OneDay && styles.activeViewButton,
          ]}
          onPress={() => onViewChange(CalendarViewType.OneDay)}
        >
          <Text
            style={[
              styles.viewButtonText,
              currentView === CalendarViewType.OneDay && styles.activeViewButtonText,
            ]}
          >
            1D
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.viewButton,
            currentView === CalendarViewType.ThreeDays && styles.activeViewButton,
          ]}
          onPress={() => onViewChange(CalendarViewType.ThreeDays)}
        >
          <Text
            style={[
              styles.viewButtonText,
              currentView === CalendarViewType.ThreeDays && styles.activeViewButtonText,
            ]}
          >
            3D
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.viewButton,
            currentView === CalendarViewType.FiveDays && styles.activeViewButton,
          ]}
          onPress={() => onViewChange(CalendarViewType.FiveDays)}
        >
          <Text
            style={[
              styles.viewButtonText,
              currentView === CalendarViewType.FiveDays && styles.activeViewButtonText,
            ]}
          >
            5D
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showEventForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEventForm(false)}
      >
        <EventForm
          onSave={handleAddEvent}
          onCancel={() => setShowEventForm(false)}
          selectedDate={selectedDate}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DC2626',
    paddingTop: 50,
    paddingBottom: 10,
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
  viewSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 4,
    alignSelf: 'center',
  },
  viewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 40,
    alignItems: 'center',
  },
  activeViewButton: {
    backgroundColor: 'white',
  },
  viewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  activeViewButtonText: {
    color: '#DC2626',
  },
});

export default CustomHeader;