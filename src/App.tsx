import { useEffect } from "react";
import Booking from "./sections/Booking";
import Footer from "./sections/Footer";
import Gallery from "./sections/Gallery";
import Header from "./sections/Header";
import Hero from "./sections/Hero";
import Showcase from "./sections/Showcase";
import SocialMedia from "./sections/SocialMedia";
import { initSmoothScroll } from "./lib/smoothScroll";
import { ScrollTrigger } from "./lib/gsap";

const App = () => {
  useEffect(() => {
    const destroy = initSmoothScroll();
    // Webfonts and late images shift layout; re-measure triggers once settled.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      destroy();
      window.removeEventListener("load", refresh);
    };
  }, []);

  return (
    <main>
      <Header />
      <Hero />
      <Showcase />
      <Gallery />
      <Booking />
      <SocialMedia />
      <Footer />
    </main>
  );
};
export default App;
