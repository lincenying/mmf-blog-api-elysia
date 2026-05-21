CREATE TABLE `articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`date` text NOT NULL,
	`author` text NOT NULL,
	`category` text NOT NULL,
	`views` integer DEFAULT 0 NOT NULL
);
