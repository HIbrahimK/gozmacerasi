const BASE = 'http://localhost:3001/api';
let TOKEN = '';
let passed = 0;
let failed = 0;

async function req(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (TOKEN) opts.headers['Authorization'] = `Bearer ${TOKEN}`;
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}

function assert(label, condition) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.log(`  ❌ ${label}`);
    failed++;
  }
}

async function testAuth() {
  console.log('\n🔐 AUTH TESTS');

  const login = await req('POST', '/auth/login', { email: 'admin@gozmacerasi.dev', password: 'Test1234!' });
  assert('POST /auth/login returns 201', login.status === 201);
  assert('Login returns accessToken', !!login.data.accessToken);
  TOKEN = login.data.accessToken;

  const me = await req('GET', '/auth/me');
  assert('GET /auth/me returns user', me.status === 200);
  assert('User email matches', me.data.email === 'admin@gozmacerasi.dev');

  const register = await req('POST', '/auth/register', { email: `test_${Date.now()}@test.com`, fullName: 'Test User', password: 'Test1234!' });
  assert('POST /auth/register returns 201', register.status === 201);
}

async function testAdmin() {
  console.log('\n🛡️ ADMIN TESTS');

  const stats = await req('GET', '/admin/stats');
  assert('GET /admin/stats returns 200', stats.status === 200);
  assert('Stats has totalUsers', stats.data.totalUsers > 0);
  assert('Stats has totalChildren', stats.data.totalChildren > 0);
  assert('Stats has totalGames', stats.data.totalGames === 8);

  const users = await req('GET', '/admin/users');
  assert('GET /admin/users returns array', Array.isArray(users.data));
  assert('Users list has items', users.data.length > 0);

  const filtered = await req('GET', '/admin/users?role=DOCTOR');
  assert('Filtered by DOCTOR role', filtered.data.every(u => u.role === 'DOCTOR'));

  if (users.data.length > 0) {
    const userId = users.data[0].id;
    const detail = await req('GET', `/admin/users/${userId}`);
    assert('GET /admin/users/:id returns user detail', detail.status === 200);
    assert('Detail has id', !!detail.data.id);
  }
}

async function testChildren() {
  console.log('\n👶 CHILDREN TESTS');

  const list = await req('GET', '/children');
  assert('GET /children returns array', Array.isArray(list.data));
  assert('Children list has items', list.data.length > 0);
}

async function testGames() {
  console.log('\n🎮 GAMES TESTS');

  const list = await req('GET', '/games');
  assert('GET /games returns array', Array.isArray(list.data));
  assert('Games list has 8 playable games', list.data.filter(g => g.isPlayable).length === 8);
  assert('Balon Patlatma exists', list.data.some(g => g.title === 'Balon Patlatma'));
  assert('Eşleştirme Oyunu exists', list.data.some(g => g.title === 'Eşleştirme Oyunu'));
}

async function testSessions() {
  console.log('\n📊 SESSIONS TESTS');

  const list = await req('GET', '/sessions');
  assert('GET /sessions returns array', Array.isArray(list.data));
  assert('Sessions list has items', list.data.length > 0);

  const metrics = await req('GET', '/sessions/metrics');
  assert('GET /sessions/metrics returns 200', metrics.status === 200);
  assert('Metrics has totalChildren', metrics.data.totalChildren > 0);
  assert('Metrics has weeklyTrend', Array.isArray(metrics.data.weeklyTrend));
}

async function testParent() {
  console.log('\n👨‍👩‍👧 PARENT TESTS');

  const dashboard = await req('GET', '/parent/dashboard');
  assert('GET /parent/dashboard returns 200', dashboard.status === 200);
  assert('Dashboard has children', Array.isArray(dashboard.data.children));
  assert('Dashboard has weeklyTrend', Array.isArray(dashboard.data.weeklyTrend));

  const children = await req('GET', '/parent/children');
  assert('GET /parent/children returns array', Array.isArray(children.data));

  if (children.data.length > 0) {
    const childId = children.data[0].id;
    const progress = await req('GET', `/parent/children/${childId}/progress`);
    assert('GET /parent/children/:id/progress returns 200', progress.status === 200);
    assert('Progress has totalSessions', typeof progress.data.totalSessions === 'number');
  }
}

