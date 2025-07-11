/*
  # Create user_event_registrations table

  1. New Tables
    - `user_event_registrations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `event_id` (uuid, foreign key to campus_events)
      - `registered_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `user_event_registrations` table
    - Add policy for users to manage their own registrations
    - Add unique constraint to prevent duplicate registrations
*/

CREATE TABLE IF NOT EXISTS user_event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_id uuid REFERENCES campus_events(id) ON DELETE CASCADE NOT NULL,
  registered_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, event_id)
);

ALTER TABLE user_event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own event registrations"
  ON user_event_registrations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to update current_attendees count
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

-- Create triggers to automatically update attendee counts
CREATE TRIGGER update_attendees_on_registration
  AFTER INSERT ON user_event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_event_attendees();

CREATE TRIGGER update_attendees_on_unregistration
  AFTER DELETE ON user_event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_event_attendees();