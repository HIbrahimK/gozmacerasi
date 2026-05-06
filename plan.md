# Gözmacerası Proje Geliştirme Planı

## PROJE DURUMU (GÜNCEL)

### Mevcut Durum (6 Mayıs 2026 – 18:52 UTC+3)
- **Phase:** Faz 0 TAMAMLANDI → **Faz 1 başlamak üzere**
- **Bugün:** 6 Mayıs → Faz 1: Dashboards (6–8 Mayıs)

### Tamamlanan İşler (Faz 0 – Hazırlık)

**Altyapı:**
- ✅ Turborepo monorepo yapısı (`packages/web`, `packages/backend`, `packages/shared/*`)
- ✅ Next.js 14 (App Router) frontend
- ✅ NestJS backend (Auth, Children, Games, Sessions modülleri)
- ✅ PostgreSQL (localhost:15432) + Adminer (localhost:8080)
- ✅ Prisma schema + migration (TÜM CodeV3 tabloları mevcut)
- ✅ Seed data: 2 kullanıcı (parent, doctor), 2 çocuk, 3 oyun, 6 oturum
- ✅ Backend build başarılı

**Frontend Sayfalar (Mevcut):**
- `/` – Ana sayfa (basit landing, giriş/kayıt butonları)
- `/login` – Giriş sayfası
- `/register` – Kayıt sayfası
- `/dashboard` – Genel dashboard (Chart.js ile haftalık trend, çocuk profilleri)
- `/games` – Oyun listesi sayfası
- `/sessions` – Oturum sayfası

**Backend Modülleri (Mevcut):**
- `auth` – JWT tabanlı kimlik doğrulama (login/register)
- `children` – Çocuk profili CRUD
- `games` – Oyun metadata CRUD
- `sessions` – Oyun oturumları + metrik endpoint

**Shared Packages (Mevcut – Stub):**
- `game-engine` – BaseGame class (sadece constructor, henüz implementasyon yok)
- `api-client` – Stub
- `ui-components` – Stub
- `utils` – Stub

**Prisma Schema (CodeV3 TÜM tablolar mevcut):**
- users, parents, doctors, admins, children
- games, game_sessions
- adaptive_sessions, session_scores, weekly_vision_scores
- input_tracking
- daily_quests, streaks, story_progression
- doctor_prescriptions
- premium_codes, kvkk_consents, audit_logs

## CODEV2 vs CODEV3 KARŞILAŞTIRMASI

CodeV2: MVP + 50+ oyun kataloğu + katalog stratejisi + klinik güvenlik
CodeV3: CodeV2 + 8 unicorn katmanı

### CodeV3'teki 8 Yeni Katman (CodeV2'de yok)
1. **Adaptif Terapi Motoru** – Otomatik zorluk ayarı (kural tabanlı)
2. **Smart Scoring Sistemi** – Focus Score + Vision Score (terapötik)
3. **Katılım Loop** – Görevler (günlük), streakler (7 gün), Story progression (3 bölüm)
4. **Game Engine SDK** – Oyun geliştirme hızı 5x artırıldı
5. **Input Tracking & Analysis** – Mouse/eye motor metrikleri
6. **PostHog Analytics** – Doktor ve ebeveyn derin analiz
7. **Doktor Reçete Sistemi** – Klinisyen-odaklı tanı ve tedavi planı
8. **Story Progression Engine** – Hikaye-tabanlı motivasyon

### CodeV2'de var olan ancak CodeV3'te gelişen
- 8 tam oyun (SDK ile 1-2 gün/oyun)
- 5 stereoskopik kitap
- 50+ oyun kataloğu
- Doktor/Ebeveyn/Admin panelleri
- Premium kod sistemi
- PWA + offline desteği
- KVKK/onam + audit log
- AI asistanı + guardrail'ler

### CodeV3'te eklenen veritabanı tabloları
- `adaptive_sessions` – Adaptif motor seansları
- `session_scores` – Focus + Vision Score
- `weekly_vision_scores` – Haftalık trendler
- `input_tracking` – Mouse/eye event kaydı
- `daily_quests` – Günlük görevler
- `streaks` – Streak takibi
- `story_progression` – Hikaye ilerlemesi
- `doctor_prescriptions` – Doktor reçeteleri

## HANGİ ADIMDAYIZ?

