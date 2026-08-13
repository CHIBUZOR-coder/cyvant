import type { Testimonial } from "@/types";

// No testimonial renders on-site without permissionOnFile: true.
export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "[PLACEHOLDER — Verified Student Name]",
    photo: "/testimonials/placeholder.jpg",
    role: "[PLACEHOLDER — Current Role]",
    company: "[PLACEHOLDER — Current Company]",
    outcome: "[PLACEHOLDER — Specific outcome: e.g. Got hired as Junior SOC Analyst 3 months after completing CYVANT]",
    quote: "[PLACEHOLDER — Direct quote from the student, in their own words.]",
    permissionOnFile: false,
    noTechBackground: true,
  },
];
