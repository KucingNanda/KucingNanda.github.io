from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Menggunakan PyMySQL untuk koneksi MySQL (Sesuai dengan db AlwaysData Anda)
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://kucing27:septian27@mysql-kucing27.alwaysdata.net:3306/kucing27_personal"

engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency untuk FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
