# 📂 Struktur Folder Proyek WebPribadi

Dokumen ini memetakan struktur utama dari direktori proyek **KucingAbu Personal Hub** (`WebPribadi`). File dan folder pendukung bawaan Node.js (`node_modules`) sengaja dihilangkan dari visualisasi ini agar struktur utama lebih mudah dibaca.

```text
📦 WebPribadi/
 ┣ 📜 README.md                 # Dokumentasi utama proyek
 ┣ 📜 Hasil Screening.md        # Laporan riwayat pengembangan & refactoring
 ┃
 ┣ 📂 backend/                  # MESIN & API (Golang)
 ┃ ┣ 📂 database/
 ┃ ┃ ┗ 📜 database.go           # Konfigurasi koneksi MySQL & GORM AutoMigrate
 ┃ ┣ 📂 handlers/
 ┃ ┃ ┣ 📜 auth_handler.go       # Logika Login & validasi Admin
 ┃ ┃ ┣ 📜 gallery_handler.go    # CRUD Galeri (Art, Cosplay, AI Art)
 ┃ ┃ ┣ 📜 game_handler.go       # CRUD Gaming (UID, Nickname, dll)
 ┃ ┃ ┣ 📜 playlist_handler.go   # CRUD Mini-Spotify (Upload audio ke Cloudinary)
 ┃ ┃ ┣ 📜 profile_handler.go    # CRUD Profil Utama & Tech Stack
 ┃ ┃ ┗ 📜 vault_handler.go      # CRUD Catatan Rahasia (Vault)
 ┃ ┣ 📂 middleware/
 ┃ ┃ ┣ 📜 auth.go               # Proteksi rute menggunakan JWT Token
 ┃ ┃ ┗ 📜 cors.go               # Mengizinkan akses API dari frontend React
 ┃ ┣ 📂 models/
 ┃ ┃ ┣ 📜 model_database.go     # Skema tabel (Gallery, Game, Profile, Vault, Playlist)
 ┃ ┃ ┗ 📜 model_user.go         # Skema tabel Admin (Username & Password)
 ┃ ┣ 📂 routes/
 ┃ ┃ ┗ 📜 router.go             # Pendaftaran rute API Publik & Protected (Admin)
 ┃ ┣ 📂 services/
 ┃ ┃ ┗ 📜 cloudinary.go         # Servis pengunggah gambar/audio otomatis ke Cloudinary
 ┃ ┣ 📜 .env                    # Variabel rahasia (Kredensial Database & Cloudinary)
 ┃ ┣ 📜 go.mod                  # Daftar dependensi modul Golang
 ┃ ┣ 📜 go.sum                  # Checksum keamanan modul
 ┃ ┗ 📜 main.go                 # Titik masuk (Entry point) server Golang
 ┃
 ┗ 📂 frontend/                 # ANTARMUKA PENGGUNA (React 19 + Vite)
   ┣ 📂 public/
   ┃ ┣ 📜 favicon.svg           # Ikon tab browser
   ┃ ┗ 📜 icons.svg
   ┣ 📂 src/
   ┃ ┣ 📂 assets/               # Gambar statis bawaan
   ┃ ┣ 📂 components/           # Potongan UI Reusable
   ┃ ┃ ┣ 📜 AudioPlayer.jsx     # Widget floating pemutar musik pintar
   ┃ ┃ ┣ 📜 Footer.jsx          # Bagian bawah web (menampilkan link sosmed)
   ┃ ┃ ┣ 📜 Navbar.jsx          # Menu navigasi atas
   ┃ ┃ ┗ 📜 PageLayout.jsx      # Pembungkus halaman dengan efek transisi
   ┃ ┣ 📂 pages/                # Halaman Utama
   ┃ ┃ ┣ 📂 admin/              # KOMPONEN ADMIN MODULAR (Clean Code)
   ┃ ┃ ┃ ┣ 📜 GalleryManager.jsx  # Antarmuka pengelola Galeri
   ┃ ┃ ┃ ┣ 📜 GamesManager.jsx    # Antarmuka pengelola Game
   ┃ ┃ ┃ ┣ 📜 PlaylistManager.jsx # Antarmuka pengelola Lagu
   ┃ ┃ ┃ ┣ 📜 ProfileManager.jsx  # Antarmuka pengelola Profil & Bio
   ┃ ┃ ┃ ┗ 📜 VaultManager.jsx    # Antarmuka pengelola Catatan Kredensial
   ┃ ┃ ┣ 📜 About.jsx           # Halaman Tentang Saya
   ┃ ┃ ┣ 📜 Admin.jsx           # Layout Induk Dasbor Admin
   ┃ ┃ ┣ 📜 Gallery.jsx         # Halaman Publik: Koleksi Karya
   ┃ ┃ ┣ 📜 Gaming.jsx          # Halaman Publik: Profil Game
   ┃ ┃ ┣ 📜 Home.jsx            # Beranda (Bento Grid)
   ┃ ┃ ┗ 📜 Login.jsx           # Halaman pintu masuk (Autentikasi Admin)
   ┃ ┣ 📂 services/
   ┃ ┃ ┗ 📜 api.js              # Jembatan komunikasi data Frontend ke Backend (Axios/Fetch)
   ┃ ┣ 📜 App.jsx               # Pengatur Rute (React Router)
   ┃ ┣ 📜 index.css             # Tailwind CSS & custom styling (Glassmorphism)
   ┃ ┗ 📜 main.jsx              # Titik masuk render React
   ┣ 📜 index.html              # Kerangka HTML utama
   ┣ 📜 package.json            # Daftar dependensi modul NPM
   ┣ 📜 tailwind.config.js      # Konfigurasi utility Tailwind CSS
   ┗ 📜 vite.config.js          # Konfigurasi build tools Vite
```

---

## 🧭 Cara Membaca Struktur Ini
- Jika Anda ingin menambah **fitur baru** (contoh: *Guestbook*), Anda perlu menyentuh:
  1. `backend/models/model_database.go` (Bikin tabel)
  2. `backend/handlers/` (Bikin API)
  3. `backend/routes/router.go` (Buka rute)
  4. `frontend/src/services/api.js` (Bikin fungsi Fetch)
  5. `frontend/src/pages/` (Bikin/edit UI halamannya).

- Folder `frontend/src/pages/admin` sengaja dipisahkan agar file `Admin.jsx` yang menjadi kerangkanya tidak kepenuhan oleh *form* yang bertele-tele. Masing-masing file di dalam sana bertugas mengurus dirinya sendiri (Membaca, Menambah, Mengubah, dan Menghapus).
