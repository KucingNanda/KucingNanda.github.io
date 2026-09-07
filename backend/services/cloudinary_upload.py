import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

# Konfigurasi otomatis diambil dari CLOUDINARY_URL di .env
import cloudinary.api

def upload_image(file_content: bytes, folder: str = "KucingAbu/General") -> str:
    """
    Mengunggah file image (bytes) ke Cloudinary.
    Mengembalikan URL secure (HTTPS).
    """
    try:
        # cloudinary.uploader.upload menerima bytes
        result = cloudinary.uploader.upload(file_content, folder=folder)
        return result.get("secure_url")
    except Exception as e:
        raise Exception(f"Gagal mengunggah gambar ke Cloudinary: {str(e)}")
