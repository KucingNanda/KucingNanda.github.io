import asyncio
import os
import genshin

async def main():
    import dotenv
    dotenv.load_dotenv(dotenv_path='D:/NandaSR/WebPribadi/python_microservice/.env')
    
    cookies = {
        "ltuid_v2": int(os.getenv("LTUID_V2", "0")), 
        "ltoken_v2": os.getenv("LTOKEN_V2", "")
    }
    zzz_uid = int(os.getenv("ZZZ_UID", "0"))
    
    client = genshin.Client(cookies)
    client.default_game = genshin.Game.ZZZ
    client.uid = zzz_uid
    
    try:
        zzz_user = await client.get_zzz_user()
        zzz_notes = await client.get_zzz_notes()
        
        payload = {
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
                "hollow_bounty_current": zzz_notes.hollow_zero.bounty_commission.cur_completed if zzz_notes and hasattr(zzz_notes, 'hollow_zero') and hasattr(zzz_notes.hollow_zero, 'bounty_commission') else 0,
                "hollow_bounty_total": zzz_notes.hollow_zero.bounty_commission.total if zzz_notes and hasattr(zzz_notes, 'hollow_zero') and hasattr(zzz_notes.hollow_zero, 'bounty_commission') else 8000,
            }
        }
        print("PAYLOAD:", payload)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    asyncio.run(main())