### CodeV3 Kapsam Karşılaştırması

**CodeV3, CodeV1 ve CodeV2'yi tamamen kapsar.** Üç plan dosyası arasındaki ilişki:

| Plan | Kapsam | Durum |
|------|--------|-------|
| `code.md` (v1) | 28 oyun, 20 kitap, e-ticaret, AI, PWA, 50+ özellik | CodeV3 tarafından kapsanır |
| `codev2.md` | v1 + MVP gerçekçilik + katalog stratejisi + klinik güvenlik | CodeV3 tarafından kapsanır |
| `codev3.md` | v2 + 8 unicorn katman (adaptive, scoring, engagement, SDK, tracking, analytics, RX, story) | **GEÇERLİ PLAN** |

**CodeV3'ün eklediği 8 katman (CodeV2'de yok):**
1. Adaptif Terapi Motoru → Prisma `adaptive_sessions` tablosu ✅
2. Smart Scoring (Focus + Vision) → Prisma `session_scores` + `weekly_vision_scores` ✅
3. Katılım Loop (Quest/Streak/Story) → Prisma `daily_quests`, `streaks`, `story_progression` ✅
4. Game Engine SDK → `packages/shared/game-engine` (stub, henüz implementasyon yok)
5. Input Tracking → Prisma `input_tracking` tablosu ✅
6. PostHog Analytics → Henüz entegre edilmedi
7. Doktor Reçete Sistemi → Prisma `doctor_prescriptions` tablosu ✅
8. Story Progression Engine → Prisma `story_progression` tablosu ✅

**CodeV3'ten ÇIKARILANLAR (Phase 2):**
- ❌ Eye-tracking (Tobii/WebGazer)
- ❌ E-ticaret (gözlük/kitap satışı, kargo)
- ❌ Native uygulamalar (React Native, Tauri)
- ❌ Hospital API (HL7)
- ❌ ML-based scoring (Scikit-learn)
- ❌ Ödeme işlemcisi (Iyzico/Paracode)

### Güncel Timeline (CodeV3 10 Faz / 17 Gün)

| Faz | Gün | Durum | Açıklama |
|-----|-----|-------|----------|
| **0** | 4–5 Mayıs | ✅ TAMAMLANDI | Altyapı (Next.js, NestJS, Prisma, Auth, tema, dil, seed) |
| **1** | 6–8 Mayıs | 🔄 BAŞLAYACAK | Dashboards (Admin, Parent, Doctor panelleri) |
| **2** | 9–10 Mayıs | ⏳ | Game Engine + Adaptive (SDK, motor kuralları, zorluk ayarı) |
| **3** | 11–12 Mayıs | ⏳ | Oyunlar + Scoring (8 oyun, Focus+Vision Score) |
| **4** | 13–14 Mayıs | ⏳ | Engagement Loop (Quest, Streak, Story, PostHog) |
| **5** | 15 Mayıs | ⏳ | Kitaplar + Input Tracking (5 kitap, mouse tracking) |
| **6** | 16 Mayıs | ⏳ | Content + Doctor RX (Landing, KVKK, reçete formu, AI) |
| **7** | 17 Mayıs | ⏳ | PWA + Katalog + Blog (Service worker, 50+ kart, 5 blog) |
| **8** | 18 Mayıs | ⏳ | SEO + Demo Mode (Meta, sitemap, `/demo` sayfası) |
| **9** | 19–21 Mayıs | ⏳ | QA + Deploy (Test, staging, production, yatırımcı demo) |

**Bugün:** 6 Mayıs 2026 → **Faz 1 başlıyor**

### Mevcut Eksiklikler (Faz 1'de yapılacak)

**Frontend:**
- ❌ Admin panel layout (sidebar, header, responsive)
- ❌ Admin: Kullanıcı CRUD sayfası
- ❌ Admin: Oyun/kitap yönetimi
- ❌ Admin: Premium kod üretimi
- ❌ Parent panel layout
- ❌ Parent: Çocuk profil detayı
- ❌ Parent: Oyun listesi + filtreleme
- ❌ Parent: Kullanım raporları (Chart.js)
- ❌ Doctor panel layout
- ❌ Doctor: Hasta listesi + detay
- ❌ Doctor: Reçete formu
- ❌ Doctor: Mesajlaşma

