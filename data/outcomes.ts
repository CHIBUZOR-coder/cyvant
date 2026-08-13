import type { GraduateOutcome } from "@/types";

// Only entries with permissionConfirmed: true are rendered on the site.
// All others are stored for record-keeping but must NOT be displayed.
export const graduateOutcomes: GraduateOutcome[] = [
  {
    id: "1",
    name: "[PLACEHOLDER — Verified Graduate Name]",
    role: "[PLACEHOLDER — Job Title]",
    company: "[PLACEHOLDER — Company]",
    permissionConfirmed: false,
  },
];
