import { db } from "@/lib/db";
import TrustedByMarquee from "./TrustedByMarquee";

export default async function TrustedBy() {
  const partners = await db.partner.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return <TrustedByMarquee partners={partners} />;
}
