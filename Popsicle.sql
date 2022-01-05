CREATE DATABASE popsicle;
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
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
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
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatet_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY `comments_comment_id_primary`(`comment_id`)
);

CREATE TABLE `Comments_Likes`(
    `comments_likes_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INT UNSIGNED NOT NULL,
    `comment_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY `comments_likes_comments_likes_id_primary`(`comments_likes_id`)
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