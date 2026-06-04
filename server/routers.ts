import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import {
  createAccommodation,
  createProvider,
  createProviderSession,
  deleteAccommodation,
  deleteProviderSession,
  getAccommodationById,
  getAccommodationsByProvider,
  getProviderByEmail,
  getProviderById,
  getProviderBySessionToken,
  searchAccommodations,
  updateAccommodation,
  updateProvider,
} from "./db";
import { createMondayProviderItem, updateMondayProviderItem } from "./monday";
import { blogRouter } from "./routers/blog";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

// ─── Provider session cookie name ─────────────────────────────────────────────
const PROVIDER_COOKIE = "apgp_provider_session";

// ─── Middleware: require provider session ─────────────────────────────────────
// Reads token from cookie first, then falls back to Authorization: Bearer header
// (the Bearer fallback supports environments where cookies are blocked, e.g. preview iframes)
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

// ─── Middleware: require staff or admin (Manus OAuth user) ────────────────────
const staffProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin" && ctx.user.role !== "staff") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Staff access required" });
  }
  return next({ ctx });
});

// ─── Zod schemas ──────────────────────────────────────────────────────────────
const StateEnum = z.enum(["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"]);
const PropertyTypeEnum = z.enum(["SDA", "SIL", "Both"]);
const VacancyStatusEnum = z.enum(["Available", "Pending", "Occupied"]);
const CompanyTypeEnum = z.enum(["SDA", "SIL", "Both"]);
const SdaCategoryEnum = z.enum([
  "Improved Liveability",
  "Fully Accessible",
  "Robust",
  "High Physical Support",
  "Basic",
]);

