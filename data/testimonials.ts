import type { Testimonial } from "@/types";

// No testimonial renders on-site without permissionOnFile: true.
export const testimonials: Testimonial[] = [
  {
    id: "vincent",
    name: "Vincent Ifenkwe",
    photo: "",
    role: "Cybersecurity Analyst",
    company: "Kuda Bank",
    outcome: "Landed first cybersecurity role 3 months after completing the program",
    quote:
      "Cyvant gave me the skills and confidence to land my first cybersecurity role. The mentorship and labs are top-notch!",
    permissionOnFile: true,
  },
  {
    id: "ugochukwu",
    name: "Ugochukwu Anyaorah",
    photo: "",
    role: "Cybersecurity Enthusiast",
    company: "",
    outcome: "Completed the Ethical Hacking & Offensive Security track",
    quote:
      "The ethical hacking track challenged me to think like an attacker and defend like a pro. Highly recommended!",
    permissionOnFile: true,
  },
  {
    id: "adaeze",
    name: "Adaeze Okonkwo",
    photo: "",
    role: "SOC Analyst",
    company: "Sterling Bank",
    outcome: "Transitioned from banking operations into cybersecurity in under 6 months",
    quote:
      "I had zero IT background before CYVANT. The Foundations course broke everything down clearly and the instructors actually cared. I now work as a SOC Analyst.",
    permissionOnFile: true,
    noTechBackground: true,
  },
  {
    id: "emeka",
    name: "Emeka Okafor",
    photo: "",
    role: "Penetration Tester",
    company: "Freelance",
    outcome: "Now earning as a freelance penetration tester after completing the Advanced track",
    quote:
      "The real lab environments are what set CYVANT apart. By the time I finished, I had a portfolio of real findings — not just theory.",
    permissionOnFile: true,
  },
  {
    id: "fatima",
    name: "Fatima Bello",
    photo: "",
    role: "GRC Analyst",
    company: "Interswitch",
    outcome: "Hired into a GRC role at a fintech company straight from the program",
    quote:
      "The GRC course gave me the framework language I needed to walk into interviews with confidence. Worth every naira.",
    permissionOnFile: true,
    noTechBackground: true,
  },
  {
    id: "tunde",
    name: "Tunde Adeyemi",
    photo: "",
    role: "Network Security Engineer",
    company: "MTN Nigeria",
    outcome: "Promoted to Network Security Engineer after completing the Infrastructure Defense track",
    quote:
      "I was already in IT support but CYVANT unlocked the security layer. The instructors go deep — not just slides.",
    permissionOnFile: true,
  },
];
