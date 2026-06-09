/**
 * Database abstraction layer
 * Automatically uses Supabase or local data based on VITE_DB_PROVIDER env
 */

import { supabase, isSupabase } from './supabase'
import * as localData from '../data/desaData'

// ─── Generic helpers ────────────────────────────────────────────────

async function sbFetch<T>(table: string, options?: {
  select?: string
  eq?: [string, unknown]
  order?: [string, { ascending: boolean }]
  limit?: number
  single?: boolean
  match?: Record<string, unknown>
}): Promise<T> {
  let q = supabase.from(table).select(options?.select || '*')
  if (options?.eq) q = (q as any).eq(options.eq[0], options.eq[1])
  if (options?.match) q = (q as any).match(options.match)
  if (options?.order) q = (q as any).order(options.order[0], options.order[1])
  if (options?.limit) q = (q as any).limit(options.limit)
  const { data, error } = options?.single ? await (q as any).single() : await q
  if (error) throw error
  return data as T
}

async function sbInsert<T>(table: string, payload: Partial<T>): Promise<T> {
  const { data, error } = await supabase.from(table).insert(payload as any).select().single()
  if (error) throw error
  return data as T
}

async function sbUpdate<T>(table: string, id: number, payload: Partial<T>): Promise<T> {
  const { data, error } = await supabase.from(table).update(payload as any).eq('id', id).select().single()
  if (error) throw error
  return data as T
}

async function sbDelete(table: string, id: number): Promise<void> {
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
}

// ─── BERITA ─────────────────────────────────────────────────────────
export const beritaService = {
  getAll: async () => isSupabase
    ? sbFetch<any[]>('berita', { order: ['tanggal', { ascending: false }] })
    : localData.beritaDesa,

  getById: async (id: number) => isSupabase
    ? sbFetch<any>('berita', { eq: ['id', id], single: true })
    : localData.beritaDesa.find(b => b.id === id) || null,

  create: async (data: any) => isSupabase
    ? sbInsert('berita', { ...data, views: 0, published: true })
    : { ...data, id: Date.now(), views: 0 },

  update: async (id: number, data: any) => isSupabase
    ? sbUpdate('berita', id, data)
    : data,

  delete: async (id: number) => isSupabase
    ? sbDelete('berita', id)
    : void 0,

  incrementView: async (id: number) => {
    if (!isSupabase) return
    await supabase.rpc('increment_views', { berita_id: id })
  }
}

// ─── WISATA ─────────────────────────────────────────────────────────
export const wisataService = {
  getAll: async () => isSupabase
    ? sbFetch<any[]>('wisata', { order: ['id', { ascending: true }] })
    : localData.wisataDesa,

  create: async (data: any) => isSupabase
    ? sbInsert('wisata', { ...data, published: true })
    : data,

  update: async (id: number, data: any) => isSupabase
    ? sbUpdate('wisata', id, data)
    : data,

  delete: async (id: number) => isSupabase ? sbDelete('wisata', id) : void 0,
}

// ─── UMKM ───────────────────────────────────────────────────────────
export const umkmService = {
  getAll: async () => isSupabase
    ? sbFetch<any[]>('umkm', { order: ['id', { ascending: true }] })
    : localData.umkmDesa,

  create: async (data: any) => isSupabase
    ? sbInsert('umkm', { ...data, published: true })
    : data,

  update: async (id: number, data: any) => isSupabase
    ? sbUpdate('umkm', id, data)
    : data,

  delete: async (id: number) => isSupabase ? sbDelete('umkm', id) : void 0,
}

// ─── GALERI ─────────────────────────────────────────────────────────
export const galeriService = {
  getAll: async () => isSupabase
    ? sbFetch<any[]>('galeri', { order: ['tanggal', { ascending: false }] })
    : localData.galeriData,

  create: async (data: any) => isSupabase
    ? sbInsert('galeri', data)
    : data,

  update: async (id: number, data: any) => isSupabase
    ? sbUpdate('galeri', id, data)
    : data,

  delete: async (id: number) => isSupabase ? sbDelete('galeri', id) : void 0,
}

