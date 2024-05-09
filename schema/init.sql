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
    phone VARCHAR(20) UNIQUE NOT NULL,
    role_id INTEGER NOT NULL REFERENCES roles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Create user_sessions table
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    access_token VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    access_token_expiration_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_school_id FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_school_id FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create images table
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    post_id INTEGER NOT NULL REFERENCES posts(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_post_id FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Create hashtags table
CREATE TABLE hashtags (
    id SERIAL PRIMARY KEY,
    tag VARCHAR(50) UNIQUE NOT NULL
);

-- Create posts_hashtags junction table (many-to-many relationship between posts and hashtags)
CREATE TABLE posts_hashtags (
    post_id INTEGER NOT NULL REFERENCES posts(id),
    hashtag_id INTEGER NOT NULL REFERENCES hashtags(id),
    placeholder_number INTEGER NOT NULL,
    CONSTRAINT fk_post_id FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_hashtag_id FOREIGN KEY (hashtag_id) REFERENCES hashtags(id) ON DELETE CASCADE,
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
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_post_id FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, post_id)
);

-- Create school_admins junction table (many-to-many relationship between users (schoolAdmins) and schools)
CREATE TABLE school_admins (
    user_id INTEGER NOT NULL REFERENCES users(id),
    school_id INTEGER NOT NULL REFERENCES schools(id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_school_id FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, school_id)
);

-- Create user_tags junction table (many-to-many relationship between users and comments)
CREATE TABLE user_tags (
    comment_id INTEGER NOT NULL REFERENCES comments(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    placeholder_number INTEGER NOT NULL,
    CONSTRAINT fk_comment_id FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (comment_id, user_id, placeholder_number)
);

-- Insert default roles
INSERT INTO roles (name) VALUES
('parent'),
('schoolAdmin'),
('superAdmin');

-- Insert dummy users data (parents and schoolAdmins)
INSERT INTO users (name, phone, role_id) VALUES
('Parent 1', '0901234888', 1),
('Parent 2', '0901234889', 1),
('Khang Nguyen', '0903999938', 1),
('SchoolAdmin 1', '0901234891', 2),
('SchoolAdmin 2', '0901234892', 2);

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
('Post 1', 'Content of post 1', 1, 4),
('Post 2', 'Content of post 2', 2, 5);

-- Insert dummy hashtags data
INSERT INTO hashtags (tag) VALUES
('tag1'),
('tag2'),
('tag3');

-- Insert dummy posts_hashtags data
INSERT INTO posts_hashtags (post_id, hashtag_id, placeholder_number) VALUES
(1, 1, 1),
(1, 2, 2),
(2, 2, 1),
(2, 3, 2);

-- Insert dummy images data
INSERT INTO images (url, post_id) VALUES
('image1.jpg', 1),
('image2.jpg', 2);

-- Insert dummy comments data
INSERT INTO comments (content, post_id, user_id) VALUES
('Comment 1', 1, 1),
('Comment 2', 2, 2);

-- Insert dummy toggle_likes data
INSERT INTO toggle_likes (user_id, post_id) VALUES
(1, 1),
(2, 1);

-- Insert dummy school_admins data
INSERT INTO school_admins (user_id, school_id) VALUES
(4, 1),
(5, 2);

-- Insert dummy user_tags data
INSERT INTO user_tags (comment_id, user_id, placeholder_number) VALUES
(1, 3, 1),
(2, 3, 1);
