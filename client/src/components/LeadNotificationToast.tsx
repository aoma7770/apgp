/**
 * LeadNotificationToast
 *
 * Polls the public recentForNotifications endpoint every 30 seconds.
 * When a new lead appears (id not seen before), it shows a professional
 * sliding notification in the bottom-left corner of the screen.
 *
 * Visible on public pages to entice providers to register.
 * Also visible inside the provider dashboard.
 */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MapPin, Clock, CheckCircle2, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import JotformModal from "./JotformModal";

interface Notification {
  id: number;
  accommodationType: string;
  preferredState: string;
  moveInTimeline: string;
  ndisRegistered: string;
  createdAt: Date;
  shownAt: number; // timestamp when we displayed it
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return `${Math.floor(hours / 24)} day${Math.floor(hours / 24) === 1 ? "" : "s"} ago`;
}

function shortAccomType(type: string): string {
  if (type.startsWith("SDA")) return "SDA Accommodation";
  if (type.startsWith("SIL")) return "SIL Accommodation";
  if (type.startsWith("STA")) return "Short-Term Accommodation";
  if (type.startsWith("MTA")) return "Medium-Term Accommodation";
  return "NDIS Accommodation";
}

function ToastCard({
  notification,
  onDismiss,
  isPublic,
}: {
  notification: Notification;
  onDismiss: () => void;
  isPublic: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [elapsed, setElapsed] = useState(timeAgo(notification.createdAt));

  // Slide in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    const t = setTimeout(() => handleDismiss(), 8000);
    return () => clearTimeout(t);
  }, []);

  // Update relative time every 30 seconds
  useEffect(() => {
    const t = setInterval(() => setElapsed(timeAgo(notification.createdAt)), 30000);
    return () => clearInterval(t);
  }, [notification.createdAt]);

  const handleDismiss = () => {
    setLeaving(true);
    setTimeout(onDismiss, 350);
  };

  return (
    <div
      style={{
        transform: visible && !leaving ? "translateX(0)" : "translateX(-120%)",
        opacity: visible && !leaving ? 1 : 0,
        transition: "transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.35s ease",
        background: "white",
        borderRadius: "0.875rem",
        boxShadow: "0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        width: "320px",
        maxWidth: "calc(100vw - 2rem)",
        position: "relative",
      }}
    >
      {/* Teal accent bar */}
      <div style={{ height: "3px", background: "linear-gradient(90deg, oklch(0.65 0.15 195), oklch(0.55 0.18 195))" }} />

      <div style={{ padding: "0.875rem 1rem" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: "oklch(0.65 0.15 195)",
              boxShadow: "0 0 0 3px rgba(20,184,166,0.2)",
              animation: "pulse 2s infinite",
              flexShrink: 0,
              marginTop: "2px",
            }} />
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "oklch(0.65 0.15 195)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              New Participant Enquiry
            </span>
          </div>
          <button
            onClick={handleDismiss}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: "0", lineHeight: 1, flexShrink: 0 }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Main message */}
        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "oklch(0.22 0.07 245)", margin: "0 0 0.5rem 0", lineHeight: 1.4 }}>
          A participant from{" "}
          <span style={{ color: "oklch(0.65 0.15 195)" }}>{notification.preferredState}</span>{" "}
          just requested{" "}
          <span style={{ color: "oklch(0.22 0.07 245)" }}>{shortAccomType(notification.accommodationType)}</span>
        </p>

        {/* Details row */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.625rem" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.72rem", color: "#6b7280" }}>
            <MapPin size={11} />
            {notification.preferredState}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.72rem", color: "#6b7280" }}>
            <Clock size={11} />
            {notification.moveInTimeline}
          </span>
          {notification.ndisRegistered === "Yes" && (
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.72rem", color: "#16a34a", fontWeight: 600 }}>
              <CheckCircle2 size={11} />
              NDIS Registered
            </span>
          )}
        </div>

        {/* Timestamp + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>{elapsed}</span>
          {isPublic ? (
            <JotformModal
              label="Register to View"
              size="sm"
              showArrow={false}
              buttonClassName="text-xs px-3 py-1.5 h-auto"
            />
          ) : (
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "oklch(0.65 0.15 195)" }}>
              View in Live Enquiries →
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface LeadNotificationToastProps {
  /** If true, shows a Register CTA. If false (provider dashboard), shows "View in Live Enquiries" */
  isPublic?: boolean;
}

export default function LeadNotificationToast({ isPublic = true }: LeadNotificationToastProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const seenIds = useRef<Set<number>>(new Set());
  const initialLoad = useRef(true);

  const { data: recentLeads } = trpc.leads.recentForNotifications.useQuery(undefined, {
    refetchInterval: 30000, // poll every 30 seconds
    refetchIntervalInBackground: false,
  });

  useEffect(() => {
    if (!recentLeads) return;

    if (initialLoad.current) {
      // On first load, mark all existing leads as seen — don't show notifications for old leads
      recentLeads.forEach((l) => seenIds.current.add(l.id));
      initialLoad.current = false;
      return;
    }

    // On subsequent polls, find leads we haven't seen before
    const newLeads = recentLeads.filter((l) => !seenIds.current.has(l.id));
    newLeads.forEach((l) => seenIds.current.add(l.id));

    if (newLeads.length > 0) {
      const newNotifications: Notification[] = newLeads.map((l) => ({
        ...l,
        shownAt: Date.now(),
      }));
      setNotifications((prev) => [...prev, ...newNotifications].slice(-3)); // max 3 stacked
    }
  }, [recentLeads]);

  const dismiss = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        bottom: "5rem", // above the floating register button
        left: "1rem",
        zIndex: 9990,
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        pointerEvents: "none",
      }}
    >
      {notifications.map((n) => (
        <div key={n.id} style={{ pointerEvents: "all" }}>
          <ToastCard
            notification={n}
            onDismiss={() => dismiss(n.id)}
            isPublic={isPublic}
          />
        </div>
      ))}
    </div>,
    document.body
  );
}
