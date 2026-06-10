import { TRPCError } from "@trpc/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { eq, and, gt } from "drizzle-orm";
import { adminUsers, adminSessions } from "../../drizzle/schema";
import { getDb } from "../db";
import { publicProcedure, router } from "../_core/trpc";

const ADMIN_COOKIE = "apgp_admin_session";
const COOKIE_MAX_AGE = 8 * 60 * 60; // 8 hours

// ─── Middleware: require admin session ────────────────────────────────────────
async function getAdminFromRequest(req: { cookies?: Record<string, string>; headers?: Record<string, string> }) {
  const cookieToken = req.cookies?.[ADMIN_COOKIE];
  const authHeader = req.headers?.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const token = cookieToken || bearerToken;
  if (!token) return null;

  const db = await getDb();
  if (!db) return null;

  const now = new Date();
  const sessions = await db
    .select({ admin: adminUsers })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminSessions.adminId, adminUsers.id))
    .where(and(eq(adminSessions.token, token), gt(adminSessions.expiresAt, now)))
    .limit(1);

  return sessions[0]?.admin ?? null;
}

const adminProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const admin = await getAdminFromRequest(ctx.req as { cookies?: Record<string, string>; headers?: Record<string, string> });
  if (!admin || !admin.isActive) throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin login required" });
  return next({ ctx: { ...ctx, admin } });
});

const superAdminProcedure = adminProcedure.use(({ ctx, next }) => {
  if (ctx.admin.role !== "super_admin") throw new TRPCError({ code: "FORBIDDEN", message: "Super admin access required" });
  return next({ ctx });
});

export const adminAuthRouter = router({
  // Login with username/password
  login: publicProcedure
    .input(z.object({
      username: z.string().min(1),
      password: z.string().min(1),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const admins = await db.select().from(adminUsers)
        .where(eq(adminUsers.username, input.username.toLowerCase().trim()))
        .limit(1);

      const admin = admins[0];
      if (!admin || !admin.isActive) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid username or password" });
      }

      const valid = await bcrypt.compare(input.password, admin.passwordHash);
      if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid username or password" });

      const token = nanoid(64);
      const expiresAt = new Date(Date.now() + COOKIE_MAX_AGE * 1000);
      await db.insert(adminSessions).values({ adminId: admin.id, token, expiresAt });
      await db.update(adminUsers).set({ lastSignedIn: new Date() }).where(eq(adminUsers.id, admin.id));

      // Set cookie
      (ctx.res as { cookie: (name: string, value: string, opts: Record<string, unknown>) => void })
        .cookie(ADMIN_COOKIE, token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
          maxAge: COOKIE_MAX_AGE,
        });

      // Return token for localStorage fallback
      const { passwordHash: _, ...safeAdmin } = admin;
      return { success: true, token, admin: safeAdmin };
    }),

  // Get current admin
  me: publicProcedure.query(async ({ ctx }) => {
    const admin = await getAdminFromRequest(ctx.req as { cookies?: Record<string, string>; headers?: Record<string, string> });
    if (!admin || !admin.isActive) return null;
    const { passwordHash: _, ...safeAdmin } = admin;
    return safeAdmin;
  }),

  // Logout
  logout: adminProcedure.mutation(async ({ ctx }) => {
    const cookieToken = (ctx.req as { cookies?: Record<string, string> }).cookies?.[ADMIN_COOKIE];
    const authHeader = (ctx.req as { headers?: Record<string, string> }).headers?.authorization;
    const token = cookieToken || (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null);
    if (token) {
      const db = await getDb();
      if (db) await db.delete(adminSessions).where(eq(adminSessions.token, token));
    }
    (ctx.res as { clearCookie: (name: string, opts: Record<string, unknown>) => void })
      .clearCookie(ADMIN_COOKIE, { path: "/", sameSite: "none", secure: true, httpOnly: true });
    return { success: true };
  }),

  // Super admin: list all admin users
  listAdmins: superAdminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const admins = await db.select().from(adminUsers).orderBy(adminUsers.createdAt);
    return admins.map(({ passwordHash: _, ...a }) => a);
  }),

  // Super admin: create new admin user
  createAdmin: superAdminProcedure
    .input(z.object({
      username: z.string().min(3).max(64),
      email: z.string().email(),
      password: z.string().min(8),
      fullName: z.string().optional(),
      role: z.enum(["super_admin", "admin"]).default("admin"),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const existing = await db.select().from(adminUsers)
        .where(eq(adminUsers.username, input.username.toLowerCase().trim()))
        .limit(1);
      if (existing[0]) throw new TRPCError({ code: "CONFLICT", message: "Username already exists" });

      const passwordHash = await bcrypt.hash(input.password, 12);
      await db.insert(adminUsers).values({
        username: input.username.toLowerCase().trim(),
        email: input.email.toLowerCase().trim(),
        passwordHash,
        fullName: input.fullName ?? null,
        role: input.role,
      });
      return { success: true };
    }),

  // Super admin: toggle admin user active status
  toggleAdminActive: superAdminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (input.id === ctx.admin.id) throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot deactivate your own account" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const admins = await db.select().from(adminUsers).where(eq(adminUsers.id, input.id)).limit(1);
      if (!admins[0]) throw new TRPCError({ code: "NOT_FOUND" });
      await db.update(adminUsers).set({ isActive: !admins[0].isActive }).where(eq(adminUsers.id, input.id));
      return { success: true };
    }),

  // Super admin: reset password
  resetPassword: superAdminProcedure
    .input(z.object({ id: z.number(), newPassword: z.string().min(8) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const passwordHash = await bcrypt.hash(input.newPassword, 12);
      await db.update(adminUsers).set({ passwordHash }).where(eq(adminUsers.id, input.id));
      return { success: true };
    }),

  // Admin: change own password
  changePassword: adminProcedure
    .input(z.object({ currentPassword: z.string(), newPassword: z.string().min(8) }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      const admins = await db.select().from(adminUsers).where(eq(adminUsers.id, ctx.admin.id)).limit(1);
      const valid = await bcrypt.compare(input.currentPassword, admins[0]!.passwordHash);
      if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Current password is incorrect" });
      const passwordHash = await bcrypt.hash(input.newPassword, 12);
      await db.update(adminUsers).set({ passwordHash }).where(eq(adminUsers.id, ctx.admin.id));
      return { success: true };
    }),
});
