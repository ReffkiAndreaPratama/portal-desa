-- ============================================================
-- PORTAL DIGITAL DESA TALANG MARAP
-- Supabase Schema - Jalankan di Supabase SQL Editor
-- ============================================================

-- Enable RLS (Row Level Security)
-- Semua tabel publik bisa dibaca, hanya admin yang bisa menulis

-- ─── PENGATURAN DESA ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pengaturan (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default data pengaturan
INSERT INTO pengaturan (key, value) VALUES
  ('nama_desa', 'Desa Talang Marap'),
  ('tagline', 'Mengenal Desa, Mengelola Data, Membangun Masa Depan'),
  ('kecamatan', 'Kecamatan Ulu Manna'),
  ('kabupaten', 'Kabupaten Bengkulu Selatan'),
  ('provinsi', 'Provinsi Bengkulu'),
  ('kepala_desa', 'Bapak Sumarno'),
  ('whatsapp', '6281234567890'),
  ('email', 'desatalangmarap@gmail.com'),
  ('alamat', 'Jl. Raya Talang Marap No. 1, Kec. Ulu Manna, Kab. Bengkulu Selatan'),
  ('jam_operasional', 'Senin - Jumat: 08.00 - 16.00 WIB'),
  ('instagram', 'desatalangmarap'),
  ('facebook', 'Desa Talang Marap'),
  ('tiktok', '@desatalangmarap'),
  ('youtube', 'Portal Desa Talang Marap'),
  ('jumlah_penduduk', '1847'),
  ('jumlah_kk', '512'),
  ('luas_wilayah', '24.5 km²'),
  ('jumlah_dusun', '4')
ON CONFLICT (key) DO NOTHING;

-- ─── BERITA ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS berita (
  id BIGSERIAL PRIMARY KEY,
  judul TEXT NOT NULL,
  kategori TEXT NOT NULL DEFAULT 'Pemerintahan',
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  penulis TEXT NOT NULL DEFAULT 'Admin Desa',
  foto TEXT DEFAULT '',
  ringkasan TEXT DEFAULT '',
  konten TEXT DEFAULT '',
  views INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── WISATA ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wisata (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  kategori TEXT DEFAULT 'Alam',
  foto TEXT DEFAULT '',
  deskripsi TEXT DEFAULT '',
  fasilitas TEXT[] DEFAULT '{}',
  harga TEXT DEFAULT '',
  jam_operasional TEXT DEFAULT '',
  maps TEXT DEFAULT '',
  rating DECIMAL(2,1) DEFAULT 4.5,
  pengunjung TEXT DEFAULT '',
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── UMKM ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS umkm (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  kategori TEXT DEFAULT 'Makanan',
  foto TEXT DEFAULT '',
  deskripsi TEXT DEFAULT '',
  harga TEXT DEFAULT '',
  kontak TEXT DEFAULT '',
  pemilik TEXT DEFAULT '',
  stok TEXT DEFAULT 'Tersedia',
  lokasi TEXT DEFAULT '',
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── GALERI ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS galeri (
  id BIGSERIAL PRIMARY KEY,
  judul TEXT NOT NULL,
  kategori TEXT DEFAULT 'Lainnya',
  foto TEXT NOT NULL,
  tanggal DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PERANGKAT DESA ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS perangkat_desa (
  id BIGSERIAL PRIMARY KEY,
  jabatan TEXT NOT NULL,
  nama TEXT NOT NULL,
  foto TEXT DEFAULT '',
  kontak TEXT DEFAULT '',
  urutan INTEGER DEFAULT 99,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ANGGOTA KKN ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS anggota_kkn (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  nim TEXT DEFAULT '',
  prodi TEXT DEFAULT '',
  fakultas TEXT DEFAULT '',
  posisi TEXT DEFAULT 'Anggota',
  foto TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PROGRAM KERJA ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS program_kerja (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  kategori TEXT DEFAULT 'Umum',
  deskripsi TEXT DEFAULT '',
  status TEXT DEFAULT 'planned',
  progress INTEGER DEFAULT 0,
  target TEXT DEFAULT '',
  output TEXT DEFAULT '',
  tanggal_mulai DATE,
  tanggal_selesai DATE,
  pic TEXT DEFAULT '',
  icon TEXT DEFAULT '📋',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── AGENDA ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agenda (
  id BIGSERIAL PRIMARY KEY,
  judul TEXT NOT NULL,
  tanggal DATE NOT NULL,
  jam TEXT DEFAULT '08.00 WIB',
  lokasi TEXT DEFAULT '',
  kategori TEXT DEFAULT 'Pemerintahan',
  deskripsi TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ASPIRASI ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS aspirasi (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT DEFAULT 'Anonim',
  kategori TEXT DEFAULT 'Lainnya',
  pesan TEXT NOT NULL,
  status TEXT DEFAULT 'diterima',
  balasan TEXT DEFAULT '',
  anonim BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── LAPORAN SAMPAH ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS laporan_sampah (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT DEFAULT '',
  lokasi TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  foto TEXT DEFAULT '',
  status TEXT DEFAULT 'diterima',
  catatan_admin TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BANK SAMPAH NASABAH ────────────────────────────────────
CREATE TABLE IF NOT EXISTS bank_sampah_nasabah (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  nik TEXT DEFAULT '',
  alamat TEXT DEFAULT '',
  no_hp TEXT DEFAULT '',
  poin INTEGER DEFAULT 0,
  aktif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BANK SAMPAH SETORAN ────────────────────────────────────
CREATE TABLE IF NOT EXISTS bank_sampah_setor (
  id BIGSERIAL PRIMARY KEY,
  nasabah_id BIGINT REFERENCES bank_sampah_nasabah(id) ON DELETE CASCADE,
  jenis TEXT NOT NULL,
  berat DECIMAL(8,2) NOT NULL,
  poin INTEGER DEFAULT 0,
  tanggal DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── DOKUMEN ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dokumen (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  kategori TEXT DEFAULT 'Lainnya',
  tanggal DATE DEFAULT CURRENT_DATE,
  ukuran TEXT DEFAULT '',
  tipe TEXT DEFAULT 'PDF',
  url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── STATISTIK DESA ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS statistik_desa (
  id BIGSERIAL PRIMARY KEY,
  tahun INTEGER NOT NULL UNIQUE,
  penduduk INTEGER DEFAULT 0,
  kk INTEGER DEFAULT 0,
  laki_laki INTEGER DEFAULT 0,
  perempuan INTEGER DEFAULT 0,
  umkm INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── RLS POLICIES ───────────────────────────────────────────
-- Aktifkan RLS untuk semua tabel
ALTER TABLE berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE wisata ENABLE ROW LEVEL SECURITY;
ALTER TABLE umkm ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeri ENABLE ROW LEVEL SECURITY;
ALTER TABLE perangkat_desa ENABLE ROW LEVEL SECURITY;
ALTER TABLE anggota_kkn ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_kerja ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE aspirasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE laporan_sampah ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_sampah_nasabah ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_sampah_setor ENABLE ROW LEVEL SECURITY;
ALTER TABLE dokumen ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistik_desa ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengaturan ENABLE ROW LEVEL SECURITY;

-- Tabel publik (siapa saja bisa baca)
CREATE POLICY "Public read" ON berita FOR SELECT USING (TRUE);
CREATE POLICY "Public read" ON wisata FOR SELECT USING (TRUE);
CREATE POLICY "Public read" ON umkm FOR SELECT USING (TRUE);
CREATE POLICY "Public read" ON galeri FOR SELECT USING (TRUE);
CREATE POLICY "Public read" ON perangkat_desa FOR SELECT USING (TRUE);
CREATE POLICY "Public read" ON anggota_kkn FOR SELECT USING (TRUE);
CREATE POLICY "Public read" ON program_kerja FOR SELECT USING (TRUE);
CREATE POLICY "Public read" ON agenda FOR SELECT USING (TRUE);
CREATE POLICY "Public read" ON aspirasi FOR SELECT USING (TRUE);
CREATE POLICY "Public read" ON laporan_sampah FOR SELECT USING (TRUE);
CREATE POLICY "Public read" ON bank_sampah_nasabah FOR SELECT USING (TRUE);
CREATE POLICY "Public read" ON bank_sampah_setor FOR SELECT USING (TRUE);
CREATE POLICY "Public read" ON dokumen FOR SELECT USING (TRUE);
CREATE POLICY "Public read" ON statistik_desa FOR SELECT USING (TRUE);
CREATE POLICY "Public read" ON pengaturan FOR SELECT USING (TRUE);

-- Warga bisa insert aspirasi dan laporan (tanpa auth)
CREATE POLICY "Public insert aspirasi" ON aspirasi FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Public insert laporan" ON laporan_sampah FOR INSERT WITH CHECK (TRUE);

-- Hanya authenticated user (admin) yang bisa write lainnya
CREATE POLICY "Auth write berita" ON berita FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write wisata" ON wisata FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write umkm" ON umkm FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write galeri" ON galeri FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write perangkat" ON perangkat_desa FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write anggota" ON anggota_kkn FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write proker" ON program_kerja FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write agenda" ON agenda FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write aspirasi" ON aspirasi FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete aspirasi" ON aspirasi FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write laporan" ON laporan_sampah FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete laporan" ON laporan_sampah FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write nasabah" ON bank_sampah_nasabah FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write setor" ON bank_sampah_setor FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write dokumen" ON dokumen FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write statistik" ON statistik_desa FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write pengaturan" ON pengaturan FOR ALL USING (auth.role() = 'authenticated');

-- ─── FUNGSI ─────────────────────────────────────────────────
-- Increment views berita
CREATE OR REPLACE FUNCTION increment_views(berita_id BIGINT)
RETURNS VOID AS $$
  UPDATE berita SET views = views + 1 WHERE id = berita_id;
$$ LANGUAGE SQL;

-- ─── STORAGE BUCKET ─────────────────────────────────────────
-- Buat di Supabase Dashboard > Storage > New bucket
-- Nama: desa-assets
-- Public: YES

-- ─── DATA SAMPAH BULANAN ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS data_sampah (
  id BIGSERIAL PRIMARY KEY,
  bulan TEXT NOT NULL UNIQUE,  -- Format: YYYY-MM
  total INTEGER DEFAULT 0,
  organik INTEGER DEFAULT 0,
  anorganik INTEGER DEFAULT 0,
  b3 INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data awal
INSERT INTO data_sampah (bulan, total, organik, anorganik, b3) VALUES
  ('2025-04', 2520, 1512, 882, 126),
  ('2025-05', 2680, 1608, 938, 134),
  ('2025-06', 2840, 1704, 994, 142)
ON CONFLICT (bulan) DO NOTHING;

-- ─── PESAN KONTAK ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pesan_kontak (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  email TEXT DEFAULT '',
  subjek TEXT DEFAULT '',
  pesan TEXT NOT NULL,
  sudah_dibaca BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS untuk tabel baru
ALTER TABLE data_sampah ENABLE ROW LEVEL SECURITY;
ALTER TABLE pesan_kontak ENABLE ROW LEVEL SECURITY;

-- Publik bisa baca data_sampah
CREATE POLICY "Public read data_sampah" ON data_sampah FOR SELECT USING (TRUE);

-- Publik bisa insert pesan_kontak
CREATE POLICY "Public insert pesan" ON pesan_kontak FOR INSERT WITH CHECK (TRUE);

-- Hanya admin yang bisa akses penuh
CREATE POLICY "Auth write data_sampah" ON data_sampah FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth read pesan" ON pesan_kontak FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth update pesan" ON pesan_kontak FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete pesan" ON pesan_kontak FOR DELETE USING (auth.role() = 'authenticated');
