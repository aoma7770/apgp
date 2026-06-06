CREATE TABLE `participantLeads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`careFor` enum('Myself','A loved one','A client') NOT NULL,
	`requesterType` enum('Self','Family member / carer','Support coordinator','Plan manager','Other') NOT NULL,
	`ndisRegistered` enum('Yes','No','In progress') NOT NULL,
	`accommodationType` enum('SD') NOT NULL,
	`dwellingType` enum('Apartment','House','Group home','Villa / unit','Any suitable') NOT NULL,
	`sdaCategory` enum('Improved Liveability','Fully Accessible','Robust','High Physical Support','Not sure','N/A'),
	`moveInTimeline` enum('Immediately','Within 30 days','Within 60 days','Within 90 days','Unsure') NOT NULL,
	`preferredState` enum('NSW','VIC','QLD','SA','WA','TAS','ACT','NT','Any'),
	`supportNeeds` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `participantLeads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `providerInterests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`providerId` int NOT NULL,
	`referralAgreementSigned` boolean NOT NULL DEFAULT false,
	`consentSigned` boolean NOT NULL DEFAULT false,
	`signatoryName` varchar(255),
	`signatoryOrg` varchar(255),
	`providerNotes` text,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `providerInterests_id` PRIMARY KEY(`id`)
);
