/**
 * Zapier Webhook Ingest Endpoint
 * POST /api/leads/ingest
 *
 * Zapier sends a POST request every time a new lead arrives in the
 * Monday.com CRM. This endpoint validates the API key, maps the
 * Monday.com fields to our participantLeads schema, and inserts the record.
 *
 * Zapier setup:
 *   Trigger: Monday.com → New Item in Board (APGP Accommodation Providers board)
 *   Action:  Webhooks by Zapier → POST
 *   URL:     https://www.apgpaccommodation.com.au/api/leads/ingest
 *   Headers: x-api-key: <LEADS_INGEST_API_KEY env var>
 *   Body:    JSON (see field mapping below)
 */

import type { Express, Request, Response } from "express";
import { createLead } from "./leadsDb";

// Field value maps — Monday.com column values → our enum values
const CARE_FOR_MAP: Record<string, string> = {
  myself: "Myself",
  self: "Myself",
  "for myself": "Myself",
  "inquiring about disability accommodation for myself": "Myself",
  "i'm inquiring about disability accommodation for myself": "Myself",
  "a loved one": "A loved one",
  "loved one": "A loved one",
  "for a loved one": "A loved one",
  "inquiring about disability accommodation for a loved one": "A loved one",
  "i'm inquiring about disability accommodation for a loved one": "A loved one",
  "a client": "A client",
  client: "A client",
  "for a client": "A client",
  "on behalf of a client": "A client",
  "inquiring about disability accommodation for a client": "A client",
};

const REQUESTER_MAP: Record<string, string> = {
  self: "Self",
  "family member": "Family member / carer",
  "family member / carer": "Family member / carer",
  carer: "Family member / carer",
  "support coordinator": "Support coordinator",
  "plan manager": "Plan manager",
  other: "Other",
};

const NDIS_MAP: Record<string, string> = {
  yes: "Yes",
  "yes - ndis registered": "Yes",
  "yes, ndis registered": "Yes",
  "ndis registered": "Yes",
  "registered": "Yes",
  no: "No",
  "not registered": "No",
  "no - not ndis registered": "No",
  "in progress": "In progress",
  "applying": "In progress",
  "pending": "In progress",
};

const ACCOM_MAP: Record<string, string> = {
  sda: "SDA (Specialist Disability Accommodation)",
  "specialist disability accommodation": "SDA (Specialist Disability Accommodation)",
  sil: "SIL (Supported Independent Living)",
  "supported independent living": "SIL (Supported Independent Living)",
  sta: "STA (Short-Term Accommodation / Respite)",
  "short-term accommodation": "STA (Short-Term Accommodation / Respite)",
  mta: "MTA (Medium-Term Accommodation)",
  "medium-term accommodation": "MTA (Medium-Term Accommodation)",
  "medium term accommodation": "MTA (Medium-Term Accommodation)",
  "medium term": "MTA (Medium-Term Accommodation)",
  "short term accommodation": "STA (Short-Term Accommodation / Respite)",
  "short term": "STA (Short-Term Accommodation / Respite)",
  "respite": "STA (Short-Term Accommodation / Respite)",
  "long term": "SIL (Supported Independent Living)",
  "long-term": "SIL (Supported Independent Living)",
  "not sure": "Not sure",
  "unsure": "Not sure",
};

const DWELLING_MAP: Record<string, string> = {
  apartment: "Apartment",
  house: "House",
  "group home": "Group home",
  "villa / unit": "Villa / unit",
  villa: "Villa / unit",
  unit: "Villa / unit",
  any: "Any suitable",
  "any suitable": "Any suitable",
  "any that is available": "Any suitable",
  "any available": "Any suitable",
  "no preference": "Any suitable",
  "flexible": "Any suitable",
};

