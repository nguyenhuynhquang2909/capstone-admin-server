-- Create roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role_id INTEGER NOT NULL REFERENCES roles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create device_tokens table
CREATE TABLE device_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    device_type VARCHAR(255) NOT NULL,
    token TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create user_sessions table
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    access_token TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    access_token_expiration_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create schools table
CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    parent_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create teachers table
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create classes table
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    teacher_id INTEGER NOT NULL REFERENCES teachers(id),
    school_id INTEGER NOT NULL REFERENCES schools(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create daily_schedules table
CREATE TABLE daily_schedules (
    id SERIAL PRIMARY KEY,
    class_id INTEGER NOT NULL REFERENCES classes(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    subject VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create eating_schedules table
CREATE TABLE eating_schedules (
    id SERIAL PRIMARY KEY,
    class_id INTEGER NOT NULL REFERENCES classes(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    meal VARCHAR(255) NOT NULL,
    menu TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create class_students junction table
CREATE TABLE class_students (
    class_id INTEGER NOT NULL REFERENCES classes(id),
    student_id INTEGER NOT NULL REFERENCES students(id),
    PRIMARY KEY (class_id, student_id)
);

-- Create absence junction table
CREATE TABLE absence (
    student_id INTEGER NOT NULL REFERENCES students(id),
    class_id INTEGER NOT NULL REFERENCES classes(id),
    absence_status VARCHAR(255) NOT NULL,
    absence_type VARCHAR(255) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    PRIMARY KEY (student_id, class_id, daily_schedule_id)
);

-- Create posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    created_by INTEGER NOT NULL REFERENCES users(id),
    status VARCHAR(50) NOT NULL,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create images table
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    post_id INTEGER NOT NULL REFERENCES posts(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create hashtags table
CREATE TABLE hashtags (
    id SERIAL PRIMARY KEY,
    tag VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create posts_hashtags junction table
CREATE TABLE posts_hashtags (
    post_id INTEGER NOT NULL REFERENCES posts(id),
    hashtag_id INTEGER NOT NULL REFERENCES hashtags(id),
    PRIMARY KEY (post_id, hashtag_id)
);

-- Create comments table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    post_id INTEGER NOT NULL REFERENCES posts(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create toggle_likes junction table
CREATE TABLE toggle_likes (
    user_id INTEGER NOT NULL REFERENCES users(id),
    post_id INTEGER NOT NULL REFERENCES posts(id),
    PRIMARY KEY (user_id, post_id)
);

-- Create school_admins junction table
CREATE TABLE school_admins (
    user_id INTEGER NOT NULL REFERENCES users(id),
    school_id INTEGER NOT NULL REFERENCES schools(id),
    PRIMARY KEY (user_id, school_id)
);

-- Create user_tags junction table
CREATE TABLE user_tags (
    comment_id INTEGER NOT NULL REFERENCES comments(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    PRIMARY KEY (comment_id, user_id)
);

-- Create notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO roles (name) VALUES
('parent'),
('schoolAdmin'),
('superAdmin');

-- Insert dummy users data (parents and schoolAdmins)
INSERT INTO users (name, phone, email, password, role_id) VALUES
('Parent 1', '0901234888', NULL, NULL, 1),
('Parent 2', '0901234889', NULL, NULL, 1),
('Khang Nguyen', '0903999938', NULL, NULL, 1),
('SchoolAdmin 1', NULL, 'admin1@gmail.com', '123', 2),
('SchoolAdmin 2', NULL, 'admin2@gmail.com', '456', 2);

-- Insert dummy schools data
INSERT INTO schools (name) VALUES
('School 1'),
('School 2');

-- Insert dummy students data
INSERT INTO students (name, school_id, parent_id) VALUES
('Student 1', 1, 1),
('Student 2', 1, 2),
('Student 3', 2, 3);

-- Insert dummy teachers data
INSERT INTO teachers (name, school_id) VALUES
('Teacher 1', 1),
('Teacher 2', 2);

-- Insert dummy classes data
INSERT INTO classes (name, teacher_id, school_id) VALUES
('Class 1A', 1, 1),
('Class 2B', 2, 2);

-- Insert dummy class_students data
INSERT INTO class_students (class_id, student_id) VALUES
(1, 1),
(1, 2),
(2, 3);

-- Insert dummy daily_schedules data
INSERT INTO daily_schedules (class_id, start_time, end_time, subject) VALUES
(1, '2024-06-24 07:50:00', '2024-06-24 08:00:00', 'Tập thể dục/Morning Exercise'),
(1, '2024-06-24 08:30:00', '2024-06-24 09:00:00', 'English'),
(1, '2024-06-24 09:00:00', '2024-06-24 09:30:00', 'Interactive Learning'),
(1, '2024-06-24 09:30:00', '2024-06-24 10:00:00', 'English Review'),
(1, '2024-06-24 10:00:00', '2024-06-24 10:30:00', 'Hoạt động SN/Vui chơi'),
(1, '2024-06-24 14:00:00', '2024-06-24 14:30:00', 'Phát triển nhận thức/Cognitive Development'),
(1, '2024-06-24 15:00:00', '2024-06-24 15:30:00', 'Bơi lội/Swimming'),
(1, '2024-06-24 15:30:00', '2024-06-24 16:00:00', 'Xem phim/Movie'),
(1, '2024-06-24 16:00:00', '2024-06-24 16:30:00', 'Hoạt động vui chơi/Physical Activities'),
(1, '2024-06-25 07:50:00', '2024-06-25 08:00:00', 'Tập thể dục/Morning Exercise'),
(1, '2024-06-25 08:30:00', '2024-06-25 09:00:00', 'English'),
(1, '2024-06-25 09:00:00', '2024-06-25 09:30:00', 'Interactive Learning'),
(1, '2024-06-25 09:30:00', '2024-06-25 10:00:00', 'English Review'),
(1, '2024-06-25 10:00:00', '2024-06-25 10:30:00', 'Hoạt động SN/Vui chơi'),
(1, '2024-06-25 14:00:00', '2024-06-25 14:30:00', 'Phát triển nhận thức/Cognitive Development'),
(1, '2024-06-25 15:00:00', '2024-06-25 15:30:00', 'Bơi lội/Swimming'),
(1, '2024-06-25 15:30:00', '2024-06-25 16:00:00', 'Xem phim/Movie'),
(1, '2024-06-25 16:00:00', '2024-06-25 16:30:00', 'Hoạt động vui chơi/Physical Activities'),
(1, '2024-06-26 07:50:00', '2024-06-26 08:00:00', 'Tập thể dục/Morning Exercise'),
(1, '2024-06-26 08:30:00', '2024-06-26 09:00:00', 'English'),
(1, '2024-06-26 09:00:00', '2024-06-26 09:30:00', 'Interactive Learning'),
(1, '2024-06-26 09:30:00', '2024-06-26 10:00:00', 'English Review'),
(1, '2024-06-26 10:00:00', '2024-06-26 10:30:00', 'Hoạt động SN/Vui chơi'),
(1, '2024-06-26 14:00:00', '2024-06-26 14:30:00', 'Phát triển nhận thức/Cognitive Development'),
(1, '2024-06-26 15:00:00', '2024-06-26 15:30:00', 'Bơi lội/Swimming'),
(1, '2024-06-26 15:30:00', '2024-06-26 16:00:00', 'Xem phim/Movie'),
(1, '2024-06-26 16:00:00', '2024-06-26 16:30:00', 'Hoạt động vui chơi/Physical Activities'),
(1, '2024-06-27 07:50:00', '2024-06-27 08:00:00', 'Tập thể dục/Morning Exercise'),
(1, '2024-06-27 08:30:00', '2024-06-27 09:00:00', 'English'),
(1, '2024-06-27 09:00:00', '2024-06-27 09:30:00', 'Interactive Learning'),
(1, '2024-06-27 09:30:00', '2024-06-27 10:00:00', 'English Review'),
(1, '2024-06-27 10:00:00', '2024-06-27 10:30:00', 'Hoạt động SN/Vui chơi'),
(1, '2024-06-27 14:00:00', '2024-06-27 14:30:00', 'Phát triển nhận thức/Cognitive Development'),
(1, '2024-06-27 15:00:00', '2024-06-27 15:30:00', 'Bơi lội/Swimming'),
(1, '2024-06-27 15:30:00', '2024-06-27 16:00:00', 'Xem phim/Movie'),
(1, '2024-06-27 16:00:00', '2024-06-27 16:30:00', 'Hoạt động vui chơi/Physical Activities'),
(1, '2024-06-28 07:50:00', '2024-06-28 08:00:00', 'Tập thể dục/Morning Exercise'),
(1, '2024-06-28 08:30:00', '2024-06-28 09:00:00', 'English'),
(1, '2024-06-28 09:00:00', '2024-06-28 09:30:00', 'Interactive Learning'),
(1, '2024-06-28 09:30:00', '2024-06-28 10:00:00', 'English Review'),
(1, '2024-06-28 10:00:00', '2024-06-28 10:30:00', 'Hoạt động SN/Vui chơi'),
(1, '2024-06-28 14:00:00', '2024-06-28 14:30:00', 'Phát triển nhận thức/Cognitive Development'),
(1, '2024-06-28 15:00:00', '2024-06-28 15:30:00', 'Bơi lội/Swimming'),
(1, '2024-06-28 15:30:00', '2024-06-28 16:00:00', 'Xem phim/Movie'),
(1, '2024-06-28 16:00:00', '2024-06-28 16:30:00', 'Hoạt động vui chơi/Physical Activities');

INSERT INTO daily_schedules (class_id, start_time, end_time, subject) VALUES
(2, '2024-06-24 07:50:00', '2024-06-24 08:00:00', 'Tập thể dục/Morning Exercise'),
(2, '2024-06-24 08:30:00', '2024-06-24 09:00:00', 'English'),
(2, '2024-06-24 09:00:00', '2024-06-24 09:30:00', 'Interactive Learning'),
(2, '2024-06-24 09:30:00', '2024-06-24 10:00:00', 'English Review'),
(2, '2024-06-24 10:00:00', '2024-06-24 10:30:00', 'Hoạt động SN/Vui chơi'),
(2, '2024-06-24 14:00:00', '2024-06-24 14:30:00', 'Phát triển nhận thức/Cognitive Development'),
(2, '2024-06-24 15:00:00', '2024-06-24 15:30:00', 'Bơi lội/Swimming'),
(2, '2024-06-24 15:30:00', '2024-06-24 16:00:00', 'Xem phim/Movie'),
(2, '2024-06-24 16:00:00', '2024-06-24 16:30:00', 'Hoạt động vui chơi/Physical Activities'),
(2, '2024-06-25 07:50:00', '2024-06-25 08:00:00', 'Tập thể dục/Morning Exercise'),
(2, '2024-06-25 08:30:00', '2024-06-25 09:00:00', 'English'),
(2, '2024-06-25 09:00:00', '2024-06-25 09:30:00', 'Interactive Learning'),
(2, '2024-06-25 09:30:00', '2024-06-25 10:00:00', 'English Review'),
(2, '2024-06-25 10:00:00', '2024-06-25 10:30:00', 'Hoạt động SN/Vui chơi'),
(2, '2024-06-25 14:00:00', '2024-06-25 14:30:00', 'Phát triển nhận thức/Cognitive Development'),
(2, '2024-06-25 15:00:00', '2024-06-25 15:30:00', 'Bơi lội/Swimming'),
(2, '2024-06-25 15:30:00', '2024-06-25 16:00:00', 'Xem phim/Movie'),
(2, '2024-06-25 16:00:00', '2024-06-25 16:30:00', 'Hoạt động vui chơi/Physical Activities'),
(2, '2024-06-26 07:50:00', '2024-06-26 08:00:00', 'Tập thể dục/Morning Exercise'),
(2, '2024-06-26 08:30:00', '2024-06-26 09:00:00', 'English'),
(2, '2024-06-26 09:00:00', '2024-06-26 09:30:00', 'Interactive Learning'),
(2, '2024-06-26 09:30:00', '2024-06-26 10:00:00', 'English Review'),
(2, '2024-06-26 10:00:00', '2024-06-26 10:30:00', 'Hoạt động SN/Vui chơi'),
(2, '2024-06-26 14:00:00', '2024-06-26 14:30:00', 'Phát triển nhận thức/Cognitive Development'),
(2, '2024-06-26 15:00:00', '2024-06-26 15:30:00', 'Bơi lội/Swimming'),
(2, '2024-06-26 15:30:00', '2024-06-26 16:00:00', 'Xem phim/Movie'),
(2, '2024-06-26 16:00:00', '2024-06-26 16:30:00', 'Hoạt động vui chơi/Physical Activities'),
(2, '2024-06-27 07:50:00', '2024-06-27 08:00:00', 'Tập thể dục/Morning Exercise'),
(2, '2024-06-27 08:30:00', '2024-06-27 09:00:00', 'English'),
(2, '2024-06-27 09:00:00', '2024-06-27 09:30:00', 'Interactive Learning'),
(2, '2024-06-27 09:30:00', '2024-06-27 10:00:00', 'English Review'),
(2, '2024-06-27 10:00:00', '2024-06-27 10:30:00', 'Hoạt động SN/Vui chơi'),
(2, '2024-06-27 14:00:00', '2024-06-27 14:30:00', 'Phát triển nhận thức/Cognitive Development'),
(2, '2024-06-27 15:00:00', '2024-06-27 15:30:00', 'Bơi lội/Swimming'),
(2, '2024-06-27 15:30:00', '2024-06-27 16:00:00', 'Xem phim/Movie'),
(2, '2024-06-27 16:00:00', '2024-06-27 16:30:00', 'Hoạt động vui chơi/Physical Activities'),
(2, '2024-06-28 07:50:00', '2024-06-28 08:00:00', 'Tập thể dục/Morning Exercise'),
(2, '2024-06-28 08:30:00', '2024-06-28 09:00:00', 'English'),
(2, '2024-06-28 09:00:00', '2024-06-28 09:30:00', 'Interactive Learning'),
(2, '2024-06-28 09:30:00', '2024-06-28 10:00:00', 'English Review'),
(2, '2024-06-28 10:00:00', '2024-06-28 10:30:00', 'Hoạt động SN/Vui chơi'),
(2, '2024-06-28 14:00:00', '2024-06-28 14:30:00', 'Phát triển nhận thức/Cognitive Development'),
(2, '2024-06-28 15:00:00', '2024-06-28 15:30:00', 'Bơi lội/Swimming'),
(2, '2024-06-28 15:30:00', '2024-06-28 16:00:00', 'Xem phim/Movie'),
(2, '2024-06-28 16:00:00', '2024-06-28 16:30:00', 'Hoạt động vui chơi/Physical Activities');

-- Insert dummy eating_schedules data
INSERT INTO eating_schedules (class_id, start_time, end_time, meal, menu) VALUES
(1, '2024-06-24 08:00:00', '2024-06-24 08:30:00', 'Ăn sáng - Breakfast', 'Thịt bò - Steak'), -- Monday
(1, '2024-06-24 10:30:00', '2024-06-24 11:30:00', 'Ăn trưa - Lunch', 'Thịt heo - Pork'),
(1, '2024-06-24 14:30:00', '2024-06-24 15:00:00', 'Ăn xế - Snack', 'Thịt cừu - Lamb'),
(1, '2024-06-25 08:00:00', '2024-06-25 08:30:00', 'Ăn sáng - Breakfast', 'Thịt bò - Steak'),
(1, '2024-06-25 10:30:00', '2024-06-25 11:30:00', 'Ăn trưa - Lunch', 'Thịt heo - Pork'),
(1, '2024-06-25 14:30:00', '2024-06-25 15:00:00', 'Ăn xế - Snack', 'Thịt cừu - Lamb'),
(1, '2024-06-26 08:00:00', '2024-06-26 08:30:00', 'Ăn sáng - Breakfast', 'Thịt bò - Steak'),
(1, '2024-06-26 10:30:00', '2024-06-26 11:30:00', 'Ăn trưa - Lunch', 'Thịt heo - Pork'),
(1, '2024-06-26 14:30:00', '2024-06-26 15:00:00', 'Ăn xế - Snack', 'Thịt cừu - Lamb'),
(1, '2024-06-27 08:00:00', '2024-06-27 08:30:00', 'Ăn sáng - Breakfast', 'Thịt bò - Steak'),
(1, '2024-06-27 10:30:00', '2024-06-27 11:30:00', 'Ăn trưa - Lunch', 'Thịt heo - Pork'),
(1, '2024-06-27 14:30:00', '2024-06-27 15:00:00', 'Ăn xế - Snack', 'Thịt cừu - Lamb'),
(1, '2024-06-28 08:00:00', '2024-06-28 08:30:00', 'Ăn sáng - Breakfast', 'Thịt bò - Steak'),
(1, '2024-06-28 10:30:00', '2024-06-28 11:30:00', 'Ăn trưa - Lunch', 'Thịt heo - Pork'),
(1, '2024-06-28 14:30:00', '2024-06-28 15:00:00', 'Ăn xế - Snack', 'Thịt cừu - Lamb');

-- Insert dummy absence data
INSERT INTO absence (student_id, class_id, daily_schedule_id, absence_status,absence_type,reason, start_time, end_time) VALUES
(1, 1, 'Absent','Health Issue', 'Sick', '2024-07-01 08:00:00', '2024-07-01 10:00:00' ),
(3, 2, 'Absent','Family Leave','Family Emergency', '2024-07-02 09:00:00.000', '2024-07-02 11:00:00.000');

-- Insert dummy posts data
INSERT INTO posts (title, content, school_id, created_by, status) VALUES
('News Bulletin: Field Trip to the Zoo', 'Our students had an amazing time exploring the zoo and learning about various animals!', 1, 4, 'published'),
('Science Fair Success!', 'Congratulations to all the young scientists who participated in our school science fair. Were proud of your hard work and creativity!', 2, 5, 'draft'),
('Math Challenge: Who Will Be the Champion?', 'Get ready for an exciting math challenge!

 Sharpen your pencils and put on your thinking caps. Let the competition begin!', 1, 4, 'draft'),
('Art Showcase: Unleash Your Creativity', 'Calling all budding artists! Showcase your talent in our school art exhibit. Let your imagination run wild!', 2, 5, 'published'),
('Community Service Day: Making a Difference Together', 'Join us for a day of giving back to our community. Together, we can make a positive impact!', 1, 4, 'published'),
('Parent-Teacher Conference Reminder', 'Dont forget to schedule your parent-teacher conference. Its a valuable opportunity to discuss your childs progress and goals.', 2, 5, 'draft'),
('Healthy Eating Habits: Fueling Young Minds', 'Learn about the importance of nutrition for growing children and discover delicious and nutritious snack ideas.', 1, 4, 'published'),
('Outdoor Adventure Day: Exploring Nature', 'Get ready for a day of outdoor exploration! From nature walks to scavenger hunts, adventure awaits!', 2, 5, 'published'),
('Book Fair Bonanza: Dive into a World of Stories', 'Browse through a wide selection of books at our annual book fair. Discover new adventures and fuel your love for reading!', 1, 4, 'draft'),
('Safety First: Tips for Staying Safe at School', 'Review essential safety tips with your child, from crossing the street to stranger danger. Together, we can create a safe environment for everyone.', 2, 5, 'draft'),
('Cultural Diversity Celebration: Embracing Differences', 'Celebrate the rich tapestry of cultures within our school community. Join us for a day of cultural performances, food, and fun!', 1, 4, 'published'),
('Music Mania: Finding Your Rhythm', 'Explore the world of music through hands-on activities and interactive workshops. Discover your passion for rhythm and melody!', 2, 5, 'draft'),
('Gardening Club: Growing Green Thumbs', 'Join our gardening club and cultivate a love for nature. Learn about plants, sustainability, and the joy of growing your own food!', 1, 4, 'draft'),
('Fitness Fun Day: Get Moving and Stay Active', 'Get ready to jump, run, and play! Join us for a day of fitness activities designed to promote health and wellness.', 2, 5, 'published');

-- Insert dummy hashtags data
INSERT INTO hashtags (tag) VALUES
('tag1'),
('tag2'),
('tag3');

-- Insert dummy school_admins data
INSERT INTO school_admins (user_id, school_id) VALUES
(4, 1),
(5, 2);
