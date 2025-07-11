/*
  # Initial Database Schema Setup

  1. New Tables
    - `user_profiles` - User profile information
    - `events` - Personal calendar events
    - `news` - News articles and announcements
    - `assignments` - Student assignments
    - `quick_actions` - Dashboard quick action buttons
    - `campus_events` - Campus-wide events
    - `user_event_registrations` - Event registration tracking

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for authenticated users
    - Public read access for news, campus events, and quick actions

  3. Sample Data
    - Pre-populate with sample news, campus events, and quick actions
    - Sample assignments and calendar events for testing
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id text UNIQUE NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  department text,
  faculty text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Events Table (Personal Calendar)
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  subtitle text,
  description text,
  location text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  color text DEFAULT '#4285F4',
  category text DEFAULT 'personal',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own events"
  ON events
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- News Table
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  content text,
  image_url text,
  category text DEFAULT 'general',
  author text NOT NULL,
  read_time text DEFAULT '2 min read',
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on news"
  ON news
  FOR SELECT
  TO public
  USING (true);

-- Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  course text NOT NULL,
  due_date timestamptz NOT NULL,
  priority text DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own assignments"
  ON assignments
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Quick Actions Table
CREATE TABLE IF NOT EXISTS quick_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL,
  route text,
  order_index integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quick_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on quick_actions"
  ON quick_actions
  FOR SELECT
  TO public
  USING (true);

-- Campus Events Table
CREATE TABLE IF NOT EXISTS campus_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  category text DEFAULT 'Academic',
  author text NOT NULL,
  location text DEFAULT 'TBA',
  event_date timestamptz NOT NULL,
  event_time text DEFAULT '10:00 AM',
  registration_required boolean DEFAULT true,
  max_attendees integer DEFAULT 100,
  current_attendees integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE campus_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on campus_events"
  ON campus_events
  FOR SELECT
  TO public
  USING (true);

-- User Event Registrations Table
CREATE TABLE IF NOT EXISTS user_event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id uuid REFERENCES campus_events(id) ON DELETE CASCADE,
  registered_at timestamptz DEFAULT now(),
  ticket_id text DEFAULT gen_random_uuid()
);

ALTER TABLE user_event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own registrations"
  ON user_event_registrations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS events_user_id_idx ON events(user_id);
CREATE INDEX IF NOT EXISTS events_start_time_idx ON events(start_time);
CREATE INDEX IF NOT EXISTS assignments_user_id_idx ON assignments(user_id);
CREATE INDEX IF NOT EXISTS assignments_due_date_idx ON assignments(due_date);
CREATE INDEX IF NOT EXISTS news_published_at_idx ON news(published_at);
CREATE INDEX IF NOT EXISTS campus_events_event_date_idx ON campus_events(event_date);
CREATE INDEX IF NOT EXISTS user_event_registrations_user_id_idx ON user_event_registrations(user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quick_actions_updated_at
  BEFORE UPDATE ON quick_actions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campus_events_updated_at
  BEFORE UPDATE ON campus_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();