# Rencana Implementasi Enkripsi Vault (Gamer Hub)

## 1. Latar Belakang & Masalah
Saat ini, fitur **Vault** (catatan kredensial/password khusus Admin) menyimpan data sensitif seperti `Username` dan `Password` dalam bentuk *plain text* (teks biasa) di dalam database MySQL. Hal ini sangat berisiko; jika database berhasil diretas atau diakses oleh pihak tidak bertanggung jawab, semua kredensial Anda akan terbaca secara langsung.

## 2. Solusi: Server-Side Encryption at Rest (AES-256-GCM)
Kita akan menerapkan enkripsi tingkat militer **AES-256-GCM** (Advanced Encryption Standard dengan Galois/Counter Mode). 
- **Mengapa AES-256-GCM?** Karena ini adalah standar industri terbaik di Golang. Selain mengenkripsi data, mode GCM juga melakukan autentikasi (memastikan data tidak dimanipulasi/diubah secara paksa di dalam database).

## 3. Cara Kerja Sistem Enkripsi
1. **Saat Menyimpan (Create/Update):** 
   Ketika Admin menyimpan data dari *Frontend*, API Golang akan mengambil `password` (dan opsional `notes`), mengenkripsinya dengan kunci rahasia (*secret key*), lalu menyimpan bentuk acaknya (*ciphertext*) ke MySQL.
2. **Saat Menampilkan (Read):** 
   Ketika Admin membuka tab Vault, API Golang akan mengambil *ciphertext* dari database, mendekripsinya kembali menjadi teks asli (*plaintext*) menggunakan kunci rahasia yang sama, lalu mengirimkannya ke *Frontend* (hanya jika JWT Token Admin valid).

## 4. Langkah-Langkah Eksekusi (Action Plan)

### Tahap 1: Setup Kunci Enkripsi (Environment)
- Menambahkan kunci rahasia sepanjang 32 karakter (32 bytes) ke dalam file `.env` di direktori backend.
- Contoh: `VAULT_ENCRYPTION_KEY=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p`

### Tahap 2: Pembuatan Utilitas Kriptografi (Golang)
- Membuat file baru `backend/utils/encryption.go`.
- Menulis fungsi `EncryptAES(text string) (string, error)`
- Menulis fungsi `DecryptAES(cryptoText string) (string, error)`
- Kriptografi ini akan menggunakan *package* bawaan Golang: `crypto/aes` dan `crypto/cipher`.

### Tahap 3: Modifikasi Handler Vault (Golang)
- Mengubah `backend/handlers/vault_handler.go`.
- Pada fungsi `CreateVault` dan `UpdateVault`: Panggil fungsi `EncryptAES` sebelum menyimpan data `Password` ke database.
- Pada fungsi `GetVaults`: Panggil fungsi `DecryptAES` pada setiap data `Password` sebelum mengembalikannya sebagai respons JSON ke *Frontend*.

### Tahap 4: Migrasi Data Lama (Opsional)
- Jika saat ini sudah ada data *Vault* yang tersimpan di database dalam bentuk *plain text*, data tersebut tidak akan bisa didekripsi (karena belum pernah dienkripsi).
- **Solusi:** Kosongkan/hapus data *Vault* lama terlebih dahulu sebelum fitur ini dijalankan, lalu input ulang melalui panel admin agar tersimpan dengan aman menggunakan enkripsi baru.

## 5. Ringkasan Tingkat Keamanan
- **Frontend ke Backend:** Aman (Disarankan menggunakan protokol HTTPS/SSL di produksi).
- **Backend ke Database:** Sangat Aman (Data tersimpan sebagai *ciphertext* yang tidak bisa dibaca tanpa `VAULT_ENCRYPTION_KEY`).
- **Akses API:** Sangat Aman (Dilindungi oleh JWT Login Admin).
