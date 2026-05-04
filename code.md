# 🔵🔴 GÖZMACERASI — Kapsamlı Proje Planı (v2)

**Hedef Tarih:** 21 Mayıs 2026 (Yatırımcı Sunumu)
**Mevcut Site:** gozmacerasi.com
**Referans Proje:** AmblyoPlay.com
**Hazırlayan:** Gözmacerası Ekibi
**Güncelleme Tarihi:** 4 Mayıs 2026

---

## İÇİNDEKİLER

1. [Proje Özeti](#1-proje-özeti)
2. [Teknoloji Yığını](#2-teknoloji-yığını-tech-stack)
3. [Sayfa Mimarisi ve Yapılanması](#3-sayfa-mimarisi-ve-yapılanması)
4. [Özellik Listesi (50+ Özellik)](#4-özellik-listesi-50-özellik)
5. [28 Dikloptik Oyun Listesi](#5-28-dikloptik-oyun-listesi)
6. [Stereoskopik Online Kitaplar](#6-stereoskopik-online-kitaplar)
7. [Basılı 3D Kitap ve Gözlük E-Ticaret](#7-basılı-3d-kitap-ve-gözlük-e-ticaret)
8. [Geliştirme Süreç Planı](#8-geliştirme-süreç-planı-17-gün-4-mayıs--21-mayıs)
9. [Veritabanı Şeması](#9-veritabanı-şeması)
10. [Premium Kod Sistemi](#10-premium-kod-sistemi-detayı)
11. [Yapay Zeka Modülleri](#11-yapay-zeka-modülleri-detayı)
12. [AmblyoPlay Karşılaştırması](#12-amblyoplayden-alınan-ve-eklenen-özellikler)
13. [PWA ve Platform Stratejisi](#13-pwa-ve-platform-stratejisi)
14. [Yatırımcı Sunumu Metrikleri](#14-yatırımcı-sunumu-için-kritik-metrikler)
15. [Riskler ve Azaltma Stratejileri](#15-riskler-ve-azaltma-stratejileri)
16. [Lansman Sonrası Yol Haritası](#16-lansman-sonrası-yol-haritası)

---

## 1. PROJE ÖZETİ

Gözmacerası, çocuklarda ambliyopi (tembel göz) ve şaşılık tedavisini destekleyen, gamified (oyunlaştırılmış) dikloptik ve monoküler görsel terapi platformudur. AmblyoPlay benzeri şekilde, kırmızı-mavi stereoskopik gözlüklerle çalışan interaktif oyunlar, online kitaplar, basılı 3D kitap satışı ve yapay zeka destekli takip sunar.

**Kapsam:**
- Dijital platform (oyunlar, online kitaplar, AI destekli takip)
- E-ticaret (3D gözlük satışı, basılı 3D kitap satışı, paket satışları)
- Premium abonelik sistemi (kod tabanlı)
- PWA → Native mobil ve masaüstü uygulamaları
- Blog, video içerik, topluluk

**Klinik Kanıt:**
- Dikloptik eğitimin şaşılık hastalarında en yüksek etki boyutunu (0.201 logMAR) gösterdiği kanıtlanmıştır.
- Anizometropik ambliyopide AmblyoPlay tabanlı multimodal görsel terapinin, görsel ve okülomotor fonksiyonlarda anlamlı iyileşmeler sağladığı gösterilmiştir.

---

## 2. TEKNOLOJİ YIĞINI (TECH STACK)

### 2.1 Frontend

| Katman | Teknoloji | Gerekçe |
|--------|-----------|---------|
| Web Uygulaması | **Next.js 14 (App Router)** | SSR/SSG desteği, SEO optimizasyonu, yatırımcı sunumu için hızlı yükleme |
| UI Kitaplığı | **Tailwind CSS + Radix UI** | Hızlı prototipleme, erişilebilirlik standartları (ADA uyumluluğu), dark/light mode desteği |
| Durum Yönetimi | **Zustand** | Hafif, çocuklar için optimize edilmiş oyun state yönetimi |
| Animasyon | **Framer Motion + GSAP** | Oyun içi animasyonlar, çocukların dikkatini çekmek için |
| 3D / Oyun Motoru | **Three.js + PixiJS** | WebGL tabanlı tarayıcı içi oyunlar |
| Grafik / Görsel | **Canvas API + SVG** | Kitaplar, çizim araçları, stereoskopik render |
| PWA | **next-pwa** (Workbox tabanlı) | Çevrimdışı mod, ana ekrana ekleme, push bildirimler |
| Tema Sistemi | **next-themes** | Dark/Light/Auto mod geçişi, sistem tercihini algılama |
| Çoklu Dil | **next-intl** veya **react-i18next** | TR/EN/AR, LTR/RTL otomatik yön desteği |

### 2.2 Backend

| Katman | Teknoloji | Gerekçe |
|--------|-----------|---------|
| API Katmanı | **Node.js + NestJS** | Modüler mimari, doktor/admin/ebeveyn rolleri için ayrı modüller |
| Veritabanı | **PostgreSQL** (ana veri) + **Redis** (oturum/önbellek) | Kullanıcı verileri, oyun skorları, kullanım süreleri |
| ORM | **Prisma** | Type-safe veritabanı sorguları |
| Dosya Depolama | **AWS S3** veya **Cloudflare R2** | Kitap görselleri, oyun asset'leri, video thumbnail'leri |
| Gerçek Zamanlı | **Socket.io** | Doktor-hasta canlı izleme, çok oyunculu oyunlar |
| Kimlik Doğrulama | **NextAuth.js + JWT** | Rol tabanlı erişim (admin, doktor, ebeveyn, çocuk) |
| E-posta | **Resend** veya **AWS SES** | Bildirimler, haftalık raporlar, premium hatırlatmaları |
| Video Hosting | **YouTube API** + **Cloudflare Stream** | Doktor videoları, eğitim içerikleri |

### 2.3 Yapay Zeka

| Katman | Teknoloji | Gerekçe |
|--------|-----------|---------|
| Sohbet Botu | **OpenAI GPT-4 API** veya **Google Gemini API** | Ebeveyn/kullanıcı sorularına yanıt |
| Rapor Üretimi | **LangChain + OpenAI** | Kullanım verilerinden AI destekli rapor oluşturma |
| Veri Analizi | **Python (Pandas + Scikit-learn)** | Kullanım trendleri, tedavi ilerleme tahmini |

### 2.4 Ödeme ve Abonelik

| Katman | Teknoloji | Gerekçe |
|--------|-----------|---------|
| Ödeme İşlemci | **Stripe Billing** (Türkiyede Çalışmıyor Başka bir ödeme istemcisi kullanılabilir. Türkiyede çalışan.) | Abonelik yönetimi, tek seferlik satışlar (gözlük, kitap, paket), otomatik fatura |
| Kod Üretimi | **Özel modül + Stripe Promo Codes** | 1 aylık/6 aylık/1 yıllık premium kod üretimi |
| Kargo Entegrasyonu | **ShipEngine API** veya **Aras Kargo API** | Fiziksel ürün gönderimi (gözlük, kitap, paket) |
| Fatura | **Stripe Invoicing** + **e-Fatura Entegrasyonu** | Kurumsal satışlar için |

### 2.5 Altyapı ve DevOps

| Katman | Teknoloji | Gerekçe |
|--------|-----------|---------|
| Hosting (Web) | **Vercel** | Next.js SSR, edge fonksiyonları, otomatik deploy |
| Hosting (Backend) | **AWS ECS/Fargate** veya **Railway** | API sunucusu, ölçeklenebilir |
| CI/CD | **GitHub Actions** | Otomatik test ve deploy |
| Monitoring | **Sentry + PostHog** | Hata takibi, kullanıcı analitiği |
| CDN | **Cloudflare** | Görsel, oyun asset'leri, video için hızlı teslimat |

### 2.6 Native Uygulamalar (Faz 2–3)

| Platform | Teknoloji | Gerekçe |
|----------|-----------|---------|
| Android | **React Native** veya **Capacitor** | Tek kod tabanı, native performans |
| iOS | **React Native** veya **Capacitor** | App Store dağıtımı |
| Windows | **Tauri** veya **Electron** | Masaüstü uygulaması |
| Linux | **Tauri** | Hafif masaüstü uygulaması |
| Ortak Paylaşım | **Turborepo monorepo** | Web, mobil, masaüstü arasında paylaşılan kod |

### 2.7 Göz Takibi (Opsiyonel / Faz 3)

| Katman | Teknoloji | Gerekçe |
|--------|-----------|---------|
| Donanım Entegrasyonu | **Tobii Eye Tracking SDK** veya **Gazepoint API** | Şaşılık taraması, okülomotor takip |
| Webcam Tabanlı | **WebGazer.js + MediaPipe** | Donanım bağımsız göz takibi |

---

## 3. SAYFA MİMARİSİ VE YAPILANDIRMASI

### 3.1 Ana Sayfa (`/`)

- Hero section: Animasyonlu göz macerası teması, CTA butonları
- "Nasıl Çalışır?" bölümü (3 adımlı açıklayıcı animasyon)
- Ürün vitrini: Gözlükler, kitaplar, paketler
- Online kitap önizleme
- Premium plan karşılaştırma tablosu
- Doktor görüşleri carousel
- Son blog yazıları
- SSS accordion
- İletişim CTA

### 3.2 Ürün Sayfaları

#### 3.2.1 Gözlük Sayfası (`/urunler/gozlukler`)

| Ürün Tipi | Açıklama | Görsel |
|-----------|----------|--------|
| **Klipsli 3D Gözlük (Kırmızı-Mavi)** | Mevcut gözlüklere klipslenir, pratik kullanım | 📎 |
| **Klipsli 3D Gözlük (Kırmızı-Yeşil)** | Farklı renk kombinasyonu, farklı kalibrasyon | 📎 |
| **Normal 3D Gözlük (Kırmızı-Mavi)** | Standart stereoskopik gözlük | 👓 |
| **Normal 3D Gözlük (Kırmızı-Yeşil)** | Standart, alternatif renk | 👓 |
| **Uzay Temalı Çocuk Gözlüğü** | Astronot şekli, çocuklar için eğlenceli tasarım | 🚀 |
| **Kelebek Şeklinde Çocuk Gözlüğü** | Renkli kanatlar, kız çocuklar için popüler | 🦋 |
| **Robot Şeklinde Çocuk Gözlüğü** | Futuristik tasarım, erkek çocuklar için | 🤖 |
| **Deniz Kızı Temalı Çocuk Gözlüğü** | Pullu tasarım, parlayan efektler | 🧜‍♀️ |
| **Dinozor Şeklinde Çocuk Gözlüğü** | T-Rex kulaklar, yeşil tonlar | 🦕 |
| **Yıldız Şeklinde Çocuk Gözlüğü** | Parlayan yıldız formu, altın/gümüş | ⭐ |
| **Araba Şeklinde Çocuk Gözlüğü** | Yarış arabası formu, spor tasarım | 🏎️ |

#### 3.2.2 Basılı 3D Kitap Sayfası (`/urunler/kitaplar`)

Her kitap sayfasında:
- Kitap kapağı görseli
- Açıklama ve yaş grubu
- 3D önizleme (kırmızı-mavi gözlükle bakılabilen örnek sayfa)
- Fiyat
- Sepete ekle
- Değerlendirmeler

#### 3.2.3 Paket Sayfası (`/urunler/paketler`)

| Paket | İçerik | Fiyat Aralığı |
|-------|--------|---------------|
| **Başlangıç Paketi** | 1 normal 3D gözlük + 1 aylık premium kod + 1 kitap | ₺ |
| **Aile Paketi** | 2 normal + 1 klipsli gözlük + 6 aylık premium kod + 3 kitap | ₺₺ |
| **Doktor Paketi** | 10 gözlük (karışık) + 12 aylık premium kod + 5 kitap + klinik destek | ₺₺₺ |
| **Çocuk Eğlence Paketi** | 1 temalı çocuk gözlüğü + 1 aylık premium kod + 2 çocuk kitabı | ₺ |
| **Okul Paketi** | 20 gözlük + 12 aylık toplu premium + eğitim materyalleri | ₺₺₺₺ |

Her paketin içinde: **Premium aktivasyon kodu kartı** (kutu içinde basılı)

### 3.3 Kayıt / Giriş Sayfası (`/auth`)

- Ebeveyn kaydı (çocuk profili oluşturma ile)
- Doktor kaydı (davet kodu ile)
- Admin girişi (özel URL: `/auth/admin`)
- Sosyal medya ile giriş (Google, Apple)
- E-posta doğrulama akışı

### 3.4 Ebeveyn Paneli (`/dashboard/parent`)

**Navigasyon:**

- **Genel Bakış:** Çocuğun genel ilerleme özeti, VA skoru trendi, stereopsis gelişimi, bugünkü hedef
- **Oyunlar:** Mevcut oyunlar, tamamlananlar, favoriler, doktor önerileri
- **Online Kitaplar:** Stereoskopik kitap kütüphanesi, okuma geçmişi
- **Kullanım Raporları:** Günlük/haftalık/aylık kullanım süreleri, oturum detayları, grafikler
- **AI Asistan:** Soru-cevap, kişiselleştirilmiş öneriler, AI kullanım raporu
- **Siparişlerim:** Gözlük, kitap, paket sipariş takibi
- **Ayarlar:** Profil yönetimi, gözlük kalibrasyonu, tema (dark/light), dil seçimi, bildirim tercihleri
- **Abonelik:** Mevcut plan, kod girişi, yükseltme seçenekleri

### 3.5 Doktor Paneli (`/dashboard/doctor`)

**Navigasyon:**

- **Hasta Listesi:** Tüm hastalar, arama ve filtreleme, durum etiketleri
- **Hasta Detayı:**
  - Görsel keskinlik (VA) geçmişi ve grafikleri
  - Stereopsis gelişim takibi
  - Oyun bazlı performans metrikleri
  - Kullanım sıklığı ve süresi
  - Tedavi uyumu skoru
  - Okülomotor metrikler (varsa)
- **Raporlar:** AI destekli hasta raporu oluşturma, PDF export
- **Reçete Modülü:** Hangi oyunların, hangi sıklıkla önerileceği, özel notlar
- **Mesajlaşma:** Ebeveyn ile güvenli iletişim
- **Randevu Takvimi:** Kontrol randevuları, hatırlatmalar
- **Ayarlar:** Profil, klinik bilgileri, diploma bilgileri

### 3.6 Admin Paneli (`/dashboard/admin`)

**Navigasyon:**

- **Dashboard:** Genel istatistikler (toplam kullanıcı, aktif abonelik, gelir, siparişler)
- **Kullanıcı Yönetimi:** Ebeveyn, doktor, çocuk hesapları CRUD, roller
- **Premium Kod Üretimi:**
  - 1 aylık / 6 aylık / 1 yıllık seçenekler
  - Toplu kod üretimi (1–1000)
  - Kod geçerlilik süresi ayarlama
  - Kullanılmış/kullanılmamış kod filtreleme ve dışa aktarma
- **Oyun Yönetimi:** Oyun ekleme/düzenleme, zorluk seviyeleri, kategoriler
- **Online Kitap Yönetimi:** Kitap ekleme/düzenleme, sayfa yönetimi, stereoskopik kalibrasyon
- **Basılı Kitap Yönetimi:** Stok takibi, fiyat yönetimi, ürün sayfası düzenleme
- **Gözlük Yönetimi:** Ürün ekleme/düzenleme, stok, varyantlar (renk, tip, tasarım)
- **Paket Yönetimi:** Paket oluşturma, fiyatlandırma, içerik tanımlama
- **Sipariş Yönetimi:** Tüm siparişler, kargo takibi, iade yönetimi
- **Blog Yönetimi:** Yazı ekleme/düzenleme, SEO meta etiketleri, kategori, yayın tarihi planlama
- **Video Yönetimi:** YouTube video ekleme, kategori, sıralama
- **İçerik Yönetimi:** Doktor profilleri, SSS, iletişim bilgileri, takım tanıtımı, kullanıcı yorumları
- **AI Raporları:** Platform geneli AI analitik raporlar, trend analizi
- **Sayfa Yönetimi:** Statik sayfalar (Hakkında, Nasıl Çalışır, Yardım, Gizlilik, KVKK)
- **Ayarlar:** Sistem konfigürasyonu, API anahtarları, e-posta şablonları, tema ayarları

### 3.7 Kalibrasyon Sayfası (`/calibration`)

- Gözlük rengi seçimi (kırmızı-mavi, kırmızı-yeşil, anaglif varyasyonları)
- Gözlük tipi seçimi (klipsli, normal, çocuk tasarımı)
- Renk yoğunluğu ayarı (slider: 0–100%)
- Parlaklık ve kontrast kalibrasyonu
- Stereo derinlik testi (kalibrasyon doğrulama — "Bu şekil çıkıntıda mı yoksa çukurda mı?")
- Kişiye özel profil kaydetme
- Her çocuk için ayrı kalibrasyon profili
- Otomatik kalibrasyon sihirbazı (adım adım)
- Kalibrasyon geçmişini görme
- "Kalibrasyonumu Sıfırla" seçeneği

### 3.8 Blog Sayfası (`/blog`)

**SEO Odaklı Blog Mimarisi:**

| Bileşen | Detay |
|---------|-------|
| Blog Ana Sayfa | Tüm yazılar kart görünümünde, kategori filtreleme, arama |
| Blog Yazısı | Tam sayfa, yazar bilgisi, okuma süresi, ilgili yazılar |
| Kategoriler | Bilimsel Makaleler, Eğlenceli Bilgiler, Ebeveyn Rehberi, Egzersiz İpuçları, Doktor Röportajları |
| SEO | Dinamik meta title/description, Open Graph, Schema.org Article markup, sitemap.xml |
| Sosyal Paylaşım | Her yazıda paylaş butonları (WhatsApp, Twitter, Facebook) |
| Yorum Sistemi | Ebeveynler yorum yapabilir (admin onaylı) |

**Örnek Blog Konuları:**
1. "Göz Tembelliği Nedir? Ebeveynler İçin Kapsamlı Rehber"
2. "Çocuğunuzun Göz Sağlığını 5 Adımda Nasıl Korursunuz?"
3. "Ambliyopi Tedavisinde Oyunlaştırma: Bilimsel Kanıtlar"
4. "3D Gözlüklerle Görsel Terapi Nasıl Çalışır?"
5. "Erken Teşhis: Göz Tembelliğinin Önlenmesinde Kritik Yaş"
6. "Çocuklar İçin Eğlenceli Göz Egzersizleri"
7. "Doktor Röportajı: Op. Dr. [İsim] ile Ambliyopi Üzerine"
8. "Okul Öncesi Dönemde Göz Muayenesinin Önemi"

### 3.9 Doktor Görüşleri ve Bilimsel Kanıtlar Sayfası (`/bilimsel-kanitlar`)

| Bölüm | İçerik |
|-------|--------|
| **Bilimsel Yayınlar** | Ambliyopi ve dikloptik tedavi ile ilgili yayınlanmış araştırma özetleri, PDF linkleri |
| **Klinik Sonuçlar** | Platform kullanımına ait klinik veriler (VA skoru gelişimi grafikleri) |
| **Doktor Görüşleri** | Uzman göz doktorlarının yazılı görüşleri, fotoğraf ve unvan bilgileri |
| **Doktor Tanıtım Videoları** | YouTube embed, doktorların platform hakkındaki yorumları |
| **Hasta Öncesi/Sonrası** | Anonimleştirilmiş tedavi öncesi ve sonrası görsel karşılaştırmalar |
| **Akademik Referanslar** | APA formatında kaynakça |

### 3.10 Video Sayfası (`/videolar`)

| Kategori | İçerik |
|----------|--------|
| **Doktor Videoları** | YouTube'dan embed edilen uzman görüşleri |
| **Eğitim Videoları** | Gözlük kullanımı, kalibrasyon, oyun oynama rehberi |
| **Testimonials** | Ebeveyn ve çocuk deneyim videoları |
| **Nasıl Yapılır** | Adım adım platform kullanım videoları |
| **Bilgilendirici** | Ambliyopi, şaşılık hakkında animasyonlu açıklayıcı videolar |

Video sayfası: YouTube API ile entegre, kategori filtreleme, arama, playlist desteği

### 3.11 Kullanıcı Deneyimleri Sayfası (`/deneyimler`)

- Ebeveyn testimonial'ları (yazı + fotoğraf + çocuk yaşı + tedavi süresi)
- Puanlama sistemi (5 yıldız)
- Video testimonial'lar
- "Deneyimini Paylaş" formu (admin onaylı)
- Filtreleme: yaş grubu, tedavi tipi, kullanım süresi

### 3.12 Nasıl Çalışır Sayfası (`/nasil-calisir`)

**Adım adım video + yazılı anlatım:**

1. **Adım: Kayıt Ol** — Ebeveyn hesap oluşturma, çocuk profili ekleme
2. **Adım: Gözlüğünü Al** — Online mağazadan gözlük sipariş et
3. **Adım: Kalibrasyon Yap** — Gözlüğüne uygun renk ve yoğunluk ayarı
4. **Adım: Oyun Oyna** — Eğlenceli dikloptik oyunlarla tedaviye başla
5. **Adım: Kitap Oku** — Stereoskopik kitaplarla hem öğren hem tedavi ol
6. **Adım: Takip Et** — İlerlemeni grafiklerle gör, AI raporunu incele

Her adımda: Kısa video (30–60 sn) + yazılı açıklama + ekran görüntüsü

### 3.13 Yardım Sayfası (`/yardim`)

- Arama çubuğu (anlık arama)
- Kategorize edilmiş SSS:
  - **Hesap:** Kayıt, şifre sıfırlama, profil düzenleme
  - **Gözlükler:** Hangi gözlüğü almalıyım, kalibrasyon sorunları
  - **Oyunlar:** Oyun açılmıyor, skor kaydedilmedi
  - **Kitaplar:** Online kitap okuma, basılı kitap sipariş
  - **Premium:** Kod aktivasyonu, plan yükseltme
  - **Teknik:** Tarayıcı uyumluluğu, PWA kurulum
  - **Ödeme:** İade politikası, kargo takibi
- Video yardım rehberleri
- "Destek Talebi Oluştur" formu
- Canlı destek entegrasyonu (opsiyonel, Faz 2)

### 3.14 SSS Sayfası (`/sss`)

En az 30 sık sorulan soru, accordion formatında:

**Örnek Sorular:**
1. Göz tembelliği nedir?
2. Bu platform kaç yaş için uygundur?
3. Hangi gözlüğü almalıyım?
4. Günde kaç dakika kullanmalıyım?
5. Premium kodumu nasıl aktif ederim?
6. Çocuğumun ilerlemesini nasıl takip ederim?
7. Doktor olarak nasıl kayıt olurum?
8. İade politikanız nedir?
9. Kitapları online okuyabilir miyim?
10. Uygulama telefonumda çalışır mı?

### 3.15 Takım Sayfası (`/ekibimiz`)

Her ekip üyesi için:
- Profil fotoğrafı
- İsim ve unvan
- Kısa biyografi
- Uzmanlık alanı
- LinkedIn / sosyal medya linki
- "Neden bu projeyi yapıyoruz?" kişisel notu

**Örnek Ekip Yapısı:**
- Kurucu / CEO
- Başhekim / Tıbbi Danışman (Göz Hastalıkları Uzmanı)
- Yazılım Geliştirme Lideri
- UI/UX Tasarımcı
- Yapay Zeka Mühendisi
- Ürün Yöneticisi
- Pazarlama Uzmanı

### 3.16 İletişim Sayfası (`/iletisim`)

- İletişim formu (isim, e-posta, konu, mesaj)
- E-posta adresi
- Telefon numarası
- Ofis adresi (Google Maps embed)
- Sosyal medya linkleri (Instagram, YouTube, Twitter/X, LinkedIn)
- Çalışma saatleri
- "Hızlı Yanıt" garantisi bilgisi

### 3.17 Hakkımızda Sayfası (`/hakkimizda`)

- Misyon ve vizyon
- Hikayemiz (neden bu projeyi başlattık)
- Değerlerimiz
- Tarihçe (timeline)
- Rakamlarla Gözmacerası (kullanıcı sayısı, oyun sayısı, kitap sayısı)
- Partnerler ve işbirlikleri

### 3.18 Gizlilik ve KVKK Sayfaları

- `/gizlilik-politikasi`
- `/kullanim-kosullari`
- `/kvkk-aydinlatma-metni`
- `/cerez-politikasi`

---

## 4. ÖZELLİK LİSTESİ (50+ ÖZELLİK)

### 4.1 Çekirdek Özellikler (Core)

| # | Özellik | Açıklama |
|---|---------|----------|
| 1 | **Dikloptik Oyun Motoru** | Kırmızı-mavi gözlükle çalışan, her göz için farklı görsel sunan oyun altyapısı |
| 2 | **Monoküler Eğitim Modu** | Ambliyopik gözün tek başına çalıştırıldığı egzersizler |
| 3 | **Stereoskopik Online Kitaplar** | Kırmızı-mavi gözlükle okunabilen çocuk kitapları, 3B derinlik efekti |
| 4 | **Çoklu Gözlük Kalibrasyonu** | Farklı gözlük renkleri ve tipleri için hassas kalibrasyon |
| 5 | **Rol Tabanlı Erişim** | Admin, doktor, ebeveyn, çocuk rolleri |
| 6 | **Premium Kod Sistemi** | 1/6/12 aylık kodlarla premium erişim aktivasyonu |
| 7 | **Yapay Zeka Asistanı** | Ebeveyn ve kullanıcılar için tedavi sorularına AI yanıtı |
| 8 | **AI Kullanım Raporu** | Kullanım verilerinden otomatik rapor üretimi |
| 9 | **Gerçek Zamanlı Kullanım Takibi** | Çocuğun sitede aktif olduğu süre ölçümü |
| 10 | **Doktor-Hasta İzleme** | Doktorun hastasının kullanımını uzaktan takibi |

### 4.2 Oyun ve İçerik Özellikleri

| # | Özellik | Açıklama |
|---|---------|----------|
| 11 | **28 Dikloptik Oyun** | 6 kategoride 28 farklı terapi oyunu |
| 12 | **Zorluk Seviyesi Adaptasyonu** | Oyunların çocuğun performansına göre otomatik zorlaşması |
| 13 | **Ödül ve Rozet Sistemi** | Başarılar için rozetler, motivasyon için puan sistemi |
| 14 | **Liderlik Tablosu** | Yaşa göre filtrelenmiş, gizlilik odaklı sıralama |
| 15 | **Online Kitap Kütüphanesi** | Kategorilere ayrılmış stereoskopik kitap koleksiyonu (klasikler) |
| 16 | **Sesli Kitap Desteği** | Kitapların sesli okuma özelliği (TTS) |
| 17 | **Çizim ve Boyama Aracı** | Stereoskopik derinlikle çizim yapma |

### 4.3 E-Ticaret Özellikleri

| # | Özellik | Açıklama |
|---|---------|----------|
| 18 | **Gözlük Satışı** | Klipsli ve normal 3D gözlükler, farklı renk kombinasyonları |
| 19 | **Çocuk Tasarım Gözlükleri** | Uzay, kelebek, robot, dinozor, araba temalı eğlenceli gözlükler |
| 20 | **Basılı 3D Kitap Satışı** | Stereoskopik baskılı, kırmızı-mavi gözlükle okunabilen fiziksel kitaplar |
| 21 | **Paket Satışları** | Gözlük + premium kod + kitap kombinasyonları |
| 22 | **Kutu İçi Premium Kodu** | Her fiziksel üründe premium aktivasyon kodu kartı |
| 23 | **Sepet ve Ödeme** | Stripe ile güvenli ödeme, çoklu ödeme yöntemi |
| 24 | **Kargo Takibi** | Sipariş sonrası kargo durumu takibi |
| 25 | **İade ve Değişim** | Kolay iade politikası |

### 4.4 Takip ve Analitik Özellikleri

| # | Özellik | Açıklama |
|---|---------|----------|
| 26 | **VA Skoru Takibi** | Görsel keskinlik skorlarının zaman içinde grafiği |
| 27 | **Stereopsis Ölçümü** | Stereo derinlik gelişim takibi |
| 28 | **Oturum Zamanlayıcı** | Günlük kullanım süresi limiti ve takibi |
| 29 | **Tedavi Uyumu Skoru** | Düzenli kullanım oranının yüzdesel gösterimi |
| 30 | **Okülomotor Metrikler** | Sakkadik latans, smooth pursuit gain ölçümü |
| 31 | **Motor Profilenci Takibi** | Motor koordinasyon ve denge gelişimi |
| 32 | **Haftalık/Aylık Raporlar** | E-posta ile otomatik gönderilen ilerleme raporları |
| 33 | **Karşılaştırmalı Analiz** | Benzer yaş grubuyla anonim karşılaştırma |

### 4.5 Sosyal ve İletişim Özellikleri

| # | Özellik | Açıklama |
|---|---------|----------|
| 34 | **Doktor-Ebeveyn Mesajlaşma** | Güvenli iç mesajlaşma sistemi |
| 35 | **Randevu Sistemi** | Online kontrol randevusu alma |
| 36 | **Bildirim Merkezi** | Hatırlatıcılar, yeni içerik, kampanya bildirimleri |
| 37 | **Ebeveyn Eğitim Modülü** | Ambliyopi hakkında bilgilendirici içerikler |
| 38 | **Blog** | SEO uyumlu, bilimsel ve eğlenceli göz sağlığı yazıları |

### 4.6 İçerik Sayfaları

| # | Özellik | Açıklama |
|---|---------|----------|
| 39 | **Bilimsel Kanıtlar Sayfası** | Doktor görüşleri, araştırma sonuçları, klinik veriler |
| 40 | **Video Sayfası** | YouTube doktor videoları, eğitim içerikleri |
| 41 | **Kullanıcı Deneyimleri** | Ebeveyn ve çocuk testimonial'ları |
| 42 | **Nasıl Çalışır Sayfası** | Adım adım video + yazılı rehber |
| 43 | **Yardım / Destek Sayfası** | Kategorize edilmiş SSS, destek formu |
| 44 | **SSS Sayfası** | 30+ sık sorulan soru, accordion formatı |
| 45 | **Takım Tanıtım Sayfası** | Ekip üyeleri, uzmanlık, motivasyon |
| 46 | **Hakkımızda Sayfası** | Misyon, vizyon, hikaye, rakamlar |
| 47 | **İletişim Sayfası** | Form, harita, sosyal medya, telefon |

### 4.7 Teknik ve Platform Özellikleri

| # | Özellik | Açıklama |
|---|---------|----------|
| 48 | **PWA Desteği** | Çevrimdışı mod, ana ekrana ekleme, push bildirimler |
| 49 | **Dark / Light / Auto Mod** | Tam tema desteği, sistem tercihini algılama |
| 50 | **Çoklu Dil Desteği** | Türkçe, İngilizce, Arapça (LTR/RTL) |
| 51 | **Erişilebilirlik** | ADA uyumlu tasarım, yüksek kontrast modu |
| 52 | **SEO Altyapısı** | Dinamik meta etiketleri, sitemap, Schema.org, Open Graph |
| 53 | **Veri Dışa Aktarma** | PDF ve CSV formatında rapor indirme |
| 54 | **API Altyapısı** | Hastane bilgi sistemleriyle entegrasyon için REST API |
| 55 | **Native Uygulama Altyapısı** | Capacitor/Tauri monorepo yapısı, Faz 2–3 için hazır |

---

## 5. 28 DİKLOPTİK OYUN LİSTESİ

Her oyun, kırmızı-mavi stereoskopik gözlükle çalışır. Bir göz nesneyi, diğer göz hedefi görür; beyin bunları birleştirmek zorunda kalır. Bu, interoküler supresyonu azaltır ve binoküler vizyonu güçlendirir.

### Kategori 1: Nesne Takibi ve Bulma (6 Oyun)

| # | Oyun Adı | Açıklama | Terapi Hedefi |
|---|----------|----------|---------------|
| 1 | **Balon Patlatma** | Kırmızı göz balonları, mavi göz iğneleri görür. Çocuk iğneyi balona yönlendirerek patlatır. | El-göz koordinasyonu, binoküler füzyon |
| 2 | **Yıldız Toplama** | Bir göz yıldızları, diğer göz yol haritasını görür. Yıldızları toplayarak karakteri yönlendirir. | Stereopsis, mekânsal farkındalık |
| 3 | **Kelebek Yakalama** | Kelebekler bir gözde, ağ diğer gözde görünür. Kelebekleri ağla yakalamak için gözleri senkronize etmek gerekir. | Pursuit (düzgün takip) hareketi |
| 4 | **Hazine Avı** | Define haritası bir gözde, hazineler diğer gözde. Haritayı takip ederek hazineyi bulma. | Derinlik algısı, planlama |
| 5 | **Uzay Macerası** | Uzay gemisi bir gözde, asteroidler diğer gözde. Asteroidlerden kaçarak yıldız toplama. | Sakkadik hareket, tepki süresi |
| 6 | **Balık Tutma** | Olta bir gözde, balıklar diğer gözde. Doğru balığı oltayla yakalama. | İnce motor kontrol, hedefleme |

### Kategori 2: Bulmaca ve Strateji (5 Oyun)

| # | Oyun Adı | Açıklama | Terapi Hedefi |
|---|----------|----------|---------------|
| 7 | **Labirent Kaçışı** | Labirent bir gözde, çıkış diğer gözde görünür. Yolu bulmak için her iki gözü birleştirmek gerekir. | Problem çözme, stereopsis |
| 8 | **Puzzle Birleştirme** | Parçalar bir gözde, boşluklar diğer gözde. Parçaları doğru yerlere yerleştirme. | Görsel-uzamsal işleme |
| 9 | **Eşleştirme Oyunu** | Kartlar bir gözde açık, diğer gözde kapalı. Eşleşen kartları bulma. | Görsel hafıza, dikkat |
| 10 | **Renk Karıştırma** | Ana renkler farklı gözlerde. Karışım sonucunu tahmin etme. | Binoküler renk füzyonu |
| 11 | **Sudoku Junior** | Sayılar bir gözde, ızgara diğer gözde. Sayıları doğru yerleştirme. | Mantıksal düşünme, dikkat |

### Kategori 3: Hız ve Reaksiyon (5 Oyun)

| # | Oyun Adı | Açıklama | Terapi Hedefi |
|---|----------|----------|---------------|
| 12 | **Fruit Ninja Stereoscopic** | Meyveler bir gözde, bıçak diğer gözde. Meyveleri kesme. | Reaksiyon hızı, sakkadik hareket |
| 13 | **Araba Yarışı** | Yol bir gözde, engeller diğer gözde. Arabayı engellerden kaçırarak yarışma. | Sürekli pursuit, tepki süresi |
| 14 | **Davul Çalma** | Davullar bir gözde, bagetler diğer gözde. Ritme uygun davul çalma. | Zamanlama, el-göz koordinasyonu |
| 15 | **Hedef Vur** | Hedefler bir gözde, nişangah diğer gözde. Hedefleri vurma. | Hassas sakkad, hedefleme |
| 16 | **Kurbağa Geçirme** | Kurbağa bir gözde, araçlar diğer gözde. Kurbağayı karşıdan karşıya geçirme. | Planlama, zamanlama |

### Kategori 4: Eğitici ve Yaratıcı (5 Oyun)

| # | Oyun Adı | Açıklama | Terapi Hedefi |
|---|----------|----------|---------------|
| 17 | **Hayvanat Bahçesi** | Hayvan isimleri bir gözde, görselleri diğer gözde. Doğru eşleme. | Görsel tanıma, kelime hazinesi |
| 18 | **Harf Avcısı** | Harfler bir gözde, kelimeler diğer gözde. Kelimeyi tamamlama. | Okuma becerisi, dikkat |
| 19 | **Sayı Sayma** | Nesneler bir gözde, sayılar diğer gözde. Doğru sayıyı seçme. | Matematiksel düşünme |
| 20 | **Resim Tamamlama** | Yarım resim bir gözde, diğer yarım diğer gözde. Resmi tamamlama. | Görsel tamamlama, bütüncül algı |
| 21 | **Müzik Notası** | Notalar bir gözde, enstrüman diğer gözde. Doğru notayı çalma. | Görsel-işitsel entegrasyon |

### Kategori 5: Fiziksel ve Denge (4 Oyun)

| # | Oyun Adı | Açıklama | Terapi Hedefi |
|---|----------|----------|---------------|
| 22 | **Trapze Ustası** | Trapze bir gözde, hedef diğer gözde. Doğru zamanda zıplama. | Derinlik algısı, zamanlama |
| 23 | **Kaykay Parkuru** | Parkur bir gözde, engeller diğer gözde. Kaykayla engellerden geçme. | Denge, koordinasyon |
| 24 | **Top Dengesi** | Top bir gözde, platform diğer gözde. Topu platformda dengeleme. | İnce motor kontrol, sabır |
| 25 | **Dans Robotu** | Dans adımları bir gözde, robot diğer gözde. Adımları taklit etme. | Ritim, motor planlama |

### Kategori 6: Bonus Oyunlar (3 Oyun)

| # | Oyun Adı | Açıklama | Terapi Hedefi |
|---|----------|----------|---------------|
| 26 | **Sualtı Dünyası** | Deniz canlıları stereoskopik derinlikle yüzer, çocuğu keşfe davet eder. | Keşif motivasyonu, sürekli kullanım |
| 27 | **Dinozor Kazısı** | Fosiller bir gözde, kazı aletleri diğer gözde. Dinozor iskeletini ortaya çıkarma. | Sabır, ince motor |
| 28 | **Uğur Böceği Bahçesi** | Bitkiler bir gözde, böcekler diğer gözde. Bahçeyi düzenleme. | Görsel planlama, yaratıcılık |

---

## 6. STEREOSKOPİK ONLINE KİTAPLAR

### Kitap Yapısı

- Her kitap 10–20 sayfadan oluşur
- Sayfalar anaglif (kırmızı-mavi / kırmızı-yeşil) stereoskopik formatta
- Metin ve görseller farklı derinlik katmanlarında render edilir
- Gözlük rengine göre otomatik kalibrasyon (kullanıcı profilinden)
- Sesli okuma seçeneği (TTS)
- Etkileşimli elementler (tıklanabilir nesneler, ses efektleri)
- Okuma ilerleme çubuğu

### Mevcut Kitaplar (gozmacerasi.com/kitap-galerisi)

Sitede mevcut olan telifsiz klasik kitaplar online stereoskopik formata dönüştürülecek:

| # | Kitap | Yazar | Kategori |
|---|-------|-------|----------|
| 1 | Alice Harikalar Diyarında | Lewis Carroll | Macera |
| 2 | Pinokyo | Carlo Collodi | Macera |
| 3 | Peter Pan | J.M. Barrie | Macera |
| 4 | Oz Büyükcüsü | L. Frank Baum | Macera |
| 5 | Küük Prens | Antoine de Saint-Exupéry | Masal |
| 6 | Alaaddin ve Sihirli Lambası | Binbir Gece | Masal |
| 7 | Sindrella | Charles Perrault | Masal |
| 8 | Pamuk Prenses ve Yedi Cüceler | Grimm Kardeşler | Masal |
| 9 | Hansel ve Gretel | Grimm Kardeşler | Masal |
| 10 | Rapunzel | Grimm Kardeşler | Masal |
| 11 | Çirkin Ördek Yavrusu | Hans Christian Andersen | Masal |
| 12 | Kibritçi Kız | Hans Christian Andersen | Masal |
| 13 | Kar Kraliçesi | Hans Christian Andersen | Masal |
| 14 | Bremen Mızıkacıları | Grimm Kardeşler | Masal |
| 15 | Kırmızı Başlıklı Kız | Grimm Kardeşler | Masal |
| 16 | Kurbağa Prens | Grimm Kardeşler | Masal |
| 17 | Uyuyan Güzel | Charles Perrault | Masal |
| 18 | Cesur Terzi | Grimm Kardeşler | Macera |
| 19 | Nasreddin Hoca Fıkraları | Halk Hikayeleri | Eğlence |
| 20 | Keloğlan Masalları | Halk Hikayeleri | Macera |

> **Not:** gozmacerasi.com/kitap-galerisi sayfasındaki tüm mevcut kitaplar bu listeye eklenecektir. Sayfa erişilemez durumda olduğu için örnekler klasik eserlerden seçilmiştir. Mevcut kitap listesi güncellenecektir.

### Kitap Kategorileri (Online)

| # | Kategori | Açıklama |
|---|----------|----------|
| 1 | **Masal Kitapları** | Klasik masalların 3B versiyonları |
| 2 | **Macera Kitapları** | İnteraktif hikâyeler, çocuk seçerek ilerler |
| 3 | **Bilim Kitapları** | Uzay, doğa, vücut hakkında stereoskopik görseller |
| 4 | **Aktivite Kitapları** | Boyama, labirent, bulmaca sayfaları |
| 5 | **Eğitici Kitapları** | Alfabe, sayılar, renkler |
| 6 | **Türk Kültür Kitapları** | Nasreddin Hoca, Keloğlan, Dede Korkut |

### 3D Stereoskopik Okuma Teknolojisi

┌──────────────────────────────────────────────────┐
│ STEREOSKOPİK OKUMA AKIŞI │
│ │
│ Kullanıcı → Kalibrasyon Profili Seçer │
│ ↓ │
│ Gözlük Tipi: Kırmızı-Mavi / Kırmızı-Yeşil │
│ ↓ │
│ Kitap Açılır → Sayfa Render Edilir │
│ ↓ │
│ Metin: Derinlik katmanı 1 (öne yakın) │
│ Görseller: Derinlik katmanı 2 (arka plan) │
│ Etkileşimli nesneler: Derinlik katmanı 3 │
│ ↓ │
│ Canvas API → Anaglif Filtre Uygulanır │
│ Sol göz (kırmızı) + Sağ göz (mavi/yeşil) │
│ ↓ │
│ Beyin → 3B derinlik algısı oluşur │
└──────────────────────────────────────────────────┘

**Teknik Detay:**
- Her sayfa Canvas üzerinde render edilir
- Görseller z-index ve perspektif CSS ile derinlik katmanlarına ayrılır
- Anaglif filtre: Kırmızı kanal sol göz, mavi/yeşil kanal sağ göz
- Kalibrasyon profili: Renk yoğunluğu, parlaklık, kontrast ayarları
- Yazılar da 3B derinlik hissi oluşturacak şekilde render edilir

---

## 7. BASILI 3D KİTAP VE GÖzlük E-TİCARET

### 7.1 Gözlük Ürün Kataloğu

#### Standart Gözlükler

| Ürün | Tip | Renk | Fiyat Aralığı | Stok Kodu |
|------|-----|------|---------------|-----------|
| Klipsli 3D Gözlük — Kırmızı/Mavi | Klipsli | RM | ₺ | GZ-KL-RM |
| Klipsli 3D Gözlük — Kırmızı/Yeşil | Klipsli | RY | ₺ | GZ-KL-RY |
| Normal 3D Gözlük — Kırmızı/Mavi | Normal | RM | ₺ | GZ-NR-RM |
| Normal 3D Gözlük — Kırmızı/Yeşil | Normal | RY | ₺ | GZ-NR-RY |

#### Çocuk Tasarım Gözlükleri

| Ürün | Şekil | Renk | Yaş Grubu | Stok Kodu |
|------|-------|------|-----------|-----------|
| Astronot Gözlüğü | Uzay/Roket | Mavi/Gümüş | 4–10 | GZ-CK-UZY |
| Kelebek Gözlüğü | Kelebek kanatları | Pembe/Mor | 4–10 | GZ-CK-KLB |
| Robot Gözlüğü | Robot yüzü | Gri/Lacivert | 5–12 | GZ-CK-RBT |
| Deniz Kızı Gözlüğü | Pullu form | Turkuaz/Altın | 4–10 | GZ-CK-DNZ |
| Dinozor Gözlüğü | T-Rex formu | Yeşil/Kahverengi | 4–10 | GZ-CK-DNZ |
| Yıldız Gözlüğü | Yıldız formu | Altın/Gümüş | 4–12 | GZ-CK-YLD |
| Araba Gözlüğü | Yarış arabası | Kırmızı/Siyah | 5–12 | GZ-CK-ARB |

> **Tüm çocuk gözlükleri** hem kırmızı-mavi hem kırmızı-yeşil lens seçeneğiyle sunulur.

### 7.2 Basılı 3D Kitap Kataloğu

Her basılı kitap:
- Özel baskı: Kırmızı-mavi / kırmızı-yeşil anaglif görseller
- Kaliteli kuşe kağıt
- Dayanıklı kapak
- İçinde premium aktivasyon kodu kartı
- Yaş grubu etiketi
- Barkod ve ISBN

| Ürün | Format | Fiyat Aralığı | Stok Kodu |
|------|--------|---------------|-----------|
| Alice Harikalar Diyarında — 3D Baskı | A4, 24 sayfa | ₺ | KT-ALC |
| Pinokyo — 3D Baskı | A4, 20 sayfa | ₺ | KT-PNK |
| Peter Pan — 3D Baskı | A4, 28 sayfa | ₺ | KT-PTP |
| Küük Prens — 3D Baskı | A4, 20 sayfa | ₺ | KT-KPR |
| Alaaddin — 3D Baskı | A4, 22 sayfa | ₺ | KT-ALD |
| Nasreddin Hoca — 3D Baskı | A4, 18 sayfa | ₺ | KT-NSR |
| Keloğlan — 3D Baskı | A4, 20 sayfa | ₺ | KT-KLG |

### 7.3 Paket Kataloğu

| Paket | İçerik | Kutu İçi Kod |
|-------|--------|-------------|
| **Başlangıç Paketi** | 1 normal 3D gözlük + 1 kitap + 1 aylık premium kod kartı | 1 aylık |
| **Aile Paketi** | 2 normal + 1 klipsli gözlük + 3 kitap + 6 aylık premium kod kartı | 6 aylık |
| **Çocuk Eğlence Paketi** | 1 temalı çocuk gözlüğü + 2 çocuk kitabı + 1 aylık premium kod kartı | 1 aylık |
| **Doktor Klinik Paketi** | 10 gözlük (karışık) + 5 kitap + 12 aylık premium kod kartı + kullanım kılavuzu | 12 aylık |
| **Okul Paketi** | 20 gözlük + 10 kitap + 12 aylık toplu premium + eğitim posteri | 12 aylık |

### 7.4 Sipariş ve Kargo Akışı

Müşteri → Ürün seçer → Sepete ekler → Ödeme (Stripe - Türkiyede çalışmıyor)
↓
Sipariş oluşturulur → Admin panele düşer
↓
Admin → Siparişi onaylar → Kargoya verir
↓
Kargo takip numarası müşteriye e-posta ile gönderilir
↓
Müşteri → Dashboard > Siparişlerim > Kargo Takibi
↓
Teslim → Kutu içinde premium kod kartı → Kodu platforma girer → Premium aktif

---

## 8. GELİŞTİRME SÜREÇ PLANI (17 GÜN: 4 MAYIS — 21 MAYIS)

### Faz 0: Hazırlık (4–5 Mayıs) — 2 Gün

| Gün | Görev | Detay |
|-----|-------|-------|
| 4 Mayıs | Proje iskeleti kurulumu | Next.js 14, PostgreSQL, Redis, Prisma schema, Turborepo yapısı |
| 4 Mayıs | UI/UX wireframe | Figma'da tüm sayfaların düşük detaylı çizimi (25+ sayfa) |
| 5 Mayıs | Veritabanı şeması | Kullanıcı, oyun, kitap, abonelik, kullanım, sipariş, blog tabloları |
| 5 Mayıs | Auth sistemi + tema + dil | NextAuth.js, next-themes (dark/light), next-intl (TR/EN) |

### Faz 1: Çekirdek Altyapı (6–9 Mayıs) — 4 Gün

| Gün | Görev | Detay |
|-----|-------|-------|
| 6 Mayıs | Admin paneli iskeleti | Dashboard layout, kullanıcı CRUD, navigasyon, tema desteği |
| 7 Mayıs | Ebeveyn paneli iskeleti | Dashboard layout, çocuk profili oluşturma, dark/light mod |
| 8 Mayıs | Doktor paneli iskeleti | Hasta listesi, hasta detay sayfası, mesajlaşma |
| 9 Mayıs | Premium kod sistemi | Kod üretme (admin), doğrulama, aktivasyon akışı |

### Faz 2: Oyun Motoru ve İçerik (10–13 Mayıs) — 4 Gün

| Gün | Görev | Detay |
|-----|-------|-------|
| 10 Mayıs | Dikloptik oyun motoru | PixiJS tabanlı, kırmızı-mavi/yeşil gözlük render sistemi |
| 11 Mayıs | Kalibrasyon sayfası | Gözlük tipi, rengi, yoğunluk, parlaklık ayarları |
| 11 Mayıs | 5 oyun geliştirme | Balon Patlatma, Yıldız Toplama, Kelebek Yakalama, Labirent, Eşleştirme |
| 12 Mayıs | 5 oyun geliştirme | Fruit Ninja, Araba Yarışı, Hedef Vur, Puzzle, Harf Avcısı |
| 13 Mayıs | 5 oyun geliştirme + Kitap motoru | Kurbağa Geçirme, Hayvanat Bahçesi, Resim Tamamlama, Top Dengesi, Dans Robotu + Stereoskopik kitap okuyucu |

### Faz 3: Kitaplar, Blog ve İçerik Sayfaları (14–15 Mayıs) — 2 Gün

| Gün | Görev | Detay |
|-----|-------|-------|
| 14 Mayıs | Kitap okuyucu + 5 online kitap | Stereoskopik sayfa render, sesli okuma, mevcut klasik kitaplar |
| 14 Mayıs | Blog altyapısı | Admin panelinden blog yazısı ekleme, SEO meta etiketleri, kategori |
| 15 Mayıs | İçerik sayfaları | Bilimsel kanıtlar, Nasıl çalışır, SSS, Takım, Hakkımızda, İletişim, Video sayfası, Kullanıcı deneyimleri, Yardım |
| 15 Mayıs | E-ticaret ürün sayfaları | Gözlük, kitap, paket ürün kartları, sepet yapısı |

### Faz 4: AI, Analitik ve E-Ticaret (16–17 Mayıs) — 2 Gün

| Gün | Görev | Detay |
|-----|-------|-------|
| 16 Mayıs | AI asistan + kullanım takibi | OpenAI API, sohbet arayüzü, oturum süresi ölçümü |
| 16 Mayıs | AI rapor üretimi | Kullanım verilerinden otomatik rapor, PDF export |
| 17 Mayıs | Doktor izleme paneli | Gerçek zamanlı hasta aktivite görünümü |
| 17 Mayıs | Stripe + kargo entegrasyonu | Ödeme akışı, sipariş yönetimi, kargo takibi |

### Faz 5: PWA ve Entegrasyonlar (18–19 Mayıs) — 2 Gün

| Gün | Görev | Detay |
|-----|-------|-------|
| 18 Mayıs | PWA kurulumu | Service worker, manifest.json, offline mod, push bildirimler |
| 18 Mayıs | Bildirim sistemi | E-posta şablonları, hatırlatıcılar, premium bitiş uyarısı |
| 19 Mayıs | SEO optimizasyonu | Dinamik meta etiketleri, sitemap.xml, Schema.org, Open Graph, robots.txt |
| 19 Mayıs | Çoklu dil finalizasyonu | Arapça RTL desteği, tüm sayfa çevirileri |

### Faz 6: Test ve Lansman (20–21 Mayıs) — 2 Gün

| Gün | Görev | Detay |
|-----|-------|-------|
| 20 Mayıs | Kapsamlı test | Tüm akışlar, cross-browser, mobil uyumluluk, PWA testi, tema testi |
| 20 Mayıs | Performans optimizasyonu | Lighthouse skoru >90, yükleme hızı <2s, image optimization |
| 21 Mayıs | Deploy ve sunum hazırlığı | Production deploy, demo verileri, yatırımcı sunum materyalleri |

---

## 9. VERİTABANI ŞEMASI

### Ana Tablolar

┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ users │ │ children │ │ doctors │
│─────────────│ │─────────────│ │─────────────│
│ id │────▶│ id │ │ id │
│ email │ │ parent_id │◀────│ user_id │
│ role │ │ name │ │ clinic_name │
│ created_at │ │ age │ │ license_no │
│ theme_pref │ │ condition │ │ specialty │
│ lang_pref │ │ va_score │ │ video_url │
└─────────────┘ │ doctor_id │ │ bio │
└─────────────┘ └─────────────┘
│
┌──────────────────┼──────────────────┐
▼ ▼ ▼
┌─────────────┐ ┌──────────────┐ ┌──────────────┐
│game_sessions │ │calibrations │ │subscriptions │
│─────────────│ │──────────────│ │──────────────│
│ id │ │ id │ │ id │
│ child_id │ │ child_id │ │ child_id │
│ game_id │ │ glass_type │ │ plan_type │
│ score │ │ glass_color │ │ code │
│ duration_sec │ │ intensity │ │ expires_at │
│ completed_at │ │ brightness │ │ status │
└─────────────┘ │ contrast │ └──────────────┘
└──────────────┘

### Tüm Tablolar

| Tablo | Açıklama |
|-------|----------|
| `users` | Tüm kullanıcılar (ebeveyn, doktor, admin) |
| `children` | Çocuk profilleri, ebeveyn ve doktor ilişkisi |
| `doctors` | Doktor profilleri, klinik bilgileri |
| `games` | Oyun metadata, zorluk seviyeleri, kategori |
| `game_sessions` | Her oyun oturumunun detayı |
| `badges` | Rozet tanımları |
| `child_badges` | Çocuğun kazandığı rozetler |
| `online_books` | Online kitap metadata |
| `online_book_pages` | Her sayfanın stereoskopik içeriği |
| `reading_sessions` | Kitap okuma oturumları |
| `calibrations` | Gözlük kalibrasyon profilleri |
| `subscriptions` | Premium abonelik kayıtları |
| `premium_codes` | Üretilen premium kodlar |
| `products` | Fiziksel ürünler (gözlük, kitap, paket) |
| `product_variants` | Ürün varyantları (renk, tip, boyut) |
| `orders` | Siparişler |
| `order_items` | Sipariş kalemleri |
| `shipments` | Kargo takibi |
| `blog_posts` | Blog yazıları |
| `blog_categories` | Blog kategorileri |
| `videos` | Video metadata (YouTube ID, kategori) |
| `testimonials` | Kullanıcı deneyimleri / yorumlar |
| `faq_items` | SSS soruları ve yanıtları |
| `team_members` | Ekip üyeleri |
| `pages` | Statik sayfa içerikleri (Hakkında, Nasıl Çalışır, vb.) |
| `messages` | Doktor-ebeveyn mesajlaşma |
| `appointments` | Randevu kayıtları |
| `notifications` | Bildirim kuyruğu |
| `ai_conversations` | AI sohbet geçmişi |
| `ai_reports` | Üretilen AI raporları |
| `activity_logs` | Tüm kullanıcı aktivite logları |
| `doctor_prescriptions` | Doktor reçeteleri (hangi oyunlar, sıklık) |
| `support_tickets` | Destek talepleri |
| `site_settings` | Sistem ayarları |

---

## 10. PREMIUM KOD SİSTEMİ DETAYI

### Kod Üretme Akışı (Admin Paneli)

1. Admin → "Yeni Kod Oluştur" butonuna tıklar
2. Plan seçimi: **1 Ay** / **6 Ay** / **1 Yıl**
3. Miktar belirleme (1–1000 arası toplu üretim)
4. Kaynak seçimi: **Manuel satış** / **Kutu içi** / **Promosyon**
5. Son kullanma tarihi (opsiyonel)
6. "Oluştur" → Sistem benzersiz kodlar üretir (örn: `GÖZ-XXXX-XXXX-XXXX`)
7. Kodlar CSV olarak dışa aktarılabilir
8. Her kod tek kullanımlıktır

### Kod Aktivasyon Akışı (Ebeveyn)

1. Ebeveyn → Abonelik sayfası → "Kod Gir" butonu
2. Kodu girer → Sistem doğrular
3. Doğrulama başarılı → Premium özellikler açılır
4. Abonelik bitiş tarihi otomatik hesaplanır
5. Bitiş tarihinden 3 gün önce hatırlatma e-postası

### Abonelik Planları

| Plan | Süre | İçerik | Kutu İçi |
|------|------|--------|----------|
| **Ücretsiz** | Süresiz | 5 oyun, 1 kitap, temel kalibrasyon | — |
| **Premium 1 Ay** | 30 gün | Tüm oyunlar, tüm kitaplar, AI asistan, detaylı raporlar | Başlangıç ve Çocuk paketlerinde |
| **Premium 6 Ay** | 180 gün | Premium 1 Ay + %20 indirim, öncelikli destek | Aile paketinde |
| **Premium 1 Yıl** | 365 gün | Premium 6 Ay + %35 indirim, özel rozetler, erken erişim | Doktor ve Okul paketlerinde |

---

## 11. YAPAY ZEKA MODÜLLERİ DETAYI

### 11.1 AI Sohbet Asistanı

**Kullanıcı Profili:** Ebeveynler ve 12+ yaş çocuklar

**Sistem Promptu:**

Sen Gözmacerası'nın yapay zeka asistanısın. Göz sağlığı, ambliyopi
tedavisi, şaşılık ve çocuk gelişimi konularında uzmanlaşmış bir
sanal danışmansın. Yanıtlarını bilimsel araştırmalara dayandır,
ancak anlaşılır bir dil kullan. Tıbbi teşhis koyma, her zaman bir
göz doktoruna başvurmayı öner.

**Özellikler:**
- Çoklu dil desteği (TR/EN)
- Bağlam farkındalığı (çocuğun mevcut durumunu bilir)
- Tedavi önerileri (genel, spesifik değil)
- SSS otomatik yanıtlama
- Sohbet geçmişi kaydı

### 11.2 AI Kullanım Raporu

**Veri Kaynakları:**
- Oyun oturum süreleri ve skorları
- Kitap okuma süreleri
- Haftalık giriş sıklığı
- VA skoru trendi (varsa)
- Tedavi uyumu yüzdesi

**Rapor Formatı Örneği:**

📊 GÖZMACERASI HAFTALIK RAPOR
═══════════════════════════════
Çocuk: [İsim] | Hafta: [Tarih Aralığı]


🎮 Oyun Aktivitesi
• Toplam süre: 2 saat 15 dakika
• Oyun sayısı: 8 farklı oyun
• Ortalama skor artışı: %12


📖 Kitap Aktivitesi
• Okunan kitap: 3
• Toplam okuma süresi: 45 dakika


📈 İlerleme Trendi
• Stereopsis: Gelişme gösteriyor ↑
• Dikkat süresi: Sabit →


🤖 AI Önerileri
• "Balon Patlatma" oyununda zorluk seviyesini
artırmayı deneyebilirsiniz.
• Haftada en az 5 gün, günde 20 dakika
kullanım önerilmektedir.

---

## 12. AMBLYOPLAY'DEN ALINAN VE EKLENEN ÖZELLİKLER

| AmblyoPlay Özelliği | Gözmacerası İyileştirmesi |
|---------------------|---------------------------|
| 20 dk/gün gamified terapi | + Esnek süre (10–30 dk), ebeveyn kontrolü |
| Görsel keskinlik takibi | + Stereopsis, okülomotor, motor profilenci takibi |
| Anizometropik ambliyopi odaklı | + Şaşılık ambliyopisi desteği (dikloptik eğitim) |
| Uygulama tabanlı | + Web + PWA + Native (planlı) |
| Standart oyun seti | + 28 oyun, zorluk adaptasyonu, AI önerileri |
| Temel raporlama | + AI destekli detaylı rapor, doktor paneli |
| Tek dil desteği | + Çoklu dil (TR/EN/AR) |
| Yok | + Online stereoskopik kütüphane (klasikler) |
| Yok | + Basılı 3D kitap satışı |
| Yok | + Gözlük e-ticaret (klipsli, normal, çocuk tasarımları) |
| Yok | + Paket satışları (gözlük + kitap + premium kod) |
| Yok | + Şaşılık tarama modülü (göz takibi) |
| Yok | + Dark/Light/Auto tema |
| Yok | + Blog, video, bilimsel kanıtlar sayfası |
| Yok | + PWA ve native uygulama altyapısı |
| Yok | + SEO optimizasyonu |

---

## 13. PWA VE PLATFORM STRATEJİSİ

### 13.1 PWA (21 Mayıs — Faz 1)

| Özellik | Durum |
|---------|-------|
| Service Worker | ✅ Offline oyunlar, önbelleğe alma |
| Web App Manifest | ✅ Ana ekrana ekleme, splash screen |
| Push Notifications | ✅ Hatırlatıcılar, yeni içerik bildirimleri |
| Offline Mod | ✅ 5 oyun + 1 kitap çevrimdışı çalışır |
| Responsive Design | ✅ Mobil, tablet, masaüstü uyumlu |
| Install Prompt | ✅ "Uygulamayı Yükle" banner |

### 13.2 Native Uygulamalar (Faz 2–3)

┌─────────────────────────────────────────┐
│ TURBOREPO MONOREPO │
│ │
│ packages/ │
│ ├── shared/ ← Paylaşılan kod │
│ │ ├── game-engine/ ← PixiJS motoru │
│ │ ├── api-client/ ← API istemcisi │
│ │ ├── ui/ ← Bileşenler │
│ │ └── utils/ ← Yardımcılar │
│ │ │
│ ├── web/ ← Next.js (PWA) │
│ ├── mobile/ ← React Native │
│ ├── desktop/ ← Tauri │
│ └── admin/ ← Admin panel │
└─────────────────────────────────────────┘

| Platform | Teknoloji | Hedef Tarih | Durum |
|----------|-----------|-------------|-------|
| **Web + PWA** | Next.js + next-pwa | 21 Mayıs 2026 | MVP |
| **Android** | React Native / Capacitor | Ağustos 2026 | Planlandı |
| **iOS** | React Native / Capacitor | Ağustos 2026 | Planlandı |
| **Windows** | Tauri | Ekim 2026 | Planlandı |
| **Linux** | Tauri | Ekim 2026 | Planlandı |

> **Not:** Altyapı (Turborepo, paylaşılan kod, API yapısı) 21 Mayıs'a kadar hazır olacak. Native uygulamalar bu altyapı üzerine inşa edilecek.

---

## 14. YATIRIMCI SUNUMU İÇİN KRİTİK METRİKLER

1. **Pazar Büyüklüğü:** Global abonelik ekonomisinin 2028'de yaklaşık 1 trilyon dolara ulaşması bekleniyor
2. **Klinik Kanıt:** Dikloptik eğitimin şaşılıkta 0.201 logMAR iyileşme sağlaması
3. **Çocuk Etkileşimi:** Gamified terapinin geleneksel oklüzyona kıyasla yüksek uyum oranı
4. **Çoklu Gelir Akışı:** Premium abonelik + fiziksel ürün satışı (gözlük, kitap, paket)
5. **Ölçeklenebilirlik:** Düşük marjinal maliyet, dijital teslimat, stoksuz satış potansiyeli
6. **Tekrarlayan Gelir:** Premium abonelik modeli, 1/6/12 aylık planlar
7. **Platform Çeşitliliği:** Web → PWA → Native mobil → Masaüstü
8. **Veri Avantajı:** Klinik veri birikimi, AI destekli kişiselleştirme
9. **İçerik Gücü:** 20+ telifsiz klasik kitap, 28 oyun, blog, video
10. **Hedef Kitle:** Türkiye'de 0–14 yaş grubunda ~12 milyon çocuk, ambliyopi prevalansı %1–5

---

## 15. RİSKLER VE AZALTMA STRATEJİLERİ

| Risk | Olasılık | Azaltma |
|------|----------|---------|
| 17 günde tamamlanamama | Yüksek | MVP yaklaşımı: öncelikli 15 oyun, temel özellikler, 5 kitap |
| Stripe entegrasyonu gecikmesi | Orta | Manuel kod aktivasyonu yedek planı |
| Oyun motoru performans sorunları | Orta | PixiJS optimizasyonu, lazy loading |
| AI API maliyetleri | Düşük | Rate limiting, caching, yerel LLM alternatifi |
| Gözlük kalibrasyon tutarsızlığı | Düşük | Kapsamlı test, kullanıcı geri bildirimi |
| Kitap telif sorunu | Düşük | Sadece public domain klasikler |
| Kargo lojistik sorunları | Orta | Birden fazla kargo firması ile anlaşma |
| PWA çevrimdışı senkronizasyon | Düşük | Service worker stratejileri, queue mekanizması |
| Arapça RTL layout sorunları | Düşük | next-intl + Tailwind RTL plugin |

---

## 16. LANSMAN SONRASI YOL HARİTASI

| Zaman Dilimi | Hedef |
|-------------|-------|
| **Haziran 2026** | 10 ek oyun, 5 ek online kitap, blog içerik üretimi |
| **Temmuz 2026** | Tobii/Gazepoint göz takibi entegrasyonu, şaşılık tarama modülü |
| **Ağustos 2026** | Android + iOS native uygulama lansmanı (React Native / Capacitor) |
| **Eylül 2026** | Hastane Bilgi Sistemi API entegrasyonu, kurumsal satışlar |
| **Ekim 2026** | Windows + Linux masaüstü uygulamaları (Tauri) |
| **Kasım 2026** | Klinik çalışma başlatma, akademik işbirlikleri |
| **Aralık 2026** | Uluslararası pazar açılımı (İngilizce tam destek) |
| **2027 Q1** | VR gözlük desteği (Meta Quest), artırılmış gerçeklik egzersizleri |
| **2027 Q2** | Yapay zeka tabanlı kişiselleştirilmiş tedavi protokolü |

---

## 17. TAKIM VE GÖREV DAĞILIMI (ÖNERİ)

| Rol | Kişi Sayısı | Sorumluluk |
|-----|-------------|------------|
| Full-Stack Developer | 2 | Next.js, NestJS, veritabanı, PWA |
| Frontend / Oyun Developer | 1 | PixiJS oyunları, stereoskopik render, Canvas |
| UI/UX Designer | 1 | Figma, çocuk dostu arayüz, tema tasarımı |
| E-Ticaret Uzmanı | 1 (part-time) | Ürün yönetimi, kargo, stok |
| AI/ML Engineer | 1 | OpenAI entegrasyonu, rapor üretimi |
| İçerik Uzmanı | 1 (part-time) | Blog, kitap dönüştürme, SEO |
| DevOps | 1 (part-time) | CI/CD, deploy, monitoring |
| Proje Yöneticisi | 1 | Takip, koordinasyon, yatırımcı sunumu |

**Not:** Küçük ekiplerde roller birleştirilebilir. 3–4 kişilik bir çekirdek ekip ile MVP çıkarılabilir.

---

## 18. SAYFA HARİTASI (SITEMAP)

gozmacerasi.com
├── / (Ana Sayfa)
├── /nasil-calisir (Nasıl Çalışır)
├── /bilimsel-kanitlar (Bilimsel Kanıtlar)
├── /videolar (Video Sayfası)
├── /deneyimler (Kullanıcı Deneyimleri)
├── /blog (Blog Ana Sayfa)
│ └── /blog/[slug] (Blog Yazısı)
├── /sss (Sıkça Sorulan Sorular)
├── /ekibimiz (Ekibimiz)
├── /hakkimizda (Hakkımızda)
├── /iletisim (İletişim)
├── /yardim (Yardım)
├── /urunler
│ ├── /urunler/gozlukler (Gözlük Satış)
│ ├── /urunler/kitaplar (Basılı 3D Kitaplar)
│ └── /urunler/paketler (Paket Satışları)
├── /auth
│ ├── /auth/giris (Giriş)
│ ├── /auth/kayit (Kayıt)
│ └── /auth/admin (Admin Girişi)
├── /calibration (Gözlük Kalibrasyonu)
├── /dashboard
│ ├── /dashboard/parent (Ebeveyn Paneli)
│ │ ├── /dashboard/parent/oyunlar
│ │ ├── /dashboard/parent/kitaplar
│ │ ├── /dashboard/parent/raporlar
│ │ ├── /dashboard/parent/ai
│ │ ├── /dashboard/parent/siparislerim
│ │ ├── /dashboard/parent/abonelik
│ │ └── /dashboard/parent/ayarlar
│ ├── /dashboard/doctor (Doktor Paneli)
│ │ ├── /dashboard/doctor/hastalar
│ │ ├── /dashboard/doctor/hasta/[id]
│ │ ├── /dashboard/doctor/raporlar
│ │ ├── /dashboard/doctor/recete
│ │ ├── /dashboard/doctor/mesajlar
│ │ ├── /dashboard/doctor/randevular
│ │ └── /dashboard/doctor/ayarlar
│ └── /dashboard/admin (Admin Paneli)
│ ├── /dashboard/admin/kullanicilar
│ ├── /dashboard/admin/oyunlar
│ ├── /dashboard/admin/online-kitaplar
│ ├── /dashboard/admin/basili-kitaplar
│ ├── /dashboard/admin/gozlukler
│ ├── /dashboard/admin/paketler
│ ├── /dashboard/admin/siparisler
│ ├── /dashboard/admin/premium-kodlar
│ ├── /dashboard/admin/blog
│ ├── /dashboard/admin/videolar
│ ├── /dashboard/admin/icerik
│ ├── /dashboard/admin/raporlar
│ └── /dashboard/admin/ayarlar
├── /gizlilik-politikasi (Gizlilik)
├── /kullanim-kosullari (Kullanım Koşulları)
├── /kvkk-aydinlatma-metni (KVKK)
└── /cerez-politikasi (Çerez Politikası)

---

*Bu plan, 21 Mayıs yatırımcı sunumuna kadar çalışan bir MVP (Minimum Viable Product) ortaya koymayı hedefler. 17 günlük sıkışık takvimde "önce çekirdek, sonra cilalama" prensibiyle hareket edilmelidir. Altyapı, native uygulama ve platform genişlemesine hazır şekilde tasarlanmıştır.*
