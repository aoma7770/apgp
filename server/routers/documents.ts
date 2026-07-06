import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { providerDocuments } from "../../drizzle/schema";
import { getDb } from "../db";
import { storagePut } from "../storage";
import { publicProcedure, router } from "../_core/trpc";
import { getProviderBySessionToken } from "../db";

const PROVIDER_COOKIE = "apgp_provider_session";

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

export const documentsRouter = router({
  // Admin: list all signed agreements (admin copies, providerId = -1)
  adminList: publicProcedure.use(async ({ ctx, next }) => {
    const { getAdminFromCtx } = await import('./adminAuth');
    const admin = await getAdminFromCtx(ctx);
    if (!admin) throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
    return next({ ctx });
  }).query(async () => {
    const db = await getDb();
    if (!db) return [];
    const { desc } = await import('drizzle-orm');
    return db
      .select()
      .from(providerDocuments)
      .where(eq(providerDocuments.providerId, -1))
      .orderBy(desc(providerDocuments.uploadedAt));
  }),

  // List all documents for the logged-in provider
  list: providerProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select()
      .from(providerDocuments)
      .where(eq(providerDocuments.providerId, ctx.provider.id))
      .orderBy(providerDocuments.uploadedAt);
  }),

  // Upload a document (base64 encoded)
  upload: providerProcedure
    .input(
      z.object({
        fileName: z.string().min(1),
        fileType: z.string(),
        fileSize: z.number(),
        fileBase64: z.string(), // base64 encoded file content
        category: z.enum(["Referral Agreement", "Consent Form", "NDIS Registration", "Insurance", "Other"]).default("Other"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Decode base64
      const buffer = Buffer.from(input.fileBase64, "base64");
      const fileKey = `provider-docs/${ctx.provider.id}/${Date.now()}-${input.fileName}`;
      const { url } = await storagePut(fileKey, buffer, input.fileType);

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.insert(providerDocuments).values({
        providerId: ctx.provider.id,
        fileName: input.fileName,
        fileKey,
        fileUrl: url,
        fileType: input.fileType,
        fileSize: input.fileSize,
        category: input.category,
      });

      return { success: true, url };
    }),

  // Delete a document
  delete: providerProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      // Verify ownership
      const docs = await db
        .select()
        .from(providerDocuments)
        .where(eq(providerDocuments.id, input.id))
        .limit(1);
      if (!docs[0]) throw new TRPCError({ code: "NOT_FOUND" });
      if (docs[0].providerId !== ctx.provider.id) throw new TRPCError({ code: "FORBIDDEN" });
      await db.delete(providerDocuments).where(eq(providerDocuments.id, input.id));
      return { success: true };
    }),
});
