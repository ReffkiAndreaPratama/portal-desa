# 🌿 Portal Digital Desa Talang Marap — Versi Full Stack

> Website profil desa + sistem informasi sampah SiTARA + admin panel CRUD lengkap.
> Dibangun dengan React + Vite + Supabase. Deploy ke Vercel dalam 5 menit.

---

## 🏆 Tentang Project

**Nama Proker KKN:** Portal Digital Desa dan Sistem Informasi Sampah Talang Marap (SiTARA)

**KKN:** Universitas Bengkulu — Periode 108 — Kelompok 146

**Desa:** Talang Marap, Kec. Ulu Manna, Kab. Bengkulu Selatan, Provinsi Bengkulu

---

## 📁 Struktur Project

```
portal-desa/
├── src/
│   ├── pages/              ← 14 halaman publik
│   ├── admin/
│   │   ├── pages/          ← 17 halaman admin CRUD
│   │   ├── layout/         ← Sidebar + topbar admin
│   │   └── components/     ← CrudTable, Modal, FormField
│   ├── components/
│   │   ├── layout/         ← Navbar, Footer
│   │   └── common/         ← SearchModal, Chatbot, BackToTop, Skeleton
│   ├── lib/
│   │   ├── supabase.ts     ← Supabase client + types
│   │   └── db.ts           ← Database abstraction layer
│   ├── hooks/
│   │   └── useDB.ts        ← Custom hook untuk fetch data
│   ├── context/
│   │   └── AppContext.tsx  ← Dark mode, language, search
│   └── data/
│       └── desaData.ts     ← Data fallback (mode lokal)
├── supabase/
│   └── schema.sql          ← SQL lengkap untuk Supabase
├── .env.example            ← Template environment variables
├── DEPLOYMENT.md           ← Panduan deploy detail
├── vercel.json             ← Config untuk Vercel SPA routing
└── README.md               ← Panduan ini
```

---

## ✨ Fitur Lengkap

### Website Publik (14 Halaman)

| Halaman | Fitur |
|---|---|
| **Beranda** | Hero slideshow, statistik, marquee info, quick access, berita, wisata, SiTARA, KKN, agenda |
| **Profil Desa** | Sejarah timeline, visi misi, perangkat desa (dari DB), demografi chart interaktif |
| **Berita** | Portal berita, kategori filter, search, detail berita, share WA/FB/Twitter |
| **Wisata** | 4 destinasi, rating, fasilitas, itinerary sehari, link maps |
| **UMKM** | Marketplace, filter kategori, pesan via WhatsApp langsung |
| **SiTARA** | Dashboard sampah (dari DB), bank sampah, leaderboard, jadwal angkut, edukasi, lapor sampah |
| **KKN** | Informasi KKN, meet the team, program kerja + progress tracker |
| **Galeri** | Grid foto, filter kategori, lightbox + navigasi prev/next |
| **Kontak** | Info desa, form kirim pesan (masuk ke inbox admin) |
| **Aspirasi** | Form submit ke DB, tampil balasan dari admin |
| **Dokumen** | Arsip dokumen desa, download link |
| **Kalender** | Kalender visual + agenda mendatang dari DB |
| **Peta** | Layer interaktif, batas wilayah, fasilitas umum |
| **Statistik** | Chart tren tahunan dari DB, demografi, data sampah |

### Admin Panel (17 Menu CRUD)

| Menu | Operasi |
|---|---|
| Dashboard | Statistik real-time, aspirasi terbaru, quick actions |
| Berita | Create, Read, Update, Delete + Publish/Draft |
| Wisata | CRUD lengkap + foto, rating, fasilitas |
| UMKM | CRUD + stok, harga, kontak WA |
| Galeri | CRUD + preview gambar |
| Perangkat Desa | CRUD + urutan tampil |
| Agenda/Kalender | CRUD + kategori |
| Dokumen | CRUD + upload link |
| Statistik Tahunan | CRUD → tampil di grafik tren |
| Anggota KKN | CRUD + foto auto-generate |
| Program Kerja | CRUD + progress bar + ikon emoji |
| Aspirasi | Baca + balas + update status (Diterima/Diproses/Selesai) |
| Bank Sampah | Daftar nasabah + catat setoran + hitung poin otomatis |
| Laporan Sampah | Tindak lanjut + update status |
| **Data Sampah Bulanan** | Input data → tampil di SiTARA Dashboard |
| **Pesan Kontak** | Inbox + tandai dibaca + balas via email |
| Pengaturan Desa | Edit semua info desa (nama, kontak, sosmed, statistik) |