// ─── PERANGKAT DESA ─────────────────────────────────────────────────
export const perangkatService = {
  getAll: async () => isSupabase
    ? sbFetch<any[]>('perangkat_desa', { order: ['urutan', { ascending: true }] })
    : localData.perangkatDesa,

  create: async (data: any) => isSupabase ? sbInsert('perangkat_desa', data) : data,
  update: async (id: number, data: any) => isSupabase ? sbUpdate('perangkat_desa', id, data) : data,
  delete: async (id: number) => isSupabase ? sbDelete('perangkat_desa', id) : void 0,
}

// ─── ANGGOTA KKN ────────────────────────────────────────────────────
export const anggotaKKNService = {
  getAll: async () => isSupabase
    ? sbFetch<any[]>('anggota_kkn', { order: ['id', { ascending: true }] })
    : localData.anggotaKKN,

  create: async (data: any) => isSupabase ? sbInsert('anggota_kkn', data) : data,
  update: async (id: number, data: any) => isSupabase ? sbUpdate('anggota_kkn', id, data) : data,
  delete: async (id: number) => isSupabase ? sbDelete('anggota_kkn', id) : void 0,
}

// ─── PROGRAM KERJA ──────────────────────────────────────────────────
export const prokerService = {
  getAll: async () => isSupabase
    ? sbFetch<any[]>('program_kerja', { order: ['id', { ascending: true }] })
    : localData.programKerjaKKN,

  create: async (data: any) => isSupabase ? sbInsert('program_kerja', data) : data,
  update: async (id: number, data: any) => isSupabase ? sbUpdate('program_kerja', id, data) : data,
  delete: async (id: number) => isSupabase ? sbDelete('program_kerja', id) : void 0,
}

// ─── AGENDA ─────────────────────────────────────────────────────────
export const agendaService = {
  getAll: async () => isSupabase
    ? sbFetch<any[]>('agenda', { order: ['tanggal', { ascending: true }] })
    : localData.agendaDesa,

  create: async (data: any) => isSupabase ? sbInsert('agenda', data) : data,
  update: async (id: number, data: any) => isSupabase ? sbUpdate('agenda', id, data) : data,
  delete: async (id: number) => isSupabase ? sbDelete('agenda', id) : void 0,
}

// ─── ASPIRASI ───────────────────────────────────────────────────────
export const aspirasiService = {
  getAll: async () => isSupabase
    ? sbFetch<any[]>('aspirasi', { order: ['created_at', { ascending: false }] })
    : [
        { id: 1, nama: 'Warga Dusun I', kategori: 'Infrastruktur', pesan: 'Mohon perbaikan jalan di Dusun I.', status: 'selesai', balasan: 'Sudah dijadwalkan perbaikan.', anonim: false, created_at: '2025-05-01' },
        { id: 2, nama: 'Kelompok Tani', kategori: 'Pertanian', pesan: 'Perlu bantuan bibit unggul.', status: 'diproses', balasan: '', anonim: false, created_at: '2025-05-15' },
        { id: 3, nama: 'Warga Anonim', kategori: 'Pendidikan', pesan: 'Perlu bimbingan belajar anak SD.', status: 'diterima', balasan: '', anonim: true, created_at: '2025-06-01' },
      ],

  submit: async (data: any) => isSupabase
    ? sbInsert('aspirasi', { ...data, status: 'diterima', balasan: '' })
    : data,

  updateStatus: async (id: number, status: string, balasan: string) => isSupabase
    ? sbUpdate('aspirasi', id, { status, balasan })
    : { id, status, balasan },

  delete: async (id: number) => isSupabase ? sbDelete('aspirasi', id) : void 0,
}

