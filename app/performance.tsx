import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
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
  motivationalMessage: string;
  performanceAnalysis: string;
  tipsAndTricks: string[];
  strengths: string[];
  areasForImprovement: string[];
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
    currentGrade: 'A',
    gradePercentage: 88,
    participation: 92,
    attendance: 95,
    creditHours: 3,
    difficultyRating: 4,
    difficultyReason: 'Challenging but manageable based on your excellent foundation in CSC202',
    motivationalMessage: "🌟 You're excelling in this course! Your strong foundation is really showing.",
    performanceAnalysis: "Your performance in Database Systems is outstanding! With an 88% average and excellent attendance, you're demonstrating strong understanding of complex database concepts. Your participation score of 92% shows great engagement with the material.",
    tipsAndTricks: [
      "Practice SQL queries daily to maintain your edge",
      "Create visual diagrams for complex database relationships",
      "Join study groups to reinforce your understanding",
      "Work on real-world database projects to apply concepts"
    ],
    strengths: [
      "Excellent attendance and participation",
      "Strong grasp of SQL fundamentals",
      "Good performance on assignments",
      "Active engagement in class discussions"
    ],
    areasForImprovement: [
      "Focus on advanced query optimization",
      "Practice more complex join operations",
      "Review indexing strategies for better performance"
    ],
    assignments: { completed: 8, total: 10 },
    quizzes: { completed: 5, total: 6 },
    midtermGrade: 85,
    finalExam: { scheduled: true, date: '2025-02-15' },
    color: '#0F9D58',
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
    difficultyReason: 'Building on previous math foundation - you\'re making great progress!',
    motivationalMessage: "💪 You're overcoming challenges and improving steadily! Keep pushing forward.",
    performanceAnalysis: "You're showing remarkable improvement in Linear Algebra! Despite initial challenges, your B+ grade demonstrates your dedication and growing understanding. Your 82% performance shows you're mastering complex mathematical concepts.",
    tipsAndTricks: [
      "Use visual representations for matrix operations",
      "Practice problems daily for 30 minutes",
      "Form study groups with classmates",
      "Visit office hours for personalized help",
      "Use online resources like Khan Academy for extra practice"
    ],
    strengths: [
      "Consistent improvement throughout the semester",
      "Good problem-solving approach",
      "Willingness to seek help when needed",
      "Strong work ethic and determination"
    ],
    areasForImprovement: [
      "Increase class participation for better understanding",
      "Attend more regularly to catch all concepts",
      "Practice more eigenvalue problems",
      "Review vector space concepts"
    ],
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
    difficultyReason: 'Perfect match for your physics aptitude - you\'re naturally gifted here!',
    motivationalMessage: "🚀 Outstanding work! You're a natural at physics - keep soaring!",
    performanceAnalysis: "Exceptional performance in Physics II! Your 91% average and A grade demonstrate mastery of complex physics concepts. Your strong foundation from PHY101 is clearly paying off, and you're excelling in electromagnetic theory and wave mechanics.",
    tipsAndTricks: [
      "Continue your excellent problem-solving approach",
      "Mentor other students to reinforce your understanding",
      "Explore advanced physics topics for enrichment",
      "Consider physics research opportunities"
    ],
    strengths: [
      "Excellent conceptual understanding",
      "Strong mathematical problem-solving skills",
      "Consistent high performance",
      "Good laboratory technique"
    ],
    areasForImprovement: [
      "Share knowledge with struggling classmates",
      "Explore more challenging physics problems",
      "Consider advanced physics electives"
    ],
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
    difficultyReason: 'Challenging new territory - you\'re building important engineering skills!',
    motivationalMessage: "🔧 You're tackling tough engineering concepts with determination! Every challenge makes you stronger.",
    performanceAnalysis: "You're doing well in a challenging course! Signals and Systems is known for its complexity, and your B grade shows you're successfully navigating new engineering territory. Your 85% participation demonstrates engagement with difficult material.",
    tipsAndTricks: [
      "Use MATLAB/Python for signal visualization",
      "Practice Fourier transform problems daily",
      "Draw time and frequency domain representations",
      "Work through examples step-by-step",
      "Connect concepts to real-world applications"
    ],
    strengths: [
      "Good attendance and participation",
      "Persistence with challenging material",
      "Growing understanding of complex concepts",
      "Strong mathematical foundation"
    ],
    areasForImprovement: [
      "Practice more transform problems",
      "Seek additional help during office hours",
      "Form study groups for problem-solving",
      "Review fundamental signal concepts regularly"
    ],
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
    difficultyReason: 'Perfect fit for your creative and analytical mindset!',
    motivationalMessage: "🌟 You're absolutely crushing this course! Your entrepreneurial spirit is shining through.",
    performanceAnalysis: "Outstanding performance in Innovation Entrepreneurship! Your 94% average and near-perfect attendance show exceptional engagement. You're demonstrating strong leadership and creative thinking skills that will serve you well in your career.",
    tipsAndTricks: [
      "Continue developing your business ideas",
      "Network with local entrepreneurs",
      "Apply course concepts to real projects",
      "Consider entering business plan competitions"
    ],
    strengths: [
      "Exceptional creativity and innovation",
      "Strong presentation skills",
      "Excellent teamwork and leadership",
      "Natural entrepreneurial mindset"
    ],
    areasForImprovement: [
      "Explore more advanced business concepts",
      "Consider starting a small venture",
      "Mentor other students in entrepreneurship"
    ],
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
  const [selectedCourse, setSelectedCourse] = useState<CoursePerformance | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);

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
    if (percentage >= 90) return '#10B981'; // Green - Excellent
    if (percentage >= 80) return '#3B82F6'; // Blue - Good
    if (percentage >= 70) return '#F59E0B'; // Orange - Satisfactory
    if (percentage >= 60) return '#EF4444'; // Red - Needs improvement
    return '#6B7280'; // Gray - Critical
  };

  const getMotivationalColor = (percentage: number): string => {
    if (percentage >= 85) return '#10B981'; // Green for excellent
    if (percentage >= 75) return '#3B82F6'; // Blue for good progress
    return '#8B5CF6'; // Purple for encouragement
  };

 const getDifficultyStarsSimple = (rating: number) => {
  const getStarColor = (currentRating: number) => {
    // Clamp rating between 1 and 5
    const clampedRating = Math.max(1, Math.min(5, currentRating));
    
    if (clampedRating <= 1) return "#22C55E"; // Green
    if (clampedRating <= 2) return "#65C55E"; // Light Green
    if (clampedRating <= 3) return "#EAB308"; // Yellow
    if (clampedRating <= 4) return "#F59E0B"; // Orange
    return "#EF4444"; // Red
  };

  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons
        key={i}
        name={i <= rating ? "star" : "star-outline"}
        size={14}
        color={i <= rating ? getStarColor(rating) : "#D1D5DB"}
      />
    );
  }
  return stars;
};

  const handleCoursePress = (course: CoursePerformance) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const handleGetTutoring = (courseCode: string) => {
    setShowCourseModal(false);
    // Navigate to tutoring page with course filter
    router.push(`/tutoring?filter=${courseCode}`);
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

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Academic Journey</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {/* Motivational Header */}
            <View style={styles.motivationalHeader}>
              <Text style={styles.motivationalTitle}>Keep Growing! 🌱</Text>
              <Text style={styles.motivationalSubtitle}>
                Every step forward is progress. You're building amazing skills!
              </Text>
            </View>

            {/* Overview Cards */}
            <View style={styles.overviewSection}>
              <View style={styles.overviewGrid}>
                <View style={styles.overviewCard}>
                  <Text style={styles.overviewValue}>{overallGPA.toFixed(2)}</Text>
                  <Text style={styles.overviewLabel}>Your GPA</Text>
                  <Ionicons name="trending-up" size={20} color="#10B981" />
                </View>
                
                <View style={styles.overviewCard}>
                  <Text style={styles.overviewValue}>{totalCompletedCredits}</Text>
                  <Text style={styles.overviewLabel}>Credits Earned</Text>
                  <Ionicons name="school" size={20} color="#3B82F6" />
                </View>
                
                <View style={styles.overviewCard}>
                  <Text style={styles.overviewValue}>{mockPerformanceData.length}</Text>
                  <Text style={styles.overviewLabel}>Current Courses</Text>
                  <Ionicons name="book" size={20} color="#8B5CF6" />
                </View>
              </View>
            </View>

            {/* Course Performance Cards */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Course Journey</Text>
              
              {mockPerformanceData.map((course) => (
                <TouchableOpacity 
                  key={course.id} 
                  style={styles.courseCard}
                  onPress={() => handleCoursePress(course)}
                >


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
                      <Text style={styles.difficultyLabel}>Challenge Level</Text>
                      <View style={styles.difficultyStars}>
                        {getDifficultyStarsSimple(course.difficultyRating)}
                      </View>
                    </View>
                    <Text style={styles.difficultyReason}>{course.difficultyReason}</Text>
                  </View>

                  {/* Credit Hours */}
                  <View style={styles.creditHours}>
                    <Ionicons name="time" size={16} color="#6B7280" />
                    <Text style={styles.creditHoursText}>{course.creditHours} Credit Hours</Text>
                    <View style={styles.tapHint}>
                      <Text style={styles.tapHintText}>Tap for detailed analysis</Text>
                      <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Academic Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Progress Summary</Text>
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

        {/* Course Detail Modal */}
        <Modal
          visible={showCourseModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowCourseModal(false)}
        >
          {selectedCourse && (
            <SafeAreaView style={styles.modalContainer}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  onPress={() => setShowCourseModal(false)} 
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Course Analysis</Text>
                <View style={styles.modalPlaceholder} />
              </View>

              <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                {/* Course Header */}
                <View style={styles.modalCourseHeader}>
                  <Text style={styles.modalCourseCode}>{selectedCourse.code}</Text>
                  <Text style={styles.modalCourseName}>{selectedCourse.name}</Text>
                  <Text style={styles.modalCourseInstructor}>{selectedCourse.instructor}</Text>
                  
                  <View style={[styles.modalMotivationalBanner, { backgroundColor: getMotivationalColor(selectedCourse.gradePercentage) }]}>
                    <Text style={styles.modalMotivationalText}>{selectedCourse.motivationalMessage}</Text>
                  </View>
                </View>

                {/* Performance Analysis */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>📊 Performance Analysis</Text>
                  <Text style={styles.modalAnalysisText}>{selectedCourse.performanceAnalysis}</Text>
                </View>

                {/* Strengths */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>💪 Your Strengths</Text>
                  {selectedCourse.strengths.map((strength, index) => (
                    <View key={index} style={styles.modalListItem}>
                      <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                      <Text style={styles.modalListText}>{strength}</Text>
                    </View>
                  ))}
                </View>

                {/* Areas for Improvement */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>🎯 Growth Opportunities</Text>
                  {selectedCourse.areasForImprovement.map((area, index) => (
                    <View key={index} style={styles.modalListItem}>
                      <Ionicons name="arrow-up-circle" size={16} color="#3B82F6" />
                      <Text style={styles.modalListText}>{area}</Text>
                    </View>
                  ))}
                </View>

                {/* Tips and Tricks */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>💡 Tips & Strategies</Text>
                  {selectedCourse.tipsAndTricks.map((tip, index) => (
                    <View key={index} style={styles.modalListItem}>
                      <Ionicons name="bulb" size={16} color="#F59E0B" />
                      <Text style={styles.modalListText}>{tip}</Text>
                    </View>
                  ))}
                </View>

                {/* Difficulty Explanation */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>⭐ Challenge Level Explanation</Text>
                  <View style={styles.modalDifficultyContainer}>
                    <View style={styles.modalDifficultyStars}>
                      {getDifficultyStarsSimple(selectedCourse.difficultyRating)}
                    </View>
                    <Text style={styles.modalDifficultyText}>{selectedCourse.difficultyReason}</Text>
                  </View>
                </View>

                {/* Get Help Button */}
                <TouchableOpacity
                  style={styles.modalTutoringButton}
                  onPress={() => handleGetTutoring(selectedCourse.code)}
                >
                  <Ionicons name="people" size={20} color="white" />
                  <Text style={styles.modalTutoringButtonText}>Get Academic Tutoring</Text>
                </TouchableOpacity>
              </ScrollView>
            </SafeAreaView>
          )}
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
  motivationalHeader: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  motivationalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  motivationalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
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
  motivationalBanner: {
    marginTop: -20,
    marginHorizontal: -20,
    padding: 12,
    marginBottom: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  motivationalText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
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
    lineHeight: 16,
  },
  creditHours: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  creditHoursText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tapHintText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
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
  // Modal Styles
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
  modalCourseHeader: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalCourseCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  modalCourseName: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 4,
  },
  modalCourseInstructor: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  modalMotivationalBanner: {
    padding: 12,
    borderRadius: 12,
    width: '100%',
  },
  modalMotivationalText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalSection: {
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
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  modalAnalysisText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  modalListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  modalListText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    flex: 1,
  },
  modalDifficultyContainer: {
    alignItems: 'center',
  },
  modalDifficultyStars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
  },
  modalDifficultyText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
  },
  modalTutoringButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  modalTutoringButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});