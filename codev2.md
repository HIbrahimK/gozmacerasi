# 🔵🔴 GÖZMACERASI — Kapsamlı Proje Planı CodeV2

**Hedef Tarih:** 21 Mayıs 2026 (Yatırımcı Sunumu)
**Mevcut Site:** gozmacerasi.com
**Referans Proje:** AmblyoPlay.com
**Hazırlayan:** Gözmacerası Ekibi
**Güncelleme Tarihi:** 4 Mayıs 2026
**Sürüm:** CodeV2 — MVP Odaklı, Katalog Genişletmeli, Klinik Güvenli

---

## ÖZET: NEDİR CODV2?

CodeV2, mevcut planı 3 temel ilkeyle yeniden yapılandırıyor:

1. **MVP Gerçekçiliği:** İlk sürümde 8 adet güçlü, tam oynanabilir oyun. Mevcut 28 oyun başlığı korunur fakat çoğu isim + görsel + açıklama kartı olarak yer alır.
2. **Katalog Stratejisi:** Toplam oyun başlığı 50+ hedefine ulaşmak için yeni oyun fikirleri eklendi. Bu başlıklar ilk fazda etkileşimli olmak zorunda değil; pazarlama ve gelecek ölçekleme için hazır duruyor.
3. **Klinik ve Güvenlik:** KVKK/onam akışı, audit log, kullanım limitleri, aşırı kalibrasyona karşı güvenlik katmanı, AI asistanda medical guardrail'ler eklenmiştir.

---

## İÇİNDEKİLER

