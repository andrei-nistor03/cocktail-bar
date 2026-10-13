import { useEffect, useRef, useState } from "react";
import Footerbg from "../assets/img/darkquartz.webp";
import { FullLogo } from "../components/Logo";
import { Phone, Mail, MapPin } from "lucide-react";
import { brand } from "../brand";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";

import { SiFacebook, SiInstagram } from "react-icons/si";

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const footerRef = useRef<HTMLElement | null>(null);
  const copiedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(gsap.utils.toArray("[data-reveal]", footerRef.current), {
        y: 30,
        opacity: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: footerRef.current, start: "top 90%", once: true },
      });
    },
    { scope: footerRef },
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(brand.email);
    } catch {
      // Clipboard can be unavailable (insecure context, denied permission).
      window.location.href = `mailto:${brand.email}`;
      return;
    }

    setCopied(true);
    clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <footer
      ref={footerRef}
      className="w-full border-t border-[#C49A53] overflow-x-clip"
      style={{
        backgroundImage: `url(${Footerbg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="py-6 md:py-10 lg:py-14 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
        <div data-reveal>
          <FullLogo className="w-40 md:w-52 lg:w-64 text-[#F1E8D8]" />
        </div>

        <div className="flex flex-col items-center lg:items-end gap-1 lg:gap-3 text-[#F1E8D8]">
          <a
            data-reveal
            href={brand.phoneHref}
            className="flex items-center gap-3 hover:text-[#C49A53] transition-colors"
          >
            <Phone size={18} />
            <span>{brand.phone}</span>
          </a>

          <button
            data-reveal
            onClick={copyEmail}
            className="flex items-center gap-3 hover:text-[#C49A53] transition-colors cursor-pointer"
          >
            <Mail size={18} />
            <span>{brand.email}</span>
            {copied && (
              <span role="status" className="copied-in text-[#C49A53] text-xs">
                Email copied
              </span>
            )}
          </button>

          <a
            data-reveal
            href={brand.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:text-[#C49A53] transition-colors"
          >
            <MapPin size={18} />
            <span>Find us on Google Maps</span>
          </a>

          <div data-reveal className="flex items-center gap-5 pt-2">
            <a
              href={brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-[#C49A53] hover:-translate-y-0.5 transition duration-300"
            >
              <SiInstagram size={22} />
            </a>

            <a
              href={brand.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-[#C49A53] hover:-translate-y-0.5 transition duration-300"
            >
              <SiFacebook size={22} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#C49A53] bg-black">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[#C6B79A] text-xs md:text-sm text-center md:text-left">
            © 2026. {brand.name}. All rights reserved.
          </p>

          <p className="text-[#C6B79A] text-xs md:text-sm text-center md:text-right">
            Designed and created by{" "}
            <a
              href="https://linkhaus.ro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F1E8D8] hover:text-[#C49A53] transition"
            >
              LinkHaus
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
