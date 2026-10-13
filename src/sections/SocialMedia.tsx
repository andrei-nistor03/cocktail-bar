import { SiInstagram } from "react-icons/si";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import DarkQuartz from "../assets/img/darkquartz.webp";
import GalleryBG from "../assets/img/gallerybg.webp";
import Frame1Photo from "../assets/img/frame1-photo.webp";
import Frame2Photo from "../assets/img/frame2-photo.webp";
import Frame3Photo from "../assets/img/frame3-photo.webp";
import Frame4Photo from "../assets/img/frame4-photo.webp";
import { SplitChars } from "../components/Split";
import { brand } from "../brand";
import { drinks } from "../data/drinks";
import { gsap, useGSAP, revealChars, prefersReducedMotion } from "../lib/gsap";

type Post =
  | { kind: "photo"; image: string }
  | { kind: "drink"; drink: number; background: string };

const posts: Post[] = [
  { kind: "photo", image: Frame4Photo },
  { kind: "drink", drink: 0, background: DarkQuartz },
  { kind: "photo", image: Frame1Photo },
  { kind: "drink", drink: 3, background: GalleryBG },
  { kind: "photo", image: Frame3Photo },
  { kind: "drink", drink: 1, background: DarkQuartz },
  { kind: "photo", image: Frame2Photo },
  { kind: "drink", drink: 6, background: GalleryBG },
  { kind: "drink", drink: 4, background: DarkQuartz },
  { kind: "drink", drink: 2, background: GalleryBG },
  { kind: "drink", drink: 5, background: DarkQuartz },
];

/** A styled "post": the cocktail in front of its signature ingredient. */
function DrinkTile({ drink, background, alt }: { drink: number; background: string; alt: string }) {
  const { image, visual, name } = drinks[drink];
  return (
    <div className="relative h-full w-full overflow-hidden">
      <img
        src={background}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(196,154,83,0.22),transparent_60%)]" />
      <img
        src={visual}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute left-[-18%] top-[-8%] h-[62%] w-auto max-w-none -rotate-12 opacity-90 transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-6 group-hover:translate-x-3"
      />
      <img
        src={visual}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute right-[-20%] bottom-[18%] h-[44%] w-auto max-w-none rotate-160 opacity-70 blur-[1px] transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-180 group-hover:-translate-x-3"
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/85 to-transparent" />
      <img
        src={image}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute bottom-[15%] left-1/2 -translate-x-1/2 h-[66%] w-auto max-w-none drop-shadow-[0_20px_25px_rgba(0,0,0,0.7)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2"
      />
      <p className="hero-title absolute inset-x-4 bottom-3 border-t border-[#C49A53]/30 pt-2 text-[#F1E8D8] text-sm uppercase tracking-[0.2em] text-left">
        {name}
      </p>
    </div>
  );
}

export default function SocialMedia() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mainTitleRef = useRef<HTMLHeadingElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      revealChars([mainTitleRef.current], sectionRef.current!);
      gsap.from(carouselRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.3,
        ease: "expo.out",
        scrollTrigger: { trigger: carouselRef.current, start: "top 85%", once: true },
      });
    },
    { scope: sectionRef },
  );

  const openInstagram = () =>
    window.open(brand.instagramUrl, "_blank", "noopener,noreferrer");

  return (
    <section ref={sectionRef} className="py-20 bg-black overflow-hidden">
      <div className="text-center">
        <p className="uppercase text-[#C49A53] text-xs tracking-[0.3em]">
          Follow the experience
        </p>

        <h1
          ref={mainTitleRef}
          className="hero-title text-[#F1E8D8] text-2xl md:text-5xl mt-3 overflow-hidden"
        >
          <SplitChars text={`@${brand.instagramHandle.toUpperCase()}`} />
        </h1>
      </div>

      <div ref={carouselRef} className="relative mt-12 max-w-7xl mx-auto px-14">
        <button
          aria-label="Previous posts"
          className="instagram-prev group cursor-pointer hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-11 w-11 items-center justify-center rounded-full border border-[#C49A53] text-[#C49A53] hover:bg-[#C49A53] hover:text-black transition duration-300"
        >
          <ArrowLeft className="transition-transform duration-300 group-hover:-translate-x-0.5" />
        </button>

        <button
          aria-label="Next posts"
          className="instagram-next group cursor-pointer hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-11 w-11 items-center justify-center rounded-full border border-[#C49A53] text-[#C49A53] hover:bg-[#C49A53] hover:text-black transition duration-300"
        >
          <ArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation={{
            prevEl: ".instagram-prev",
            nextEl: ".instagram-next",
          }}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={700}
          loop={posts.length > 4}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          className="instagram-swiper"
        >
          {posts.map((post, index) => (
            <SwiperSlide key={index}>
              <button
                onClick={openInstagram}
                className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-[#C49A53]/30 bg-[#111] cursor-pointer transition-colors duration-500 hover:border-[#C49A53]/70"
              >
                <div className="h-full w-full transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:opacity-60">
                  {post.kind === "photo" ? (
                    <img
                      src={post.image}
                      alt={`Instagram post ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <DrinkTile
                      drink={post.drink}
                      background={post.background}
                      alt={`Instagram post ${index + 1}`}
                    />
                  )}
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition duration-500 group-hover:opacity-100 bg-black/40">
                  <SiInstagram className="w-10 h-10 text-[#C49A53] translate-y-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />

                  <p className="mt-3 text-[#F1E8D8] text-xs uppercase tracking-[0.25em] translate-y-3 transition-transform duration-500 delay-75 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
                    View post
                  </p>
                </div>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <button
        onClick={openInstagram}
        className="group cursor-pointer mt-12 uppercase text-[#F1E8D8] tracking-[0.2em] text-xs flex items-center gap-3 mx-auto hover:text-[#C49A53] transition"
      >
        View more on Instagram
        <SiInstagram className="w-5 h-5 text-[#C49A53] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
      </button>
    </section>
  );
}
