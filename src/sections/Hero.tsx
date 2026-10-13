import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useProgress } from "@react-three/drei";
import { useMediaQuery } from "usehooks-ts";
import { useState, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";

import CocktailShaker from "../components/CocktailShaker";
import heroBg from "../assets/img/herobg.webp";
import CocktailLoader from "../components/CocktailLoader";
import { SplitChars } from "../components/Split";
import { brand } from "../brand";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";
import { scrollToElement } from "../lib/smoothScroll";

function LoaderBridge({ onReady }: { onReady: () => void }) {
  const { progress } = useProgress();
  useEffect(() => {
    if (progress === 100) onReady();
  }, [progress, onReady]);
  return null;
}

// Pointer position in -1..1, shared with the render loop without re-rendering.
const pointer = { x: 0, y: 0 };

function FloatingShaker({
  isHolding,
  shakerScale,
  shakerPosition,
  followPointer,
  onHoldStart,
  onHoldEnd,
}: {
  isHolding: boolean;
  shakerScale: number;
  shakerPosition: [number, number, number];
  followPointer: boolean;
  onHoldStart: () => void;
  onHoldEnd: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const tiltRef = useRef<THREE.Group>(null);
  const speedRef = useRef({ value: 1.5 });
  const timeRef = useRef(0);

  useEffect(() => {
    gsap.to(speedRef.current, {
      value: isHolding ? 25 : 1.5,
      duration: isHolding ? 0.5 : 0.9,
      ease: isHolding ? "sine.in" : "power2.out",
      overwrite: true,
    });
  }, [isHolding]);

  useFrame((_, rawDelta) => {
    if (!groupRef.current || !tiltRef.current) return;
    // Clamp so resuming after the canvas was paused doesn't jump.
    const delta = Math.min(rawDelta, 1 / 20);
    timeRef.current += delta * speedRef.current.value;
    const t = timeRef.current;
    groupRef.current.position.y = Math.sin(t) * 0.15;
    groupRef.current.rotation.x = Math.sin(t * 0.6) * 0.1;
    groupRef.current.rotation.y = Math.sin(t * 1) * 0.1;
    groupRef.current.rotation.z = Math.cos(t * 0.2) * 0.1;

    // Ease toward the pointer, frame-rate independent.
    const follow = 1 - Math.exp(-delta * 3);
    const tx = followPointer ? pointer.y * 0.18 : 0;
    const ty = followPointer ? pointer.x * 0.35 : 0;
    tiltRef.current.rotation.x += (tx - tiltRef.current.rotation.x) * follow;
    tiltRef.current.rotation.y += (ty - tiltRef.current.rotation.y) * follow;
  });

  return (
    <group ref={tiltRef}>
      <group
        ref={groupRef}
        onPointerDown={onHoldStart}
        onPointerUp={onHoldEnd}
        onPointerLeave={onHoldEnd}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        <CocktailShaker
          scale={shakerScale}
          position={shakerPosition}
          rotation={[0.3, 0.2, -0.35]}
        />
      </group>
    </group>
  );
}

export default function Hero() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

  const shakerScale = isMobile ? 5 : isTablet ? 4 : 5;
  const shakerPosition: [number, number, number] = isMobile
    ? [-0.3, -0.9, 0]
    : [0, -0.7, 0];
  const shakerCameraZ = isMobile ? 4.5 : 5;

  const [isHolding, setIsHolding] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [inView, setInView] = useState(true);
  const markReady = useCallback(() => setModelReady(true), []);

  const sectionRef = useRef<HTMLElement | null>(null);
  const bgWrapRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLHeadingElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const canvasWrapRef = useRef<HTMLDivElement | null>(null);
  const cueRef = useRef<HTMLButtonElement | null>(null);
  const introRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "default";
    };
  }, []);

  // Stop rendering WebGL while the hero is scrolled out of view.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!finePointer) return;
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [finePointer]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // Intro, held at its first frame until the loader curtain lifts.
      introRef.current = gsap
        .timeline({ paused: true })
        .from(bgWrapRef.current, { scale: 1.18, duration: 2.4, ease: "expo.out" }, 0)
        .from(
          titleRef.current!.children,
          { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.045, ease: "expo.out" },
          0.15,
        )
        .from(
          subtitleRef.current!.children,
          { yPercent: 110, opacity: 0, duration: 1, stagger: 0.022, ease: "expo.out" },
          0.4,
        )
        .from(textRef.current, { y: 24, opacity: 0, duration: 1.1 }, 0.7)
        .from(
          canvasWrapRef.current,
          { y: 80, opacity: 0, duration: 1.6, ease: "expo.out" },
          0.25,
        )
        .from(cueRef.current, { opacity: 0, y: -20, duration: 1 }, 1);

      // Only the copy drifts on scroll; the backdrop and shaker stay put so the
      // shaker keeps sitting on the counter with its shadow.
      const scrub = {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      };
      gsap.to(copyRef.current, {
        yPercent: -35,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: scrub,
      });
    },
    { scope: sectionRef },
  );

  const playIntro = () => introRef.current?.play();

  const scrollToNext = () => {
    const next = sectionRef.current?.nextElementSibling;
    if (next instanceof HTMLElement) scrollToElement(next);
  };

  return (
    <>
      <CocktailLoader isReady={modelReady} onReveal={playIntro} />
      <section ref={sectionRef} className="relative h-150 md:h-160 lg:h-260 overflow-hidden">
        <div ref={bgWrapRef} className="absolute inset-0 will-change-transform">
          <img
            src={heroBg}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-right md:object-bottom-right"
          />
        </div>

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6">
          <div className="h-full flex flex-col items-center justify-start pt-12 md:flex-row md:items-center md:justify-between md:pt-0">
            <div ref={copyRef} className="max-w-140 text-center md:max-w-140 md:text-left">
              <h1
                ref={titleRef}
                className="hero-title text-[#F1E8D8] text-6xl leading-[0.9] md:text-7xl lg:text-9xl shadow"
              >
                <SplitChars text="Join us at" />
              </h1>
              <h2
                ref={subtitleRef}
                className="hero-title text-[#F1E8D8] text-3xl leading-none md:text-4xl lg:text-5xl shadow"
              >
                <SplitChars text={`${brand.name}.`} />
              </h2>
              <p
                ref={textRef}
                className="mt-5 text-white text-base leading-relaxed md:text-lg md:max-w-95"
              >
                Where every moment is a celebration of life&apos;s finer
                pleasures. Whether you&apos;re here for a morning latte or an
                evening rendezvous, we promise an unforgettable experience.
              </p>
            </div>

            <div
              ref={canvasWrapRef}
              className="absolute bottom-5 left-1/2 -translate-x-1/2 w-full h-80 md:left-auto md:translate-x-0 md:right-0 md:-bottom-20 md:w-125 md:h-175 lg:w-175 lg:h-250 z-10"
            >
              <Canvas
                shadows="percentage"
                dpr={[1, 1.75]}
                frameloop={inView ? "always" : "never"}
                gl={{ powerPreference: "high-performance" }}
                camera={{ position: [0, 0, shakerCameraZ], fov: 45 }}
              >
                <LoaderBridge onReady={markReady} />
                <ambientLight intensity={0.8} />

                <directionalLight
                  castShadow
                  position={[3, 10, 4]}
                  intensity={3}
                  shadow-mapSize-width={1024}
                  shadow-mapSize-height={1024}
                  shadow-camera-near={0.5}
                  shadow-camera-far={20}
                  shadow-camera-left={-8}
                  shadow-camera-right={8}
                  shadow-camera-top={8}
                  shadow-camera-bottom={-8}
                />

                <mesh
                  receiveShadow
                  position={[shakerPosition[0], shakerPosition[1] - 0.5, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                >
                  <planeGeometry args={[8, 8]} />
                  <shadowMaterial transparent opacity={0.8} />
                </mesh>

                <FloatingShaker
                  isHolding={isHolding}
                  shakerScale={shakerScale}
                  shakerPosition={shakerPosition}
                  followPointer={finePointer}
                  onHoldStart={() => setIsHolding(true)}
                  onHoldEnd={() => setIsHolding(false)}
                />

                <Environment preset="studio" />
              </Canvas>
            </div>
          </div>
        </div>

        <button
          ref={cueRef}
          type="button"
          onClick={scrollToNext}
          className="group hidden md:flex absolute top-10 right-5 lg:right-10 z-20 flex-col items-center cursor-pointer"
        >
          <span className="text-[#F1E8D8] text-xl lg:text-2xl [writing-mode:vertical-rl] rotate-180 leading-none tracking-[0.15em] whitespace-nowrap transition-colors duration-500 group-hover:text-[#C49A53]">
            scroll to discover
          </span>
          <div className="relative mt-4 w-px h-20 lg:h-28 bg-[#F1E8D8] overflow-hidden">
            <div className="cue-drip absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-transparent via-[#C49A53] to-[#C49A53]" />
          </div>
          <div className="mt-4 w-8 h-8 rounded-full border-2 border-[#F1E8D8] flex items-center justify-center transition-[transform,border-color] duration-500 group-hover:translate-y-1 group-hover:border-[#C49A53]">
            <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent border-t-[#F1E8D8]" />
          </div>
        </button>
      </section>
    </>
  );
}
