from sqlalchemy import Column, Integer, String, Text, DateTime, func, BigInteger
from models.database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    username = Column(String(100), unique=True, index=True)
    password = Column(String(255))

class Game(Base):
    __tablename__ = "games"
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    game_name = Column(String(255), nullable=False)
    uid = Column(String(100))
    description = Column(Text)
    favorite_character = Column(String(100))
    nickname = Column(String(100))
    bio = Column(Text)
    icon_url = Column(Text)

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    nickname = Column(String(100))
    bio = Column(Text)
    current_status = Column(String(255))
    social_links = Column(Text)
    tech_stack = Column(Text)
    audio_title = Column(String(255))
    audio_url = Column(Text)
    avatar_url = Column(Text)
    current_obsessions = Column(Text)

class Gallery(Base):
    __tablename__ = "galleries"
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    image_url = Column(Text, nullable=False)
    category = Column(String(100))
    tags = Column(String(255))
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    info = Column(String(100))
    artist_name = Column(String(255))
    source_link = Column(Text)

class Vault(Base):
    __tablename__ = "vaults"
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    platform = Column(String(255), nullable=False)
    username = Column(String(255))
    password = Column(String(255))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
