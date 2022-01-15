CREATE TABLE albums (
  album_id int UNSIGNED NOT NULL,
  album_name varchar(255) NOT NULL,
  album_cover varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  album_description text CHARACTER SET utf8 COLLATE utf8_general_ci,
  album_date datetime DEFAULT CURRENT_TIMESTAMP,
  user_id int UNSIGNED NOT NULL
);

CREATE TABLE comments (
  comment_id int UNSIGNED NOT NULL,
  post_id int UNSIGNED NOT NULL,
  user_id int UNSIGNED NOT NULL,
  comment_content varchar(1000) NOT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatet_at datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE comments_likes (
  comments_likes_id int UNSIGNED NOT NULL,
  user_id int UNSIGNED NOT NULL,
  comment_id int UNSIGNED NOT NULL
);

CREATE TABLE files (
  file_id int UNSIGNED NOT NULL,
  album_id int UNSIGNED NOT NULL,
  file_url varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  file_type varchar(255) NOT NULL,
  thumb_url varchar(255) DEFAULT NULL,
  created_at datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE feedback (
  id int NOT NULL,
  user_id int UNSIGNED NOT NULL,
  subject varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  message varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  name varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  contact varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  email varchar(255) NOT NULL,
  date_created datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `following` (
  following_id int UNSIGNED NOT NULL,
  user_id int UNSIGNED NOT NULL
);

CREATE TABLE likes (
  like_id int UNSIGNED NOT NULL,
  user_id int UNSIGNED NOT NULL,
  post_id int UNSIGNED NOT NULL
);

CREATE TABLE posts (
  post_id int UNSIGNED NOT NULL,
  user_id int UNSIGNED NOT NULL,
  post_title varchar(255) NOT NULL,
  post_content varchar(1000) NOT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE reports (
  id int NOT NULL,
  user_id int UNSIGNED DEFAULT NULL,
  post_id int UNSIGNED DEFAULT NULL,
  type varchar(255) NOT NULL,
  description text NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  user_id int UNSIGNED NOT NULL,
  username varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  profile_image varchar(255) NOT NULL
);


ALTER TABLE albums
  ADD PRIMARY KEY (album_id),
  ADD KEY FK_albums_users_user_id (user_id);

ALTER TABLE comments
  ADD PRIMARY KEY (comment_id),
  ADD KEY comments_user_id_foreign (user_id),
  ADD KEY comments_post_id_foreign (post_id);

ALTER TABLE comments_likes
  ADD PRIMARY KEY (comments_likes_id),
  ADD KEY comments_likes_user_id_foreign (user_id),
  ADD KEY comments_likes_comment_id_foreign (comment_id);

ALTER TABLE feedback
  ADD PRIMARY KEY (id),
  ADD KEY fk_feedback_users (user_id);

ALTER TABLE files
  ADD PRIMARY KEY (file_id),
  ADD KEY FK_image_albums (album_id);

ALTER TABLE following
  ADD KEY following_user_id_foreign (user_id),
  ADD KEY following_following_id_foreign (following_id);

ALTER TABLE likes
  ADD PRIMARY KEY (like_id),
  ADD KEY likes_user_id_foreign (user_id),
  ADD KEY likes_post_id_foreign (post_id);

ALTER TABLE posts
  ADD PRIMARY KEY (post_id),
  ADD KEY posts_user_id_foreign (user_id);

ALTER TABLE reports
  ADD PRIMARY KEY (id),
  ADD KEY FK_reports_users (user_id),
  ADD KEY FK_reports_posts (post_id);

ALTER TABLE users
  ADD PRIMARY KEY (user_id);

ALTER TABLE albums
  MODIFY album_id int UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE comments
  MODIFY comment_id int UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE comments_likes
  MODIFY comments_likes_id int UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE feedback
  MODIFY id int NOT NULL AUTO_INCREMENT;

ALTER TABLE files
  MODIFY file_id int UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE likes
  MODIFY like_id int UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE posts
  MODIFY post_id int UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE reports
  MODIFY id int NOT NULL AUTO_INCREMENT;

ALTER TABLE users
  MODIFY user_id int UNSIGNED NOT NULL AUTO_INCREMENT;


ALTER TABLE albums
  ADD CONSTRAINT FK_albums_users_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE comments
  ADD CONSTRAINT comments_post_id_foreign FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE,
  ADD CONSTRAINT comments_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE;

ALTER TABLE comments_likes
  ADD CONSTRAINT comments_likes_comment_id_foreign FOREIGN KEY (comment_id) REFERENCES comments (comment_id) ON DELETE CASCADE,
  ADD CONSTRAINT comments_likes_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE;

ALTER TABLE feedback
  ADD CONSTRAINT fk_feedback_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE files
  ADD CONSTRAINT FK_files_albums_album_id FOREIGN KEY (album_id) REFERENCES albums (album_id) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE following
  ADD CONSTRAINT following_following_id_foreign FOREIGN KEY (following_id) REFERENCES users (user_id) ON DELETE CASCADE,
  ADD CONSTRAINT following_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE;

ALTER TABLE likes
  ADD CONSTRAINT likes_post_id_foreign FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE,
  ADD CONSTRAINT likes_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE;

ALTER TABLE posts
  ADD CONSTRAINT posts_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE;

ALTER TABLE reports
  ADD CONSTRAINT FK_reports_posts FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT FK_reports_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE RESTRICT;
