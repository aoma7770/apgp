import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  clearPortalSession,
  getActivePortalRole,
  isPortalSessionInactive,
  PORTAL_IDLE_TIMEOUT_MS,
  recordPortalActivity,
} from "@/lib/portalSession";

const ACTIVITY_EVENTS = ["pointerdown", "keydown", "scroll", "focus"] as const;
const TOUCH_INTERVAL_MS = 60 * 1000;

export default function PortalSessionGuard() {
  const [location] = useLocation();
  const providerTouch = trpc.provider.touchSession.useMutation();
  const adminTouch = trpc.adminAuth.touchSession.useMutation();
  const lastTouchAt = useRef(0);

  const expireSession = useCallback(() => {
    const role = getActivePortalRole();
    if (!role) return;
    clearPortalSession(role);
    toast.info("Your portal session ended after 30 minutes of inactivity.");
    if (location.startsWith("/provider/")) window.location.assign("/provider/login");
    if (location.startsWith("/admin/") || location.startsWith("/staff/")) window.location.assign("/admin/login");
  }, [location]);

  useEffect(() => {
    const role = getActivePortalRole();
    if (!role) return;

    const handleActivity = () => {
      if (isPortalSessionInactive()) {
        expireSession();
        return;
      }
      recordPortalActivity();
      const now = Date.now();
      if (now - lastTouchAt.current < TOUCH_INTERVAL_MS) return;
      lastTouchAt.current = now;
      if (role === "provider") providerTouch.mutate();
      else adminTouch.mutate();
    };

    const timer = window.setInterval(() => {
      if (isPortalSessionInactive()) expireSession();
    }, Math.min(30 * 1000, PORTAL_IDLE_TIMEOUT_MS));

    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, handleActivity, { passive: true }));
    return () => {
      window.clearInterval(timer);
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, handleActivity));
    };
  }, [adminTouch, expireSession, providerTouch]);

  return null;
}
