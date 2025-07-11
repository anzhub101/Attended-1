/*
  # Insert Sample Data

  1. Quick Actions
    - Dashboard quick action buttons

  2. News Articles
    - Sample news and announcements

  3. Campus Events
    - Sample campus-wide events

  4. Sample User Data
    - Test user profile, events, and assignments
*/

-- Insert Quick Actions
INSERT INTO quick_actions (title, icon, color, route, order_index) VALUES
('Grades', 'school', '#3B82F6', '/grades', 1),
('Library', 'library', '#10B981', '/library', 2),
('Dining', 'restaurant', '#F59E0B', '/dining', 3),
('Transport', 'bus', '#8B5CF6', '/transport', 4),
('Support', 'help-circle', '#EF4444', '/support', 5),
('Map', 'map', '#06B6D4', '/map', 6);

-- Insert News Articles
INSERT INTO news (title, description, content, image_url, category, author, read_time, published_at) VALUES
(
  'New Academic Year Registration Opens',
  'Registration for the upcoming academic year is now open. Students can register for courses through the student portal.',
  'The university is pleased to announce that course registration for the 2025-2026 academic year is now open. Students are encouraged to meet with their academic advisors before registering to ensure they are on track for graduation. The registration portal will be available 24/7 until the deadline.',
  'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
  'Academic',
  'Academic Affairs Office',
  '3 min read',
  now() - interval '1 day'
),
(
  'Campus Innovation Week 2025',
  'Join us for a week of innovation, technology showcases, and entrepreneurship workshops.',
  'Campus Innovation Week returns this year with exciting workshops, tech demonstrations, and networking opportunities. Students will have the chance to showcase their projects and connect with industry professionals.',
  'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
  'Events',
  'Innovation Center',
  '4 min read',
  now() - interval '2 days'
),
(
  'Library Extended Hours During Finals',
  'The university library will extend its operating hours during the final examination period.',
  'To support students during finals week, the library will be open 24/7 from December 10-17. Additional study spaces and computer labs will also be available.',
  'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
  'Academic',
  'Library Services',
  '2 min read',
  now() - interval '3 days'
),
(
  'New Student Wellness Center Opens',
  'The state-of-the-art wellness center is now open to all students with modern fitness equipment and wellness programs.',
  'The new 15,000 square foot wellness center features modern fitness equipment, group exercise studios, and wellness programs. All students can access the facility with their student ID.',
  'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
  'Campus Life',
  'Student Affairs',
  '3 min read',
  now() - interval '5 days'
);

-- Insert Campus Events
INSERT INTO campus_events (title, description, image_url, category, author, location, event_date, event_time, max_attendees, current_attendees) VALUES
(
  'Tech Innovation Showcase',
  'Annual showcase of student technology projects and innovations. Join us to see cutting-edge projects from computer science and engineering students.',
  'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
  'Academic',
  'Computer Science Department',
  'Engineering Building Auditorium',
  now() + interval '7 days',
  '2:00 PM',
  200,
  45
),
(
  'Career Fair 2025',
  'Meet with top employers and explore internship and job opportunities. Over 50 companies will be participating.',
  'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
  'Career',
  'Career Services',
  'Student Union Ballroom',
  now() + interval '14 days',
  '10:00 AM',
  500,
  123
),
(
  'International Food Festival',
  'Celebrate diversity with food from around the world. Student organizations will showcase their cultural cuisines.',
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
  'Social',
  'International Student Association',
  'Campus Quad',
  now() + interval '10 days',
  '12:00 PM',
  300,
  78
),
(
  'Research Symposium',
  'Undergraduate and graduate students present their research findings across all disciplines.',
  'https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
  'Academic',
  'Graduate School',
  'Science Building',
  now() + interval '21 days',
  '9:00 AM',
  150,
  32
),
(
  'Spring Sports Tournament',
  'Inter-college sports tournament featuring basketball, soccer, and volleyball competitions.',
  'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
  'Sports',
  'Athletics Department',
  'Sports Complex',
  now() + interval '28 days',
  '8:00 AM',
  400,
  156
);