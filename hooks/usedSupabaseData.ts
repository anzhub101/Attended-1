import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Hook for events
export function useEvents() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchEvents = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setData(events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  return { data, loading, error, refetch: fetchEvents };
}

// Hook for news
export function useNews() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data: news, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setData(news || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return { data, loading, error, refetch: fetchNews };
}

// Hook for assignments
export function useAssignments() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAssignments = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data: assignments, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setData(assignments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [user]);

  return { data, loading, error, refetch: fetchAssignments };
}

// Hook for quick actions
export function useQuickActions() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuickActions = async () => {
    try {
      setLoading(true);
      const { data: actions, error } = await supabase
        .from('quick_actions')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setData(actions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuickActions();
  }, []);

  return { data, loading, error, refetch: fetchQuickActions };
}

// Hook for campus events
export function useCampusEvents() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampusEvents = async () => {
    try {
      setLoading(true);
      const { data: events, error } = await supabase
        .from('campus_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setData(events || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampusEvents();
  }, []);

  return { data, loading, error, refetch: fetchCampusEvents };
}

// Hook for inserting data
export function useSupabaseInsert(table: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const insert = async (data: any) => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      // Add user_id for user-specific tables
      const insertData = ['events', 'assignments'].includes(table) 
        ? { ...data, user_id: user.id }
        : data;

      const { error: insertError } = await supabase
        .from(table)
        .insert([insertData]);

      if (insertError) throw insertError;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { insert, loading, error };
}

// Hook for deleting data
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
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteItem, loading, error };
}

// Hook for user event registrations
export function useUserEventRegistrations() {
  const [registrations, setRegistrations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchRegistrations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_event_registrations')
        .select('event_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setRegistrations(data?.map(reg => reg.event_id) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const registerForEvent = async (eventId: string) => {
    if (!user) return false;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_event_registrations')
        .insert([{ user_id: user.id, event_id: eventId }]);

      if (error) throw error;
      
      setRegistrations(prev => [...prev, eventId]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unregisterFromEvent = async (eventId: string) => {
    if (!user) return false;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_event_registrations')
        .delete()
        .eq('user_id', user.id)
        .eq('event_id', eventId);

      if (error) throw error;
      
      setRegistrations(prev => prev.filter(id => id !== eventId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [user]);

  return {
    registrations,
    loading,
    error,
    registerForEvent,
    unregisterFromEvent,
    refetch: fetchRegistrations,
  };
}