async function testDoctor() {
  console.log('\n🩺 DOCTOR TESTS');

  const patients = await req('GET', '/doctor/patients');
  assert('GET /doctor/patients returns array', Array.isArray(patients.data));
  assert('Patients list has items', patients.data.length > 0);

  if (patients.data.length > 0) {
    const patientId = patients.data[0].id;
    const detail = await req('GET', `/doctor/patients/${patientId}`);
    assert('GET /doctor/patients/:id returns 200', detail.status === 200);
    assert('Detail has sessions', Array.isArray(detail.data.sessions));
  }

  const prescriptions = await req('GET', '/doctor/prescriptions');
  assert('GET /doctor/prescriptions returns array', Array.isArray(prescriptions.data));
  assert('Prescriptions list has items', prescriptions.data.length > 0);
}

async function testQuests() {
  console.log('\n🎯 QUEST TESTS');

  const children = await req('GET', '/parent/children');
  if (!children.data.length) { console.log('  ⚠️ No children, skipping'); return; }
  const childId = children.data[0].id;

  const quests = await req('GET', `/quests/${childId}`);
  assert('GET /quests/:childId returns array', Array.isArray(quests.data));
  assert('Quests have 6 definitions', quests.data.length === 6);

  const xp = await req('GET', `/quests/${childId}/xp`);
  assert('GET /quests/:childId/xp returns number', typeof xp.data === 'number');
}

async function testStreaks() {
  console.log('\n🔥 STREAK TESTS');

  const children = await req('GET', '/parent/children');
  if (!children.data.length) { console.log('  ⚠️ No children, skipping'); return; }
  const childId = children.data[0].id;

  const streak = await req('GET', `/streaks/${childId}`);
  assert('GET /streaks/:childId returns 200', streak.status === 200);
  assert('Streak has currentStreak', typeof streak.data.currentStreak === 'number');
  assert('Streak has bestStreak', typeof streak.data.bestStreak === 'number');
  assert('Streak has bonusMultiplier', typeof streak.data.bonusMultiplier === 'number');
}

async function testStories() {
  console.log('\n📖 STORY TESTS');

  const children = await req('GET', '/parent/children');
  if (!children.data.length) { console.log('  ⚠️ No children, skipping'); return; }
  const childId = children.data[0].id;

  const stories = await req('GET', `/stories/${childId}`);
  assert('GET /stories/:childId returns array', Array.isArray(stories.data));
  assert('Stories have 3 definitions', stories.data.length === 3);
  assert('Each story has chapters', stories.data.every(s => Array.isArray(s.chapters)));
}

async function testCalibration() {
  console.log('\n🔧 CALIBRATION TESTS');

  const presets = await req('GET', '/calibration/presets');
  assert('GET /calibration/presets returns array', Array.isArray(presets.data));
  assert('Has 4 presets', presets.data.length === 4);
}

async function testScoring() {
  console.log('\n📈 SCORING TESTS');

  const children = await req('GET', '/parent/children');
  if (!children.data.length) { console.log('  ⚠️ No children, skipping'); return; }
  const childId = children.data[0].id;

  const scores = await req('GET', `/scores/child/${childId}`);
  assert('GET /scores/child/:id returns array', Array.isArray(scores.data));

  const vision = await req('GET', `/scores/vision/${childId}`);
  assert('GET /scores/vision/:id returns array', Array.isArray(vision.data));
}

async function run() {
  console.log('=== GÖZMACERASI API INTEGRATION TESTS ===');
  console.log(`Target: ${BASE}`);

  try {
    await testAuth();
    await testAdmin();
    await testChildren();
    await testGames();
    await testSessions();
    await testParent();
    await testDoctor();
    await testQuests();
    await testStreaks();
    await testStories();
    await testCalibration();
    await testScoring();
  } catch (err) {
    console.error('\n💥 FATAL ERROR:', err.message);
    failed++;
  }

  console.log(`\n=== RESULTS: ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

run();
