import os
import json
import asyncio
import datetime
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

data_dir = os.path.join(BASE_DIR, "data")
CACHE_FILE = os.path.join(data_dir, "genshin_cache.json")

# Memastikan folder data ada
os.makedirs(data_dir, exist_ok=True)

# Kredensial dari .env
COOKIES = {
    "ltuid_v2": int(os.getenv("LTUID_V2", "0")), 
    "ltoken_v2": os.getenv("LTOKEN_V2", "")
}
UID = int(os.getenv("GENSHIN_UID", "0"))
HSR_UID = int(os.getenv("HSR_UID", "0"))
FETCH_INTERVAL_SECONDS = 1800 # 30 Menit

async def fetch_and_cache():
    """Mengambil data dari HoYoLAB dan menyimpannya ke file JSON (via Custom Client)."""
    print(f"[{datetime.datetime.now().strftime('%H:%M:%S')}] Memulai background fetch data Genshin (Custom Client)...")
    
    try:
        from services.hoyolab_client import CustomHoyolabClient
        client = CustomHoyolabClient(COOKIES["ltuid_v2"], COOKIES["ltoken_v2"])
        
        # --- Genshin Impact ---
        user = await client.get_genshin_user(UID)
        notes = await client.get_genshin_notes(UID)
        
        # --- HSR ---
        try:
            hsr_user = await client.get_starrail_user(HSR_UID)
            hsr_notes = await client.get_starrail_notes(HSR_UID)
        except Exception:
            hsr_user, hsr_notes = {}, {}
            
        try:
            hsr_moc = await client.get_starrail_challenge(HSR_UID)
        except Exception:
            hsr_moc = {}
            
        try:
            hsr_pf = await client.get_starrail_pure_fiction(HSR_UID)
        except Exception:
            hsr_pf = {}
            
        try:
            hsr_apc = await client.get_starrail_apc_shadow(HSR_UID)
        except Exception:
            hsr_apc = {}
            
        try:
            hsr_rogue = await client.get_starrail_rogue(HSR_UID)
        except Exception:
            hsr_rogue = {}
            
        # --- ZZZ ---
        zzz_uid = int(os.getenv("ZZZ_UID", "0"))
        try:
            zzz_user = await client.get_zzz_user(zzz_uid)
        except Exception:
            zzz_user = {}
            
        try:
            zzz_notes = await client.get_zzz_notes(zzz_uid)
        except Exception:
            zzz_notes = {}
        
        # MAPPING JSON MURNI
        gs_stats = user.get("stats", {})
        hsr_stats = hsr_user.get("stats", {})
        zzz_stats = zzz_user.get("stats", {})
        
        payload = {
            "success": True,
            "last_updated": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                # Notes (Real-time)
                "current_resin": notes.get("current_resin", 0),
                "max_resin": notes.get("max_resin", 200),
                "current_realm_currency": notes.get("current_home_coin", 0),
                "max_realm_currency": notes.get("max_home_coin", 2400),
                "completed_commissions": notes.get("daily_task", {}).get("finished_num", 0),
                "max_commissions": notes.get("daily_task", {}).get("total_num", 4),
                "remaining_resin_discounts": notes.get("remain_resin_discount_num", 0),
                "max_resin_discounts": notes.get("resin_discount_num_limit", 3),
                "expeditions_count": notes.get("current_expedition_num", 0),
                "max_expeditions": notes.get("max_expedition_num", 5),
                
                # Stats (Account Summary)
                "characters": gs_stats.get("avatar_number", 0),
                "max_friendship": gs_stats.get("full_fetter_avatar_num", 0),
                "achievements": gs_stats.get("achievement_number", 0),
                "days_active": gs_stats.get("active_day_number", 0),
                "abyss_floor": gs_stats.get("spiral_abyss", "-"),
                "unlocked_waypoints": gs_stats.get("way_point_number", 0),
                "unlocked_domains": gs_stats.get("domain_number", 0),
                "theater_act": gs_stats.get("role_combat", {}).get("max_round_id", 0) if isinstance(gs_stats.get("role_combat"), dict) else 0,
                "stygian_diff": gs_stats.get("hard_challenge", {}).get("difficulty", 0) if isinstance(gs_stats.get("hard_challenge"), dict) else 0,
                
                # Oculi
                "anemoculi": gs_stats.get("anemoculus_number", 0),
                "geoculi": gs_stats.get("geoculus_number", 0),
                "electroculi": gs_stats.get("electroculus_number", 0),
                "dendroculi": gs_stats.get("dendroculus_number", 0),
                "hydroculi": gs_stats.get("hydroculus_number", 0),
                "pyroculi": gs_stats.get("pyroculus_number", 0),
                "lunoculi": gs_stats.get("moonoculus_number", gs_stats.get("lunoculi", 0)),
                
                # Chests
                "common_chests": gs_stats.get("common_chest_number", 0),
                "exquisite_chests": gs_stats.get("exquisite_chest_number", 0),
                "precious_chests": gs_stats.get("precious_chest_number", 0),
                "luxurious_chests": gs_stats.get("luxurious_chest_number", 0),
                "remarkable_chests": gs_stats.get("magic_chest_number", 0)
            },
            "hsr_data": {
                "current_stamina": hsr_notes.get("current_stamina", 0),
                "max_stamina": hsr_notes.get("max_stamina", 240),
                "current_reserve_stamina": hsr_notes.get("current_reserve_stamina", 0),
                "current_train_score": hsr_notes.get("current_train_score", 0),
                "max_train_score": hsr_notes.get("max_train_score", 0),
                "current_rogue_score": hsr_notes.get("current_rogue_score", 0),
                "max_rogue_score": hsr_notes.get("max_rogue_score", 0),
                "remaining_weekly_discounts": hsr_notes.get("remaining_weekly_discounts", 0),
                "max_weekly_discounts": hsr_notes.get("max_weekly_discounts", 3),
                "expeditions_count": len([e for e in hsr_notes.get("expeditions", []) if e.get("status") == "Ongoing"]),
                "max_expeditions": hsr_notes.get("total_expedition_num", 4),
                
                "days_active": hsr_stats.get("active_days", 0),
                "characters": hsr_stats.get("avatar_num", 0),
                "achievements": hsr_stats.get("achievement_num", 0),
                "chests": hsr_stats.get("chest_num", 0),
                "stickers": hsr_stats.get("dream_paster_num", 0),
                
                # Endgame
                "moc_floor": hsr_moc.get("max_floor", "-") if hsr_moc.get("max_floor") else "-",
                "moc_stars": hsr_moc.get("total_stars", 0) if hsr_moc else 0,
                "moc_is_starward": hsr_moc.get("total_stars", 0) >= 36 if hsr_moc else False,
                
                "pf_floor": hsr_pf.get("max_floor", "-") if hsr_pf.get("max_floor") else "-",
                "pf_stars": hsr_pf.get("total_stars", 0) if hsr_pf else 0,
                "pf_is_starward": hsr_pf.get("total_stars", 0) >= 12 if hsr_pf else False,
                
                "apc_floor": hsr_apc.get("max_floor", "-") if hsr_apc.get("max_floor") else "-",
                "apc_stars": hsr_apc.get("total_stars", 0) if hsr_apc else 0,
                "apc_is_starward": hsr_apc.get("total_stars", 0) >= 12 if hsr_apc else False,
                
                # Simulated Universe
                "su_buffs": hsr_rogue.get("basic_info", {}).get("unlocked_buff_num", 0) if isinstance(hsr_rogue, dict) else 0,
                "su_curios": hsr_rogue.get("basic_info", {}).get("unlocked_miracle_num", 0) if isinstance(hsr_rogue, dict) else 0,
            },
            "zzz_data": {
                # User Stats
                "active_days": zzz_stats.get("active_days", 0),
                "agents": zzz_stats.get("avatar_num", zzz_stats.get("character_num", 0)),
                "proxy_title": "-", # The API might not return this, we can set default
                "achievements": zzz_stats.get("achievement_count", 0),
                "bangboo": zzz_stats.get("buddy_num", 0),
                "shiyu_defense": zzz_stats.get("shiyu_defense_frontiers", 0),
                
                # Notes (Real-time)
                "battery_current": zzz_notes.get("energy", {}).get("progress", {}).get("current", 0) if isinstance(zzz_notes.get("energy"), dict) else 0,
                "battery_max": zzz_notes.get("energy", {}).get("progress", {}).get("max", 240) if isinstance(zzz_notes.get("energy"), dict) else 240,
                "engagement_current": zzz_notes.get("vitality", {}).get("progress", {}).get("current", 0) if isinstance(zzz_notes.get("vitality"), dict) else 0,
                "engagement_max": zzz_notes.get("vitality", {}).get("progress", {}).get("max", 400) if isinstance(zzz_notes.get("vitality"), dict) else 400,
                "scratch_card_completed": zzz_notes.get("card_sign", {}).get("status") == "IsSign" if isinstance(zzz_notes.get("card_sign"), dict) else False,
                "video_store_state": zzz_notes.get("vhs_sale", {}).get("sale_state", "") if isinstance(zzz_notes.get("vhs_sale"), dict) else "",
                "coffee_status": zzz_notes.get("coffee", {}).get("status", "") if isinstance(zzz_notes.get("coffee"), dict) else "",
                "hollow_bounty_current": 0,
                "hollow_bounty_total": 8000,
                "weekly_point_current": 0,
                "weekly_point_max": 2100,
            }
        }
        
        # Simpan ke file cache lokal
        with open(CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(payload, f, indent=4)
            
        print(f"[{datetime.datetime.now().strftime('%H:%M:%S')}] Cache berhasil diperbarui!")
        
    except Exception as e:
        print(f"[{datetime.datetime.now().strftime('%H:%M:%S')}] Gagal menarik data: {e}")

async def background_task_loop():
    while True:
        await fetch_and_cache()
        await asyncio.sleep(FETCH_INTERVAL_SECONDS)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Dijalankan saat server mulai
    # Mulai proses fetch di background
    task = asyncio.create_task(background_task_loop())
    yield
    # Dijalankan saat server dimatikan
    task.cancel()

app = FastAPI(title="KucingAbu Hub API", lifespan=lifespan)

# Setup CORS (seperti Golang Fiber)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import Routers
from routers.auth import router as auth_router
from routers.games import router as games_router
from routers.gallery import router as gallery_router
from routers.profile import router as profile_router
from routers.vault import router as vault_router
from routers.analytics import router as analytics_router
from routers.hoyoverse import router as hoyoverse_router

app.include_router(auth_router, prefix="/api")
app.include_router(games_router, prefix="/api")
app.include_router(gallery_router, prefix="/api")
app.include_router(profile_router, prefix="/api")
app.include_router(vault_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")
app.include_router(hoyoverse_router, prefix="/api")

@app.get("/api/ping")
def ping():
    return {"message": "pong"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8080, reload=True, access_log=False)
