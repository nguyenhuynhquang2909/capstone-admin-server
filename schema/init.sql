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
    -- CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Create user_sessions table
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    access_token TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    access_token_expiration_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    -- CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    -- CONSTRAINT fk_school_id FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    -- CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    -- CONSTRAINT fk_school_id FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    -- CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create images table
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    post_id INTEGER NOT NULL REFERENCES posts(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    -- CONSTRAINT fk_post_id FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Create hashtags table
CREATE TABLE hashtags (
    id SERIAL PRIMARY KEY,
    tag VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create posts_hashtags junction table (many-to-many relationship between posts and hashtags)
CREATE TABLE posts_hashtags (
    post_id INTEGER NOT NULL REFERENCES posts(id),
    hashtag_id INTEGER NOT NULL REFERENCES hashtags(id),
    placeholder_number INTEGER NOT NULL,
    -- CONSTRAINT fk_post_id FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    -- CONSTRAINT fk_hashtag_id FOREIGN KEY (hashtag_id) REFERENCES hashtags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, hashtag_id, placeholder_number)
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

-- Create toggle_likes junction table (many-to-many relationship between users and posts)
CREATE TABLE toggle_likes (
    user_id INTEGER NOT NULL REFERENCES users(id),
    post_id INTEGER NOT NULL REFERENCES posts(id),
    -- CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    -- CONSTRAINT fk_post_id FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, post_id)
);

-- Create school_admins junction table (many-to-many relationship between users (schoolAdmins) and schools)
CREATE TABLE school_admins (
    user_id INTEGER NOT NULL REFERENCES users(id),
    school_id INTEGER NOT NULL REFERENCES schools(id),
    -- CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    -- CONSTRAINT fk_school_id FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, school_id)
);

-- Create user_tags junction table (many-to-many relationship between users and comments)
CREATE TABLE user_tags (
    comment_id INTEGER NOT NULL REFERENCES comments(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    placeholder_number INTEGER NOT NULL,
    -- CONSTRAINT fk_comment_id FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    -- CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (comment_id, user_id, placeholder_number)
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
INSERT INTO students (name, school_id, user_id) VALUES
('Student 1', 1, 1),
('Student 2', 1, 2),
('Student 3', 2, 3);

-- Insert dummy posts data
INSERT INTO posts (title, content, school_id, user_id) VALUES
('News Bulletin: Field Trip to the Zoo', 'Our students had an amazing time exploring the zoo and learning about various animals!', 1, 4),
('Science Fair Success!', 'Congratulations to all the young scientists who participated in our school science fair. Were proud of your hard work and creativity!', 2, 5),
('Math Challenge: Who Will Be the Champion?', 'Get ready for an exciting math challenge! Sharpen your pencils and put on your thinking caps. Let the competition begin!', 1, 4),
('Art Showcase: Unleash Your Creativity', 'Calling all budding artists! Showcase your talent in our school art exhibit. Let your imagination run wild!', 2, 5),
('Community Service Day: Making a Difference Together', 'Join us for a day of giving back to our community. Together, we can make a positive impact!', 1, 4),
('Parent-Teacher Conference Reminder', 'Dont forget to schedule your parent-teacher conference. Its a valuable opportunity to discuss your childs progress and goals.', 2, 5),
('Healthy Eating Habits: Fueling Young Minds', 'Learn about the importance of nutrition for growing children and discover delicious and nutritious snack ideas.', 1, 4),
('Outdoor Adventure Day: Exploring Nature', 'Get ready for a day of outdoor exploration! From nature walks to scavenger hunts, adventure awaits!', 2, 5),
('Book Fair Bonanza: Dive into a World of Stories', 'Browse through a wide selection of books at our annual book fair. Discover new adventures and fuel your love for reading!', 1, 4),
('Safety First: Tips for Staying Safe at School', 'Review essential safety tips with your child, from crossing the street to stranger danger. Together, we can create a safe environment for everyone.', 2, 5),
('Cultural Diversity Celebration: Embracing Differences', 'Celebrate the rich tapestry of cultures within our school community. Join us for a day of cultural performances, food, and fun!', 1, 4),
('Music Mania: Finding Your Rhythm', 'Explore the world of music through hands-on activities and interactive workshops. Discover your passion for rhythm and melody!', 2, 5),
('Gardening Club: Growing Green Thumbs', 'Join our gardening club and cultivate a love for nature. Learn about plants, sustainability, and the joy of growing your own food!', 1, 4),
('Fitness Fun Day: Get Moving and Stay Active', 'Get ready to jump, run, and play! Join us for a day of fitness activities designed to promote health and wellness.', 2, 5);

-- Insert dummy hashtags data
INSERT INTO hashtags (tag) VALUES
('tag1'),
('tag2'),
('tag3');

-- Insert dummy school_admins data
INSERT INTO school_admins (user_id, school_id) VALUES
(4, 1),
(5, 2);