export const appRouter = router({
  system: systemRouter,

  // ─── Manus OAuth auth ──────────────────────────────────────────────────────
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Provider auth (email/password) ───────────────────────────────────────
  provider: router({
    register: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(8, "Password must be at least 8 characters"),
          organisationName: z.string().min(2).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const existing = await getProviderByEmail(input.email);
        if (existing) throw new TRPCError({ code: "CONFLICT", message: "An account with this email already exists" });

        const passwordHash = await bcrypt.hash(input.password, 12);
        const providerId = await createProvider({
          email: input.email,
          passwordHash,
          organisationName: input.organisationName ?? null,
        });

        // Create session
        const token = nanoid(64);
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        await createProviderSession(providerId, token, expiresAt);

        // Sync to Monday.com (non-blocking)
        createMondayProviderItem({
          organisationName: input.organisationName ?? input.email,
          email: input.email,
        })
          .then(async (mondayItemId) => {
            if (mondayItemId) await updateProvider(providerId, { mondayItemId });
          })
          .catch((err) => console.error("[Monday] Registration sync failed:", err));

        // Set session cookie
        ctx.res.cookie(PROVIDER_COOKIE, token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
          maxAge: 30 * 24 * 60 * 60,
        });

        const provider = await getProviderById(providerId);
        // Also return token in body so client can store in localStorage
        // (fallback for environments where cookies are blocked)
        return { success: true, token, provider: sanitizeProvider(provider!) };
      }),

    login: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const provider = await getProviderByEmail(input.email);
        if (!provider) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });

        const valid = await bcrypt.compare(input.password, provider.passwordHash);
        if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });

        const token = nanoid(64);
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await createProviderSession(provider.id, token, expiresAt);

        ctx.res.cookie(PROVIDER_COOKIE, token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
          maxAge: 30 * 24 * 60 * 60,
        });

        return { success: true, token, provider: sanitizeProvider(provider) };
      }),

    logout: providerProcedure.mutation(async ({ ctx }) => {
      const token = ctx.req.cookies?.[PROVIDER_COOKIE];
      if (token) await deleteProviderSession(token);
      ctx.res.clearCookie(PROVIDER_COOKIE, { httpOnly: true, secure: true, sameSite: "none", path: "/" });
      return { success: true };
    }),

    me: providerProcedure.query(({ ctx }) => sanitizeProvider(ctx.provider)),

    updateProfile: providerProcedure
      .input(
        z.object({
          organisationName: z.string().min(2).optional(),
          abn: z.string().optional(),
          contactName: z.string().optional(),
          contactTitle: z.string().optional(),
          phone: z.string().optional(),
          website: z.string().url().optional().or(z.literal("")),
          regionsServiced: z.string().optional(),
          supportTypes: z.string().optional(),
          companyType: CompanyTypeEnum.optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const provider = ctx.provider;
        await updateProvider(provider.id, { ...input, profileComplete: true });

        // Sync to Monday.com
        if (provider.mondayItemId) {
          updateMondayProviderItem(provider.mondayItemId, {
            organisationName: input.organisationName ?? provider.organisationName ?? provider.email,
            contactName: input.contactName,
            contactTitle: input.contactTitle,
            phone: input.phone,
            email: provider.email,
            companyType: input.companyType,
            regionsServiced: input.regionsServiced,
          }).catch(console.error);
        } else {
          // Create Monday item if not yet synced
          createMondayProviderItem({
            organisationName: input.organisationName ?? provider.organisationName ?? provider.email,
            contactName: input.contactName,
            contactTitle: input.contactTitle,
            phone: input.phone,
            email: provider.email,
            companyType: input.companyType,
            regionsServiced: input.regionsServiced,
          })
            .then(async (mondayItemId) => {
              if (mondayItemId) await updateProvider(provider.id, { mondayItemId });
            })
            .catch(console.error);
        }

        const updated = await getProviderById(provider.id);
        return { success: true, provider: sanitizeProvider(updated!) };
      }),
  }),

  // ─── Accommodation listings ────────────────────────────────────────────────
  accommodation: router({
    create: providerProcedure
      .input(
        z.object({
          propertyName: z.string().min(2),
          address: z.string().min(5),
          suburb: z.string().min(2),
          state: StateEnum,
          postcode: z.string().min(4).max(4),
          propertyType: PropertyTypeEnum,
          sdaCategory: SdaCategoryEnum.optional(),
          vacancyStatus: VacancyStatusEnum.default("Available"),
          availableRooms: z.number().int().min(0).default(0),
          totalRooms: z.number().int().min(1).default(1),
          supportNeeds: z.string().optional(),
          description: z.string().optional(),
          propertyLink: z.string().url().optional().or(z.literal("")),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const id = await createAccommodation({ ...input, providerId: ctx.provider.id });
        return { success: true, id };
      }),

    update: providerProcedure
      .input(
        z.object({
          id: z.number(),
          propertyName: z.string().min(2).optional(),
          address: z.string().min(5).optional(),
          suburb: z.string().min(2).optional(),
          state: StateEnum.optional(),
          postcode: z.string().min(4).max(4).optional(),
          propertyType: PropertyTypeEnum.optional(),
          sdaCategory: SdaCategoryEnum.optional(),
          vacancyStatus: VacancyStatusEnum.optional(),
          availableRooms: z.number().int().min(0).optional(),
          totalRooms: z.number().int().min(1).optional(),
          supportNeeds: z.string().optional(),
          description: z.string().optional(),
          propertyLink: z.string().url().optional().or(z.literal("")),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;
        const acc = await getAccommodationById(id);
        if (!acc) throw new TRPCError({ code: "NOT_FOUND" });
        if (acc.providerId !== ctx.provider.id) throw new TRPCError({ code: "FORBIDDEN" });
        await updateAccommodation(id, data);
        return { success: true };
      }),

    delete: providerProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const acc = await getAccommodationById(input.id);
        if (!acc) throw new TRPCError({ code: "NOT_FOUND" });
        if (acc.providerId !== ctx.provider.id) throw new TRPCError({ code: "FORBIDDEN" });
        await deleteAccommodation(input.id);
        return { success: true };
      }),

    listMine: providerProcedure.query(async ({ ctx }) => {
      return getAccommodationsByProvider(ctx.provider.id);
    }),

    // Staff-only: search all accommodations
    search: staffProcedure
      .input(
        z.object({
          state: z.string().optional(),
          propertyType: z.string().optional(),
          vacancyStatus: z.string().optional(),
          supportNeeds: z.string().optional(),
          suburb: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        return searchAccommodations(input);
      }),
  }),

  // ─── Blog ────────────────────────────────────────────────────────────────────────────────
  blog: blogRouter,
});

export type AppRouter = typeof appRouter;


// ─── Helpers ──────────────────────────────────────────────────────────────────
function sanitizeProvider(p: import("../drizzle/schema").Provider) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, mondayItemId, ...safe } = p;
  return safe;
}