**Backend:**
- ❌ Admin modülü (CRUD endpoints)
- ❌ Parent modülü (dashboard metrics)
- ❌ Doctor modülü (patients, prescriptions)
- ❌ Premium kod modülü
- ❌ Scoring servisi (Focus + Vision hesaplama)
- ❌ Adaptive engine servisi
- ❌ Quest/Streak/Story servisleri
- ❌ PostHog event servisi
- ❌ Input tracking servisi

**Shared:**
- ❌ Game Engine SDK (BaseGame implementasyonu)
- ❌ UI Components kütüphanesi
- ❌ API Client

## EKLENEBİLECEK YENİ ÖZELLİKLER (CodeV3'te yok)

### 1. Sosyal ve Topluluk Özellikleri
- **Ebeveyn Topluluk Forumu** – Deneyim paylaşımı, destek grupları
- **Doktor-Doktor Mesajlaşma** – Klinik konsültasyon
- **Hasta Karşılaştırma** – Anonim benzer yaş/hasta karşılaştırması (izole benzerlik)
- **Grup Terapi Modu** – Doktor kontrolünde çoklu hastalı oyunlar

### 2. Oyun ve İçerik Geliştirmeleri
- **Multiplayer Mini-Oyunlar** – 2-4 çocuk aynı anda (sadece eğlence, ileride)
- **Yapay Zeka ile Hikaye Üretimi** – Çocuğun seviyesine göre özel hikayeler
- **Oyun Modu Oluşturucu** – Ebeveyn/doktor basit oyun senaryosu yaratma
- **Dil Öğrenme Modu** – İngilizce/Almanca kelime eşleştirme oyunları
- **Müzik Terapi Entegrasyonu** – Ritim ve melodi oyunları

