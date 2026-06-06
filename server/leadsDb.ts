import { and, desc, eq } from "drizzle-orm";
import {
  InsertParticipantLead,
  InsertProviderInterest,
  ParticipantLead,
  ProviderInterest,
  participantLeads,
  providerInterests,
} from "../drizzle/schema";
import { getDb } from "./db";

// ─── Participant leads ────────────────────────────────────────────────────────
export async function createLead(data: InsertParticipantLead): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(participantLeads).values(data);
  return (result[0] as { insertId: number }).insertId;
}

export async function listActiveLeads(): Promise<ParticipantLead[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(participantLeads)
    .where(eq(participantLeads.isActive, true))
    .orderBy(desc(participantLeads.createdAt));
}

// ─── Provider interests ───────────────────────────────────────────────────────
export async function createProviderInterest(data: InsertProviderInterest): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(providerInterests).values(data);
  return (result[0] as { insertId: number }).insertId;
}

export async function getInterestsByProvider(providerId: number): Promise<ProviderInterest[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(providerInterests).where(eq(providerInterests.providerId, providerId));
}

export async function hasProviderExpressedInterest(
  providerId: number,
  leadId: number
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const result = await db
    .select()
    .from(providerInterests)
    .where(and(eq(providerInterests.providerId, providerId), eq(providerInterests.leadId, leadId)))
    .limit(1);
  return result.length > 0;
}
