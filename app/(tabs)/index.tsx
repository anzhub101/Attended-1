import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEvents, useNews, useAssignments, useQuickActions } from '../../hooks/usedSupabaseData';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { data: quickActions, loading: quickActionsLoading } = useQuickActions();
  const { data: assignments, loading: assignmentsLoading } = useAssignments();
  const { data: events, loading: eventsLoading } = useEvents();
  const { data: news, loading: newsLoading } = useNews();

  // Filter today's events
  const today = new Date();
  const todaySchedule = events.filter(event => {
    const eventDate = new Date(event.start_time);
    return eventDate.toDateString() === today.toDateString();
  });

  // Get upcoming assignments (next 3)
  const upcomingAssignments = assignments.slice(0, 3);

  // Get latest news item
  const latestNews = news[0];

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDueDate = (dateString: string) => {
    const dueDate = new Date(dateString);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return 'Due Tomorrow';
    if (diffDays > 1) return `Due in ${diffDays} days`;
    return 'Overdue';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/images/ADU-logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Dashboard</Text>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications" size={24} color="white" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Image 
                source={require('../../assets/images/IMG_1540.jpg')}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>

          {/* Content Area */}
          <View style={styles.contentArea}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <Image 
                    source={require('../../assets/images/IMG_1540.jpg')}
                    style={styles.userAvatarImage}
                  />
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>Welcome, {user?.name || 'Student'}</Text>
                  <View style={styles.userInfoRow}>
                    <Text style={styles.userInfoLabel}>Student ID</Text>
                    <Text style={styles.userInfoValue}>{user?.studentId || 'N/A'}</Text>
                  </View>
                  <View style={styles.userInfoRow}>
                    <Text style={styles.userInfoLabel}>Phone</Text>
                    <Text style={styles.userInfoValue}>+971 585513665</Text>
                  </View>
                  <View style={styles.userInfoRow}>
                    <Text style={styles.userInfoLabel}>Department</Text>
                    <Text style={styles.userInfoValue}>Engineering</Text>
                  </View>
                  <View style={styles.userInfoRow}>
                    <Text style={styles.userInfoLabel}>Student Email</Text>
                    <Text style={styles.userInfoValue}>{user?.email || 'N/A'}</Text>
                  </View>
                  <View style={styles.userInfoRow}>
                    <Text style={styles.userInfoLabel}>Faculty</Text>
                    <Text style={styles.userInfoValue}>Computer Engineering</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              {quickActionsLoading ? (
                <Text style={styles.loadingText}>Loading...</Text>
              ) : (
                <View style={styles.quickActionsGrid}>
                  {quickActions.map((action) => (
                    <TouchableOpacity 
                      key={action.id} 
                      style={styles.quickActionCard}
                      onPress={() => handleQuickActionPress(action.route)}
                    >
                      <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                        <Ionicons name={action.icon as any} size={24} color="white" />
                      </View>
                      <Text style={styles.quickActionText}>{action.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Today's Schedule */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Today's Schedule</Text>
              {eventsLoading ? (
                <Text style={styles.loadingText}>Loading...</Text>
              ) : todaySchedule.length === 0 ? (
                <Text style={styles.emptyText}>No classes scheduled for today</Text>
              ) : (
                <View style={styles.scheduleContainer}>
                  {todaySchedule.map((item) => (
                    <View key={item.id} style={styles.scheduleCard}>
                      <View style={styles.scheduleHeader}>
                        <Text style={styles.scheduleCourse}>{item.title}</Text>
                        <View style={styles.scheduleIcon}>
                          <Ionicons name="book" size={16} color="white" />
                        </View>
                      </View>
                      <Text style={styles.scheduleTitle}>{item.description || 'Class Session'}</Text>
                      <Text style={styles.scheduleTime}>
                        Time: {formatTime(item.start_time)} - {formatTime(item.end_time)}
                      </Text>
                      <Text style={styles.scheduleVenue}>Venue: {item.location || 'TBA'}</Text>
                      <Text style={styles.scheduleLecturer}>Lecturer: {item.subtitle || 'TBA'}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Assignments Due */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Assignments Due</Text>
              {assignmentsLoading ? (
                <Text style={styles.loadingText}>Loading...</Text>
              ) : upcomingAssignments.length === 0 ? (
                <Text style={styles.emptyText}>No upcoming assignments</Text>
              ) : (
                <View style={styles.assignmentsContainer}>
                  {upcomingAssignments.map((assignment) => (
                    <View key={assignment.id} style={styles.assignmentCard}>
                      <View style={styles.assignmentHeader}>
                        <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(assignment.priority) }]} />
                        <View style={styles.assignmentInfo}>
                          <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                          <Text style={styles.assignmentCourse}>{assignment.course}</Text>
                        </View>
                        <Text style={styles.assignmentDue}>{formatDueDate(assignment.due_date)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Upcoming Events */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Upcoming Events</Text>
              {newsLoading ? (
                <Text style={styles.loadingText}>Loading...</Text>
              ) : !latestNews ? (
                <Text style={styles.emptyText}>No upcoming events</Text>
              ) : (
                <TouchableOpacity style={styles.eventCard}>
                  <Image 
                    source={{ uri: latestNews.image_url || 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2' }}
                    style={styles.eventImage}
                  />
                  <View style={styles.eventContent}>
                    <Text style={styles.eventTitle}>{latestNews.title}</Text>
                    <Text style={styles.eventDescription}>{latestNews.description}</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
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
  logoContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 24,
    width: 24,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  welcomeSection: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: 15,
  },
  userAvatarImage: {
    width: '100%',
    height: '100%',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userInfoLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  userInfoValue: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  quickActionText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 12,
  },
  scheduleContainer: {
    gap: 15,
  },
  scheduleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleCourse: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scheduleIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#DC2626',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleTitle: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 4,
  },
  scheduleTime: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  scheduleVenue: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  scheduleLecturer: {
    fontSize: 12,
    color: '#6B7280',
  },
  assignmentsContainer: {
    gap: 12,
  },
  assignmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  assignmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  assignmentCourse: {
    fontSize: 12,
    color: '#6B7280',
  },
  assignmentDue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 150,
  },
  eventContent: {
    padding: 15,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
});