// Statistik kompresi dinonaktifkan sesuai permintaan. Halaman ini tidak digunakan.
import Footer from '../../components/Footer';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export default function ComparePage() {
  const router = useRouter();
  const { file_id } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!file_id) return;
    fetch(`${API_BASE}/compare/${file_id}`, {
      headers: { 'x-api-key': 'demo-key-123' }
    })
      .then(res => {
        if (!res.ok) throw new Error('Gagal mengambil data statistik');
        return res.json();
      })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [file_id]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-2">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[90vh] border border-gray-200 mt-10 mb-10">
        <Navbar />
        <main className="flex-1 px-8 py-10 flex flex-col gap-8">
          <h1 className="text-3xl font-extrabold mb-2 text-center text-blue-700 drop-shadow-sm tracking-tight">Statistik Kompresi</h1>
          {loading ? (
            <div className="text-center text-gray-500">Memuat statistik...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : data ? (
            <div className="flex flex-col gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow">
                <div className="font-semibold text-base">{data.original_filename}</div>
                <div className="text-xs text-gray-500 mb-2">Metode: <span className="font-bold text-blue-700">{data.compression_method}</span></div>
                <div className="flex flex-col gap-1">
                  <div className="text-xs text-gray-600">Ukuran Sebelum: <span className="font-bold">{data.size_before} bytes</span></div>
                  <div className="text-xs text-gray-600">Ukuran Sesudah: <span className="font-bold">{data.size_after} bytes</span></div>
                  <div className="text-xs text-gray-600">Rasio Kompresi: <span className="font-bold">{data.ratio}</span></div>
                  {data.elapsed && <div className="text-xs text-gray-600">Waktu Kompresi: <span className="font-bold">{data.elapsed} detik</span></div>}
                </div>
                {data.preview_before && <img src={data.preview_before} alt="Preview Sebelum" className="rounded mt-3 max-h-32 mx-auto" />}
                {data.preview_after && <img src={data.preview_after} alt="Preview Sesudah" className="rounded mt-3 max-h-32 mx-auto" />}
                {data.download_url && (
                  <a href={data.download_url.startsWith('http') ? data.download_url : `${API_BASE}${data.download_url}`} target="_blank" rel="noopener noreferrer" download className="block mt-4 bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold shadow hover:bg-blue-700 transition mx-auto text-center w-fit">Download Hasil</a>
                )}
              </div>
            </div>
          ) : null}
        </main>
        <Footer />
      </div>
    </div>
  );
}
