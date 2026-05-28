import { PrismaClient, Role, PackageType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@corehouse.com' },
    update: {},
    create: {
      name: 'Admin CoreHouse',
      email: 'admin@corehouse.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  })

  const trainerPassword = await bcrypt.hash('trainer123', 12)
  const trainer1 = await prisma.user.upsert({
    where: { email: 'marko@corehouse.com' },
    update: {},
    create: {
      name: 'Marko Petrović',
      email: 'marko@corehouse.com',
      password: trainerPassword,
      role: Role.TRAINER,
    },
  })

  const trainer2 = await prisma.user.upsert({
    where: { email: 'ana@corehouse.com' },
    update: {},
    create: {
      name: 'Ana Nikolić',
      email: 'ana@corehouse.com',
      password: trainerPassword,
      role: Role.TRAINER,
    },
  })

  const personalPkg = await prisma.package.upsert({
    where: { id: 'pkg-personal-10' },
    update: {},
    create: {
      id: 'pkg-personal-10',
      name: 'Personal 10',
      type: PackageType.PERSONAL,
      totalSessions: 10,
    },
  })

  const groupPkg = await prisma.package.upsert({
    where: { id: 'pkg-group-20' },
    update: {},
    create: {
      id: 'pkg-group-20',
      name: 'Group 20',
      type: PackageType.GROUP,
      totalSessions: 20,
    },
  })

  const clientPassword = await bcrypt.hash('client123', 12)

  const client1 = await prisma.user.upsert({
    where: { email: 'jovan@example.com' },
    update: {},
    create: {
      name: 'Jovan Đorđević',
      email: 'jovan@example.com',
      password: clientPassword,
      role: Role.CLIENT,
    },
  })

  const client2 = await prisma.user.upsert({
    where: { email: 'milica@example.com' },
    update: {},
    create: {
      name: 'Milica Stojanović',
      email: 'milica@example.com',
      password: clientPassword,
      role: Role.CLIENT,
    },
  })

  const client3 = await prisma.user.upsert({
    where: { email: 'stefan@example.com' },
    update: {},
    create: {
      name: 'Stefan Marinković',
      email: 'stefan@example.com',
      password: clientPassword,
      role: Role.CLIENT,
    },
  })

  await prisma.clientPackage.upsert({
    where: { id: 'cp-jovan-personal' },
    update: {},
    create: {
      id: 'cp-jovan-personal',
      userId: client1.id,
      packageId: personalPkg.id,
      remainingSessions: 8,
      isActive: true,
      activatedAt: new Date(),
    },
  })

  await prisma.clientPackage.upsert({
    where: { id: 'cp-milica-group' },
    update: {},
    create: {
      id: 'cp-milica-group',
      userId: client2.id,
      packageId: groupPkg.id,
      remainingSessions: 15,
      isActive: true,
      activatedAt: new Date(),
    },
  })

  await prisma.clientPackage.upsert({
    where: { id: 'cp-stefan-group' },
    update: {},
    create: {
      id: 'cp-stefan-group',
      userId: client3.id,
      packageId: groupPkg.id,
      remainingSessions: 20,
      isActive: false,
    },
  })

  const d1 = new Date(); d1.setDate(d1.getDate() + 1); d1.setHours(9, 0, 0, 0)
  const d2 = new Date(); d2.setDate(d2.getDate() + 1); d2.setHours(11, 0, 0, 0)
  const d3 = new Date(); d3.setDate(d3.getDate() + 2); d3.setHours(14, 0, 0, 0)
  const d4 = new Date(); d4.setDate(d4.getDate() + 2); d4.setHours(17, 0, 0, 0)

  await prisma.session.createMany({
    data: [
      { type: PackageType.GROUP, trainerId: trainer1.id, startTime: d1, maxCapacity: 15 },
      { type: PackageType.GROUP, trainerId: trainer2.id, startTime: d2, maxCapacity: 15 },
      { type: PackageType.PERSONAL, trainerId: trainer1.id, startTime: d3, maxCapacity: 1 },
      { type: PackageType.GROUP, trainerId: trainer1.id, startTime: d4, maxCapacity: 15 },
    ],
  })

  console.log('✅ Seed završen!')
  console.log('─────────────────────────────────')
  console.log('Admin:     admin@corehouse.com / admin123')
  console.log('Trener 1:  marko@corehouse.com / trainer123')
  console.log('Trener 2:  ana@corehouse.com   / trainer123')
  console.log('Klijent 1: jovan@example.com   / client123  (aktivan personal paket)')
  console.log('Klijent 2: milica@example.com  / client123  (aktivan grupni paket)')
  console.log('Klijent 3: stefan@example.com  / client123  (neaktivan grupni paket)')
}

main().catch(console.error).finally(() => prisma.$disconnect())
