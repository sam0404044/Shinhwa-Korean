const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { randomBytes } = require('node:crypto');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL || 'admin@shenhua.com';
  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log(`後台管理員已存在：${email}`);
    return;
  }

  const password = process.env.ADMIN_SEED_PASSWORD || randomBytes(18).toString('base64url');
  await prisma.admin.create({
    data: { email, passwordHash: await bcrypt.hash(password, 12), role: 'admin' },
  });
  console.log(`後台管理員：${email}`);
  console.log(`首次登入密碼：${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
