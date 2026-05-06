/* eslint-disable no-console */
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const PASSWORD = 'Test1234!';
const SALT_ROUNDS = 10;

const DOCTORS = [
  { email: 'dr.yilmaz@gozmacerasi.dev', name: 'Dr. Ahmet Yılmaz', spec: 'Pediatrik Oftalmoloji', license: 'DR-TR-2001' },
  { email: 'dr.kaya@gozmacerasi.dev', name: 'Dr. Elif Kaya', spec: 'Straboloji', license: 'DR-TR-2002' },
  { email: 'dr.demir@gozmacerasi.dev', name: 'Dr. Mehmet Demir', spec: 'Pediatrik Oftalmoloji', license: 'DR-TR-2003' },
  { email: 'dr.celik@gozmacerasi.dev', name: 'Dr. Zeynep Çelik', spec: 'Göz Hastalıkları', license: 'DR-TR-2004' },
  { email: 'dr.ozturk@gozmacerasi.dev', name: 'Dr. Can Öztürk', spec: 'Pediatrik Nöro-Oftalmoloji', license: 'DR-TR-2005' },
];

const PARENTS = [
  { email: 'parent.aksoy@gozmacerasi.dev', name: 'Ayşe Aksoy', phone: '+90-555-100-0001' },
  { email: 'parent.yildiz@gozmacerasi.dev', name: 'Fatma Yıldız', phone: '+90-555-100-0002' },
  { email: 'parent.arslan@gozmacerasi.dev', name: 'Hasan Arslan', phone: '+90-555-100-0003' },
  { email: 'parent.koc@gozmacerasi.dev', name: 'Deniz Koç', phone: '+90-555-100-0004' },
  { email: 'parent.aydin@gozmacerasi.dev', name: 'Serkan Aydın', phone: '+90-555-100-0005' },
  { email: 'parent.gunes@gozmacerasi.dev', name: 'Burcu Güneş', phone: '+90-555-100-0006' },
  { email: 'parent.erdogan@gozmacerasi.dev', name: 'Kemal Erdoğan', phone: '+90-555-100-0007' },
  { email: 'parent.simsek@gozmacerasi.dev', name: 'Leyla Şimşek', phone: '+90-555-100-0008' },
  { email: 'parent.polat@gozmacerasi.dev', name: 'Oğuz Polat', phone: '+90-555-100-0009' },
  { email: 'parent.akin@gozmacerasi.dev', name: 'Selin Akın', phone: '+90-555-100-0010' },
];

const ADMINS = [
  { email: 'admin@gozmacerasi.dev', name: 'Platform Admin' },
  { email: 'admin.test@gozmacerasi.dev', name: 'Test Admin' },
];

const CHILDREN = [
  { name: 'Ali Aksoy', age: 7, diagnosis: 'Amblyopia - Anisometrop', va: '0.4', stereo: 'Basic', limit: 20, parentIdx: 0, docIdx: 0 },
  { name: 'Zeynep Aksoy', age: 5, diagnosis: 'Amblyopia - RO', va: '0.3', stereo: 'None', limit: 15, parentIdx: 0, docIdx: 0 },
  { name: 'Burak Yıldız', age: 9, diagnosis: 'Strabismus - ET', va: '0.5', stereo: 'Intermediate', limit: 25, parentIdx: 1, docIdx: 1 },
  { name: 'Elif Arslan', age: 6, diagnosis: 'Amblyopia - LO', va: '0.35', stereo: 'Basic', limit: 20, parentIdx: 2, docIdx: 1 },
  { name: 'Can Koç', age: 8, diagnosis: 'Strabismus - XT', va: '0.6', stereo: 'Intermediate', limit: 30, parentIdx: 3, docIdx: 2 },
  { name: 'Defne Aydın', age: 4, diagnosis: 'Amblyopia - Anisometrop', va: '0.25', stereo: 'None', limit: 15, parentIdx: 4, docIdx: 2 },
  { name: 'Emre Güneş', age: 10, diagnosis: 'Strabismus - Dissociated', va: '0.5', stereo: 'Basic', limit: 25, parentIdx: 5, docIdx: 3 },
  { name: 'Fatma Erdoğan', age: 7, diagnosis: 'Amblyopia - RO', va: '0.4', stereo: 'Basic', limit: 20, parentIdx: 6, docIdx: 3 },
  { name: 'Göksu Şimşek', age: 11, diagnosis: 'Strabismus - ET', va: '0.55', stereo: 'Intermediate', limit: 30, parentIdx: 7, docIdx: 4 },
  { name: 'Hüseyin Polat', age: 6, diagnosis: 'Amblyopia - LO', va: '0.3', stereo: 'None', limit: 15, parentIdx: 8, docIdx: 4 },
  { name: 'İrem Akın', age: 8, diagnosis: 'Amblyopia - Anisometrop', va: '0.45', stereo: 'Basic', limit: 20, parentIdx: 9, docIdx: 0 },
  { name: 'Mete K.', age: 7, diagnosis: 'Amblyopia', va: '0.4', stereo: 'Basic', limit: 20, parentIdx: 0, docIdx: 0 },
];

