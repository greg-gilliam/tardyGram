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

INSERT INTO users (github_username, github_avatar_url)
VALUES('gay', 'http://gayjeans.com/image.png'), ('queerdo', 'http://queercountry.com/image.png');

INSERT INTO grams (username, photo_url, caption, tags)
VALUES ('gay', 'http://jodee.messina/image.png', 'ive got a quarter', '{heads, greyhound, carolina}'), ('queerdo', 'http://dolly.parton/image.png', 'highlight of my low life', '{jolene, low life}');

INSERT INTO comments (comment_by, gram, comment)
VALUES ('queerdo', 1, 'thats not a quarter'), ('queerdo', 1, 'ewwwww'), ('gay', 2, 'dolly <3 jolene 4eva');