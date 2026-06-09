import { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { desaInfo } from '../data/desaData';
import { pesanKontakService } from '../lib/db';
import toast from 'react-hot-toast';

export default function KontakPage() {
  const [form, setForm] = useState({ nama: '', email: '', subjek: '', pesan: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await pesanKontakService.submit(form);
      setSent(true);
      toast.success('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.');
      setForm({ nama: '', email: '', subjek: '', pesan: '' });
      setTimeout(() => setSent(false), 5000);
    } catch {
      toast.error('Gagal mengirim pesan, coba lagi.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-24">
      <div className="gradient-green border-b-4 border-[#212121] py-10">
        <div className="container-custom">
          <h1 className="text-3xl font-black text-white mb-1">Hubungi Kami</h1>
          <p className="text-white/70">Desa Talang Marap siap melayani Anda</p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Info Kontak */}
          <div className="space-y-5">
            <div className="brutal-card p-6">
              <h2 className="font-black text-xl mb-5 flex items-center gap-2">📋 Informasi Kontak</h2>
              <div className="space-y-4">
                {[
                  { icon: <MapPin size={20} className="text-[#2E7D32]" />, label: 'Alamat', value: desaInfo.alamat },
                  { icon: <Phone size={20} className="text-[#2E7D32]" />, label: 'WhatsApp', value: '+62 812-3456-7890', href: `https://wa.me/${desaInfo.whatsapp}` },
                  { icon: <Mail size={20} className="text-[#2E7D32]" />, label: 'Email', value: desaInfo.email, href: `mailto:${desaInfo.email}` },
                  { icon: <Clock size={20} className="text-[#2E7D32]" />, label: 'Jam Operasional', value: desaInfo.jamOperasional },
                ].map((info, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-[#F1F8E9] rounded-xl border-2 border-[#E8F5E9]">
                    <div className="shrink-0 mt-0.5">{info.icon}</div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} target="_blank" rel="noreferrer"
                          className="font-bold text-sm text-[#2E7D32] hover:underline">{info.value}</a>
                      ) : (
                        <p className="font-bold text-sm">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Sosial */}
            <div className="brutal-card p-6">
              <h2 className="font-black text-xl mb-4">📱 Media Sosial</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '📷', label: 'Instagram', user: `@${desaInfo.instagram}`, color: '#E1306C', href: '#' },
                  { icon: '👍', label: 'Facebook', user: desaInfo.facebook, color: '#1877F2', href: '#' },
                  { icon: '▶️', label: 'YouTube', user: desaInfo.youtube, color: '#FF0000', href: '#' },
                  { icon: '💬', label: 'WhatsApp', user: '+62 812-3456-7890', color: '#25D366', href: `https://wa.me/${desaInfo.whatsapp}` },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noreferrer"
                    className="brutal-card p-4 flex items-center gap-3 hover:scale-[1.02]">
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <p className="font-black text-xs">{s.label}</p>
                      <p className="text-gray-500 text-[10px]">{s.user}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Maps */}
            <div className="brutal-card overflow-hidden">
              <div className="bg-[#2E7D32] p-3 text-white font-black text-sm flex items-center gap-2">
                <MapPin size={16} /> Lokasi Kantor Desa
              </div>
              <div className="h-48 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={40} className="text-[#2E7D32] mx-auto mb-2" />
                  <p className="font-bold text-[#2E7D32]">Kantor Desa Talang Marap</p>
                  <a href="https://maps.google.com" target="_blank" rel="noreferrer"
                    className="text-xs text-[#2E7D32] underline font-semibold">Buka di Google Maps →</a>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <div className="brutal-card p-6">
              <h2 className="font-black text-xl mb-5">✉️ Kirim Pesan</h2>
              {sent ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-3">✅</div>
                  <h3 className="font-black text-lg text-[#2E7D32]">Pesan Terkirim!</h3>
                  <p className="text-gray-500 text-sm mt-1">Kami akan segera membalas pesan Anda.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { label: 'Nama Lengkap', key: 'nama', type: 'text', placeholder: 'Nama Anda' },
                    { label: 'Email', key: 'email', type: 'email', placeholder: 'email@contoh.com' },
                    { label: 'Subjek', key: 'subjek', type: 'text', placeholder: 'Topik pesan...' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block font-bold text-sm mb-1">{f.label} <span className="text-red-500">*</span></label>
                      <input type={f.type} placeholder={f.placeholder} required
                        value={(form as any)[f.key]}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full px-4 py-3 border-3 border-[#212121] rounded-xl font-medium outline-none focus:border-[#2E7D32] bg-white" />
                    </div>
                  ))}
                  <div>
                    <label className="block font-bold text-sm mb-1">Pesan <span className="text-red-500">*</span></label>
                    <textarea placeholder="Tulis pesan Anda di sini..." required rows={5} value={form.pesan}
                      onChange={e => setForm(p => ({ ...p, pesan: e.target.value }))}
                      className="w-full px-4 py-3 border-3 border-[#212121] rounded-xl font-medium outline-none focus:border-[#2E7D32] bg-white resize-none" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="brutal-btn w-full bg-[#2E7D32] text-white py-3 rounded-xl font-black text-base disabled:opacity-60">
                    {loading ? '⏳ Mengirim...' : 'Kirim Pesan ✉️'}
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    Atau hubungi via{' '}
                    <a href={`https://wa.me/${desaInfo.whatsapp}`} className="text-[#2E7D32] font-bold hover:underline">WhatsApp</a>
                    {' '}untuk respons lebih cepat.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
