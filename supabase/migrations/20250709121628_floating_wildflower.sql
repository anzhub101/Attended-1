/*
  # Create initial database schema for attended_app

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `subtitle` (text, optional)
      - `description` (text, optional)
      - `location` (text, optional)
      - `start_time` (timestamptz, required)
      - `end_time` (timestamptz, required)
      - `color` (text, required)
      - `category` (text, required)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `news`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, required)
      - `content` (text, optional)
      - `image_url` (text, optional)
      - `category` (text, required)
      - `author` (text, required)
      - `read_time` (text, required)
      - `published_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `assignments`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `course` (text, required)
      - `due_date` (timestamptz, required)
      - `priority` (text, required)
      - `description` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `quick_actions`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `icon` (text, required)
      - `color` (text, required)
      - `route` (text, optional)
      - `order_index` (integer, required)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (since this is a university app)
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text,
  location text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  color text NOT NULL DEFAULT '#4285F4',
  category text NOT NULL DEFAULT 'academic',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  content text,
  image_url text,
  category text NOT NULL DEFAULT 'general',
  author text NOT NULL,
  read_time text NOT NULL DEFAULT '2 min read',
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  course text NOT NULL,
  due_date timestamptz NOT NULL,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quick_actions table
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

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_actions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on events"
  ON events
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on news"
  ON news
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on assignments"
  ON assignments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on quick_actions"
  ON quick_actions
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS events_start_time_idx ON events(start_time);
CREATE INDEX IF NOT EXISTS events_category_idx ON events(category);
CREATE INDEX IF NOT EXISTS news_published_at_idx ON news(published_at);
CREATE INDEX IF NOT EXISTS news_category_idx ON news(category);
CREATE INDEX IF NOT EXISTS assignments_due_date_idx ON assignments(due_date);
CREATE INDEX IF NOT EXISTS assignments_priority_idx ON assignments(priority);
CREATE INDEX IF NOT EXISTS quick_actions_order_idx ON quick_actions(order_index);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quick_actions_updated_at BEFORE UPDATE ON quick_actions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();