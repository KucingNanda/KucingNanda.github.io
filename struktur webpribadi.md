# 📂 Struktur Folder KucingAbu Hub (WebPribadi)

Dokumentasi ini menjelaskan hierarki dan fungsi dari masing-masing folder dalam proyek Anda. Ini sangat berguna jika Anda ingin menelusuri atau memodifikasi fitur tertentu di masa depan.

---

## 🌳 Hierarki Direktori

```text
D:\NandaSR\WebPribadi\
│
├── 📁 backend/                 # ⚙️ Mesin Server (Golang & Fiber)
│   ├── 📁 database/            # Logika koneksi MySQL (GORM) & seeder default
│   ├── 📁 handlers/            # Pengendali logika API (Controllers)
│   ├── 📁 middleware/          # Sistem gerbang masuk (Auth JWT & CORS)
│   ├── 📁 models/              # Definisi tabel database (Structs)
│   ├── 📁 routes/              # Daftar jalur URL/Endpoint API
│   ├── 📁 services/            # Layanan eksternal (Integrasi Cloudinary)
│   ├── 📁 utils/               # Fungsi bantuan (Enkripsi Bcrypt, Hash)
│   ├── 📄 main.go              # Titik awal berjalannya server Golang
│   ├── 📄 go.mod / go.sum      # Daftar pustaka (library) Golang
│   └── 📄 .env                 # Konfigurasi rahasia (Kunci JWT & Database)
│
├── 📁 frontend/                # 💻 Antarmuka Pengguna (React & Vite)
│   ├── 📁 public/              # Aset statis dasar (ikon, gambar logo)
│   ├── 📁 src/
│   │   ├── 📁 components/      # Kepingan UI yang bisa dipakai ulang (Navbar, Footer)
│   │   ├── 📁 pages/           # Halaman utama website
│   │   │   ├── 📁 admin/       # Sub-halaman manajer khusus panel Admin
│   │   │   ├── 📄 Home.jsx     # Halaman Dashboard Utama
│   │   │   ├── 📄 Admin.jsx    # Halaman Induk Admin Panel
│   │   │   ├── 📄 Login.jsx    # Halaman Masuk Admin
│   │   │   └── ...             # Halaman lain (Gallery, Gaming, About)
│   │   ├── 📁 services/        # Jalur komunikasi ke Backend (api.js)
│   │   ├── 📁 utils/           # Fungsi UI (Konfigurasi SweetAlert2 dll)
│   │   ├── 📄 App.jsx          # Pengaturan Router navigasi utama
│   │   ├── 📄 main.jsx         # Titik awal berjalannya React
│   │   └── 📄 index.css        # Gaya dasar Tailwind (Global CSS)
│   │
│   ├── 📄 tailwind.config.js   # Aturan desain dan warna tema Tailwind
│   ├── 📄 vite.config.js       # Pengaturan *bundler* pengembangan
│   └── 📄 package.json         # Daftar pustaka (library) JavaScript/React
│
└── 📄 README.md                # Dokumentasi dasar panduan instalasi
```

## 🔍 Cara Menemukan File dengan Cepat
- **Ingin mengubah warna atau layout utama?** Cek `frontend/tailwind.config.js` atau `index.css`.
- **Ingin mengubah isi tabel database?** Cek `backend/models/model_database.go`.
- **Ingin menambahkan fitur di halaman depan?** Cek `frontend/src/pages/Home.jsx`.
- **Ingin mengganti alert pop-up?** Cek `frontend/src/utils/alert.js`.
- **Ingin mengatur kunci API atau pengaturan koneksi?** Cek `backend/.env`.
