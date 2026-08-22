import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const IMAGES: Record<string, string> = {
  "cybersecurity-fundamentals":             "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?w=700&q=80",
  "comptia-security-plus":                  "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=700&q=80",
  "network-security":                       "https://images.pexels.com/photos/1181323/pexels-photo-1181323.jpeg?auto=compress&cs=tinysrgb&w=700",
  "linux-administration":                   "https://images.pexels.com/photos/19805876/pexels-photo-19805876.jpeg?auto=compress&cs=tinysrgb&w=700",
  "active-directory":                       "https://images.pexels.com/photos/1181335/pexels-photo-1181335.jpeg?auto=compress&cs=tinysrgb&w=700",
  "security-monitoring":                    "https://images.pexels.com/photos/1181330/pexels-photo-1181330.jpeg?auto=compress&cs=tinysrgb&w=700",
  "vulnerability-assessment":               "https://images.pexels.com/photos/1181243/pexels-photo-1181243.jpeg?auto=compress&cs=tinysrgb&w=700",
  "penetration-testing-offensive-security": "https://images.pexels.com/photos/19805877/pexels-photo-19805877.jpeg?auto=compress&cs=tinysrgb&w=700",
  "soc-operations-specialization":          "https://images.pexels.com/photos/19805885/pexels-photo-19805885.jpeg?auto=compress&cs=tinysrgb&w=700",
  "governance-risk-compliance":             "https://images.pexels.com/photos/30689114/pexels-photo-30689114.jpeg?auto=compress&cs=tinysrgb&w=700",
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
