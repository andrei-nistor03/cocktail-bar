import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { setScrollLocked } from "../lib/smoothScroll";

interface CocktailLoaderProps {
  isReady: boolean;
  /** Fires as the curtain starts lifting, so the page can animate in beneath it. */
  onReveal?: () => void;
}

const MIN_DURATION = 3000;
// Never trap the visitor behind the loader if a 3D asset stalls.
const MAX_DURATION = 10000;

export default function CocktailLoader({ isReady, onReveal }: CocktailLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<SVGPathElement>(null);
  const layer2Ref = useRef<SVGPathElement>(null);
  const [hidden, setHidden] = useState(false);
  const modelReadyRef = useRef(false);
  const minTimeElapsedRef = useRef(false);
  const exitingRef = useRef(false);
  const onRevealRef = useRef(onReveal);

  useEffect(() => {
    onRevealRef.current = onReveal;
  });

  useGSAP(
    () => {
      setScrollLocked(true);
      // Pour: the two layers rise at slightly different rates, then keep sloshing.
      gsap.to(layer1Ref.current, { y: -150, duration: 2.6, ease: "power2.inOut" });
      gsap.to(layer2Ref.current, {
        y: -150,
        duration: 2.6,
        delay: 0.3,
        ease: "power2.inOut",
      });
      gsap.to(layer1Ref.current, {
        x: -8,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to(layer2Ref.current, {
        x: 8,
        duration: 1.7,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 12,
        duration: 0.8,
        ease: "power2.out",
      });
    },
    { scope: loaderRef },
  );

  const tryFadeOut = () => {
    if (!modelReadyRef.current || !minTimeElapsedRef.current) return;
    if (exitingRef.current || !loaderRef.current) return;
    exitingRef.current = true;

    const finish = () => {
      setScrollLocked(false);
      setHidden(true);
    };

    if (prefersReducedMotion()) {
      onRevealRef.current?.();
      gsap.to(loaderRef.current, { opacity: 0, duration: 0.4, onComplete: finish });
      return;
    }

    gsap
      .timeline({ onComplete: finish })
      .to(contentRef.current, {
        y: -24,
        opacity: 0,
        duration: 0.55,
        ease: "power2.in",
      })
      .add(() => onRevealRef.current?.(), "-=0.05")
      .to(
        loaderRef.current,
        {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1.1,
          ease: "expo.inOut",
        },
        "<",
      );
  };
  const tryFadeOutRef = useRef(tryFadeOut);

  useEffect(() => {
    tryFadeOutRef.current = tryFadeOut;
  });

  useEffect(() => {
    const minTimer = setTimeout(() => {
      minTimeElapsedRef.current = true;
      tryFadeOutRef.current();
    }, MIN_DURATION);
    const maxTimer = setTimeout(() => {
      modelReadyRef.current = true;
      tryFadeOutRef.current();
    }, MAX_DURATION);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    modelReadyRef.current = true;
    tryFadeOutRef.current();
  }, [isReady]);

  if (hidden) return null;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-[#0a0a0a]"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      role="status"
      aria-live="polite"
    >
      <div ref={contentRef} className="relative flex flex-col items-center">
        <svg
          width="100"
          height="160"
          viewBox="0 0 100 160"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="glass-clip">
              <path d="M8,5 L30,155 L70,155 L92,5 Z" />
            </clipPath>
          </defs>

          <g clipPath="url(#glass-clip)">
            <path
              ref={layer1Ref}
              d="M-10,160 C10,150 30,170 50,160 C70,150 90,170 110,160 L110,320 L-10,320 Z"
              fill="#C8922A"
              opacity="0.85"
            />
            <path
              ref={layer2Ref}
              d="M-10,165 C15,157 35,173 50,165 C65,157 85,173 110,165 L110,320 L-10,320 Z"
              fill="#F1E8D8"
              opacity="0.7"
            />
          </g>

          <path
            d="M8,5 L30,155 L70,155 L92,5 Z"
            fill="none"
            stroke="#F1E8D8"
            strokeWidth="2"
            strokeLinejoin="round"
            opacity="0.9"
          />
          <line
            x1="8"
            y1="5"
            x2="92"
            y2="5"
            stroke="#F1E8D8"
            strokeWidth="2"
            opacity="0.6"
          />
          <line
            x1="30"
            y1="155"
            x2="70"
            y2="155"
            stroke="#F1E8D8"
            strokeWidth="2"
            opacity="0.6"
          />
          <line
            x1="14"
            y1="10"
            x2="34"
            y2="148"
            stroke="#F1E8D8"
            strokeWidth="0.5"
            opacity="0.2"
          />
        </svg>

        <p className="mt-4 text-[#F1E8D8] font-serif text-[20px] tracking-[0.2em] whitespace-nowrap opacity-60 text-center">
          preparing your experience
        </p>
      </div>
    </div>
  );
}
