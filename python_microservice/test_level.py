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
    
    client = genshin.Client(cookies)
    
    # Genshin
    client.default_game = genshin.Game.GENSHIN
    client.uid = int(os.getenv("GENSHIN_UID", "0"))
    g = await client.get_genshin_user(client.uid)
    print("Genshin AR:", g.info.level)
    
    # HSR
    client.default_game = genshin.Game.STARRAIL
    client.uid = int(os.getenv("HSR_UID", "0"))
    h = await client.get_starrail_user()
    print("HSR TL:", h.info.level)

if __name__ == "__main__":
    asyncio.run(main())
