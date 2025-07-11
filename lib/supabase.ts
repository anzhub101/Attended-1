import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          subtitle: string | null;
          description: string | null;
          location: string | null;
          start_time: string;
          end_time: string;
          color: string;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          subtitle?: string | null;
          description?: string | null;
          location?: string | null;
          start_time: string;
          end_time: string;
          color?: string;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          subtitle?: string | null;
          description?: string | null;
          location?: string | null;
          start_time?: string;
          end_time?: string;
          color?: string;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      news: {
        Row: {
          id: string;
          title: string;
          description: string;
          content: string;
          image_url: string | null;
          category: string;
          author: string;
          read_time: string;
          published_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          content: string;
          image_url?: string | null;
          category?: string;
          author: string;
          read_time?: string;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          content?: string;
          image_url?: string | null;
          category?: string;
          author?: string;
          read_time?: string;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      assignments: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          course: string;
          description: string | null;
          due_date: string;
          priority: string;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          course: string;
          description?: string | null;
          due_date: string;
          priority?: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          course?: string;
          description?: string | null;
          due_date?: string;
          priority?: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      quick_actions: {
        Row: {
          id: string;
          title: string;
          icon: string;
          color: string;
          route: string;
          order_index: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          icon: string;
          color: string;
          route: string;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          icon?: string;
          color?: string;
          route?: string;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      campus_events: {
        Row: {
          id: string;
          title: string;
          description: string;
          image_url: string | null;
          category: string;
          author: string;
          location: string;
          event_date: string;
          event_time: string;
          registration_required: boolean;
          max_attendees: number;
          current_attendees: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          image_url?: string | null;
          category?: string;
          author: string;
          location: string;
          event_date: string;
          event_time: string;
          registration_required?: boolean;
          max_attendees?: number;
          current_attendees?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          image_url?: string | null;
          category?: string;
          author?: string;
          location?: string;
          event_date?: string;
          event_time?: string;
          registration_required?: boolean;
          max_attendees?: number;
          current_attendees?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_event_registrations: {
        Row: {
          id: string;
          user_id: string;
          event_id: string;
          registered_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_id: string;
          registered_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          event_id?: string;
          registered_at?: string;
          created_at?: string;
        };
      };
    };
  };
}