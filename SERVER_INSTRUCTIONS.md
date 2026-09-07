# Panduan Menjalankan Web Pribadi (KucingAbu Hub)

Proyek ini telah sepenuhnya bermigrasi ke **Python (FastAPI)** untuk *backend* dan **React** untuk *frontend*.

## Prasyarat
- Python 3.10 atau lebih baru.
- Node.js (untuk Frontend).

## 1. Menjalankan Backend (Python)
Kini Anda tidak perlu memikirkan kompilasi Golang lagi.

### Cara Manual (Terminal):
Buka terminal (misalnya di VSCode Terminal), dan jalankan:
```bash
cd backend
source .venv/Scripts/activate
python app.py
```

*Catatan: Pastikan jendela terminal Backend tetap terbuka (tidak di-close) selama Anda mengakses website. Jika ada error terkait package (seperti uvicorn/fastapi tidak ditemukan), Anda mungkin perlu menginstal ulang dependencies dengan `pip install -r requirements.txt` dari dalam virtual environment.*

---

## 2. Menjalankan Frontend (React)
Jalankan frontend seperti biasa. Buka tab terminal baru:
```bash
cd frontend
npm run dev
```
Website (UI) Anda akan dapat diakses di `http://localhost:5173`. 
Frontend ini akan secara otomatis terhubung dengan Backend Python di port `8080`.
