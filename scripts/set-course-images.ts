import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const IMAGES: Record<string, string> = {
  "cybersecurity-fundamentals":       "/images/courses/cyber-fundamentals.svg",
  "comptia-security-plus":            "/images/courses/comptia-security-plus.svg",
  "network-security":                 "/images/courses/network-security.svg",
  "linux-administration":             "/images/courses/linux-administration.svg",
  "active-directory":                 "/images/courses/active-directory.svg",
  "security-monitoring":              "/images/courses/security-monitoring.svg",
  "vulnerability-assessment":         "/images/courses/vulnerability-assessment.svg",
  "penetration-testing-offensive-security": "/images/courses/penetration-testing.svg",
  "soc-operations-specialization":    "/images/courses/soc-operations.svg",
  "governance-risk-compliance":       "/images/courses/grc.svg",
};

async function main() {
  for (const [slug, coverImage] of Object.entries(IMAGES)) {
    const result = await db.course.updateMany({
      where: { slug },
      data: { coverImage },
    });
    console.log(`${slug}: ${result.count} updated`);
  }
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
