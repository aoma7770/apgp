import { motion } from "framer-motion";

const variants = {
  left:   { hidden: { opacity: 0, x: -36 }, visible: { opacity: 1, x: 0 } },
  right:  { hidden: { opacity: 0, x: 36 },  visible: { opacity: 1, x: 0 } },
  bottom: { hidden: { opacity: 0, y: 32 },   visible: { opacity: 1, y: 0 } },
  scale:  { hidden: { opacity: 0, scale: 0.93 }, visible: { opacity: 1, scale: 1 } },
};

interface AnimateProps {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  delay?: number;
  className?: string;
}

export default function Animate({ children, variant = "bottom", delay = 0, className }: AnimateProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={variants[variant]}
      transition={{ delay, duration: 0.55 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
