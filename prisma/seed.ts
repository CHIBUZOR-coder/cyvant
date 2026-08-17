import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const COURSES = [
  // ── Tier 1: Fundamentals ──────────────────────────────────────────────────
  {
    slug: "cybersecurity-fundamentals",
    title: "Cyber Security Fundamentals",
    academy: "cybersecurity",
    tier: 1,
    level: "Beginner",
    duration: "6 Weeks",
    format: "Online, cohort-based",
    startingPrice: 200000,
    isStartHere: true,
    featured: true,
    description:
      "The perfect starting point. Learn the core concepts of information security, threats, vulnerabilities, and defenses.",
    prerequisites: ["None — ideal for beginners"],
    whatYouLearn: ["CIA Triad", "Network Basics", "Threat Actors", "Cryptography"],
    certificationAlignment: [],
    careerPaths: [],
  },
  // ── Tier 2: Intermediate Tracks ───────────────────────────────────────────
  {
    slug: "comptia-security-plus",
    title: "CompTIA Security+",
    academy: "cybersecurity",
    tier: 2,
    level: "Intermediate",
    duration: "12 Weeks",
    format: "Online, cohort-based",
    startingPrice: 680000,
    isMostPopular: true,
    featured: true,
    description:
      "Build toward one of the most recognised entry-level certifications in the industry.",
    prerequisites: ["Cyber Security Fundamentals"],
    whatYouLearn: ["Risk Management", "Access Control", "Applied Cryptography", "Security Architecture"],
    capstone:
      "Project 1 — Human Firewall / Phishing Awareness Initiative · Project 2 — CYVANT Cybersecurity Innovation Challenge",
    certificationAlignment: [],
    careerPaths: [],
  },
  {
    slug: "network-security",
    title: "Network Security",
    academy: "cybersecurity",
    tier: 2,
    level: "Intermediate",
    duration: "8 Weeks",
    format: "Online, cohort-based",
    startingPrice: 400000,
    description:
      "Understand how data moves — and how attackers intercept, disrupt, or exploit it.",
    prerequisites: ["Cyber Security Fundamentals"],
    whatYouLearn: ["Firewalls & VPNs", "Network Protocols", "Intrusion Detection", "Network Segmentation"],
    certificationAlignment: [],
    careerPaths: [],
  },
  {
    slug: "linux-administration",
    title: "Linux Administration",
    academy: "cybersecurity",
    tier: 2,
    level: "Intermediate",
    duration: "4 Weeks",
    format: "Online, cohort-based",
    startingPrice: 250000,
    description:
      "Get comfortable operating in the environment most security tools and servers actually run on.",
    prerequisites: ["Cyber Security Fundamentals"],
    whatYouLearn: ["Command Line Mastery", "File Permissions", "User Management", "Shell Scripting"],
    certificationAlignment: [],
    careerPaths: [],
  },
  {
    slug: "active-directory",
    title: "Active Directory",
    academy: "cybersecurity",
    tier: 2,
    level: "Intermediate",
    duration: "8 Weeks",
    format: "Online, cohort-based",
    startingPrice: 400000,
    description:
      "Learn how most enterprise networks manage identity, access, and authentication — and where that system is commonly attacked.",
    prerequisites: ["Cyber Security Fundamentals (Linux Administration recommended alongside)"],
    whatYouLearn: [
      "AD Structure & Domains",
      "User & Group Policy Management",
      "Authentication Protocols (Kerberos/NTLM)",
      "AD Attack & Defense Basics",
    ],
    certificationAlignment: [],
    careerPaths: [],
  },
  {
    slug: "security-monitoring",
    title: "Security Monitoring",
    academy: "cybersecurity",
    tier: 2,
    level: "Intermediate",
    duration: "4 Weeks",
    format: "Online, cohort-based",
    startingPrice: 250000,
    description:
      "Learn the fundamentals of watching a live environment for suspicious activity — the entry point into monitoring-focused security work.",
    prerequisites: ["Network Security recommended"],
    whatYouLearn: ["SIEM Fundamentals", "Log Analysis Basics", "Alert Triage", "Monitoring Tools Overview"],
    certificationAlignment: [],
    careerPaths: [],
  },
  {
    slug: "vulnerability-assessment",
    title: "Vulnerability Assessment",
    academy: "cybersecurity",
    tier: 2,
    level: "Intermediate",
    duration: "4 Weeks",
    format: "Online, cohort-based",
    startingPrice: 250000,
    description:
      "Learn to systematically identify, score, and report security weaknesses before they're exploited.",
    prerequisites: ["Network Security recommended"],
    whatYouLearn: [
      "Vulnerability Scanning Fundamentals",
      "CVE & Risk Scoring (CVSS)",
      "Patch Management",
      "Reporting & Remediation Planning",
    ],
    certificationAlignment: [],
    careerPaths: [],
  },
  // ── Tier 3: Specialised Tracks ────────────────────────────────────────────
  {
    slug: "penetration-testing-offensive-security",
    title: "Penetration Testing (Offensive Security) + Mentorship",
    academy: "cybersecurity",
    tier: 3,
    path: "A",
    level: "Advanced",
    duration: "16 Weeks",
    format: "Online, cohort-based",
    startingPrice: 920000,
    description:
      "Learn to think like an attacker — legally and methodically — to find and report vulnerabilities before someone else exploits them.",
    prerequisites: ["CompTIA Security+ or equivalent skill level"],
    whatYouLearn: ["Reconnaissance", "Vulnerability Scanning", "Exploitation Techniques", "Professional Reporting"],
    advancedElective:
      "Cloud Security — Shared Responsibility Model, Cloud IAM, Cloud Threat Landscape, Securing AWS/Azure Environments",
    certificationAlignment: ["CEH (Certified Ethical Hacker)", "CompTIA PenTest+", "OSCP (introductory exposure)"],
    careerPaths: ["Ethical Hacker", "Penetration Tester", "Vulnerability Analyst", "Red Team Specialist", "Security Researcher"],
  },
  {
    slug: "soc-operations-specialization",
    title: "SOC Operations + Mentorship",
    academy: "cybersecurity",
    tier: 3,
    path: "B",
    level: "Advanced",
    duration: "16 Weeks",
    format: "Online, cohort-based",
    startingPrice: 850000,
    description:
      "Step into the role of a Security Operations Center analyst — monitoring, detecting, and responding to real-time threats.",
    prerequisites: ["CompTIA Security+ or equivalent skill level"],
    whatYouLearn: ["SIEM Tools", "Log Analysis", "Incident Triage", "Threat Detection"],
    advancedElective:
      "Digital Forensics — Evidence Handling, Disk & Memory Forensics, Chain of Custody, Investigation Reporting",
    certificationAlignment: ["CompTIA CySA+", "Blue Team Level 1"],
    careerPaths: ["SOC Analyst", "Cybersecurity Analyst", "Security Engineer", "Application Security Engineer", "Cybersecurity Consultant"],
  },
  {
    slug: "governance-risk-compliance",
    title: "Governance, Risk & Compliance (GRC)",
    academy: "cybersecurity",
    tier: 3,
    path: "C",
    level: "Advanced",
    duration: "16 Weeks",
    format: "Online, cohort-based",
    startingPrice: 900000,
    description:
      "For those drawn to the policy and risk side of security — where technical understanding meets business and regulatory decision-making.",
    prerequisites: ["CompTIA Security+ or equivalent skill level"],
    whatYouLearn: ["Risk Frameworks", "Compliance Standards (ISO/NIST)", "Policy Writing", "Audit Fundamentals"],
    certificationAlignment: [
      "CRISC (Certified in Risk and Information Systems Control)",
      "CISA (Certified Information Systems Auditor)",
      "ISO 27001 Lead Implementer/Auditor",
    ],
    careerPaths: ["GRC Analyst", "Compliance Analyst", "Risk Analyst", "IT Auditor", "Governance Consultant"],
  },
];

