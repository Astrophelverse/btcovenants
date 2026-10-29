from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import uuid
from ..lib.bitcoin import get_btc_price_usd, calculate_platform_fee, usd_to_btc, estimate_network_fee_sats

router = APIRouter()

# In-memory for hackathon
tickets_db: dict = {}
messages_db: dict = {}

class CreateTicketRequest(BaseModel):
    title:         str
    description:   str
    amount_usd:    float
    timeline_days: int
    provider_username: Optional[str] = None
    is_public:     bool = True
    buyer_id:      str
    buyer_username: str

class JoinTicketRequest(BaseModel):
    provider_id:       str
    provider_username: str

class SignRequest(BaseModel):
    user_id: str
    role:    str  # "buyer" or "provider"

class MessageRequest(BaseModel):
    sender_id:       str
    sender_username: str
    content:         str

class MarkDoneRequest(BaseModel):
    user_id: str
    role:    str

@router.post("/create")
async def create_ticket(body: CreateTicketRequest):
    btc_price    = await get_btc_price_usd()
    platform_fee = calculate_platform_fee(body.amount_usd)
    network_sats = await estimate_network_fee_sats()
    amount_btc   = usd_to_btc(body.amount_usd, btc_price)

    ticket = {
        "id":                str(uuid.uuid4()),
        "title":             body.title,
        "description":       body.description,
        "amount_usd":        body.amount_usd,
        "amount_btc":        amount_btc,
        "btc_price_locked":  btc_price,
        "timeline_days":     body.timeline_days,
        "status":            "pending",
        "is_public":         body.is_public,
        "buyer_id":          body.buyer_id,
        "buyer_username":    body.buyer_username,
        "provider_id":       None,
        "provider_username": body.provider_username,
        "buyer_signed":      False,
        "provider_signed":   False,
        "buyer_done":        False,
        "provider_done":     False,
        "platform_fee_usd":  platform_fee,
        "network_fee_sats":  network_sats,
        "escrow_address":    None,
        "created_at":        datetime.utcnow().isoformat(),
        "deadline_at":       (datetime.utcnow() + timedelta(days=body.timeline_days)).isoformat(),
    }
    tickets_db[ticket["id"]] = ticket
    messages_db[ticket["id"]] = []
    return ticket

@router.get("/{ticket_id}")
async def get_ticket(ticket_id: str):
    ticket = tickets_db.get(ticket_id)
    if not ticket:
        raise HTTPException(404, "Ticket not found")
    return {**ticket, "messages": messages_db.get(ticket_id, [])}

@router.get("/user/{user_id}")
async def get_user_tickets(user_id: str):
    user_tickets = [
        t for t in tickets_db.values()
        if t["buyer_id"] == user_id or t["provider_id"] == user_id
    ]
    return sorted(user_tickets, key=lambda x: x["created_at"], reverse=True)

@router.post("/{ticket_id}/join")
async def join_ticket(ticket_id: str, body: JoinTicketRequest):
    ticket = tickets_db.get(ticket_id)
    if not ticket:
        raise HTTPException(404, "Ticket not found")
    if ticket["provider_id"]:
        raise HTTPException(400, "Ticket already has a provider")
    ticket["provider_id"]       = body.provider_id
    ticket["provider_username"] = body.provider_username
    ticket["status"]            = "active"
    return ticket

@router.post("/{ticket_id}/sign")
async def sign_ticket(ticket_id: str, body: SignRequest):
    ticket = tickets_db.get(ticket_id)
    if not ticket:
        raise HTTPException(404, "Ticket not found")
    if body.role == "buyer":
        ticket["buyer_signed"] = True
    elif body.role == "provider":
        ticket["provider_signed"] = True
    if ticket["buyer_signed"] and ticket["provider_signed"]:
        ticket["status"] = "funded"
    return ticket

@router.post("/{ticket_id}/mark-done")
async def mark_done(ticket_id: str, body: MarkDoneRequest):
    ticket = tickets_db.get(ticket_id)
    if not ticket:
        raise HTTPException(404, "Ticket not found")
    if body.role == "buyer":
        ticket["buyer_done"] = True
    elif body.role == "provider":
        ticket["provider_done"] = True
    if ticket["buyer_done"] and ticket["provider_done"]:
        ticket["status"] = "completed"
    return ticket

@router.post("/{ticket_id}/message")
async def send_message(ticket_id: str, body: MessageRequest):
    if ticket_id not in tickets_db:
        raise HTTPException(404, "Ticket not found")
    msg = {
        "id":              str(uuid.uuid4()),
        "ticket_id":       ticket_id,
        "sender_id":       body.sender_id,
        "sender_username": body.sender_username,
        "content":         body.content,
        "created_at":      datetime.utcnow().isoformat(),
    }
    messages_db[ticket_id].append(msg)
    return msg

@router.get("/{ticket_id}/messages")
async def get_messages(ticket_id: str):
    if ticket_id not in tickets_db:
        raise HTTPException(404, "Ticket not found")
    return messages_db.get(ticket_id, [])
