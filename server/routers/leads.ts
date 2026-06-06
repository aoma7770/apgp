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

      // Notify Ausnew team
      notifyOwner({
        title: "Provider Expressed Interest in a Lead",
        content: `Provider: ${ctx.provider.organisationName ?? ctx.provider.email}\nSignatory: ${input.signatoryName} (${input.signatoryOrg})\nLead ID: ${input.leadId}\nNotes: ${input.providerNotes ?? "None"}\n\nReferral Agreement: Signed ✓\nConsent Form: Signed ✓`,
      }).catch(console.error);

      return { success: true };
    }),
});
