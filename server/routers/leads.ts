import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createLead,
  createProviderInterest,
  getInterestsByProvider,
  hasProviderExpressedInterest,
  listActiveLeads,
} from "../leadsDb";
import { notifyOwner } from "../_core/notification";
import { publicProcedure, router } from "../_core/trpc";
import { getProviderBySessionToken } from "../db";

const PROVIDER_COOKIE = "apgp_provider_session";

// Middleware: require provider session (cookie or Bearer)
const providerProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const cookieToken = ctx.req.cookies?.[PROVIDER_COOKIE];
  const authHeader = ctx.req.headers?.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const token = cookieToken || bearerToken;
  if (!token) throw new TRPCError({ code: "UNAUTHORIZED", message: "Provider login required" });
  const provider = await getProviderBySessionToken(token);
  if (!provider) throw new TRPCError({ code: "UNAUTHORIZED", message: "Session expired" });
  return next({ ctx: { ...ctx, provider } });
});

export const leadsRouter = router({
  // Public: submit a participant accommodation request
  submit: publicProcedure
    .input(
      z.object({
        careFor: z.enum(["Myself", "A loved one", "A client"]),
        requesterType: z.enum(["Self", "Family member / carer", "Support coordinator", "Plan manager", "Other"]),
        ndisRegistered: z.enum(["Yes", "No", "In progress"]),
        accommodationType: z.enum([
          "SDA (Specialist Disability Accommodation)",
          "SIL (Supported Independent Living)",
          "STA (Short-Term Accommodation / Respite)",
          "MTA (Medium-Term Accommodation)",
          "Not sure",
        ]),
        dwellingType: z.enum(["Apartment", "House", "Group home", "Villa / unit", "Any suitable"]),
        sdaCategory: z.enum(["Improved Liveability", "Fully Accessible", "Robust", "High Physical Support", "Not sure", "N/A"]).optional(),
        moveInTimeline: z.enum(["Immediately", "Within 30 days", "Within 60 days", "Within 90 days", "Unsure"]),
        preferredState: z.enum(["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT", "Any"]).optional(),
        supportNeeds: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const id = await createLead(input);
      // Notify Ausnew team of new lead
      notifyOwner({
        title: "New Participant Lead Submitted",
        content: `A new accommodation request has been submitted.\n\nCare for: ${input.careFor}\nRequester: ${input.requesterType}\nNDIS: ${input.ndisRegistered}\nAccommodation: ${input.accommodationType}\nDwelling: ${input.dwellingType}\nTimeline: ${input.moveInTimeline}\nState: ${input.preferredState ?? "Any"}\nSupport needs: ${input.supportNeeds ?? "Not specified"}`,
      }).catch(console.error);
      return { success: true, id };
    }),

  // Public: get recent leads for notification display (last 5, anonymised, no auth required)
  recentForNotifications: publicProcedure.query(async () => {
    const leads = await listActiveLeads();
    return leads.slice(0, 5).map((lead) => ({
      id: lead.id,
      accommodationType: lead.accommodationType,
      preferredState: lead.preferredState ?? "Australia",
      postcode: lead.postcode ?? null,
      moveInTimeline: lead.moveInTimeline,
      ndisRegistered: lead.ndisRegistered,
      createdAt: lead.createdAt,
    }));
  }),

  // Provider: list all active leads with interest status
  list: providerProcedure.query(async ({ ctx }) => {
    const leads = await listActiveLeads();
    const myInterests = await getInterestsByProvider(ctx.provider.id);
    const interestedLeadIds = new Set(myInterests.map((i) => i.leadId));
    return leads.map((lead) => ({
      ...lead,
      alreadyInterested: interestedLeadIds.has(lead.id),
    }));
  }),

  // Admin: list all leads (including hidden)
  adminList: publicProcedure.use(async ({ ctx, next }) => {
    const { getAdminFromCtx } = await import('./adminAuth');
    const admin = await getAdminFromCtx(ctx);
    if (!admin) throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
    return next({ ctx });
  }).query(async () => {
    const db = await import('../db').then(m => m.getDb());
    if (!db) return [];
    const { participantLeads } = await import('../../drizzle/schema');
    const { desc } = await import('drizzle-orm');
    return db.select().from(participantLeads).orderBy(desc(participantLeads.createdAt));
  }),

  // Admin: toggle isActive (hide/unhide)
  toggleActive: publicProcedure.use(async ({ ctx, next }) => {
    const { getAdminFromCtx } = await import('./adminAuth');
    const admin = await getAdminFromCtx(ctx);
    if (!admin) throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
    return next({ ctx });
  }).input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = await import('../db').then(m => m.getDb());
    if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    const { participantLeads } = await import('../../drizzle/schema');
    const { eq } = await import('drizzle-orm');
    const existing = await db.select().from(participantLeads).where(eq(participantLeads.id, input.id)).limit(1);
    if (!existing[0]) throw new TRPCError({ code: 'NOT_FOUND' });
    await db.update(participantLeads).set({ isActive: !existing[0].isActive }).where(eq(participantLeads.id, input.id));
    return { success: true, isActive: !existing[0].isActive };
  }),

  // Admin: update lead details
  adminUpdate: publicProcedure.use(async ({ ctx, next }) => {
    const { getAdminFromCtx } = await import('./adminAuth');
    const admin = await getAdminFromCtx(ctx);
    if (!admin) throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
    return next({ ctx });
  }).input(z.object({
    id: z.number(),
    accommodationType: z.string().optional(),
    dwellingType: z.string().optional(),
    moveInTimeline: z.string().optional(),
    preferredState: z.string().optional(),
    postcode: z.string().optional(),
    supportNeeds: z.string().optional(),
    mondayLeadId: z.string().optional(),
    ndisRegistered: z.string().optional(),
    ndisFundingType: z.string().optional(),
    careFor: z.string().optional(),
  })).mutation(async ({ input }) => {
    const db = await import('../db').then(m => m.getDb());
    if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    const { participantLeads } = await import('../../drizzle/schema');
    const { eq } = await import('drizzle-orm');
    const { id, ...updates } = input;
    await db.update(participantLeads).set(updates as Record<string, unknown>).where(eq(participantLeads.id, id));
    return { success: true };
  }),

  // Admin: manually create a lead
  adminCreate: publicProcedure.use(async ({ ctx, next }) => {
    const { getAdminFromCtx } = await import('./adminAuth');
    const admin = await getAdminFromCtx(ctx);
    if (!admin) throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
    return next({ ctx });
  }).input(z.object({
    mondayLeadId: z.string().optional(),
    postcode: z.string().min(1),
    preferredState: z.string().optional(),
    careFor: z.string().default('Myself'),
    accommodationType: z.string().default('Not specified'),
    ndisRegistered: z.string().default('Not specified'),
    ndisFundingType: z.string().optional(),
    requesterType: z.string().default('Not specified'),
    dwellingType: z.string().default('Not specified'),
    moveInTimeline: z.string().default('Not specified'),
    supportNeeds: z.string().optional(),
  })).mutation(async ({ input }) => {
    const db = await import('../db').then(m => m.getDb());
    if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    const { participantLeads } = await import('../../drizzle/schema');
    const result = await db.insert(participantLeads).values({
      mondayLeadId: input.mondayLeadId ?? null,
      postcode: input.postcode,
      preferredState: input.preferredState ?? null,
      careFor: input.careFor,
      accommodationType: input.accommodationType,
      ndisRegistered: input.ndisRegistered,
      ndisFundingType: input.ndisFundingType ?? null,
      requesterType: input.requesterType,
      dwellingType: input.dwellingType,
      moveInTimeline: input.moveInTimeline,
      supportNeeds: input.supportNeeds ?? null,
      isActive: true,
    });
    return { success: true, id: (result[0] as { insertId: number }).insertId };
  }),

  // Admin: delete lead
  adminDelete: publicProcedure.use(async ({ ctx, next }) => {
    const { getAdminFromCtx } = await import('./adminAuth');
    const admin = await getAdminFromCtx(ctx);
    if (!admin) throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
    return next({ ctx });
  }).input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    const db = await import('../db').then(m => m.getDb());
    if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    const { participantLeads } = await import('../../drizzle/schema');
    const { eq } = await import('drizzle-orm');
    await db.delete(participantLeads).where(eq(participantLeads.id, input.id));
    return { success: true };
  }),

  // Provider: express interest + submit referral agreement & consent
  expressInterest: providerProcedure
    .input(
      z.object({
        leadId: z.number(),
        signatoryName: z.string().min(2),
        signatoryOrg: z.string().min(2),
        providerNotes: z.string().max(500).optional(),
        referralAgreementSigned: z.literal(true),
        consentSigned: z.literal(true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const alreadyDone = await hasProviderExpressedInterest(ctx.provider.id, input.leadId);
      if (alreadyDone) throw new TRPCError({ code: "CONFLICT", message: "You have already expressed interest in this lead." });

      await createProviderInterest({
        leadId: input.leadId,
        providerId: ctx.provider.id,
        referralAgreementSigned: true,
        consentSigned: true,
        signatoryName: input.signatoryName,
        signatoryOrg: input.signatoryOrg,
        providerNotes: input.providerNotes,
      });

      // Save a signed agreement record to provider's documents with lead details
      try {
        const db = await import('../db').then(m => m.getDb());
        if (db) {
          const { providerDocuments, participantLeads } = await import('../../drizzle/schema');
          const { eq } = await import('drizzle-orm');
          const today = new Date().toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' });
          
          // Fetch lead details to include in the document
          const leads = await db.select().from(participantLeads).where(eq(participantLeads.id, input.leadId)).limit(1);
          const lead = leads[0];
          const leadRef = lead?.mondayLeadId ?? `LEAD-${input.leadId}`;
          const leadSummary = lead ? `${lead.accommodationType} | ${lead.dwellingType} | ${lead.moveInTimeline} | Postcode: ${lead.postcode ?? lead.preferredState ?? 'N/A'}` : `Lead ID: ${input.leadId}`;
          
          // Auto-name: ProviderName_LeadRef_Date.pdf
          const orgSlug = (ctx.provider.organisationName ?? input.signatoryOrg).replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40);
          const dateSlug = today.replace(/\//g, '-');
          const fileName = `${orgSlug}_${leadRef}_${dateSlug}.pdf`;
          const fileKey = `agreements/${ctx.provider.id}/lead-${input.leadId}-${Date.now()}.pdf`;
          const fileUrl = `/api/agreements/${ctx.provider.id}/${input.leadId}?ref=${leadRef}&signatory=${encodeURIComponent(input.signatoryName)}&org=${encodeURIComponent(input.signatoryOrg)}&date=${encodeURIComponent(today)}&lead=${encodeURIComponent(leadSummary)}`;
          
          // Save to provider's Documents tab
          await db.insert(providerDocuments).values({
            providerId: ctx.provider.id,
            fileName,
            fileKey,
            fileUrl,
            fileType: 'application/pdf',
            fileSize: 0,
            category: 'Referral Agreement',
          });

          // Also save to admin_signed_agreements table (or reuse providerDocuments with providerId=0 as admin copy)
          // We store a second copy with providerId=-1 as a sentinel for admin-visible agreements
          await db.insert(providerDocuments).values({
            providerId: -1, // sentinel: admin copy
            fileName: `[ADMIN] ${fileName}`,
            fileKey: `admin-copy/${fileKey}`,
            fileUrl,
            fileType: 'application/pdf',
            fileSize: 0,
            category: 'Referral Agreement',
          }).catch(() => {}); // non-fatal if admin copy fails
        }
      } catch (e) {
        console.error('[expressInterest] Failed to save agreement document:', e);
      }

      // Notify Ausnew team
      notifyOwner({
        title: `Provider Signed Referral Agreement — Lead ${input.leadId}`,
        content: `Provider: ${ctx.provider.organisationName ?? ctx.provider.email}\nABN: ${ctx.provider.abn ?? 'Not provided'}\nContact: ${input.signatoryName} (${input.signatoryOrg})\nLead ID: ${input.leadId}\nNotes: ${input.providerNotes ?? 'None'}\n\nReferral Agreement: Signed ✓\nConsent Form: Signed ✓`,
      }).catch(console.error);

      // Zap signed inquiry to Monday.com CRM (if webhook configured)
      const zapierCrmWebhook = process.env.ZAPIER_CRM_WEBHOOK_URL;
      if (zapierCrmWebhook) {
        fetch(zapierCrmWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'referral_agreement_signed',
            lead_id: input.leadId,
            provider_name: ctx.provider.organisationName ?? ctx.provider.email,
            provider_email: ctx.provider.email,
            provider_abn: ctx.provider.abn ?? '',
            signatory_name: input.signatoryName,
            signatory_org: input.signatoryOrg,
            signed_at: new Date().toISOString(),
            notes: input.providerNotes ?? '',
          }),
        }).catch((e) => console.error('[Zapier CRM] Failed to send:', e));
      }

      return { success: true };
    }),
});
