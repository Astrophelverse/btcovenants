"""
Bitcoin core logic for BTCovenants
- Wallet generation
- Multisig escrow address creation (2-of-3 Taproot)
- Fee estimation via Mempool.space
- BTC price oracle via CoinGecko
- Balance & UTXO via Blockstream Esplora
"""
import os
import httpx
import hashlib
from typing import Optional

MEMPOOL_API   = "https://mempool.space/api"
ESPLORA_API   = "https://blockstream.info/testnet/api"  # testnet for hackathon
COINGECKO_API = "https://api.coingecko.com/api/v3"

# ── Price Oracle ──────────────────────────────────────────────────────────────
#this is the main usdt/btc price gap that sotres all and keeps it understandable by normal users 
async def get_btc_price_usd() -> float:
    """Fetch live BTC/USD from CoinGecko — no API key needed."""
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(
            f"{COINGECKO_API}/simple/price",
            params={"ids": "bitcoin", "vs_currencies": "usd"},
        )
        r.raise_for_status()
        return float(r.json()["bitcoin"]["usd"])

def usd_to_btc(usd_amount: float, btc_price: float) -> float:
    """Convert USD amount to BTC at given price."""
    return round(usd_amount / btc_price, 8)

def btc_to_sats(btc: float) -> int:
    return int(btc * 1e8)

# ── Fee Estimation ────────────────────────────────────────────────────────────
async def get_fee_rates() -> dict:
    """Get fee rates from mempool.space. Returns sat/vbyte."""
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(f"{MEMPOOL_API}/v1/fees/recommended")
        r.raise_for_status()
        return r.json()
        # { "fastestFee": 20, "halfHourFee": 15, "hourFee": 10, "economyFee": 5, "minimumFee": 1 }

async def estimate_network_fee_sats(vbytes: int = 200) -> int:
    """Estimate network fee in sats using economy fee rate."""
    rates = await get_fee_rates()
    economy_rate = rates.get("economyFee", 5)
    return economy_rate * vbytes

# ── Platform Fee ──────────────────────────────────────────────────────────────
def calculate_platform_fee(usd_amount: float) -> float:
    """
    Calculate platform fee based on USD amount.
    Fee structure:
    < $50       → Free
    $50–$250    → $2.00 flat
    $250+       → 1%
    """
    if usd_amount < 50:
        return 0.0
    elif usd_amount <= 250:
        return 2.0
    else:
        return round(usd_amount * 0.01, 2)
# this keeps the balance in usdt and yet shows the value of it in btc 
# ── Balance & UTXOs via Esplora ───────────────────────────────────────────────
async def get_address_balance(address: str) -> dict:
    """Get confirmed + unconfirmed balance for a BTC address."""
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(f"{ESPLORA_API}/address/{address}")
        r.raise_for_status()
        data = r.json()
        confirmed   = data["chain_stats"]["funded_txo_sum"] - data["chain_stats"]["spent_txo_sum"]
        unconfirmed = data["mempool_stats"]["funded_txo_sum"] - data["mempool_stats"]["spent_txo_sum"]
        return {
            "confirmed_sats":   confirmed,
            "unconfirmed_sats": unconfirmed,
            "total_sats":       confirmed + unconfirmed,
            "confirmed_btc":    confirmed / 1e8,
            "total_btc":        (confirmed + unconfirmed) / 1e8,
        }

async def get_utxos(address: str) -> list:
    """Get UTXOs for an address."""
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(f"{ESPLORA_API}/address/{address}/utxo")
        r.raise_for_status()
        return r.json()

async def broadcast_tx(tx_hex: str) -> str:
    """Broadcast a signed transaction. Returns txid."""
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(f"{ESPLORA_API}/tx", content=tx_hex)
        r.raise_for_status()
        return r.text.strip()

# ── Wallet Generation ─────────────────────────────────────────────────────────
def generate_wallet() -> dict:
    """
    Generate a new HD wallet.
    Returns mnemonic, xpub, and first BTC address.
    Uses python-bitcoinlib / bitcoinlib.
    """
    try:
        from bitcoinlib.wallets import Wallet
        import secrets
        name = "btcov_" + secrets.token_hex(8)
        w = Wallet.create(name, network="testnet", witness_type="segwit")
        key = w.get_key()
        return {
            "address":  key.address,
            "wif":      key.wif,
            "public_key": key.public_hex,
        }
    except Exception as e:
        # Fallback: pure derivation via coincurve
        import coincurve, secrets, hashlib, base58
        priv_bytes = secrets.token_bytes(32)
        pub_key    = coincurve.PublicKey.from_secret(priv_bytes)
        pub_bytes  = pub_key.format(compressed=True)
        sha256_h   = hashlib.sha256(pub_bytes).digest()
        ripemd160  = hashlib.new("ripemd160", sha256_h).digest()
        versioned  = b"\x6f" + ripemd160  # testnet prefix
        checksum   = hashlib.sha256(hashlib.sha256(versioned).digest()).digest()[:4]
        address    = base58.b58encode(versioned + checksum).decode()
        return {
            "address":    address,
            "wif":        priv_bytes.hex(),
            "public_key": pub_bytes.hex(),
        }
## Atomic transaction covers

## this is the main password string structure 

def encrypt_seed(seed: str, password: str) -> str:
    """Encrypt seed phrase with user password using SHA-256 derived key."""
    from cryptography.fernet import Fernet
    import base64
    key = base64.urlsafe_b64encode(hashlib.sha256(password.encode()).digest())
    f   = Fernet(key)
    return f.encrypt(seed.encode()).decode()

def decrypt_seed(encrypted_seed: str, password: str) -> str:
    """Decrypt seed phrase with user password."""
    from cryptography.fernet import Fernet
    import base64
    key = base64.urlsafe_b64encode(hashlib.sha256(password.encode()).digest())
    f   = Fernet(key)
    return f.decrypt(encrypted_seed.encode()).decode()

# ── Multisig Escrow ───────────────────────────────────────────────────────────
def create_multisig_address(buyer_pubkey: str, provider_pubkey: str, support_pubkey: str) -> dict:
    """
    Create a 2-of-3 P2SH multisig escrow address.
    buyer + provider sign on completion.
    support key is dormant — only used for disputes.
    """
    try:
        from bitcoinlib.scripts import Script
        from bitcoinlib.keys import Key

        buyer_key    = Key(buyer_pubkey)
        provider_key = Key(provider_pubkey)
        support_key  = Key(support_pubkey)

        redeemscript = Script.parse(
            f"OP_2 {buyer_pubkey} {provider_pubkey} {support_pubkey} OP_3 OP_CHECKMULTISIG"
        )
        p2sh_address = redeemscript.p2sh_address(network="testnet")
        return {
            "escrow_address": p2sh_address,
            "redeem_script":  redeemscript.as_hex(),
            "type":           "2-of-3 P2SH multisig",
        }
    except Exception as e:
        return {
            "escrow_address": None,
            "error":          str(e),
            "note":           "Install bitcoinlib properly to generate multisig addresses",
        }
