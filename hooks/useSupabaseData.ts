import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// Types
export interface MainEvent {
  id: string;
  user_id: string;
  title: string;
  subtitle?: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time: string;
  color: string;
  event_type: 'personal' | 'academic' | 'tutoring' | 'registered_event';
  status: 'active' | 'cancelled' | 'completed';
  source_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  category: string;
  author: string;
  location: string;
  event_date: string;
  event_time: string;
  max_attendees: number;
  current_attendees: number;
  registration_required: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url?: string;
  category: string;
  author: string;
  read_time: string;
  published_at: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Tutor {
  id: string;
  user_id: string;
  name: string;
  student_id: string;
  year: string;
  major: string;
  profile_image?: string;
  bio: string;
  subjects: string[];
  available_times: string[];
  rating: number;
  total_sessions: number;
  email: string;
  phone?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  user_id: string;
  title: string;
  course: string;
  description?: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  created_at: string;
  updated_at: string;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  route: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PerformanceData {
  id: string;
  user_id: string;
  course_code: string;
  course_name: string;
  instructor: string;
  current_grade: string;
  grade_percentage: number;
  participation: number;
  attendance: number;
  credit_hours: number;
  difficulty_rating: number;
  difficulty_reason?: string;
  motivational_message?: string;
  performance_analysis?: string;
  tips_and_tricks: string[];
  strengths: string[];
  areas_for_improvement: string[];
  assignments_completed: number;
  assignments_total: number;
  quizzes_completed: number;
  quizzes_total: number;
  midterm_grade: number;
  final_exam_scheduled: boolean;
  final_exam_date?: string;
  semester: string;
  year: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TutorBooking {
  id: string;
  tutor_id: string;
  student_id: string;
  student_name: string;
  subject: string;
  time_slot: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: string;
  user_id: string;
  event_id: string;
  registration_date: string;
  status: 'registered' | 'cancelled' | 'attended';
  created_at: string;
}

// Generic hook for Supabase data fetching
function useSupabaseData<T>(
  table: string,
  query?: (q: any) => any,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let q = supabase.from(table).select('*');
      
      if (query) {
        q = query(q);
      }
      
      const { data: result, error: fetchError } = await q;
      
      if (fetchError) {
        throw fetchError;
      }
      
      setData(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(`Error fetching ${table}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
}

// Specific hooks for each data type
export function useMainEvents() {
  const { user } = useAuth();
  return useSupabaseData<MainEvent>(
    'main_events',
    (q) => q.eq('user_id', user?.id).order('start_time', { ascending: true }),
    [user?.id]
  );
}

export function useCampusEvents() {
  return useSupabaseData<CampusEvent>(
    'campus_events',
    (q) => q.eq('status', 'active').order('event_date', { ascending: true })
  );
}

export function useNews() {
  return useSupabaseData<NewsItem>(
    'news',
    (q) => q.eq('status', 'published').order('published_at', { ascending: false })
  );
}

export function useTutors() {
  return useSupabaseData<Tutor>(
    'tutors',
    (q) => q.eq('status', 'active').order('rating', { ascending: false })
  );
}

export function useAssignments() {
  const { user } = useAuth();
  return useSupabaseData<Assignment>(
    'assignments',
    (q) => q.eq('user_id', user?.id).order('due_date', { ascending: true }),
    [user?.id]
  );
}

export function useQuickActions() {
  return useSupabaseData<QuickAction>(
    'quick_actions',
    (q) => q.eq('is_active', true).order('order_index', { ascending: true })
  );
}

export function usePerformanceData() {
  const { user } = useAuth();
  return useSupabaseData<PerformanceData>(
    'performance_data',
    (q) => q.eq('user_id', user?.id).eq('status', 'active'),
    [user?.id]
  );
}

// Event registration hooks
export function useEventRegistrations() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchRegistrations = async () => {
      try {
        const { data, error } = await supabase
          .from('event_registrations')
          .select('event_id')
          .eq('user_id', user.id)
          .eq('status', 'registered');

        if (error) throw error;

        setRegistrations(data?.map(r => r.event_id) || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch registrations');
      }
    };

    fetchRegistrations();
  }, [user?.id]);

  const registerForEvent = async (eventId: string) => {
    if (!user?.id) return false;

    try {
      setLoading(true);
      setError(null);

      // Insert registration
      const { error: insertError } = await supabase
        .from('event_registrations')
        .insert({
          user_id: user.id,
          event_id: eventId,
          status: 'registered'
        });

      if (insertError) throw insertError;

      // Get event details to add to main_events
      const { data: eventData, error: eventError } = await supabase
        .from('campus_events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;

      // Add to main_events for calendar display
      const eventDateTime = new Date(`${eventData.event_date}T${eventData.event_time}`);
      const endDateTime = new Date(eventDateTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration

      const { error: mainEventError } = await supabase
        .from('main_events')
        .insert({
          user_id: user.id,
          title: eventData.title,
          subtitle: `Organized by ${eventData.author}`,
          description: eventData.description,
          location: eventData.location,
          start_time: eventDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          color: '#4285F4',
          event_type: 'registered_event',
          source_id: eventId
        });

      if (mainEventError) throw mainEventError;

      setRegistrations(prev => [...prev, eventId]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unregisterFromEvent = async (eventId: string) => {
    if (!user?.id) return false;

    try {
      setLoading(true);
      setError(null);

      // Remove registration
      const { error: deleteError } = await supabase
        .from('event_registrations')
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', eventId);

      if (deleteError) throw deleteError;

      // Remove from main_events
      const { error: mainEventError } = await supabase
        .from('main_events')
        .delete()
        .eq('user_id', user.id)
        .eq('source_id', eventId)
        .eq('event_type', 'registered_event');

      if (mainEventError) throw mainEventError;

      setRegistrations(prev => prev.filter(id => id !== eventId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unregistration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    registrations,
    loading,
    error,
    registerForEvent,
    unregisterFromEvent,
    refetch: () => {} // Placeholder for consistency
  };
}

// Tutor booking hooks
export function useTutorBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<TutorBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitBookingRequest = async (bookingData: {
    tutorId: string;
    subject: string;
    timeSlot: string;
    message?: string;
  }) => {
    if (!user?.id) return false;

    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('tutor_bookings')
        .insert({
          tutor_id: bookingData.tutorId,
          student_id: user.id,
          student_name: user.name || 'Student',
          subject: bookingData.subject,
          time_slot: bookingData.timeSlot,
          message: bookingData.message,
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setBookings(prev => [...prev, data]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking request failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    loading,
    error,
    submitBookingRequest
  };
}

// Insert/Update hooks
export function useSupabaseInsert(table: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const insert = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      const { data: result, error: insertError } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      if (insertError) throw insertError;

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Insert failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { insert, loading, error };
}

export function useSupabaseUpdate(table: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: string, data: any) => {
    try {
      setLoading(true);
      setError(null);

      const { data: result, error: updateError } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useSupabaseDelete(table: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteItem = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteItem, loading, error };
}

// Legacy compatibility - keep existing hook names
export const useEvents = useMainEvents;
export const useUserEventRegistrations = useEventRegistrations;