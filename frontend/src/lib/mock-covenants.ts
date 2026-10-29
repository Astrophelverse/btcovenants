/**
 * BTCovenants Core Domain Logic & Cryptographic Mock Engine
 * Replicates 100% of the FastAPI backend bitcoinlib & route logic in React/TypeScript.
 */

export interface Message {
  id: string
  ticket_id: string
  sender_id: string
  sender_username: string
  content: string
  is_system?: boolean
  created_at: string
}

export type TicketStatus = 'pending' | 'active' | 'funded' | 'completed' | 'disputed'

export interface DealTicket {
  id: string
  title: string
  description: string
  amount_usd: number
  amount_btc: number
  btc_price_locked: number
  timeline_days: number
  status: TicketStatus
  is_public: boolean
  buyer_id: string
  buyer_username: string
  buyer_pubkey: string
  provider_id: string | null
  provider_username: string | null
  provider_pubkey: string | null
  buyer_signed: boolean
  provider_signed: boolean
  buyer_done: boolean
  provider_done: boolean
  platform_fee_usd: number
  network_fee_sats: number
  escrow_address: string
  funding_txid: string | null
  settlement_txid: string | null
  created_at: string
  deadline_at: string
  messages: Message[]
}

export interface UserPersona {
  id: string
  username: string
  email: string
  role: 'buyer' | 'provider' | 'arbiter'
  btc_address: string
  public_key: string
  balance_btc: number
  wif: string
  avatar: string
}

export const PERSONAS: Record<string, UserPersona> = {
  alice: {
    id: 'user_alice',
    username: 'alice_buyer',
    email: 'alice@btcovenants.org',
    role: 'buyer',
    btc_address: 'tb1p5d7nx5j7q8w3c6k9y4r2m0s1t3u5v7w9x0y2z4a6c8e0g',
    public_key: '03a1098320b7950ac57e91c5b252a2e940ea7216436279e8a0067b02e0f48998',
    balance_btc: 0.8524,
    wif: 'cT4m8Vn7gK6sQ5y9X1z3P2r4M6s8U0v2W4y6A8c0E2g4I6k8M0o2',
    avatar: 'A',
  },
  satoshi: {
    id: 'user_satoshi',
    username: 'satoshi_dev',
    email: 'satoshi@nakamoto.io',
    role: 'provider',
    btc_address: 'tb1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k8h5y6ds0k3x4e',
    public_key: '02e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8',
    balance_btc: 1.421,
    wif: 'cR9x0Y2z4A6c8E0g2I4k6M8o0Q2s4U6w8Y0a2C4e6G8i0K2m4O6',
    avatar: 'S',
  },
  arbiter: {
    id: 'user_arbiter',
    username: 'btcovenants_support',
    email: 'arbiter@btcovenants.org',
    role: 'arbiter',
    btc_address: 'tb1p9xkw92jfks83mvz0128skdhfjwu928374hfkd92837hfkld029',
    public_key: '02b4632d08485ff1df2db55b9dafd23347d1c47a457072a1e87be26896549a8737',
    balance_btc: 12.5,
    wif: 'cArbiterKeyVaultSecret9928347101827461928472918',
    avatar: 'Ω',
  },
}

// Bitcoin Financial Formulas (identical to backend/src/lib/bitcoin.py)
export function calculatePlatformFee(usdAmount: number): number {
  if (usdAmount < 50) return 0.0
  if (usdAmount <= 250) return 2.0
  return Number((usdAmount * 0.01).toFixed(2))
}

export function usdToBtc(usdAmount: number, btcPrice: number): number {
  if (!btcPrice || btcPrice <= 0) return 0
  return Number((usdAmount / btcPrice).toFixed(8))
}

export function btcToSats(btc: number): number {
  return Math.round(btc * 1e8)
}

export function satsToBtc(sats: number): number {
  return Number((sats / 1e8).toFixed(8))
}

export function generateRandomTxid(): string {
  const chars = '0123456789abcdef'
  let txid = ''
  for (let i = 0; i < 64; i++) {
    txid += chars[Math.floor(Math.random() * chars.length)]
  }
  return txid
}

export function generateTaprootMultisigAddress(seedStr: string): string {
  const hash = Math.abs(
    seedStr.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  ).toString(16)
  return `tb1p${hash.padStart(12, '8a2f')}77c0v${hash.slice(0, 8)}taproot2of3`
}

