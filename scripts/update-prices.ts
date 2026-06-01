import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  const updates = [
    { name: 'Vođeni 1', price: 1400 },
    { name: 'Vođeni 8', price: 8400 },
    { name: 'Vođeni 12', price: 11400 },
    { name: 'Vođeni 16', price: 14400 },
    { name: 'Personalni 1', price: 3000 },
    { name: 'Personalni 8', price: 20400 },
    { name: 'Personalni 12', price: 29400 },
    { name: 'Personalni 18', price: 37400 },
  ]

  for (const u of updates) {
    await db.package.updateMany({ where: { name: u.name }, data: { price: u.price } })
    console.log(`✓ ${u.name} → ${u.price} RSD`)
  }

  await db.$disconnect()
}

main()