const GAME_IDS = [
  'game_target_1', 'game_target_2', 'game_target_3',
  'game_motion_1', 'game_motion_2',
  'game_puzzle_1', 'game_puzzle_2',
  'game_memory_1',
];

const PRESCRIPTIONS = [
  { childIdx: 0, diag: 'Amblyopia - Anisometrop', goals: { binocular_fusion: true, saccad_speed: false, stereopsis: true, motor_control: false }, games: [{ gameId: 'game_target_1', reason: 'Hedef takibi' }, { gameId: 'game_memory_1', reason: 'Görsel hafıza' }], diff: 'easy', limit: 20, notes: 'Monoküler mod ile başla, 1 hafta sonra kontrol.' },
  { childIdx: 2, diag: 'Strabismus - ET', goals: { binocular_fusion: true, saccad_speed: true, stereopsis: false, motor_control: true }, games: [{ gameId: 'game_motion_1', reason: 'Pursuit takibi' }, { gameId: 'game_puzzle_1', reason: 'Mekansal algı' }], diff: 'medium', limit: 25, notes: 'Divergence egzersizleri öncelikli.' },
  { childIdx: 4, diag: 'Strabismus - XT', goals: { binocular_fusion: true, saccad_speed: false, stereopsis: true, motor_control: false }, games: [{ gameId: 'game_target_2', reason: 'Stereopsis geliştirme' }, { gameId: 'game_puzzle_2', reason: 'Görsel tamamlama' }], diff: 'medium', limit: 30, notes: 'Konverjans egzersizleri odaklı.' },
  { childIdx: 6, diag: 'Strabismus - Dissociated', goals: { binocular_fusion: true, saccad_speed: true, stereopsis: false, motor_control: true }, games: [{ gameId: 'game_motion_2', reason: 'Motor koordinasyon' }, { gameId: 'game_target_3', reason: 'Sakkad hızı' }], diff: 'hard', limit: 25, notes: 'İleri seviye egzersizler, haftalık takip.' },
  { childIdx: 8, diag: 'Strabismus - ET', goals: { binocular_fusion: true, saccad_speed: true, stereopsis: true, motor_control: false }, games: [{ gameId: 'game_target_1', reason: 'Hedef takibi' }, { gameId: 'game_memory_1', reason: 'Dikkat' }], diff: 'medium', limit: 30, notes: 'Haftada 3 gün, 30 dakika seans.' },
];

const STORIES = ['space_journey', 'treasure_hunt', 'school_hero'];

async function cleanupAll() {
  console.log('Cleaning up existing data...');
  await prisma.adaptiveSession.deleteMany();
  await prisma.sessionScore.deleteMany();
  await prisma.inputTracking.deleteMany();
  await prisma.dailyQuest.deleteMany();
  await prisma.storyProgression.deleteMany();
  await prisma.streak.deleteMany();
  await prisma.doctorPrescription.deleteMany();
  await prisma.weeklyVisionScore.deleteMany();
  await prisma.readingSession.deleteMany();
  await prisma.onlineBookPage.deleteMany();
  await prisma.onlineBook.deleteMany();
  await prisma.gameSession.deleteMany();
  await prisma.premiumCode.deleteMany();
  await prisma.kVKKConsent.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.child.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();
  console.log('Cleanup complete.');
}

