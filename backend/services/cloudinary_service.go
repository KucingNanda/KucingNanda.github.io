package services

import (
	"context"
	"fmt"
	"mime/multipart"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

// UploadImageToCloudinary menerima file multipart dan mengunggahnya ke Cloudinary
func UploadImageToCloudinary(fileHeader *multipart.FileHeader) (string, error) {
	// Ambil CLOUDINARY_URL dari environment
	cldURL := os.Getenv("CLOUDINARY_URL")
	if cldURL == "" {
		return "", fmt.Errorf("CLOUDINARY_URL belum dikonfigurasi di .env")
	}

	// Inisialisasi Cloudinary instance
	cld, err := cloudinary.NewFromURL(cldURL)
	if err != nil {
		return "", fmt.Errorf("gagal inisialisasi cloudinary: %v", err)
	}

	// Buka file yang diunggah
	file, err := fileHeader.Open()
	if err != nil {
		return "", fmt.Errorf("gagal membuka file upload: %v", err)
	}
	defer file.Close()

	// Unggah file ke folder "webpribadi_gallery" di Cloudinary (mendukung gambar dan audio)
	ctx := context.Background()
	resp, err := cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder:       "webpribadi_gallery",
		ResourceType: "auto",
	})

	if err != nil {
		return "", fmt.Errorf("gagal unggah ke cloudinary: %v", err)
	}

	// Kembalikan secure URL gambar
	return resp.SecureURL, nil
}
