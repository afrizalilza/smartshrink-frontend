import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip, faBolt, faShieldAlt, faLink, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

const ACCEPTED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/tiff', 'image/bmp',
  'application/pdf', 'video/mp4',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/zip',
  'application/x-rar-compressed', // .rar
  'application/x-7z-compressed', // .7z
  'application/x-tar', // .tar
  'text/plain',
  'text/csv',
  'application/json',
  'application/xml',
  'text/html'
];
const MAX_SIZE_MB = 500;
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
const ACCEPTED_EXTENSIONS = [
  '.zip', '.rar', '.7z', '.tar',
  '.docx', '.xlsx', '.pptx',
  '.pdf', '.jpg', '.jpeg', '.png', '.webp', '.gif', '.tiff', '.bmp',
  '.txt', '.csv', '.json', '.xml', '.html'
];
const acceptString = [...ACCEPTED_TYPES, ...ACCEPTED_EXTENSIONS].join(',');

const FileUpload = forwardRef(function FileUpload({ onFiles, onProgress, onResult, disabled, onMethodChange }, ref) {
  const [showMethodInfo, setShowMethodInfo] = useState(false);
  
  const [method, setMethod] = useState('ai');
  const [compressionMethods, setCompressionMethods] = useState([]);
  const [selectedMethodDesc, setSelectedMethodDesc] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/compression_methods`)
      .then(res => res.json())
      .then(data => {
        // Ubah label pdf_optimize menjadi Ghostscript (PDF)
        const newData = data.map(m =>
          m.value === 'pdf_optimize'
            ? { ...m, label: 'Ghostscript (PDF)' }
            : m
        );
        // Hapus metode 'auto' dari dropdown
        let filteredData = newData.filter(m => m.value !== 'auto');
        // Urutkan: ai, pdf_optimize, gzip, brotli, webp, lainnya
        const order = ['ai', 'pdf_optimize', 'gzip', 'brotli', 'webp'];
        filteredData = filteredData.sort((a, b) => {
          const ia = order.indexOf(a.value);
          const ib = order.indexOf(b.value);
          if (ia === -1 && ib === -1) return 0;
          if (ia === -1) return 1;
          if (ib === -1) return -1;
          return ia - ib;
        });
        setCompressionMethods(filteredData);
      })
      .catch(() => setCompressionMethods([
        { value: 'ai', label: 'AI (Rekomendasi)', desc: 'Pilih metode kompresi terbaik secara otomatis.' }
      ]));
  }, []);

  useEffect(() => {
    const m = compressionMethods.find(m => m.value === method);
    setSelectedMethodDesc(m ? m.desc : '');
  }, [method, compressionMethods]);
  const fileInput = useRef();
  const [fileList, setFileList] = useState([]);
  const [error, setError] = useState('');
  

  useImperativeHandle(ref, () => ({
    openFileDialog: () => {
      if (!disabled && fileInput.current) fileInput.current.click();
    }
  }));

  function validateFile(file) {
    // Ekstensi yang diizinkan selain cek MIME type
    const allowedExtensions = ['.zip', '.rar', '.7z', '.tar'];
    const fileName = file.name || '';
    const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      setTimeout(() => {
        setError('File arsip seperti ZIP, RAR, 7z, dan TAR biasanya sudah terkompresi optimal. Tidak dilakukan kompresi ulang.');
      }, 0);
    }
    if (!ACCEPTED_TYPES.includes(file.type) && !allowedExtensions.includes(ext)) {
      return `Tipe file tidak didukung. Hanya gambar, PDF, video, dokumen Office, arsip (zip, rar, 7z, tar), dan file teks/markup.`;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `Ukuran file melebihi 500MB. Silakan pilih file yang lebih kecil.`;
    }
    return null;
  }

  async function uploadFiles(files) {
    setError('');
    let validFiles = [];
    for (const file of files) {
      const err = validateFile(file);
      if (err) {
        setError(err);
        continue;
      }
      validFiles.push(file);
    }
    if (validFiles.length === 0) return;
    setFileList(validFiles.map(f => ({ name: f.name, status: 'Mengunggah...' })));
    if (onFiles) onFiles(validFiles);
    // Batch upload
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      try {
        if (onProgress) onProgress(10 + i * (80 / validFiles.length), `Mengunggah: ${file.name}`);
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers: {
            'x-api-key': 'demo-key-123', // Ganti jika API key berbeda
          },
          body: formData,
        });
        if (onProgress) onProgress(60 + i * (30 / validFiles.length), `Memproses: ${file.name}`);
        if (!res.ok) throw new Error('Gagal upload file');
        const data = await res.json();
        setFileList(prev => prev.map(f => f.name === file.name ? { ...f, status: 'Berhasil diupload, siap dikompres' } : f));
        if (onResult) onResult(data, file.name);
      } catch (e) {
        setFileList(prev => prev.map(f => f.name === file.name ? { ...f, status: 'Error' } : f));
        if (e.message.includes('413')) {
          setError(`Gagal upload: file terlalu besar (maksimal 500MB) atau terjadi masalah server.`);
        } else {
          setError(`Gagal upload: ${e.message}`);
        }
        if (onResult) onResult(null, file.name);
      }
    }
    if (onProgress) onProgress(100, 'Tunggu kompresi...');
  }

  function handleDrop(e) {
    e.preventDefault();
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files);
    uploadFiles(files);
  }

  function handleChange(e) {
    if (disabled) return;
    const files = Array.from(e.target.files);
    uploadFiles(files);
  }

  // Jika ada perubahan metode, informasikan ke parent
  function handleMethodChange(e) {
    setMethod(e.target.value);
    if (onMethodChange) onMethodChange(e.target.value);
  }

  return (
    <div>
      <div className="flex flex-col w-full max-w-lg mx-auto mb-4">
        <div className="flex items-center gap-1 mb-2 relative">
          <span className="font-semibold text-blue-700 text-sm">Pilih metode kompresi</span>
          <button
            type="button"
            aria-label="Penjelasan Metode Kompresi"
            className="ml-1 focus:outline-none group"
            onClick={() => setShowMethodInfo(v => !v)}
            tabIndex={0}
          >
            <svg className="h-4 w-4 text-blue-400 group-hover:text-blue-600 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 1 1 5.91 1c0 2-3 3-3 3" />
              <circle cx="12" cy="17" r="1" />
            </svg>
          </button>
          {showMethodInfo && (
            <>
              {/* Backdrop transparan */}
              <div className="fixed inset-0 z-20 bg-black/10" onClick={() => setShowMethodInfo(false)}></div>
              {/* Popover hanya satu */}
              <div className="animate-fade-in absolute z-30 left-0 mt-2 bg-blue-50 border border-blue-200 rounded-xl shadow-xl px-5 py-4 max-w-md w-full flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 1 1 5.91 1c0 2-3 3-3 3" /><circle cx="12" cy="17" r="1" /></svg>
                  <span className="font-bold text-blue-700">Penjelasan Metode Kompresi</span>
                </div>
                <div className="text-xs text-blue-700 mb-2 text-center">{selectedMethodDesc}</div>
                <ul className="text-xs text-blue-500 list-disc pl-4 text-left">
                  <li><b>AI (Otomatis):</b> Sistem akan memilih metode kompresi paling optimal secara otomatis.</li>
                  <li><b>Pilihan lain:</b> Pilih metode manual jika ingin hasil atau format tertentu sesuai kebutuhan file Anda.</li>
                  <li>Hasil, kualitas, dan ukuran file bisa berbeda tergantung metode yang dipilih.</li>
                </ul>
                <button className="mt-3 px-4 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition" onClick={() => setShowMethodInfo(false)}>Tutup</button>
              </div>
            </>
          )}
        </div>
        <select
          id="method-select"
          className="block border border-blue-400 rounded-xl px-5 py-3 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-blue-700 shadow-sm transition mb-5"
          value={method}
          onChange={handleMethodChange}
          disabled={disabled}
        >
          {compressionMethods.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label
                .replace('Auto (Rule-based)', 'Otomatis (Rule-based)')
                .replace('PDF Optimizer (PDF)', 'Optimasi PDF')
                .replace('AI (Otomatis)', 'AI (Otomatis)')
                .replace('Gzip (Text/PDF)', 'Gzip (Text/PDF)')
                .replace('Brotli (Universal)', 'Brotli (Universal)')
                .replace('WebP (Gambar)', 'WebP (Gambar)')
              }
            </option>
          ))}
        </select>


          <div
            className={`border-dashed border-2 rounded-2xl p-8 text-center bg-white/90 mt-1 cursor-pointer shadow-lg transition-all duration-200 border-blue-200 hover:border-blue-400 hover:shadow-2xl ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => !disabled && fileInput.current && fileInput.current.click()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-blue-400 mb-3 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
            <div className="text-gray-700 font-bold text-lg mb-1">Drag & Drop file ke sini</div>
            <div className="text-gray-600 text-base mb-2">atau <span className="underline font-semibold">klik di sini</span> untuk memilih file</div>
            <span className="text-xs text-gray-400 block mb-1">
              jpg, jpeg, png, webp, gif, tiff, bmp, pdf, mp4, docx, xlsx, pptx, zip, rar, 7z, tar, txt, csv, json, xml, html
              <span className="mx-1">|</span> <b>max {MAX_SIZE_MB}MB</b>
            </span>
            <input
              ref={fileInput}
              type="file"
              multiple
              accept={acceptString}
              style={{ display: 'none' }}
              onChange={handleChange}
              disabled={disabled}
            />
          </div>
      </div>
      {fileList.length > 0 && (
        <ul className="mt-5 space-y-4">
          {fileList.map((f, idx) => (
            <li
              key={f.name}
              className="group flex flex-col bg-white/95 rounded-3xl shadow-xl ring-1 ring-blue-100 px-6 py-4 transition-all duration-150 hover:shadow-2xl relative border-0"
            >
              <div className="flex items-center justify-between gap-4 min-w-0">
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-blue-500">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                      <rect x="4" y="4" width="16" height="16" rx="4" fill="#e8f0fe" stroke="#3b82f6" strokeWidth="1.7" />
                      <path d="M8 16h8M8 12h8M8 8h4" stroke="#3b82f6" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="font-semibold text-base text-gray-900 truncate max-w-[180px] md:max-w-[300px]" title={f.name}>{f.name}</span>
                  {f.status === 'Berhasil diupload, siap dikompres' && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200 shadow-sm">
                      <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4" />
                      Upload Sukses
                    </span>
                  )}
                  {f.status === 'Error' && (
                    <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full border border-red-200 shadow-sm">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9.293l-3.293-3.293a1 1 0 10-1.414 1.414L8.586 10.707l-3.293 3.293a1 1 0 001.414 1.414L10 12.414l3.293 3.293a1 1 0 001.414-1.414L11.414 10.707l3.293-3.293a1 1 0 10-1.414-1.414L10 9.293z" clipRule="evenodd" /></svg>
                      Error
                    </span>
                  )}
                  {f.status !== 'Berhasil diupload, siap dikompres' && f.status !== 'Error' && (
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full border border-gray-200 shadow-sm">
                      {f.status.toLowerCase().includes('unggah') ? (
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                      ) : null}
                      {f.status}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="ml-2 p-2 rounded-full hover:bg-slate-200 transition group/btn"
                  aria-label="Hapus file"
                  title="Hapus file"
                  onClick={() => {
                    const newList = [...fileList];
                    newList.splice(idx, 1);
                    setFileList(newList);
                  }}
                >
                  <svg className="h-5 w-5 text-gray-400 group-hover/btn:text-red-500 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              {/* Progress bar jika status upload */}
              {f.status.toLowerCase().includes('unggah') && (
                <div className="h-1 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full mt-3 animate-pulse" />
              )}
            </li>
          ))}
        </ul>
      )}
      {error && <div className="text-red-600 text-xs mt-2">{error}</div>}

    </div>
  );
});

// --- HYDRATION FIX: Render only after client mount ---
const FileUploadWithMountFix = forwardRef(function FileUploadWithMountFix(props, ref) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return <FileUpload {...props} ref={ref} />;
});

export default FileUploadWithMountFix;

