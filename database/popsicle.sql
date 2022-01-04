CREATE TABLE `comments` (
  `comment_id` int NOT NULL,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `comment_text` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) 

CREATE TABLE `comment_likes` (
  `comment_likes_id` int UNSIGNED NOT NULL,
  `user_id` int NOT NULL,
  `comment_id` int NOT NULL
) 

CREATE TABLE `following` (
  `following_id` int NOT NULL,
  `user_id` int NOT NULL
)

CREATE TABLE `likes` (
  `like_id` int UNSIGNED NOT NULL,
  `user_id` int NOT NULL,
  `post_id` int NOT NULL
) 

CREATE TABLE `posts` (
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `post_title` varchar(255) NOT NULL,
  `post_content` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
) 

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP
)

ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `FK_comments_posts` (`post_id`),
  ADD KEY `FK_comments_users` (`user_id`);

ALTER TABLE `comment_likes`
  ADD PRIMARY KEY (`comment_likes_id`),
  ADD KEY `FK_comment_likes_and_users` (`user_id`),
  ADD KEY `FK_comment_likes_and_comments` (`comment_id`);

ALTER TABLE `following`
  ADD KEY `FK_following_users_1` (`following_id`),
  ADD KEY `FK_following_users_2` (`user_id`);

ALTER TABLE `likes`
  ADD PRIMARY KEY (`like_id`),
  ADD KEY `FK_likes_users` (`user_id`),
  ADD KEY `FK_likes_posts` (`post_id`);

ALTER TABLE `posts`
  ADD PRIMARY KEY (`post_id`),
  ADD KEY `FK_posts_users` (`user_id`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

ALTER TABLE `comments`
  MODIFY `comment_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT;

ALTER TABLE `comment_likes`
  MODIFY `comment_likes_id` int UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `likes`
  MODIFY `like_id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT;

ALTER TABLE `posts`
  MODIFY `post_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT;

ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT;


ALTER TABLE `comments`
  ADD CONSTRAINT `FK_comments_posts` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `FK_comments_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE `comment_likes`
  ADD CONSTRAINT `FK_comment_likes_and_comments` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `FK_comment_likes_and_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `following`
  ADD CONSTRAINT `FK_following_users_1` FOREIGN KEY (`following_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `FK_following_users_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `likes`
  ADD CONSTRAINT `FK_likes_posts` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `FK_likes_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `posts`
  ADD CONSTRAINT `FK_posts_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT;
COMMIT;
