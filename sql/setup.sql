DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS grams CASCADE;
DROP TABLE IF EXISTS comments;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  github_username TEXT NOT NULL UNIQUE,
  github_avatar_url TEXT NOT NULL
);

CREATE TABLE grams (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL REFERENCES users(github_username),
  photo_url TEXT NOT NULL,
  caption TEXT NOT NULL,
  tags TEXT []
);

CREATE TABLE comments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  comment_by TEXT NOT NULL REFERENCES users(github_username),
  gram BIGINT NOT NULL REFERENCES grams(id),
  comment TEXT NOT NULL
);

-- INSERT INTO comments (comment_by, gram, comment)
-- VALUES ('skunky', 1, 'laaadeeeflippindaaa');
