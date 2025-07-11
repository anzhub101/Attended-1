export interface Database {
    public: {
      Tables: {
        events: {
          Row: {
            id: string;
            user_id: string;
            title: string;
            subtitle?: string;
            description?: string;
            location?: string;
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
            subtitle?: string;
            description?: string;
            location?: string;
            start_time: string;
            end_time: string;
            color: string;
            category: string;
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            id?: string;
            user_id?: string;
            title?: string;
            subtitle?: string;
            description?: string;
            location?: string;
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
            content?: string;
            image_url?: string;
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
            content?: string;
            image_url?: string;
            category: string;
            author: string;
            read_time: string;
            published_at?: string;
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            id?: string;
            title?: string;
            description?: string;
            content?: string;
            image_url?: string;
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
            due_date: string;
            priority: 'high' | 'medium' | 'low';
            description?: string;
            created_at: string;
            updated_at: string;
          };
          Insert: {
            id?: string;
            user_id: string;
            title: string;
            course: string;
            due_date: string;
            priority: 'high' | 'medium' | 'low';
            description?: string;
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            id?: string;
            user_id?: string;
            title?: string;
            course?: string;
            due_date?: string;
            priority?: 'high' | 'medium' | 'low';
            description?: string;
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
            route?: string;
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
            route?: string;
            order_index: number;
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
        user_profiles: {
          Row: {
            id: string;
            user_id: string;
            student_id: string;
            full_name: string;
            email: string;
            department?: string;
            faculty?: string;
            phone?: string;
            created_at: string;
            updated_at: string;
          };
          Insert: {
            id?: string;
            user_id: string;
            student_id: string;
            full_name: string;
            email: string;
            department?: string;
            faculty?: string;
            phone?: string;
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            id?: string;
            user_id?: string;
            student_id?: string;
            full_name?: string;
            email?: string;
            department?: string;
            faculty?: string;
            phone?: string;
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
            ticket_id: string;
          };
          Insert: {
            id?: string;
            user_id: string;
            event_id: string;
            registered_at?: string;
            ticket_id?: string;
          };
          Update: {
            id?: string;
            user_id?: string;
            event_id?: string;
            registered_at?: string;
            ticket_id?: string;
          };
        };
      };
      campus_events: {
        Row: {
          id: string;
          title: string;
          description: string;
          image_url?: string;
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
          image_url?: string;
          category: string;
          author: string;
          location?: string;
          event_date: string;
          event_time?: string;
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
          image_url?: string;
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
      Views: {
        [_ in never]: never;
      };
      Functions: {
        [_ in never]: never;
      };
      Enums: {
        [_ in never]: never;
      };
    };
  }