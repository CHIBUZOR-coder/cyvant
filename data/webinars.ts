import type { Webinar } from "@/types";

// Add entries here to schedule webinars.
// Status is auto-computed: upcoming = date >= today, past = date < today.
// No manual status field needed — just set the date and everything updates automatically.
export const webinars: Webinar[] = [
  // {
  //   id: "w1",
  //   slug: "career-pivot-sep-2026",
  //   title: "Career Pivot into Cybersecurity",
  //   subtitle: "Breaking into Cyber/AI With No Tech Background",
  //   date: "2026-09-01T17:00:00+01:00",
  //   time: "6:00 PM WAT",
  //   description: "Join us for a live session on how to break into cybersecurity from any background. No prior tech experience required.",
  //   formatSummary: "Student presentation, 2 speakers, panel, audience Q&A",
  //   speakers: [
  //     {
  //       name: "Emmanuel Tavershima",
  //       role: "Founder",
  //       bio: "Co-Founder & CEO of CYVANT, building Africa's leading cybersecurity education platform.",
  //     },
  //   ],
  //   registrationOpen: true,
  //   qualifyingQuestion: "What's your current background and what's pulling you toward cybersecurity?",
  //   recordingPermissionConfirmed: false,
  // },
];
