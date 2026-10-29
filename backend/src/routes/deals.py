from fastapi import APIRouter
from .tickets import tickets_db

router = APIRouter()

@router.get("/completed")
async def completed_deals():
    completed = [t for t in tickets_db.values() if t["status"] == "completed"]
    return [
        {
            "id":             t["id"],
            "title":          t["title"],
            "amount_usd":     t["amount_usd"],
            "buyer":          t["buyer_username"] if t["is_public"] else "anonymous",
            "provider":       t["provider_username"] if t["is_public"] else "anonymous",
            "is_public":      t["is_public"],
            "completed_at":   t.get("updated_at", t["created_at"]),
        }
        for t in completed
    ]
