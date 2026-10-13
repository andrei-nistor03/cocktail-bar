import Sweet from "../assets/img/sweet.webp";
import Sour from "../assets/img/sour.webp";
import Bitter from "../assets/img/bitter.webp";
import Fruity from "../assets/img/fruity.webp";
import Smoky from "../assets/img/smoky.webp";
import Strong from "../assets/img/strong.webp";
import ShowcaseCounter from "../assets/img/fading-counter.webp";
import { useState, useRef } from "react";
import { flushSync } from "react-dom";
import { SplitChars, SplitWords } from "../components/Split";
import { drinks } from "../data/drinks";
import { gsap, useGSAP, revealChars, prefersReducedMotion } from "../lib/gsap";

// Each flavour recommends the drink at the same index; laid out in two rows of three.
const flavourRows = [
  [
    { label: "Sweet", alt: "sweet", icon: Sweet, drink: 1 },
    { label: "Sour", alt: "sour", icon: Sour, drink: 2 },
    { label: "Bitter", alt: "bitter", icon: Bitter, drink: 3 },
  ],
  [
    { label: "Fruity", alt: "Fruity", icon: Fruity, drink: 4 },
    { label: "Smoky", alt: "Smoky", icon: Smoky, drink: 5 },
    { label: "Strong", alt: "Strong", icon: Strong, drink: 6 },
  ],
];

const decoded = new Map<string, Promise<void>>();
function decode(src: string) {
  let pending = decoded.get(src);
  if (!pending) {
    const img = new Image();
    img.src = src;
    pending = img.decode().catch(() => {});
    decoded.set(src, pending);
  }
  return pending;
}
const preloadDrink = (index: number) =>
  Promise.all([decode(drinks[index].image), decode(drinks[index].visual)]);