// ─── LAPORAN SAMPAH ─────────────────────────────────────────────────
export const laporanSampahService = {
  getAll: async () => isSupabase
    ? sbFetch<any[]>('laporan_sampah', { order: ['created_at', { ascending: false }] })
    : [],

  submit: async (data: any) => isSupabase
    ? sbInsert('laporan_sampah', { ...data, status: 'diterima', catatan_admin: '' })
    : data,

  updateStatus: async (id: number, status: string, catatan: string) => isSupabase
    ? sbUpdate('laporan_sampah', id, { status, catatan_admin: catatan })
    : { id, status },

  delete: async (id: number) => isSupabase ? sbDelete('laporan_sampah', id) : void 0,
}

// ─── BANK SAMPAH ────────────────────────────────────────────────────
export const bankSampahService = {
  getAllNasabah: async () => isSupabase
    ? sbFetch<any[]>('bank_sampah_nasabah', { order: ['poin', { ascending: false }] })
    : localData.sampahData.leaderboard.map((l, i) => ({
        id: i + 1, nama: l.nama, nik: '-', alamat: '-', no_hp: '-', poin: l.poin, aktif: true
      })),

  getAllSetor: async () => isSupabase
    ? sbFetch<any[]>('bank_sampah_setor', { order: ['tanggal', { ascending: false }] })
    : [],

  createNasabah: async (data: any) => isSupabase
    ? sbInsert('bank_sampah_nasabah', { ...data, poin: 0, aktif: true })
    : data,

  createSetor: async (data: any) => isSupabase
    ? sbInsert('bank_sampah_setor', data)
    : data,

  updateNasabah: async (id: number, data: any) => isSupabase
    ? sbUpdate('bank_sampah_nasabah', id, data)
    : data,

  deleteNasabah: async (id: number) => isSupabase ? sbDelete('bank_sampah_nasabah', id) : void 0,
}

// ─── DOKUMEN ────────────────────────────────────────────────────────
export const dokumenService = {
  getAll: async () => isSupabase
    ? sbFetch<any[]>('dokumen', { order: ['tanggal', { ascending: false }] })
    : localData.dokumenDesa,

  create: async (data: any) => isSupabase ? sbInsert('dokumen', data) : data,
  update: async (id: number, data: any) => isSupabase ? sbUpdate('dokumen', id, data) : data,
  delete: async (id: number) => isSupabase ? sbDelete('dokumen', id) : void 0,
}

// ─── PENGATURAN DESA ────────────────────────────────────────────────
export const pengaturanService = {
  getAll: async (): Promise<Record<string, string>> => {
    if (!isSupabase) {
      return {
        nama_desa: localData.desaInfo.nama,
        kecamatan: localData.desaInfo.kecamatan,
        kabupaten: localData.desaInfo.kabupaten,
        provinsi: localData.desaInfo.provinsi,
        tagline: localData.desaInfo.tagline,
        kepala_desa: localData.desaInfo.kepala,
        whatsapp: localData.desaInfo.whatsapp,
        email: localData.desaInfo.email,
        alamat: localData.desaInfo.alamat,
        jam_operasional: localData.desaInfo.jamOperasional,
        instagram: localData.desaInfo.instagram,
        facebook: localData.desaInfo.facebook,
        tiktok: localData.desaInfo.tiktok,
        youtube: localData.desaInfo.youtube,
        jumlah_penduduk: String(localData.desaInfo.penduduk),
        jumlah_kk: String(localData.desaInfo.kk),
        luas_wilayah: localData.desaInfo.luasWilayah,
        jumlah_dusun: String(localData.desaInfo.jumlahDusun),
      }
    }
    const rows = await sbFetch<any[]>('pengaturan')
    return Object.fromEntries((rows || []).map((r: any) => [r.key, r.value]))
  },

  set: async (key: string, value: string) => {
    if (!isSupabase) return
    await supabase.from('pengaturan').upsert({ key, value }, { onConflict: 'key' })
  },

  setBulk: async (data: Record<string, string>) => {
    if (!isSupabase) return
    const rows = Object.entries(data).map(([key, value]) => ({ key, value }))
    await supabase.from('pengaturan').upsert(rows, { onConflict: 'key' })
  }
}

