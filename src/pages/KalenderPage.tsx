import { agendaService } from '../lib/db';
import { useDBData } from '../hooks/useDB';
import { agendaDesa as fallback } from '../data/desaData';
import { Calendar, MapPin, Clock } from 'lucide-react';

const kategoriColors: Record<string, string> = {
  Kesehatan:    'bg-red-100 text-red-700 border-red-300',
  Pemerintahan: 'bg-blue-100 text-blue-700 border-blue-300',
  Sosial:       'bg-green-100 text-green-700 border-green-300',
  KKN:          'bg-orange-100 text-orange-700 border-orange-300',
  Pendidikan:   'bg-yellow-100 text-yellow-700 border-yellow-300',
};

export default function KalenderPage() {
  const { data, loading } = useDBData(() => agendaService.getAll() as Promise<any[]>);
  const agendaList: any[] = (data as any[]) ?? fallback;

  const bulan       = new Date().getMonth();
  const tahun       = new Date().getFullYear();
  const hariPertama = new Date(tahun, bulan, 1).getDay();
  const jumlahHari  = new Date(tahun, bulan + 1, 0).getDate();
  const namaBulan   = new Date(tahun, bulan).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  const getEventPadaTanggal = (tgl: number) => {
    const str = `${tahun}-${String(bulan + 1).padStart(2, '0')}-${String(tgl).padStart(2, '0')}`;
    return agendaList.filter(a => a.tanggal === str);
  };

  const emptyDays = Array.from({ length: (hariPertama + 6) % 7 });
  const days      = Array.from({ length: jumlahHari }, (_, i) => i + 1);
  const today     = new Date().getDate();

  const upcoming  = [...agendaList]
    .filter(a => new Date(a.tanggal) >= new Date(new Date().toDateString()))
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-24">
      <div className="gradient-green border-b-4 border-[#212121] py-10">
        <div className="container-custom">
          <h1 className="text-3xl font-black text-white mb-1">Kalender Desa</h1>
          <p className="text-white/70">Agenda dan kegiatan Desa Talang Marap</p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Kalender */}
          <div className="lg:col-span-2">
            <div className="brutal-card overflow-hidden">
              <div className="bg-[#2E7D32] p-4 text-white font-black text-center text-lg flex items-center justify-center gap-2">
                <Calendar size={20} /> {namaBulan}
              </div>
              <div className="p-4">
                {/* Hari */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map(d => (
                    <div key={d} className="text-center text-xs font-black text-gray-400 py-2">{d}</div>
                  ))}
                </div>
                {/* Dates */}
                <div className="grid grid-cols-7 gap-1">
                  {emptyDays.map((_, i) => <div key={i} />)}
                  {days.map(day => {
                    const events  = getEventPadaTanggal(day);
                    const isToday = day === today;
                    return (
                      <div key={day} className={`min-h-[60px] p-1 rounded-xl border-2 transition-all ${
                        isToday        ? 'bg-[#2E7D32] border-[#212121] text-white' :
                        events.length  ? 'bg-[#E8F5E9] border-[#2E7D32]' :
                                         'bg-white border-gray-100 hover:border-gray-300'
                      }`}>
                        <p className={`font-black text-xs mb-1 ${isToday ? 'text-white' : ''}`}>{day}</p>
                        {events.slice(0, 2).map((e, i) => (
                          <div key={i} className={`text-[9px] font-bold px-1 py-0.5 rounded truncate ${
                            isToday ? 'bg-white/20 text-white' : 'bg-[#2E7D32] text-white'
                          }`}>
                            {e.judul.slice(0, 12)}…
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-3 flex gap-4 text-xs font-bold text-gray-500 px-1">
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#2E7D32] rounded" /> Hari ini</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#E8F5E9] border border-[#2E7D32] rounded" /> Ada acara</div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <h2 className="font-black text-xl mb-4">📋 Agenda Mendatang</h2>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="brutal-card p-4 animate-pulse flex gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-2 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {(upcoming.length ? upcoming : agendaList).slice(0, 8).map((agenda: any) => (
                  <div key={agenda.id} className="brutal-card p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-[#2E7D32] text-white w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border-2 border-[#212121]">
                        <span className="font-black text-sm leading-none">{new Date(agenda.tanggal).getDate()}</span>
                        <span className="text-[9px] font-bold">{new Date(agenda.tanggal).toLocaleDateString('id-ID',{month:'short'})}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-sm leading-tight truncate">{agenda.judul}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-0.5"><Clock size={10} /> {agenda.jam}</span>
                          <span className="flex items-center gap-0.5 truncate"><MapPin size={10} /> {agenda.lokasi}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${kategoriColors[agenda.kategori] ?? 'bg-gray-100 text-gray-600 border-gray-300'}`}>
                      {agenda.kategori}
                    </span>
                  </div>
                ))}
                {agendaList.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Calendar size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="font-bold text-sm">Belum ada agenda</p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
