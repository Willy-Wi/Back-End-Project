CREATE TABLE `Users`(
    `user_id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `profile_image` INT NOT NULL,
    PRIMARY KEY `users_user_id_primary`(`user_id`)
);

CREATE TABLE `Posts`(
    `post_id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `post_title` VARCHAR(255) NOT NULL,
    `post_content` VARCHAR(1000) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY `posts_post_id_primary`(`post_id`)
);

CREATE TABLE `Following`(
    `following_id` INT NOT NULL,
    `user_id` INT NOT NULL
);

CREATE TABLE `Likes`(
    `like_id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `post_id` INT NOT NULL,
    PRIMARY KEY `likes_like_id_primary`(`like_id`)
);

CREATE TABLE `Comments`(
    `comment_id` INT NOT NULL AUTO_INCREMENT,
    `post_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `comment_content` VARCHAR(1000) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatet_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY `comments_comment_id_primary`(`comment_id`)
);

CREATE TABLE `Comments_Likes`(
    `comments_likes_id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `comment_id` INT NOT NULL,
    PRIMARY KEY `comments_likes_comments_likes_id_primary`(`comments_likes_id`)
);

CREATE TABLE `albums` (
  `album_id` int NOT NULL,
  `album_name` varchar(255) NOT NULL,
  `album_cover` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `album_description` text CHARACTER SET utf8 COLLATE utf8_general_ci,
  `album_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_id` int NOT NULL
);

CREATE TABLE `feedback` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `subject` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `message` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `contact` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `email` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `files` (
  `file_id` int NOT NULL,
  `album_id` int NOT NULL,
  `file_url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `file_type` varchar(255) NOT NULL,
  `thumb_url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `reports` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `post_id` int DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE
    `Posts`
ADD
    CONSTRAINT `posts_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE;

ALTER TABLE
    `Following`
ADD
    CONSTRAINT `following_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE;

ALTER TABLE
    `Following`
ADD
    CONSTRAINT `following_following_id_foreign` FOREIGN KEY(`following_id`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE;

ALTER TABLE
    `Likes`
ADD
    CONSTRAINT `likes_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE;

ALTER TABLE
    `Comments`
ADD
    CONSTRAINT `comments_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE;

ALTER TABLE
    `Comments_Likes`
ADD
    CONSTRAINT `comments_likes_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE;

ALTER TABLE
    `Comments`
ADD
    CONSTRAINT `comments_post_id_foreign` FOREIGN KEY(`post_id`) REFERENCES `Posts`(`post_id`) ON DELETE CASCADE;

ALTER TABLE
    `Likes`
ADD
    CONSTRAINT `likes_post_id_foreign` FOREIGN KEY(`post_id`) REFERENCES `Posts`(`post_id`) ON DELETE CASCADE;

ALTER TABLE
    `Comments_Likes`
ADD
    CONSTRAINT `comments_likes_comment_id_foreign` FOREIGN KEY(`comment_id`) REFERENCES `Comments`(`comment_id`) ON DELETE CASCADE;

ALTER TABLE `albums`
  ADD PRIMARY KEY (`album_id`),
  ADD KEY `FK_albums_users_user_id` (`user_id`);

ALTER TABLE `albums`
  ADD CONSTRAINT `FK_albums_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_feedback_users` (`user_id`);

ALTER TABLE `feedback`
  ADD CONSTRAINT `fk_feedback_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `files`
  ADD PRIMARY KEY (`file_id`),
  ADD KEY `FK_image_albums` (`album_id`);

ALTER TABLE `files`
  ADD CONSTRAINT `FK_image_albums` FOREIGN KEY (`album_id`) REFERENCES `albums` (`album_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_reports_users` (`user_id`),
  ADD KEY `FK_reports_posts` (`post_id`);

ALTER TABLE `reports`
  ADD CONSTRAINT `FK_reports_posts` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  ADD CONSTRAINT `FK_reports_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT;
