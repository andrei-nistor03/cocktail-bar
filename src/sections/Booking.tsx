import OldPaper from "../assets/img/oldpaper.webp";
import OldMap from "../assets/img/oldmap.webp";
import Seal from "../assets/img/seal.webp";
import { Clock, Phone } from "lucide-react";
import { useRef } from "react";
import { brand } from "../brand";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";

export default function Booking() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const paperRef = useRef<HTMLDivElement | null>(null);
  const inkRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(sectionRef);

      const tl = gsap.timeline({
        scrollTrigger: { trigger: paperRef.current, start: "top 75%", once: true },
      });

      tl.from(paperRef.current, {
        y: 90,
        rotation: -3,
        opacity: 0,
        duration: 1.3,
        ease: "expo.out",
      })
        .from(
          inkRef.current!.children,
          { opacity: 0, y: 14, duration: 0.9, stagger: 0.12, ease: "power2.out" },
          0.35,
        )
        .from(
          q("[data-map]"),
          { opacity: 0, scale: 0.85, rotation: 8, duration: 1.2, ease: "expo.out" },
          0.45,
        )
        // The wax seal is pressed onto the paper...
        .from(
          q("[data-seal]"),
          {
            scale: 2.4,
            opacity: 0,
            rotation: -30,
            duration: 0.55,
            ease: "power4.in",
          },
          0.9,
        )
        // ...and the paper gives a little under the impact.
        .to(paperRef.current, {
          keyframes: [
            { scale: 0.985, duration: 0.08, ease: "power2.out" },
            { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" },
          ],
        })
        // Then the farewell is written in, left to right.
        .fromTo(
          q("[data-handwriting]"),
          { clipPath: "inset(-30% 100% -30% -15%)" },
          {
            clipPath: "inset(-30% -15% -30% -15%)",
            duration: 1.4,
            ease: "power1.inOut",
            clearProps: "clipPath",
          },
          "-=0.4",
        );
    },
    { scope: sectionRef },
  );

  const openDirections = () => {
    window.open(brand.mapsUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      ref={sectionRef}
      id="booking"
      className="py-20 md:py-10 bg-black overflow-x-clip scroll-mt-60"
    >
      <div className="h-110 md:h-180 lg:h-150 flex items-center justify-center pb-20 relative">
        <div ref={paperRef} className="relative h-80 md:h-120 lg:h-170">
          <img
            src={OldPaper}
            alt="Old Paper"
            loading="lazy"
            decoding="async"
            className="rotate-90 lg:rotate-0 h-full w-auto max-w-none shrink-0 object-contain"
          />
          <div
            ref={inkRef}
            className="paper-ink absolute left-33 md:left-50 lg:left-18 -top-20 md:-top-30 lg:top-35 origin-left lg:origin-center w-65 md:w-90 lg:w-80"
          >
            <p className="text-[9px] md:text-xs uppercase tracking-wide">
              Reserve your experience
            </p>

            <h1 className="hero-title text-xl md:text-4xl lg:text-4xl leading-none uppercase md:w-140">
              Lets create <br /> something unique
            </h1>

            <p className="text-sm md:text-xl font-semibold lg:text-xl leading-tight w-55 md:w-75 lg:w-55">
              Book your table and let us craft the perfect experience for you
            </p>

            <div className="flex flex-col mt-2 md:mt-5 lg:mt-14 text-xs md:text-base lg:text-sm lg:w-200 gap-5">
              <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
                <a
                  href={brand.phoneHref}
                  className="flex items-center gap-2 shrink-0 transition-opacity duration-300 hover:opacity-70"
                >
                  <Phone
                    className="w-5 h-5 md:w-7 md:h-7 lg:w-10 lg:h-10"
                    strokeWidth={2.2}
                  />
                  <div>
                    <p className="uppercase font-semibold text-[9px] md:text-base lg:text-lg leading-none underline">
                      Phone
                    </p>
                    <p className="text-xs md:text-base lg:text-lg whitespace-nowrap">
                      {brand.phone}
                    </p>
                  </div>
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Clock
                  className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
                  strokeWidth={2.2}
                />
                <div>
                  <p className="uppercase font-semibold text-[9px] md:text-base lg:text-lg leading-none underline">
                    Schedule
                  </p>
                  <p className="text-xs md:text-base lg:text-lg">
                    Tue, Wed, Thu: 18:00 - 2:00
                    <br /> Fri, Sat: 19:00 - 3:00
                    <br /> Sun, Mon: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            data-map
            className="absolute -bottom-20 md:-bottom-25 left-1/2 -translate-x-1/2 flex flex-col items-center lg:hidden"
          >
            <img
              src={OldMap}
              alt="Old Map"
              loading="lazy"
              decoding="async"
              className="h-55 md:h-70 object-contain"
            />

            <button
              onClick={openDirections}
              className="absolute bottom-10 border-2 border-black bg-[#C6B79A]/50 cursor-pointer uppercase text-center p-2 text-sm md:text-lg active:bg-black active:text-white transition duration-200"
            >
              Get directions
            </button>
            <p className="mt-2 text-black text-xs md:text-base text-center font-semibold leading-tight">
              {brand.addressLine1}
              <br />
              {brand.addressLine2}
            </p>
          </div>
          <div
            data-handwriting
            className="cursive text-black absolute text-2xl md:text-4xl w-25 md:w-40 right-28 md:right-40 top-1/2 -translate-y-1/2 -rotate-20 lg:hidden"
          >
            See you at the bar!
          </div>

          <div
            data-map
            className="hidden lg:flex absolute right-20 top-1/2 -translate-y-1/2 flex-col items-center"
          >
            <img
              src={OldMap}
              alt="Old Map"
              loading="lazy"
              decoding="async"
              className="h-100 object-contain"
            />

            <button
              className="border-2 border-black bg-[#C6B79A]/50 cursor-pointer uppercase text-center p-2 text-sm md:text-lg hover:bg-black hover:text-white transition duration-200"
              onClick={openDirections}
            >
              Get directions
            </button>
            <p className="mt-2 text-black text-xs md:text-base text-center font-semibold leading-tight">
              {brand.addressLine1}
              <br />
              {brand.addressLine2}
            </p>
          </div>

          <img
            data-seal
            src={Seal}
            alt="sigiliu"
            loading="lazy"
            decoding="async"
            className="absolute h-20 md:h-30 w-auto max-w-none shrink-0 object-contain lg:hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />

          <div className="hidden lg:flex flex-col items-center absolute left-1/2 top-4/7 -translate-x-1/2 -translate-y-1/2">
            <img
              data-seal
              src={Seal}
              alt="sigiliu"
              loading="lazy"
              decoding="async"
              className="h-40 w-auto max-w-none shrink-0 object-contain"
            />

            <div
              data-handwriting
              className="cursive text-black text-5xl -mt-3 ml-20 w-50 -rotate-20"
            >
              See you at the bar!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
