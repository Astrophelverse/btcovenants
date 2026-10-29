from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..lib.bitcoin import (
    get_address_balance, get_fee_rates, get_btc_price_usd,
    estimate_network_fee_sats, calculate_platform_fee, usd_to_btc
)

router = APIRouter()

@router.get("/balance/{address}")
async def balance(address: str):
    try:
        bal = await get_address_balance(address)
        price = await get_btc_price_usd()
        bal["usd_value"] = round(bal["total_btc"] * price, 2)
        bal["btc_price"] = price
        return bal
    except Exception as e:
        raise HTTPException(400, str(e))

@router.get("/fees")
async def fees():
    try:
        rates = await get_fee_rates()
        network_fee_sats = await estimate_network_fee_sats()
        btc_price = await get_btc_price_usd()
        network_fee_usd = round((network_fee_sats / 1e8) * btc_price, 4)
        return {
            "rates": rates,
            "estimated_fee_sats": network_fee_sats,
            "estimated_fee_usd":  network_fee_usd,
        }
    except Exception as e:
        raise HTTPException(400, str(e))

@router.get("/price")
async def btc_price():
    price = await get_btc_price_usd()
    return {"btc_usd": price}

class FeeEstimateRequest(BaseModel):
    amount_usd: float

@router.post("/estimate-fees")
async def estimate_fees(body: FeeEstimateRequest):
    platform_fee  = calculate_platform_fee(body.amount_usd)
    network_sats  = await estimate_network_fee_sats()
    btc_price     = await get_btc_price_usd()
    network_usd   = round((network_sats / 1e8) * btc_price, 4)
    total_usd     = body.amount_usd + platform_fee + network_usd
    amount_btc    = usd_to_btc(body.amount_usd, btc_price)

    return {
        "deal_amount_usd":    body.amount_usd,
        "deal_amount_btc":    amount_btc,
        "platform_fee_usd":   platform_fee,
        "network_fee_sats":   network_sats,
        "network_fee_usd":    network_usd,
        "total_from_buyer":   round(total_usd, 4),
        "provider_receives":  f"${body.amount_usd:.2f} worth of BTC",
        "btc_price":          btc_price,
    }
