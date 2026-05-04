# 🔵🔴 GÖZMACERASI — Kapsamlı Proje Planı CodeV3 (UNICORN EDITION)

**Hedef Tarih:** 21 Mayıs 2026 (Yatırımcı Sunumu)
**Mevcut Site:** gozmacerasi.com
**Referans Proje:** AmblyoPlay.com
**Hazırlayan:** Gözmacerası Ekibi
**Güncelleme Tarihi:** 4 Mayıs 2026
**Sürüm:** CodeV3 — MVP + 8 Unicorn Layers (Adaptive Engine, Scoring, Retention, SDK, Analytics, Doctor RX)

---

## ÖZET: NEDİR CODEV3?

CodeV3, CodeV2'yi 8 yeni **terapi ve katılım katmanı** ile genişleten, ambliyopi ve şaşılık tedavisini **veri-odaklı, adaptif ve doktor-entegre** yapan kapsamlı platformdur.

### 8 Yeni Katman (CodeV2 → CodeV3)

1. **Adaptif Terapi Motoru** — Otomatik zorluk ayarlaması
2. **Smart Scoring Sistemi** — Focus Score + Vision Score (terapötik)
3. **Katılım Loop** — Görevler + Streakler + Story Progression
4. **Game Engine SDK** — Oyun geliştirmeyi 5x hızlandır
5. **Input Tracking & Analysis** — Mouse/eye motor metrikleri
6. **PostHog Analytics** — Doktor ve ebeveyn için deep insights
7. **Doktor Reçete Sistemi** — Klinisyen-odaklı tanı ve tedavi planı
8. **Story Progression Engine** — Hikaye-tabanlı motivasyon

---

## İÇİNDEKİLER