// ─── STATISTIK DESA ─────────────────────────────────────────────────
export const statistikService = {
  getAll: async () => isSupabase
    ? sbFetch<any[]>('statistik_desa', { order: ['tahun', { ascending: true }] })
    : [
        { id: 1, tahun: 2020, penduduk: 1680, kk: 467, laki_laki: 840, perempuan: 840, umkm: 18 },
        { id: 2, tahun: 2021, penduduk: 1710, kk: 475, laki_laki: 855, perempuan: 855, umkm: 21 },
        { id: 3, tahun: 2022, penduduk: 1748, kk: 486, laki_laki: 874, perempuan: 874, umkm: 25 },
        { id: 4, tahun: 2023, penduduk: 1790, kk: 498, laki_laki: 895, perempuan: 895, umkm: 28 },
        { id: 5, tahun: 2024, penduduk: 1820, kk: 507, laki_laki: 910, perempuan: 910, umkm: 30 },
        { id: 6, tahun: 2025, penduduk: 1847, kk: 512, laki_laki: 921, perempuan: 926, umkm: 32 },
      ],

  create: async (data: any) => isSupabase ? sbInsert('statistik_desa', data) : data,
  update: async (id: number, data: any) => isSupabase ? sbUpdate('statistik_desa', id, data) : data,
  delete: async (id: number) => isSupabase ? sbDelete('statistik_desa', id) : void 0,
}

// ─── PESAN KONTAK ───────────────────────────────────────────
export const pesanKontakService = {
  getAll: async () => isSupabase
    ? sbFetch<any[]>('pesan_kontak', { order: ['created_at', { ascending: false }] })
    : [],

  submit: async (data: any) => isSupabase
    ? sbInsert('pesan_kontak', { ...data, sudah_dibaca: false })
    : data,

  markRead: async (id: number) => isSupabase
    ? sbUpdate('pesan_kontak', id, { sudah_dibaca: true })
    : {},

  delete: async (id: number) => isSupabase ? sbDelete('pesan_kontak', id) : void 0,
}

// ─── DATA SAMPAH BULANAN ────────────────────────────────────
export const dataSampahService = {
  getAll: async () => isSupabase
    ? sbFetch<any[]>('data_sampah', { order: ['bulan', { ascending: false }] })
    : [
        { id: 1, bulan: '2025-06', total: 2840, organik: 1704, anorganik: 994, b3: 142 },
        { id: 2, bulan: '2025-05', total: 2680, organik: 1608, anorganik: 938, b3: 134 },
        { id: 3, bulan: '2025-04', total: 2520, organik: 1512, anorganik: 882, b3: 126 },
      ],

  getLatest: async () => {
    if (!isSupabase) return { id: 1, bulan: '2025-06', total: 2840, organik: 1704, anorganik: 994, b3: 142 }
    const rows = await sbFetch<any[]>('data_sampah', { order: ['bulan', { ascending: false }], limit: 1 })
    return (rows as any[])[0] ?? null
  },

  create: async (data: any) => isSupabase ? sbInsert('data_sampah', data) : data,
  update: async (id: number, data: any) => isSupabase ? sbUpdate('data_sampah', id, data) : data,
  delete: async (id: number) => isSupabase ? sbDelete('data_sampah', id) : void 0,
}

// ─── AUTH ────────────────────────────────────────────────────────────
export const authService = {
  signIn: async (email: string, password: string) => {
    if (!isSupabase) {
      // Local dev bypass
      if (email === 'admin@desa.id' && password === 'admin123') {
        return { user: { email, role: 'admin' }, error: null }
      }
      return { user: null, error: 'Email atau password salah' }
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { user: data.user, error: error?.message || null }
  },

  signOut: async () => {
    if (isSupabase) await supabase.auth.signOut()
  },

  getSession: async () => {
    if (!isSupabase) {
      const stored = localStorage.getItem('admin_session')
      return stored ? JSON.parse(stored) : null
    }
    const { data } = await supabase.auth.getSession()
    return data.session
  }
}
