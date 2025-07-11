/*
  # Add User Isolation for Multi-User Support

  1. Database Changes
    - Add user_id columns to all user-specific tables
    - Create user profiles table
    - Update RLS policies for proper data isolation
    - Add indexes for performance with large user base

  2. Security
    - Row Level Security ensures users only see their own data
    - Foreign key constraints maintain data integrity
    - Proper indexing for 10,000+ users performance
*/

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id text UNIQUE NOT NULL,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  department text,
  faculty text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Add user_id to events table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE events ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add user_id to assignments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'assignments' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE assignments ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create user_event_registrations table for tracking event registrations
CREATE TABLE IF NOT EXISTS user_event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id uuid REFERENCES campus_events(id) ON DELETE CASCADE,
  registered_at timestamptz DEFAULT now(),
  ticket_id text UNIQUE NOT NULL DEFAULT 'TICKET-' || gen_random_uuid(),
  UNIQUE(user_id, event_id)
);

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_event_registrations ENABLE ROW LEVEL SECURITY;

-- Update RLS policies for events table
DROP POLICY IF EXISTS "Allow public read access on events" ON events;
CREATE POLICY "Users can read own events"
  ON events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own events"
  ON events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update RLS policies for assignments table
DROP POLICY IF EXISTS "Allow public read access on assignments" ON assignments;
CREATE POLICY "Users can read own assignments"
  ON assignments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assignments"
  ON assignments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assignments"
  ON assignments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assignments"
  ON assignments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for user_event_registrations
CREATE POLICY "Users can read own registrations"
  ON user_event_registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own registrations"
  ON user_event_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own registrations"
  ON user_event_registrations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Performance indexes for large user base
CREATE INDEX IF NOT EXISTS events_user_id_idx ON events(user_id);
CREATE INDEX IF NOT EXISTS events_user_start_time_idx ON events(user_id, start_time);
CREATE INDEX IF NOT EXISTS assignments_user_id_idx ON assignments(user_id);
CREATE INDEX IF NOT EXISTS assignments_user_due_date_idx ON assignments(user_id, due_date);
CREATE INDEX IF NOT EXISTS user_profiles_user_id_idx ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS user_profiles_student_id_idx ON user_profiles(student_id);
CREATE INDEX IF NOT EXISTS user_event_registrations_user_id_idx ON user_event_registrations(user_id);
CREATE INDEX IF NOT EXISTS user_event_registrations_event_id_idx ON user_event_registrations(event_id);

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();