import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

export interface EventData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  location?: string;
  start: { dateTime: string };
  end: { dateTime: string };
  color: string;
}

interface EventFormProps {
  onSave: (event: EventData) => void;
  onCancel: () => void;
  selectedDate: Date;
}

const EventForm: React.FC<EventFormProps> = ({ onSave, onCancel, selectedDate }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  
  // Date and time states
  const [startDate, setStartDate] = useState(new Date(selectedDate));
  const [endDate, setEndDate] = useState(new Date(selectedDate));
  const [startTime, setStartTime] = useState(() => {
    const time = new Date();
    time.setHours(9, 0, 0, 0);
    return time;
  });
  const [endTime, setEndTime] = useState(() => {
    const time = new Date();
    time.setHours(10, 0, 0, 0);
    return time;
  });
  
  // Modal visibility states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  
  const [selectedColor, setSelectedColor] = useState('#4285F4');

  const colors = [
    '#4285F4', // Blue
    '#DB4437', // Red
    '#0F9D58', // Green
    '#F4B400', // Yellow
    '#9C27B0', // Purple
    '#FF5722', // Deep Orange
    '#607D8B', // Blue Grey
    '#795548', // Brown
  ];

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleDateChange = (
    event: any,
    selectedDate: Date | undefined,
    setter: React.Dispatch<React.SetStateAction<Date>>,
    modalSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (selectedDate) {
      setter(selectedDate);
    }
    if (Platform.OS === 'android') {
      modalSetter(false);
    }
  };

  const handleTimeChange = (
    event: any,
    selectedTime: Date | undefined,
    setter: React.Dispatch<React.SetStateAction<Date>>,
    modalSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (selectedTime) {
      setter(selectedTime);
    }
    if (Platform.OS === 'android') {
      modalSetter(false);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an event title');
      return;
    }

    // Combine date and time for start
    const startDateTime = new Date(startDate);
    startDateTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

    // Combine date and time for end
    const endDateTime = new Date(endDate);
    endDateTime.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

    if (endDateTime <= startDateTime) {
      Alert.alert('Error', 'End date and time must be after start date and time');
      return;
    }

    const newEvent: EventData = {
      id: Date.now().toString(),
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      description: description.trim() || undefined,
      location: location.trim() || undefined,
      start: { dateTime: startDateTime.toISOString() },
      end: { dateTime: endDateTime.toISOString() },
      color: selectedColor,
    };

    onSave(newEvent);
  };

  const DateTimePickerModal = ({
    visible,
    onClose,
    value,
    mode,
    onChange,
    title,
  }: {
    visible: boolean;
    onClose: () => void;
    value: Date;
    mode: 'date' | 'time';
    onChange: (event: any, date: Date | undefined) => void;
    title: string;
  }) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.pickerModal}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>{title}</Text>
                <TouchableOpacity onPress={onClose} style={styles.pickerCloseButton}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={value}
                mode={mode}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChange}
                textColor="#1F2937"
                themeVariant="light"
              />
              {Platform.OS === 'ios' && (
                <TouchableOpacity style={styles.pickerDoneButton} onPress={onClose}>
                  <Text style={styles.pickerDoneText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Event</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Event title"
            placeholderTextColor="rgba(156, 163, 175, 0.6)"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Subtitle</Text>
          <TextInput
            style={styles.input}
            value={subtitle}
            onChangeText={setSubtitle}
            placeholder="Event subtitle (optional)"
            placeholderTextColor="rgba(156, 163, 175, 0.6)"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Event description (optional)"
            placeholderTextColor="rgba(156, 163, 175, 0.6)"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Event location (optional)"
            placeholderTextColor="rgba(156, 163, 175, 0.6)"
          />
        </View>

        {/* Start Date and Time */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Start Date & Time</Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={[styles.dateTimeButton, { flex: 1.2 }]}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              <Text style={styles.dateTimeText}>{formatDate(startDate)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dateTimeButton, { flex: 1 }]}
              onPress={() => setShowStartTimePicker(true)}
            >
              <Ionicons name="time-outline" size={20} color="#6B7280" />
              <Text style={styles.dateTimeText}>{formatTime(startTime)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* End Date and Time */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>End Date & Time</Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={[styles.dateTimeButton, { flex: 1.2 }]}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              <Text style={styles.dateTimeText}>{formatDate(endDate)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dateTimeButton, { flex: 1 }]}
              onPress={() => setShowEndTimePicker(true)}
            >
              <Ionicons name="time-outline" size={20} color="#6B7280" />
              <Text style={styles.dateTimeText}>{formatTime(endTime)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Color</Text>
          <View style={styles.colorContainer}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor,
                ]}
                onPress={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <Ionicons name="checkmark" size={20} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Date and Time Picker Modals */}
      <DateTimePickerModal
        visible={showStartDatePicker}
        onClose={() => setShowStartDatePicker(false)}
        value={startDate}
        mode="date"
        onChange={(event, date) =>
          handleDateChange(event, date, setStartDate, setShowStartDatePicker)
        }
        title="Select Start Date"
      />

      <DateTimePickerModal
        visible={showStartTimePicker}
        onClose={() => setShowStartTimePicker(false)}
        value={startTime}
        mode="time"
        onChange={(event, time) =>
          handleTimeChange(event, time, setStartTime, setShowStartTimePicker)
        }
        title="Select Start Time"
      />

      <DateTimePickerModal
        visible={showEndDatePicker}
        onClose={() => setShowEndDatePicker(false)}
        value={endDate}
        mode="date"
        onChange={(event, date) =>
          handleDateChange(event, date, setEndDate, setShowEndDatePicker)
        }
        title="Select End Date"
      />

      <DateTimePickerModal
        visible={showEndTimePicker}
        onClose={() => setShowEndTimePicker(false)}
        value={endTime}
        mode="time"
        onChange={(event, time) =>
          handleTimeChange(event, time, setEndTime, setShowEndTimePicker)
        }
        title="Select End Time"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cancelButton: {
    padding: 5,
  },
  cancelText: {
    fontSize: 16,
    color: '#6B7280',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  saveButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#1F2937',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    minWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  pickerCloseButton: {
    padding: 4,
  },
  pickerDoneButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  pickerDoneText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EventForm;