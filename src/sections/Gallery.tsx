import GalleryBG from "../assets/img/gallerybg.webp";
import Frame1 from "../assets/img/frame1.webp";
import Frame2 from "../assets/img/frame2.webp";
import Frame3 from "../assets/img/frame3.webp";
import Frame4 from "../assets/img/frame4.webp";
import { useRef } from "react";
import { SplitChars } from "../components/Split";
import { gsap, useGSAP, revealChars, prefersReducedMotion } from "../lib/gsap";

const MAX_ANGLE = 18;

/**
 * A frame hanging from a nail. Rotation is a damped spring simulated on GSAP's
 * ticker, so drags, flicks and releases blend into one continuous motion.
 */
function SwingFrame({
  src,
  alt,
  imageClassName,
  title,
  description,
  descriptionWidth,
  index,
}: {
  src: string;
  alt: string;
  imageClassName: string;
  title: string;
  description: string;
  descriptionWidth: string;
  index: number;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLImageElement | null>(null);
  const startX = useRef(0);
  const sim = useRef({ angle: 0, velocity: 0, target: 0, dragging: false });
  const wakeRef = useRef<() => void>(() => {});

  useGSAP(
    () => {
      const frame = frameRef.current!;
      gsap.set(frame, { transformOrigin: "50% 8%" });
      const setRotation = gsap.quickSetter(frame, "rotation", "deg");
      const s = sim.current;
      let running = false;

      const step = (_time: number, deltaMs: number) => {
        const dt = Math.min(deltaMs / 1000, 1 / 30);
        const stiffness = s.dragging ? 320 : 55;
        const damping = s.dragging ? 28 : 2.6;
        const accel = -stiffness * (s.angle - s.target) - damping * s.velocity;
        s.velocity += accel * dt;
        s.angle += s.velocity * dt;
        setRotation(s.angle);

        const settled =
          !s.dragging && Math.abs(s.angle - s.target) < 0.02 && Math.abs(s.velocity) < 0.02;
        if (settled) {
          s.angle = s.target;
          setRotation(s.angle);
          gsap.ticker.remove(step);
          running = false;
        }
      };

      // Only tick while something is moving.
      const wake = () => {
        if (running) return;
        running = true;
        gsap.ticker.add(step);
      };
      wakeRef.current = wake;

      if (prefersReducedMotion()) return () => gsap.ticker.remove(step);

      // Hang in from above, already swinging, then let the spring settle it.
      gsap.from(rootRef.current, {
        y: -70,
        opacity: 0,
        duration: 1.2,
        delay: index * 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 85%", once: true },
        onStart: () => {
          s.angle = index % 2 === 0 ? -12 : 12;
          s.velocity = 0;
          wake();
        },
      });

      return () => gsap.ticker.remove(step);
    },
    { scope: rootRef },
  );

  const wake = () => wakeRef.current();

  const handlePointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
    startX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
    sim.current.dragging = true;
    wake();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLImageElement>) => {
    const s = sim.current;
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) {
      // A mouse brushing past gives the frame a gentle push.
      if (e.pointerType === "mouse" && !prefersReducedMotion()) {
        s.velocity = gsap.utils.clamp(
          -90,
          90,
          s.velocity + gsap.utils.clamp(-30, 30, -e.movementX * 1.2),
        );
        wake();
      }
      return;
    }
    const deltaX = e.clientX - startX.current;
    s.target = gsap.utils.clamp(-MAX_ANGLE, MAX_ANGLE, -deltaX * 0.12);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLImageElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    const s = sim.current;
    s.dragging = false;
    s.target = 0;
    wake();
  };

  return (
    <div ref={rootRef} className="flex flex-col pt-3 items-center justify-center">
      <img
        ref={frameRef}
        src={src}
        alt={alt}
        draggable={false}
        loading="lazy"
        decoding="async"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`${imageClassName} cursor-grab active:cursor-grabbing select-none touch-none will-change-transform drop-shadow-[0_18px_24px_rgba(0,0,0,0.55)]`}
      />

      <h1 className="hero-title text-[#F1E8D8] text-lg">{title}</h1>

      <h2 className={`text-[#C6B79A] text-center text-xs ${descriptionWidth}`}>
        {description}
      </h2>
    </div>
  );
}

export default function Gallery() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mainTitleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLHeadingElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      revealChars([mainTitleRef.current, subtitleRef.current], sectionRef.current!);
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="py-10 md:py-20 lg:py-50 w-full"
      style={{
        backgroundImage: `
      linear-gradient(
        to bottom,
        rgba(0,0,0,1) 0%,
        rgba(0,0,0,1) 10%,
        rgba(0,0,0,0.40) 20%,

        rgba(0,0,0,0) 50%,

        rgba(0,0,0,0.40) 80%,
        rgba(0,0,0,1) 90%,
        rgba(0,0,0,1) 100%
      ),
      url(${GalleryBG})
    `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col relative items-center justify-center">
        <h1
          ref={mainTitleRef}
          className="hero-title text-4xl md:text-6xl text-[#F1E8D8] text-center tracking-tighter overflow-hidden"
        >
          <SplitChars text="Framed Moments" />
        </h1>
        <h2
          ref={subtitleRef}
          className="text-[#C6B79A] text-xl md:text-3xl overflow-hidden"
        >
          <SplitChars text="A Glimpse into our world" />
        </h2>
      </div>
      <div className="flex flex-row items-center justify-center gap-5 lg:gap-10 py-10 overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-10">
          <SwingFrame
            src={Frame4}
            alt="Frame 4"
            imageClassName="h-50 md:h-70 lg:h-100 w-auto max-w-none shrink-0 object-contain"
            title="The artists"
            description="Passionate creators behind the bar"
            descriptionWidth="w-30"
            index={0}
          />

          <SwingFrame
            src={Frame2}
            alt="Frame 2"
            imageClassName="h-40 md:h-60 lg:h-90 w-auto max-w-none shrink-0 object-contain"
            title="The experience"
            description="Conversations, flavours and unforgettable nights"
            descriptionWidth="w-40"
            index={1}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-5 lg:gap-10">
          <SwingFrame
            src={Frame1}
            alt="Frame 1"
            imageClassName="h-40 md:h-60 lg:h-90 w-auto max-w-none shrink-0 object-contain"
            title="The drinks"
            description="Crafted with precision, served with emotion"
            descriptionWidth="w-30"
            index={2}
          />
          <SwingFrame
            src={Frame3}
            alt="Frame 3"
            imageClassName="h-50 md:h-70 lg:h-100 w-auto max-w-none shrink-0 object-contain"
            title="The details"
            description="Every detail matters, always"
            descriptionWidth="w-30"
            index={3}
          />
        </div>
      </div>
    </section>
  );
}
