import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// ─── Core user table (Manus OAuth) ───────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "staff", "provider"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Provider accounts (email/password, separate from Manus OAuth) ───────────
export const providers = mysqlTable("providers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  // Company profile fields
  organisationName: varchar("organisationName", { length: 255 }),
  abn: varchar("abn", { length: 20 }),
  contactName: varchar("contactName", { length: 255 }),
  contactTitle: varchar("contactTitle", { length: 255 }),
  phone: varchar("phone", { length: 30 }),
  website: varchar("website", { length: 500 }),
  // Regions serviced (comma-separated state codes, e.g. "NSW,VIC,QLD")
  regionsServiced: text("regionsServiced"),
  // Support types offered (comma-separated, e.g. "SDA,SIL")
  supportTypes: text("supportTypes"),
  // Company type for Monday.com mapping
  companyType: mysqlEnum("companyType", ["SDA", "SIL", "Both"]),
  // Profile completion flag
  profileComplete: boolean("profileComplete").default(false).notNull(),
  // Monday.com item ID for this provider (set after first sync)
  mondayItemId: varchar("mondayItemId", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Provider = typeof providers.$inferSelect;
export type InsertProvider = typeof providers.$inferInsert;

// ─── Accommodation listings ───────────────────────────────────────────────────
export const accommodations = mysqlTable("accommodations", {
  id: int("id").autoincrement().primaryKey(),
  providerId: int("providerId").notNull(),
  // Property details
  propertyName: varchar("propertyName", { length: 255 }),
  address: varchar("address", { length: 500 }),
  suburb: varchar("suburb", { length: 255 }),
  state: mysqlEnum("state", ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"]),
  postcode: varchar("postcode", { length: 10 }),
  propertyType: mysqlEnum("propertyType", ["SDA", "SIL", "Both"]),
  // SDA design category if applicable
  sdaCategory: mysqlEnum("sdaCategory", [
    "Improved Liveability",
    "Fully Accessible",
    "Robust",
    "High Physical Support",
    "Basic",
  ]),
  // Vacancy info
  vacancyStatus: mysqlEnum("vacancyStatus", ["Available", "Pending", "Occupied"]).default("Available").notNull(),
  availableRooms: int("availableRooms").default(0),
  totalRooms: int("totalRooms").default(0),
  // Support needs catered for
  supportNeeds: text("supportNeeds"),
  // Additional details
  description: text("description"),
  propertyLink: varchar("propertyLink", { length: 500 }),
  // Active/archived
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Accommodation = typeof accommodations.$inferSelect;
export type InsertAccommodation = typeof accommodations.$inferInsert;

// ─── Participant accommodation leads ───────────────────────────────────────────────
export const participantLeads = mysqlTable("participantLeads", {
  id: int("id").autoincrement().primaryKey(),
  // Who is this request for?
  careFor: mysqlEnum("careFor", ["Myself", "A loved one", "A client"]).notNull(),
  // Requester type
  requesterType: mysqlEnum("requesterType", [
    "Self",
    "Family member / carer",
    "Support coordinator",
    "Plan manager",
    "Other",
  ]).notNull(),
  // NDIS status
  ndisRegistered: mysqlEnum("ndisRegistered", ["Yes", "No", "In progress"]).notNull(),
  // Accommodation type requested
  accommodationType: mysqlEnum("accommodationType", [
    "SDA (Specialist Disability Accommodation)",
    "SIL (Supported Independent Living)",
    "STA (Short-Term Accommodation / Respite)",
    "MTA (Medium-Term Accommodation)",
    "Not sure",
  ]).notNull(),
  // Dwelling type
  dwellingType: mysqlEnum("dwellingType", [
    "Apartment",
    "House",
    "Group home",
    "Villa / unit",
    "Any suitable",
  ]).notNull(),
  // SDA category if applicable
  sdaCategory: mysqlEnum("sdaCategory", [
    "Improved Liveability",
    "Fully Accessible",
    "Robust",
    "High Physical Support",
    "Not sure",
    "N/A",
  ]),
  // Move-in timeline
  moveInTimeline: mysqlEnum("moveInTimeline", [
    "Immediately",
    "Within 30 days",
    "Within 60 days",
    "Within 90 days",
    "Unsure",
  ]).notNull(),
  // Preferred state
  preferredState: mysqlEnum("preferredState", ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT", "Any"]),
  // Additional support needs (free text, anonymous)
  supportNeeds: text("supportNeeds"),
  // Active flag
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ParticipantLead = typeof participantLeads.$inferSelect;
export type InsertParticipantLead = typeof participantLeads.$inferInsert;

// ─── Provider interest / referral agreement ─────────────────────────────────────────────
export const providerInterests = mysqlTable("providerInterests", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  providerId: int("providerId").notNull(),
  // Signed agreement text (stored as confirmation)
  referralAgreementSigned: boolean("referralAgreementSigned").default(false).notNull(),
  consentSigned: boolean("consentSigned").default(false).notNull(),
  // Provider's name and organisation at time of signing
  signatoryName: varchar("signatoryName", { length: 255 }),
  signatoryOrg: varchar("signatoryOrg", { length: 255 }),
  // Notes from provider
  providerNotes: text("providerNotes"),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
});

export type ProviderInterest = typeof providerInterests.$inferSelect;
export type InsertProviderInterest = typeof providerInterests.$inferInsert;

// ─── Blog posts ─────────────────────────────────────────────────────────────────────────────────
export const blogPosts = mysqlTable("blogPosts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: varchar("coverImage", { length: 500 }),
  category: varchar("category", { length: 100 }),
  author: varchar("author", { length: 255 }).default("Ausnew APGP Team"),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// ─── Provider sessions (JWT-based, separate from Manus OAuth) ──────────────────
export const providerSessions = mysqlTable("providerSessions", {
  id: int("id").autoincrement().primaryKey(),
  providerId: int("providerId").notNull(),
  token: varchar("token", { length: 512 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProviderSession = typeof providerSessions.$inferSelect;