async function seedUsers() {
  console.log('Seeding users...');
  const hash = await bcrypt.hash(PASSWORD, SALT_ROUNDS);
  const result = { doctors: [], parents: [], admins: [] };

  for (const d of DOCTORS) {
    const user = await prisma.user.create({
      data: { email: d.email, name: d.name, password: hash, role: 'DOCTOR' },
    });
    const doctor = await prisma.doctor.create({
      data: { userId: user.id, specialization: d.spec, licenseNumber: d.license, verified: true },
    });
    result.doctors.push({ ...doctor, userId: user.id, email: d.email });
  }

  for (const p of PARENTS) {
    const user = await prisma.user.create({
      data: { email: p.email, name: p.name, password: hash, role: 'PARENT' },
    });
    const parent = await prisma.parent.create({
      data: { userId: user.id, phone: p.phone },
    });
    result.parents.push({ ...parent, userId: user.id, email: p.email });
  }

  for (const a of ADMINS) {
    const user = await prisma.user.create({
      data: { email: a.email, name: a.name, password: hash, role: 'ADMIN' },
    });
    const admin = await prisma.admin.create({ data: { userId: user.id } });
    result.admins.push({ ...admin, userId: user.id, email: a.email });
  }

  console.log(`  Created ${result.doctors.length} doctors, ${result.parents.length} parents, ${result.admins.length} admins`);
  return result;
}

async function seedChildren(parents, doctors) {
  console.log('Seeding children...');
  const children = [];

  for (const c of CHILDREN) {
    const child = await prisma.child.create({
      data: {
        parentId: parents[c.parentIdx].id,
        doctorId: doctors[c.docIdx].id,
        name: c.name,
        age: c.age,
        diagnosis: c.diagnosis,
        baselineVA: c.va,
        stereopsisLevel: c.stereo,
        dailyLimit: c.limit,
      },
    });
    children.push(child);
  }

  console.log(`  Created ${children.length} children`);
  return children;
}

async function seedGames() {
  console.log('Seeding 8 MVP games...');
  const games = [
    { id: 'game_target_1', title: 'Balon Patlatma', category: 'TargetingGame', desc: 'Kırmızı göz balonları, mavi göz iğneleri görür.', therapy: 'El-göz koordinasyonu, binoküler füzyon', playable: true },
    { id: 'game_target_2', title: 'Yıldız Toplama', category: 'TargetingGame', desc: 'Bir göz yıldızları, diğer göz yol haritasını görür.', therapy: 'Stereopsis, mekânsal farkındalık', playable: true },
    { id: 'game_target_3', title: 'Hedef Vur', category: 'TargetingGame', desc: 'Hedefler bir gözde, nişangah diğer gözde.', therapy: 'Hassas sakkad, hedefleme', playable: true },
    { id: 'game_motion_1', title: 'Kelebek Yakalama', category: 'MotionGame', desc: 'Kelebekler bir gözde, ağ diğer gözde görünür.', therapy: 'Pursuit hareketi', playable: true },
    { id: 'game_motion_2', title: 'Kurbağa Geçirme', category: 'MotionGame', desc: 'Kurbağa bir gözde, araçlar diğer gözde.', therapy: 'Planlama, zamanlama', playable: true },
    { id: 'game_puzzle_1', title: 'Labirent Kaçışı', category: 'PuzzleGame', desc: 'Labirent bir gözde, çıkış diğer gözde.', therapy: 'Problem çözme, stereopsis', playable: true },
    { id: 'game_puzzle_2', title: 'Resim Tamamlama', category: 'PuzzleGame', desc: 'Yarım resim bir gözde, diğer yarım diğer gözde.', therapy: 'Görsel tamamlama', playable: true },
    { id: 'game_memory_1', title: 'Eşleştirme Oyunu', category: 'MemoryGame', desc: 'Kartlar bir gözde açık, diğer gözde kapalı.', therapy: 'Görsel hafıza, dikkat', playable: true },
  ];

  for (const g of games) {
    await prisma.game.upsert({
      where: { id: g.id },
      update: { title: g.title, category: g.category, description: g.desc, therapyTarget: g.therapy, isPlayable: g.playable },
      create: { id: g.id, title: g.title, category: g.category, description: g.desc, therapyTarget: g.therapy, isPlayable: g.playable, minAge: 4, maxAge: 14 },
    });
  }

  console.log(`  Upserted ${games.length} games`);
}

