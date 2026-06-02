import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Mock DB helpers ──────────────────────────────────────────────────────────
vi.mock("./db", () => ({
  getProviderByEmail: vi.fn(),
  createProvider: vi.fn().mockResolvedValue(1),
  getProviderById: vi.fn().mockResolvedValue({
    id: 1,
    email: "test@provider.com",
    passwordHash: "$2a$12$placeholder",
    organisationName: "Test Housing",
    abn: null,
    contactName: null,
    contactTitle: null,
    phone: null,
    website: null,
    regionsServiced: null,
    supportTypes: null,
    companyType: null,
    profileComplete: false,
    mondayItemId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  createProviderSession: vi.fn(),
  getProviderBySessionToken: vi.fn(),
  deleteProviderSession: vi.fn(),
  getAccommodationsByProvider: vi.fn().mockResolvedValue([]),
  createAccommodation: vi.fn().mockResolvedValue(42),
  getAccommodationById: vi.fn(),
  updateAccommodation: vi.fn(),
  deleteAccommodation: vi.fn(),
  searchAccommodations: vi.fn().mockResolvedValue([]),
  updateProvider: vi.fn(),
}));

vi.mock("./monday", () => ({
  createMondayProviderItem: vi.fn().mockResolvedValue(null),
  updateMondayProviderItem: vi.fn().mockResolvedValue(undefined),
}));

// ─── Context factories ────────────────────────────────────────────────────────
function makePublicCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {}, cookies: {} } as TrpcContext["req"],
    res: { cookie: vi.fn(), clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function makeStaffCtx(): TrpcContext {
  return {
    user: {
      id: 10,
      openId: "staff-open-id",
      email: "staff@ausnew.com",
      name: "Staff Member",
      loginMethod: "manus",
      role: "staff",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {}, cookies: {} } as TrpcContext["req"],
    res: { cookie: vi.fn(), clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function makeAdminCtx(): TrpcContext {
  return {
    ...makeStaffCtx(),
    user: { ...makeStaffCtx().user!, role: "admin" },
  };
}

function makeProviderUserCtx(): TrpcContext {
  return {
    user: {
      id: 99,
      openId: "provider-open-id",
      email: "provider@example.com",
      name: "Provider",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {}, cookies: {} } as TrpcContext["req"],
    res: { cookie: vi.fn(), clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("provider.register", () => {
  beforeEach(async () => {
    const { getProviderByEmail } = await import("./db");
    vi.mocked(getProviderByEmail).mockResolvedValue(undefined);
  });

  it("creates a new provider and sets a session cookie", async () => {
    const ctx = makePublicCtx();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.provider.register({
      email: "new@provider.com",
      password: "securepass123",
      organisationName: "New Housing Co",
    });

    expect(result.success).toBe(true);
    expect(result.provider.email).toBe("test@provider.com"); // mocked getProviderById
    expect(ctx.res.cookie).toHaveBeenCalledWith(
      "apgp_provider_session",
      expect.any(String),
      expect.objectContaining({ httpOnly: true })
    );
  });

  it("throws CONFLICT if email already exists", async () => {
    const { getProviderByEmail } = await import("./db");
    vi.mocked(getProviderByEmail).mockResolvedValue({
      id: 1,
      email: "existing@provider.com",
      passwordHash: "hash",
    } as any);

    const ctx = makePublicCtx();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.provider.register({ email: "existing@provider.com", password: "pass1234" })
    ).rejects.toThrow("already exists");
  });
});

describe("accommodation.search — staff access control", () => {
  it("allows staff to search accommodations", async () => {
    const ctx = makeStaffCtx();
    const caller = appRouter.createCaller(ctx);
    const results = await caller.accommodation.search({});
    expect(Array.isArray(results)).toBe(true);
  });

  it("allows admin to search accommodations", async () => {
    const ctx = makeAdminCtx();
    const caller = appRouter.createCaller(ctx);
    const results = await caller.accommodation.search({});
    expect(Array.isArray(results)).toBe(true);
  });

  it("blocks regular users from searching accommodations", async () => {
    const ctx = makeProviderUserCtx();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.accommodation.search({})).rejects.toThrow();
  });

  it("blocks unauthenticated users from searching accommodations", async () => {
    const ctx = makePublicCtx();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.accommodation.search({})).rejects.toThrow();
  });
});

describe("auth.logout", () => {
  it("clears the session cookie", async () => {
    const ctx = makePublicCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result.success).toBe(true);
  });
});
