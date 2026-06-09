import { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const faqs: Record<string, string> = {
  'wisata': '🏞️ Desa Talang Marap punya 4 destinasi wisata: Air Terjun Talang Indah, Bukit Panorama Marap, Danau Hijau Talang, dan Kebun Kopi Heritage. Kunjungi halaman Wisata untuk detail!',
  'umkm': '🛍️ Ada 6 produk UMKM unggulan: Kopi Robusta, Keripik Singkong, Madu Hutan, Batik Rafflesia, Gula Aren, dan Anyaman Bambu. Lihat di halaman UMKM!',
  'sampah': '♻️ Program SiTARA adalah sistem informasi sampah digital desa. Anda bisa daftar bank sampah, cek jadwal angkut, dan lapor sampah ilegal. Kunjungi menu SiTARA!',
  'kkn': '🎓 KKN UNIB Periode 108 Kelompok 146 bertugas di desa ini. Ada 10 anggota dari berbagai fakultas dengan 6 program kerja utama. Lihat di menu KKN!',
  'kontak': '📞 Kantor Desa buka Senin-Jumat 08.00-16.00. WhatsApp: 081234567890. Email: desatalangmarap@gmail.com',
  'kepala': '👤 Kepala Desa Talang Marap adalah Bapak Sumarno. Kantor desa buka hari kerja.',
  'penduduk': '👥 Jumlah penduduk Desa Talang Marap: 1.847 jiwa, 512 KK, terdiri dari 4 dusun.',
  'sejarah': '📜 Desa Talang Marap berdiri tahun 1945 dan terus berkembang hingga era digital di tahun 2025 dengan Program Portal Digital bersama KKN UNIB.',
  'dokumen': '📄 Dokumen desa tersedia di menu Dokumen, termasuk RPJMDes, APBDes, Monografi, dan Peraturan Desa.',
};

const getReply = (msg: string): string => {
  const lower = msg.toLowerCase();
  for (const key of Object.keys(faqs)) {
    if (lower.includes(key)) return faqs[key];
  }
  if (lower.includes('halo') || lower.includes('hai') || lower.includes('hello'))
    return '👋 Halo! Saya asisten digital Desa Talang Marap. Tanya saya tentang wisata, UMKM, sampah, KKN, atau kontak desa!';
  if (lower.includes('terima kasih') || lower.includes('makasih'))
    return '😊 Sama-sama! Ada yang bisa dibantu lagi?';
  return '🤔 Maaf, saya belum memahami pertanyaan itu. Coba tanya tentang: wisata, UMKM, sampah/SiTARA, KKN, kontak, atau sejarah desa.';
};

interface Msg { from: 'user' | 'bot'; text: string; }

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { from: 'bot', text: '👋 Halo! Saya asisten digital Desa Talang Marap. Tanya saya tentang wisata, UMKM, SiTARA, KKN, atau info desa lainnya!' }
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Msg = { from: 'user', text: input };
    const botMsg: Msg = { from: 'bot', text: getReply(input) };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50">
      {open && (
        <div className="mb-3 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white border-4 border-[#212121] rounded-2xl shadow-[8px_8px_0_#212121] overflow-hidden">
          <div className="gradient-green p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <p className="font-black text-white text-sm">Asisten Desa</p>
                <p className="text-white/70 text-xs">Talang Marap</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
              <X size={18} />
            </button>
          </div>
          <div className="h-64 overflow-y-auto p-3 space-y-3 bg-[#FFFDF7]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm font-medium border-2 ${
                  msg.from === 'user'
                    ? 'bg-[#2E7D32] text-white border-[#1B5E20]'
                    : 'bg-white text-gray-700 border-[#212121] shadow-[2px_2px_0_#212121]'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t-4 border-[#212121] flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ketik pesan..."
              className="flex-1 text-sm px-3 py-2 border-2 border-[#212121] rounded-xl outline-none focus:border-[#2E7D32] font-medium"
            />
            <button onClick={send}
              className="brutal-btn w-9 h-9 rounded-xl flex items-center justify-center bg-[#2E7D32] text-white">
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="brutal-btn w-14 h-14 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center relative"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[9px] font-black text-white flex items-center justify-center">1</span>
        )}
      </button>
    </div>
  );
}
