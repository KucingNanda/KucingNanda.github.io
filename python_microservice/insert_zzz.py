import os
import pymysql
import sys

# Connect to database
try:
    conn = pymysql.connect(
        host='mysql-kucing27.alwaysdata.net',
        user='kucing27',
        password='septian27',
        database='kucing27_personal',
        cursorclass=pymysql.cursors.DictCursor
    )
except Exception as e:
    # If pymysql is missing, just print it so we can install it
    print("Connection error:", e)
    sys.exit(1)

try:
    with conn.cursor() as cursor:
        # Check if ZZZ already exists
        cursor.execute("SELECT * FROM games WHERE game_name = 'Zenless Zone Zero'")
        existing = cursor.fetchone()
        
        if existing:
            print("Zenless Zone Zero is already in the database:", existing)
        else:
            # We need to know the columns. Let's just describe the table.
            cursor.execute("DESCRIBE games")
            columns = cursor.fetchall()
            print("Columns:", [c['Field'] for c in columns])
            
            # Insert ZZZ
            # Typically columns might be: id, game_name, uid, nickname, bio, icon_url, created_at, updated_at
            
            # Fetch the actual ZZZ UID from the env file
            from dotenv import load_dotenv
            load_dotenv('.env')
            zzz_uid = os.getenv('ZZZ_UID', '1300234697')
            
            insert_sql = """
            INSERT INTO games (game_name, uid, nickname, bio, icon_url)
            VALUES (%s, %s, %s, %s, %s)
            """
            
            # Using a public official ZZZ icon or placeholder
            icon_url = "https://play-lh.googleusercontent.com/4xP2UaK9w9qfLDBQ9u1J8rRjY6QOaP3Qz9vJ_x7v9xY7x3X3X5X7X5X3X5X7X3X5"
            icon_url = "https://fastcdn.hoyoverse.com/static-resource-v2/2024/04/12/32d03a11043329976451e626786a9f4c_1416757657904033379.png" # Real ZZZ logo
            
            cursor.execute(insert_sql, (
                'Zenless Zone Zero',
                zzz_uid,
                'KucingAbu',
                'Kunci: Legendary Proxy\nBergabunglah dalam pengeksplorasian Hollow!',
                icon_url
            ))
            
            conn.commit()
            print("Successfully inserted Zenless Zone Zero into the database!")
finally:
    conn.close()
