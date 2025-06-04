import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FileUpload from '../components/FileUpload';
import { useRef } from 'react';
import ProgressBar from '../components/ProgressBar';
import Loader from '../components/Loader';
import FileInfo from '../components/FileInfo';
import { useState } from 'react';
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip, faBolt, faShieldAlt, faLink } from '@fortawesome/free-solid-svg-icons';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

function TypingText({ text, className }) {
  const [displayed, setDisplayed] = React.useState("");
  React.useEffect(() => {
    let i = 0;
    let interval = null;
    let timeout = null;
    const startTyping = () => {
      setDisplayed("");
      i = 0;
      interval = setInterval(() => {
        setDisplayed(t => {
          if (i < text.length) {
            const next = t + text[i];
            i++;
            return next;
          } else {
            clearInterval(interval);
            timeout = setTimeout(startTyping, 2000); // ulangi setelah 2 detik
            return t;
          }
        });
      }, 45);
    };
    startTyping();
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [text]);
  return (
    <h1 className={className} aria-label={text}>
      {displayed}
      <span className="inline-block w-2 animate-pulse">|</span>
    </h1>
  );
}

export default function Home() {
  const fileUploadRef = useRef();
  const [files, setFiles] = useState([]); // list of File
  const [results, setResults] = useState([]); // {fileName, before, after, downloadUrl, status}
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [notif, setNotif] = useState('');
  const [method, setMethod] = useState('ai');

  // Simpan hasil upload file (file_id, name)
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [batchInProgress, setBatchInProgress] = useState(false);

  const handleFiles = (selectedFiles) => {
    setFiles(selectedFiles);
    setResults([]);
    setNotif('');
    setProgress(0);
    setStatus('');
    setUploadedFiles([]);
  };

  const handleProgress = (p, s) => {
    setProgress(p);
    setStatus(s);
  };

  // resultData: {before, after, downloadUrl}, fileName: string
// Setelah upload file, hanya simpan file_id, kompresi dilakukan setelah klik tombol
  const handleResult = async (resultData, fileName) => {
    if (resultData && resultData.file_id) {
      setUploadedFiles(prev => ([...prev, { file_id: resultData.file_id, fileName }]));
      // Tidak langsung kompresi, tunggu user klik tombol
    } else if (resultData === null) {
      setResults(prev => ([
        ...prev.filter(r => r.fileName !== fileName),
        { fileName, status: 'error' }
      ]));
      setNotif('Terjadi error saat upload/kompresi.');
    }
  };

  // Handler untuk tombol Mulai Kompresi
  const handleStartCompression = async () => {
    setBatchInProgress(true);
    setNotif('Memulai batch kompresi...');
    try {
      // Buat payload batch
      const items = uploadedFiles.map(({ file_id }) => ({ file_id, method }));
      const batchRes = await fetch(`${API_BASE}/batch_compress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'demo-key-123',
        },
        body: JSON.stringify({ items }),
      });
      if (!batchRes.ok) throw new Error('Gagal memulai batch kompresi');
      const batchResults = await batchRes.json();
      // batchResults: array of {file_id, status, ...}
      // Polling setiap file_id hingga selesai (jika perlu)
      let resultsArr = [];
      for (const { file_id } of uploadedFiles) {
        let done = false;
        let pollCount = 0;
        let pollResult = null;
        let fileName = uploadedFiles.find(f => f.file_id === file_id)?.fileName || '';
        while (!done && pollCount < 20) {
          await new Promise(res => setTimeout(res, 1200));
          const res = await fetch(`${API_BASE}/result/${file_id}`, {
            headers: { 'x-api-key': 'demo-key-123' }
          });
          console.log(`[Polling] file_id: ${file_id}, attempt: ${pollCount}, status: ${res.status}`);
          if (res.status === 200) {
            pollResult = await res.json();
            console.log(`[Polling Success] file_id: ${file_id}, result:`, pollResult);
            done = true;
          } else if (res.status === 202) {
            pollCount++;
          } else {
            console.warn(`[Polling Error] file_id: ${file_id}, status: ${res.status}`);
            break;
          }
        }
        if (done && pollResult) {
          const absDownloadUrl = pollResult.download_url.startsWith('http') ? pollResult.download_url : `${API_BASE}${pollResult.download_url}`;
          resultsArr.push({
            fileName,
            before: pollResult.size_before,
            after: pollResult.size_after,
            downloadUrl: absDownloadUrl,
            status: 'success',
            method: pollResult.compression_method
          });
        } else {
          console.warn(`[Result Error] file_id: ${file_id}, fileName: ${fileName}, pollResult:`, pollResult);
          resultsArr.push({ fileName, status: 'error' });
        }
      }
      console.log('[Batch Results Final]', resultsArr);
      setResults(resultsArr);
      setNotif('Batch kompresi selesai!');
    } catch (e) {
      setNotif('Gagal melakukan batch kompresi.');
      setResults(uploadedFiles.map(({ fileName }) => ({ fileName, status: 'error' })));
    }
    setBatchInProgress(false);
    setStatus('');
  };

  const handleDownload = async (downloadUrl, fileName) => {
    if (!downloadUrl) return;
    setStatus(`Mengunduh file ${fileName}...`);
    try {
      // Pastikan downloadUrl absolut
      const absDownloadUrl = downloadUrl.startsWith('http') ? downloadUrl : `${API_BASE}${downloadUrl}`;
      const res = await fetch(absDownloadUrl, {
      headers: { 'x-api-key': 'demo-key-123' }
    });
      if (!res.ok) throw new Error('Gagal mengunduh file');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'compressed_file';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setStatus('Unduh selesai!');
      setTimeout(() => setStatus(''), 1000);
    } catch (e) {
      setNotif('Gagal mengunduh file.');
      setStatus('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-2">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[90vh] border border-gray-200 mt-10 mb-10 px-8">
        <Navbar />
        <main className="flex-1 px-8 py-10 flex flex-col gap-8">
          <div className="flex flex-col items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-2">
              <span className="text-5xl animate-bounce">🤖</span>
            </span>
            <TypingText
  text="Think Smart, Shrink Smarter"
  className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-400 drop-shadow-sm tracking-tight mt-2"
/>
            <div className="text-center text-gray-700 text-base md:text-base font-medium mt-2 max-w-xl">Kompresi cerdas berbasis AI. Ukuran file lebih kecil, kualitas dan informasi tetap terjaga. Cocok untuk web, arsip, maupun dokumen sensitif!</div>
          </div>

          <FileUpload
            ref={fileUploadRef}
            onFiles={handleFiles}
            onProgress={handleProgress}
            onResult={handleResult}
            onMethodChange={setMethod}
            disabled={status === 'Mengunggah...' || status === 'Memproses...'}
          />
          {uploadedFiles.length > 0 && (
            <button
              className={`mt-4 mb-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-60`}
              onClick={handleStartCompression}
              disabled={batchInProgress}
            >
              {batchInProgress ? 'Memproses...' : 'Mulai Kompresi'}
            </button>
          )}
          {batchInProgress && <Loader label={status || 'Mengompresi file...'} />}
          {progress > 0 && progress < 100 && (
            <ProgressBar percent={progress} status={status} />
          )}          
{notif && !notif.includes('berhasil') && (
  <div className="flex items-center gap-2 justify-center mt-4 animate-fade-in bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 shadow font-semibold max-w-md mx-auto">
    <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    <span>{notif}</span>
  </div>
)}
          {results.length > 0 && (
            <div className="mt-8">
              {results.map((r, i) => (
                <div key={i} className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl p-4 mb-3 flex flex-col gap-3 shadow-xl border border-blue-200 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800 text-base truncate max-w-[180px]">{r.fileName}</span>
                    {r.status === 'success' && r.downloadUrl && (
                      <button className="bg-blue-600 text-white font-semibold px-4 py-1 rounded-lg hover:bg-blue-700 transition text-sm shadow-lg flex items-center gap-1" onClick={() => handleDownload(r.downloadUrl, r.fileName)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
                        Unduh
                      </button>
                    )}
                    {r.status === 'error' && <span className="text-xs text-gray-400">jpg, jpeg, png, pdf, mp4 (max 500MB)</span>}
                  </div>
                  {r.before && r.after && (
                    <div className="bg-white rounded-xl border border-blue-100 px-4 py-3 mt-2 flex flex-col gap-1">
                      <div className="flex flex-wrap gap-6">
                        <div>
                          <div className="text-xs text-gray-500">Ukuran Sebelum</div>
                          <div className="font-bold text-blue-700">{r.before ? Math.round(r.before / 1024) : '-'} KB</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Ukuran Sesudah</div>
                          <div className="font-bold text-green-600">{r.after ? Math.round(r.after / 1024) : '-'} KB</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Rasio Kompresi</div>
                          <div className="font-bold text-indigo-600">{r.before && r.after ? ((r.after / r.before) * 100).toFixed(1) : '-'}%</div>
                        </div>
                        {r.method && (
                          <div>
                            <div className="text-xs text-gray-500">Metode</div>
                            <div className="font-bold text-blue-500">{r.method === 'gs' ? 'Ghostscript' : r.method}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
        <section className="rounded-2xl py-10 bg-gradient-to-b from-blue-50/60 to-white/80">
          <h2 className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-400 mb-6 text-center drop-shadow-lg">Mengapa Pilih SmartShrink AI?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Card 1 */}
            <div className="rounded-2xl bg-white/70 backdrop-blur ring-1 ring-blue-100 shadow-xl flex flex-col items-center p-8 gap-3 hover:-translate-y-1 hover:shadow-2xl transition">
              <span className="inline-block rounded-full p-3 bg-white/0">
  {/* Minimalis AI chip */}
  <FontAwesomeIcon icon={faMicrochip} className="h-8 w-8 text-pink-500" />
</span>
              <div className="font-extrabold text-lg text-blue-700">Kompresi Kontekstual AI</div>
              <div className="text-base text-gray-700 text-center">Menyesuaikan teknik kompresi dengan tipe dan tujuan file secara otomatis. Untuk file besar, sistem melakukan sampling cerdas pada bagian penting sehingga kualitas tetap optimal dan hasil kompresi tetap efisien.</div>
            </div>
            {/* Card 2 */}
            <div className="rounded-3xl bg-white/70 backdrop-blur ring-1 ring-blue-100 shadow-xl flex flex-col items-center p-8 gap-3 hover:-translate-y-1 hover:shadow-2xl transition">
              <span className="inline-block rounded-full p-3 bg-white/0">
  {/* Minimalis petir */}
  <FontAwesomeIcon icon={faBolt} className="h-8 w-8 text-yellow-500" />
</span>
              <div className="font-extrabold text-lg text-blue-700">Cepat & Efisien</div>
              <div className="text-base text-gray-700 text-center">Proses kompresi super cepat tanpa ribet, hasil langsung bisa diunduh.</div>
            </div>
            {/* Card 3 */}
            <div className="rounded-3xl bg-white/70 backdrop-blur ring-1 ring-blue-100 shadow-xl flex flex-col items-center p-8 gap-3 hover:-translate-y-1 hover:shadow-2xl transition">
              <span className="inline-block rounded-full p-3 bg-white/0">
  {/* Minimalis gembok */}
  <FontAwesomeIcon icon={faShieldAlt} className="h-8 w-8 text-blue-500" />
</span>
              <div className="font-extrabold text-lg text-blue-700">Privasi & Data Aman</div>
              <div className="text-base text-gray-700 text-center">File dihapus otomatis setelah proses, mendukung mode sensitif untuk dokumen penting.</div>
            </div>
            {/* Card 4 */}
            <div className="rounded-3xl bg-white/70 backdrop-blur ring-1 ring-blue-100 shadow-xl flex flex-col items-center p-8 gap-3 hover:-translate-y-1 hover:shadow-2xl transition">
              <span className="inline-block rounded-full p-3 bg-white/0">
  {/* Minimalis integrasi (dots) */}
  <FontAwesomeIcon icon={faLink} className="h-8 w-8 text-purple-500" />
</span>
              <div className="font-extrabold text-lg text-blue-700">Integrasi Mudah</div>
              <div className="text-base text-gray-700 text-center">API & plugin siap pakai untuk pipeline developer dan integrasi aplikasi lain.</div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
