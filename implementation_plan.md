# Rencana Integrasi Cloudinary (Image Uploader)

Fitur ini akan mengubah cara Admin memasukkan gambar ke dalam Galeri. Daripada *copy-paste* link gambar dari luar, Anda kini bisa langsung mengunggah gambar (*upload file*) dari perangkat lokal Anda. Gambar akan dikirim ke **Cloudinary** (layanan Cloud Storage gratis yang andal), dan *link* aslinya akan disimpan ke *database* secara otomatis.

## Proposed Changes

### 1. Backend (Golang Fiber)
Kita akan menginstal SDK resmi Cloudinary untuk Golang: `github.com/cloudinary/cloudinary-go/v2`.

#### [NEW] `utils/cloudinary.go`
- Membuat fungsi konfigurasi awal ke Cloudinary menggunakan variabel *environment* `CLOUDINARY_URL`.
- Membuat fungsi `UploadImage(file)` yang bertugas mengunggah file yang diterima dari Frontend ke server Cloudinary, lalu mengembalikan *Secure URL*.

#### [MODIFY] `handlers/gallery_handler.go`
- **CreateGallery & UpdateGallery**: Mengubah cara penerimaan data dari `JSON` menjadi `multipart/form-data` agar bisa menerima *file* fisik.
- Logika baru: Jika ada *file* gambar yang dilampirkan, *backend* akan mengirimkannya ke Cloudinary terlebih dahulu, mengambil *URL*-nya, lalu menyimpannya ke tabel `Gallery` di MySQL.

#### [MODIFY] `.env` & `main.go`
- Menambahkan variabel `CLOUDINARY_URL=cloudinary://<API_KEY>:<API_SECRET>@<CLOUD_NAME>` ke file `.env`. (Kredensial ini akan Anda dapatkan setelah mendaftar di Cloudinary).

### 2. Frontend (React & Vite)
Kita harus menyesuaikan form Admin agar bisa mengirim *file* fisik.

#### [MODIFY] `src/services/api.js`
- Mengubah `apiService` agar lebih pintar. Jika data yang dikirim adalah *instance* dari `FormData` (mengandung file), maka API tidak akan memaksa *header* `Content-Type: application/json`. *Browser* akan secara otomatis mengatur *header* menjadi `multipart/form-data` dengan *boundary* yang tepat.

#### [MODIFY] `src/pages/Admin.jsx`
- Mengubah kotak input `image_url` pada form *Gallery* menjadi `<input type="file" accept="image/*" />`.
- Menambahkan fitur **Image Preview**: Saat Anda memilih gambar dari laptop, akan muncul *preview* kecil gambar tersebut di atas form sebelum tombol *Submit* ditekan.
- Mengubah fungsi `handleSubmit` khusus untuk *Gallery* agar membungkus `title`, `category`, `tags`, dan `file` ke dalam wujud `FormData`.

## User Review Required

> [!IMPORTANT]
> **Kredensial Cloudinary**
> Untuk mewujudkan ini, saya akan membutuhkan *Cloudinary URL* Anda. Jika Anda belum memiliki akun, silakan daftar secara gratis di [Cloudinary.com](https://cloudinary.com). Setelah *login*, di halaman *Dashboard* Anda akan menemukan **API Environment variable** (`CLOUDINARY_URL=...`). 
> 
> *Saran: Anda tidak perlu menuliskannya di obrolan ini demi keamanan. Setelah saya selesai mengoding semuanya, saya akan meminta Anda untuk memasukkan kode tersebut secara mandiri ke file `.env` rahasia Anda.*

> [!WARNING]
> **Edit / Update Gambar**
> Jika nanti Anda ingin meng-*edit* data Galeri (misalnya sekadar mengubah judul tanpa mengganti gambar), form harus pintar untuk **tidak menghapus gambar lama**. Saya akan merancang agar *file input* bersifat opsional saat sedang dalam mode *Edit*.

Silakan tinjau rencana ini. Jika disetujui, saya akan mulai melakukan instalasi paket Cloudinary di Golang dan merombak sistem formnya!
