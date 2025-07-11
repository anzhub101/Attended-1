
-- Clear existing events and insert new schedule data
DELETE FROM events WHERE category = 'academic';

-- Insert new schedule data
INSERT INTO events (title, subtitle, description, location, start_time, end_time, color, category) VALUES
('CSC303', 'Dr. Ahmed Hassan', 'Database Systems - Advanced SQL Queries', 'A-2F-13', '2025-07-07T05:00:00.000Z', '2025-07-07T06:45:00.000Z', '#4285F4', 'academic'),
('MTT205', 'Prof. Sarah Jamal', 'Linear Algebra', 'H1-11-A', '2025-07-07T11:00:00.000Z', '2025-07-07T12:40:00.000Z', '#DB4437', 'academic'),
('PHY201', 'Dr. Huma Zia', 'Physics II - Applications', 'D-0F-15', '2025-07-07T08:50:00.000Z', '2025-07-07T10:20:00.000Z', '#0F9D58', 'academic'),
('CSC303', 'Dr. Ahmed Hassan', 'Database Systems - Advanced SQL Queries', 'A-2F-13', '2025-07-09T05:00:00.000Z', '2025-07-09T06:45:00.000Z', '#4285F4', 'academic'),
('MTT205', 'Prof. Sarah Jamal', 'Linear Algebra', 'H1-11-A', '2025-07-09T11:00:00.000Z', '2025-07-09T12:40:00.000Z', '#DB4437', 'academic'),
('PHY201', 'Dr. Huma Zia', 'Physics II - Applications', 'D-0F-15', '2025-07-09T08:50:00.000Z', '2025-07-09T10:20:00.000Z', '#0F9D58', 'academic'),
('CEN320', 'Dr. Mary Jose', 'Signals and Systems', 'D-0F-12', '2025-07-08T12:55:00.000Z', '2025-07-08T14:20:00.000Z', '#F4B400', 'academic'),
('FWS310', 'Dr. Rubina Qureshi', 'Innovation Entrepreneurship', 'A-1F-02', '2025-07-08T07:00:00.000Z', '2025-07-08T08:45:00.000Z', '#9C27B0', 'academic'),
('CEN320', 'Dr. Mary Jose', 'Signals and Systems', 'D-0F-12', '2025-07-10T12:55:00.000Z', '2025-07-10T14:20:00.000Z', '#F4B400', 'academic'),
('FWS310', 'Dr. Rubina Qureshi', 'Innovation Entrepreneurship', 'A-1F-02', '2025-07-10T07:00:00.000Z', '2025-07-10T08:45:00.000Z', '#9C27B0', 'academic'),
('EEN320', 'Prof. Hamdan', 'Electric Circuits', 'Studio H101', '2025-07-11T05:00:00.000Z', '2025-07-11T06:40:00.000Z', '#FF5722', 'academic'),
('EEN320', 'Prof. Hamdan', 'Electric Circuits', 'Studio H101', '2025-07-11T06:50:00.000Z', '2025-07-11T08:30:00.000Z', '#607D8B', 'academic');