const SERVICES = [
  {
    slug: "corporate-training",
    number: "01",
    title: "Corporate Cybersecurity Awareness Training",
    description:
      "Practical, human-focused training that helps your team recognize and respond to real-world threats — phishing, social engineering, and the everyday mistakes that lead to breaches. Delivered as half-day workshops or multi-week programs, tailored to your organization's size and risk profile.",
    cta: "Request a quote",
    icon: "shield",
    published: true,
    order: 1,
  },
  {
    slug: "custom-curriculum",
    number: "02",
    title: "Custom Curriculum & Team Upskilling",
    description:
      "Bespoke training built around your team's actual skill gaps — whether that means getting IT staff security-ready, upskilling existing analysts, or building internal security literacy. We design the curriculum around your goals, not a generic template.",
    cta: "Talk to us",
    icon: "curriculum",
    published: true,
    order: 2,
  },
  {
    slug: "partnership-consulting",
    number: "03",
    title: "Partnership, Speaking & Consulting",
    description:
      "From guest speaking at your event to advising on your organization's security posture, CYVANT partners with companies, schools, and communities building cybersecurity capability across Africa. Open to speaking engagements, curriculum partnerships, and advisory work.",
    cta: "Talk to us",
    icon: "partnership",
    published: true,
    order: 3,
  },
];

async function main() {
  // ── Seed test lead + student ──
  const lead = await db.lead.upsert({
    where: { email: "test.student@cyvant.com" },
    update: {},
    create: {
      name: "Test Student",
      email: "test.student@cyvant.com",
      phone: "08012345678",
      leadSource: "website",
      courseInterest: "Cybersecurity Fundamentals",
      status: "enrolled",
      leadScore: 80,
      notes: {
        create: [
          { content: "Lead submitted via website form", type: "note" },
          { content: "Called and confirmed interest", type: "call" },
          { content: "Marked as enrolled", type: "status_change" },
        ],
      },
    },
  });

  await db.student.upsert({
    where: { leadId: lead.id },
    update: {},
    create: {
      leadId: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      courseName: "Cybersecurity Fundamentals",
      cohort: "Q3 2025",
      paymentStatus: "pending",
      amountPaid: 0,
    },
  });

  console.log("Seeded: Test Student (test.student@cyvant.com)");

  // ── Seed courses ──
  const result = await db.course.createMany({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: COURSES as any,
    skipDuplicates: true,
  });

  console.log(`Seeded ${result.count} courses.`);

  // ── Seed services ──
  const servicesResult = await db.service.createMany({
    data: SERVICES,
    skipDuplicates: true,
  });
  console.log(`Seeded ${servicesResult.count} services.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
