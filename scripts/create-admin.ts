import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] ?? "Admin";

  if (!email || !password) {
    console.error("Usage: npx ts-node scripts/create-admin.ts <email> <password> [name]");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.adminUser.create({
    data: { email, passwordHash, name, role: "admin" },
  });

  console.log(`✓ Admin created: ${user.email}`);
}

main().catch(console.error).finally(() => db.$disconnect());
