import { describe, expect, it, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { getAdminFromCtx } from "./routers/adminAuth";

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
    recordProviderLoginEvent: vi.fn(),
    getProviderBySessionToken: vi.fn(),
    touchProviderSession: vi.fn(),
    getRegisteredProvidersForAdmin: vi.fn().mockResolvedValue([]),
  deleteProviderSession: vi.fn(),
  getAccommodationsByProvider: vi.fn().mockResolvedValue([]),
  createAccommodation: vi.fn().mockResolvedValue(42),
  getAccommodationById: vi.fn(),
  updateAccommodation: vi.fn(),
  deleteAccommodation: vi.fn(),
  searchAccommodations: vi.fn().mockResolvedValue([]),
  updateProvider: vi.fn(),
}));

vi.mock("./routers/adminAuth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./routers/adminAuth")>();
  return { ...actual, getAdminFromCtx: vi.fn() };
});

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
    const { getProviderByEmail, recordProviderLoginEvent } = await import("./db");
    vi.mocked(getProviderByEmail).mockResolvedValue(undefined);
    vi.mocked(recordProviderLoginEvent).mockClear();
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
      expect.objectContaining({ httpOnly: true, secure: true, sameSite: "none" })
    );
    expect(vi.mocked(ctx.res.cookie).mock.calls[0]?.[2]).not.toHaveProperty("maxAge");
    const { recordProviderLoginEvent } = await import("./db");
    expect(recordProviderLoginEvent).toHaveBeenCalledWith(1, "registered", expect.any(Date));
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

  it("sends new provider details to the configured Zapier registration webhook", async () => {
    const previousWebhook = process.env.ZAPIER_PROVIDER_WEBHOOK_URL;
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    process.env.ZAPIER_PROVIDER_WEBHOOK_URL = "https://hooks.zapier.test/provider";
    vi.stubGlobal("fetch", fetchMock);

    try {
      const caller = appRouter.createCaller(makePublicCtx());
      await caller.provider.register({
        email: "zapier@provider.com",
        password: "securepass123",
        organisationName: "Zapier Housing",
        contactName: "Jordan Provider",
        phone: "0400000000",
        companyType: "SDA",
        regionsServiced: "NSW,VIC",
        hasVacancies: true,
      });

      expect(fetchMock).toHaveBeenCalledWith("https://hooks.zapier.test/provider", expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }));
      const payload = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string);
      expect(payload).toMatchObject({
        event: "provider_registered",
        provider_email: "zapier@provider.com",
        organisation_name: "Zapier Housing",
        company_type: "SDA",
        states_serviced: "NSW,VIC",
        has_vacancies: "Yes",
      });
    } finally {
      if (previousWebhook === undefined) delete process.env.ZAPIER_PROVIDER_WEBHOOK_URL;
      else process.env.ZAPIER_PROVIDER_WEBHOOK_URL = previousWebhook;
      vi.unstubAllGlobals();
    }
  });
});

describe("provider.adminList — provider directory access control", () => {
  beforeEach(async () => {
    const { getRegisteredProvidersForAdmin } = await import("./db");
    vi.mocked(getRegisteredProvidersForAdmin).mockResolvedValue([]);
    vi.mocked(getAdminFromCtx).mockResolvedValue(null);
  });

  it("blocks unauthenticated access to registered provider details", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(caller.provider.adminList()).rejects.toThrow("Admin login required");
  });

  it("allows an authenticated active admin to view the safe provider directory", async () => {
    const { getRegisteredProvidersForAdmin } = await import("./db");
    vi.mocked(getAdminFromCtx).mockResolvedValue({ id: 7, isActive: true, role: "admin" } as any);
    vi.mocked(getRegisteredProvidersForAdmin).mockResolvedValue([
      { id: 1, email: "provider@example.com", organisationName: "Safe Housing", propertyCount: 0, activity: [] },
    ] as any);

    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.provider.adminList();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ email: "provider@example.com", organisationName: "Safe Housing" });
    expect(getRegisteredProvidersForAdmin).toHaveBeenCalledOnce();
  });
});