### 3. Veri ve Analitik (Phase 2'de olacaklara ek)
- **Tele-Health Konsültasyon** – Doktorla canlı video görüntülü görüşme
- **AI ile Erken Teşhis** – Eye-tracking ile şaşılık taraması (Phase 2'de zaten var)
- **Predictive Analytics** – Hangi çocuğun tedaviye daha iyi yanıt vereceğini tahmin etme
- **Symptom Tracking** – Ebeveyn günlük gözlem girişi
- **Medication Tracking** – Görme kası güçlendirme ilaçları takibi (doktor)

### 4. Platform ve Teknik
- **Apple Vision Pro Uyumluluk** – AR tabanlı terapi
- **Smart Glass Entegrasyonu** – Google Glass Enterprise, Vuzix
- **Wearable Sync** – Apple Watch/Fitbit ile uyum (motivasyon)
- **Offline Backup** – Tam çevrimdışı mod, export/import
- **Family Account** – 3+ çocuk aynı hesapta

### 5. Klinik ve Doktor Workflow
- **Telemedicine Portal** – Canlı doktor görüşmesi
- **Clinic Management System** – Poliklinik için hasta takibi
- **Research Dashboard** – Akademisyenler için anonim veri (İzinli)
- **Treatment Protocol Templates** – Tedavi protokolü şablonları
- **Automated Reminders** – Randevu ve ilaç hatırlatmaları

### 6. İçerik ve Pazarlama
- **YouTube Kanalı** – Oyun oynama videoları, eğitim içeriği
- **Podcast** – Doktor röportajları, ebeveyn sohbetleri
- **Gamification Progress Export** – İlerleme PDF'si (ebeveyn paylaşımı)
- **"Play With Friend" Kodu** – Arkadaş davet sistemi
- **Referral Program** – Ebeveyn yönlendirme ödülleri

### 7. Yasal ve Güvenlik
- **GDPR Compliance (EU)** – Avrupa pazarı için
- **SOC2 Type 1** – Kurumsal güvenlik sertifikasyonu
- **FDA Class 2 Medical Device** – ABD pazarı için ( uzun vadeli)
- **HIPAA Compliance (US)** – Sağlık verisi koruması
- **ISO 13485** – Medikal cihaz kalite yönetimi

### 8. Kullanıcı Deneyimi
- **Character Customization** – Avatar özelleştirme (çocuğun seçtiği karakter)
- **Progress Celebrations** – 7 gün streak'te özel animasyon, achievement kutlamaları
- **Reward Store** – Puanları ile avatar/nitelik satın alma
- **Daily Quote / Motivation** – Ebeveyn ve çocuk için motivasyon mesajları
- **Parent-Child Bonding Games** – Ebeveyn-çocuk birlikte oyun modu (Co-op)

## PROJE KAPSAMI KARARLARI

### CodeV3 MVP Kapsamı (21 Mayıs 2026)
**ZOR UNUTULMAZ KRİTERLER:**
- 8 tam oyun (Balon, Yıldız, Kelebek, Labirent, Eşleştirme, Hedef Vur, Resim Tamamlama, Kurbağa)
- 5 stereoskopik kitap (Alice, Küçük Prens, Pinokyo, Alaaddin, Nasreddin Hoca)
- Admin, Parent, Doctor dashboards
- Auth + Rol tabanlı erişim
- Premium kod sistemi (dijital aktivasyon)
- Kalibrasyon sayfası (gözlük tipi, renk, yoğunluk)
- 50+ oyun kataloğu (kart görünümü, isim + açıklama)
- AI asistanı + guardrail'ler
- KVKK/onam sayfaları
- Temel audit log
- PWA + offline (2 oyun + 1 kitap)
- Dark/Light tema
- TR + EN dil desteği

### CodeV3'te 8 Unicorn Katman (MVP'de ZORUNLU)
- ✅ Adaptif Terapi Motoru (kural tabanlı, Difficulty ±1)
- ✅ Smart Scoring (Focus Score + Vision Score hesaplaması)
- ✅ Katılım Loop (Quests + Streak + Story engine)
- ✅ Game Engine SDK (BaseGame şablonu, oyunlar 1-2 günde)
- ✅ Input Tracking (mouse events, reaction_time, accuracy)
- ✅ PostHog Analytics (events: game_started, game_ended, quest_completed…)
- ✅ Doktor Reçete Sistemi (prescription form + ebeveyn bildirimi)
- ✅ Story Progression Engine (3 hikaye × 3 bölüm, unlock conditions)

### CodeV3 Kapsamından ÇIKARILANLAR
- ❌ Eye-tracking (Tobii) → Phase 2'ye ertelendi
- ❌ E-ticaret (gözlük/kitap satışı) → Phase 2'ye ertelendi
- ❌ Native uygulamalar → Phase 2'ye ertelendi (React Native/Capacitor)
- ❌ Hospital API/HL7 → Phase 2'ye ertelendi
- ❌ Yapay Zeka AI rapor modeli (ML) → Kural tabanlı + GPT özeti yeterli
- ❌ Gelişmiş Multiplayer → Phase 2'ye ertelendi
- ❌ Ödeme işlemcisi entegrasyonu (Iyzico/Paracode) → MVP'de skip, Phase 2

## GELİŞTİRME SÜRECİ (10 FAZ)

**Faz 0 – Hazırlık (4–5 Mayıs) – ✅ TAMAMLANDI**
- Proje iskeleti (Next.js + NestJS + Postgres + Redis)
- Auth + tema + dil
- Prisma schema + migration + seed
- UI wireframe (Figma)

**Faz 1 – Dashboards (6–8 Mayıs) – 🔄 YAKINDA BAŞLACAK**
- Gün 6 (Bugün): Admin panel skeleton → Layout, nav, kullanıcı CRUD form
- Gün 7: Parent panel skeleton → Çocuk profil, oyun listesi, basit raporlar
- Gün 8: Doctor panel skeleton → Hasta listesi, not sistemi, reçete takibi

**Faz 2 – Game Engine + Adaptive (9–10 Mayıs)**
- PixiJS oyun motoru + anaglif render
- Kalibrasyon sayfası
- SDK base class + 2 template (TargetingGame, PuzzleGame)
- Adaptive engine kural seti (accuracy, difficulty, contrast)

**Faz 3 – Oyunlar + Scoring (11–12 Mayıs)**
- 4 oyun (Balon, Yıldız, Kelebek, Labirent)
- 4 oyun (Eşleştirme, Hedef Vur, Resim Tamamlama, Kurbağa)
- Focus Score + Vision Score hesaplama formülü

**Faz 4 – Engagement Loop (13–14 Mayıs)**
- Quest sistemi (günlük görevler)
- Streak tracking (7 gün, multiplier)
- Story engine + JSON-based chapter unlock
- PostHog events + basic dashboards

**Faz 5 – Kitaplar + Input Tracking (15 Mayıs)**
- 5 kitap + stereoskopik okuyucu
- Canvas-based anaglif render
- Mouse tracking (x, y, timestamp, reaction_time)
- Motor metrikleri hesaplama

**Faz 6 – Content + Doctor RX (16 Mayıs)**
- Landing page + SEO meta
- KVKK/onam + gizlilik sayfaları
- Doktor reçete formu (prescription CRUD)
- Ebeveyn bildirimi (notification)

**Faz 7 – PWA + Katalog + Blog (17 Mayıs)**
- Service worker + offline sync
- 50+ oyun kartı (catalog page)
- 5 blog yazısı (seed)
- Blog altyapısı (CRUD + SEO)

**Faz 8 – SEO + Demo Mode (18 Mayıs)**
- Dinamik meta + sitemap + Schema.org
- `/demo` sayfası (mock data, yatırımcı için)
- Lighthouse >85

**Faz 9 – QA + Deploy (19–21 Mayıs)**
- Cross-browser test, mobile uyumlu
- Staging deploy → Production deploy
- Yatırımcı demo hazırlığı

## SONRAKI ADIMLAR – FAZ 1 (6–8 Mayıs)

### Gün 6 (Bugün): Admin Panel

**Backend (`packages/backend/src/modules/admin/`):**
1. `admin.module.ts` – NestJS modül tanımı
2. `admin.controller.ts` – CRUD endpoints:
   - `GET /admin/users` – Tüm kullanıcıları listele (filtre: role, search)
   - `GET /admin/users/:id` – Kullanıcı detayı
   - `POST /admin/users` – Yeni kullanıcı oluştur
   - `PUT /admin/users/:id` – Kullanıcı güncelle
   - `DELETE /admin/users/:id` – Kullanıcı sil
   - `GET /admin/stats` – Platform istatistikleri (toplam kullanıcı, oyun, oturum)
3. `admin.service.ts` – İş mantığı
4. `admin.guard.ts` – Admin rol kontrolü (JwtAuthGuard + role check)

**Frontend (`packages/web/src/app/dashboard/admin/`):**
1. `layout.tsx` – Admin panel layout:
   - Sol sidebar (navigasyon: Dashboard, Kullanıcılar, Oyunlar, Kitaplar, Premium Kodlar, Blog, Ayarlar)
   - Üst header (admin adı, çıkış butonu, tema toggle)
   - Responsive (mobilde hamburger menu)
2. `page.tsx` – Admin dashboard ana sayfa:
   - İstatistik kartları (toplam kullanıcı, aktif çocuk, oyun oturumu, premium kod)
   - Son aktiviteler listesi
   - Hızlı aksiyon butonları
3. `users/page.tsx` – Kullanıcı yönetimi:
   - Tablo (isim, email, rol, tarih, aksiyonlar)
   - Arama + rol filtresi
   - Yeni kullanıcı modal
   - Düzenleme/silme onayı
4. `users/[id]/page.tsx` – Kullanıcı detay sayfası

### Gün 7: Parent Panel

**Backend (`packages/backend/src/modules/parent/`):**
1. `parent.module.ts`
2. `parent.controller.ts`:
   - `GET /parent/dashboard` – Ebeveyn dashboard verisi
   - `GET /parent/children` – Ebeveynin çocukları
   - `POST /parent/children` – Yeni çocuk profili
   - `GET /parent/children/:id/sessions` – Çocuğun oturum geçmişi
   - `GET /parent/children/:id/progress` – İlerleme raporu
3. `parent.service.ts`

**Frontend (`packages/web/src/app/dashboard/parent/`):**
1. `layout.tsx` – Parent panel layout:
   - Sol sidebar (Genel Bakış, Çocuklarım, Oyunlar, Kitaplar, Raporlar, AI Asistan, Ayarlar)
   - Üst header (ebeveyn adı, bildirim, tema)
2. `page.tsx` – Parent dashboard:
   - Çocuk profilleri kartları
   - Bugünkü hedef durumu
   - Haftalık özet (Chart.js çizgi grafik)
   - Son oyun oturumları
3. `children/page.tsx` – Çocuk listesi + profiller
4. `children/[id]/page.tsx` – Çocuk detay:
   - Skor trendi (Chart.js)
   - Oyun geçmişi tablosu
   - Rozetler

### Gün 8: Doctor Panel

**Backend (`packages/backend/src/modules/doctor/`):**
1. `doctor.module.ts`
2. `doctor.controller.ts`:
   - `GET /doctor/patients` – Hasta listesi
   - `GET /doctor/patients/:id` – Hasta detayı (oturumlar, skorlar, reçeteler)
   - `POST /doctor/prescriptions` – Yeni reçete oluştur
   - `GET /doctor/prescriptions` – Reçete listesi
   - `PUT /doctor/prescriptions/:id` – Reçete güncelle
3. `doctor.service.ts`

**Frontend (`packages/web/src/app/dashboard/doctor/`):**
1. `layout.tsx` – Doctor panel layout:
   - Sol sidebar (Hasta Listesi, Reçeteler, Raporlar, Mesajlar, Ayarlar)
   - Üst header
2. `page.tsx` – Doctor dashboard:
   - Hasta sayısı, aktif reçete, son aktivite
   - Uyarı listesi (düşük skor, tedavi uyumsuzluğu)
3. `patients/page.tsx` – Hasta listesi tablosu
4. `patients/[id]/page.tsx` – Hasta detay:
   - VA skoru geçmişi
   - Oyun performansı (Chart.js)
   - Reçete geçmişi
   - Motor metrikleri
5. `prescriptions/page.tsx` – Reçete listesi
6. `prescriptions/new/page.tsx` – Yeni reçete formu (CodeV3 3.7'deki form)

## GÖZDEN GEÇİRİLECEK YERLER

CodeV3 planları eksiksiz görünüyor. Aşağıdakileri kapatmamız gerekiyor:

1. **Ödeme Sağlayıcısı** – Phase 2'de karar verilecek (Stripe Türkiye'de çalışmıyor)
2. **PostHog Free Tier** – 100k events/ay ücretsiz, yeterli mi? (evet, MVP için)
3. **Doktor Sertifikasyon** – Phase 2'de eklenebilir (MVP'de zorunlu değil)
4. **Story Unlock Saatleri** – Time-based condition phase 2'de yeterince karmaşık olabilir (MVP'de sadece date-based)

