import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Switch } from 'react-native';
import { sub } from 'date-fns';

export type EventData = {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  start: { dateTime: string };
  end: { dateTime: string };
  color: string;
};

type EventFormProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: EventData) => void;
};

// Muted colors array - defined outside component to avoid recreation on each render
const MUTED_COLORS = [
  "#4285F4", "#3498db", "#34495e", "#2c3e50", "#16a085",
  "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#7f8c8d",
  "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#6c5ce7",
  "#a29bfe", "#636e72"
];

const EventForm: React.FC<EventFormProps> = ({ visible, onClose, onSubmit }) => {
  const [title, setTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(new Date().getTime() + 60 * 60 * 1000));
  const [isAllDay, setIsAllDay] = useState<boolean>(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState<boolean>(false);
  const inputRef = useRef<TextInput>(null);

  // Get random color
  const getRandomMutedColor = useCallback((): string => {
    return MUTED_COLORS[Math.floor(Math.random() * MUTED_COLORS.length)];
  }, []);

  const handleSubmit = useCallback((): void => {
    if (typeof onSubmit !== 'function') return;
    
    const formattedData: EventData = {
      id: Math.random().toString(36).substring(7),
      title: title.trim() || 'Unavailable title', 
      subtitle: subtitle.trim() || 'Untitled Professor',
      location: location.trim() || 'Unavailable location',
      start: { dateTime: startDate.toISOString().slice(0, 19)},
      end: { dateTime: endDate.toISOString().slice(0, 19) },
      color: getRandomMutedColor(),
    };
    
    onSubmit(formattedData);
    
    // Reset form
    setTitle('');
    setSubtitle('');
    setLocation('');
    setStartDate(new Date());
    setEndDate(new Date(new Date().getTime() + 60 * 60 * 1000));
    onClose();
  }, [title, subtitle, location, startDate, endDate, onSubmit, onClose, getRandomMutedColor]);

  const formatDate = useCallback((date: Date): string => {
    return date.toLocaleDateString();
  }, []);

  const formatTime = useCallback((date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  const handleDateTimeChange = useCallback((
    setter: React.Dispatch<React.SetStateAction<Date>>,
    visibilitySetter: React.Dispatch<React.SetStateAction<boolean>>
  ) => (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setter(selectedDate);
      
    }
    if (Platform.OS !== 'ios') {
      visibilitySetter(false);
    }
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();}}>        
          <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleSubmit} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
              <View style={styles.inputContainer}>
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  placeholder="Title"
                  value={title}
                  placeholderTextColor="rgba(0,0,0,0.25)"
                  onChangeText={setTitle}
                  returnKeyType="done"
                />
                          <View style={styles.divider} />

                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  placeholder="Subtitle"
                  value={subtitle}
                  placeholderTextColor="rgba(0,0,0,0.25)"
                  onChangeText={setSubtitle}
                  returnKeyType="done"
                />
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
              <View style={styles.inputContainer}>
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  placeholder="Location"
                  value={location}
                  placeholderTextColor="rgba(0,0,0,0.25)"
                  onChangeText={setLocation}
                  returnKeyType="done"
                />
              </View>
            </TouchableWithoutFeedback>
            
            <View style={styles.timeBlockContainer}>
              <View style={styles.dateTimeSection}>
                <Text style={styles.label}>Starts:</Text>
                <View style={styles.dateTimeButtons}>
                  
                    <DateTimePicker
                      value={startDate}
                      mode="date"
                      display="default"
                      onChange={handleDateTimeChange(setStartDate, setShowStartDatePicker)}
                      textColor="black"
                      themeVariant="light"
                    />
                  
                    <DateTimePicker
                      value={startDate}
                      mode="time"
                      display="default"
                      onChange={handleDateTimeChange(setStartDate, setShowStartTimePicker)}
                      textColor="black"
                      themeVariant="light"
                      disabled={isAllDay}
                    />
                  
                </View>
              </View>
              
              <View style={styles.divider} />
              <View style={styles.dateTimeSection}>
                <Text style={styles.label}>Ends:</Text>
                <View style={styles.dateTimeButtons}>
                  
                    <DateTimePicker
                      value={endDate}
                      mode="date"
                      display="default"
                      onChange={handleDateTimeChange(setEndDate, setShowEndDatePicker)}
                      textColor="black"
                      themeVariant="light"
                      disabled={isAllDay}
                    />
                  
                    <DateTimePicker
                      value={endDate}
                      mode="time"
                      display="default"
                      onChange={handleDateTimeChange(setEndDate, setShowEndTimePicker)}
                      textColor="black"
                      themeVariant="light"
                      disabled={isAllDay}
                    />
                </View>
              </View>
            </View>
            
            <View style={styles.allDaySection}>
                <Text style={styles.label} numberOfLines={1}>All Day:</Text>
                <Switch
                  value={isAllDay}
                  onValueChange={(value) => {
                    setIsAllDay(value);
                    if (value) {
                      const start = startDate;
                      const end = startDate;
                      end.setDate(end.getDate() + 1);
                      setStartDate(start);
                      setEndDate(end);
                    }
                  }}
                />
              </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalContent: {
    height: '86%',
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
  closeButton: {
    width: 30,
    height: 35,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#0066cc',
    fontWeight: 'bold',
    fontSize: 20,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    padding: 15,
    fontSize: 16,
  },
  timeBlockContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateTimeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  allDaySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    width: '100%',
  },
  label: {
    marginRight: 15,
    width: 55,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  dateTimeButtons: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  dateTimeText: {
    fontSize: 16,
    padding: 5,
    flex: 1,
    textAlign: 'center',
  }
});

export default React.memo(EventForm);