async function seedSessions(children) {
  console.log('Seeding game sessions...');
  let count = 0;

  for (const child of children) {
    const sessionCount = 5 + Math.floor(Math.random() * 8);

    for (let i = 0; i < sessionCount; i++) {
      const daysAgo = Math.floor(Math.random() * 14);
      const startedAt = new Date();
      startedAt.setDate(startedAt.getDate() - daysAgo);
      startedAt.setHours(8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60));

      const duration = 180 + Math.floor(Math.random() * 600);
      const accuracy = 0.55 + Math.random() * 0.35;
      const reactionTime = 400 + Math.floor(Math.random() * 600);
      const difficulty = Math.min(5, 1 + Math.floor(daysAgo / 3));

      await prisma.gameSession.create({
        data: {
          childId: child.id,
          gameId: GAME_IDS[i % GAME_IDS.length],
          duration,
          difficulty,
          finalScore: Math.round(accuracy * 100 + Math.random() * 20),
          accuracy: accuracy.toFixed(2),
          reactionTime,
          startedAt,
          endedAt: new Date(startedAt.getTime() + duration * 1000),
        },
      });
      count++;
    }
  }

  console.log(`  Created ${count} game sessions`);
}

async function seedPrescriptions(doctors, children) {
  console.log('Seeding prescriptions...');
  let count = 0;

  for (const rx of PRESCRIPTIONS) {
    const child = children[rx.childIdx];
    if (!child) continue;

    await prisma.doctorPrescription.create({
      data: {
        doctorId: doctors[CHILDREN[rx.childIdx].docIdx].id,
        childId: child.id,
        diagnosis: rx.diag,
        targetGoals: rx.goals,
        recommendedGames: rx.games,
        difficultyRange: rx.diff,
        dailyLimitMinutes: rx.limit,
        notes: rx.notes,
        status: 'active',
      },
    });
    count++;
  }

  console.log(`  Created ${count} prescriptions`);
}

async function seedEngagement(children) {
  console.log('Seeding engagement (quests, streaks, stories)...');
  let questCount = 0;
  let streakCount = 0;
  let storyCount = 0;

  const questDefs = [
    { questId: 'morning_challenge', questType: 'morning_challenge', questName: 'Morning Challenge', xp: 10 },
    { questId: 'focus_master', questType: 'focus_master', questName: 'Focus Master', xp: 15 },
    { questId: 'accuracy_expert', questType: 'accuracy_expert', questName: 'Accuracy Expert', xp: 15 },
  ];

  for (const child of children) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentStreak = 1 + Math.floor(Math.random() * 6);
    await prisma.streak.create({
      data: {
        childId: child.id,
        currentStreak,
        bestStreak: currentStreak + Math.floor(Math.random() * 3),
        lastPlayDate: today,
        bonusMultiplier: currentStreak >= 4 ? 1.5 : 1.1,
      },
    });
    streakCount++;

    for (let d = 0; d < 3; d++) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      date.setHours(0, 0, 0, 0);

      const quest = questDefs[d % questDefs.length];
      await prisma.dailyQuest.create({
        data: {
          childId: child.id,
          questId: quest.questId,
          questType: quest.questType,
          questName: quest.questName,
          completionDate: date,
          xpEarned: quest.xp,
          completedAt: new Date(date.getTime() + 3600000),
        },
      });
      questCount++;
    }

    for (const storyId of STORIES) {
      await prisma.storyProgression.create({
        data: {
          childId: child.id,
          storyId,
          chapterId: 1,
          unlockedDate: new Date(Date.now() - 7 * 86400000),
          completionDate: new Date(Date.now() - 3 * 86400000),
          xpEarned: 20,
        },
      });
      storyCount++;
    }
  }

  console.log(`  Created ${streakCount} streaks, ${questCount} quests, ${storyCount} story progressions`);
}

