import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sweetshop.com' },
    update: {},
    create: {
      email: 'admin@sweetshop.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@sweetshop.com' },
    update: {},
    create: {
      email: 'user@sweetshop.com',
      password: userPassword,
      role: 'USER',
    },
  });
  console.log('✅ Created regular user:', user.email);

  // Create sweets
  const sweets = [
    {
      name: 'Dark Chocolate Bar',
      category: 'Chocolate',
      price: 2.5,
      quantity: 100,
    },
    {
      name: 'Milk Chocolate Truffles',
      category: 'Chocolate',
      price: 4.99,
      quantity: 50,
    },
    {
      name: 'Gummy Bears',
      category: 'Gummy',
      price: 1.5,
      quantity: 200,
    },
    {
      name: 'Sour Gummy Worms',
      category: 'Gummy',
      price: 1.99,
      quantity: 150,
    },
    {
      name: 'Rainbow Lollipop',
      category: 'Lollipop',
      price: 0.99,
      quantity: 300,
    },
    {
      name: 'Giant Swirl Lollipop',
      category: 'Lollipop',
      price: 2.99,
      quantity: 75,
    },
    {
      name: 'Cotton Candy',
      category: 'Candy',
      price: 3.0,
      quantity: 80,
    },
    {
      name: 'Rock Candy',
      category: 'Candy',
      price: 1.75,
      quantity: 120,
    },
    {
      name: 'Peppermint Patties',
      category: 'Candy',
      price: 2.25,
      quantity: 90,
    },
    {
      name: 'Caramel Chews',
      category: 'Candy',
      price: 1.99,
      quantity: 110,
    },
  ];

  for (const sweet of sweets) {
    const created = await prisma.sweet.upsert({
      where: { name: sweet.name },
      update: {
        category: sweet.category,
        price: sweet.price,
        quantity: sweet.quantity,
      },
      create: sweet,
    });

    console.log('🍬 Sweet ready:', created.name);
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });