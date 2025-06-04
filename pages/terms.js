export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 py-10">
      <div className="max-w-2xl w-full bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-blue-100 relative">
        <div className="flex flex-col items-center mb-2">
          <span className="inline-block bg-blue-100 p-4 rounded-full shadow-lg mb-2">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8v8H8z"/></svg>
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-1 text-center drop-shadow">Syarat & Ketentuan</h1>
          <div className="w-14 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mb-3"></div>
          <p className="text-blue-900/80 text-center text-base md:text-lg mb-4">Harap baca dan pahami syarat serta ketentuan penggunaan layanan SmartShrink AI.</p>
        </div>
        <div className="bg-blue-50/80 border-l-4 border-blue-400 px-4 py-2 mb-5 rounded shadow-sm text-blue-700 text-sm md:text-base">
          <b>Info Penting:</b> Penggunaan layanan ini tunduk pada aturan API key, rate limit, dan kebijakan privasi yang berlaku.
        </div>
        <ul className="space-y-4 text-gray-700 text-base">

          <li><b>Penggunaan Wajar:</b> Layanan ini hanya boleh digunakan untuk file yang legal dan tidak melanggar hukum yang berlaku.</li>
          <li><b>API Key & Rate Limit:</b> Setiap request ke layanan wajib menggunakan API key yang valid dan tunduk pada rate limit (30 request/menit). Penyalahgunaan API key akan dikenai sanksi pemblokiran atau blacklist.</li>
          <li><b>Batasan Tanggung Jawab:</b> Kami tidak bertanggung jawab atas kerusakan atau kehilangan data akibat penggunaan layanan ini. Selalu simpan salinan file asli Anda.</li>
          <li><b>Batasan File:</b> Ukuran maksimum file yang dapat diunggah adalah 500MB. Jenis file yang didukung: PDF, gambar (jpg, png, webp), video (mp4), dan arsip (zip, rar, 7z, tar).</li>
          <li><b>Perubahan Layanan & Roadmap:</b> Kami berhak mengubah, menambah, atau menghapus fitur layanan dan roadmap pengembangan kapan saja tanpa pemberitahuan sebelumnya.</li>
          <li><b>Integrasi Pihak Ketiga:</b> Jika di masa depan ada plugin atau integrasi eksternal, pengguna wajib membaca dan menyetujui syarat tambahan yang berlaku.</li>
          <li><b>Pelanggaran:</b> Pengguna yang menyalahgunakan layanan akan diblokir tanpa pemberitahuan.</li>
        </ul>
      </div>
    </div>
  );
}
