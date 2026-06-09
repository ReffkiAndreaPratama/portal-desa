import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const isSupabase = import.meta.env.VITE_DB_PROVIDER === 'supabase'

// Upload file ke Supabase Storage
export async function uploadFile(file: File, folder: string = 'uploads'): Promise<string> {
  if (!isSupabase) {
    // Return placeholder URL for local mode
    return URL.createObjectURL(file)
  }
  const ext = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const bucket = import.meta.env.VITE_STORAGE_BUCKET || 'desa-assets'

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (error) throw error

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)
  return urlData.publicUrl
}

export type Database = {
  public: {
    Tables: {
      berita: {
        Row: {
          id: number; judul: string; kategori: string; tanggal: string;
          penulis: string; foto: string; ringkasan: string; konten: string;
          views: number; published: boolean; created_at: string;
        }
      }
      wisata: {
        Row: {
          id: number; nama: string; kategori: string; foto: string;
          deskripsi: string; fasilitas: string[]; harga: string;
          jam_operasional: string; maps: string; rating: number;
          pengunjung: string; published: boolean; created_at: string;
        }
      }
      umkm: {
        Row: {
          id: number; nama: string; kategori: string; foto: string;
          deskripsi: string; harga: string; kontak: string; pemilik: string;
          stok: string; lokasi: string; published: boolean; created_at: string;
        }
      }
      galeri: {
        Row: {
          id: number; judul: string; kategori: string; foto: string;
          tanggal: string; created_at: string;
        }
      }
      perangkat_desa: {
        Row: {
          id: number; jabatan: string; nama: string; foto: string;
          kontak: string; urutan: number; created_at: string;
        }
      }
      anggota_kkn: {
        Row: {
          id: number; nama: string; prodi: string; fakultas: string;
          posisi: string; foto: string; nim: string; created_at: string;
        }
      }
      program_kerja: {
        Row: {
          id: number; nama: string; kategori: string; deskripsi: string;
          status: string; progress: number; target: string; output: string;
          tanggal_mulai: string; tanggal_selesai: string; pic: string;
          icon: string; created_at: string;
        }
      }
      agenda: {
        Row: {
          id: number; judul: string; tanggal: string; jam: string;
          lokasi: string; kategori: string; deskripsi: string; created_at: string;
        }
      }
      aspirasi: {
        Row: {
          id: number; nama: string; kategori: string; pesan: string;
          status: string; balasan: string; anonim: boolean; created_at: string;
        }
      }
      laporan_sampah: {
        Row: {
          id: number; nama: string; lokasi: string; deskripsi: string;
          foto: string; status: string; catatan_admin: string; created_at: string;
        }
      }
      bank_sampah_nasabah: {
        Row: {
          id: number; nama: string; nik: string; alamat: string;
          no_hp: string; poin: number; aktif: boolean; created_at: string;
        }
      }
      bank_sampah_setor: {
        Row: {
          id: number; nasabah_id: number; jenis: string; berat: number;
          poin: number; tanggal: string; created_at: string;
        }
      }
      dokumen: {
        Row: {
          id: number; nama: string; kategori: string; tanggal: string;
          ukuran: string; tipe: string; url: string; created_at: string;
        }
      }
      pengaturan: {
        Row: {
          id: number; key: string; value: string; updated_at: string;
        }
      }
      statistik_desa: {
        Row: {
          id: number; tahun: number; penduduk: number; kk: number;
          laki_laki: number; perempuan: number; umkm: number;
          updated_at: string;
        }
      }
    }
  }
}
