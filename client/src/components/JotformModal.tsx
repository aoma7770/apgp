import { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const JOTFORM_URL = "https://form.jotform.com/253411013737044";

interface JotformModalProps {
  /** Label shown on the trigger button */
  label?: string;
  /** Extra Tailwind classes applied to the trigger button */
  buttonClassName?: string;
  /** Button size variant */
  size?: "default" | "sm" | "lg";
  /** Show arrow icon on button */
  showArrow?: boolean;
  /** Render a custom trigger instead of the default button */
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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* Trigger */}
      {trigger ? (
        trigger(() => setOpen(true))
      ) : (
        <Button
          size={size}
          className={cn(
            "bg-teal hover:bg-teal-600 text-white font-semibold transition-all",
            buttonClassName
          )}
          onClick={() => setOpen(true)}
        >
          {label}
          {showArrow && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      )}

      {/* Modal overlay — fixed, full viewport, flex-centred */}
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ padding: '1rem' }}
          role="dialog"
          aria-modal="true"
          aria-label="Expression of Interest Form"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal panel — centred card */}
          <div
            className="relative z-10 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              margin: 'auto',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-navy text-white shrink-0">
              <div>
                <h2 className="font-bold font-heading text-lg">Expression of Interest</h2>
                <p className="text-xs text-teal-300 mt-0.5">Accommodation Provider Growth Program — Free Registration</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                aria-label="Close form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Jotform iframe */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={JOTFORM_URL}
                title="APGP Expression of Interest Form"
                className="w-full h-full min-h-[560px] border-0"
                allow="geolocation; microphone; camera"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
