from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..lib.bitcoin import create_multisig_address, get_btc_price_usd, usd_to_btc

router = APIRouter()

SUPPORT_PUBKEY = "02b4632d08485ff1df2db55b9dafd23347d1c47a457072a1e87be26896549a8737"  # platform support key

class CreateEscrowRequest(BaseModel):
    ticket_id:       str
    buyer_pubkey:    str
    provider_pubkey: str
    amount_usd:      float

@router.post("/create")
async def create_escrow(body: CreateEscrowRequest):
    result = create_multisig_address(
        body.buyer_pubkey,
        body.provider_pubkey,
        SUPPORT_PUBKEY,
    )
    btc_price  = await get_btc_price_usd()
    amount_btc = usd_to_btc(body.amount_usd, btc_price)

    return {
        **result,
        "ticket_id":   body.ticket_id,
        "amount_usd":  body.amount_usd,
        "amount_btc":  amount_btc,
        "btc_price":   btc_price,
        "instructions": f"Send exactly {amount_btc} BTC to {result.get('escrow_address')} to fund this escrow.",
    }
