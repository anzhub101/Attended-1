import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface CoursePerformance {
  id: string;
  code: string;
  name: string;
  instructor: string;
  currentGrade: string;
  gradePercentage: number;
  participation: number;
  attendance: number;
  creditHours: number;
  difficultyRating: number;
  difficultyReason: string;
  assignments: {
    completed: number;
    total: number;
  };
  quizzes: {
    completed: number;
    total: number;
  };
  midtermGrade: number;
  finalExam: {
    scheduled: boolean;
    date?: string;
  };
  color: string;
}

const mockPerformanceData: CoursePerformance[] = [
  {
    id: '1',
    code: 'CSC303',
    name: 'Database Systems',
    instructor: 'Dr. Ahmed Hassan',
    currentGrade: 'A-',
    gradePercentage: 88,
    participation: 92,
    attendance: 95,
    creditHours: 3,
    difficultyRating: 4,
    difficultyReason: 'Based on your strong performance in CSC202 (Data Structures)',
    assignments: { completed: 8, total: 10 },
    quizzes: { completed: 5, total: 6 },
    midtermGrade: 85,
    finalExam: { scheduled: true, date: '2025-02-15' },
    color: '#4285F4',
  },
  {
    id: '2',
    code: 'MTT205',
    name: 'Linear Algebra',
    instructor: 'Prof. Sarah Jamal',
    currentGrade: 'B+',
    gradePercentage: 82,
    participation: 78,
    attendance: 88,
    creditHours: 3,
    difficultyRating: 5,
    difficultyReason: 'Higher difficulty due to struggles in MTT101 (Calculus I)',
    assignments: { completed: 6, total: 8 },
    quizzes: { completed: 4, total: 5 },
    midtermGrade: 79,
    finalExam: { scheduled: true, date: '2025-02-18' },
    color: '#DB4437',
  },
  {
    id: '3',
    code: 'PHY201',
    name: 'Physics II',
    instructor: 'Dr. Huma Zia',
    currentGrade: 'A',
    gradePercentage: 91,
    participation: 89,
    attendance: 92,
    creditHours: 4,
    difficultyRating: 3,
    difficultyReason: 'Moderate difficulty based on excellent PHY101 performance',
    assignments: { completed: 7, total: 8 },
    quizzes: { completed: 6, total: 6 },
    midtermGrade: 88,
    finalExam: { scheduled: true, date: '2025-02-20' },
    color: '#0F9D58',
  },
  {
    id: '4',
    code: 'CEN320',
    name: 'Signals and Systems',
    instructor: 'Dr. Mary Jose',
    currentGrade: 'B',
    gradePercentage: 76,
    participation: 85,
    attendance: 90,
    creditHours: 3,
    difficultyRating: 5,
    difficultyReason: 'High difficulty - new subject area with complex concepts',
    assignments: { completed: 5, total: 7 },
    quizzes: { completed: 3, total: 4 },
    midtermGrade: 72,
    finalExam: { scheduled: true, date: '2025-02-22' },
    color: '#F4B400',
  },
  {
    id: '5',
    code: 'FWS310',
    name: 'Innovation Entrepreneurship',
    instructor: 'Dr. Rubina Qureshi',
    currentGrade: 'A',
    gradePercentage: 94,
    participation: 96,
    attendance: 98,
    creditHours: 2,
    difficultyRating: 2,
    difficultyReason: 'Low difficulty - aligns well with your interests and skills',
    assignments: { completed: 4, total: 4 },
    quizzes: { completed: 3, total: 3 },
    midtermGrade: 92,
    finalExam: { scheduled: false },
    color: '#9C27B0',
  },
];

