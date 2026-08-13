import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const selectLimit = vi.fn();
  const selectWhere = vi.fn(() => ({ limit: selectLimit }));
  const selectJoin = vi.fn(() => ({ where: selectWhere }));
  const selectFrom = vi.fn(() => ({ innerJoin: selectJoin }));
  const select = vi.fn(() => ({ from: selectFrom }));
  const updateWhere = vi.fn();
  const updateSet = vi.fn(() => ({ where: updateWhere }));
  const update = vi.fn(() => ({ set: updateSet }));
  const getDb = vi.fn().mockResolvedValue({ select, update });
  return { getDb, selectLimit, selectWhere, selectJoin, selectFrom, select, updateWhere, updateSet, update };
});

vi.mock("./db", () => ({ getDb: mocks.getDb }));

import { getAdminFromRequest } from "./routers/adminAuth";

describe("admin session renewal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getDb.mockResolvedValue({ select: mocks.select, update: mocks.update });
  });

  it("renews an active admin session for 30 minutes after a valid request", async () => {
    const admin = { id: 7, username: "admin", isActive: true };
    mocks.selectLimit.mockResolvedValue([{ admin }]);

    const result = await getAdminFromRequest({ headers: { authorization: "Bearer active-admin-token" } });

    expect(result).toEqual(admin);
    expect(mocks.update).toHaveBeenCalledOnce();
    expect(mocks.updateSet).toHaveBeenCalledWith({ expiresAt: expect.any(Date) });
    expect(mocks.updateWhere).toHaveBeenCalledOnce();
    const renewalTime = mocks.updateSet.mock.calls[0]?.[0]?.expiresAt as Date;
    expect(renewalTime.getTime() - Date.now()).toBeGreaterThan(29 * 60 * 1000);
    expect(renewalTime.getTime() - Date.now()).toBeLessThanOrEqual(30 * 60 * 1000);
  });

  it("returns no admin and does not renew an expired or missing session", async () => {
    mocks.selectLimit.mockResolvedValue([]);

    const result = await getAdminFromRequest({ headers: { authorization: "Bearer expired-admin-token" } });

    expect(result).toBeNull();
    expect(mocks.update).not.toHaveBeenCalled();
  });
});