### Fitur Pendukung

- 🔍 **Search Global** (Ctrl+K) — cari berita, wisata, UMKM, halaman
- 🌙 **Dark Mode** — toggle + tersimpan localStorage
- 🤖 **Chatbot FAQ** — asisten desa berbasis keyword
- ⬆️ **Back to Top** — smooth scroll
- 💀 **Skeleton Loading** — semua halaman punya loading state
- 🔔 **Toast Notifikasi** — semua form submit
- 🔐 **Auth Admin** — login/logout dengan Supabase Auth
- 📱 **Responsive** — mobile first design
- 🌐 **Deploy-ready** — Vercel + Supabase

---

## 🔧 Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Charts | Recharts |
| Routing | React Router DOM v7 |
| Backend/DB | Supabase (PostgreSQL + Auth + Storage) |
| Toast | React Hot Toast |
| Deploy | Vercel |

---

## 🚀 Cara Deploy

### Pilih Backend Dulu

Edit file `.env`:

```env
# Untuk development lokal (tanpa DB)
VITE_DB_PROVIDER=local

# Untuk production (dengan Supabase)
VITE_DB_PROVIDER=supabase
```

---

### 🗄️ Tahap 1 — Setup Supabase (5 menit)

1. Daftar gratis di **[supabase.com](https://supabase.com)**
2. Klik **New Project** → isi nama, password, pilih region **Singapore**
3. Tunggu project selesai (~2 menit)
4. Masuk ke **SQL Editor** → **New Query**
5. Copy-paste seluruh isi file `supabase/schema.sql` → klik **Run**
6. Masuk ke **Storage** → **New Bucket**
   - Nama: `desa-assets`
   - Centang ✅ **Public bucket** → Save
7. Masuk ke **Authentication** → **Users** → **Add User**
   - Email: `admin@desatalangmarap.id` (atau email lain)
   - Password: buat yang kuat
8. Masuk ke **Project Settings** → **API** → copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

---

### ▲ Tahap 2 — Deploy ke Vercel (3 menit)

**Langkah A — Push ke GitHub:**

```bash
cd "D:\project\profil desa\portal-desa"
git init
git add .
git commit -m "Portal Digital Desa Talang Marap"
git branch -M main
git remote add origin https://github.com/username/portal-desa-talang-marap.git
git push -u origin main
```

**Langkah B — Deploy di Vercel:**

1. Buka **[vercel.com](https://vercel.com)** → Sign in with GitHub
2. Klik **New Project** → Import repository yang tadi di-push
3. Di bagian **Environment Variables**, tambahkan:

| Key | Value |
|---|---|
| `VITE_DB_PROVIDER` | `supabase` |
| `VITE_SUPABASE_URL` | URL dari Supabase Settings |
| `VITE_SUPABASE_ANON_KEY` | Anon key dari Supabase Settings |
| `VITE_STORAGE_BUCKET` | `desa-assets` |

4. Klik **Deploy** → tunggu ~2 menit
5. 🎉 Website live! URL otomatis seperti `portal-desa-talang-marap.vercel.app`

**Langkah C — Akses Admin:**
```
https://your-domain.vercel.app/admin
```
Login dengan email + password yang dibuat di Supabase Auth.

---

### 🔄 Update Konten Setelah Deploy

1. Edit file di lokal
2. `git add . && git commit -m "update konten" && git push`
3. Vercel otomatis redeploy dalam ~1 menit

---

### 🌐 Custom Domain (Opsional)

1. Di Vercel → Project Settings → **Domains**
2. Tambahkan domain seperti `desatalangmarap.id`
3. Update DNS di registrar domain sesuai instruksi Vercel
4. SSL otomatis aktif

---

## 💻 Development Lokal

```bash
# Clone atau download project
cd portal-desa

# Install dependencies
npm install

# Copy env dan isi sesuai kebutuhan
cp .env.example .env

# Jalankan dev server
npm run dev

# Buka http://localhost:5173
```

**Login admin lokal:**
- Email: `admin@desa.id`
- Password: `admin123`

---

## 🗺️ Peta Halaman

```
/ (Beranda)
├── /profil
│   ├── /profil/sejarah
│   ├── /profil/visi-misi
│   ├── /profil/perangkat
│   └── /profil/demografi
├── /berita
│   └── /berita/:id
├── /wisata
├── /umkm
├── /sitara
│   ├── /sitara/bank-sampah
│   ├── /sitara/jadwal
│   ├── /sitara/edukasi
│   └── /sitara/laporan
├── /kkn
│   ├── /kkn/tim
│   ├── /kkn/proker
│   └── /kkn/dokumentasi
├── /galeri
├── /kontak
├── /aspirasi
├── /dokumen
├── /data
├── /peta
├── /kalender
└── /admin (Admin Panel)
    ├── /admin/dashboard
    ├── /admin/berita
    ├── /admin/wisata
    ├── /admin/umkm
    ├── /admin/galeri
    ├── /admin/perangkat
    ├── /admin/agenda
    ├── /admin/aspirasi
    ├── /admin/bank-sampah
    ├── /admin/laporan-sampah
    ├── /admin/data-sampah
    ├── /admin/pesan-kontak
    ├── /admin/kkn-anggota
    ├── /admin/kkn-proker
    ├── /admin/dokumen
    ├── /admin/statistik
    └── /admin/pengaturan
```

---

## 🗃️ Skema Database

Database menggunakan **Supabase (PostgreSQL)** dengan 16 tabel:

| Tabel | Keterangan |
|---|---|
| `pengaturan` | Konfigurasi global desa (key-value) |
| `berita` | Artikel berita desa |
| `wisata` | Destinasi wisata |
| `umkm` | Produk UMKM |
| `galeri` | Foto galeri |
| `perangkat_desa` | Struktur perangkat desa |
| `anggota_kkn` | Anggota tim KKN |
| `program_kerja` | Program kerja KKN |
| `agenda` | Agenda dan kalender desa |
| `aspirasi` | Aspirasi masyarakat |
| `laporan_sampah` | Laporan sampah ilegal |
| `bank_sampah_nasabah` | Nasabah bank sampah |
| `bank_sampah_setor` | Riwayat setoran bank sampah |
| `dokumen` | Arsip dokumen desa |
| `statistik_desa` | Data statistik tahunan |
| `data_sampah` | Data sampah bulanan (SiTARA) |
| `pesan_kontak` | Inbox pesan dari form kontak |

Semua tabel dilindungi **Row Level Security (RLS)**:
- Publik: hanya bisa READ
- Warga: bisa INSERT aspirasi, laporan, pesan kontak
- Admin (authenticated): akses penuh CREATE/UPDATE/DELETE

---

## ❓ Troubleshooting

**Login admin gagal**
→ Pastikan email sudah terdaftar di Supabase Auth
→ Cek `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` sudah benar

**Data tidak muncul di website**
→ Pastikan SQL schema sudah dijalankan
→ Cek RLS policies sudah aktif
→ Masuk admin panel dan input data

**Upload foto gagal**
→ Pastikan bucket `desa-assets` sudah dibuat dan berstatus **Public**
→ Cek nama bucket di `VITE_STORAGE_BUCKET`

**Error CORS saat deploy**
→ Di Supabase → Authentication → URL Configuration
→ Tambahkan domain Vercel ke **Site URL** dan **Redirect URLs**

**Halaman 404 setelah refresh di Vercel**
→ Pastikan file `vercel.json` ada dan berisi rewrite rules (sudah ada di project)

---

## 📋 Checklist Sebelum Deploy

- [ ] Ganti data desa di `src/data/desaData.ts`
- [ ] Ganti nomor WhatsApp desa
- [ ] Ganti email desa
- [ ] Setup Supabase (jalankan schema.sql)
- [ ] Buat akun admin di Supabase Auth
- [ ] Set env variables di Vercel
- [ ] Input data awal via admin panel (berita, wisata, UMKM, perangkat, dll)
- [ ] Test semua halaman dan form

---

## 🔗 Link Terkait

- **Versi Static** (tanpa DB): folder `portal-desa-talang-marap`
- **Panduan deploy detail**: file `DEPLOYMENT.md`
- **Schema database**: file `supabase/schema.sql`
- **Env template**: file `.env.example`

---

## 📄 Lisensi

MIT License — Bebas digunakan, dimodifikasi, dan didistribusikan.

---

*© 2025 Portal Digital Desa Talang Marap*
*Dibuat dengan 💚 oleh KKN Universitas Bengkulu — Periode 108 — Kelompok 146*