export default function PerformanceDashboard() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const totalCreditHours = mockPerformanceData.reduce((sum, course) => sum + course.creditHours, 0);
  const completedCreditHours = 45; // Mock completed credit hours from previous semesters
  const totalCompletedCredits = completedCreditHours + totalCreditHours;

  const overallGPA = mockPerformanceData.reduce((sum, course) => {
    const gradePoints = getGradePoints(course.currentGrade);
    return sum + (gradePoints * course.creditHours);
  }, 0) / totalCreditHours;

  function getGradePoints(grade: string): number {
    const gradeMap: { [key: string]: number } = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'F': 0.0
    };
    return gradeMap[grade] || 0;
  }

  const getGradeColor = (percentage: number): string => {
    if (percentage >= 90) return '#10B981';
    if (percentage >= 80) return '#F59E0B';
    if (percentage >= 70) return '#EF4444';
    return '#6B7280';
  };

  const getDifficultyStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={14}
          color={i <= rating ? "#F59E0B" : "#D1D5DB"}
        />
      );
    }
    return stars;
  };

  const ProgressBar = ({ value, max, color, label }: { value: number; max: number; color: string; label: string }) => (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={styles.progressValue}>{value}%</Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${(value / max) * 100}%`, backgroundColor: color }
          ]} 
        />
      </View>
    </View>
  );

  const CircularProgress = ({ percentage, color, size = 60 }: { percentage: number; color: string; size?: number }) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={[styles.circularProgress, { width: size, height: size }]}>
        <Text style={styles.circularProgressText}>{percentage}%</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Performance Dashboard</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {/* Overview Cards */}
            <View style={styles.overviewSection}>
              <View style={styles.overviewGrid}>
                <View style={styles.overviewCard}>
                  <Text style={styles.overviewValue}>{overallGPA.toFixed(2)}</Text>
                  <Text style={styles.overviewLabel}>Current GPA</Text>
                  <Ionicons name="trending-up" size={20} color="#10B981" />
                </View>
                
                <View style={styles.overviewCard}>
                  <Text style={styles.overviewValue}>{totalCompletedCredits}</Text>
                  <Text style={styles.overviewLabel}>Total Credits</Text>
                  <Ionicons name="school" size={20} color="#3B82F6" />
                </View>
                
                <View style={styles.overviewCard}>
                  <Text style={styles.overviewValue}>{mockPerformanceData.length}</Text>
                  <Text style={styles.overviewLabel}>Active Courses</Text>
                  <Ionicons name="book" size={20} color="#8B5CF6" />
                </View>
              </View>
            </View>

            {/* Course Performance Cards */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Course Performance</Text>
              
              {mockPerformanceData.map((course) => (
                <View key={course.id} style={styles.courseCard}>
                  {/* Course Header */}
                  <View style={styles.courseHeader}>
                    <View style={styles.courseInfo}>
                      <Text style={styles.courseCode}>{course.code}</Text>
                      <Text style={styles.courseName}>{course.name}</Text>
                      <Text style={styles.courseInstructor}>{course.instructor}</Text>
                    </View>
                    <View style={styles.gradeContainer}>
                      <Text style={[styles.currentGrade, { color: getGradeColor(course.gradePercentage) }]}>
                        {course.currentGrade}
                      </Text>
                      <Text style={styles.gradePercentage}>{course.gradePercentage}%</Text>
                    </View>
                  </View>

                  {/* Performance Metrics */}
                  <View style={styles.metricsContainer}>
                    <ProgressBar 
                      value={course.attendance} 
                      max={100} 
                      color="#10B981" 
                      label="Attendance" 
                    />
                    <ProgressBar 
                      value={course.participation} 
                      max={100} 
                      color="#3B82F6" 
                      label="Participation" 
                    />
                  </View>

                  {/* Assignment Progress */}
                  <View style={styles.assignmentProgress}>
                    <View style={styles.assignmentItem}>
                      <Ionicons name="document-text" size={16} color="#6B7280" />
                      <Text style={styles.assignmentText}>
                        Assignments: {course.assignments.completed}/{course.assignments.total}
                      </Text>
                    </View>
                    <View style={styles.assignmentItem}>
                      <Ionicons name="help-circle" size={16} color="#6B7280" />
                      <Text style={styles.assignmentText}>
                        Quizzes: {course.quizzes.completed}/{course.quizzes.total}
                      </Text>
                    </View>
                    <View style={styles.assignmentItem}>
                      <Ionicons name="trophy" size={16} color="#6B7280" />
                      <Text style={styles.assignmentText}>
                        Midterm: {course.midtermGrade}%
                      </Text>
                    </View>
                  </View>

                  {/* Difficulty Rating */}
                  <View style={styles.difficultySection}>
                    <View style={styles.difficultyHeader}>
                      <Text style={styles.difficultyLabel}>Difficulty Rating</Text>
                      <View style={styles.difficultyStars}>
                        {getDifficultyStars(course.difficultyRating)}
                      </View>
                    </View>
                    <Text style={styles.difficultyReason}>{course.difficultyReason}</Text>
                  </View>

                  {/* Credit Hours */}
                  <View style={styles.creditHours}>
                    <Ionicons name="time" size={16} color="#6B7280" />
                    <Text style={styles.creditHoursText}>{course.creditHours} Credit Hours</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Academic Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Academic Summary</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Completed Credit Hours:</Text>
                  <Text style={styles.summaryValue}>{completedCreditHours}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Current Semester Credits:</Text>
                  <Text style={styles.summaryValue}>{totalCreditHours}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Credits Earned:</Text>
                  <Text style={styles.summaryValue}>{totalCompletedCredits}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Current Semester GPA:</Text>
                  <Text style={[styles.summaryValue, { color: '#10B981', fontWeight: 'bold' }]}>
                    {overallGPA.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
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
  settingsButton: {
    padding: 8,
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  overviewSection: {
    marginBottom: 25,
  },
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  courseCard: {
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
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  courseInfo: {
    flex: 1,
  },
  courseCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  courseName: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 2,
  },
  courseInstructor: {
    fontSize: 12,
    color: '#6B7280',
  },
  gradeContainer: {
    alignItems: 'center',
  },
  currentGrade: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  gradePercentage: {
    fontSize: 12,
    color: '#6B7280',
  },
  metricsContainer: {
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  assignmentProgress: {
    marginBottom: 16,
  },
  assignmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  assignmentText: {
    fontSize: 14,
    color: '#4B5563',
  },
  difficultySection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  difficultyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  difficultyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  difficultyStars: {
    flexDirection: 'row',
    gap: 2,
  },
  difficultyReason: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  creditHours: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  creditHoursText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  circularProgress: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
  },
  circularProgressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#4B5563',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
});