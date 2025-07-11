/*
  # Create campus_events table

  1. New Tables
    - `campus_events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text, optional)
      - `category` (text)
      - `author` (text)
      - `location` (text)
      - `event_date` (timestamptz)
      - `event_time` (text)
      - `registration_required` (boolean)
      - `max_attendees` (integer)
      - `current_attendees` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `campus_events` table
    - Add policy for all authenticated users to read campus events
*/

CREATE TABLE IF NOT EXISTS campus_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  category text DEFAULT 'general',
  author text NOT NULL,
  location text NOT NULL,
  event_date timestamptz NOT NULL,
  event_time text NOT NULL,
  registration_required boolean DEFAULT false,
  max_attendees integer DEFAULT 100,
  current_attendees integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE campus_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read campus events"
  ON campus_events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE TRIGGER update_campus_events_updated_at
  BEFORE UPDATE ON campus_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample campus events data
INSERT INTO campus_events (title, description, image_url, category, author, location, event_date, event_time, registration_required, max_attendees, current_attendees) VALUES
(
  'Welcome Week Orientation',
  'Join us for an exciting week of activities designed to welcome new students to campus life.',
  'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
  'Social',
  'Student Affairs',
  'Main Auditorium',
  now() + interval '7 days',
  '10:00 AM',
  true,
  500,
  234
),
(
  'Career Fair 2025',
  'Meet with top employers and explore career opportunities across various industries.',
  'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
  'Career',
  'Career Services',
  'Student Center',
  now() + interval '14 days',
  '9:00 AM',
  true,
  1000,
  567
),
(
  'Tech Innovation Workshop',
  'Learn about the latest trends in technology and innovation from industry experts.',
  'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
  'Workshop',
  'Engineering Department',
  'Engineering Building',
  now() + interval '21 days',
  '2:00 PM',
  true,
  100,
  78
);