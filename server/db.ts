import { and, desc, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  Accommodation,
  InsertAccommodation,
  InsertProvider,
  InsertUser,
  Provider,
  accommodations,
  providerLoginEvents,
  providerSessions,
  providers,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Manus OAuth users ────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];
  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };
  textFields.forEach(assignNullable);
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Provider auth ────────────────────────────────────────────────────────────
export async function createProvider(data: InsertProvider): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(providers).values(data);
  return (result[0] as { insertId: number }).insertId;
}

export async function getProviderByEmail(email: string): Promise<Provider | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(providers).where(eq(providers.email, email)).limit(1);
  return result[0];
}

export async function getProviderById(id: number): Promise<Provider | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(providers).where(eq(providers.id, id)).limit(1);
  return result[0];
}

export async function updateProvider(id: number, data: Partial<InsertProvider>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(providers).set(data).where(eq(providers.id, id));
}

export async function recordProviderLoginEvent(
  providerId: number,
  eventType: "registered" | "login" | "logout",
  occurredAt = new Date(),
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(providerLoginEvents).values({ providerId, eventType, occurredAt });
}

export async function getRegisteredProvidersForAdmin() {
  const db = await getDb();
  if (!db) return [];

  const [providerRows, activityRows, propertyRows] = await Promise.all([
    db.select().from(providers).orderBy(desc(providers.createdAt)),
    db.select().from(providerLoginEvents).orderBy(desc(providerLoginEvents.occurredAt)),
    db.select({ providerId: accommodations.providerId, id: accommodations.id }).from(accommodations),
  ]);

  const activityByProvider = new Map<number, typeof activityRows>();
  for (const event of activityRows) {
    const events = activityByProvider.get(event.providerId) ?? [];
    events.push(event);
    activityByProvider.set(event.providerId, events);
  }

  const propertyCountByProvider = new Map<number, number>();
  for (const property of propertyRows) {
    propertyCountByProvider.set(property.providerId, (propertyCountByProvider.get(property.providerId) ?? 0) + 1);
  }

  return providerRows.map(({ passwordHash: _, mondayItemId: __, ...provider }) => ({
    ...provider,
    propertyCount: propertyCountByProvider.get(provider.id) ?? 0,
    activity: activityByProvider.get(provider.id) ?? [],
  }));
}

// ─── Provider sessions ────────────────────────────────────────────────────────
export async function createProviderSession(providerId: number, token: string, expiresAt: Date): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(providerSessions).values({ providerId, token, expiresAt });
}

export async function getProviderBySessionToken(token: string): Promise<Provider | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const now = new Date();
  const result = await db
    .select({ provider: providers })
    .from(providerSessions)
    .innerJoin(providers, eq(providerSessions.providerId, providers.id))
    .where(and(eq(providerSessions.token, token), gt(providerSessions.expiresAt, now)))
    .limit(1);
  return result[0]?.provider;
}

export async function deleteProviderSession(token: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(providerSessions).where(eq(providerSessions.token, token));
}

// ─── Accommodations ───────────────────────────────────────────────────────────
export async function createAccommodation(data: InsertAccommodation): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(accommodations).values(data);
  return (result[0] as { insertId: number }).insertId;
}

export async function getAccommodationsByProvider(providerId: number): Promise<Accommodation[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(accommodations).where(and(eq(accommodations.providerId, providerId), eq(accommodations.isActive, true)));
}

export async function getAccommodationById(id: number): Promise<Accommodation | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(accommodations).where(eq(accommodations.id, id)).limit(1);
  return result[0];
}

export async function updateAccommodation(id: number, data: Partial<InsertAccommodation>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(accommodations).set(data).where(eq(accommodations.id, id));
}

export async function deleteAccommodation(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(accommodations).set({ isActive: false }).where(eq(accommodations.id, id));
}

export async function searchAccommodations(filters: {
  state?: string;
  propertyType?: string;
  vacancyStatus?: string;
  supportNeeds?: string;
  suburb?: string;
}): Promise<(Accommodation & { providerName: string | null; providerEmail: string })[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(accommodations.isActive, true)];
  if (filters.state) conditions.push(eq(accommodations.state, filters.state as "NSW" | "VIC" | "QLD" | "SA" | "WA" | "TAS" | "ACT" | "NT"));
  if (filters.propertyType) conditions.push(eq(accommodations.propertyType, filters.propertyType as "SDA" | "SIL" | "Both"));
  if (filters.vacancyStatus) conditions.push(eq(accommodations.vacancyStatus, filters.vacancyStatus as "Available" | "Pending" | "Occupied"));
  if (filters.suburb) conditions.push(like(accommodations.suburb, `%${filters.suburb}%`));
  if (filters.supportNeeds) conditions.push(like(accommodations.supportNeeds, `%${filters.supportNeeds}%`));

  const rows = await db
    .select({
      accommodation: accommodations,
      providerName: providers.organisationName,
      providerEmail: providers.email,
    })
    .from(accommodations)
    .innerJoin(providers, eq(accommodations.providerId, providers.id))
    .where(and(...conditions));

  return rows.map((r) => ({
    ...r.accommodation,
    providerName: r.providerName,
    providerEmail: r.providerEmail,
  }));
}

// Helper import fix
import { gt } from "drizzle-orm";
