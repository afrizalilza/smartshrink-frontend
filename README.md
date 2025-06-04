# SmartShrink AI Frontend

Frontend modern untuk SmartShrink AI. Dibangun dengan:
- Next.js
- Tailwind CSS
- Axios
- React Dropzone

---

## 🚀 Quickstart
```bash
npm install
npm run dev
```

Frontend akan berjalan di [http://localhost:3000](http://localhost:3000)

---

## 🌐 Integrasi Backend
- Pastikan backend FastAPI berjalan di `http://localhost:8000`
- Semua request API (upload, compress, dsb) diarahkan ke backend (lihat [Backend Docs](../backend/README.md))
- Untuk development, bisa gunakan proxy di `next.config.js` jika CORS error

---

## 🔑 Environment
Buat file `.env.local` jika perlu override default:
```
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

---

## 🧑‍💻 Best Practice
- Gunakan komponen UI dari Tailwind/Headless UI
- Pisahkan logic API di `/lib/api.js`
- Untuk custom dashboard, modifikasi `/pages/compare/[file_id].js`

---

> Dokumentasi backend & API lengkap: [../backend/README.md](../backend/README.md)
