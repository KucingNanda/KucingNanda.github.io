import genshin

def get_methods():
    client = genshin.Client()
    methods = [m for m in dir(client) if callable(getattr(client, m)) and not m.startswith('__')]
    
    genshin_methods = [m for m in methods if 'genshin' in m or 'spiral_abyss' in m or 'tcg' in m]
    hsr_methods = [m for m in methods if 'starrail' in m or 'apc' in m or 'rogue' in m or 'pure_fiction' in m]
    zzz_methods = [m for m in methods if 'zzz' in m]
    hi3_methods = [m for m in methods if 'honkai' in m or 'abyss' in m and 'spiral' not in m]
    other = [m for m in methods if m not in genshin_methods + hsr_methods + zzz_methods + hi3_methods]
    
    print("--- GENSHIN IMPACT ---")
    for m in genshin_methods: print(m)
        
    print("\n--- HONKAI: STAR RAIL ---")
    for m in hsr_methods: print(m)
        
    print("\n--- ZENLESS ZONE ZERO (ZZZ) ---")
    for m in zzz_methods: print(m)
        
    print("\n--- HONKAI IMPACT 3RD ---")
    for m in hi3_methods: print(m)

get_methods()
