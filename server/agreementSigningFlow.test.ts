import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./leadsDb", () => ({
  createLead: vi.fn(),
  createProviderInterest: vi.fn().mockResolvedValue(1),
  getInterestsByProvider: vi.fn().mockResolvedValue([]),
  hasProviderExpressedInterest: vi.fn().mockResolvedValue(false),
  listActiveLeads: vi.fn().mockResolvedValue([]),
}));

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(undefined),
  getProviderBySessionToken: vi.fn(),
}));

vi.mock("./_core/notification", () => ({ notifyOwner: vi.fn().mockResolvedValue(true) }));

import { leadsRouter } from "./routers/leads";
import { createProviderInterest, hasProviderExpressedInterest } from "./leadsDb";
import { getProviderBySessionToken } from "./db";
import type { TrpcContext } from "./_core/context";

const provider = {
  id: 41,
  email: "authorised@provider.com",
  organisationName: "Authorised Disability Housing",
  abn: "12345678901",
} as any;

function providerContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: { authorization: "Bearer fresh-agreement-token" }, cookies: { apgp_provider_session: "stale-cookie" } } as TrpcContext["req"],
    res: { cookie: vi.fn(), clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("provider referral agreement signing flow", () => {
  beforeEach(() => {
    vi.mocked(getProviderBySessionToken).mockResolvedValue(provider);
    vi.mocked(hasProviderExpressedInterest).mockResolvedValue(false);
    vi.mocked(createProviderInterest).mockClear();
  });

  it("requires both referral agreement and Terms confirmations before accepting a signed referral", async () => {
    const caller = leadsRouter.createCaller(providerContext());

    await expect(caller.expressInterest({
      leadId: 77,
      signatoryName: "Jordan Lee",
      signatoryOrg: "Authorised Disability Housing",
      referralAgreementSigned: true,
      consentSigned: false as true,
    })).rejects.toThrow();
  });

  it("records a valid v06 agreement submission using the fresh provider session", async () => {
    const caller = leadsRouter.createCaller(providerContext());
    await expect(caller.expressInterest({
      leadId: 77,
      signatoryName: "Jordan Lee",
      signatoryOrg: "Authorised Disability Housing",
      providerNotes: "Silara Marketing Referral Agreement v06. ABN: 12345678901.",
      referralAgreementSigned: true,
      consentSigned: true,
    })).resolves.toEqual({ success: true });

    expect(getProviderBySessionToken).toHaveBeenCalledWith("fresh-agreement-token");
    expect(createProviderInterest).toHaveBeenCalledWith(expect.objectContaining({
      leadId: 77,
      providerId: 41,
      signatoryName: "Jordan Lee",
      signatoryOrg: "Authorised Disability Housing",
      referralAgreementSigned: true,
      consentSigned: true,
      providerNotes: expect.stringContaining("Referral Agreement v06"),
    }));
  });
});
