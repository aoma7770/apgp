// APGP Logo component — uses the luxury thin-frame vector logo
// Full logo (navy text, for light backgrounds): /manus-storage/apgp-logo-full_01e8f135.png
// White logo (white text, for dark backgrounds): /manus-storage/apgp-logo-white_fc9be53a.png
// Compact square (for favicon-style use): /manus-storage/apgp-logo-compact_672ef147.png
// Favicon: /manus-storage/apgp-favicon_d3c8db26.png

const LOGO_FULL = "/manus-storage/apgp-logo-full_01e8f135.png";
const LOGO_WHITE = "/manus-storage/apgp-logo-white_fc9be53a.png";
const LOGO_COMPACT = "/manus-storage/apgp-logo-compact_672ef147.png";

interface APGPLogoProps {
  variant?: "full" | "white" | "compact";
  className?: string;
  height?: number;
}

export default function APGPLogo({ variant = "full", className = "", height = 40 }: APGPLogoProps) {
  const src = variant === "white" ? LOGO_WHITE : variant === "compact" ? LOGO_COMPACT : LOGO_FULL;
  const aspectRatio = variant === "compact" ? 1 : 2.69; // full/white are 560x200 (2.8:1), compact is 1:1
  const width = variant === "compact" ? height : Math.round(height * aspectRatio);

  return (
    <img
      src={src}
      alt="APGP — Accommodation Provider Growth Program"
      width={width}
      height={height}
      className={className}
      style={{ objectFit: "contain", display: "block" }}
    />
  );
}

export { LOGO_FULL, LOGO_WHITE, LOGO_COMPACT };
