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

// ─── Provider sessions (JWT-based, separate from Manus OAuth) ────────────────
export const providerSessions = mysqlTable("providerSessions", {
  id: int("id").autoincrement().primaryKey(),
  providerId: int("providerId").notNull(),
  token: varchar("token", { length: 512 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProviderSession = typeof providerSessions.$inferSelect;
