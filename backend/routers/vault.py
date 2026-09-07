from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from models.database import get_db
from models.schemas import Vault
from routers.auth import get_current_user

router = APIRouter()

class VaultRequest(BaseModel):
    platform: str
    username: Optional[str] = None
    password: Optional[str] = None
    notes: Optional[str] = None

@router.get("/vault")
def get_vaults(db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    return db.query(Vault).all()

@router.post("/vault")
def create_vault(data: VaultRequest, db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    new_vault = Vault(
        platform=data.platform,
        username=data.username,
        password=data.password,
        notes=data.notes
    )
    db.add(new_vault)
    db.commit()
    db.refresh(new_vault)
    return new_vault

@router.put("/vault/{id}")
def update_vault(id: int, data: VaultRequest, db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    vault = db.query(Vault).filter(Vault.id == id).first()
    if not vault:
        raise HTTPException(status_code=404, detail="Vault tidak ditemukan")

    if data.platform is not None: vault.platform = data.platform
    if data.username is not None: vault.username = data.username
    if data.password is not None: vault.password = data.password
    if data.notes is not None: vault.notes = data.notes

    db.commit()
    db.refresh(vault)
    return vault

@router.delete("/vault/{id}")
def delete_vault(id: int, db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    vault = db.query(Vault).filter(Vault.id == id).first()
    if not vault:
        raise HTTPException(status_code=404, detail="Vault tidak ditemukan")
    
    db.delete(vault)
    db.commit()
    return {"message": "Vault berhasil dihapus"}
