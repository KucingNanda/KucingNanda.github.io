import os
import json
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

# Menunjuk ke cache JSON yang dibuat oleh background task
CACHE_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "genshin_cache.json")

@router.get("/hoyoverse")
def get_hoyoverse_data():
    """Mengembalikan data dari cache lokal (sama seperti microservice lama)"""
    if not os.path.exists(CACHE_FILE):
        return JSONResponse(
            status_code=503, 
            content={"success": False, "detail": "Cache sedang dibangun. Mohon tunggu."}
        )
        
    try:
        with open(CACHE_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "detail": f"Gagal membaca cache: {str(e)}"}
        )
