import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

interface QRTicketProps {
  visible: boolean;
  onClose: () => void;
  event?: {
    id: string;
    title: string;
    location: string;
    event_date: string;
    event_time: string;
  };
}

export default function QRTicket({ visible, onClose, event }: QRTicketProps) {
  const { user } = useAuth();
  
  if (!event) return null;

  const ticketData = {
    eventId: event.id,
    eventTitle: event.title,
    location: event.location,
    date: event.event_date,
    time: event.event_time,
    userId: user?.studentId || 'Unknown',
    ticketId: `TICKET-${event.id}-${Date.now()}`,
  };

  const qrValue = JSON.stringify(ticketData);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Ticket</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Ticket Card */}
          <View style={styles.ticketCard}>
            {/* Ticket Header */}
            <View style={styles.ticketHeader}>
              <View style={styles.ticketHeaderContent}>
                <Ionicons name="ticket" size={24} color="#DC2626" />
                <Text style={styles.ticketHeaderText}>Digital Ticket</Text>
              </View>
              <View style={styles.validBadge}>
                <Text style={styles.validText}>VALID</Text>
              </View>
            </View>

            {/* Event Details */}
            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={18} color="#6B7280" />
                <Text style={styles.detailText}>{formatDate(event.event_date)}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={18} color="#6B7280" />
                <Text style={styles.detailText}>{event.event_time}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={18} color="#6B7280" />
                <Text style={styles.detailText}>{event.location}</Text>
              </View>
            </View>

            {/* QR Code Section */}
            <View style={styles.qrSection}>
              <Text style={styles.qrTitle}>Scan for Entry</Text>
              <View style={styles.qrContainer}>
                <View style={styles.qrPlaceholder}>
                  <Text style={styles.qrPlaceholderText}>QR Code</Text>
                  <Text style={styles.qrPlaceholderSubtext}>
                    {user?.studentId || 'N/A'}
                  </Text>
                </View>
              </View>
              <Text style={styles.qrSubtext}>Present this QR code at the event entrance</Text>
            </View>

            {/* Ticket Info */}
            <View style={styles.ticketInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Student ID:</Text>
                <Text style={styles.infoValue}>{user?.studentId || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Ticket ID:</Text>
                <Text style={styles.infoValue}>{ticketData.ticketId.substring(0, 20)}...</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Student Name:</Text>
                <Text style={styles.infoValue}>{user?.name || 'N/A'}</Text>
              </View>
            </View>

            {/* Terms */}
            <View style={styles.termsSection}>
              <Text style={styles.termsTitle}>Important Notes:</Text>
              <Text style={styles.termsText}>• This ticket is non-transferable</Text>
              <Text style={styles.termsText}>• Arrive 15 minutes before event time</Text>
              <Text style={styles.termsText}>• Bring your student ID for verification</Text>
              <Text style={styles.termsText}>• Screenshot this ticket for offline access</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

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
  closeButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  ticketHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ticketHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  validBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  validText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  eventDetails: {
    marginBottom: 24,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  qrPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 8,
  },
  qrPlaceholderSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  qrSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 12,
    textAlign: 'center',
  },
  ticketInfo: {
    marginBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  termsSection: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  termsText: {
    fontSize: 12,
    color: '#92400E',
    marginBottom: 4,
  },
});