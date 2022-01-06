CREATE TABLE albums (
  album_id int NOT NULL,
  album_name varchar(255) NOT NULL,
  album_cover varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  album_description text CHARACTER SET utf8 COLLATE utf8_general_ci,
  album_date datetime DEFAULT CURRENT_TIMESTAMP,
  user_id int NOT NULL,
  username varchar(255) NOT NULL
);

CREATE TABLE comments (
  comment_id int NOT NULL,
  post_id int NOT NULL,
  user_id int NOT NULL,
  comment_text varchar(255) NOT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comment_likes (
  comment_likes_id int UNSIGNED NOT NULL,
  user_id int NOT NULL,
  comment_id int NOT NULL
);

CREATE TABLE files (
  file_id int NOT NULL,
  album_id int NOT NULL,
  file_url varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  file_type varchar(255) NOT NULL,
  thumb_url varchar(255) DEFAULT NULL,
  created_at datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `following` (
  following_id int NOT NULL,
  user_id int NOT NULL
);

CREATE TABLE likes (
  like_id int UNSIGNED NOT NULL,
  user_id int NOT NULL,
  post_id int NOT NULL
);
CREATE TABLE posts (
  post_id int NOT NULL,
  user_id int NOT NULL,
  post_title varchar(255) NOT NULL,
  post_content varchar(255) NOT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reports (
  id int NOT NULL,
  user_id int DEFAULT NULL,
  post_id int DEFAULT NULL,
  type varchar(255) NOT NULL,
  description text NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  user_id int NOT NULL,
  username varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  profile varchar(255) NOT NULL,
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at datetime DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE albums
  ADD PRIMARY KEY (album_id),
  ADD KEY FK_albums_users_user_id (user_id);

ALTER TABLE comments
  ADD PRIMARY KEY (comment_id),
  ADD KEY FK_comments_posts (post_id),
  ADD KEY FK_comments_users (user_id);

ALTER TABLE comment_likes
  ADD PRIMARY KEY (comment_likes_id),
  ADD KEY FK_comment_likes_and_users (user_id),
  ADD KEY FK_comment_likes_and_comments (comment_id);

ALTER TABLE files
  ADD PRIMARY KEY (file_id),
  ADD KEY FK_image_albums (album_id);

ALTER TABLE following
  ADD KEY FK_following_users_1 (following_id),
  ADD KEY FK_following_users_2 (user_id);

ALTER TABLE likes
  ADD PRIMARY KEY (like_id),
  ADD KEY FK_likes_users (user_id),
  ADD KEY FK_likes_posts (post_id);

ALTER TABLE posts
  ADD PRIMARY KEY (post_id),
  ADD KEY FK_posts_users (user_id);

ALTER TABLE reports
  ADD PRIMARY KEY (id),
  ADD KEY FK_reports_users (user_id),
  ADD KEY FK_reports_posts (post_id);

ALTER TABLE users
  ADD PRIMARY KEY (user_id);


ALTER TABLE albums
  MODIFY album_id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE comments
  MODIFY comment_id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE comment_likes
  MODIFY comment_likes_id int UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE files
  MODIFY file_id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=237;

ALTER TABLE likes
  MODIFY like_id int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

ALTER TABLE posts
  MODIFY post_id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

ALTER TABLE reports
  MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE users
  MODIFY user_id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;


ALTER TABLE albums
  ADD CONSTRAINT FK_albums_users_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE comments
  ADD CONSTRAINT FK_comments_posts FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT FK_comments_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE comment_likes
  ADD CONSTRAINT FK_comment_likes_and_comments FOREIGN KEY (comment_id) REFERENCES comments (comment_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT FK_comment_likes_and_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE files
  ADD CONSTRAINT FK_image_albums FOREIGN KEY (album_id) REFERENCES albums (album_id) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE following
  ADD CONSTRAINT FK_following_users_1 FOREIGN KEY (following_id) REFERENCES users (user_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT FK_following_users_2 FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE likes
  ADD CONSTRAINT FK_likes_posts FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT FK_likes_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE posts
  ADD CONSTRAINT FK_posts_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE reports
  ADD CONSTRAINT FK_reports_posts FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT FK_reports_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE RESTRICT;
COMMIT;
