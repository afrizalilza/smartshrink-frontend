export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 py-10">
      <div className="max-w-2xl w-full bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-blue-100 relative">
        <div className="flex flex-col items-center mb-2">
          <span className="inline-block bg-blue-100 p-4 rounded-full shadow-lg mb-2">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-1 text-center drop-shadow">Kebijakan Privasi</h1>
          <div className="w-14 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mb-3"></div>
          <p className="text-blue-900/80 text-center text-base md:text-lg mb-4">Privasi Anda adalah prioritas utama kami. Semua proses dan data dijaga dengan standar keamanan terbaik.</p>
        </div>
        <div className="bg-blue-50/80 border-l-4 border-blue-400 px-4 py-2 mb-5 rounded shadow-sm text-blue-700 text-sm md:text-base">
          <b>Info Penting:</b> File asli Anda tidak pernah disimpan lebih lama dari proses kompresi. Metadata teknis hanya untuk kebutuhan log dan troubleshooting.
        </div>
        <ul className="space-y-4 text-gray-700 text-base">

          <li><b>Penghapusan Otomatis:</b> Semua file yang diunggah akan dihapus otomatis dari server setelah proses kompresi selesai. Kami tidak menyimpan file Anda lebih lama dari yang diperlukan.</li>
          <li><b>Penyimpanan Metadata:</b> Kami hanya menyimpan metadata teknis (nama file, ukuran, status, waktu proses, statistik kompresi) untuk keperluan log dan troubleshooting. Tidak ada data sensitif atau isi file yang disimpan.</li>
          <li><b>API Key & Rate Limit:</b> Untuk melindungi layanan dari penyalahgunaan, setiap request wajib menggunakan API key dan tunduk pada rate limit 30 request/menit.</li>
          <li><b>Keamanan Data:</b> Semua transfer file dienkripsi (HTTPS). Sistem kami menerapkan audit log dan monitoring untuk mencegah akses tidak sah.</li>
          <li><b>Hak Pengguna:</b> Anda dapat meminta penghapusan data hasil kompresi dan metadata kapan saja melalui kontak support.</li>
          <li><b>Tidak Ada Analisis Data Pribadi:</b> Kami tidak membaca, menganalisis, atau menggunakan isi file Anda untuk keperluan lain selain proses kompresi.</li>
          <li><b>Tidak Ada Penjualan Data:</b> Data dan file Anda tidak akan pernah dijual atau dibagikan ke pihak ketiga.</li>
          <li><b>Mode Sensitif:</b> Untuk dokumen penting, aktifkan mode sensitif agar file lebih cepat dihapus dan tidak dicatat dalam log.</li>
        </ul>
      </div>
    </div>
  );
}
