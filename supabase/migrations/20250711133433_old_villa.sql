/*
  # Add Sample User Data for Testing

  This migration adds a sample user and their associated data for testing the multi-user system.
  In production, users would sign up through the app.
*/

-- Insert sample user profile (this would normally be created during sign-up)
-- Note: This assumes the auth user already exists with this ID
-- In a real scenario, users would sign up through Supabase Auth

-- Sample events for the user
INSERT INTO events (user_id, title, subtitle, description, location, start_time, end_time, color, category) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Computer Networks', 'Dr. Yameen', 'CEN75 Lecture', 'Room A007', '2025-01-20T09:00:00Z', '2025-01-20T10:30:00Z', '#4285F4', 'academic'),
  ('00000000-0000-0000-0000-000000000001', 'Networks Lab', 'Dr. Corie', 'CEN75 Lab Session', 'Lab A005', '2025-01-20T11:00:00Z', '2025-01-20T12:30:00Z', '#DB4437', 'academic'),
  ('00000000-0000-0000-0000-000000000001', 'Advanced Networks', 'Dr. Kelvin', 'CEN75 Advanced Topics', 'Room A006', '2025-01-22T11:00:00Z', '2025-01-22T12:30:00Z', '#0F9D58', 'academic')
ON CONFLICT (id) DO NOTHING;

-- Sample assignments for the user
INSERT INTO assignments (user_id, title, course, due_date, priority, description) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Network Protocol Analysis', 'CEN75', '2025-01-25T23:59:00Z', 'high', 'Analyze TCP/IP protocol behavior'),
  ('00000000-0000-0000-0000-000000000001', 'Database Design Project', 'CEN301', '2025-01-28T23:59:00Z', 'medium', 'Design a normalized database schema'),
  ('00000000-0000-0000-0000-000000000001', 'Software Engineering Report', 'CEN401', '2025-02-01T23:59:00Z', 'low', 'Write a requirements analysis report')
ON CONFLICT (id) DO NOTHING;

-- Note: For production use, remove this file and let users create their own data through the app