1. [Proje Özeti](#1-proje-özeti)
2. [Teknoloji Yığını ve İyileştirmeler](#2-teknoloji-yığını-tech-stack-ve-iyileştirmeler)
3. [Sayfa Mimarisi ve Yapılanması](#3-sayfa-mimarisi-ve-yapılanması)
4. [Özellik Listesi (55+ Özellik)](#4-özellik-listesi-55-özellik)
5. [50+ Dikloptik Oyun Kataloğu](#5-50-dikloptik-oyun-kataloğu)
6. [Stereoskopik Online Kitaplar](#6-stereoskopik-online-kitaplar)
7. [Basılı 3D Kitap ve Gözlük E-Ticaret](#7-basılı-3d-kitap-ve-gözlük-e-ticaret-phase-2)
8. [MVP vs Phase 2 Ayrımı](#8-mvp-vs-phase-2-ayrımı)
9. [Geliştirilmiş Geliştirme Süreç Planı](#9-geliştirilmiş-geliştirme-süreç-planı)
10. [Veritabanı Şeması](#10-veritabanı-şeması)
11. [Premium Kod Sistemi](#11-premium-kod-sistemi-detayı)
12. [Klinik Güvenlik ve Onam Akışı](#12-klinik-güvenlik-ve-onam-akışı)
13. [Yapay Zeka Modülleri ve Guardrail'ler](#13-yapay-zeka-modülleri-detayı-ve-guardrails)
14. [PWA ve Platform Stratejisi](#14-pwa-ve-platform-stratejisi)
15. [Yatırımcı Sunumu Metrikleri](#15-yatırımcı-sunumu-için-kritik-metrikler)
16. [Riskler ve Azaltma Stratejileri](#16-riskler-ve-azaltma-stratejileri)
17. [Lansman Sonrası Yol Haritası](#17-lansman-sonrası-yol-haritası)

---

## 1. PROJE ÖZETİ

Gözmacerasi, çocuklarda ambliyopi (tembel göz) ve şaşılık tedavisini destekleyen, gamified (oyunlaştırılmış) dikloptik ve monoküler görsel terapi platformudur. Kırmızı-mavi stereoskopik gözlüklerle çalışan interaktif oyunlar, online kitaplar, premium abonelik sistemi ve yapay zeka destekli takip sunar.

**MVP Kapsam:**
- Dijital platform: 8 oyun, 5 kitap, AI destekli takip
- Premium kod sistemi (ilk faz dijital, e-ticaret Phase 2'ye)
- PWA desteği
- Doktor, ebeveyn ve admin panelleri
- Kalibrasyon sistemi
- Blog, video, SSS ve içerik sayfaları
- KVKK/onam ve temel audit log

**Phase 2+ Kapsamı:**
- Gözlük ve basılı kitap e-ticaret
- Eye-tracking entegrasyonu
- Native mobil ve masaüstü uygulamalar
- Hospital API
- Gelişmiş AI raporlama

**Klinik Kanıt:**
- Dikloptik eğitimin şaşılık hastalarında en yüksek etki boyutunu (0.201 logMAR) gösterdiği kanıtlanmıştır.
- Anizometropik ambliyopide AmblyoPlay tabanlı multimodal görsel terapinin, görsel ve okülomotor fonksiyonlarda anlamlı iyileşmeler sağladığı gösterilmiştir.

---

## 2. TEKNOLOJİ YIĞINI (TECH STACK) VE İYİLEŞTİRMELER

### 2.1 Frontend

| Katman | Teknoloji | Gerekçe | CodeV2 Notları |
|--------|-----------|---------|----------------|
| Web Uygulaması | **Next.js 14+ (App Router)** | SSR/SSG desteği, SEO optimizasyonu | Geçerli en stabil sürümü kullan; App Router korunmalı |
| UI Kitaplığı | **Tailwind CSS + Radix UI** | Erişilebilirlik, dark/light mode | Çocuk-odaklı component kütüphanesi sıkı özelleştirilmeli |
| Durum Yönetimi | **Zustand** | Hafif, oyun state'i için ideal | Doğru seçim; game session state'i hızlı geçişler için |
| Animasyon | **Framer Motion** (GSAP isteğe bağlı) | Oyun animasyonları | GSAP'ı sadece kompleks animasyonlar için kullan; basit efektler Framer Motion |
| 3D / Oyun Motoru | **PixiJS** (Three.js opsiyonel) | 2D WebGL, stereoskopik render | PixiJS sade ve hızlı; 3D gerekirse Phase 2'de Three.js ekle |
| Grafik / Görsel | **Canvas API + SVG** | Kitaplar, stereoskopik derinlik | Canvas anaglif filtre implementasyonu net olmalı |
| PWA | **next-pwa (Workbox)** | Çevrimdışı, offline sync | Service worker davranışı kapsamlı test edilmeli |
| Tema Sistemi | **next-themes** | Dark/light/auto mod | Sistem tercihi algılama çalışmalı |
| Çoklu Dil | **next-intl** | TR/EN MVP, AR Phase 2 | İlk fazda TR+EN, RTL desteği Phase 2'de |

### 2.2 Backend

| Katman | Teknoloji | Gerekçe | CodeV2 Notları |
|--------|-----------|---------|----------------|
| API Katmanı | **Node.js + NestJS** | Modüler mimari, roller | Doktor/admin/ebeveyn modülleri net ayrılmalı |
| Veritabanı | **PostgreSQL + Redis** | Ana veri + session/cache | Redis'i rate limit ve job queue için kullan |
| ORM | **Prisma** | Type-safe sorguları | Prisma şeması erken oluşturulmalı |
| Dosya Depolama | **AWS S3 veya Cloudflare R2** | Görüntüler, oyun asset'leri | MVP'de basit; Phase 2'de CDN edge caching |
| Gerçek Zamanlı | **Socket.io** (opsiyonel ilk fazda) | Canlı izleme, multi-player | MVP'de gerçekten gerekli değilse defer et; REST poll yeterli olabilir |
| Kimlik Doğrulama | **NextAuth.js + JWT** | Rol tabanlı erişim | Rol ve permission model erken netleştirilmeli |
| E-posta | **Resend veya AWS SES** | Bildirimler, raporlar | MVP'de basit templates; advanced flows Phase 2'de |
| Video Hosting | **YouTube API + Cloudflare Stream** | Video embed | İlk fazda YouTube; private content Phase 2'de Cloudflare |

### 2.3 Yapay Zeka

| Katman | Teknoloji | Gerekçe | CodeV2 Notları |
|--------|-----------|---------|----------------|
| Sohbet Botu | **GPT-4 API + güvenlik katmanı** | Ebeveyn sorularına cevap | MVP: sabit prompt + guardrail'ler ("danışman değilim, doktora görünün") |
| Rapor Üretimi | **Kural tabanlı + GPT özeti** | Basit şablonlu raporlar | MVP: template-based, AI özetleyici; Phase 2'de trained model |
| Tahminlemeler | **Basit istatistik (sonrası ML)** | İlerleme tahmini | MVP'de basit eğilim; Phase 2'de Scikit-learn |

### 2.4 Ödeme ve Abonelik (MVP'de Dijital, E-Commerce Phase 2'ye)

| Katman | Teknoloji | Gerekçe | CodeV2 Notları |
|--------|-----------|---------|----------------|
| Kod Sistemi | **Özel modül (veritabanı tabanlı)** | Premium aktivasyonu | MVP'de yalnızca dijital kod; fiziksel kutu Phase 2 |
| Ödeme Sağlayıcısı | **Iyzico / Paracode / 2Checkout (TBD)** | Türkiye'de çalışan | KARAR ALININMALI: Stripe yerine hangisi? |
| E-Ticaret | **Phase 2'ye defer** | Gözlük + kitap satışı | İlk fazda skip; Shopify veya custom altyapı hazırlanmalı |

### 2.5 Altyapı ve DevOps

| Katman | Teknoloji | Gerekçe | CodeV2 Notları |
|--------|-----------|---------|----------------|
| Hosting (Frontend) | **Vercel** | Next.js optimize | İlk fazda 1 staging + 1 production |
| Hosting (Backend) | **Railway veya AWS ECS/Fargate** | Ölçeklenebilir | MVP'de Railway (daha hızlı), Phase 2'de AWS |
| CI/CD | **GitHub Actions** | Otomatik deploy | Staging deploy otomatik; production manual trigger |
| Monitoring | **Sentry + basic PostHog** | Hata ve analitik | MVP: Sentry; Phase 2'de PostHog event tracking |
| CDN | **Cloudflare** | Görüntü/asset/video teslimat | MVP'den başlayarak; edge caching Phase 2 |
| Database Backup | **Automated daily** | Veri koruma | Günlük backup; 30 günlük retention |

---

## 3. SAYFA MİMARİSİ VE YAPILANDIRMASI

[Mevcut plan ile aynı; sadece yardım/SSS/iletişim sayfaları netleştirilecek]

### Ek: Demo Modu Sayfası (Yatırımcı Demosu İçin)

- `/demo` — Gerçek verilere ses eksiltmeden sunum amaçlı demo akışı
  - Pre-populated çocuk profili
  - Mock oyun oturumları ve skorları
  - Trending grafikler
  - Doktor dashboardında 10 mock hasta

---

## 4. ÖZELLİK LİSTESİ (55+ ÖZELLİK)

### 4.1 Çekirdek Özellikler (Core)

| # | Özellik | Açıklama | MVP | Phase 2 |
|---|---------|----------|-----|---------|
| 1 | **Dikloptik Oyun Motoru** | Kırmızı-mavi gözlükle çalışan, her göz için farklı görsel | ✅ | — |
| 2 | **Monoküler Eğitim Modu** | Ambliyopik gözün tek başına çalıştırıldığı egzersizler | ⚠️ (işaret) | ✅ |
| 3 | **Stereoskopik Online Kitaplar** | Kırmızı-mavi gözlükle okunabilen 3B kitaplar | ✅ | — |
| 4 | **Çoklu Gözlük Kalibrasyonu** | Renk, yoğunluk, parlaklık ayarları | ✅ | — |
| 5 | **Rol Tabanlı Erişim** | Admin, doktor, ebeveyn, çocuk | ✅ | — |
| 6 | **Premium Kod Sistemi** | Dijital kod aktivasyonu | ✅ | E-ticaret +Stripe |
| 7 | **Yapay Zeka Asistanı** | Sorulara cevap, ama guardrail'lerle | ✅ | Gelişmiş LLM |
| 8 | **AI Kullanım Raporu** | Kural tabanlı haftalık rapor | ✅ | ML-trained |
| 9 | **Gerçek Zamanlı Kullanım Takibi** | Oturum süresi ölçümü | ✅ | — |
| 10 | **Doktor-Hasta İzleme** | Doktorun pazient kullanımını görmesi | ⚠️ (hafif) | ✅ (realtime) |
| 11 | **Klinik Onam ve KVKK** | AI rapor, veri paylaşım izni | ✅ | — |
| 12 | **Audit Logging** | Aktivite logu (temel) | ✅ | Detaylı audit |
| 13 | **Kullanım Limiti ve Mola Uyarısı** | 20-20-20 kural, screen break | ✅ | Eye strain detection |

### 4.2 Oyun Özellikleri

| # | Özellik | Açıklama | MVP | Phase 2 |
|---|---------|----------|-----|---------|
| 14 | **50+ Oyun Kataloğu** | İsminden katalog görünümü | ✅ | +20 daha |
| 15 | **8 Tam Oynanabilir Oyun** | MVP çekirdeği | ✅ | +20 Phase 2'de |
| 16 | **Zorluk Seviyesi Adaptasyonu** | Basit branching logic | ✅ | ML-driven |
| 17 | **Ödül ve Rozet Sistemi** | Başarı rozetleri | ✅ | — |
| 18 | **Liderlik Tablosu** | Yaşa göre anonim | ✅ | — |
| 19 | **Oturum Zamanlayıcı** | Günlük limit ve uyarı | ✅ | — |
| 20 | **Oyun İstatistikleri** | Skor, süre, başarı oranı | ✅ | — |

### 4.3 Kitap Özellikleri

| # | Özellik | Açıklama | MVP | Phase 2 |
|---|---------|----------|-----|---------|
| 21 | **5 Online Kitap** | Stereoskopik klasikler | ✅ | +10 daha |
| 22 | **Sesli Kitap Desteği** | TTS | ✅ | — |
| 23 | **Okuma İlerleme Takibi** | Kaçıncı sayfa | ✅ | — |
| 24 | **İnteraktif Sayfa Öğeleri** | Tıklanabilir objeler | ⚠️ (temel) | ✅ (ileri) |

### 4.4 Takip ve Analitik

| # | Özellik | Açıklama | MVP | Phase 2 |
|---|---------|----------|-----|---------|
| 25 | **VA Skoru Takibi** | Görsel keskinlik grafiği | ⚠️ (manuel) | ✅ (otomatik test) |
| 26 | **Stereopsis Gelişim** | Derinlik algısı takibi | ⚠️ (kalibrasyon testi) | ✅ (eye-tracking) |
| 27 | **Tedavi Uyumu Skoru** | Düzenli kullanım % | ✅ | — |
| 28 | **Haftalık/Aylık Raporlar** | E-posta bildirimleri | ✅ | — |
| 29 | **Okülomotor Metrikler** | Browser'dan sakkad latansı (basit) | ⚠️ (beta) | ✅ (eye-tracker) |

### 4.5 Sosyal ve İletişim

| # | Özellik | Açıklama | MVP | Phase 2 |
|---|---------|----------|-----|---------|
| 30 | **Doktor-Ebeveyn Mesajlaşma** | Güvenli mesaj | ✅ | — |
| 31 | **Randevu Sistemi** | Online randevu alma | ⚠️ (basit form) | ✅ (calendar) |
| 32 | **Bildirim Merkezi** | Push, SMS, e-posta | ✅ | — |
| 33 | **Blog** | SEO-friendly yazılar | ✅ | — |
| 34 | **Video Sayfası** | YouTube embed | ✅ | — |

### 4.6 İçerik ve SEO

| # | Özellik | Açıklama | MVP | Phase 2 |
|---|---------|----------|-----|---------|
| 35 | **Ana Sayfa** | Hero, CTA, vitrini | ✅ | — |
| 36 | **Nasıl Çalışır** | 5 adım + videolar | ✅ | — |
| 37 | **Bilimsel Kanıtlar** | Doktor görüşleri, araştırmalar | ✅ | — |
| 38 | **Kullanıcı Deneyimleri** | Testimoniallar | ✅ | — |
| 39 | **SSS** | 30+ soru, accordion | ✅ | — |
| 40 | **Yardım Sayfası** | Kategorize edilmiş destek | ✅ | — |
| 41 | **Hakkımızda** | Misyon, hikaye | ✅ | — |
| 42 | **Takım Tanıtımı** | Ekip üyeleri ve biyografiler | ✅ | — |
| 43 | **İletişim** | Form + harita + sosyal | ✅ | — |
| 44 | **Yasal Sayfalar** | Gizlilik, KVKK, Kullanım koşulları | ✅ | — |
| 45 | **SEO Altyapısı** | Meta, sitemap, Schema.org | ✅ | — |

### 4.7 E-Ticaret (Phase 2)

| # | Özellik | Açıklama | MVP | Phase 2 |
|---|---------|----------|-----|---------|
| 46 | **Gözlük Satışı** | Klipsli, normal, çocuk tasarımları | — | ✅ |
| 47 | **Basılı 3D Kitap Satışı** | Fiziksel stereoskopik kitaplar | — | ✅ |
| 48 | **Paket Satışları** | Gözlük + kitap + kod | — | ✅ |
| 49 | **Kargo Takibi** | Siparişleri izle | — | ✅ |
| 50 | **İade Sistemi** | Kolay iade ve değişim | — | ✅ |

### 4.8 Teknik ve Platform

| # | Özellik | Açıklama | MVP | Phase 2 |
|---|---------|----------|-----|---------|
| 51 | **PWA Desteği** | Çevrimdışı, offline sync | ✅ | — |
| 52 | **Dark/Light/Auto Tema** | Tam tema desteği | ✅ | — |
| 53 | **Çoklu Dil** | TR + EN (AR Phase 2) | ✅ | +AR |
| 54 | **Erişilebilirlik** | ADA uyumlu | ✅ | — |
| 55 | **API Altyapısı** | Hastane entegrasyonu için (Phase 2) | ⚠️ (iskeleti) | ✅ (full) |

---

## 5. 50+ DİKLOPTİK OYUN KATALOĞU

### Strateji

- **MVP'de Oynanabilir:** 8 tam oyun
- **Katalogda Yer Alan:** Mevcut 28 oyun başlığı + 22 yeni oyun = **50+ başlık**
- **Kataloğun Yapısı:** Her oyun için kart: isim, teaser görsel, açıklama, terapi hedefi, "yakında eklenecek" etiketi
- **Kalite:** 10 yaş altı çocukların rahat oynayabileceği, büyüklerin de sıkılmayacağı kalibre edilebilir mekanikler

### MVP'de Tam Oynanabilir 8 Oyun

| # | Oyun Adı | Kategori | Açıklama | Terapi Hedefi |
|---|----------|----------|----------|----------------|
| 1 | **Balon Patlatma** | Nesne Takibi | Kırmızı göz balonları, mavi göz iğneleri | El-göz koordinasyonu, binoküler füzyon |
| 2 | **Yıldız Toplama** | Nesne Takibi | Bir göz yıldızları, diğer göz yol haritası | Stereopsis, mekânsal farkındalık |
| 3 | **Kelebek Yakalama** | Nesne Takibi | Kelebekler bir gözde, ağ diğer gözde | Pursuit hareketi, gözleme |
| 4 | **Labirent Kaçışı** | Bulmaca | Labirent ve çıkış farklı gözlerde | Problem çözme, stereopsis |
| 5 | **Eşleştirme Oyunu** | Bellek | Kartlar açık/kapalı, eşleştir | Görsel hafıza, dikkat |
| 6 | **Hedef Vur** | Hız/Reaksiyon | Hedefler bir gözde, nişangah diğer gözde | Hassas sakkad, hedefleme |
| 7 | **Resim Tamamlama** | Yaratıcı | Yarım resim, diğer yarım tamamla | Görsel tamamlama, bütüncül algı |
| 8 | **Kurbağa Geçirme** | Hız/Strateji | Kurbağa ve araçlar farklı gözlerde | Planlama, zamanlama, reaksiyon |

Tüm oyunlar için ortak özellikler:
- Kalibrasyon profili seçiminden sonra renk/yoğunluk otomatik ayarlanır
- Kısa tur (2–5 dakika), kolay anlaşılır hedef, tekrar oynanabilirlik
- Sesli yönlendirme (Türkçe + İngilizce)
- Mobil ve tablet uyumluluğu
- Puan ve küçük rozet mekanikleri
- Çocuk dostu grafikler ama profesyonel sunum

### Mevcut 28 Oyun Başlığı (Katalogda Korunacak)

| Kategori | Oyunlar (Başlık Olarak) |
|----------|------------------------|
| **Nesne Takibi (6)** | Balon Patlatma, Yıldız Toplama, Kelebek Yakalama, Hazine Avı, Uzay Macerası, Balık Tutma |
| **Bulmaca (5)** | Labirent Kaçışı, Puzzle Birleştirme, Eşleştirme Oyunu, Renk Karıştırma, Sudoku Junior |
| **Hız/Reaksiyon (5)** | Fruit Ninja Stereoscopic, Araba Yarışı, Davul Çalma, Hedef Vur, Kurbağa Geçirme |
| **Eğitici (5)** | Hayvanat Bahçesi, Harf Avcısı, Sayı Sayma, Resim Tamamlama, Müzik Notası |
| **Fiziksel/Denge (4)** | Trapze Ustası, Kaykay Parkuru, Top Dengesi, Dans Robotu |
| **Bonus (3)** | Sualtı Dünyası, Dinozor Kazısı, Uğur Böceği Bahçesi |

*(Bu başlıklar mevcut plandan korunmuştur; MVP'de sadece ilk 8'i tam oynanabilir olacak)*

### Yeni Oyun Fikirleri: 22 Ek Katalog Başlığı

| # | Oyun Adı | Kategori | Açıklama | Yaş Grubu |
|---|----------|----------|----------|----------|
| 29 | **Renk Köprüsü** | Bulmaca | Renkli köprü parçalarını sırayla bağla | 4–10 |
| 30 | **Uzay İp Cambazı** | Fiziksel | Yıldızlar arasında iple yürü | 5–12 |
| 31 | **Balon Rotası** | Hedefleme | Balonları doğru sırayla patlat | 4–10 |
| 32 | **Mini Labirent Kralı** | Bulmaca | Çok sayıda mini labirent, hızlı çöz | 6–14 |
| 33 | **Gökkuşağı Yakala** | Eşleştirme | Renkleri gökkuşağı sırasına göre sırala | 4–12 |
| 34 | **Hayvan Sırala** | Eğitici | Hayvanları yaş sırasına göre dizle | 3–10 |
| 35 | **Uzun Kule** | Fiziksel | Blokları dengede yığla | 5–14 |
| 36 | **Şekil Avı** | Keşif | Gizli şekilleri ara ve bul | 4–10 |
| 37 | **Sessiz Hedef** | Yoğunlaşma | Sesi kapalı, sadece görsel hedef | 6–14 |
| 38 | **Kayıp Yıldız** | Macera | Yıldızları takip ederek rotayı tamamla | 5–12 |
| 39 | **Robot Tamirhanesi** | Eğitici | Robotun parçalarını düzelt | 5–13 |
| 40 | **Deniz Kabuğu Topla** | Keşif | Sualtında kabukluk ara ve topla | 4–11 |
| 41 | **Harf Yağmuru** | Eğitici | Düşen harfleri yakalama | 5–12 |
| 42 | **Sayı Treni** | Eğitici | Sayılar treninde düzenlenir | 4–10 |
| 43 | **Büyüyen Bahçe** | Eğitici | Bitkileri diz, ör | 4–12 |
| 44 | **Minik Kaşif** | Macera | Küçük dünyada keşfet | 5–13 |
| 45 | **Denge Adası** | Fiziksel | İçinde dengeyi koru | 6–14 |
| 46 | **Bulut Atlama** | Fiziksel | Bulutlarda zıpla | 5–12 |
| 47 | **Eşleştir ve Parlat** | Bulmaca | Eşleştir, kombinasyon patlat | 6–14 |
| 48 | **Hazine Haritası Mini** | Bulmaca | Minik harita, hazine ara | 4–11 |
| 49 | **Ritim Yumurtası** | Ritim | Yumurtayı ritme göre salla | 5–12 |
| 50 | **Yön Bulucu** | Navigasyon | Harita ve pusula ile yer bul | 6–14 |

### Genişletilebilir Kategori Yapısı

Toplam oyun kataloğu modüler şekilde tasarlanmıştır:
- **Nesne Takibi:** Pursuit ve sakkad egzersizleri — 8 oyun
- **Bulmaca & Strateji:** Görsel işleme — 8 oyun
- **Hız & Reaksiyon:** Sakkad ve tepki hızı — 8 oyun
- **Eğitici & Bilişsel:** Okuma, sayı, renk, hayvan — 10 oyun
- **Fiziksel & Denge:** Motor kontrol ve koordinasyon — 8 oyun
- **Macera & Keşif:** Motivasyon ve uzun dönem katılım — 8 oyun

İleride her kategoriye daha fazla oyun eklenebilir.

---

## 6. STEREOSKOPİK ONLINE KİTAPLAR

### MVP Kitapları (5 Adet)

| # | Kitap | Yazar | Kategori | Sayfa | Durumu |
|----|-------|-------|----------|-------|--------|
| 1 | Alice Harikalar Diyarında | Lewis Carroll | Macera | 12 | ✅ MVP |
| 2 | Küçük Prens | A. de Saint-Exupéry | Masal | 10 | ✅ MVP |
| 3 | Pinokyo | Carlo Collodi | Macera | 12 | ✅ MVP |
| 4 | Alaaddin ve Sihirli Lambası | Binbir Gece | Masal | 10 | ✅ MVP |
| 5 | Nasreddin Hoca Fıkraları | Halk Hikayeleri | Eğlence | 8 | ✅ MVP |

### Genişletilmiş Kitap Kataloğu (15+ İlave)

| # | Kitap | Yazar | Kategori | Sayfa | Durumu |
|----|-------|-------|----------|-------|--------|
| 6 | Peter Pan | J.M. Barrie | Macera | 14 | ⏰ Phase 2 |
| 7 | Oz Büyükcüsü | L. Frank Baum | Macera | 16 | ⏰ Phase 2 |
| 8 | Pamuk Prenses ve Yedi Cüceler | Grimm | Masal | 12 | ⏰ Phase 2 |
| 9 | Hansel ve Gretel | Grimm | Masal | 10 | ⏰ Phase 2 |
| 10 | Çirkin Ördek Yavrusu | Hans Christian Andersen | Masal | 8 | ⏰ Phase 2 |
| 11 | Kibritçi Kız | Hans Christian Andersen | Masal | 8 | ⏰ Phase 2 |
| 12 | Kırmızı Topun Sırrı | Orijinal | Eğitici | 10 | ⏰ Phase 2 |
| 13 | Bulutların Üstünde | Orijinal | Macera | 12 | ⏰ Phase 2 |
| 14 | Minik Astronotun Yolculuğu | Orijinal | Bilim | 14 | ⏰ Phase 2 |
| 15 | Ormanda Bir Gün | Orijinal | Doğa | 10 | ⏰ Phase 2 |
| 16 | Renkli Şehir | Orijinal | Eğitici | 12 | ⏰ Phase 2 |
| 17 | Kaybolan Ayıcık | Orijinal | Duygular | 10 | ⏰ Phase 2 |
| 18 | Deniz Altı Macerası | Orijinal | Macera | 14 | ⏰ Phase 2 |
| 19 | Mavi Tren | Orijinal | Eğitici | 10 | ⏰ Phase 2 |
| 20 | Uyku Öncesi Yıldızlar | Orijinal | Masallar | 8 | ⏰ Phase 2 |

### Kitap Teknolojisi

- **Format:** Kırmızı-mavi anaglif, kalibrasyonla uyumlu
- **Sayfalar:** Canvas render, metin ve görsel farklı derinlik katmanlarında
- **Sesli Okuma:** TTS (Text-to-Speech) Türkçe ve İngilizce
- **İnteraktif Öğeler:** Tıklanabilir nesneler, ses efektleri (MVP'de temel, Phase 2'de ileri)
- **İlerleme Takibi:** Kaçıncı sayfa, okuma süresi

### Kitap Kategorileri (Genişletilebilir)

- Klasik Masallar
- Macera Öyküleri
- Eğitici İçerik (Bilim, Doğa, Renkler, Hayvanlar)
- Duygu Eğitimi
- Türk Kültürü (Nasreddin Hoca, Keloğlan, Dede Korkut)
- Ritimli Şiirleri

---

## 7. BASILI 3D KİTAP VE GÖZLÜK E-TİCARET (PHASE 2)

**Karar:** MVP'de SKIP. E-ticaret modülü Phase 2'ye ertelenmektedir.

MVP'de dijital premium kod sisteminden başlanacak. Phase 2'de fiziksel ürün satışı eklenir:
- Klipsli ve normal 3D gözlükler
- Temalı çocuk gözlükleri (uzay, kelebek, robot, deniz kızı, dinozor, yıldız, araba)
- Basılı stereoskopik kitaplar
- Paketler (gözlük + kitap + premium kod)

Kargo entegrasyonu: Aras Kargo, Yurtiçi Kargo, UPS — **TBD**

---

## 8. MVP VS PHASE 2 AYRIMI

### MVP Kapsamı (21 Mayıs)

#### Yazılım
- ✅ Auth, rol tabanlı erişim
- ✅ 8 tam oynanabilir oyun + 50+ katalog
- ✅ 5 online kitap + okuyucu
- ✅ Kalibrasyon sistemi
- ✅ Parent dashboard (oyunlar, kitaplar, basit raporlar)
- ✅ Doctor dashboard (hasta listesi, notlar, hafif izleme)
- ✅ Admin panel (kullanıcı CRUD, oyun/kitap yönetimi)
- ✅ Premium kod sistemi (dijital aktivasyon)
- ✅ AI asistanı (guardrail'lerle)
- ✅ Temel kullanım takibi
- ✅ Oturum limiti ve uyarıları
- ✅ KVKK/onam sayfası
- ✅ Temel audit log
- ✅ PWA + offline (2 oyun + 1 kitap)
- ✅ Dark/Light tema
- ✅ TR + EN çoklu dil

#### İçerik
- ✅ Ana sayfa
- ✅ Nasıl çalışır (5 adım)
- ✅ Bilimsel kanıtlar sayfası
- ✅ Blog (5 seeded yazı)
- ✅ Yardım / SSS
- ✅ Hakkımızda
- ✅ İletişim
- ✅ Video sayfası
- ✅ Yasal sayfalar

#### Altyapı
- ✅ PostgreSQL + Redis
- ✅ NestJS API
- ✅ Vercel (frontend)
- ✅ Railway / AWS (backend)
- ✅ GitHub Actions CI/CD
- ✅ Sentry monitoring

### Phase 2 Kapsamı (Haziran — Ağustos 2026)

#### Yazılım
- ✅ E-ticaret modülü (Shopify custom veya custom)
- ✅ Gözlük ve kitap satış sistemi
- ✅ Kargo entegrasyonları
- ✅ Eye-tracking (Tobii / Gazepoint / WebGazer)
- ✅ Monoküler mod tam implementasyon
- ✅ Hospital API (HL7 hazırlığı)
- ✅ School admin role
- ✅ AI-driven zorluk progresyonu
- ✅ Gelişmiş audit logging (KVKK full compliance)
- ✅ Automated VA test calibration
- ✅ Native Android (React Native / Capacitor)
- ✅ Native iOS (React Native / Capacitor)

#### İçerik
- ✅ 10+ ek online kitap
- ✅ 20 ek oyun (tam implementasyon)
- ✅ 30+ blog yazısı
- ✅ Doktor testimonial videoları
- ✅ AR dil desteği

#### Altyapı
- ✅ AWS ECS/Lambda scale-up
- ✅ Turborepo monorepo (web + mobile)
- ✅ Advanced CDN caching
- ✅ PostHog event analytics

---

## 9. GELİŞTİRİLMİŞ GELİŞTİRME SÜREÇ PLANI

### Faz 0: Hazırlık (4–5 Mayıs) — 2 Gün

| Gün | Görev | Detay | Çıktı |
|-----|-------|-------|-------|
| 4 Mayıs | Proje iskeleti | Next.js + NestJS + PostgreSQL + Redis | Repository hazır |
| 4 Mayıs | UI Wireframe | Figma'da 25+ sayfa düşük detay | Wireframe dosyası |
| 5 Mayıs | DB Schema | Prisma şeması: user, child, game_session, etc. | Prisma migrate |
| 5 Mayıs | Auth + Tema + Dil | NextAuth.js, next-themes, next-intl | Auth akışı çalışıyor |

### Faz 1: Çekirdek Altyapı (6–8 Mayıs) — 3 Gün

| Gün | Görev | Detay | Çıktı |
|-----|-------|-------|-------|
| 6 Mayıs | Admin panel skeleton | Layout, nav, user CRUD form | Admin paneli çalışıyor |
| 7 Mayıs | Parent panel skeleton | Çocuk profil, oyun listesi | Parent paneli çalışıyor |
| 8 Mayıs | Doctor panel skeleton | Hasta listesi, not sistemi | Doctor paneli çalışıyor |

### Faz 2: Oyun Motoru ve Kalibrasyon (9–10 Mayıs) — 2 Gün

| Gün | Görev | Detay | Çıktı |
|-----|-------|-------|-------|
| 9 Mayıs | PixiJS oyun motoru | Anaglif render, kalibrasyonla uyumluluk | Game engine SDK hazır |
| 10 Mayıs | Kalibrasyon sayfası | Renk, yoğunluk, parlaklık, test | Kalibrasyon akışı hazır |

### Faz 3: MVP Oyunları (11–12 Mayıs) — 2 Gün

| Gün | Görev | Detay | Çıktı |
|-----|-------|-------|-------|
| 11 Mayıs | 4 oyun + kurulum | Balon, Yıldız, Kelebek, Labirent | 4 oyun oynanabilir |
| 12 Mayıs | 4 oyun | Eşleştirme, Hedef, Resim, Kurbağa | 8 oyun hazır |

### Faz 4: Kitaplar ve İçerik (13 Mayıs) — 1 Gün

| Gün | Görev | Detay | Çıktı |
|-----|-------|-------|-------|
| 13 Mayıs | 5 kitap + okuyucu | Stereoskopik render, TTS, katalog | 5 kitap okunabilir |

### Faz 5: Oyun Kataloğu (14 Mayıs) — 1 Gün

| Gün | Görev | Detay | Çıktı |
|-----|-------|-------|-------|
| 14 Mayıs | 50+ oyun kartları | Teaser, isim, açıklama, görsel (basit) | Oyun kataloğu görünümü |

### Faz 6: İçerik Sayfaları (15 Mayıs) — 1 Gün

| Gün | Görev | Detay | Çıktı |
|-----|-------|-------|-------|
| 15 Mayıs | Blog, SSS, yardım, iletişim | 5 seeded blog yazısı, 30 SSS | İçerik sayfaları hazır |

### Faz 7: AI, Raporlar, KVKK (16 Mayıs) — 1 Gün

| Gün | Görev | Detay | Çıktı |
|-----|-------|-------|-------|
| 16 Mayıs | AI asistanı + raporlar + KVKK | GPT guardrail'ler, haftalık rapor, onam ekranı | AI ve güvenlik hazır |

### Faz 8: PWA ve Bildirimler (17 Mayıs) — 1 Gün

| Gün | Görev | Detay | Çıktı |
|-----|-------|-------|-------|
| 17 Mayıs | PWA + service worker + push | Offline mod, bildirimler | PWA çalışıyor |

### Faz 9: SEO ve Performans (18 Mayıs) — 1 Gün

| Gün | Görev | Detay | Çıktı |
|-----|-------|-------|-------|
| 18 Mayıs | Meta etiketler, sitemap, schema | Lighthouse optimizasyon | Lighthouse >85 |

### Faz 10: Test ve Deploy (19–21 Mayıs) — 3 Gün

| Gün | Görev | Detay | Çıktı |
|-----|-------|-------|-------|
| 19 Mayıs | QA ve bug fix | Tüm akışlar test, mobile uyumlu | Bug fix kompleks |
| 20 Mayıs | Staging deploy | Full test environment | Production hazır |
| 21 Mayıs | Production deploy + demo prep | Live, sunum materyali | Live site + yatırımcı demo |

**Toplam:** 17 gün, 1 ekip başı başına ~3 developer + 1 designer.

---

## 10. VERİTABANI ŞEMASI

[Mevcut planla aynı; sadece audit_logs tablosu eklenmeli]

### Ek Tablo: audit_logs

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(100),
  resource_type VARCHAR(50),
  resource_id UUID,
  old_value JSONB,
  new_value JSONB,
  timestamp TIMESTAMP DEFAULT NOW(),
  ip_address INET
);
```

---

## 11. PREMIUM KOD SİSTEMİ DETAYI

### MVP'de: Dijital Kod Sistemi

1. **Admin:** Kod üret → 1/6/12 ay seçeneği → toplu üretim (1–1000) → CSV dışa aktar
2. **Ebeveyn:** Kod gir → doğrula → premium aktif olur
3. **Kod Formatı:** `GÖZ-XXXXXX-XXXXXX-XXXXXX` (36 karakter)
4. **Validation:** Benzersizlik, bir kez kullanım, son kullanma tarihi

### Phase 2'de: Fiziksel Kutu + Stripe

- Boxed kart: Premium kod bastırılı
- E-ticaret ödeme: Stripe alternatifi (Iyzico/Paracode)
- Otomatik aktivasyon: Kod taranmış veya girişle

---

## 12. KLİNİK GÜVENLIK VE ONAM AKIŞI

### MVP'de Implementasyon

#### 1. Baseline Test Kaydı

Parent dashboard → "Tedavi Başlat" → Baseline VA/Stereopsis alanları
- VA skoru (manuel giriş, e.g., 20/60)
- Stereopsis testi seçimi (temel yes/no)
- Doktor tarafından onay (opsiyonel MVP'de)

#### 2. KVKK ve Onam Ekranı

Kayıt sırasında **zorunlu** ekran:
```
[ ] "AI raporlarının hesaplamış cümlelerini anladım
    ve ebeveyn tavsiyesi olarak kabul ediyorum."
[ ] "Kullanım verilerim platform iyileştirmesi için
    kullanılabilir."
[ ] "Tıbbi tavsiye almıyorum; doktorumla istişare edeceğim."
```

#### 3. Kullanım Limitleri

- **Ayarlar:** Günlük limit (10–30 dakika seçimi)
- **Baskı:** Limit ulaşınca soft warning → 5 dk sonra hard stop
- **Mola Uyarısı:** 20 dakika sonra "20-20-20 molası yap" overlay

#### 4. Kalibrasyon Güvenlik Sınırları

- **Parlaklık:** 50–150% (aşırı 0 veya 200% izin yok)
- **Kontrast:** 80–120%
- **Yoğunluk:** 30–100%
- **Aşırı ayarlar:** "Bu ayarlar göz sağlığı için uygun olmayabilir" uyarısı

#### 5. Audit Logging

Tüm kritik işlemler loglanır:
- Kullanıcı girişleri / çıkışları
- Premium kod aktivasyonu
- Doktor notları yazma
- Kalibrasyonlar
- Oturum başlangıç/bitiş
- Parent ayarları değişikliği

**Tutulma:** 1 yıl

#### 6. AI Asistan Guardrail'leri

GPT prompt başında şu eklenmeli:

```
You are a helpful health information assistant, NOT a medical professional.
Always include these disclaimers:
- "I'm not a doctor. Please consult with an ophthalmologist."
- "This information is general and not personalized treatment."
- "Do not use this app as a replacement for clinical care."
- If user asks for diagnosis, redirect: "Only an eye doctor can diagnose."
- If user asks for medication, respond: "Ask your doctor about treatment options."
```

---

## 13. YAPAY ZEKA MODÜLLERI DETAYI VE GUARDRAIL'LER

### 13.1 AI Sohbet Asistanı

**MVP Özellikleri:**
- GPT-4 API (Türkçe prompt)
- 100 token/response limit (kontrol)
- 5 soru/saat limit per user (rate limit)
- 5 dakikalık session timeout

**Guardrail'ler:**
- Tıbbi teşhis yapmaz
- İlaç önerisi yapmaz
- Terapist rolü üstlenmez
- Açık, doktor görümü önerilebilir mesajları

**Örnek Prompt:**

```
Sen Gözmacerası'nın yardımcı asistanısın. 
Ambliyopi ve göz sağlığı konularında bilgi veriş.
Ancak:
1. Asla tıbbi teşhis yapma.
2. Asla ilaç öner.
3. Daima "doktorunuza başvurunuz" tavsiye et.
4. Cevaplar 3–5 cümlede tutulmalı.

Kullanıcı sorusu: {user_input}
```

### 13.2 AI Haftalık Rapor

**MVP Yapısı:** Kural tabanlı template

```
📊 GÖZMACERASI HAFTALIK RAPOR
Çocuk: [İsim] | Hafta: [Tarih]

🎮 Oyun Aktivitesi
• Toplam süre: [X saat Y dakika]
• Oyun sayısı: [Z farklı oyun]
• Ortalama skor: [+X% eğilim]

📖 Kitap Aktivitesi
• Okunan kitap: [N]
• Toplam okuma: [X dakika]

📈 Haftaya Göre Eğilim
• Süresi: [↑ Arttı / → Sabit / ↓ Azaldı]
• Engagement: [↑ / → / ↓]

🤖 AI Önerileri
• [Turing sona dayalı tavsiye 1]
• [Tavsiye 2]
• [Doktor görüşü uyarısı]
```

### 13.3 Veri Analitik (MVP'de Basit İstatistik)

- Haftalık kullanım ortalaması
- Oyun başına ortalama skor
- En çok oynanan oyunlar
- Tedavi uyumu % (gün sayısı / 7)

Phase 2'de Scikit-learn modelleriyle ileriye dönük tahminer eklenebilir.

---

## 14. PWA VE PLATFORM STRATEJİSİ

### MVP PWA

- **Service Worker:** next-pwa ile Workbox
- **Offline Desteği:** 2 oyun + 1 kitap çevrimdışı oynanabilir
- **Install Prompt:** "Uygulamayı Yükle" banner (iOS/Android)
- **Push Bildirim:** Mola hatırlatması, haftasonu özeti
- **Manifest:** App name, icon, splash screen

### Gerekli Test

- WiFi kesildi sonra online gelişte sync
- Tablet ve telefonda manifest davranışı
- Offline oyun sonrası skor kaydedilişi

### Phase 2 Platform Stratejisi

```
┌──────────────────────────────────────────────────┐
│ TURBOREPO MONOREPO YAPISI                        │
├──────────────────────────────────────────────────┤
│ packages/                                         │
│ ├── shared/                                       │
│ │   ├── game-engine (PixiJS + logic)             │
│ │   ├── api-client                               │
│ │   ├── ui-components (Radix + Tailwind)         │
│ │   └── utils                                     │
│ │                                                 │
│ ├── web (Next.js, PWA)                           │
│ ├── mobile (React Native / Capacitor)            │
│ ├── desktop (Tauri)                              │
│ └── admin (Next.js subset)                       │
└──────────────────────────────────────────────────┘
```

---

## 15. YATIRIMCI SUNUMU İÇİN KRİTİK METRİKLER

**MVP'de Sunumlar:**

1. **Pazar Boyutu:** Türkiye 0–14 yaş: ~12 milyon, ambliyopi prevalansı 1–5% → 120k–600k hedef
2. **Klinik Kanıt:** Dikloptik therapy: 0.201 logMAR iyileşme
3. **Ürün Hazırlığı:** 8 oyun + 5 kitap + dashboard + katalog (50+ başlık)
4. **MVP Teslimi:** 21 Mayıs (17 günde)
5. **Demo Modu:** Sanal hasta + sham data ile canlı demo
6. **Roadmap:** Phase 2 (haziran), native (ağustos), enterprise (eylül)

**Demo Metrikleri:**
- Ortalama oturum süresi: 15 dakika
- Ödül kazanma oranı: 75%
- Oyun başına ortalama skor: trend artışı
- Doktor paneli: 10 mock hasta, 50 oturum verisi

---

## 16. RİSKLER VE AZALTMA STRATEJİLERİ

| Risk | Olasılık | Etki | Azaltma |
|------|----------|------|---------|
| 8 oyun 12 günde tamamlanamama | Yüksek | Yüksek | MVP'de sadece 4 oyun + kart 4 oyun |
| Kalibrasyon renk artefaktleri | Orta | Orta | Kapsamlı test; fallback kırmızı-yeşil |
| Offline sync sorunları | Orta | Orta | Basit sync; kompleks Phase 2 |
| Ödeme sağlayıcısı entegrasyonu gecikemesi | Orta | Düşük | MVP'de kod manual; e-ticaret Phase 2 |
| Eye-tracking eksikliği | Düşük | Orta | MVP'de basit browser latansı; Phase 2'de Tobii |
| Hospital API hazırlığı | Düşük | Düşük | Temel scaffold; full implementasyon Phase 2 |

---

## 17. LANSMAN SONRASI YOL HARİTASI

| Zaman | Hedef | Kapsam |
|-------|-------|--------|
| **Haziran 2026** | Phase 2 Başlangıcı | E-ticaret, kargo entegrasyonu, +20 oyun |
| **Temmuz 2026** | Eye-Tracking Beta | Tobii SDK entegrasyonu, şaşılık taraması |
| **Ağustos 2026** | Native Uygulamalar | Android + iOS (React Native / Capacitor) |
| **Eylül 2026** | Hospital API | HL7 hazırlığı, kurumsal satış pilot |
| **Ekim 2026** | Masaüstü Uygulamalar | Windows + Linux (Tauri) |
| **Kasım 2026** | Uluslararası Pazar | İngilizce tam, Arapça RTL |
| **Aralık 2026** | Klinik İşbirlikleri | Doktor networks, pilot çalışmalar |
| **2027 Q1** | VR/AR | Meta Quest desteği, AR oyunlar |
| **2027 Q2** | AI Advances | Trained model raporlar, tahmin algısı |

---

## ÖZETİ

**CodeV2 Temel Farkları:**

1. ✅ **MVP Gerçekçi:** 8 oyun, 5 kitap, temel dashboardlar, 17 günde çıkarılabilir
2. ✅ **Katalog Stratejisi:** 50+ oyun başlığı, ilk sürümde çoğu isim/görsel; tı ilişkili konvansyon
3. ✅ **Klinik Güvenlik:** KVKK, onam, audit log, AI guardrail'ler, kullanım limitleri
4. ✅ **Teknoloji Iyileştirmesi:** Sade seçimler, monorepo hazırlığı, Phase 2 için açık yol
5. ✅ **Yatırımcı İkna Edici:** Demo modu, metrikler, roadmap, pazar analizi

**Kritik Kararlar Alınması Gerekli:**
- Ödeme sağlayıcısı (Stripe yerine Iyzico/Paracode/2Checkout)
- 8 MVP oyununun kesin listesi
- İlk 5 kitabın dönüştürülüş kapasitesi
- Doktor onboarding sertifikasyon derinliği

**Sonuç:** Bu plan, hem hızlı teslime uygun MVP hem de kış ölçeklendirmeye hazır bir platform tasarımı sunar.

---

**Güncelleme Tarihi:** 4 Mayıs 2026, 16:00 UTC+3
**Versiyon:** CodeV2 — MVP Focused, Scalable Catalog, Clinically Secure
