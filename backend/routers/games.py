from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from models.database import get_db
from models.schemas import Game
from services.cloudinary_upload import upload_image
from routers.auth import get_current_user

router = APIRouter()

@router.get("/games")
def get_games(db: Session = Depends(get_db)):
    games = db.query(Game).all()
    return games

@router.post("/games")
def create_game(
    game_name: str = Form(...),
    nickname: Optional[str] = Form(None),
    uid: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    favorite_character: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    icon_url: Optional[str] = Form(None),
    icon: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    user: str = Depends(get_current_user)
):
    if icon:
        file_bytes = icon.file.read()
        icon_url = upload_image(file_bytes, folder="KucingAbu/Games")

    new_game = Game(
        game_name=game_name,
        nickname=nickname,
        uid=uid,
        description=description,
        favorite_character=favorite_character,
        bio=bio,
        icon_url=icon_url
    )
    db.add(new_game)
    db.commit()
    db.refresh(new_game)
    return new_game

@router.put("/games/{id}")
def update_game(
    id: int,
    game_name: Optional[str] = Form(None),
    nickname: Optional[str] = Form(None),
    uid: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    favorite_character: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    icon_url: Optional[str] = Form(None),
    icon: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    user: str = Depends(get_current_user)
):
    game = db.query(Game).filter(Game.id == id).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game tidak ditemukan")

    if game_name is not None: game.game_name = game_name
    if nickname is not None: game.nickname = nickname
    if uid is not None: game.uid = uid
    if description is not None: game.description = description
    if favorite_character is not None: game.favorite_character = favorite_character
    if bio is not None: game.bio = bio
    if icon_url is not None: game.icon_url = icon_url

    if icon:
        file_bytes = icon.file.read()
        secure_url = upload_image(file_bytes, folder="KucingAbu/Games")
        game.icon_url = secure_url

    db.commit()
    db.refresh(game)
    return game

@router.delete("/games/{id}")
def delete_game(id: int, db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    game = db.query(Game).filter(Game.id == id).first()
    if not game:
        raise HTTPException(status_code=404, detail="Game tidak ditemukan")
    
    db.delete(game)
    db.commit()
    return {"message": "Game berhasil dihapus"}
