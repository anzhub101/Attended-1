/*
  # Seed Initial Data

  1. Insert sample data for all tables
  2. Migrate existing mock data to database
  3. Ensure data consistency and relationships
*/

-- Insert Quick Actions
INSERT INTO quick_actions (title, icon, color, route, order_index, is_active) VALUES
('Grades', 'school', '#3B82F6', '/grades', 1, true),
('Library', 'library', '#10B981', '/library', 2, true),
('Map', 'map', '#EF4444', '/map', 3, true),
('Dining', 'restaurant', '#F59E0B', '/dining', 4, true),
('Transport', 'bus', '#8B5CF6', '/transport', 5, true)
ON CONFLICT DO NOTHING;

-- Insert News Articles
INSERT INTO news (title, description, content, image_url, category, author, read_time, published_at, status) VALUES
(
  'New Library Hours Extended',
  'The university library will now be open 24/7 during exam periods to support student learning.',
  'Starting this semester, the main library will extend its operating hours to 24/7 during midterm and final exam periods. This initiative aims to provide students with more flexible study spaces and access to resources when they need them most. The extended hours will include full access to computer labs, study rooms, and research assistance.',
  'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
  'academic',
  'Library Administration',
  '2 min read',
  now(),
  'published'
),
(
  'Student Research Symposium 2025',
  'Annual research symposium showcasing outstanding undergraduate and graduate student projects.',
  'Join us for the annual Student Research Symposium where students from all disciplines will present their innovative research projects. This year features over 100 presentations across various fields including engineering, business, sciences, and humanities. The event will take place over three days with keynote speakers from industry and academia.',
  'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
  'academic',
  'Research Office',
  '3 min read',
  now() - interval '1 day',
  'published'
),
(
  'New Campus Recreation Center Opens',
  'State-of-the-art fitness facility now available to all students with modern equipment and classes.',
  'The new Campus Recreation Center is now open to all students, faculty, and staff. The 50,000 square foot facility features modern cardio and weight equipment, group fitness studios, an indoor track, and a climbing wall. Free fitness classes are offered throughout the week including yoga, pilates, and high-intensity interval training.',
  'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
  'general',
  'Campus Recreation',
  '2 min read',
  now() - interval '2 days',
  'published'
)
ON CONFLICT DO NOTHING;

-- Insert Campus Events
INSERT INTO campus_events (title, description, image_url, category, author, location, event_date, event_time, max_attendees, current_attendees) VALUES
(
  'Welcome Week Orientation',
  'Join us for an exciting week of activities designed to welcome new students to campus life.',
  'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
  'social',
  'Student Affairs',
  'Main Auditorium',
  current_date + interval '7 days',
  '10:00 AM',
  500,
  234
),
(
  'Career Fair 2025',
  'Meet with top employers and explore career opportunities across various industries.',
  'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
  'career',
  'Career Services',
  'Student Center',
  current_date + interval '14 days',
  '9:00 AM',
  1000,
  567
),
(
  'Tech Innovation Workshop',
  'Learn about the latest trends in technology and innovation from industry experts.',
  'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
  'workshop',
  'Engineering Department',
  'Engineering Building',
  current_date + interval '21 days',
  '2:00 PM',
  100,
  78
),
(
  'Spring Sports Tournament',
  'Annual inter-departmental sports competition featuring basketball, soccer, and volleyball.',
  'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
  'sports',
  'Athletics Department',
  'Sports Complex',
  current_date + interval '28 days',
  '1:00 PM',
  300,
  156
),
(
  'Cultural Heritage Festival',
  'Celebrate diversity with food, music, and performances from different cultures.',
  'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
  'social',
  'International Student Office',
  'Campus Quad',
  current_date + interval '35 days',
  '11:00 AM',
  800,
  423
)
ON CONFLICT DO NOTHING;

-- Insert Sample Tutors
INSERT INTO tutors (name, student_id, year, major, profile_image, bio, subjects, available_times, rating, total_sessions, email, phone, user_id) VALUES
(
  'Sarah Ahmed',
  '1092345',
  '4th Year',
  'Computer Engineering',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  'Passionate about helping students excel in programming and mathematics. I have 3 years of tutoring experience and specialize in making complex concepts easy to understand.',
  ARRAY['CSC303', 'CSC202', 'MTT205', 'CSC101'],
  ARRAY['Mon 2-4 PM', 'Wed 10-12 PM', 'Fri 3-5 PM'],
  4.8,
  45,
  '1092345@adu.ac.ae',
  '+971 50 123 4567',
  gen_random_uuid()
),
(
  'Ahmed Hassan',
  '1091234',
  '3rd Year',
  'Electrical Engineering',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  'Engineering student with strong foundation in physics and mathematics. I enjoy breaking down complex problems into simple steps.',
  ARRAY['PHY201', 'MTT205', 'EEN320', 'MTT101'],
  ARRAY['Tue 1-3 PM', 'Thu 11-1 PM', 'Sat 9-11 AM'],
  4.5,
  32,
  '1091234@adu.ac.ae',
  NULL,
  gen_random_uuid()
),
(
  'Fatima Al-Zahra',
  '1093456',
  '4th Year',
  'Business Administration',
  'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  'Business major with expertise in economics, statistics, and business fundamentals. I love helping students understand real-world applications.',
  ARRAY['BUS101', 'ECO201', 'STA205', 'MGT301'],
  ARRAY['Mon 10-12 PM', 'Wed 2-4 PM', 'Thu 3-5 PM'],
  4.9,
  58,
  '1093456@adu.ac.ae',
  '+971 55 987 6543',
  gen_random_uuid()
),
(
  'Omar Khalil',
  '1094567',
  '3rd Year',
  'Mechanical Engineering',
  'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  'Mechanical engineering student passionate about physics and engineering design. I focus on practical problem-solving approaches.',
  ARRAY['PHY201', 'ENG201', 'MEC301', 'MTT205'],
  ARRAY['Tue 9-11 AM', 'Thu 2-4 PM', 'Fri 1-3 PM'],
  4.3,
  28,
  '1094567@adu.ac.ae',
  NULL,
  gen_random_uuid()
),
(
  'Layla Mohammed',
  '1095678',
  '4th Year',
  'Computer Science',
  'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  'Computer Science senior with strong programming skills. I specialize in algorithms, data structures, and software development.',
  ARRAY['CSC303', 'CSC401', 'CSC202', 'CSC350'],
  ARRAY['Mon 3-5 PM', 'Wed 1-3 PM', 'Fri 10-12 PM'],
  4.7,
  41,
  '1095678@adu.ac.ae',
  '+971 52 456 7890',
  gen_random_uuid()
)
ON CONFLICT DO NOTHING;