async function seedBooks() {
  console.log('Seeding 5 stereoscopic books...');

  const books = [
    {
      title: 'Alice Harikalar Diyarında',
      author: 'Lewis Carroll',
      category: 'Macera',
      description: 'Alice tavşan deliğinden düşerek harikalar diyarına ulaşır.',
      coverColor: '#8B5CF6',
      pages: [
        { num: 1, text: 'Alice bir gün nehir kenarında oturmuş, can sıkıntısından ne yapacağını düşünüyordu. Yanından beyaz bir tavşan geçti!', depth: 1 },
        { num: 2, text: 'Tavşan cebinden bir saat çıkardı ve "Geç kaldım, geç kaldım!" diye bağırdı. Alice merakla peşinden koştu.', depth: 1 },
        { num: 3, text: 'Tavşan bir deliğe daldı. Alice de arkasından atladı. Uzun bir tünel boyunca düştü ve düştü...', depth: 2 },
        { num: 4, text: 'Sonunda kocaman bir odaya ulaştı. Etrafında kapılar vardı. Bir tanesi çok küçüktü!', depth: 1 },
        { num: 5, text: 'Küçük kapının arkasından güzel bir bahçe görünüyordu. Ama Alice kapıdan geçemiyordu, çok büyüktü!', depth: 2 },
        { num: 6, text: 'Masada bir şişe gördü: "İÇ" yazıyordu. İçti ve küçülmeye başladı!', depth: 1 },
        { num: 7, text: 'Şimdi küçücüktü ama kapı hâlâ kapalıydı. Anahtar yerdeydi ama ulaşamıyordu.', depth: 2 },
        { num: 8, text: 'Masada bir kek buldu: "YE" yazıyordu. Yedi ve büyümeye başladı, tavanı aştı!', depth: 1 },
        { num: 9, text: 'Sonunda doğru boyuta ulaştı ve güzel bahçeye geçti. Burada çiçekler konuşuyordu!', depth: 2 },
        { num: 10, text: 'Bahçede Kupa Kraliçesi ile tanıştı. "Kafasını kesin!" diye bağırıyordu herkese. Alice bu maceradan çok şey öğrendi.', depth: 1 },
      ],
    },
    {
      title: 'Küçük Prens',
      author: 'A. de Saint-Exupéry',
      category: 'Masal',
      description: 'Küçük Prens gezegeninden ayrılarak evreni keşfeder.',
      coverColor: '#F59E0B',
      pages: [
        { num: 1, text: 'Çölde bir pilot uçağı bozuldu. Karşısında küçük bir çocuk belirdi: "Bana bir koyun çiz!" dedi.', depth: 1 },
        { num: 2, text: 'Küçük Prens çok küçük bir gezegenden geliyordu. Gezegeninde üç yanardağ ve bir gül vardı.', depth: 2 },
        { num: 3, text: 'Gülü çok seviyordu ama gül çok nazlıydı. Küçük Prens üzülerek gezegeninden ayrıldı.', depth: 1 },
        { num: 4, text: 'Yolculuğunda 6 gezegen ziyaret etti. Birinde kral, birinde sanatçı, birinde içen bir adam vardı.', depth: 2 },
        { num: 5, text: 'Dünya\'ya geldiğinde bir tilki ile tanıştı. Tilki ona "Beni evcilleştir" dedi.', depth: 1 },
        { num: 6, text: '"Görünmeyen şeyler kalplerde saklıdır" dedi tilki. "Gülü benzersiz yapan ona harcadığın zamandır."', depth: 2 },
        { num: 7, text: 'Küçük Prens çölde bir kuyu buldu. Su çok lezzetliydi çünkü emekle bulunmuştu.', depth: 1 },
        { num: 8, text: 'Pilot uçağını tamir etti. Küçük Prens yılanın yardımıyla gezegenine döndü.', depth: 2 },
        { num: 9, text: 'Pilot gökyüzüne baktığında yıldızların güldüğünü düşünürdü. Çünkü birinde Küçük Prens yaşıyordu.', depth: 1 },
        { num: 10, text: 'Unutma: "İnsan ancak kalbiyle doğruyu görebilir. Gözler asıl gerçeği göremez."', depth: 2 },
      ],
    },
    {
      title: 'Pinokyo',
      author: 'Carlo Collodi',
      category: 'Macera',
      description: 'Tahta kukla Pinokyo\'nun gerçek bir çocuk olma macerası.',
      coverColor: '#10B981',
      pages: [
        { num: 1, text: 'Marangoz Gepetto usta bir tahta kukla yaptı ve ona Pinokyo adını verdi.', depth: 1 },
        { num: 2, text: 'Bir peri kuklaya can verdi. Ama Pinokyo hâlâ tahtaydı. Yalan söyledikçe burnu uzuyordu!', depth: 2 },
        { num: 3, text: 'Pinokyo okula gitmek yerine kukla gösterisine gitti. Kötü adam onu yakaladı!', depth: 1 },
        { num: 4, text: 'Mavi Peri onu kurtardı. "Artık söz dinle, okula git" dedi.', depth: 2 },
        { num: 5, text: 'Pinokyo yine yaramazlık yaptı. Tilki ve kedi onu kandırdı. Para ağacı diye altın gömdü!', depth: 1 },
        { num: 6, text: 'Altınlar çalındı. Pinokyo hapse düştü. Çok pişman oldu.', depth: 2 },
        { num: 7, text: 'Hapisten çıkınca babasını aradı. Gepetto balina tarafından yutulmuştu!', depth: 1 },
        { num: 8, text: 'Pinokyo cesurca balinanın ağzına daldı ve babasını kurtardı.', depth: 2 },
        { num: 9, text: 'Artık söz dinliyordu, okula gidiyordu, yalan söylemiyordu.', depth: 1 },
        { num: 10, text: 'Bir sabah uyandığında gerçek bir çocuk olmuştu! Gepetto\'nun gözleri sevinçle parlıyordu.', depth: 2 },
      ],
    },
    {
      title: 'Alaaddin ve Sihirli Lamba',
      author: 'Binbir Gece',
      category: 'Masal',
      description: 'Alaaddin sihirli lambayı bularak hayatını değiştirir.',
      coverColor: '#EF4444',
      pages: [
        { num: 1, text: 'Alaaddin fakir bir gençti. Bir gün kötü bir büyücü onu mağaraya gönderdi.', depth: 1 },
        { num: 2, text: 'Mağarada mücevherler ve sihirli eşyalar vardı. Aralarında eski bir lamba dikkat çekiyordu.', depth: 2 },
        { num: 3, text: 'Alaaddin lambayı ovuşturdu. Duman çıktı ve dev bir cin belirdi! "Emret efendim!" dedi.', depth: 1 },
        { num: 4, text: 'Cin ona saray ve zenginlik verdi. Alaaddin prensesle tanıştı ve ona âşık oldu.', depth: 2 },
        { num: 5, text: 'Büyücü lambayı çalmak için geri döndü. Prensesi kandırdı!', depth: 1 },
        { num: 6, text: 'Alaaddin sihirli yüzüğü sayesinde başka bir cin çağırdı ve saraya döndü.', depth: 2 },
        { num: 7, text: 'Büyücüyü yendi ve lambayı geri aldı. Prensesi kurtardı!', depth: 1 },
        { num: 8, text: 'Kral Alaaddin\'i takdir etti. Düğünleri büyük bir şölenle kutlandı.', depth: 2 },
        { num: 9, text: 'Alaaddin ve prenses mutlu yaşadı. Cin her zaman hazırdı.', depth: 1 },
        { num: 10, text: 'Unutma: Cesaret ve iyilik her zaman kazanır!', depth: 2 },
      ],
    },
    {
      title: 'Nasreddin Hoca Fıkraları',
      author: 'Halk Hikayeleri',
      category: 'Eğlence',
      description: 'Nasreddin Hoca\'nın zekice ve komik hikâyeleri.',
      coverColor: '#6366F1',
      pages: [
        { num: 1, text: 'Nasreddin Hoca bir gün eşeğine ters bindi. Herkes güldü. "Önemli olan eşekle aynı yöne bakmak değil, aynı yere gitmektir" dedi.', depth: 1 },
        { num: 2, text: 'Bir komşusu kazan istemeye geldi. Hoca verdi. Ertesi gün kazanla birlikte küçük bir tencere de getirdi.', depth: 2 },
        { num: 3, text: '"Bu ne?" diye sordu Hoca. "Kazanınız doğurdu" dedi komşu. Hoca gülümsedi.', depth: 1 },
        { num: 4, text: 'Bir gün göle yoğurt döktü. "Yoğurt tutarsa ne iyi, tutmazsa zaten su" dedi.', depth: 2 },
        { num: 5, text: 'Hoca\'ya sordular: "Dünya mı büyük, ay mı?" "Hangisini görmeniz kolay?" dedi.', depth: 1 },
        { num: 6, text: 'Bir adam Hoca\'ya "Sen bilge misin?" diye sordu. "Hayır, sadece cahil olmadığımı biliyorum" dedi.', depth: 2 },
        { num: 7, text: 'Hoca ceviz ağacına baktı. "Neden büyük ağaçta küçük ceviz, küçük ağaçta büyük kabak?" dedi.', depth: 1 },
        { num: 8, text: 'Pazarda bir adam "BuTest1234!Test1234!Test1234!" diye bağırdı. Hoca susturdu: "Her şeyi satma, bazen susmak daha değerli."', depth: 2 },
        { num: 9, text: 'Hoca\'ya "Neden her zaman gülüyorsun?" diye sordular. "Ağlamak bedava ama gülmenin kıymeti bilinmiyor" dedi.', depth: 1 },
        { num: 10, text: 'Nasreddin Hoca hep derdi: "Test etmeden inanma, düşünmeden konuşma, sevmeden yaşama."', depth: 2 },
      ],
    },
  ];

  for (const bookData of books) {
    const { pages, ...bookFields } = bookData;
    const book = await prisma.onlineBook.create({ data: bookFields });

    for (const page of pages) {
      await prisma.onlineBookPage.create({
        data: {
          bookId: book.id,
          pageNumber: page.num,
          textContent: page.text,
          depthLayer: page.depth,
        },
      });
    }
  }

  console.log(`  Created ${books.length} books with pages`);
}