export default function Showcase() {
  const [selectedDrink, setSelectedDrink] = useState(0);
  const [visibleDrink, setVisibleDrink] = useState(0);

  const drinkRef = useRef<HTMLImageElement | null>(null);
  const leftVisualRef = useRef<HTMLImageElement | null>(null);
  const rightVisualRef = useRef<HTMLImageElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const mainTitleRef = useRef<HTMLDivElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const recommendationRef = useRef<HTMLDivElement | null>(null);

  // The swap currently playing; a new click kills it and takes over mid-motion.
  const swapTimeline = useRef<gsap.core.Timeline | null>(null);
  const swapId = useRef(0);

  useGSAP(
    () => {
      gsap.to(leftVisualRef.current, {
        rotation: 15,
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "center center",
      });

      gsap.to(rightVisualRef.current, {
        rotation: 195,
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "center center",
      });

      // Warm the decode cache for every drink once the section is close.
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom+=400",
          once: true,
          onEnter: () => drinks.forEach((_, i) => preloadDrink(i)),
        },
      });

      if (prefersReducedMotion()) return;

      revealChars([mainTitleRef.current, subtitleRef.current], sectionRef.current!);

      gsap.from(pickerRef.current!.querySelectorAll("[data-flavour]"), {
        y: 30,
        opacity: 0,
        scale: 0.85,
        duration: 0.9,
        stagger: 0.06,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: pickerRef.current, start: "top 85%", once: true },
      });

      gsap.from(recommendationRef.current, {
        y: 40,
        opacity: 0,
        duration: 1.1,
        scrollTrigger: {
          trigger: recommendationRef.current,
          start: "top 85%",
          once: true,
        },
      });

      // Ingredients drift against the scroll for depth.
      gsap.fromTo(
        [leftVisualRef.current, rightVisualRef.current],
        { yPercent: -8 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );
    },
    { scope: sectionRef },
  );

  const isCinnamon = visibleDrink === 6;
  const isGinger = visibleDrink === 5;
  const isCoffee = visibleDrink === 0;

  const swapTo = async (index: number) => {
    const id = ++swapId.current;
    swapTimeline.current?.kill();
    const reduced = prefersReducedMotion();
    const titleLetters = titleRef.current ? Array.from(titleRef.current.children) : [];

    // .to() tweens start from wherever the elements are right now, so an
    // interrupted swap flows straight into the new exit without a jump.
    const out = gsap
      .timeline({ defaults: { ease: "power2.in", overwrite: "auto" } })
      .to(drinkRef.current, { x: -250, rotation: -6, opacity: 0, duration: 0.45 }, 0)
      .to(leftVisualRef.current, { x: -300, opacity: 0, duration: 0.45 }, 0)
      .to(rightVisualRef.current, { x: 300, opacity: 0, duration: 0.45 }, 0)
      .to(
        titleLetters,
        { yPercent: -120, opacity: 0, duration: 0.35, stagger: 0.02 },
        0,
      )
      .to(
        descriptionRef.current,
        { opacity: 0, y: -8, filter: "blur(6px)", duration: 0.35 },
        0,
      );
    swapTimeline.current = out;
    if (reduced) out.progress(1);

    await Promise.all([out.then(() => {}), preloadDrink(index)]);
    // Another flavour was picked meanwhile; that swap owns the stage now.
    if (id !== swapId.current) return;

    flushSync(() => setVisibleDrink(index));

    const newTitleLetters = titleRef.current ? Array.from(titleRef.current.children) : [];

    const enter = gsap
      .timeline({ defaults: { ease: "expo.out", overwrite: "auto" } })
      .fromTo(
        drinkRef.current,
        { x: 250, rotation: 6, opacity: 0 },
        { x: 0, rotation: 0, opacity: 1, duration: 1 },
        0,
      )
      .fromTo(
        leftVisualRef.current,
        { x: -300, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.1 },
        0.05,
      )
      .fromTo(
        rightVisualRef.current,
        { x: 300, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.1 },
        0.1,
      )
      .fromTo(
        newTitleLetters,
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.025,
          ease: "back.out(1.6)",
        },
        0.05,
      )
      .fromTo(
        descriptionRef.current,
        { opacity: 0, y: 10, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" },
        0.2,
      );
    swapTimeline.current = enter;
    if (reduced) enter.progress(1);
  };

  const handleDrinkChange = (index: number) => {
    if (index === selectedDrink) return;
    setSelectedDrink(index);
    swapTo(index);
  };

  return (
    <section ref={sectionRef} className="pt-10 lg:pt-20 bg-black w-min-screen">
      <div className="flex flex-col items-center justify-center relative overflow-x-clip">
        <h1
          ref={mainTitleRef}
          className="hero-title text-[#F1E8D8] w-50 md:w-full text-center text-3xl lg:text-5xl tracking-tighter overflow-hidden"
        >
          <SplitChars text="What do you feel like tonight?" />
        </h1>

        <p
          ref={subtitleRef}
          className="text-[#C6B79A] text-sm md:text-md lg:text-lg w-50 md:w-70 lg:w-110 text-center overflow-hidden"
        >
          <SplitWords text="Chose the flavours, moods or notes you enjoy, our bartender will craft the perfect cocktail for your taste." />
        </p>
        <img
          ref={leftVisualRef}
          src={drinks[visibleDrink].visual}
          alt={drinks[visibleDrink].name}
          decoding="async"
          className={`absolute h-60 md:h-100 lg:h-150 pointer-events-none ${
            isCoffee
              ? "-left-30 md:-left-40"
              : isCinnamon
                ? "-left-12 md:-left-20"
                : isGinger
                  ? "-left-60 md:-left-80 lg:-left-90 "
                  : "-left-40 md:-left-60 lg:-left-80 "
          }`}
        />

        <img
          ref={rightVisualRef}
          src={drinks[visibleDrink].visual}
          alt={drinks[visibleDrink].name}
          decoding="async"
          className={`absolute h-50 md:h-80 lg:h-110 top-10 rotate-180 pointer-events-none ${
            isCoffee
              ? "-right-30 md:-right-40"
              : isCinnamon
                ? "-right-12 md:-right-20"
                : isGinger
                  ? "-right-50 md:-right-60 lg:-right-70"
                  : "-right-30 md:-right-40 lg:-right-70"
          }`}
        />
      </div>
      <div
        ref={pickerRef}
        className="pt-10 flex flex-col lg:flex-row items-center justify-center gap-4"
      >
        {flavourRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-row gap-4">
            {row.map((flavour) => {
              const active = selectedDrink === flavour.drink;
              return (
                <div
                  key={flavour.label}
                  data-flavour
                  className="flex flex-col items-center justify-center"
                >
                  <button
                    type="button"
                    onClick={() => handleDrinkChange(flavour.drink)}
                    aria-pressed={active}
                    aria-label={flavour.label}
                    className={`group relative cursor-pointer rounded-full outline-none transition-[background-color,transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-[#c49a53] active:scale-85 ${
                      active
                        ? "bg-[#3a2f24] scale-90 shadow-[0_0_0_1px_rgba(196,154,83,0.45),0_0_28px_rgba(196,154,83,0.25)]"
                        : "bg-transparent hover:bg-[#2a221a] hover:-translate-y-1"
                    }`}
                  >
                    <img
                      src={flavour.icon}
                      alt={flavour.alt}
                      width={80}
                      height={80}
                      className={`w-15 h-auto md:w-20 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        active ? "rotate-[-8deg]" : "group-hover:rotate-6"
                      }`}
                    />
                  </button>
                  <h1
                    className={`uppercase transition-colors duration-500 ${
                      active ? "text-[#F1E8D8]" : "text-[#dab370]"
                    }`}
                  >
                    {flavour.label}
                  </h1>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="pt-6 md:pt-12 lg:pt-25 flex items-center justify-center">
        <div
          ref={recommendationRef}
          className="container w-80 md:w-120 lg:w-230 items-start justify-start"
        >
          <div className="text-[#967b4c] text-md md:text-xl lg:text-2xl">
            Our Recommendation
          </div>
          <div
            ref={titleRef}
            aria-live="polite"
            className="hero-title text-[#c49a53] text-3xl md:text-4xl lg:text-5xl uppercase pt-5 flex overflow-hidden"
          >
            <SplitChars text={drinks[visibleDrink].name} />
          </div>
          <p
            ref={descriptionRef}
            className="text-[#c6b79a] text-sm lg:text-md w-50 md:w-65 lg:w-75"
          >
            {drinks[visibleDrink].description}
          </p>
        </div>
      </div>
      <div className="pt-40 w-full overflow-visible flex justify-end relative">
        <img
          src={ShowcaseCounter}
          alt="Showcase Counter"
          loading="lazy"
          decoding="async"
          className="block h-30 md:h-40 lg:h-80 w-auto max-w-none object-contain"
        />
        <img
          ref={drinkRef}
          src={drinks[visibleDrink].image}
          alt={drinks[visibleDrink].name}
          decoding="async"
          className="absolute bottom-10 right-10 md:right-20 lg:right-100 h-50 md:h-80 lg:h-120 z-10 origin-bottom"
        />
      </div>
    </section>
  );
}
