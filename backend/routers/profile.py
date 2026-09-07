from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from models.database import get_db
from models.schemas import Profile
from services.cloudinary_upload import upload_image
from routers.auth import get_current_user

router = APIRouter()

@router.get("/profile")
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    if not profile:
        return {}
    return profile

@router.post("/profile")
@router.put("/profile")
def update_profile(
    nickname: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    current_status: Optional[str] = Form(None),
    social_links: Optional[str] = Form(None),
    tech_stack: Optional[str] = Form(None),
    current_obsessions: Optional[str] = Form(None),
    avatar_url: Optional[str] = Form(None),
    avatar: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    user: str = Depends(get_current_user)
):
    profile = db.query(Profile).first()
    is_new = False
    if not profile:
        profile = Profile()
        is_new = True

    if nickname is not None: profile.nickname = nickname
    if bio is not None: profile.bio = bio
    if current_status is not None: profile.current_status = current_status
    if social_links is not None: profile.social_links = social_links
    if tech_stack is not None: profile.tech_stack = tech_stack
    if current_obsessions is not None: profile.current_obsessions = current_obsessions
    if avatar_url is not None: profile.avatar_url = avatar_url

    if avatar:
        file_bytes = avatar.file.read()
        secure_url = upload_image(file_bytes, folder="KucingAbu/Profile")
        profile.avatar_url = secure_url

    if is_new:
        db.add(profile)

    db.commit()
    db.refresh(profile)
    return profile
