/*
  # Create news table

  1. New Tables
    - `news`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `content` (text)
      - `image_url` (text, optional)
      - `category` (text)
      - `author` (text)
      - `read_time` (text)
      - `published_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `news` table
    - Add policy for all authenticated users to read news
*/

CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  image_url text,
  category text DEFAULT 'general',
  author text NOT NULL,
  read_time text DEFAULT '2 min read',
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read news"
  ON news
  FOR SELECT
  TO authenticated
  USING (true);

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample news data
INSERT INTO news (title, description, content, image_url, category, author, read_time, published_at) VALUES
(
  'New Library Hours Extended',
  'The university library will now be open 24/7 during exam periods to support student learning.',
  'Starting this semester, the main library will extend its operating hours to 24/7 during midterm and final exam periods. This initiative aims to provide students with more flexible study spaces and access to resources when they need them most. The library administration has worked closely with security and facilities management to ensure a safe and conducive learning environment around the clock.',
  'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
  'Academic',
  'Library Administration',
  '2 min read',
  now()
),
(
  'Student Research Symposium 2025',
  'Annual research symposium showcasing outstanding undergraduate and graduate student projects.',
  'Join us for the annual Student Research Symposium where students from all disciplines will present their innovative research projects. This year features over 100 presentations across various fields including engineering, business, arts, and sciences. The event will be held over two days with keynote speakers from leading universities and industry professionals.',
  'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
  'Academic',
  'Research Office',
  '3 min read',
  now() - interval '1 day'
);