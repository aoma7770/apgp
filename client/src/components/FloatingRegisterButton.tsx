import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingRegisterButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 right-6 z-[90]"
        >
          <Link href="/provider/register">
            <button
              className="flex items-center gap-2 bg-teal hover:bg-teal-600 active:scale-95 text-white font-bold text-sm px-5 py-3 rounded-full shadow-2xl shadow-teal/40 ring-2 ring-white/20 transition-all duration-150"
              aria-label="Register for APGP — Free"
            >
              Register Free
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
