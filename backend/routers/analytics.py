from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from models.database import get_db
from models.schemas import Game, Gallery, Vault
from routers.auth import get_current_user

router = APIRouter()

@router.get("/admin/stats")
def get_stats(db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    total_games = db.query(Game).count()
    total_galleries = db.query(Gallery).count()
    total_vaults = db.query(Vault).count()
    
    return {
        "total_games": total_games,
        "total_galleries": total_galleries,
        "total_vaults": total_vaults,
        # Default placeholder stat
        "total_messages": 0 
    }
