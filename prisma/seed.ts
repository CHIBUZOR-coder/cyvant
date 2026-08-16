import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
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
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
