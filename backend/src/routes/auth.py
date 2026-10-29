from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from ..lib.auth import hash_password, verify_password, create_access_token
from ..lib.bitcoin import generate_wallet, encrypt_seed

router = APIRouter()

# In-memory store for hackathon (replace with DB in prod)
users_db: dict = {}

class SignupRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class OnboardingRequest(BaseModel):
    username: str

class ConnectWalletRequest(BaseModel):
    btc_address: str

@router.post("/signup")
async def signup(body: SignupRequest):
    if body.email in users_db:
        raise HTTPException(400, "Email already registered")

    wallet = generate_wallet()
    hashed = hash_password(body.password)

    user = {
        "id":               body.email,
        "email":            body.email,
        "username":         None,
        "hashed_password":  hashed,
        "btc_address":      wallet["address"],
        "public_key":       wallet["public_key"],
        "encrypted_seed":   encrypt_seed(wallet.get("wif", ""), body.password),
        "wallet_connected": False,
        "onboarded":        False,
    }
    users_db[body.email] = user

    token = create_access_token({
        "sub":      body.email,
        "email":    body.email,
        "username": None,
    })

    return {
        "token":       token,
        "user":        {k: v for k, v in user.items() if k not in ["hashed_password", "encrypted_seed"]},
        "next_step":   "onboarding",
        "wallet":      {"address": wallet["address"]},
        "seed_phrase": wallet.get("wif", ""),  # shown once — user must save this
    }

@router.post("/login")
async def login(body: LoginRequest):
    user = users_db.get(body.email)
    if not user or not verify_password(body.password, user["hashed_password"]):
        raise HTTPException(401, "Invalid credentials")

    token = create_access_token({
        "sub":      user["id"],
        "email":    user["email"],
        "username": user["username"],
    })

    return {
        "token": token,
        "user":  {k: v for k, v in user.items() if k not in ["hashed_password", "encrypted_seed"]},
    }

@router.post("/onboarding/username")
async def set_username(body: OnboardingRequest, token_data: dict = Depends(lambda t=None: t)):
    # Check username not taken
    taken = any(u["username"] == body.username for u in users_db.values())
    if taken:
        raise HTTPException(400, "Username already taken")

    # Validate username
    import re
    if not re.match(r'^[a-zA-Z0-9_]{3,20}$', body.username):
        raise HTTPException(400, "Username must be 3–20 chars, letters/numbers/underscores only")

    return {"available": True, "username": body.username}

@router.get("/check-username/{username}")
async def check_username(username: str):
    taken = any(u["username"] == username for u in users_db.values())
    return {"available": not taken, "username": username}