async function main() {
  console.log('=== GÖZMACERASI COMPREHENSIVE SEED ===\n');

  await cleanupAll();

  const { doctors, parents, admins } = await seedUsers();
  const children = await seedChildren(parents, doctors);
  await seedGames();
  await seedBooks();
  await seedSessions(children);
  await seedPrescriptions(doctors, children);
  await seedEngagement(children);

  console.log('\n=== SEED COMPLETE ===');
  console.log(`Doctors: ${doctors.length}`);
  console.log(`Parents: ${parents.length}`);
  console.log(`Admins: ${admins.length}`);
  console.log(`Children: ${children.length}`);
  console.log(`Games: 8`);
  console.log(`Books: 5`);
  console.log(`\nAll passwords: ${PASSWORD}`);

  return { doctors, parents, admins, children };
}

main()
  .then(async (data) => {
    const lines = [
      '========================================',
      '  GÖZMACERASI SEED CREDENTIALS',
      '  Generated: ' + new Date().toISOString(),
      '  ALL PASSWORDS: Test1234!',
      '========================================',
      '',
      '--- ADMINS ---',
    ];

    for (const a of data.admins) {
      lines.push(`  ${a.email} | Test1234!`);
    }

    lines.push('', '--- DOCTORS ---');
    for (const d of data.doctors) {
      lines.push(`  ${d.email} | Test1234!`);
    }

    lines.push('', '--- PARENTS ---');
    for (const p of data.parents) {
      lines.push(`  ${p.email} | Test1234!`);
    }

    lines.push('', '--- CHILDREN ---');
    for (const c of data.children) {
      lines.push(`  ${c.name} (${c.age}) | ${c.diagnosis}`);
    }

    const fs = require('fs');
    fs.writeFileSync('SEED_CREDENTIALS.txt', lines.join('\n'), 'utf8');
    console.log('\nCredentials written to SEED_CREDENTIALS.txt');

    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Seed failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
