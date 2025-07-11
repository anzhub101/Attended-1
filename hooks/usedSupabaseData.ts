import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/database';
import { useAuth } from '../contexts/AuthContext';

type Tables = Database['public']['Tables'];

// Generic hook for fetching data from any table
export function useSupabaseData<T extends keyof Tables>(
  table: T,
  options?: {
    orderBy?: string;
    ascending?: boolean;
    limit?: number;
    filter?: { column: string; value: any };
  }
) {
  const [data, setData] = useState<Tables[T]['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  useEffect(() => {
    if (session?.user) {
      fetchData();
    } else {
      setData([]);
      setLoading(false);
    }
  }, [table, session]);

  const fetchData = async () => {
    if (!session?.user) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase.from(table).select('*');

      // Add user filtering for user-specific tables
      if (['events', 'assignments'].includes(table)) {
        query = query.eq('user_id', session.user.id);
      }

      if (options?.filter) {
        query = query.eq(options.filter.column, options.filter.value);
      }

      if (options?.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending ?? true });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data: result, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setData(result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
}

// Specific hooks for each table
export function useEvents() {
  return useSupabaseData('events', {
    orderBy: 'start_time',
    ascending: true,
  });
}

export function useNews() {
  return useSupabaseData('news', {
    orderBy: 'published_at',
    ascending: false,
  });
}

export function useAssignments() {
  return useSupabaseData('assignments', {
    orderBy: 'due_date',
    ascending: true,
  });
}

export function useQuickActions() {
  return useSupabaseData('quick_actions', {
    orderBy: 'order_index',
    ascending: true,
    filter: { column: 'is_active', value: true },
  });
}

export function useCampusEvents() {
  return useSupabaseData('campus_events', {
    orderBy: 'event_date',
    ascending: true,
  });
}

// Hook for inserting data
export function useSupabaseInsert<T extends keyof Tables>(table: T) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const insert = async (data: Tables[T]['Insert']) => {
    if (!session?.user) {
      setError('User not authenticated');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      // Add user_id for user-specific tables
      let insertData = data;
      if (['events', 'assignments'].includes(table)) {
        insertData = { ...data, user_id: session.user.id } as Tables[T]['Insert'];
      }

      const { error: insertError } = await supabase
        .from(table)
        .insert(insertData);

      if (insertError) {
        throw insertError;
      }

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

// Hook for updating data
export function useSupabaseUpdate<T extends keyof Tables>(table: T) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const update = async (id: string, data: Tables[T]['Update']) => {
    if (!session?.user) {
      setError('User not authenticated');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase.from(table).update(data).eq('id', id);

      // Add user filtering for user-specific tables
      if (['events', 'assignments'].includes(table)) {
        query = query.eq('user_id', session.user.id);
      }

      const { error: updateError } = await query;

      if (updateError) {
        throw updateError;
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

// Hook for deleting data
export function useSupabaseDelete<T extends keyof Tables>(table: T) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const deleteItem = async (id: string) => {
    if (!session?.user) {
      setError('User not authenticated');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase.from(table).delete().eq('id', id);

      // Add user filtering for user-specific tables
      if (['events', 'assignments'].includes(table)) {
        query = query.eq('user_id', session.user.id);
      }

      const { error: deleteError } = await query;

      if (deleteError) {
        throw deleteError;
      }

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
  const { session } = useAuth();
  const [registrations, setRegistrations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchRegistrations();
    } else {
      setRegistrations([]);
      setLoading(false);
    }
  }, [session]);

  const fetchRegistrations = async () => {
    if (!session?.user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_event_registrations')
        .select('event_id')
        .eq('user_id', session.user.id);

      if (error) throw error;

      setRegistrations(data.map(reg => reg.event_id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const registerForEvent = async (eventId: string) => {
    if (!session?.user) return false;

    try {
      const { error } = await supabase
        .from('user_event_registrations')
        .insert({
          user_id: session.user.id,
          event_id: eventId,
        });

      if (error) throw error;

      setRegistrations(prev => [...prev, eventId]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  const unregisterFromEvent = async (eventId: string) => {
    if (!session?.user) return false;

    try {
      const { error } = await supabase
        .from('user_event_registrations')
        .delete()
        .eq('user_id', session.user.id)
        .eq('event_id', eventId);

      if (error) throw error;

      setRegistrations(prev => prev.filter(id => id !== eventId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  return {
    registrations,
    loading,
    error,
    registerForEvent,
    unregisterFromEvent,
    refetch: fetchRegistrations,
  };
}