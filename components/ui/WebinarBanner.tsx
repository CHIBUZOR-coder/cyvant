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
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      role="banner"
      aria-label="Upcoming webinar"
      className="bg-blue-700 px-6 py-3 text-center text-sm text-white"
    >
      <span className="font-semibold">{webinar.title}</span>
      {" — "}
      <span>{formattedDate}</span>
      {"  "}
      <Link
        href={webinar.registerUrl}
        className="ml-2 inline-block rounded bg-white px-3 py-0.5 text-xs font-bold text-blue-700 hover:bg-blue-50 transition-colors"
      >
        Register
      </Link>
    </div>
  );
}
