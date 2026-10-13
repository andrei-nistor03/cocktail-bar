import { useRef } from "react";
import { Wordmark } from "../components/Logo";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import { scrollToElement } from "../lib/smoothScroll";

export default function Header() {
  const headerRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    gsap.to(progressRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.4 },
    });

    // Tuck the bar away while reading down, bring it back on the way up.
    let hidden = false;
    const setHidden = (value: boolean) => {
      if (value === hidden) return;
      hidden = value;
      gsap.to(headerRef.current, {
        yPercent: value ? -100 : 0,
        duration: value ? 0.5 : 0.7,
        ease: value ? "power3.in" : "expo.out",
        overwrite: true,
      });
    };

    ScrollTrigger.create({
      start: 240,
      end: "max",
      onUpdate: (self) => setHidden(self.direction === 1),
      onLeaveBack: () => setHidden(false),
    });
  });

  const scrollToBooking = () => {
    const section = document.getElementById("booking");
    if (section) scrollToElement(section);
  };

  return (
    <header ref={headerRef} className="bg-black h-12 lg:h-16 sticky top-0 z-50">
      <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center justify-center lg:justify-start">
        <button
          type="button"
          onClick={() => window.scrollY > 0 && scrollToElement(document.body)}
          className="cursor-pointer"
          aria-label="Back to top"
        >
          <Wordmark className="w-32 lg:w-36 text-[#F1E8D8]" />
        </button>

        <button
          onClick={scrollToBooking}
          className="group hidden lg:block absolute right-6 overflow-hidden border border-[#C49A53] px-5 py-2 text-md cursor-pointer text-[#F1E8D8] hover:text-black transition-colors duration-500"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[#C49A53] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
          <span className="relative">Make a reservation</span>
        </button>
      </div>
      <div
        ref={progressRef}
        className="absolute bottom-0 left-0 h-px w-full bg-[#C49A53]/70 origin-left scale-x-0"
      />
    </header>
  );
}
