from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from .routes import auth, users, tickets, deals, wallet, escrow

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🔗 BTCovenants backend starting...")
    yield
    print("🔴 BTCovenants backend shutting down...")

app = FastAPI(
    title="BTCovenants API",
    description="Bitcoin-native escrow platform API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router,    prefix="/api/auth",    tags=["Auth"])
app.include_router(users.router,   prefix="/api/users",   tags=["Users"])
app.include_router(wallet.router,  prefix="/api/wallet",  tags=["Wallet"])
app.include_router(tickets.router, prefix="/api/tickets", tags=["Tickets"])
app.include_router(deals.router,   prefix="/api/deals",   tags=["Deals"])
app.include_router(escrow.router,  prefix="/api/escrow",  tags=["Escrow"])

@app.get("/")
async def root():
    return {"status": "ok", "app": "BTCovenants", "version": "0.1.0"}
