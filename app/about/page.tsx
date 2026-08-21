import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import ParticleCanvas from "@/components/ui/ParticleCanvas";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the team behind CYVANT and learn why we exist.",
};

const FEATURES = [
  {
    label: "Industry Experts",
    icon: (
      <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    label: "Practical Training",
    icon: (
      <svg className="h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
  {
    label: "Real World Labs",
    icon: (
      <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
  },
  {
    label: "Career Support",
    icon: (
      <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>
    ),
  },
];

const FOUNDERS = [
  {
    initials: "ET",
    name: "Emmanuel Tavershima",
    role: "FOUNDER | NETWORK SECURITY ENGINEER",
    bio: "[PLACEHOLDER: Emmanuel's background, credentials, and why he founded CYVANT.]",
    linkedin: "https://linkedin.com/in/[PLACEHOLDER]",
    github: "https://github.com/[PLACEHOLDER]",
  },
  {
    initials: "TM",
    name: "[PLACEHOLDER: Co-founder Name]",
    role: "CO-FOUNDER | [PLACEHOLDER: Role]",
    bio: "[PLACEHOLDER: Co-founder background and what they bring to CYVANT.]",
    linkedin: "https://linkedin.com/in/[PLACEHOLDER]",
    github: "https://github.com/[PLACEHOLDER]",
  },
];

const HIGHLIGHTS = [
  { label: "Duration", detail: "[PLACEHOLDER: e.g. 8–12 weeks depending on your track]" },
  { label: "Format", detail: "[PLACEHOLDER: e.g. Live virtual sessions + self-paced labs + capstone projects]" },
  { label: "Tools", detail: "[PLACEHOLDER: e.g. TryHackMe, Hack The Box, Splunk, Wireshark, and more]" },
  { label: "Outcome", detail: "[PLACEHOLDER: e.g. Job-ready skills, portfolio, mock interviews, and career support]" },
];

const WHY_CYVANT = [
  {
    text: "Learn from anywhere",
    icon: (
      <svg className="h-5 w-5 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    text: "Learn from the best",
    icon: (
      <svg className="h-5 w-5 text-yellow-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
  },
  {
    text: "Learn together",
    icon: (
      <svg className="h-5 w-5 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
  {
    text: "Learn the fun way",
    icon: (
      <svg className="h-5 w-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
      </svg>
    ),
  },
  {
    text: "Learn to earn",
    icon: (
      <svg className="h-5 w-5 text-yellow-300 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
  },
];

function CheckIcon() {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-900/60">
      <svg className="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="bg-slate-900">

      {/* ── Banner 1: About + Vision / Mission ─────────────────── */}
      <section className="relative overflow-hidden px-6 py-20 lg:px-8 lg:py-28 border-b border-white/5">
        <ParticleCanvas />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">

            {/* Left — About card */}
            <FadeIn delay={0}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 h-full flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#007dff]/30">
                    <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                    About CYVANT
                  </h1>
                </div>
                <p className="text-gray-300 leading-8 flex-1">
                  [PLACEHOLDER: Mission statement — 1–2 sentences on what CYVANT is and who it is for. What gap does it fill in African tech education?]
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {FEATURES.map(({ label, icon }) => (
                    <div key={label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                        {icon}
                      </div>
                      <span className="text-sm font-medium text-white">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Right — Vision + Mission stacked */}
            <div className="flex flex-col gap-6">
              <FadeIn delay={0.1}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
                  <h2 className="text-xl font-bold bg-linear-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-3">
                    Our Vision
                  </h2>
                  <p className="text-gray-300 leading-7">
                    [PLACEHOLDER: To become Africa's most trusted AI and cybersecurity education institution — building skilled, ethical, and future-ready professionals.]
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
                  <h2 className="text-xl font-bold bg-linear-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-3">
                    Our Mission
                  </h2>
                  <p className="text-gray-300 leading-7">
                    [PLACEHOLDER: To deliver accessible, hands-on, and mentorship-led training that empowers individuals to thrive in high-demand tech roles globally.]
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ── Banner 2: Founders & Leadership ────────────────────── */}
      <section className="relative overflow-hidden px-6 py-20 lg:px-8 lg:py-28 border-b border-white/5">
        <div className="mx-auto max-w-7xl">
          <FadeIn delay={0}>
            <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent text-center mb-12">
              Founders &amp; Leadership
            </h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-6">
            {FOUNDERS.map(({ initials, name, role, bio, linkedin, github }, i) => (
              <FadeIn key={name} delay={i * 0.1}>
                <div className="group rounded-2xl border border-white/10 bg-white/5 p-8 h-full flex flex-col transition-all duration-300 hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.18)]">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-violet-600 text-white font-bold text-lg transition-all duration-300 group-hover:shadow-[0_0_22px_rgba(139,92,246,0.65)]">
                      {initials}
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">{name}</p>
                      <p className="text-xs font-semibold tracking-widest text-blue-400 mt-0.5">{role}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-7 flex-1">{bio}</p>
                  <div className="mt-6 flex gap-3">
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 hover:border-blue-400/50 hover:text-white transition-colors"
                      aria-label={`${name} on LinkedIn`}
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>
                    <a
                      href={github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 hover:border-blue-400/50 hover:text-white transition-colors"
                      aria-label={`${name} on GitHub`}
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                      GitHub
                    </a>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Banner 3: Program Highlights + Why CYVANT ──────────── */}
      <section className="relative overflow-hidden px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <FadeIn delay={0}>
            <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-12">
              Program Highlights
            </h2>
          </FadeIn>
          <div className="grid lg:grid-cols-2 gap-8 items-start">

            {/* Left — checklist */}
            <FadeIn delay={0.1}>
              <ul className="space-y-6">
                {HIGHLIGHTS.map(({ label, detail }) => (
                  <li key={label} className="flex gap-4">
                    <CheckIcon />
                    <div>
                      <p className="font-bold text-white">{label}</p>
                      <p className="mt-1 text-gray-400 leading-7 text-sm">{detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </FadeIn>

            {/* Right — Why CYVANT card */}
            <FadeIn delay={0.2}>
              <div className="rounded-2xl border border-blue-500/40 bg-white/5 p-8 shadow-[0_0_28px_rgba(59,130,246,0.22)]">
                <h3 className="text-xl font-bold bg-linear-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-6">
                  Why CYVANT?
                </h3>
                <ul className="space-y-4">
                  {WHY_CYVANT.map(({ text, icon }) => (
                    <li key={text} className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-gray-200 font-medium">{text}</span>
                      {icon}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* CTA */}
        <FadeIn delay={0.3}>
          <div className="mx-auto max-w-7xl mt-20 pt-12 border-t border-white/10 text-center">
            <p className="text-gray-400 mb-6">Ready to build real skills?</p>
            <Link
              href="/courses"
              className="inline-block rounded-xl bg-[#007dff] px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-[#0066d9] transition-colors"
            >
              Explore Courses →
            </Link>
          </div>
        </FadeIn>
      </section>

    </div>
  );
}
