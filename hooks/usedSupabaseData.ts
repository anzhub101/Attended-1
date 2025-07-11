import { useState, useEffect } from 'react';

// Mock data for events
const mockEvents = [
  {
    id: '1',
    user_id: 'mock-user',
    title: 'CSC303',
    subtitle: 'Dr. Ahmed Hassan',
    description: 'Database Systems - Advanced SQL Queries',
    location: 'A-2F-13',
    start_time: '2025-01-20T05:00:00.000Z',
    end_time: '2025-01-20T06:45:00.000Z',
    color: '#4285F4',
    category: 'academic',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'mock-user',
    title: 'MTT205',
    subtitle: 'Prof. Sarah Jamal',
    description: 'Linear Algebra',
    location: 'H1-11-A',
    start_time: '2025-01-20T11:00:00.000Z',
    end_time: '2025-01-20T12:40:00.000Z',
    color: '#DB4437',
    category: 'academic',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: 'mock-user',
    title: 'PHY201',
    subtitle: 'Dr. Huma Zia',
    description: 'Physics II - Applications',
    location: 'D-0F-15',
    start_time: '2025-01-20T08:50:00.000Z',
    end_time: '2025-01-20T10:20:00.000Z',
    color: '#0F9D58',
    category: 'academic',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock data for news
const mockNews = [
  {
    id: '1',
    title: 'New Library Hours Extended',
    description: 'The university library will now be open 24/7 during exam periods to support student learning.',
    content: 'Starting this semester, the main library will extend its operating hours to 24/7 during midterm and final exam periods. This initiative aims to provide students with more flexible study spaces and access to resources when they need them most.',
    image_url: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    category: 'Academic',
    author: 'Library Administration',
    read_time: '2 min read',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Student Research Symposium 2025',
    description: 'Annual research symposium showcasing outstanding undergraduate and graduate student projects.',
    content: 'Join us for the annual Student Research Symposium where students from all disciplines will present their innovative research projects. This year features over 100 presentations across various fields.',
    image_url: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    category: 'Academic',
    author: 'Research Office',
    read_time: '3 min read',
    published_at: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock data for assignments
const mockAssignments = [
  {
    id: '1',
    user_id: 'mock-user',
    title: 'Database Design Project',
    course: 'CSC303',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'high' as const,
    description: 'Design and implement a complete database system for a library management system.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'mock-user',
    title: 'Linear Algebra Problem Set',
    course: 'MTT205',
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'medium' as const,
    description: 'Complete problems 1-15 from Chapter 4.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: 'mock-user',
    title: 'Physics Lab Report',
    course: 'PHY201',
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'low' as const,
    description: 'Write a comprehensive lab report on the wave interference experiment.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock data for quick actions
const mockQuickActions = [
  {
    id: '1',
    title: 'Grades',
    icon: 'school',
    color: '#3B82F6',
    route: '/grades',
    order_index: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Library',
    icon: 'library',
    color: '#10B981',
    route: '/library',
    order_index: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Map',
    icon: 'map',
    color: '#EF4444',
    route: '/map',
    order_index: 5,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock data for campus events
const mockCampusEvents = [
  {
    id: '1',
    title: 'Welcome Week Orientation',
    description: 'Join us for an exciting week of activities designed to welcome new students to campus life.',
    image_url: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    category: 'Social',
    author: 'Student Affairs',
    location: 'Main Auditorium',
    event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    event_time: '10:00 AM',
    registration_required: true,
    max_attendees: 500,
    current_attendees: 234,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Career Fair 2025',
    description: 'Meet with top employers and explore career opportunities across various industries.',
    image_url: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    category: 'Career',
    author: 'Career Services',
    location: 'Student Center',
    event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    event_time: '9:00 AM',
    registration_required: true,
    max_attendees: 1000,
    current_attendees: 567,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Tech Innovation Workshop',
    description: 'Learn about the latest trends in technology and innovation from industry experts.',
    image_url: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    category: 'Workshop',
    author: 'Engineering Department',
    location: 'Engineering Building',
    event_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    event_time: '2:00 PM',
    registration_required: true,
    max_attendees: 100,
    current_attendees: 78,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Generic hook for mock data
export function useMockData<T>(data: T[], delay = 500, storageKey?: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (storageKey) {
        try {
          const stored = await AsyncStorage.getItem(storageKey);
          if (stored) {
            setItems(JSON.parse(stored));
          } else {
            setItems(data);
            await AsyncStorage.setItem(storageKey, JSON.stringify(data));
          }
        } catch (error) {
          setItems(data);
        }
      } else {
        setItems(data);
      }
      setLoading(false);
    };

    const timer = setTimeout(loadData, delay);

    return () => clearTimeout(timer);
  }, [data, delay, storageKey]);

  const refetch = () => {
    setLoading(true);
    setError(null);
    setTimeout(async () => {
      if (storageKey) {
        try {
          const stored = await AsyncStorage.getItem(storageKey);
          if (stored) {
            setItems(JSON.parse(stored));
          } else {
            setItems(data);
          }
        } catch (error) {
          setItems(data);
        }
      } else {
        setItems(data);
      }
      setLoading(false);
    }, delay);
  };

  const updateData = async (newData: T[]) => {
    setItems(newData);
    if (storageKey) {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(newData));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  };

  return { data: items, loading, error, refetch, updateData };
}

// Specific hooks for each data type
export function useEvents() {
  return useMockData(mockEvents, 500, 'events');
}

export function useNews() {
  return useMockData(mockNews);
}

export function useAssignments() {
  return useMockData(mockAssignments);
}

export function useQuickActions() {
  return useMockData(mockQuickActions);
}

export function useCampusEvents() {
  return useMockData(mockCampusEvents);
}

// Mock insert hook
export function useSupabaseInsert(table: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const insert = async (data: any) => {
    setLoading(true);
    setError(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // If inserting into events table, add to stored events
    if (table === 'events') {
      try {
        const stored = await AsyncStorage.getItem('events');
        const events = stored ? JSON.parse(stored) : mockEvents;
        const newEvent = {
          ...data,
          id: Date.now().toString(),
          user_id: 'mock-user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        const updatedEvents = [...events, newEvent];
        await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
      } catch (error) {
        console.error('Error saving event:', error);
      }
    }
    
    setLoading(false);
    return true;
  };

  return { insert, loading, error };
}

// Mock delete hook
export function useSupabaseDelete<T>(table: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteItem = async (id: string) => {
    setLoading(true);
    setError(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setLoading(false);
    return true;
  };

  return { deleteItem, loading, error };
}

// Mock user event registrations hook
export function useUserEventRegistrations() {
  const [registrations, setRegistrations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerForEvent = async (eventId: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setRegistrations(prev => [...prev, eventId]);
    setLoading(false);
    return true;
  };

  const unregisterFromEvent = async (eventId: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setRegistrations(prev => prev.filter(id => id !== eventId));
    setLoading(false);
    return true;
  };

  return {
    registrations,
    loading,
    error,
    registerForEvent,
    unregisterFromEvent,
    refetch: () => {},
  };
}