const TIMELINE_MAP: Record<string, string> = {
  immediately: "Immediately",
  "asap": "Immediately",
  "as soon as possible": "Immediately",
  "within 30 days": "Within 30 days",
  "30 days": "Within 30 days",
  "in 30 days": "Within 30 days",
  "within a month": "Within 30 days",
  "within 60 days": "Within 60 days",
  "60 days": "Within 60 days",
  "in 60 days": "Within 60 days",
  "in 30-60 days": "Within 60 days",
  "30-60 days": "Within 60 days",
  "within 2 months": "Within 60 days",
  "within 90 days": "Within 90 days",
  "90 days": "Within 90 days",
  "in 90 days": "Within 90 days",
  "within 3 months": "Within 90 days",
  unsure: "Unsure",
  "not sure": "Unsure",
  "unknown": "Unsure",
};

const STATE_MAP: Record<string, string> = {
  nsw: "NSW", vic: "VIC", qld: "QLD", sa: "SA",
  wa: "WA", tas: "TAS", act: "ACT", nt: "NT", any: "Any",
};

function mapField(value: string | undefined, map: Record<string, string>, fallback: string): string {
  if (!value) return fallback;
  return map[value.toLowerCase().trim()] ?? fallback;
}

export function registerLeadsIngestRoute(app: Express) {
  app.post("/api/leads/ingest", async (req: Request, res: Response) => {
    // Validate API key
    const apiKey = req.headers["x-api-key"];
    const expectedKey = process.env.LEADS_INGEST_API_KEY;
    if (!expectedKey || apiKey !== expectedKey) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const body = req.body as Record<string, string>;

      // Use Monday.com item ID directly — Zapier sends it as the item's numeric ID
      // Prefix with M12- if it's a plain number (Monday.com item IDs are numeric)
      const rawId = body.monday_lead_id || body.lead_id || body.item_id || body.id || '';
      const mondayLeadId = rawId
        ? (rawId.toString().startsWith('M') ? rawId.toString() : `M12-${rawId}`)
        : `M12-${Math.floor(100000 + Math.random() * 900000)}`;

      const lead = {
        careFor: mapField(body.care_for, CARE_FOR_MAP, "Myself") as "Myself" | "A loved one" | "A client",
        requesterType: mapField(body.requester_type, REQUESTER_MAP, "Other") as "Self" | "Family member / carer" | "Support coordinator" | "Plan manager" | "Other",
        ndisRegistered: mapField(body.ndis_registered, NDIS_MAP, "Yes") as "Yes" | "No" | "In progress",
        accommodationType: mapField(body.accommodation_type, ACCOM_MAP, "Not sure") as "SDA (Specialist Disability Accommodation)" | "SIL (Supported Independent Living)" | "STA (Short-Term Accommodation / Respite)" | "MTA (Medium-Term Accommodation)" | "Not sure",
        dwellingType: mapField(body.dwelling_type, DWELLING_MAP, "Any suitable") as "Apartment" | "House" | "Group home" | "Villa / unit" | "Any suitable",
        sdaCategory: body.sda_category as "Improved Liveability" | "Fully Accessible" | "Robust" | "High Physical Support" | "Not sure" | "N/A" | undefined,
        moveInTimeline: mapField(body.move_in_timeline, TIMELINE_MAP, "Unsure") as "Immediately" | "Within 30 days" | "Within 60 days" | "Within 90 days" | "Unsure",
        preferredState: mapField(body.preferred_state, STATE_MAP, "Any") as "NSW" | "VIC" | "QLD" | "SA" | "WA" | "TAS" | "ACT" | "NT" | "Any",
        supportNeeds: body.support_needs || body.notes || body.support_notes || undefined,
        postcode: body.postcode || body.post_code || body.zip || body.zip_code || body.suburb_postcode || undefined,
        mondayLeadId,
      };

      const id = await createLead(lead);
      console.log(`[Leads Ingest] Created lead ${id} from Monday.com (${mondayLeadId})`);
      return res.json({ success: true, id, mondayLeadId });
    } catch (err) {
      console.error("[Leads Ingest] Error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
}