// Initial realistic pre-populated dataset
export const INITIAL_TICKETS: DealTicket[] = [
  {
    id: 'cov-8921-9941',
    title: 'Full-Stack Bitcoin Lightning Escrow Gateway',
    description:
      'Design and implement an automated 2-of-3 Taproot covenant coordinator with Lightning Network fallback for micro-fee settlements. Deliverable includes end-to-end integration test suite and audited script trees.',
    amount_usd: 4500,
    amount_btc: 0.04744333,
    btc_price_locked: 94850,
    timeline_days: 14,
    status: 'funded',
    is_public: true,
    buyer_id: PERSONAS.alice.id,
    buyer_username: PERSONAS.alice.username,
    buyer_pubkey: PERSONAS.alice.public_key,
    provider_id: PERSONAS.satoshi.id,
    provider_username: PERSONAS.satoshi.username,
    provider_pubkey: PERSONAS.satoshi.public_key,
    buyer_signed: true,
    provider_signed: true,
    buyer_done: false,
    provider_done: true,
    platform_fee_usd: 45.0,
    network_fee_sats: 1200,
    escrow_address: 'tb1p8921f98ac9077c0v8921f98ataproot2of3',
    funding_txid: '4e2b9c810a9f82d1c75b0649811f20ac799e4f201083e9d8417c800b3e64f810',
    settlement_txid: null,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    deadline_at: new Date(Date.now() + 10 * 86400000).toISOString(),
    messages: [
      {
        id: 'msg-1',
        ticket_id: 'cov-8921-9941',
        sender_id: 'system',
        sender_username: 'BTCovenants Oracle',
        content:
          'Taproot 2-of-3 Covenant initialized. Buyer pubkey: 03a1098... Provider pubkey: 02e3b0c... Arbiter key: 02b4632...',
        is_system: true,
        created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
      {
        id: 'msg-2',
        ticket_id: 'cov-8921-9941',
        sender_id: PERSONAS.alice.id,
        sender_username: PERSONAS.alice.username,
        content: 'Hey Satoshi, I created the deal ticket with the 14 day sprint schedule.',
        created_at: new Date(Date.now() - 3.8 * 86400000).toISOString(),
      },
      {
        id: 'msg-3',
        ticket_id: 'cov-8921-9941',
        sender_id: PERSONAS.satoshi.id,
        sender_username: PERSONAS.satoshi.username,
        content:
          'Reviewed and digitally signed with Schnorr key. Address verified on-chain. Ready when funded.',
        created_at: new Date(Date.now() - 3.5 * 86400000).toISOString(),
      },
      {
        id: 'msg-4',
        ticket_id: 'cov-8921-9941',
        sender_id: 'system',
        sender_username: 'Mempool Monitor',
        content:
          'On-chain funding confirmed: 0.04744333 BTC locked in Taproot covenant (TxID 4e2b9c810a9f82d...). Escrow active.',
        is_system: true,
        created_at: new Date(Date.now() - 3.4 * 86400000).toISOString(),
      },
      {
        id: 'msg-5',
        ticket_id: 'cov-8921-9941',
        sender_id: PERSONAS.satoshi.id,
        sender_username: PERSONAS.satoshi.username,
        content:
          'All deliverables completed! PR #42 merged, test coverage at 98.4%. Marked as done on my end.',
        created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
    ],
  },
  {
    id: 'cov-7104-3320',
    title: 'Hardware Signer & Coldcard HSM Integration',
    description:
      'Firmware module allowing direct USB and air-gapped PSBT validation from BTCovenants desktop node. Requires verifiable build scripts and unit test harness.',
    amount_usd: 1250,
    amount_btc: 0.0131787,
    btc_price_locked: 94850,
    timeline_days: 7,
    status: 'active',
    is_public: true,
    buyer_id: PERSONAS.alice.id,
    buyer_username: PERSONAS.alice.username,
    buyer_pubkey: PERSONAS.alice.public_key,
    provider_id: PERSONAS.satoshi.id,
    provider_username: PERSONAS.satoshi.username,
    provider_pubkey: PERSONAS.satoshi.public_key,
    buyer_signed: true,
    provider_signed: false,
    buyer_done: false,
    provider_done: false,
    platform_fee_usd: 12.5,
    network_fee_sats: 1200,
    escrow_address: 'tb1p7104c33209077c0v7104c3320ataproot2of3',
    funding_txid: null,
    settlement_txid: null,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    deadline_at: new Date(Date.now() + 6 * 86400000).toISOString(),
    messages: [
      {
        id: 'msg-7104-1',
        ticket_id: 'cov-7104-3320',
        sender_id: 'system',
        sender_username: 'BTCovenants Oracle',
        content:
          'Ticket created by alice_buyer. Awaiting Schnorr signature from satoshi_dev to generate funding script.',
        is_system: true,
        created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      },
      {
        id: 'msg-7104-2',
        ticket_id: 'cov-7104-3320',
        sender_id: PERSONAS.alice.id,
        sender_username: PERSONAS.alice.username,
        content: 'Hi Satoshi, please sign this contract when you have a moment to initiate the multisig escrow.',
        created_at: new Date(Date.now() - 0.9 * 86400000).toISOString(),
      },
    ],
  },
  {
    id: 'cov-6109-1244',
    title: 'Discreet Log Contract (DLC) Formal Security Audit',
    description:
      'Rigorous mathematical and cryptographic validation of oracle signatures and adaptors across extreme Bitcoin market volatility regimes.',
    amount_usd: 9200,
    amount_btc: 0.09699525,
    btc_price_locked: 94850,
    timeline_days: 21,
    status: 'completed',
    is_public: true,
    buyer_id: PERSONAS.alice.id,
    buyer_username: PERSONAS.alice.username,
    buyer_pubkey: PERSONAS.alice.public_key,
    provider_id: PERSONAS.satoshi.id,
    provider_username: PERSONAS.satoshi.username,
    provider_pubkey: PERSONAS.satoshi.public_key,
    buyer_signed: true,
    provider_signed: true,
    buyer_done: true,
    provider_done: true,
    platform_fee_usd: 92.0,
    network_fee_sats: 1200,
    escrow_address: 'tb1p6109f12449077c0v6109f1244ataproot2of3',
    funding_txid: '3f8a0029b47cf8e119842a8b9e6580f48a73b98c195e87a201c9b31d8f760e12',
    settlement_txid: '9b7a44f210c9d78e3a2416b08e5c120984f738a192c837b461098ec19284fa98',
    created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    deadline_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    messages: [
      {
        id: 'msg-6109-1',
        ticket_id: 'cov-6109-1244',
        sender_id: 'system',
        sender_username: 'BTCovenants Oracle',
        content:
          'Audit report received and signed. Both parties confirmed fulfillment. 0.09699525 BTC settlement broadcast to Bitcoin mempool.',
        is_system: true,
        created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
    ],
  },
  {
    id: 'cov-5022-7711',
    title: 'Bitaxe Ultra Mining Rig Custom Overclocking Profile',
    description:
      'Tuning ASIC voltages, fan curves, and frequency binning for maximum hash/watt efficiency on Solo CKPool testnet setup.',
    amount_usd: 350,
    amount_btc: 0.00369004,
    btc_price_locked: 94850,
    timeline_days: 5,
    status: 'pending',
    is_public: true,
    buyer_id: PERSONAS.alice.id,
    buyer_username: PERSONAS.alice.username,
    buyer_pubkey: PERSONAS.alice.public_key,
    provider_id: null,
    provider_username: null,
    provider_pubkey: null,
    buyer_signed: true,
    provider_signed: false,
    buyer_done: false,
    provider_done: false,
    platform_fee_usd: 3.5,
    network_fee_sats: 1200,
    escrow_address: 'tb1p5022f77119077c0v5022f7711ataproot2of3',
    funding_txid: null,
    settlement_txid: null,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    deadline_at: new Date(Date.now() + 5 * 86400000).toISOString(),
    messages: [
      {
        id: 'msg-5022-1',
        ticket_id: 'cov-5022-7711',
        sender_id: 'system',
        sender_username: 'BTCovenants Coordinator',
        content:
          'Deal ticket published to public discovery board. Any qualified hardware engineer can review and claim.',
        is_system: true,
        created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
      },
    ],
  },
]
