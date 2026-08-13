import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  beginPortalSession,
  clearPortalSession,
  getActivePortalRole,
  getActivePortalToken,
  isPortalSessionInactive,
  openPublicHomeWithoutLeavingPortal,
  PORTAL_IDLE_TIMEOUT_MS,
  recordPortalActivity,
} from "../client/src/lib/portalSession";

class MemoryStorage {
  private values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, String(value)); }
  removeItem(key: string) { this.values.delete(key); }
}

describe("portal session storage", () => {
  const open = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-13T00:00:00.000Z"));
    vi.stubGlobal("window", { localStorage: new MemoryStorage(), sessionStorage: new MemoryStorage(), open });
    open.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("keeps the active portal token in session storage and expires after 30 minutes without activity", () => {
    beginPortalSession("provider", "provider-token");

    expect(getActivePortalRole()).toBe("provider");
    expect(getActivePortalToken()).toBe("provider-token");
    expect(isPortalSessionInactive()).toBe(false);

    vi.advanceTimersByTime(PORTAL_IDLE_TIMEOUT_MS - 1);
    expect(isPortalSessionInactive()).toBe(false);
    vi.advanceTimersByTime(1);
    expect(isPortalSessionInactive()).toBe(true);
  });

  it("renews the inactivity window only after recorded activity and clears on explicit sign-out", () => {
    beginPortalSession("admin", "admin-token");
    vi.advanceTimersByTime(PORTAL_IDLE_TIMEOUT_MS - 1);
    recordPortalActivity();
    vi.advanceTimersByTime(PORTAL_IDLE_TIMEOUT_MS - 1);

    expect(isPortalSessionInactive()).toBe(false);
    clearPortalSession("admin");
    expect(getActivePortalRole()).toBeNull();
    expect(getActivePortalToken()).toBeNull();
  });

  it("opens the public homepage in a separate tab so the portal remains open", () => {
    openPublicHomeWithoutLeavingPortal();
    expect(open).toHaveBeenCalledWith("/", "_blank");
  });
});
