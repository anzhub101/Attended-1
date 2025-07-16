/*
  # Comprehensive Database Schema for Campus App

  1. New Tables
    - `main_events` - Primary calendar events table for schedule.tsx
    - `campus_events` - Events displayed in events.tsx with registration
    - `event_registrations` - Track user event registrations
    - `news` - News articles and announcements
    - `tutors` - Tutor profiles and information
    - `tutor_sessions` - Booked tutoring sessions
    - `tutor_bookings` - Tutoring booking requests
    - `performance_data` - Student performance metrics
    - `quick_actions` - Dashboard quick action items
    - `assignments` - Student assignments

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for authenticated users
    - Ensure data isolation per user where needed

  3. Relationships
    - Foreign keys between related tables
    - Proper indexing for performance
    - Cascading deletes where appropriate
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main Events Table (Primary calendar events)
CREATE TABLE IF NOT EXISTS main_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  subtitle text,
  description text,
  location text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  color text DEFAULT '#4285F4',
  event_type text DEFAULT 'personal' CHECK (event_type IN ('personal', 'academic', 'tutoring', 'registered_event')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
  source_id uuid, -- Reference to original event (campus_events, tutor_sessions, etc.)
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Campus Events Table (Events in events.tsx)
CREATE TABLE IF NOT EXISTS campus_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  category text NOT NULL DEFAULT 'general' CHECK (category IN ('academic', 'social', 'sports', 'career', 'workshop', 'general')),
  author text NOT NULL,
  location text NOT NULL,
  event_date date NOT NULL,
  event_time text NOT NULL,
  max_attendees integer DEFAULT 100,
  current_attendees integer DEFAULT 0,
  registration_required boolean DEFAULT true,
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Event Registrations Table
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id uuid REFERENCES campus_events(id) ON DELETE CASCADE,
  registration_date timestamptz DEFAULT now(),
  status text DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled', 'attended')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- News Table
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  image_url text,
  category text NOT NULL DEFAULT 'general' CHECK (category IN ('academic', 'sports', 'cultural', 'general', 'announcement')),
  author text NOT NULL,
  read_time text DEFAULT '2 min read',
  published_at timestamptz DEFAULT now(),
  status text DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tutors Table
CREATE TABLE IF NOT EXISTS tutors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  student_id text NOT NULL UNIQUE,
  year text NOT NULL,
  major text NOT NULL,
  profile_image text,
  bio text NOT NULL,
  subjects text[] NOT NULL DEFAULT '{}',
  available_times text[] NOT NULL DEFAULT '{}',
  rating numeric(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  total_sessions integer DEFAULT 0,
  email text NOT NULL,
  phone text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tutor Bookings Table (Booking requests)
CREATE TABLE IF NOT EXISTS tutor_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id uuid REFERENCES tutors(id) ON DELETE CASCADE,
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  subject text NOT NULL,
  time_slot text NOT NULL,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tutor Sessions Table (Confirmed sessions)
CREATE TABLE IF NOT EXISTS tutor_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES tutor_bookings(id) ON DELETE CASCADE,
  tutor_id uuid REFERENCES tutors(id) ON DELETE CASCADE,
  student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  session_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  location text,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  notes text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  feedback text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Performance Data Table
CREATE TABLE IF NOT EXISTS performance_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  course_code text NOT NULL,
  course_name text NOT NULL,
  instructor text NOT NULL,
  current_grade text NOT NULL,
  grade_percentage numeric(5,2) NOT NULL,
  participation numeric(5,2) DEFAULT 0,
  attendance numeric(5,2) DEFAULT 0,
  credit_hours integer NOT NULL,
  difficulty_rating integer DEFAULT 3 CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  difficulty_reason text,
  motivational_message text,
  performance_analysis text,
  tips_and_tricks text[] DEFAULT '{}',
  strengths text[] DEFAULT '{}',
  areas_for_improvement text[] DEFAULT '{}',
  assignments_completed integer DEFAULT 0,
  assignments_total integer DEFAULT 0,
  quizzes_completed integer DEFAULT 0,
  quizzes_total integer DEFAULT 0,
  midterm_grade numeric(5,2) DEFAULT 0,
  final_exam_scheduled boolean DEFAULT false,
  final_exam_date date,
  semester text NOT NULL,
  year integer NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Quick Actions Table
CREATE TABLE IF NOT EXISTS quick_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL,
  route text NOT NULL,
  order_index integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  course text NOT NULL,
  description text,
  due_date timestamptz NOT NULL,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE main_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE campus_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for main_events
CREATE POLICY "Users can manage their own events"
  ON main_events
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for campus_events (public read, admin write)
CREATE POLICY "Anyone can read campus events"
  ON campus_events
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for event_registrations
CREATE POLICY "Users can manage their own registrations"
  ON event_registrations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for news (public read)
CREATE POLICY "Anyone can read news"
  ON news
  FOR SELECT
  TO authenticated
  USING (status = 'published');

-- RLS Policies for tutors (public read for active tutors)
CREATE POLICY "Anyone can read active tutors"
  ON tutors
  FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Users can manage their own tutor profile"
  ON tutors
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for tutor_bookings
CREATE POLICY "Users can manage bookings they're involved in"
  ON tutor_bookings
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = student_id OR 
    auth.uid() IN (SELECT user_id FROM tutors WHERE id = tutor_id)
  );

-- RLS Policies for tutor_sessions
CREATE POLICY "Users can access sessions they're involved in"
  ON tutor_sessions
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = student_id OR 
    auth.uid() IN (SELECT user_id FROM tutors WHERE id = tutor_id)
  );

-- RLS Policies for performance_data
CREATE POLICY "Users can manage their own performance data"
  ON performance_data
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for quick_actions (public read)
CREATE POLICY "Anyone can read active quick actions"
  ON quick_actions
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- RLS Policies for assignments
CREATE POLICY "Users can manage their own assignments"
  ON assignments
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_main_events_user_id ON main_events(user_id);
CREATE INDEX IF NOT EXISTS idx_main_events_start_time ON main_events(start_time);
CREATE INDEX IF NOT EXISTS idx_main_events_event_type ON main_events(event_type);
CREATE INDEX IF NOT EXISTS idx_campus_events_date ON campus_events(event_date);
CREATE INDEX IF NOT EXISTS idx_campus_events_category ON campus_events(category);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_event ON event_registrations(user_id, event_id);
CREATE INDEX IF NOT EXISTS idx_tutors_subjects ON tutors USING GIN(subjects);
CREATE INDEX IF NOT EXISTS idx_tutor_bookings_status ON tutor_bookings(status);
CREATE INDEX IF NOT EXISTS idx_tutor_sessions_date ON tutor_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_performance_data_user_semester ON performance_data(user_id, semester, year);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_assignments_user_course ON assignments(user_id, course);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_main_events_updated_at BEFORE UPDATE ON main_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campus_events_updated_at BEFORE UPDATE ON campus_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tutors_updated_at BEFORE UPDATE ON tutors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tutor_bookings_updated_at BEFORE UPDATE ON tutor_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tutor_sessions_updated_at BEFORE UPDATE ON tutor_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_performance_data_updated_at BEFORE UPDATE ON performance_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quick_actions_updated_at BEFORE UPDATE ON quick_actions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update event attendees count
CREATE OR REPLACE FUNCTION update_event_attendees()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE campus_events 
        SET current_attendees = current_attendees + 1 
        WHERE id = NEW.event_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE campus_events 
        SET current_attendees = GREATEST(current_attendees - 1, 0) 
        WHERE id = OLD.event_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger to automatically update attendee count
CREATE TRIGGER update_campus_events_attendees
    AFTER INSERT OR DELETE ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION update_event_attendees();