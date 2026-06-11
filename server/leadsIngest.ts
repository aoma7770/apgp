/**
 * Zapier Webhook Ingest Endpoint
 * POST /api/leads/ingest
 *
 * Zapier sends a POST request every time a new lead arrives in the
 * Monday.com CRM. This endpoint validates the API key and stores
 * ALL values EXACTLY as sent by Zapier — no mapping or transformation.
 *
 * Zapier setup:
 *   Trigger: Monday.com → New Item in Board (APGP Accommodation Providers board)
 *   Action:  Webhooks by Zapier → POST
 *   URL:     https://www.apgpaccommodation.com.au/api/leads/ingest
 *   Headers: x-api-key: <LEADS_INGEST_API_KEY env var>
 *   Body:    JSON with fields:
 *     monday_lead_id  → Monday.com Item ID (will be prefixed with M12-)
 *     care_for        → e.g. "I'm Inquiring About Disability Accommodation For A Loved One"
 *     ndis_registered → e.g. "Yes - NDIS Registered"
 *     accommodation_type → e.g. "Medium Term Accommodation"
 *     dwelling_type   → e.g. "Any That is Available"
 *     move_in_timeline → e.g. "In 30-60 Days"
 *     postcode        → e.g. "4800"
 *     preferred_state → e.g. "QLD"
 *     support_needs   → free text notes
 *     requester_type  → e.g. "Support coordinator"
 */

import type { Express, Request, Response } from "express";
import { createLead } from "./leadsDb";

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

      // Use Monday.com item ID — prefix with M12- if it's a plain number
      const rawId = body.monday_lead_id || body.lead_id || body.item_id || body.id || '';
      const mondayLeadId = rawId
        ? (rawId.toString().startsWith('M') ? rawId.toString() : `M12-${rawId}`)
        : `M12-${Math.floor(100000 + Math.random() * 900000)}`;

      // Store ALL values exactly as sent — no mapping
      const lead = {
        careFor: body.care_for || "Not specified",
        requesterType: body.requester_type || "Not specified",
        ndisRegistered: body.ndis_registered || "Not specified",
        accommodationType: body.accommodation_type || "Not specified",
        dwellingType: body.dwelling_type || "Not specified",
        sdaCategory: body.sda_category || undefined,
        moveInTimeline: body.move_in_timeline || "Not specified",
        preferredState: body.preferred_state || undefined,
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