describe("provider login activity tracking", () => {
  const providerAccount = {
    id: 21,
    email: "active@provider.com",
    passwordHash: "",
    organisationName: "Active Provider Housing",
  } as any;

  beforeEach(async () => {
    const { deleteProviderSession, getProviderByEmail, getProviderBySessionToken, recordProviderLoginEvent, updateProvider } = await import("./db");
    providerAccount.passwordHash = await bcrypt.hash("securepass123", 8);
    vi.mocked(getProviderByEmail).mockResolvedValue(providerAccount);
    vi.mocked(getProviderBySessionToken).mockResolvedValue(providerAccount);
    vi.mocked(recordProviderLoginEvent).mockClear();
    vi.mocked(updateProvider).mockClear();
    vi.mocked(deleteProviderSession).mockClear();
  });

  it("records a successful login and updates the last login timestamp", async () => {
    const { recordProviderLoginEvent, updateProvider } = await import("./db");
    const ctx = makePublicCtx();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.provider.login({ email: providerAccount.email, password: "securepass123" });

    expect(result.success).toBe(true);
    expect(updateProvider).toHaveBeenCalledWith(providerAccount.id, { lastLoginAt: expect.any(Date) });
    expect(recordProviderLoginEvent).toHaveBeenCalledWith(providerAccount.id, "login", expect.any(Date));
  });

  it("allows a newly signed-in provider to retrieve their dashboard account profile with the issued token", async () => {
    const loginCaller = appRouter.createCaller(makePublicCtx());
    const signIn = await loginCaller.provider.login({ email: providerAccount.email, password: "securepass123" });
    const dashboardCtx = makePublicCtx();
    (dashboardCtx.req.headers as Record<string, string>).authorization = `Bearer ${signIn.token}`;
    const dashboardCaller = appRouter.createCaller(dashboardCtx);

    await expect(dashboardCaller.provider.me()).resolves.toMatchObject({
      id: providerAccount.id,
      email: providerAccount.email,
      organisationName: providerAccount.organisationName,
    });
  });

  it("records a provider sign-out event", async () => {
    const { deleteProviderSession, recordProviderLoginEvent } = await import("./db");
    const ctx = makePublicCtx();
    (ctx.req.cookies as Record<string, string>).apgp_provider_session = "active-provider-token";
    const caller = appRouter.createCaller(ctx);

    const result = await caller.provider.logout();

    expect(result.success).toBe(true);
    expect(recordProviderLoginEvent).toHaveBeenCalledWith(providerAccount.id, "logout");
    expect(deleteProviderSession).toHaveBeenCalledWith("active-provider-token");
  });

  it("renews an authenticated provider session after genuine portal activity", async () => {
    const { touchProviderSession } = await import("./db");
    const ctx = makePublicCtx();
    (ctx.req.headers as Record<string, string>).authorization = "Bearer active-provider-token";
    const caller = appRouter.createCaller(ctx);

    await expect(caller.provider.touchSession()).resolves.toEqual({ success: true });

    expect(touchProviderSession).toHaveBeenCalledWith("active-provider-token", expect.any(Date));
  });

  it("prefers a freshly issued provider bearer token over a stale browser cookie", async () => {
    const { touchProviderSession } = await import("./db");
    const ctx = makePublicCtx();
    (ctx.req.cookies as Record<string, string>).apgp_provider_session = "expired-cookie-token";
    (ctx.req.headers as Record<string, string>).authorization = "Bearer fresh-provider-token";
    const caller = appRouter.createCaller(ctx);

    await caller.provider.touchSession();

    expect(touchProviderSession).toHaveBeenCalledWith("fresh-provider-token", expect.any(Date));
  });
});

describe("accommodation CRUD — provider access", () => {
  const providerAccount = { id: 21, email: "properties@provider.com", passwordHash: "hash" } as any;

  function makeProviderSessionCtx() {
    const ctx = makePublicCtx();
    (ctx.req.headers as Record<string, string>).authorization = "Bearer provider-session-token";
    return ctx;
  }

  beforeEach(async () => {
    const { createAccommodation, deleteAccommodation, getAccommodationById, getAccommodationsByProvider, getProviderBySessionToken, updateAccommodation } = await import("./db");
    vi.mocked(getProviderBySessionToken).mockResolvedValue(providerAccount);
    vi.mocked(createAccommodation).mockResolvedValue(42);
    vi.mocked(getAccommodationsByProvider).mockResolvedValue([]);
    vi.mocked(getAccommodationById).mockResolvedValue({ id: 8, providerId: providerAccount.id } as any);
    vi.mocked(updateAccommodation).mockClear();
    vi.mocked(deleteAccommodation).mockClear();
  });

  it("allows an authenticated provider to create, read, update, and delete their own listing", async () => {
    const { createAccommodation, deleteAccommodation, getAccommodationsByProvider, updateAccommodation } = await import("./db");
    vi.mocked(getAccommodationsByProvider).mockResolvedValue([{ id: 8, providerId: providerAccount.id, propertyName: "My Home" }] as any);
    const caller = appRouter.createCaller(makeProviderSessionCtx());

    await expect(caller.accommodation.create({
      propertyName: "Example Accessible Home",
      address: "10 Example Street",
      suburb: "Sydney",
      state: "NSW",
      postcode: "2000",
      propertyType: "SDA",
    })).resolves.toEqual({ success: true, id: 42 });
    await expect(caller.accommodation.listMine()).resolves.toEqual([{ id: 8, providerId: providerAccount.id, propertyName: "My Home" }]);
    await expect(caller.accommodation.update({ id: 8, propertyName: "Updated Accessible Home" })).resolves.toEqual({ success: true });
    await expect(caller.accommodation.delete({ id: 8 })).resolves.toEqual({ success: true });

    expect(createAccommodation).toHaveBeenCalledWith(expect.objectContaining({ providerId: providerAccount.id, propertyName: "Example Accessible Home" }));
    expect(getAccommodationsByProvider).toHaveBeenCalledWith(providerAccount.id);
    expect(updateAccommodation).toHaveBeenCalledWith(8, { propertyName: "Updated Accessible Home" });
    expect(deleteAccommodation).toHaveBeenCalledWith(8);
  });

  it("blocks a provider from editing or deleting another provider's listing", async () => {
    const { getAccommodationById } = await import("./db");
    vi.mocked(getAccommodationById).mockResolvedValue({ id: 9, providerId: 999 } as any);
    const caller = appRouter.createCaller(makeProviderSessionCtx());

    await expect(caller.accommodation.update({ id: 9, propertyName: "Not Allowed" })).rejects.toThrow();
    await expect(caller.accommodation.delete({ id: 9 })).rejects.toThrow();
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
