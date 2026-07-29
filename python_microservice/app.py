import os
import json
import asyncio
import datetime
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import genshin
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
    """Mengambil data dari HoYoLAB dan menyimpannya ke file JSON."""
    print(f"[{datetime.datetime.now().strftime('%H:%M:%S')}] Memulai background fetch data Genshin...")
    client = genshin.Client(COOKIES, uid=UID)
    
    try:
        user = await client.get_genshin_user()
        notes = await client.get_genshin_notes()
        
        # Fetch HSR
        client.default_game = genshin.Game.STARRAIL
        client.uid = HSR_UID
        hsr_user = await client.get_starrail_user()
        hsr_notes = await client.get_starrail_notes()
        
        # Fetch HSR Endgame
        try:
            hsr_moc = await client.get_starrail_challenge()
        except Exception:
            hsr_moc = None
            
        try:
            hsr_pf = await client.get_starrail_pure_fiction()
        except Exception:
            hsr_pf = None
            
        try:
            hsr_apc = await client.get_starrail_apc_shadow()
        except Exception:
            hsr_apc = None
            
        try:
            hsr_rogue = await client.get_starrail_rogue()
        except Exception:
            hsr_rogue = None
            
        # --- ZZZ ---
        client.default_game = genshin.Game.ZZZ
        client.uid = int(os.getenv("ZZZ_UID", "0"))
        try:
            zzz_user = await client.get_zzz_user()
        except Exception:
            zzz_user = None
            
        try:
            zzz_notes = await client.get_zzz_notes()
        except Exception:
            zzz_notes = None
        
        payload = {
            "success": True,
            "last_updated": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "data": {
                # Notes (Real-time)
                "current_resin": notes.current_resin,
                "max_resin": notes.max_resin,
                "current_realm_currency": notes.current_realm_currency,
                "max_realm_currency": notes.max_realm_currency,
                "completed_commissions": notes.completed_commissions,
                "max_commissions": notes.max_commissions,
                "remaining_resin_discounts": notes.remaining_resin_discounts,
                "max_resin_discounts": notes.max_resin_discounts,
                "expeditions_count": len(notes.expeditions),
                "max_expeditions": notes.max_expeditions,
                
                # Stats (Account Summary)
                "characters": user.stats.characters,
                "max_friendship": user.stats.max_friendship_characters,
                "achievements": user.stats.achievements,
                "days_active": user.stats.days_active,
                "abyss_floor": user.stats.spiral_abyss,
                "unlocked_waypoints": user.stats.unlocked_waypoints,
                "unlocked_domains": user.stats.unlocked_domains,
                "theater_act": user.stats.theater.max_act if hasattr(user.stats, 'theater') and user.stats.theater else 0,
                "stygian_diff": user.stats.stygian.difficulty if hasattr(user.stats, 'stygian') and user.stats.stygian else 0,
                
                # Oculi
                "anemoculi": user.stats.anemoculi,
                "geoculi": user.stats.geoculi,
                "electroculi": user.stats.electroculi,
                "dendroculi": user.stats.dendroculi,
                "hydroculi": getattr(user.stats, 'hydroculi', 0),
                "pyroculi": getattr(user.stats, 'pyroculi', 0),
                "lunoculi": getattr(user.stats, 'lunoculi', 0),
                
                # Chests
                "common_chests": user.stats.common_chests,
                "exquisite_chests": user.stats.exquisite_chests,
                "precious_chests": user.stats.precious_chests,
                "luxurious_chests": user.stats.luxurious_chests,
                "remarkable_chests": getattr(user.stats, 'remarkable_chests', 0)
            },
            "hsr_data": {
                "current_stamina": hsr_notes.current_stamina,
                "max_stamina": hsr_notes.max_stamina,
                "current_reserve_stamina": getattr(hsr_notes, 'current_reserve_stamina', 0),
                "current_train_score": hsr_notes.current_train_score,
                "max_train_score": hsr_notes.max_train_score,
                "current_rogue_score": hsr_notes.current_rogue_score,
                "max_rogue_score": hsr_notes.max_rogue_score,
                "remaining_weekly_discounts": hsr_notes.remaining_weekly_discounts,
                "max_weekly_discounts": hsr_notes.max_weekly_discounts,
                "expeditions_count": sum(1 for e in hsr_notes.expeditions if e.status == 'Ongoing'),
                "max_expeditions": getattr(hsr_notes, 'total_expedition_num', 0),
                
                "days_active": getattr(hsr_user.stats, 'active_days', 0),
                "characters": getattr(hsr_user.stats, 'avatar_num', 0),
                "achievements": getattr(hsr_user.stats, 'achievement_num', 0),
                "chests": getattr(hsr_user.stats, 'chest_num', 0),
                "stickers": getattr(hsr_user.stats, 'dreamscape_pass_sticker', 0),
                
                # Endgame
                "moc_floor": getattr(hsr_moc, 'max_floor', '-') if hsr_moc else '-',
                "moc_stars": getattr(hsr_moc, 'total_stars', 0) if hsr_moc else 0,
                "moc_is_starward": getattr(hsr_moc, 'starward_stars', 0) > 0 if hsr_moc else False,
                
                "pf_floor": getattr(hsr_pf, 'max_floor', '-') if hsr_pf else '-',
                "pf_stars": getattr(hsr_pf, 'total_stars', 0) if hsr_pf else 0,
                "pf_is_starward": getattr(hsr_pf, 'starward_stars', 0) > 0 if hsr_pf else False,
                
                "apc_floor": getattr(hsr_apc, 'max_floor', '-') if hsr_apc else '-',
                "apc_stars": getattr(hsr_apc, 'total_stars', 0) if hsr_apc else 0,
                "apc_is_starward": getattr(hsr_apc, 'starward_stars', 0) > 0 if hsr_apc else False,
                
                # Simulated Universe
                "su_buffs": getattr(hsr_rogue.basic_info, 'unlocked_buff_num', 0) if hsr_rogue and hasattr(hsr_rogue, 'basic_info') else 0,
                "su_curios": getattr(hsr_rogue.basic_info, 'unlocked_miracle_num', 0) if hsr_rogue and hasattr(hsr_rogue, 'basic_info') else 0,
            },
            "zzz_data": {
                # User Stats
                "active_days": getattr(zzz_user.stats, 'active_days', 0) if zzz_user else 0,
                "agents": getattr(zzz_user.stats, 'avatar_num', getattr(zzz_user.stats, 'character_num', 0)) if zzz_user else 0,
                "proxy_title": getattr(zzz_user.stats, 'inter_knot_reputation', '-') if zzz_user else '-',
                "achievements": getattr(zzz_user.stats, 'achievement_count', 0) if zzz_user else 0,
                "bangboo": getattr(zzz_user.stats, 'bangboo_obtained', 0) if zzz_user else 0,
                "shiyu_defense": getattr(zzz_user.stats, 'shiyu_defense_frontiers', 0) if zzz_user else 0,
                
                # Notes (Real-time)
                "battery_current": zzz_notes.battery_charge.current if zzz_notes and hasattr(zzz_notes, 'battery_charge') else 0,
                "battery_max": zzz_notes.battery_charge.max if zzz_notes and hasattr(zzz_notes, 'battery_charge') else 240,
                "engagement_current": zzz_notes.engagement.current if zzz_notes and hasattr(zzz_notes, 'engagement') else 0,
                "engagement_max": zzz_notes.engagement.max if zzz_notes and hasattr(zzz_notes, 'engagement') else 400,
                "scratch_card_completed": getattr(zzz_notes, 'scratch_card_completed', False) if zzz_notes else False,
                "video_store_state": str(getattr(zzz_notes, 'video_store_state', '')) if zzz_notes else '',
                "coffee_status": str(getattr(zzz_notes, 'card_sign', '')) if zzz_notes else '',
                "hollow_bounty_current": zzz_notes.hollow_zero.bounty_commission.cur_completed if zzz_notes and hasattr(zzz_notes, 'hollow_zero') and hasattr(zzz_notes.hollow_zero, 'bounty_commission') else 0,
                "hollow_bounty_total": zzz_notes.hollow_zero.bounty_commission.total if zzz_notes and hasattr(zzz_notes, 'hollow_zero') and hasattr(zzz_notes.hollow_zero, 'bounty_commission') else 8000,
                "weekly_point_current": zzz_notes.weekly_task.cur_point if zzz_notes and hasattr(zzz_notes, 'weekly_task') else 0,
                "weekly_point_max": zzz_notes.weekly_task.max_point if zzz_notes and hasattr(zzz_notes, 'weekly_task') else 2100,
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

app = FastAPI(title="Genshin Dashboard", lifespan=lifespan)



@app.get("/api/user")
async def get_user_data():
    """Mengembalikan data dengan membaca langsung dari file cache lokal."""
    if not os.path.exists(CACHE_FILE):
        return JSONResponse(
            status_code=503, 
            content={"success": False, "detail": "Cache sedang dibangun (Fetching). Mohon tunggu beberapa detik lalu muat ulang halaman."}
        )
        
    try:
        with open(CACHE_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal membaca cache: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
