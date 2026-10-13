import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
gsap.defaults({ ease: "power3.out" });

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Letter-by-letter rise used by every section title. Each group starts a
 * little before the previous one finishes so the lines read as one gesture.
 */
export function revealChars(
  groups: (Element | null)[],
  trigger: Element,
  start = "top 70%",
) {
  const tl = gsap.timeline({
    scrollTrigger: { trigger, start, once: true },
  });

  groups.forEach((group, i) => {
    if (!group) return;
    tl.from(
      group.children,
      {
        yPercent: 120,
        opacity: 0,
        duration: i === 0 ? 0.8 : 0.6,
        stagger: i === 0 ? 0.028 : 0.008,
        ease: "back.out(1.4)",
      },
      i === 0 ? 0 : "-=0.55",
    );
  });

  return tl;
}

export { gsap, ScrollTrigger, useGSAP };
