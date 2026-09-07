import hashlib
import time
import random
import string
import httpx
from typing import Optional

class CustomHoyolabClient:
    def __init__(self, ltuid: int, ltoken: str):
        self.ltuid = str(ltuid)
        self.ltoken = ltoken
        self.cookies = {
            "ltuid_v2": self.ltuid,
            "ltoken_v2": self.ltoken
        }
        self.headers = {
            "x-rpc-app_version": "1.5.0",
            "x-rpc-client_type": "5",
            "x-rpc-language": "en-us"
        }
        
    def generate_ds(self) -> str:
        """Generate DS Token (Dynamic Secret) for HoYoLAB API (v1)."""
        salt = "6s25p5ox5y14umn1p61aqyyvbvvl3lrt"
        t = int(time.time())
        r = "".join(random.choices(string.ascii_letters + string.digits, k=6))
        
        text = f"salt={salt}&t={t}&r={r}"
        m = hashlib.md5(text.encode()).hexdigest()
        
        return f"{t},{r},{m}"
        
    async def _request(self, url: str, params: dict = None) -> dict:
        headers = self.headers.copy()
        headers["DS"] = self.generate_ds()
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, headers=headers, cookies=self.cookies)
            response.raise_for_status()
            data = response.json()
            
            if data.get("retcode", 0) != 0:
                raise Exception(f"HoYoLAB API Error: {data.get('message', 'Unknown Error')} (retcode: {data.get('retcode')})")
                
            return data["data"]

    # --- Genshin Impact ---
    async def get_genshin_user(self, uid: int) -> dict:
        url = "https://bbs-api-os.hoyolab.com/game_record/genshin/api/index"
        params = {"server": "os_asia", "role_id": uid}
        return await self._request(url, params)

    async def get_genshin_notes(self, uid: int) -> dict:
        url = "https://bbs-api-os.hoyolab.com/game_record/genshin/api/dailyNote"
        params = {"server": "os_asia", "role_id": uid}
        return await self._request(url, params)
        
    # --- Honkai: Star Rail ---
    async def get_starrail_user(self, uid: int) -> dict:
        url = "https://bbs-api-os.hoyolab.com/game_record/hkrpg/api/index"
        params = {"server": "prod_official_asia", "role_id": uid}
        return await self._request(url, params)

    async def get_starrail_notes(self, uid: int) -> dict:
        url = "https://bbs-api-os.hoyolab.com/game_record/hkrpg/api/note"
        params = {"server": "prod_official_asia", "role_id": uid}
        return await self._request(url, params)
        
    # Endgame HSR
    async def get_starrail_challenge(self, uid: int) -> dict: # MoC
        url = "https://bbs-api-os.hoyolab.com/game_record/hkrpg/api/challenge"
        params = {"server": "prod_official_asia", "role_id": uid, "schedule_type": 1, "need_all": "true"}
        return await self._request(url, params)
        
    async def get_starrail_pure_fiction(self, uid: int) -> dict:
        url = "https://bbs-api-os.hoyolab.com/game_record/hkrpg/api/challenge_story"
        params = {"server": "prod_official_asia", "role_id": uid, "schedule_type": 1, "need_all": "true"}
        return await self._request(url, params)
        
    async def get_starrail_apc_shadow(self, uid: int) -> dict:
        url = "https://bbs-api-os.hoyolab.com/game_record/hkrpg/api/challenge_boss"
        params = {"server": "prod_official_asia", "role_id": uid, "schedule_type": 1, "need_all": "true"}
        return await self._request(url, params)

    async def get_starrail_rogue(self, uid: int) -> dict:
        url = "https://bbs-api-os.hoyolab.com/game_record/hkrpg/api/rogue"
        params = {"server": "prod_official_asia", "role_id": uid, "schedule_type": 3, "need_detail": "true"}
        return await self._request(url, params)

    # --- Zenless Zone Zero ---
    def _get_zzz_server(self, uid: int) -> str:
        uid_str = str(uid)
        if uid_str.startswith("10"): return "prod_gf_us"
        if uid_str.startswith("15"): return "prod_gf_eu"
        if uid_str.startswith("13"): return "prod_gf_jp" # Asia
        return "prod_gf_sg" # Default

    async def get_zzz_user(self, uid: int) -> dict:
        url = "https://sg-act-public-api.hoyolab.com/event/game_record_zzz/api/zzz/index"
        params = {"server": self._get_zzz_server(uid), "role_id": uid}
        return await self._request(url, params)

    async def get_zzz_notes(self, uid: int) -> dict:
        url = "https://sg-act-public-api.hoyolab.com/event/game_record_zzz/api/zzz/note"
        params = {"server": self._get_zzz_server(uid), "role_id": uid}
        return await self._request(url, params)
