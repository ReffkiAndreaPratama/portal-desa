# 🚀 Panduan Deploy Portal Digital Desa Talang Marap

## PILIH BACKEND

### Option A — MODE LOKAL (Development)
Tidak perlu setup apapun. Langsung jalan.
```
VITE_DB_PROVIDER=local
```
- Data dari file `src/data/desaData.ts`
- Login admin: `admin@desa.id` / `admin123`
- Data tidak tersimpan ke database
- Cocok untuk: demo, presentasi, testing

---

### Option B — SUPABASE + VERCEL (Recommended untuk deploy real)

#### Langkah 1: Buat Akun Supabase
1. Daftar di https://supabase.com (gratis)
2. Klik **New Project**
3. Isi nama project, database password, pilih region terdekat (Singapore)
4. Tunggu project selesai dibuat (~2 menit)

#### Langkah 2: Setup Database
1. Di Supabase dashboard, klik **SQL Editor**
2. Klik **New query**
3. Copy-paste seluruh isi file `supabase/schema.sql`
4. Klik **Run**

#### Langkah 3: Buat Storage Bucket
1. Di Supabase, klik **Storage** di sidebar
2. Klik **New bucket**
3. Nama: `desa-assets`
4. Centang **Public bucket** → Save

#### Langkah 4: Buat Akun Admin
1. Di Supabase, klik **Authentication** → **Users**
2. Klik **Invite user** atau **Add user**
3. Masukkan email admin: `admin@desatalangmarap.id`
4. Set password yang kuat

#### Langkah 5: Ambil API Keys
1. Klik **Project Settings** → **API**
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

#### Langkah 6: Setup .env
```env
VITE_DB_PROVIDER=supabase
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_STORAGE_BUCKET=desa-assets
```

---

## DEPLOY KE VERCEL

### Cara 1: Via GitHub (Recommended)
1. Push project ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/portal-desa-talang-marap.git
   git push -u origin main
   ```
2. Buka https://vercel.com → Sign in with GitHub
3. Klik **New Project** → Import repository
4. Di **Environment Variables**, tambahkan:
   - `VITE_DB_PROVIDER` = `supabase`
   - `VITE_SUPABASE_URL` = URL dari Supabase
   - `VITE_SUPABASE_ANON_KEY` = Key dari Supabase
   - `VITE_STORAGE_BUCKET` = `desa-assets`
5. Klik **Deploy** → Tunggu ~2 menit
6. Website live! Vercel memberi domain otomatis seperti `portal-desa-talang-marap.vercel.app`

### Cara 2: Via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Custom Domain (Opsional)
1. Di Vercel → Project Settings → Domains
2. Tambahkan domain seperti `desatalangmarap.id`
3. Update DNS di registrar domain

---

## AKSES ADMIN

Setelah deploy, akses admin di:
```
https://your-domain.vercel.app/admin
```

Login dengan email + password yang dibuat di Supabase Auth.

---

## STRUKTUR FOLDER

```
portal-desa/
├── src/
│   ├── admin/           ← Semua halaman admin
│   │   ├── context/     ← Auth context
│   │   ├── layout/      ← Sidebar + topbar
│   │   ├── components/  ← Komponen reusable (CrudTable, Modal, dll)
│   │   └── pages/       ← Halaman CRUD (14 halaman)
│   ├── components/      ← Komponen publik
│   ├── context/         ← App context (darkmode, dll)
│   ├── data/            ← Data statis (fallback local mode)
│   ├── lib/
│   │   ├── supabase.ts  ← Supabase client
│   │   └── db.ts        ← Database abstraction layer
│   └── pages/           ← Halaman publik (14 halaman)
├── supabase/
│   └── schema.sql       ← SQL schema lengkap
├── .env                 ← Config local (jangan di-commit!)
├── .env.example         ← Template .env
└── DEPLOYMENT.md        ← Panduan ini
```

---

## DAFTAR FITUR CRUD ADMIN

| Menu Admin | Operasi |
|---|---|
| Berita | Create, Read, Update, Delete + Publish/Draft |
| Wisata | Create, Read, Update, Delete |
| UMKM | Create, Read, Update, Delete |
| Galeri | Create, Read, Update, Delete |
| Perangkat Desa | Create, Read, Update, Delete |
| Agenda/Kalender | Create, Read, Update, Delete |
| Aspirasi | Read, Update Status + Balas, Delete |
| Bank Sampah Nasabah | Create, Read, Update, Delete |
| Bank Sampah Setoran | Create, Read |
| Laporan Sampah | Read, Update Status, Delete |
| Anggota KKN | Create, Read, Update, Delete |
| Program Kerja KKN | Create, Read, Update, Delete |
| Dokumen | Create, Read, Update, Delete |
| Statistik Tahunan | Create, Read, Update, Delete |
| Pengaturan Desa | Update (semua field desa) |

---

## TROUBLESHOOTING

**Login admin gagal (Supabase)**
→ Pastikan email sudah terdaftar di Supabase Auth
→ Cek VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY

**Data tidak muncul**
→ Pastikan SQL schema sudah dijalankan
→ Cek RLS policies sudah aktif

**Upload foto gagal**
→ Pastikan bucket `desa-assets` sudah dibuat dan public
→ Cek nama bucket di VITE_STORAGE_BUCKET

**Error CORS**
→ Di Supabase → Authentication → URL Configuration
→ Tambahkan domain Vercel ke Site URL

---

*Dibuat oleh KKN UNIB Periode 108 Kelompok 146*
