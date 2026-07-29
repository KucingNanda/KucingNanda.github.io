import pymysql
import sys

try:
    conn = pymysql.connect(
        host='mysql-kucing27.alwaysdata.net',
        user='kucing27',
        password='septian27',
        database='kucing27_personal',
        cursorclass=pymysql.cursors.DictCursor
    )
    with conn.cursor() as cursor:
        cursor.execute("ALTER TABLE games DROP COLUMN progress;")
        conn.commit()
        print("Successfully dropped 'progress' column from 'games' table!")
except Exception as e:
    print("Error:", e)
finally:
    if 'conn' in locals() and conn.open:
        conn.close()
