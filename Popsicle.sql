DROP DATABASE IF EXISTS popsicle;
CREATE DATABASE IF NOT EXISTS popsicle;

USE popsicle;

CREATE TABLE `Users`(
    `user_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `profile_image` INT UNSIGNED NOT NULL,
    PRIMARY KEY `users_user_id_primary`(`user_id`)
);
CREATE TABLE `Posts`(
    `post_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INT UNSIGNED NOT NULL,
    `post_title` VARCHAR(255) NOT NULL,
    `post_content` VARCHAR(1000) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY `posts_post_id_primary`(`post_id`)
);
CREATE TABLE `Following`(
    `following_id` INT UNSIGNED NOT NULL,
    `user_id` INT UNSIGNED NOT NULL
);
CREATE TABLE `Likes`(
    `like_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INT UNSIGNED NOT NULL,
    `post_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY `likes_like_id_primary`(`like_id`)
);
CREATE TABLE `Comments`(
    `comment_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `post_id` INT UNSIGNED NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `comment_content` VARCHAR(1000) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY `comments_comment_id_primary`(`comment_id`)
);
CREATE TABLE `albums`(
    `album_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `album_name` VARCHAR(255) NOT NULL,
    `album_cover` VARCHAR(255) NULL,
    `album_description` TEXT NULL,
    `album_date` DATETIME NULL,
    `user_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY `albums_album_id_primary`(`album_id`)
);
CREATE TABLE `feedback`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INT UNSIGNED NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `message` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `contact` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `date_created` DATETIME NULL,
    PRIMARY KEY `feedback_id_primary`(`id`)
);
CREATE TABLE `Files`(
    `file_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `album_id` INT UNSIGNED NOT NULL,
    `file_url` VARCHAR(255) NOT NULL,
    `file_type` VARCHAR(255) NOT NULL,
    `thumb_url` VARCHAR(255) NOT NULL,
    `created_at` DATETIME NOT NULL,
    PRIMARY KEY `files_file_id_primary`(`file_id`)
);
CREATE TABLE `Reports`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INT UNSIGNED NOT NULL,
    `post_id` INT UNSIGNED NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL,
    PRIMARY KEY `reports_id_primary`(`id`)
);
ALTER TABLE
    `Posts` ADD CONSTRAINT `posts_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `Users`(`user_id`) ON UPDATE CASCADE;
ALTER TABLE
    `Following` ADD CONSTRAINT `following_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `Users`(`user_id`) ON UPDATE CASCADE;
ALTER TABLE
    `Following` ADD CONSTRAINT `following_following_id_foreign` FOREIGN KEY(`following_id`) REFERENCES `Users`(`user_id`) ON UPDATE CASCADE;
ALTER TABLE
    `Likes` ADD CONSTRAINT `likes_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `Users`(`user_id`) ON UPDATE CASCADE;
ALTER TABLE
    `feedback` ADD CONSTRAINT `feedback_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `Users`(`user_id`) ON UPDATE CASCADE;
ALTER TABLE
    `Comments` ADD CONSTRAINT `comments_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `Users`(`user_id`) ON UPDATE CASCADE;
ALTER TABLE
    `albums` ADD CONSTRAINT `albums_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `Users`(`user_id`) ON UPDATE CASCADE;
ALTER TABLE
    `Reports` ADD CONSTRAINT `reports_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `Users`(`user_id`) ON UPDATE CASCADE;
ALTER TABLE
    `Likes` ADD CONSTRAINT `likes_post_id_foreign` FOREIGN KEY(`post_id`) REFERENCES `Posts`(`post_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE
    `Comments` ADD CONSTRAINT `comments_post_id_foreign` FOREIGN KEY(`post_id`) REFERENCES `Posts`(`post_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE
    `Reports` ADD CONSTRAINT `reports_post_id_foreign` FOREIGN KEY(`post_id`) REFERENCES `Posts`(`post_id`) ON UPDATE CASCADE;
ALTER TABLE
    `Files` ADD CONSTRAINT `files_album_id_foreign` FOREIGN KEY(`album_id`) REFERENCES `albums`(`album_id`) ON UPDATE CASCADE;