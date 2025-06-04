export default function Custom404() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <p className="text-xl text-white mb-2">Halaman tidak ditemukan.</p>
        <a href="/" className="text-blue-400 underline">Kembali ke Beranda</a>
      </div>
    </div>
  );
}
