import type { Webinar } from "@/types";

// Source of truth for active webinars — used by /api/webinar/active.
// Update this array to schedule/unschedule webinars without a full rebuild.
export const webinars: Webinar[] = [
  // Example (set active: true and update details when a webinar is scheduled):
  // {
  //   id: "w1",
  //   title: "Intro to Cybersecurity for Non-Tech Professionals",
  //   date: "2026-09-01T17:00:00+01:00",
  //   registerUrl: "#webinar-register",
  //   active: false,
  // },
];
