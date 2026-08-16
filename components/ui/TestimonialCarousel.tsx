"use client";

import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";

const SLIDES = [
  { src: "/images/testimonials/testimonial-1.svg", alt: "Testimonial 1" },
  { src: "/images/testimonials/testimonial-2.svg", alt: "Testimonial 2" },
  { src: "/images/testimonials/testimonial-3.svg", alt: "Testimonial 3" },
];

function NavButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous testimonial" : "Next testimonial"}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-700 bg-gray-900 text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-colors"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        {direction === "prev"
          ? <path d="M15 18l-6-6 6-6" />
          : <path d="M9 18l6-6-6-6" />}
      </svg>
    </button>
  );
}

export default function TestimonialCarousel() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-full h-64" />;

  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={2}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 2 },
          1024: { slidesPerView: 3, spaceBetween: 2 },
        }}
        loop
        autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
      >
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.src}>
            {/* overflow:hidden clips the transparent whitespace around the bubbles */}
            <div style={{ overflow: "hidden" }}>
              <img
                src={slide.src}
                alt={slide.alt}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  transform: "scale(2.2)",
                  transformOrigin: "center 53%",
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center gap-3 mt-3">
        <NavButton direction="prev" onClick={() => swiperRef.current?.slidePrev()} />
        <NavButton direction="next" onClick={() => swiperRef.current?.slideNext()} />
      </div>
    </div>
  );
}
