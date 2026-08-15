"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import type { Testimonial } from "@/types";

import "swiper/css";

function QuoteIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="w-12 h-12 text-purple-800/40"
      fill="currentColor"
    >
      <path d="M12 34c-3.3 0-6-2.7-6-6V16h12v12h-6v6H12zm18 0c-3.3 0-6-2.7-6-6V16h12v12h-6v6h-0z" />
    </svg>
  );
}

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

function TestimonialCard({ t }: { t: Testimonial }) {
  const initial = t.name.charAt(0).toUpperCase();
  return (
    <div className="relative rounded-2xl bg-gray-900 border border-white/5 p-6 sm:p-8 h-full flex flex-col select-none">
      <div className="absolute top-6 right-6 opacity-60">
        <QuoteIcon />
      </div>

      <div className="flex items-center gap-3 mb-6 pr-12">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-purple-600 to-blue-600 text-white font-bold text-lg">
          {initial}
        </div>
        <div>
          <p className="font-bold text-white leading-tight">{t.name}</p>
          <p className="text-sm text-blue-400 font-medium mt-0.5">{t.role}{t.company ? ` · ${t.company}` : ""}</p>
        </div>
      </div>

      <blockquote className="text-gray-300 leading-relaxed italic flex-1">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
    </div>
  );
}

export default function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{ 768: { slidesPerView: 2 } }}
        loop
        autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        onSwiper={(swiper) => { swiperRef.current = swiper; }}
        className="!pb-2"
      >
        {testimonials.map((t) => (
          <SwiperSlide key={t.id} className="!h-auto">
            <TestimonialCard t={t} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation */}
      <div className="flex justify-center gap-3 mt-8">
        <NavButton direction="prev" onClick={() => swiperRef.current?.slidePrev()} />
        <NavButton direction="next" onClick={() => swiperRef.current?.slideNext()} />
      </div>
    </div>
  );
}
