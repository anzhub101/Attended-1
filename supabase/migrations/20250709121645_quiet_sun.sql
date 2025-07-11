/*
  # Insert sample data for attended_app

  This migration populates the database with sample data for:
  1. Events (schedule data)
  2. News articles
  3. Assignments
  4. Quick actions

  All data is realistic and follows the app's requirements.
*/

-- Insert sample events (schedule data)
INSERT INTO events (title, subtitle, description, location, start_time, end_time, color, category) VALUES
('CSC303', 'Dr. Ahmed Hassan', 'Database Systems - Advanced SQL Queries', 'Room A101', '2025-07-07T09:00:00.000Z', '2025-07-07T10:45:00.000Z', '#4285F4', 'academic'),
('MAT201', 'Prof. Sarah Johnson', 'Calculus II - Integration Techniques', 'Room B205', '2025-07-07T11:30:00.000Z', '2025-07-07T13:00:00.000Z', '#DB4437', 'academic'),
('PHY301', 'Dr. Michael Chen', 'Quantum Physics - Wave Functions', 'Lab C301', '2025-07-07T15:00:00.000Z', '2025-07-07T16:30:00.000Z', '#0F9D58', 'academic'),
('ENG102', 'Ms. Emily Davis', 'Academic Writing - Research Methods', 'Room D102', '2025-07-08T09:00:00.000Z', '2025-07-08T10:30:00.000Z', '#F4B400', 'academic'),
('CSC401', 'Dr. Robert Kim', 'Software Engineering - Agile Methodologies', 'Room A203', '2025-07-08T11:00:00.000Z', '2025-07-08T12:45:00.000Z', '#9C27B0', 'academic'),
('BUS205', 'Prof. Lisa Anderson', 'Marketing Principles - Consumer Behavior', 'Room E105', '2025-07-08T14:00:00.000Z', '2025-07-08T15:30:00.000Z', '#FF5722', 'academic'),
('STA301', 'Dr. Amanda Rodriguez', 'Statistics - Probability Distributions', 'Room F301', '2025-07-08T16:00:00.000Z', '2025-07-08T17:30:00.000Z', '#607D8B', 'academic'),
('CHE201', 'Dr. James Wilson', 'Organic Chemistry - Reaction Mechanisms', 'Lab F201', '2025-07-09T09:00:00.000Z', '2025-07-09T10:45:00.000Z', '#795548', 'academic'),
('HIS301', 'Prof. Maria Garcia', 'World History - Industrial Revolution', 'Room G301', '2025-07-09T12:00:00.000Z', '2025-07-09T13:30:00.000Z', '#E91E63', 'academic'),
('ART101', 'Ms. Anna Thompson', 'Introduction to Fine Arts - Color Theory', 'Studio H101', '2025-07-09T15:00:00.000Z', '2025-07-09T16:45:00.000Z', '#3F51B5', 'academic'),
('PSY201', 'Dr. David Brown', 'General Psychology - Cognitive Processes', 'Room I201', '2025-07-10T09:30:00.000Z', '2025-07-10T11:00:00.000Z', '#009688', 'academic'),
('ECO301', 'Prof. Jennifer Lee', 'Macroeconomics - Fiscal Policy', 'Room J301', '2025-07-10T12:00:00.000Z', '2025-07-10T13:45:00.000Z', '#4CAF50', 'academic'),
('LAW201', 'Prof. Thomas Clark', 'Constitutional Law - Civil Rights', 'Room K201', '2025-07-10T15:00:00.000Z', '2025-07-10T16:30:00.000Z', '#FF9800', 'academic'),
('BIO201', 'Dr. Kevin Martinez', 'Cell Biology - Mitosis and Meiosis', 'Lab L201', '2025-07-11T14:00:00.000Z', '2025-07-11T15:45:00.000Z', '#673AB7', 'academic');

-- Insert sample news articles
INSERT INTO news (title, description, content, image_url, category, author, read_time, published_at) VALUES
('Are you ready to make a difference and have fun doing it?', 'The Student Engagement Office, in collaboration with BSF, invites you to an unforgettable Sustainability Event this Thursday, 22nd May 2025! Whether you are passionate about environmental conservation or just looking to learn more about sustainable practices...', 'Join us for an exciting sustainability event featuring workshops, exhibitions, and interactive sessions. Learn about renewable energy, waste reduction, and sustainable living practices. Network with like-minded students and faculty members while making a positive impact on our campus environment.', 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2', 'Campus Life', 'Student Engagement Office', '3 min read', now() - interval '1 day'),

('2025 Career Fair - Don''t wait for the Opportunity, Meet it!', 'With over 70 companies participating and hundreds of opportunities on offer, the 2025 Career Fair is the perfect place to explore internships, full-time roles and graduate programs. Connect with industry leaders and take the next step in your career journey.', 'The annual career fair brings together top employers from various industries including technology, finance, healthcare, and engineering. Prepare your resume, practice your elevator pitch, and dress professionally. This is your chance to make lasting connections and secure your future career.', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2', 'Career', 'Career Services', '5 min read', now() - interval '2 days'),

('Join the Academic Success Center! Summer (24-25)', 'The academic success center is organizing its famous ongoing programs for the upcoming semester - Summer 24-25. Follow the attached application link to apply for tutoring positions and peer mentoring roles.', 'Become a peer tutor and help fellow students excel in their academic journey. The Academic Success Center offers comprehensive training, flexible schedules, and competitive compensation. Applications are now open for mathematics, science, and language tutoring positions.', 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2', 'Academic', 'Academic Success Center', '4 min read', now() - interval '2 days'),

('New Library Digital Resources Available', 'The university library has expanded its digital collection with over 10,000 new e-books and research databases. Students now have access to premium academic resources from leading publishers.', 'Access thousands of academic journals, e-books, and research databases from anywhere on campus or remotely. The new collection includes resources in engineering, business, humanities, and sciences. Library staff will conduct training sessions on how to effectively use these new resources.', 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2', 'Academic', 'University Library', '2 min read', now() - interval '3 days'),

('Spring Sports Championships Begin Next Week', 'Get ready to cheer for our university teams as the spring sports championships kick off. Basketball, soccer, and tennis teams are all competing for regional titles.', 'Show your school spirit and support our athletic teams as they compete in the regional championships. Games will be held at the university sports complex with free admission for students. Check the athletics website for the complete schedule and team rosters.', 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2', 'Sports', 'Athletics Department', '3 min read', now() - interval '4 days');

-- Insert sample assignments
INSERT INTO assignments (title, course, due_date, priority, description) VALUES
('Math 101 Assignment', 'Calculus', now() + interval '1 day', 'high', 'Complete exercises 1-15 from Chapter 5 on Integration Techniques'),
('Physics Lab Report', 'Physics Lab', now() + interval '3 days', 'medium', 'Submit lab report on quantum mechanics experiment conducted last week'),
('Essay Submission', 'English Literature', now() + interval '5 days', 'low', 'Write a 2000-word essay analyzing themes in modern literature'),
('Database Project', 'Computer Science', now() + interval '1 week', 'high', 'Design and implement a relational database for a library management system'),
('Marketing Presentation', 'Business Studies', now() + interval '10 days', 'medium', 'Prepare a 15-minute presentation on digital marketing strategies');

-- Insert quick actions
INSERT INTO quick_actions (title, icon, color, route, order_index) VALUES
('View Grades', 'school', '#3B82F6', '/grades', 1),
('Library', 'library', '#10B981', '/library', 2),
('Student ID', 'card', '#F59E0B', '/student-id', 3),
('Campus Map', 'map', '#EF4444', '/campus-map', 4);