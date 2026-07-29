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
    
    print("Fetching ZZZ Data...")
    try:
        user = await client.get_zzz_user()
        print("--- USER STATS ---")
        try:
            print(user.stats.model_dump())
        except:
            print(user.stats.__dict__)
    except Exception as e:
        print("User error:", e)
        
    try:
        notes = await client.get_zzz_notes()
        print("\n--- NOTES ---")
        try:
            print(notes.model_dump())
        except:
            print(notes.__dict__)
    except Exception as e:
        print("Notes error:", e)

if __name__ == "__main__":
    asyncio.run(main())
