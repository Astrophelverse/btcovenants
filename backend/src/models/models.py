from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, Text, Enum as SAEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

Base = declarative_base()

def gen_uuid():
    return str(uuid.uuid4())

class DealStatus(str, enum.Enum):
    PENDING   = "pending"
    FUNDED    = "funded"
    ACTIVE    = "active"
    COMPLETED = "completed"
    DISPUTED  = "disputed"
    CANCELLED = "cancelled"

class TicketStatus(str, enum.Enum):
    OPEN      = "open"
    ACTIVE    = "active"
    RESOLVED  = "resolved"
    CLOSED    = "closed"

class User(Base):
    __tablename__ = "users"
    id              = Column(String, primary_key=True, default=gen_uuid)
    email           = Column(String, unique=True, nullable=False, index=True)
    username        = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    btc_address     = Column(String, nullable=True)
    encrypted_seed  = Column(Text, nullable=True)   # seed encrypted with user password
    wallet_connected = Column(Boolean, default=False)
    created_at      = Column(DateTime, default=datetime.utcnow)
    updated_at      = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    tickets_as_buyer    = relationship("Ticket", foreign_keys="Ticket.buyer_id", back_populates="buyer")
    tickets_as_provider = relationship("Ticket", foreign_keys="Ticket.provider_id", back_populates="provider")

class Ticket(Base):
    __tablename__ = "tickets"
    id              = Column(String, primary_key=True, default=gen_uuid)
    title           = Column(String, nullable=False)
    description     = Column(Text, nullable=False)
    amount_usd      = Column(Float, nullable=False)
    amount_btc      = Column(Float, nullable=True)       # calculated at funding time
    btc_price_locked = Column(Float, nullable=True)      # BTC/USD at deal creation
    timeline_days   = Column(Float, nullable=False)
    status          = Column(SAEnum(TicketStatus), default=TicketStatus.OPEN)
    is_public       = Column(Boolean, default=True)
    escrow_address  = Column(String, nullable=True)      # multisig address
    buyer_signed    = Column(Boolean, default=False)
    provider_signed = Column(Boolean, default=False)
    buyer_done      = Column(Boolean, default=False)
    provider_done   = Column(Boolean, default=False)
    buyer_id        = Column(String, ForeignKey("users.id"), nullable=False)
    provider_id     = Column(String, ForeignKey("users.id"), nullable=True)
    platform_fee_usd = Column(Float, nullable=True)
    network_fee_sats = Column(Float, nullable=True)
    created_at      = Column(DateTime, default=datetime.utcnow)
    updated_at      = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deadline_at     = Column(DateTime, nullable=True)

    buyer    = relationship("User", foreign_keys=[buyer_id],    back_populates="tickets_as_buyer")
    provider = relationship("User", foreign_keys=[provider_id], back_populates="tickets_as_provider")
    messages = relationship("Message", back_populates="ticket", order_by="Message.created_at")

class Message(Base):
    __tablename__ = "messages"
    id         = Column(String, primary_key=True, default=gen_uuid)
    ticket_id  = Column(String, ForeignKey("tickets.id"), nullable=False)
    sender_id  = Column(String, ForeignKey("users.id"),   nullable=False)
    content    = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    ticket = relationship("Ticket", back_populates="messages")
    sender = relationship("User")
