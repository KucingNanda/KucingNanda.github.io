# Integrasi Genshin API ke Arsitektur Golang + Node.js (Microservice)

Rencana ini menjelaskan bagaimana kita akan mengintegrasikan library `genshin.py` ke dalam ekosistem project Anda yang sudah ada (Golang Fiber + Node.js). Karena perbedaan bahasa pemrograman, kita akan membangun sebuah **Python Microservice** yang ringan menggunakan `FastAPI`. Microservice ini bertugas menjembatani komunikasi antara server Golang Anda dengan server HoYoLAB.

> [!NOTE]
> **Alur Komunikasi (Data Flow):**
> Node.js (Browser/UI) ➔ Golang Fiber (Backend) ➔ Python FastAPI (Microservice) ➔ HoYoLAB API

## Open Questions

Sebelum kita mulai mengeksekusi rencana ini, ada beberapa pertanyaan desain yang perlu Anda konfirmasi:

> [!IMPORTANT]
> 1. **Lokasi Project:** Di mana *path* (lokasi folder) project Golang Fiber dan Node.js Anda saat ini berada?
> 2. **Struktur Folder:** Apakah Anda ingin membuat folder khusus untuk microservice Python ini (misalnya `D:\Jejak Tugas\Python\GenshinMicroservice`), atau digabungkan ke dalam folder project Anda yang sudah ada?
> 3. **Target Data:** Data spesifik apa yang *pertama kali* ingin Anda tampilkan di halaman web Anda? (Misalnya: Sisa Resin, Statistik Akun Dasar, atau Daftar Karakter).

## Proposed Changes

Implementasi ini akan dibagi menjadi 3 komponen utama.

---

### Komponen 1: Python Microservice (FastAPI)

Kita akan membuat API internal kecil yang didedikasikan murni untuk menangani logic `genshin.py`.

#### [NEW] `python_microservice/main.py`
File utama untuk menjalankan server FastAPI. File ini akan:
- Menginisiasi instance `genshin.Client` menggunakan `ltuid_v2` dan `ltoken_v2`.
- Membuka endpoint `GET /genshin/user/{uid}` untuk mengambil data user.
- Membuka endpoint `GET /genshin/notes/{uid}` untuk mengambil data *real-time* seperti Resin.

#### [NEW] `python_microservice/requirements.txt`
Daftar library yang dibutuhkan: `fastapi`, `uvicorn` (server), `genshin`, dan `python-dotenv`.

---

### Komponen 2: Golang Fiber (API Gateway / Backend Utama)

Golang bertugas sebagai jembatan yang menghubungkan keamanan (CORS/Autentikasi) dan merapikan data sebelum dikirim ke Frontend.

#### [NEW/MODIFY] `go_backend/handlers/genshin_handler.go`
(Nama file disesuaikan dengan struktur project Go Anda).
- Membuat HTTP Client (bisa menggunakan `fiber.AcquireAgent()` bawaan Fiber) untuk melempar request (HTTP GET) dari Go ke URL `http://localhost:8000/...` (alamat port FastAPI).
- Meneruskan *response JSON* dari FastAPI kembali ke frontend Node.js.

---

### Komponen 3: Node.js (Frontend UI)

Membangun tampilan dashboard interaktif. (Bisa menggunakan React/Vue/Svelte atau murni HTML/JS dari Node.js).

#### [NEW/MODIFY] `frontend/src/pages/GenshinDashboard.js`
- Menggunakan `fetch` atau `axios` untuk menembak endpoint Golang Fiber (bukan langsung ke Python/HoYoLAB agar tidak terkena isu CORS).
- Membuat UI (User Interface) berupa Card elegan untuk menampilkan Total Karakter, Hari Aktif, dan Pencapaian.

## Verification Plan

Untuk memastikan semuanya berjalan dengan baik, verifikasi akan dilakukan dalam tahapan berikut:

### Manual Verification
1. **Test Microservice:** Menjalankan server Python dengan `uvicorn main:app --port 8000` dan memastikan endpoint bisa diakses via browser lokal.
2. **Test Bridge (Jembatan):** Menjalankan server Golang, menembak endpoint Golang via Postman atau Terminal, dan memastikan ia berhasil me-return data yang diambil dari Python.
3. **Test UI:** Membuka UI web dari Node.js dan memastikan datanya berhasil di-*render* di layar dengan tampilan yang sesuai.