## EKSİK GÖRDÜĞÜM ŞEYLER

CodeV3 kapsamlı. Aşağıdakiler phase 2'ye ertelenmiş:

- Eye-tracking entegrasyonu
- E-ticaret
- Native mobil/masaüstü uygulamalar
- Hospital API (HL7)
- AI model eğitimi (Scikit-learn)
- Sosyal features (multiplayer, forum)

**Yeterli mi?** → CodeV3 MVP kapsamı **17 günde teslim edilebilir** şekilde gereklilikler netleştirilmiş. Phase 2+ için yol haritası var.

**Diger planları kapsıyor mu?** → CodeV3, CodeV2'yi kapsıyor + 8 katman ekliyor. CodeV1 (ilk hali) artık geçersiz.

## KARAR NOKTALARI

1. **SDK Mimarisi**: BaseGame abstract class → TargetingGame, PuzzleGame, MotionGame, MemoryGame şablonları
2. **Adaptive Rules**: MVP'de kural tabanlı (if-else), Phase 2'de ML
3. **Scoring Formula**: Focus = accuracy×0.4 + reaction_eff×0.4 + consistency×0.2; Vision = weekly_trend×0.5 + diff_prog×0.3 + balance×0.2
4. **PostHog Events**: 6 temel event (game_started, game_ended, quest_completed, story_unlocked, streak_updated, input_metrics)
5. **Demo Mode**: `/demo` sayfası mock veri ile, yatırımcıya canlı demo

## RİSKLER

| Risk | Olasılık | Etki | Azaltma |
|------|----------|------|---------|
| 8 oyun + SDK 12 günde tamamlanamama | Yüksek | Yüksek | Paralel geliştirme (2 geliştirici), modular template |
| Adaptive motor hataları | Orta | Yüksek | Test coverage, fallback logic, manual override |
| PostHog event overflow | Düşük | Orta | Event batching, sample rate |
| Story unlock condition hataları | Orta | Orta | QA'da tüm kombinasyonlar test et |
| Input tracking artefaktları | Orta | Düşük | Smoothing filter, outlier removal |

---

**Plan dosyası oluşturuldu.**
**Sonraki adım:** `npm run dev` ile uygulamayı başlat, Faz 1'e (Admin panel) geç.