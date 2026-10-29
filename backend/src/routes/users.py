from fastapi import APIRouter, HTTPException
from .auth import users_db

router = APIRouter()

@router.get("/{username}")
async def get_user_by_username(username: str):
    user = next((u for u in users_db.values() if u["username"] == username), None)
    if not user:
        raise HTTPException(404, "User not found")
    return {
        "id":       user["id"],
        "username": user["username"],
        "btc_address": user["btc_address"],
    }
