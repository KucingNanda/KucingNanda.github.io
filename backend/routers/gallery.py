from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
import datetime

from models.database import get_db
from models.schemas import Gallery
from services.cloudinary_upload import upload_image
from routers.auth import get_current_user

router = APIRouter()

@router.get("/gallery")
def get_gallery(db: Session = Depends(get_db)):
    return db.query(Gallery).all()

@router.post("/gallery")
def create_gallery(
    title: str = Form(...),
    category: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    info: Optional[str] = Form(None),
    artist_name: Optional[str] = Form(None),
    source_link: Optional[str] = Form(None),
    image_url: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    user: str = Depends(get_current_user)
):
    if image:
        file_bytes = image.file.read()
        image_url = upload_image(file_bytes, folder="KucingAbu/Gallery")

    new_gallery = Gallery(
        title=title,
        category=category,
        tags=tags,
        info=info,
        artist_name=artist_name,
        source_link=source_link,
        image_url=image_url
    )
    db.add(new_gallery)
    db.commit()
    db.refresh(new_gallery)
    return new_gallery

@router.put("/gallery/{id}")
def update_gallery(
    id: int,
    title: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    info: Optional[str] = Form(None),
    artist_name: Optional[str] = Form(None),
    source_link: Optional[str] = Form(None),
    image_url: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    user: str = Depends(get_current_user)
):
    gallery = db.query(Gallery).filter(Gallery.id == id).first()
    if not gallery:
        raise HTTPException(status_code=404, detail="Gallery tidak ditemukan")

    if title is not None: gallery.title = title
    if category is not None: gallery.category = category
    if tags is not None: gallery.tags = tags
    if info is not None: gallery.info = info
    if artist_name is not None: gallery.artist_name = artist_name
    if source_link is not None: gallery.source_link = source_link
    if image_url is not None: gallery.image_url = image_url

    if image:
        file_bytes = image.file.read()
        secure_url = upload_image(file_bytes, folder="KucingAbu/Gallery")
        gallery.image_url = secure_url

    db.commit()
    db.refresh(gallery)
    return gallery

@router.delete("/gallery/{id}")
def delete_gallery(id: int, db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    gallery = db.query(Gallery).filter(Gallery.id == id).first()
    if not gallery:
        raise HTTPException(status_code=404, detail="Gallery tidak ditemukan")
    
    db.delete(gallery)
    db.commit()
    return {"message": "Gallery berhasil dihapus"}
