CREATE TABLE `accommodations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`providerId` int NOT NULL,
	`propertyName` varchar(255),
	`address` varchar(500),
	`suburb` varchar(255),
	`state` enum('NSW','VIC','QLD','SA','WA','TAS','ACT','NT'),
	`postcode` varchar(10),
	`propertyType` enum('SDA','SIL','Both'),
	`sdaCategory` enum('Improved Liveability','Fully Accessible','Robust','High Physical Support','Basic'),
	`vacancyStatus` enum('Available','Pending','Occupied') NOT NULL DEFAULT 'Available',
	`availableRooms` int DEFAULT 0,
	`totalRooms` int DEFAULT 0,
	`supportNeeds` text,
	`description` text,
	`propertyLink` varchar(500),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `accommodations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `providerSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`providerId` int NOT NULL,
	`token` varchar(512) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `providerSessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `providerSessions_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `providers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`organisationName` varchar(255),
	`abn` varchar(20),
	`contactName` varchar(255),
	`contactTitle` varchar(255),
	`phone` varchar(30),
	`website` varchar(500),
	`regionsServiced` text,
	`supportTypes` text,
	`companyType` enum('SDA','SIL','Both'),
	`profileComplete` boolean NOT NULL DEFAULT false,
	`mondayItemId` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `providers_id` PRIMARY KEY(`id`),
	CONSTRAINT `providers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','staff','provider') NOT NULL DEFAULT 'user';