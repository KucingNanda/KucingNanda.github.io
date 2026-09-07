import asyncio
import os
from dotenv import load_dotenv
from services.hoyolab_client import CustomHoyolabClient

load_dotenv()

async def main():
    ltuid = os.getenv("LTUID_V2")
    ltoken = os.getenv("LTOKEN_V2")
    uid = int(os.getenv("GENSHIN_UID", "0"))
    
    client = CustomHoyolabClient(ltuid, ltoken)
    
    url = "https://bbs-api-os.hoyolab.com/game_record/genshin/api/character"
    
    # Try POST
    try:
        # We might need to add a post method to the client or just use httpx directly
        import httpx
        from services.hoyolab_client import generate_ds
        
        headers = {
            "Cookie": f"ltuid_v2={ltuid}; ltoken_v2={ltoken};",
            "x-rpc-app_version": "1.5.0",
            "x-rpc-client_type": "5",
            "DS": generate_ds(),
            "Origin": "https://act.hoyolab.com",
            "Referer": "https://act.hoyolab.com/",
            "Accept": "application/json, text/plain, */*",
        }
        
        async with httpx.AsyncClient() as c:
            # Let's try POST
            resp = await c.post(url, headers=headers, json={"role_id": str(uid), "server": "os_asia"})
            print("POST Status:", resp.status_code)
            data = resp.json()
            print("POST Retcode:", data.get("retcode"))
            if "data" in data and data["data"]:
                avatars = data["data"].get("avatars", [])
                print(f"Found {len(avatars)} avatars via POST")
                if avatars:
                    print(avatars[0].keys())
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    asyncio.run(main())
