import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

let lenis: Lenis | null = null;
let locked = false;

/** Inertial scrolling driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return () => {};

  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
  if (locked) lenis.stop();
  lenis.on("scroll", ScrollTrigger.update);

  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

export function setScrollLocked(value: boolean) {
  locked = value;
  document.documentElement.style.overflow = value ? "hidden" : "";
  if (value) lenis?.stop();
  else lenis?.start();
}

/** Scrolls to an element, honouring its CSS scroll-margin-top. */
export function scrollToElement(el: HTMLElement) {
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.6 });
    return;
  }
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}
