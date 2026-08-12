CREATE TABLE `adminSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`token` varchar(512) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `adminSessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `adminSessions_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `adminUsers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(64) NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`fullName` varchar(255),
	`role` enum('super_admin','admin') NOT NULL DEFAULT 'admin',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`lastSignedIn` timestamp,
	CONSTRAINT `adminUsers_id` PRIMARY KEY(`id`),
	CONSTRAINT `adminUsers_username_unique` UNIQUE(`username`),
	CONSTRAINT `adminUsers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `providerDocuments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`providerId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`fileUrl` varchar(500) NOT NULL,
	`fileType` varchar(100),
	`fileSize` int,
	`category` enum('Referral Agreement','Consent Form','NDIS Registration','Insurance','Other') DEFAULT 'Other',
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `providerDocuments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `providerLoginEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`providerId` int NOT NULL,
	`eventType` enum('registered','login','logout') NOT NULL,
	`occurredAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `providerLoginEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `participantLeads` MODIFY COLUMN `careFor` varchar(255) NOT NULL DEFAULT 'Not specified';--> statement-breakpoint
ALTER TABLE `participantLeads` MODIFY COLUMN `requesterType` varchar(255) NOT NULL DEFAULT 'Not specified';--> statement-breakpoint
ALTER TABLE `participantLeads` MODIFY COLUMN `ndisRegistered` varchar(255);--> statement-breakpoint
ALTER TABLE `participantLeads` MODIFY COLUMN `accommodationType` varchar(255) NOT NULL DEFAULT 'Not specified';--> statement-breakpoint
ALTER TABLE `participantLeads` MODIFY COLUMN `dwellingType` varchar(255) NOT NULL DEFAULT 'Not specified';--> statement-breakpoint
ALTER TABLE `participantLeads` MODIFY COLUMN `sdaCategory` varchar(100);--> statement-breakpoint
ALTER TABLE `participantLeads` MODIFY COLUMN `moveInTimeline` varchar(100) NOT NULL DEFAULT 'Not specified';--> statement-breakpoint
ALTER TABLE `participantLeads` MODIFY COLUMN `preferredState` varchar(50);--> statement-breakpoint
ALTER TABLE `blogPosts` ADD `thumbnailUrl` text;--> statement-breakpoint
ALTER TABLE `blogPosts` ADD `keywordSeed` varchar(255);--> statement-breakpoint
ALTER TABLE `blogPosts` ADD `tags` text;--> statement-breakpoint
ALTER TABLE `blogPosts` ADD `source` varchar(50) DEFAULT 'manual';--> statement-breakpoint
ALTER TABLE `participantLeads` ADD `ndisFundingType` varchar(255);--> statement-breakpoint
ALTER TABLE `participantLeads` ADD `postcode` varchar(10);--> statement-breakpoint
ALTER TABLE `participantLeads` ADD `mondayLeadId` varchar(30);--> statement-breakpoint
ALTER TABLE `providers` ADD `lastLoginAt` timestamp;