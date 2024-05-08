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


-- Create posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    school_id INTEGER NOT NULL REFERENCES schools(id),
    created_by INTEGER NOT NULL REFERENCES users(id),
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
    tag VARCHAR(50) UNIQUE NOT NULL
);

-- Create posts_hashtags table (many-to-many relationship between posts and hashtags)
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

-- Create toggle_likes table (many-to-many relationship between users and posts)
CREATE TABLE toggle_likes (
    user_id INTEGER NOT NULL REFERENCES users(id),
    post_id INTEGER NOT NULL REFERENCES posts(id),
    PRIMARY KEY (user_id, post_id)
);

-- Create school_admins table (many-to-many relationship between users and schools)
CREATE TABLE school_admins (
    user_id INTEGER NOT NULL REFERENCES users(id),
    school_id INTEGER NOT NULL REFERENCES schools(id),
    PRIMARY KEY (user_id, school_id)
);

-- Create user_tags table (many-to-many relationship between users and comments)
CREATE TABLE user_tags (
    comment_id INTEGER NOT NULL REFERENCES comments(id),
    tagged_user_id INTEGER NOT NULL REFERENCES users(id),
    PRIMARY KEY (comment_id, tagged_user_id)
);

-- Insert default roles
INSERT INTO roles (name) VALUES
('parent'),
('schoolAdmin'),
('superAdmin');

-- Insert dummy users data (parents and schoolAdmins)
INSERT INTO users (name, phone, role_id) VALUES
('Parent 1', '901234888', 1),
('Parent 2', '901234889', 1),
('Khang Nguyen', '903999938', 1),
('SchoolAdmin 1', '901234891', 2),
('SchoolAdmin 2', '901234892', 2);

-- Insert dummy schools data
INSERT INTO schools (name) VALUES
('School A'),
('School B'),
('School C');

-- Insert dummy school_admins data (linking schoolAdmins to schools)
INSERT INTO school_admins (user_id, school_id) VALUES
(4, 1), -- SchoolAdmin 1 belongs to School A
(5, 2); -- SchoolAdmin 2 belongs to School B

-- Insert dummy posts data (each schoolAdmin creates posts for their respective schools)
INSERT INTO posts (title, content, school_id, created_by) VALUES
('Post 1 by SchoolAdmin 1', 'Content of Post 1 by SchoolAdmin 1', 1, 4),
('Post 2 by SchoolAdmin 2', 'Content of Post 2 by SchoolAdmin 2', 2, 5);

-- Insert dummy images data (images associated with posts)
INSERT INTO images (url, post_id) VALUES
('image_url_1', 1), -- Image for Post 1
('image_url_2', 1), -- Another image for Post 1
('image_url_3', 2); -- Image for Post 2

-- Insert dummy hashtags data
INSERT INTO hashtags (tag) VALUES
('schoollife'),
('education'),
('fun');

-- Associate hashtags with posts
INSERT INTO posts_hashtags (post_id, hashtag_id) VALUES
(1, 1), -- Post 1 associated with hashtag 'schoollife'
(1, 2), -- Post 1 associated with hashtag 'education'
(2, 1), -- Post 2 associated with hashtag 'schoollife'
(2, 3); -- Post 2 associated with hashtag 'fun'

-- Insert dummy comments data (parents commenting on posts)
INSERT INTO comments (content, post_id, user_id) VALUES
('Comment by Parent 1 on Post 1', 1, 1),
('Comment by Parent 2 on Post 1', 1, 2),
('Comment by Khang Nguyen on Post 2', 2, 3);

-- Insert dummy toggle_likes data (parents liking posts)
INSERT INTO toggle_likes (user_id, post_id) VALUES
(1, 1), -- Parent 1 likes Post 1
(2, 1), -- Parent 2 likes Post 1
(3, 2); -- Parent 3 likes Post 2

-- Insert dummy user tags data (tagging users in comments)
INSERT INTO user_tags (comment_id, tagged_user_id) VALUES
(1, 3), -- Tagging Khang Nguyen in Comment 1
(2, 3); -- Tagging Khang Nguyen in Comment 2
