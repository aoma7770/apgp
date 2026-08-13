export type PortalRole = "provider" | "admin";

export const PROVIDER_TOKEN_KEY = "apgp_provider_token";
export const ADMIN_TOKEN_KEY = "apgp_admin_token";
const ACTIVE_PORTAL_ROLE_KEY = "apgp_active_portal_role";
const LAST_ACTIVITY_KEY = "apgp_portal_last_activity";
export const PORTAL_IDLE_TIMEOUT_MS = 30 * 60 * 1000;

function browserStorage() {
  if (typeof window === "undefined") return null;
  return { local: window.localStorage, session: window.sessionStorage };
}

function tokenKeyFor(role: PortalRole) {
  return role === "admin" ? ADMIN_TOKEN_KEY : PROVIDER_TOKEN_KEY;
}

export function beginPortalSession(role: PortalRole, token: string) {
  const storage = browserStorage();
  if (!storage) return;
  storage.session.setItem(tokenKeyFor(role), token);
  storage.session.setItem(ACTIVE_PORTAL_ROLE_KEY, role);
  storage.local.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
}

export function getActivePortalRole(): PortalRole | null {
  const storage = browserStorage();
  if (!storage) return null;
  const role = storage.session.getItem(ACTIVE_PORTAL_ROLE_KEY);
  return role === "provider" || role === "admin" ? role : null;
}

export function getActivePortalToken() {
  const storage = browserStorage();
  const role = getActivePortalRole();
  if (!storage || !role) return null;
  return storage.session.getItem(tokenKeyFor(role));
}

export function getPortalToken(role: PortalRole) {
  const storage = browserStorage();
  if (!storage || getActivePortalRole() !== role) return null;
  return storage.session.getItem(tokenKeyFor(role));
}

export function recordPortalActivity() {
  const storage = browserStorage();
  if (!storage || !getActivePortalRole()) return;
  storage.local.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
}

export function isPortalSessionInactive(now = Date.now()) {
  const storage = browserStorage();
  if (!storage || !getActivePortalRole()) return false;
  const lastActivity = Number(storage.local.getItem(LAST_ACTIVITY_KEY));
  return !lastActivity || now - lastActivity >= PORTAL_IDLE_TIMEOUT_MS;
}

export function clearPortalSession(role?: PortalRole) {
  const storage = browserStorage();
  if (!storage) return;
  const activeRole = getActivePortalRole();
  const roleToClear = role ?? activeRole;
  if (roleToClear) storage.session.removeItem(tokenKeyFor(roleToClear));
  if (!role || activeRole === role) {
    storage.session.removeItem(ACTIVE_PORTAL_ROLE_KEY);
    storage.local.removeItem(LAST_ACTIVITY_KEY);
  }
}

export function migrateLegacyPortalToken() {
  const storage = browserStorage();
  if (!storage || getActivePortalRole()) return;
  const legacyAdminToken = storage.local.getItem(ADMIN_TOKEN_KEY);
  const legacyProviderToken = storage.local.getItem(PROVIDER_TOKEN_KEY);
  const role: PortalRole | null = legacyAdminToken ? "admin" : legacyProviderToken ? "provider" : null;
  if (!role) return;
  const token = role === "admin" ? legacyAdminToken : legacyProviderToken;
  if (token) beginPortalSession(role, token);
  storage.local.removeItem(ADMIN_TOKEN_KEY);
  storage.local.removeItem(PROVIDER_TOKEN_KEY);
}

export function openPublicHomeWithoutLeavingPortal() {
  if (typeof window === "undefined") return;
  // A same-origin child tab receives a copy of this session's sessionStorage.
  window.open("/", "_blank");
}
