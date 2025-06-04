import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const steps = [
  {
    icon: (
      <svg className="h-9 w-9 text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.828A2 2 0 0 0 21.414 8l-5.242-5.242A2 2 0 0 0 14.172 2H4zm0 2h10v4a2 2 0 0 0 2 2h4v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6z"/></svg>
    ),
    title: 'Unggah File',
    desc: 'Pilih atau drag & drop file yang ingin dikompresi.'
  },
  {
    icon: (
      <svg className="h-9 w-9 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><circle cx="11" cy="11" r="7" stroke="#2563eb" strokeWidth="2" fill="#dbeafe"/><rect x="17" y="17" width="5" height="2" rx="1" fill="#2563eb" transform="rotate(45 17 17)"/><circle cx="11" cy="11" r="3" fill="#60a5fa"/></svg>
    ),
    title: 'Analisis Otomatis',
    desc: 'SmartShrink AI menganalisis dan memilih metode kompresi terbaik.'
  },
  {
    icon: (
      <svg className="h-9 w-9 text-orange-400" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15,14 12,12 9,14" fill="#f59e42"/><polygon points="12,22 15,10 12,12 9,10" fill="#fbbf24"/></svg>
    ),
    title: 'Proses Kompresi',
    desc: 'File Anda diproses secara cepat dan aman di server.'
  },
  {
    icon: (
      <svg className="h-9 w-9 text-pink-400" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="4" fill="#fce7f3"/><path d="M7 16l3-3 2 2 5-5" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: 'Hasil Kompresi',
    desc: 'Lihat perbandingan ukuran sebelum & sesudah.'
  },
  {
    icon: (
      <svg className="h-9 w-9 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="17" width="16" height="4" rx="2" fill="#dbeafe"/></svg>
    ),
    title: 'Unduh File',
    desc: 'Download file hasil kompresi dalam sekali klik.'
  },
  {
    icon: (
      <svg className="h-9 w-9 text-slate-500" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="8" rx="2" fill="#64748b"/><rect x="9" y="15" width="6" height="4" rx="1" fill="#cbd5e1"/><rect x="8" y="7" width="8" height="6" rx="4" fill="#64748b"/><circle cx="12" cy="10" r="2" fill="#fff"/></svg>
    ),
    title: 'Privasi Terjamin',
    desc: 'File Anda langsung dihapus setelah proses selesai.'
  },
];

export default function HowItWork() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-2">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[90vh] border border-gray-200 mt-8 mb-8 px-8">
        <Navbar />
        <main className="flex-1 px-6 py-8 flex flex-col gap-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-blue-700 to-blue-400 text-transparent bg-clip-text drop-shadow mb-8">Cara Kerja SmartShrink AI</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {steps.map((step, i) => (
              <div key={i} className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-blue-100 shadow-xl p-7 flex flex-col items-center text-center gap-3 transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
                <div>{step.icon}</div>
                <div className="font-bold text-lg text-blue-800">{step.title}</div>
                <div className="text-sm text-gray-700">{step.desc}</div>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
