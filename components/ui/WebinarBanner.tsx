"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Webinar } from "@/types";

export default function WebinarBanner() {
  const [webinar, setWebinar] = useState<Webinar | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/webinar/active")
      .then((r) => r.json())
      .then((data: { webinar: Webinar | null }) => {
        setWebinar(data.webinar);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded || !webinar) return null;

  const formattedDate = new Date(webinar.date).toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      role="banner"
      aria-label="Upcoming webinar"
      className="bg-[#007dff] px-6 py-2.5 text-center text-sm text-white"
    >
      <span className="font-semibold">{webinar.title}</span>
      {webinar.subtitle && <span className="hidden sm:inline text-blue-200">: {webinar.subtitle}</span>}
      {" · "}
      <span>{formattedDate}{webinar.time ? `, ${webinar.time}` : ""}</span>
      <Link
        href="/webinars"
        className="ml-3 inline-block rounded bg-white px-3 py-0.5 text-xs font-bold text-[#007dff] hover:bg-blue-50 transition-colors"
      >
        Register
      </Link>
    </div>
  );
}
