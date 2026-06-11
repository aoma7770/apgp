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

/**
 * Derive Australian state from postcode.
 * Australian postcode ranges:
 *  NSW: 1000-2999 (also 2600-2618 is ACT but we keep simple)
 *  ACT: 0200-0299, 2600-2618, 2900-2920
 *  VIC: 3000-3999, 8000-8999
 *  QLD: 4000-4999, 9000-9999
 *  SA:  5000-5999
 *  WA:  6000-6999
 *  TAS: 7000-7999
 *  NT:  0800-0999
 */
function postcodeToState(postcode: string): string | undefined {
  const pc = parseInt(postcode.trim(), 10);
  if (isNaN(pc)) return undefined;

  // ACT (before NSW to take priority on overlapping ranges)
  if ((pc >= 200 && pc <= 299) || (pc >= 2600 && pc <= 2618) || (pc >= 2900 && pc <= 2920)) return 'ACT';
  // NT
  if (pc >= 800 && pc <= 999) return 'NT';
  // NSW
  if (pc >= 1000 && pc <= 2999) return 'NSW';
  // VIC
  if ((pc >= 3000 && pc <= 3999) || (pc >= 8000 && pc <= 8999)) return 'VIC';
  // QLD
  if ((pc >= 4000 && pc <= 4999) || (pc >= 9000 && pc <= 9999)) return 'QLD';
  // SA
  if (pc >= 5000 && pc <= 5999) return 'SA';
  // WA
  if (pc >= 6000 && pc <= 6999) return 'WA';
  // TAS
  if (pc >= 7000 && pc <= 7999) return 'TAS';

  return undefined;
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

      // Use Monday.com item ID exactly as sent — no prefix
      const rawId = body.monday_lead_id || body.lead_id || body.item_id || body.id || '';
      const mondayLeadId = rawId
        ? rawId.toString().trim()
        : `${Math.floor(1000000 + Math.random() * 9000000)}`;

      // Resolve postcode
      const postcode = body.postcode || body.post_code || body.zip || body.zip_code || body.suburb_postcode || undefined;

      // Auto-derive state from postcode if not explicitly provided
      const derivedState = postcode ? postcodeToState(postcode) : undefined;
      const preferredState = body.preferred_state || derivedState || undefined;

      // Store ALL values exactly as sent — no mapping
      const lead = {
        careFor: body.care_for || "Not specified",
        requesterType: body.requester_type || "Not specified",
        ndisRegistered: body.ndis_registered || "Not specified",
        accommodationType: body.accommodation_type || "Not specified",
        dwellingType: body.dwelling_type || "Not specified",
        sdaCategory: body.sda_category || undefined,
        moveInTimeline: body.move_in_timeline || "Not specified",
        preferredState,
        supportNeeds: body.support_needs || body.notes || body.support_notes || undefined,
        postcode,
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
