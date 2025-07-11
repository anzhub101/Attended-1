/*
  # Create quick_actions table

  1. New Tables
    - `quick_actions`
      - `id` (uuid, primary key)
      - `title` (text)
      - `icon` (text)
      - `color` (text)
      - `route` (text)
      - `order_index` (integer)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `quick_actions` table
    - Add policy for all authenticated users to read quick actions
*/

CREATE TABLE IF NOT EXISTS quick_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL,
  route text NOT NULL,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quick_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read quick actions"
  ON quick_actions
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE TRIGGER update_quick_actions_updated_at
  BEFORE UPDATE ON quick_actions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample quick actions data
INSERT INTO quick_actions (title, icon, color, route, order_index, is_active) VALUES
('Grades', 'school', '#3B82F6', '/grades', 1, true),
('Library', 'library', '#10B981', '/library', 2, true),
('Dining', 'restaurant', '#F59E0B', '/dining', 3, true),
('Transport', 'bus', '#8B5CF6', '/transport', 4, true),
('Map', 'map', '#EF4444', '/map', 5, true);