1. [CodeV3 vs CodeV2 Karşılaştırması](#1-codev3-vs-codev2-karşılaştırması)
2. [Proje Özeti (CodeV3 Odaklı)](#2-proje-özeti-codev3-odaklı)
3. [8 Yeni Katman Detaylı](#3-8-yeni-katman-detaylı)
4. [Teknoloji Yığını (CodeV3 Güncellemeleri)](#4-teknoloji-yığını-codev3-güncellemeleri)
5. [Oyun Motoru ve SDK](#5-oyun-motoru-ve-sdk)
6. [Scoring Sistemi (Focus + Vision)](#6-scoring-sistemi-focus--vision)
7. [Adaptif Terapi Motoru](#7-adaptif-terapi-motoru)
8. [Katılım Mekanikleri (Görev + Streak + Story)](#8-katılım-mekanikleri-görev--streak--story)
9. [PostHog Analytics](#9-posthog-analytics)
10. [Doktor Reçete ve Takip](#10-doktor-reçete-ve-takip)
11. [Input Tracking & Motor Analizi](#11-input-tracking--motor-analizi)
12. [Veritabanı Şeması (CodeV3 Ek Tablolar)](#12-veritabanı-şeması-codev3-ek-tablolar)
13. [Geliştirilmiş Geliştirme Süreci (10 Faz)](#13-geliştirilmiş-geliştirme-süreci-10-faz)
14. [CodeV3 MVP Başarı Kriterleri](#14-codev3-mvp-başarı-kriterleri)
15. [Yatırımcı Metrikleri ve Demo Modu](#15-yatırımcı-metrikleri-ve-demo-modu)
16. [Riskler ve Azaltma (CodeV3)](#16-riskler-ve-azaltma-codev3)
17. [Lansman Sonrası Yol Haritası (Phase 2 & 3)](#17-lansman-sonrası-yol-haritası-phase-2--3)

---

## 1. CODEV3 VS CODEV2 KARŞILAŞTIRMASI

| Boyut | CodeV2 (MVP) | CodeV3 (Unicorn) | Fark |
|-------|--------------|-----------------|------|
| **Adaptasyon** | Manuel kalibrasyonla sınırlı | Otomatik motor, session-to-session | +60% DAU projeksiyonu |
| **Scoring** | Basit puan, rozet | Focus Score (terapötik) + Vision Score (eğilim) | Doktor raporuna uygun |
| **Katılım** | Rozet sistemi | Görev + Streak (7-gun) + Story (3 bölüm) | +40% retention |
| **Oyun Dev** | 1-2 gün/oyun | SDK ile 1-2 gün, şablon reuse | 5x hızlı |
| **Veri** | Temel oturum log | Mouse tracking + motor metrikleri | Doktor insight |
| **Analytics** | Temel metrikleri | PostHog live dashboard | Eğilim tespiti |
| **Doktor Workflow** | Notlar + liste | Reçete formu + otomatik raporlar | Klinik entegrasyon |
| **Total Dev Zaman** | 17 gün | 17 gün (aynı, ama daha dolu) | Scope vs timeline matched |

---

## 2. PROJE ÖZETİ (CODEV3 ODAKLI)

Gözmacerasi CodeV3, çocuklarda ambliyopi ve şaşılık tedavisini **veri-odaklı terapi platformu** olarak konumlandırır:

- **Çekirdek:** 8 tam oynanabilir oyun + 5 stereoskopik kitap + 50+ katalog
- **Fark:** Adaptif motor, terapötik scoring, doktor entegrasyonu, analytics
- **Katılım Loop:** Görevler (günlük), streakler (7-gün), hikayeler (3-bölüm)
- **Doktor Workflow:** Reçete formu (tanı, hedef, önerilen oyunlar) + otomatik raporlar
- **MVP Timeline:** 17 gün (21 Mayıs teslim)
- **Demo:** Sanal hasta, mock motor metrikleri, sham reçete teslimi

---

## 3. 8 YENİ KATMAN DETAYLI

### 3.1 Adaptif Terapi Motoru

**Amaç:** Her oturumda zorluk otomatik uygun seviyede kalması

**MVP Implementasyonu (Kural Tabanlı):**

```javascript
// Adaptive Engine Rules
IF accuracy < 60% THEN {
  difficulty -= 1;
  contrast += 0.1;  // daha kolay görmek için
}
IF accuracy > 85% THEN {
  difficulty += 1;
  log("positive_feedback");
}
IF reaction_time > 2000ms AND accuracy > 70% THEN {
  speed_factor += 0.1;  // hız artır
}
IF dominant_eye_bias > 0.3 THEN {
  adjust_contrast_per_eye(dominant_eye, recessive_eye);
}
```

**Database Storage:**
- `adaptive_sessions` tablosu: session_id, game_id, difficulty_before, difficulty_after, accuracy, timestamp
- Per-game difficulty history → trend görülebilir

**Fark:** Manual kalibrasyondan otomatik session-to-session adaptasyona.

---

### 3.2 Smart Scoring Sistemi

**Focus Score (Dikkat Sürü):**
```
Focus Score = accuracy × 0.4 + reaction_time_efficiency × 0.4 + consistency × 0.2

Açıklamalar:
- accuracy: Doğru hedef click / toplam click
- reaction_time_efficiency: MIN(1, 500ms / avg_reaction_time) 
  (hızlı=1, yavaş<1)
- consistency: std_dev inversı (tutarlı=1, dalgalı<1)

Aralık: 0–100 puan
```

**Vision Score (Görme Gelişim):**
```
Vision Score = weekly_trend × 0.5 + difficulty_progression × 0.3 + balance × 0.2

Açıklamalar:
- weekly_trend: Haftanın ortalaması / geçen hafta (↑ pozitif)
- difficulty_progression: Oyunlarda zorluk artışının hızı
- balance: Biyokuler vs monoküler dengesi

Aralık: 0–100 puan (her hafta yeniden hesapla)
```

**Dashboard Görünümü:**

```
┌─────────────────────────┐
│ HAFTA 1                 │
├─────────────────────────┤
│ Focus Score: 72/100 ↑   │
│ Vision Score: 68/100 ↑  │
│                         │
│ [Çizgi grafiği: 7 gün]  │
│ [Bar chart: 5 oyun]     │
└─────────────────────────┘
```

---

### 3.3 Katılım Loop: Görev + Streak + Story

#### 3.3.1 Günlük Görevler (Quests)

| Görev | Hedef | Ödül | Örnek |
|-------|-------|------|-------|
| **Morning Challenge** | Sabah ilk oyunla başla | +10 XP | Herhangi oyun 3 gün |
| **Focus Master** | Focus Score > 70 | +15 XP | 3 farklı oyunda |
| **Speed Runner** | Reaksiyon süresi < 800ms | +20 XP | 5 oturum |
| **Accuracy Expert** | Doğruluk > 80% | +15 XP | 4 farklı oyun |
| **Story Unlock** | Story Bölüm açmak | +50 XP | Pazar tanısı |

**Depolama:** `daily_quests` tablosu → user_id, quest_id, completion_date, xp_earned

#### 3.3.2 7 Günlük Streak

```
Gün 1–3: Düşük bonus (×1.1 XP)
Gün 4–7: Yüksek bonus (×1.5 XP)
Gün 8: Yeni best record, özel rozet

IF 7 gün streak broken THEN {
  UI alert: "Yazı başlatmayı kaybettin, bugün geri dön!"
}
```

**Depolama:** `streaks` → user_id, current_streak, best_streak, last_play_date

#### 3.3.3 Story Progression

**3 MVP Hikaye × 3 Bölüm:**

1. **Uzay Yolculuğu**
   - Bölüm 1: "Uzay Istasyonuna Giriş" (Unlock: Day 1)
   - Bölüm 2: "Gezegenleri Keşfet" (Unlock: 5 görev tamamlandı)
   - Bölüm 3: "Yıldız Sistemi Kurtarma Missiyonu" (Unlock: Focus Score > 70, Gün 7)

2. **Hazine Arama**
   - Bölüm 1: "Harita Parçalarını Topla" (Day 1)
   - Bölüm 2: "Tehlikeli Labiren" (5 görev + Focus > 65)
   - Bölüm 3: "Hazineyi Bul" (3 haftanın ortalaması > 72)

3. **Okul Başı**
   - Bölüm 1: "Yeni Okula Hoş Geldin" (Day 1)
   - Bölüm 2: "Sınıf Arkadaşları ile Oyun" (10 görev)
   - Bölüm 3: "Sını Lideri Olma" (Konsekütif 7-day streak)

**Depolama:** `story_progression` → user_id, story_id, chapter, unlocked_date, completion_date

**UI:**
```
📖 UZAY YOLCULUĞU
├─ Bölüm 1: ✅ (4 Mayıs'ta açıldı)
├─ Bölüm 2: 🔒 (3 gün kaldı)
└─ Bölüm 3: ⏳ (Kilitli)

[Oku] [Devam Et]
```

---

### 3.4 Game Engine SDK

**Problem:** Her oyun 5 gün, MVP'de 8 oyun = 40 gün (unrealistic)

**Çözüm:** Reusable SDK

```typescript
// packages/shared/game-engine/BaseGame.ts

abstract class BaseGame {
  // Scoring
  abstract calculateFocusScore(): number;
  abstract calculateVisionScore(): number;
  
  // Adaptive
  adjustDifficulty(accuracy: number): void;
  adjustContrast(dominantEyeBias: number): void;
  
  // Input Tracking
  logMouseEvent(x: number, y: number, timestamp: number): void;
  calculateReactionTime(): number;
  
  // Session Management
  startSession(): void;
  endSession(): SessionResult;
  
  // UI Components
  renderScoreBoard(): void;
  renderAdaptiveHint(): void;
}

// Specific Game Templates
class TargetingGame extends BaseGame {
  targets: Target[];
  spawnTarget(): void { ... }
  checkHit(x: number, y: number): boolean { ... }
}

class PuzzleGame extends BaseGame {
  pieces: PuzzlePiece[];
  checkMatch(): boolean { ... }
}

class MotionGame extends BaseGame {
  moveCharacter(direction: Direction): void { ... }
}

class MemoryGame extends BaseGame {
  cards: Card[];
  flipCard(index: number): void { ... }
}
```

**Benefit:** Yeni oyun = 1–2 gün (template seç, mekanik ekle)

---

### 3.5 Input Tracking & Motor Analizi

**Toplanan Metrikler:**

| Metrik | Formül | Klinik Anlamı |
|--------|--------|---------------|
| Reaction Time | 1. tıklamaya kadar ms | Sakkad hızı |
| Accuracy | Doğru hedef / toplam | Hassasiyet |
| Motor Smoothness | Hızlardaki variance inversı | Parkinson-benzeri tremor |
| Dominant Eye Bias | Dikey sapma asimetrisi | Şaşılık indikasyonu |
| Saccade Latency | Hedefe bakmaya kadar | Okulomotor başlatma |

**Depolama:** `input_tracking` → session_id, x, y, timestamp, event_type, reaction_time, accuracy_delta

**Doktor Raporu Örneği:**
```
📊 MOTOR ANALİZİ (Hafta 1 vs Hafta 2)
- Reaction Time: 1200ms → 980ms (-18%, ✅ pozitif)
- Motor Smoothness: +12% (gelişim var)
- Dominant Eye Bias: -8% (balance iyileşiyor)

🔍 Yorum: Okulomotor fonksiyon iyileşme gösteriyor.
```

---

### 3.6 PostHog Analytics Dashboard

**Parent Dashboard (Zustand state + PostHog events):**

```
┌──────────────────────────┐
│ HAFTA ÖZETI              │
├──────────────────────────┤
│ Oyunlar: 12 seans (8h)   │
│ Focus Score: 72→75 ↑     │
│ Vision Score: 68→71 ↑    │
│ Best Streak: 4 gün       │
│                          │
│ [Focus Score çizgi]      │
│ [Oyun kategorileri pie]  │
│ [Accuracy heatmap]       │
└──────────────────────────┘
```

**Doctor Dashboard:**

```
┌──────────────────────────┐
│ 10 HASTANIN ÖZETI        │
├──────────────────────────┤
│ Hasta 1: Focus ↑20%      │
│ Hasta 2: Vision ↓5%      │
│ Hasta 3: Motor +15%      │
│ ... (trend listesi)      │
│                          │
│ [Vision Score scatter]   │
│ [Input metrics heatmap]  │
│ [Streak distribution]    │
│                          │
│ 💡 Auto Recommendations: │
│ - Hasta 2'ye daha kolay  │
│   oyunlar öner           │
│ - Hasta 5 tedaviyii      │
│   gözden geçir           │
└──────────────────────────┘
```

**Olaylar (Events) PostHog'a gönderilen:**
- `game_started`: game_id, difficulty, calibration_profile
- `game_ended`: game_id, duration, final_score, adaptive_changes
- `quest_completed`: quest_id, xp_earned
- `story_unlocked`: story_id, chapter
- `streak_updated`: current_streak, bonus_multiplier
- `input_metrics`: reaction_time, accuracy, motor_smoothness

---

### 3.7 Doktor Reçete Sistemi (Lite)

**Doktor Reçete Formu:**

```
┌────────────────────────────────────────┐
│ YENİ REÇETE OLUŞTUR                    │
├────────────────────────────────────────┤
│ Hasta: [Seç] Ahmet K. ▼               │
│ Tanı: [Seç] Ambliyopi - Anisometrop  │
│ Hedef: [ ] Binoküler Füzyon           │
│         [ ] Sakkad Hızı                │
│         [ ] Stereopsis                 │
│         [x] Motor Kontrol              │
│                                        │
│ Önerilen Oyunlar:                      │
│ [x] Balon Patlatma (hedefleme)        │
│ [x] Labirent Kaçışı (motor)           │
│ [ ] Eşleştirme (bellek)                │
│                                        │
│ Zorluk Aralığı: [Easy] ←→ [Hard]      │
│ Günlük Limit: [30 dakika] ▼           │
│                                        │
│ Notlar: Monoküler moda başla, 1 hafta │
│ sonra reçeteyi kontrol et.             │
│                                        │
│ [KAYDET] [TASLAK] [EBEVEYNE GÖNDERİ] │
└────────────────────────────────────────┘
```

**Depolama:** `doctor_prescriptions` → doctor_id, patient_id, diagnosis, target_goals, recommended_games, difficulty_range, daily_limit, notes, created_date

**Ebeveyn Bildirimi:**
```
📬 Doktor Dr. Ahmet Yılmaz'dan yeni reçete
Hasta: Ahmet K.
Önerilen oyunlar: Balon Patlatma, Labirent
Günlük limit: 30 dakika
[Ayrıntıları Göster] [Başla]
```

---

### 3.8 Story Progression Engine

**JSON-based Story Definition:**

```json
{
  "story_id": "space_journey",
  "title": "Uzay Yolculuğu",
  "chapters": [
    {
      "chapter_id": 1,
      "title": "Uzay İstasyonuna Giriş",
      "description": "...",
      "unlock_condition": "day_1",
      "content": "<StoryScene characters={[...]} />",
      "xp_reward": 20
    },
    {
      "chapter_id": 2,
      "title": "Gezegenleri Keşfet",
      "unlock_condition": "quests_completed >= 5",
      "content": "<StoryScene ... />",
      "xp_reward": 30
    },
    {
      "chapter_id": 3,
      "title": "Yıldız Sistemi Kurtarma",
      "unlock_condition": "focus_score > 70 AND day >= 7",
      "content": "<StoryScene ... />",
      "xp_reward": 50
    }
  ]
}
```

**Engine Logic:**
```typescript
class StoryEngine {
  async checkUnlocks(userId: string) {
    const stories = await db.stories.findAll();
    for (const story of stories) {
      for (const chapter of story.chapters) {
        const isUnlocked = await evaluateCondition(
          chapter.unlock_condition, 
          userId
        );
        if (isUnlocked && !user.storyProgress[chapter.id]) {
          await unlockChapter(userId, chapter.id);
          await sendNotification(userId, chapter);
        }
      }
    }
  }
}
```

---

## 4. TEKNOLOJİ YIĞINI (CODEV3 GÜNCELLEMELERI)

### Ek / Değişti Olanlar:

| Katman | Teknoloji | CodeV2 | CodeV3 Notu |
|--------|-----------|--------|------------|
| Oyun Motoru | PixiJS + Custom SDK | ✅ | SDK şablonları eklendi |
| Veri Analizi | Sentry + PostHog | ← | PostHog artık required |
| Veri İşleme | Pandas/Scikit-learn | Phase 2 | MVP'de kural tabanlı |
| Grafikler | Chart.js | NEW | Focus/Vision Score UI |
| Streak/Quest Engine | Custom NestJS service | NEW | Cron job, real-time |
| Story Engine | JSON config + NestJS | NEW | Dynamic unlock checker |

**Yeni NestJS Modülleri:**
- `adaptive-engine.module` — Motor kurallarını yönet
- `scoring.module` — Focus/Vision hesapla
- `quest.module` — Görev takibi
- `story.module` — Hikaye açılması
- `input-tracking.module` — Mouse/eye metrik depolama
- `posthog-analytics.module` — Event logging

---

## 5. OYUN MOTORU VE SDK

### MVP Oyunları (CodeV3 SDK ile)

| # | Oyun | SDK Şablonu | Dev Zaman |
|---|------|-------------|----------|
| 1 | Balon Patlatma | TargetingGame | 1-2 gün |
| 2 | Yıldız Toplama | TargetingGame + path-following | 1-2 gün |
| 3 | Kelebek Yakalama | MotionGame (pursuit tracking) | 1-2 gün |
| 4 | Labirent Kaçışı | PuzzleGame (navigation) | 1-2 gün |
| 5 | Eşleştirme Oyunu | MemoryGame | 1-2 gün |
| 6 | Hedef Vur | TargetingGame (rapid-fire) | 1-2 gün |
| 7 | Resim Tamamlama | PuzzleGame (visual completion) | 1-2 gün |
| 8 | Kurbağa Geçirme | MotionGame (hopping logic) | 1-2 gün |

**Total: 8-16 gün (realistic)**

---

## 6. SCORING SİSTEMİ (FOCUS + VISION)

[Yukarıdaki 3.2'de detaylı olarak açıklandı]

---

## 7. ADAPTIF TERAPI MOTORU

[Yukarıdaki 3.1'de detaylı olarak açıklandı]

---

## 8. KATILIM MEKANİKLERİ (GÖREV + STREAK + STORY)

[Yukarıdaki 3.3'de detaylı olarak açıklandı]

---

## 9. POSTHOG ANALYTICS

[Yukarıdaki 3.6'da detaylı olarak açıklandı]

---

## 10. DOKTOR REÇETE VE TAKIP

[Yukarıdaki 3.7'de detaylı olarak açıklandı]

---

## 11. INPUT TRACKING & MOTOR ANALIZI

[Yukarıdaki 3.5'de detaylı olarak açıklandı]

---

## 12. VERİTABANI ŞEMASI (CODEV3 EK TABLOLAR)

### CodeV2'den Kalıtılan Tablolar:
- users, children, parents, doctors, admins
- games, book_chapters
- game_sessions, premium_codes
- audit_logs, KVKK_consents

### CodeV3'e Eklenen Tablolar:

```sql
-- Adaptif motor seansları
CREATE TABLE adaptive_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id UUID NOT NULL REFERENCES game_sessions(id),
  difficulty_before INTEGER,
  difficulty_after INTEGER,
  accuracy_score DECIMAL(5,2),
  reaction_time_ms INTEGER,
  motor_smoothness DECIMAL(5,2),
  dominant_eye_bias DECIMAL(5,2),
  adaptive_rule_applied VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Session skorları (Focus + Vision)
CREATE TABLE session_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id UUID NOT NULL REFERENCES game_sessions(id),
  focus_score DECIMAL(5,2),
  vision_score DECIMAL(5,2),
  accuracy DECIMAL(5,2),
  reaction_time_efficiency DECIMAL(5,2),
  consistency DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Haftalık Vision Score trends
CREATE TABLE weekly_vision_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id),
  week_start DATE,
  average_vision_score DECIMAL(5,2),
  weekly_trend DECIMAL(5,2),
  difficulty_progression DECIMAL(5,2),
  balance DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(child_id, week_start)
);

-- Input tracking (mouse/eye events)
CREATE TABLE input_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id UUID NOT NULL REFERENCES game_sessions(id),
  x_pos DECIMAL(7,2),
  y_pos DECIMAL(7,2),
  event_timestamp BIGINT,
  event_type VARCHAR(50),
  reaction_time_ms INTEGER,
  accuracy_delta DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Günlük görevler
CREATE TABLE daily_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id),
  quest_id VARCHAR(100),
  quest_type VARCHAR(50),
  quest_name VARCHAR(255),
  completion_date DATE,
  xp_earned INTEGER,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(child_id, quest_id, completion_date)
);

-- Streakler
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id),
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  last_play_date DATE,
  bonus_multiplier DECIMAL(3,2) DEFAULT 1.0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Story progression
CREATE TABLE story_progression (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id),
  story_id VARCHAR(100),
  chapter_id INTEGER,
  unlocked_date TIMESTAMP,
  completion_date TIMESTAMP,
  xp_earned INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(child_id, story_id, chapter_id)
);

-- Doktor reçete sistemi
CREATE TABLE doctor_prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id),
  patient_id UUID NOT NULL REFERENCES children(id),
  diagnosis VARCHAR(255),
  target_goals JSONB,
  recommended_games JSONB,
  difficulty_range VARCHAR(50),
  daily_limit_minutes INTEGER,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_date TIMESTAMP DEFAULT NOW(),
  last_modified TIMESTAMP DEFAULT NOW()
);
```

---

## 13. GELİŞTİRİLMİŞ GELİŞTİRME SÜRECİ (10 FAZ)

### CodeV3 10 Faz (17 gün, 21 Mayıs Hedefi)

| Faz | Gün | Detay | Başarı Kriterleri | Çıktı |
|-----|-----|-------|-------------------|-------|
| **0** | 4–5 | Altyapı (2d) | Next.js, NestJS, Prisma, Auth, Zustand | Repository + CI/CD |
| **1** | 6–8 | Dashboards (3d) | Admin, Parent, Doctor panelleri | 3 panel çalışıyor |
| **2** | 9–10 | Game Engine + Adaptive (2d) | SDK, motor kuralları, zorluk ayarı | Game engine çalışıyor |
| **3** | 11–12 | Oyunlar + Scoring (2d) | 8 oyun, Focus+Vision Score hesaplaması | 8 oyun + scoring |
| **4** | 13–14 | Engagement Loop (2d) | Quest sistem, streak tracking, story engine, PostHog | Engagement sistemleri live |
| **5** | 15 | Kitaplar + Input Tracking (1d) | 5 kitap, mouse tracking | 5 kitap + tracking |
| **6** | 16 | Content + Doctor RX (1d) | Landing, KVKK, reçete formu, AI asistanı | Content sayfaları + doktor formu |
| **7** | 17 | PWA + Katalog + Blog (1d) | Service worker, 50+ oyun kartları, 5 blog yazısı | PWA + katalog + blog |
| **8** | 18 | SEO + Demo Mode (1d) | Meta etiketler, sitemap, `/demo` sayfası | Lighthouse >85, demo live |
| **9** | 19–21 | QA + Deploy (3d) | Tüm akışlar test, staging, production | Production live + yatırımcı demo |

**Toplamı:** 17 gün (4 Mayıs başlangıç, 21 Mayıs bitmesi)

---

## 14. CODEV3 MVP BAŞARI KRİTERLERİ

✅ **Adaptif Motor:** 1+ oturum sonrasında zorluk otomatik ayarlanıyor
✅ **Scoring:** Focus + Vision Score hesaplaması live, dashboard görünümü
✅ **Katılım Loop:** Görevler günlük açılıyor, streak takip ediliyor, story bölümleri unlock oluyor
✅ **PostHog Analytics:** Events gönderiliyor, parent/doctor dashboard metrikleri görünüyor
✅ **Input Tracking:** Mouse events kaydediliyor, motor metrikleri hesaplanıyor
✅ **Doktor Reçete:** Form çalışıyor, ebeveyne notification gidiyor
✅ **Game SDK:** 8 oyun 1-2 gün hızına ulaşıyor
✅ **Demo Mode:** `/demo` sayfası yatırımcı için hazır (mock veri)
✅ **PWA + Offline:** 2 oyun + 1 kitap çevrimdışı oynanıyor
✅ **Doktor-Ebeveyn Workflow:** Reçete → ebeveyn bildirimi → oyun önerileri → takip

---

## 15. YATIRIMCI METRİKLERİ VE DEMO MODU

### Demo Modu (`/demo` sayfası)

**Amaç:** Yatırımcının CodeV3'ün gücünü canlı görmesi

**Mock Veri:**
```
Hasta: "Ahmet K." (7 yaşında, Ambliyopi - RO)
Hafta 1 başlangıç:
- Focus Score: 45 → 75 (hafta sonu)
- Vision Score: 50 → 71
- Streak: 1 → 5 gün
- Oyunlar: 5 başladı, 3'ü bitirdi

Doktor Reçete: "Ambliyopi - RO" (Dr. Yılmaz tarafından)
- Önerilen: Balon, Labirent, Eşleştirme
- Günlük: 30 dakika
- Adaptive Motor: Diff 1 → 3 (4 gün)

Katılım:
- Morning Challenge: ✅ 5 gün
- Speed Runner: 3/5 ✅
- Story Uzay: Bölüm 1 ✅, Bölüm 2 🔒 (2 gün kaldı)
```

**Demo Sayfası Layout:**
```
┌──────────────────────────────┐
│ YATIRIMCI DEMO: AHMET K.     │
├──────────────────────────────┤
│ ← [Çıkış]                    │
│                              │
│ 📊 HAFTALIK ÖZET             │
│ Focus: 45→75 ↑ 67%           │
│ Vision: 50→71 ↑ 42%          │
│ Streak: 5 gün                │
│                              │
│ [Focus Score çizgi]          │
│ [Vision Trend]               │
│ [Katılım Görseli]            │
│                              │
│ 🎯 DOKTOR REÇETE             │
│ Dr. Ahmet Yılmaz             │
│ Tanı: Ambliyopi RO           │
│ Oyunlar: Balon, Labirent...  │
│                              │
│ 📖 STORY PROGRESSION          │
│ Uzay Yolculuğu               │
│ ✅ Bölüm 1                    │
│ ⏳ Bölüm 2 (2 gün)           │
│                              │
│ 🎮 MOTOR ANALİZİ             │
│ Reaction: 1200→980ms ↓       │
│ Smoothness: +12% ↑           │
│ Balance: +8% ↑               │
└──────────────────────────────┘
```

### Yatırımcı Pitch Metrikleri

**Pazar:**
- Türkiye 0–14 yaş: 12 milyon
- Ambliyopi prevalansı: 1–5% (120k–600k hedef)
- AmblyoPlay ref: $2M+ revenue (2022–2024)

**CodeV3 Farkları:**
- Adaptif motor (AmblyoPlay: manuel)
- Terapötik scoring (AmblyoPlay: basit puan)
- Doktor entegrasyonu (AmblyoPlay: ebeveyn-odaklı)
- Katılım loop +40% DAU (benchmarks)

**MVP Bitmesi:**
- 17 günde 8 oyun + 5 kitap + adaptive engine + doktor workflow
- Yatırımcı demo hazır (21 Mayıs)
- Phase 2 roadmap: E-ticaret, eye-tracking, native apps

---

## 16. RİSKLER VE AZALTMA (CODEV3)

| Risk | Olasılık | Etki | Azaltma |
|------|----------|------|---------|
| Adaptif motor hataları | Orta | Yüksek | Kapsamlı kural testleri, fallback simple logic |
| PostHog event overflow | Düşük | Orta | Event batching, free tier limits kontrol |
| Story unlock conditions yanlış | Orta | Orta | QA'da tüm kombinasyonlar test et |
| Input tracking veri artefaktları | Orta | Düşük | Basit smoothing filter, outlier removal |
| Doktor reçete form karmaşıklığı | Orta | Düşük | MVP'de simplify, Phase 2'de expand |
| 8 oyun + SDK 12 günde tamamlanamama | Yüksek | Yüksek | Faz 3 sırasında paralel geliştirme, modular template |

---

## 17. LANSMAN SONRASI YOL HARİTASI (PHASE 2 & 3)

### Phase 2 (Haziran — Ağustos 2026)

| Ay | Hedef | Kapsam |
|----|-------|--------|
| **Haziran** | E-Commerce Modülü | Gözlük satışı, fiziksel kutu, kargo |
| **Temmuz** | Eye-Tracking Beta | Tobii SDK, şaşılık tarama, sakkad analizi |
| **Ağustos** | Native Uygulamalar | Android (React Native), iOS (React Native) |

### Phase 3 (Eylül — Aralık 2026)

| Ay | Hedef | Kapsam |
|----|-------|--------|
| **Eylül** | Hospital API | HL7 entegrasyonu, kurumsal satış |
| **Ekim** | Masaüstü Uygulamalar | Windows (Tauri), Linux (Tauri) |
| **Kasım** | Uluslararası | İngilizce, Arapça RTL, yeni pazarlar |
| **Aralık** | Klinik Partnerships | Doktor ağları, pilot çalışmalar |

### Phase 4+ (2027)

- VR/AR desteği (Meta Quest)
- AI-trained model raporlar
- School admin role (eğitim kuruluşları)
- Masif multiplayer minigames

---

## ÖZET: CODEV3 NEYİ DEĞİŞTİRİYOR?

| Noktada | CodeV2 (MVP) | CodeV3 (Unicorn) |
|--------|--------------|-----------------|
| **Adaptasyon** | Basit → Otomatik | +60% DAU |
| **Scoring** | Puan → Terapötik (2D) | Doktor raporlanabilir |
| **Katılım** | Rozet → Görev+Streak+Story | +40% retention |
| **Oyun Dev** | 5 gün/oyun → SDK | 1-2 gün/oyun |
| **Veri** | Temel → Motor metrikleri | Doktor insight |
| **Doktor** | Notlar → Reçete formu | Klinisyen workflow |
| **Analytics** | Temel → PostHog live | Eğilim tespiti |
| **Timeline** | 17 gün (tam) | 17 gün (ama dolu) |

---

## KRİTİK KARARLAR (HALA ALININMASI GEREKLI)

1. ✅ **Scope:** 8 oyun + 5 kitap + 50+ katalog KARAR
2. ✅ **Timeline:** 17 gün (21 Mayıs) KARAR
3. ❓ **Ödeme Sağlayıcısı:** Iyzico vs Paracode vs 2Checkout? **TBD**
4. ❓ **PostHog Free Tier:** Etkinlik limitleri yeterli mi? **Test gerekli**
5. ❓ **Doktor Sertifikasyon:** MVP'de gerekli mi? **Phase 2'ye defer**
6. ❓ **Story Unlock Saatleri:** Tam zamanlı kuru ekle gerek mi? **Basit date-based MVP'de**

---

## SONUÇ

CodeV3, CodeV2'nin gerçekçi MVP'sini, **8 katman terapi + katılım mühendisliği** ile **klinik ve ticari bir platform** haline dönüştürür. 

17 günde teslim edilebilir scope'u koruyarak, doktor entegrasyonu, adaptif motor, data-driven scoring ve katılım loop'unu MVP'ye dahil eder.

**Unicorn potansiyeli:** +60% DAU, +40% retention, doktor-odaklı workflow, yeni ödeme seçenekleri.

**Yatırımcı sunumu:** Demo mode'da canlı göstermeler, motor metrikleri, story progression, doktor reçete formu.

---

**Güncelleme Tarihi:** 4 Mayıs 2026, 17:00 UTC+3
**Versiyon:** CodeV3 — MVP + 8 Unicorn Layers, Clinically Integrated, Data-Driven
