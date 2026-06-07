import { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const JOTFORM_URL = "https://form.jotform.com/253411013737044";

interface JotformModalProps {
  label?: string;
  buttonClassName?: string;
  size?: "default" | "sm" | "lg";
  showArrow?: boolean;
  trigger?: (open: () => void) => React.ReactNode;
}

export default function JotformModal({
  label = "Register Now — Free",
  buttonClassName,
  size = "default",
  showArrow = true,
  trigger,
}: JotformModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {trigger ? (
        trigger(() => setOpen(true))
      ) : (
        <Button
          size={size}
          className={cn("bg-teal hover:bg-teal-600 text-white font-semibold transition-all", buttonClassName)}
          onClick={() => setOpen(true)}
        >
          {label}
          {showArrow && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      )}

      {open && (
        <>
          {/* Full-screen backdrop — sits above everything including sticky nav */}
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
            style={{ zIndex: 9998 }}
            onClick={() => setOpen(false)}
          />

          {/* Modal panel — perfectly centred using fixed + transform */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Expression of Interest Form"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
              width: "calc(100vw - 2rem)",
              maxWidth: "680px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              background: "white",
              borderRadius: "1rem",
              boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.5rem",
                borderBottom: "1px solid #e5e7eb",
                background: "oklch(0.22 0.07 245)",
                color: "white",
                flexShrink: 0,
              }}
            >
              <div>
                <p style={{ fontWeight: 700, fontSize: "1.05rem", fontFamily: "Poppins, sans-serif" }}>
                  Expression of Interest
                </p>
                <p style={{ fontSize: "0.72rem", color: "oklch(0.78 0.11 195)", marginTop: "2px" }}>
                  Accommodation Provider Growth Program — Free Registration
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close form"
                style={{
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <X size={20} />
              </button>
            </div>

            {/* Jotform iframe */}
            <div style={{ flex: 1, overflow: "hidden" }}>
              <iframe
                src={JOTFORM_URL}
                title="APGP Expression of Interest Form"
                style={{ width: "100%", height: "100%", minHeight: "560px", border: "none", display: "block" }}
                allow="geolocation; microphone; camera"
                loading="lazy"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
