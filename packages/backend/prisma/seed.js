/* eslint-disable no-console */
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedUsersAndHierarchy() {
  const passwordHash = await bcrypt.hash('Test1234!', 10);

  const parentUser = await prisma.user.upsert({
    where: { email: 'parent@gozmacerasi.dev' },
    update: {
      name: 'Demo Parent',
      password: passwordHash,
      role: 'PARENT',
    },
    create: {
      email: 'parent@gozmacerasi.dev',
      name: 'Demo Parent',
      password: passwordHash,
      role: 'PARENT',
    },
  });

  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@gozmacerasi.dev' },
    update: {
      name: 'Demo Doctor',
      password: passwordHash,
      role: 'DOCTOR',
    },
    create: {
      email: 'doctor@gozmacerasi.dev',
      name: 'Demo Doctor',
      password: passwordHash,
      role: 'DOCTOR',
    },
  });

  const parent = await prisma.parent.upsert({
    where: { userId: parentUser.id },
    update: { phone: '+90-555-000-0000' },
    create: {
      userId: parentUser.id,
      phone: '+90-555-000-0000',
    },
  });

  const doctor = await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {
      specialization: 'Pediatric Ophthalmology',
      licenseNumber: 'DR-TR-1001',
      verified: true,
    },
    create: {
      userId: doctorUser.id,
      specialization: 'Pediatric Ophthalmology',
      licenseNumber: 'DR-TR-1001',
      verified: true,
    },
  });

  return { parent, doctor };
}

async function seedChildren(parentId, doctorId) {
  const childA = await prisma.child.upsert({
    where: { id: 'child_demo_a' },
    update: {
      parentId,
      doctorId,
      name: 'Mete K.',
      age: 7,
      diagnosis: 'Amblyopia',
      dailyLimit: 20,
    },
    create: {
      id: 'child_demo_a',
      parentId,
      doctorId,
      name: 'Mete K.',
      age: 7,
      diagnosis: 'Amblyopia',
      baselineVA: '0.4',
      stereopsisLevel: 'Basic',
      dailyLimit: 20,
    },
  });

  const childB = await prisma.child.upsert({
    where: { id: 'child_demo_b' },
    update: {
      parentId,
      doctorId,
      name: 'Defne K.',
      age: 9,
      diagnosis: 'Strabismus',
      dailyLimit: 25,
    },
    create: {
      id: 'child_demo_b',
      parentId,
      doctorId,
      name: 'Defne K.',
      age: 9,
      diagnosis: 'Strabismus',
      baselineVA: '0.5',
      stereopsisLevel: 'Intermediate',
      dailyLimit: 25,
    },
  });

  return { childA, childB };
}

async function seedGames() {
  const games = [
    {
      id: 'game_target_1',
      title: 'Yildiz Toplama',
      category: 'TargetingGame',
      description: 'Gorsel hedef takibi ve hassasiyet calismasi.',
      therapyTarget: 'Hedef takibi',
      minAge: 4,
      maxAge: 12,
      isPlayable: true,
    },
    {
      id: 'game_puzzle_1',
      title: 'Resim Tamamlama',
      category: 'PuzzleGame',
      description: 'Parca birlestirme ile gorsel algi guclendirme.',
      therapyTarget: 'Gorsel butunleme',
      minAge: 5,
      maxAge: 13,
      isPlayable: true,
    },
    {
      id: 'game_motion_1',
      title: 'Kelebek Yakalama',
      category: 'MotionGame',
      description: 'Takip, hiz ve odak koordinasyonu.',
      therapyTarget: 'Takip becerisi',
      minAge: 4,
      maxAge: 11,
      isPlayable: true,
    },
  ];

  for (const game of games) {
    await prisma.game.upsert({
      where: { id: game.id },
      update: game,
      create: game,
    });
  }
}

async function seedSessions(childId) {
  const gameIds = ['game_target_1', 'game_puzzle_1', 'game_motion_1'];

  for (let index = 0; index < 6; index += 1) {
    const startedAt = new Date();
    startedAt.setDate(startedAt.getDate() - (5 - index));

    await prisma.gameSession.create({
      data: {
        childId,
        gameId: gameIds[index % gameIds.length],
        duration: 600 + index * 60,
        difficulty: Math.min(1 + index, 5),
        finalScore: 70 + index * 4,
        accuracy: (0.72 + index * 0.03).toFixed(2),
        reactionTime: 820 - index * 40,
        startedAt,
        endedAt: new Date(startedAt.getTime() + (600 + index * 60) * 1000),
      },
    });
  }
}

async function cleanupDemoSessions() {
  await prisma.gameSession.deleteMany({
    where: {
      childId: 'child_demo_a',
    },
  });
}

async function main() {
  const { parent, doctor } = await seedUsersAndHierarchy();
  const { childA } = await seedChildren(parent.id, doctor.id);
  await seedGames();
  await cleanupDemoSessions();
  await seedSessions(childA.id);

  console.log('Seed completed successfully.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
