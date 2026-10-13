import { useId } from "react";
import { brand } from "../brand";

/**
 * Wordmark: tall condensed Bodoni capitals with the Allura tagline cutting
 * through them. The mask knocks a gap out of the capitals around the script.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  const maskId = `wordmark-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;

  const script = (
    <text
      x="470"
      y="176"
      textAnchor="middle"
      fontSize="128"
      textLength="500"
      lengthAdjust="spacingAndGlyphs"
      transform="rotate(-4 470 160)"
      style={{ fontFamily: "Allura, cursive" }}
    >
      {brand.tagline}
    </text>
  );

  return (
    <svg
      viewBox="0 0 940 264"
      className={className}
      role="img"
      aria-label={`${brand.name} ${brand.tagline}`}
      fill="currentColor"
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect width="940" height="264" fill="white" />
          <g fill="black" stroke="black" strokeWidth="18" strokeLinejoin="round">
            {script}
          </g>
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <text
          x="470"
          y="200"
          textAnchor="middle"
          fontSize="262"
          textLength="930"
          lengthAdjust="spacingAndGlyphs"
          transform="translate(0 -1) scale(1 1.28)"
          style={{ fontFamily: "LibreBodoni, serif", fontWeight: 400 }}
        >
          {brand.name.toUpperCase()}
        </text>
      </g>
      {script}
    </svg>
  );
}

/** Coupe glass under a crescent moon, inside a loosely drawn ring. */
export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="60" cy="60" r="54" strokeWidth="3" />
      <path d="M17 44 A47 49 0 0 1 96 27" strokeWidth="1.4" opacity="0.6" />
      <path d="M33 47 H87 C87 63 75 72 60 72 C45 72 33 63 33 47 Z" strokeWidth="3" />
      <path d="M38 54 H82" strokeWidth="1.4" opacity="0.55" />
      <path d="M60 72 V93" strokeWidth="3" />
      <path d="M46 95 H74" strokeWidth="3.4" />
      <path
        d="M75 22 a10 10 0 1 0 10 14 a8 8 0 1 1 -10 -14 Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

/** Mark stacked over the wordmark, as used in the footer. */
export function FullLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <Mark className="w-[30%]" />
      <Wordmark className="w-full" />
    </div>
  );
}
