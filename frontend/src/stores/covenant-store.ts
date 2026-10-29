import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  DealTicket,
  INITIAL_TICKETS,
  PERSONAS,
  UserPersona,
  calculatePlatformFee,
  generateRandomTxid,
  generateTaprootMultisigAddress,
  usdToBtc,
} from '@/lib/mock-covenants'

export interface FeeRates {
  fastestFee: number
  halfHourFee: number
  hourFee: number
  economyFee: number
  minimumFee: number
}

interface CovenantStore {
  // Current active demo persona
  activePersonaKey: 'alice' | 'satoshi' | 'arbiter'
  currentUser: UserPersona
  switchPersona: (key: 'alice' | 'satoshi' | 'arbiter') => void

  // Bitcoin network & market state
  btcPrice: number
  btcPriceChange24h: number
  feeRates: FeeRates
  setBtcPrice: (price: number) => void
  simulatePriceTick: () => void

  // Covenants and tickets
  tickets: DealTicket[]
  getTicket: (id: string) => DealTicket | undefined

  // Operations
  createTicket: (params: {
    title: string
    description: string
    amount_usd: number
    timeline_days: number
    provider_username?: string
    is_public?: boolean
  }) => DealTicket

  joinTicket: (ticketId: string) => void
  signTicket: (ticketId: string, role?: 'buyer' | 'provider') => void
  fundTicket: (ticketId: string) => void
  markDone: (ticketId: string, role?: 'buyer' | 'provider') => void
  sendMessage: (ticketId: string, content: string) => void
  faucetDeposit: (amountBtc: number) => void
  resetToDefault: () => void
}

export const useCovenantStore = create<CovenantStore>()(
  persist(
    (set, get) => ({
      activePersonaKey: 'alice',
      currentUser: PERSONAS.alice,

      switchPersona: (key) => {
        const persona = PERSONAS[key]
        if (persona) {
          set({ activePersonaKey: key, currentUser: persona })
        }
      },

      btcPrice: 94850,
      btcPriceChange24h: 3.42,
      feeRates: {
        fastestFee: 24,
        halfHourFee: 16,
        hourFee: 12,
        economyFee: 6,
        minimumFee: 2,
      },

      setBtcPrice: (price) => set({ btcPrice: price }),

      simulatePriceTick: () => {
        const delta = (Math.random() - 0.48) * 85
        const newPrice = Math.max(80000, Math.round((get().btcPrice + delta) * 100) / 100)
        set({ btcPrice: newPrice })
      },

      tickets: INITIAL_TICKETS,

      getTicket: (id) => get().tickets.find((t) => t.id === id),

      createTicket: ({ title, description, amount_usd, timeline_days, provider_username, is_public = true }) => {
        const current = get().currentUser
        const price = get().btcPrice
        const amount_btc = usdToBtc(amount_usd, price)
        const platform_fee = calculatePlatformFee(amount_usd)
        const network_sats = get().feeRates.economyFee * 200

        const newId = `cov-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`
        const escrowAddr = generateTaprootMultisigAddress(newId)

        // If target username matches Satoshi
        const targetIsSatoshi = provider_username?.toLowerCase() === 'satoshi' || provider_username?.toLowerCase() === 'satoshi_dev'

        const ticket: DealTicket = {
          id: newId,
          title,
          description,
          amount_usd,
          amount_btc,
          btc_price_locked: price,
          timeline_days,
          status: targetIsSatoshi ? 'active' : 'pending',
          is_public,
          buyer_id: current.id,
          buyer_username: current.username,
          buyer_pubkey: current.public_key,
          provider_id: targetIsSatoshi ? PERSONAS.satoshi.id : null,
          provider_username: targetIsSatoshi ? PERSONAS.satoshi.username : provider_username || null,
          provider_pubkey: targetIsSatoshi ? PERSONAS.satoshi.public_key : null,
          buyer_signed: true,
          provider_signed: false,
          buyer_done: false,
          provider_done: false,
          platform_fee_usd: platform_fee,
          network_fee_sats: network_sats,
          escrow_address: escrowAddr,
          funding_txid: null,
          settlement_txid: null,
          created_at: new Date().toISOString(),
          deadline_at: new Date(Date.now() + timeline_days * 86400000).toISOString(),
          messages: [
            {
              id: `msg-${Date.now()}-init`,
              ticket_id: newId,
              sender_id: 'system',
              sender_username: 'BTCovenants Coordinator',
              content: `Ticket created by @${current.username} for $${amount_usd.toLocaleString()} (~${amount_btc} BTC at $${price.toLocaleString()}/BTC). Taproot 2-of-3 multisig address generated: ${escrowAddr}`,
              is_system: true,
              created_at: new Date().toISOString(),
            },
          ],
        }

        set((state) => ({ tickets: [ticket, ...state.tickets] }))
        return ticket
      },

      joinTicket: (ticketId) => {
        const user = get().currentUser
        set((state) => ({
          tickets: state.tickets.map((t) => {
            if (t.id !== ticketId) return t
            if (t.provider_id) return t
            return {
              ...t,
              provider_id: user.id,
              provider_username: user.username,
              provider_pubkey: user.public_key,
              status: 'active',
              messages: [
                ...t.messages,
                {
                  id: `msg-${Date.now()}`,
                  ticket_id: ticketId,
                  sender_id: 'system',
                  sender_username: 'BTCovenants Coordinator',
                  content: `@${user.username} joined as the service provider. Covenant is now active and awaiting mutual Schnorr signatures.`,
                  is_system: true,
                  created_at: new Date().toISOString(),
                },
              ],
            }
          }),
        }))
      },

      signTicket: (ticketId, role) => {
        const user = get().currentUser
        set((state) => ({
          tickets: state.tickets.map((t) => {
            if (t.id !== ticketId) return t
            const effectiveRole = role || (t.buyer_id === user.id ? 'buyer' : 'provider')
            const buyer_signed = effectiveRole === 'buyer' ? true : t.buyer_signed
            const provider_signed = effectiveRole === 'provider' ? true : t.provider_signed

            const bothSigned = buyer_signed && provider_signed
            const newStatus = bothSigned ? 'funded' : t.status
            const funding_txid = bothSigned && !t.funding_txid ? generateRandomTxid() : t.funding_txid

            const roleMsg = effectiveRole === 'buyer' ? `@${t.buyer_username} (Buyer)` : `@${t.provider_username} (Provider)`

            return {
              ...t,
              buyer_signed,
              provider_signed,
              status: newStatus,
              funding_txid,
              messages: [
                ...t.messages,
                {
                  id: `msg-${Date.now()}`,
                  ticket_id: ticketId,
                  sender_id: 'system',
                  sender_username: 'Schnorr Signer',
                  content: `${roleMsg} signed the covenant agreement with Schnorr signature. ${
                    bothSigned
                      ? `Both parties have signed! Escrow funded with ${t.amount_btc} BTC on-chain (TxID: ${funding_txid?.slice(0, 16)}...).`
                      : 'Waiting for second party to sign.'
                  }`,
                  is_system: true,
                  created_at: new Date().toISOString(),
                },
              ],
            }
          }),
        }))
      },

      fundTicket: (ticketId) => {
        set((state) => ({
          tickets: state.tickets.map((t) => {
            if (t.id !== ticketId) return t
            const txid = generateRandomTxid()
            return {
              ...t,
              status: 'funded',
              funding_txid: txid,
              messages: [
                ...t.messages,
                {
                  id: `msg-${Date.now()}`,
                  ticket_id: ticketId,
                  sender_id: 'system',
                  sender_username: 'Mempool Tracker',
                  content: `Confirmed on-chain deposit of ${t.amount_btc} BTC to Taproot escrow address. Block height #892,142. TxID: ${txid}`,
                  is_system: true,
                  created_at: new Date().toISOString(),
                },
              ],
            }
          }),
        }))
      },

      markDone: (ticketId, role) => {
        const user = get().currentUser
        set((state) => ({
          tickets: state.tickets.map((t) => {
            if (t.id !== ticketId) return t
            const effectiveRole = role || (t.buyer_id === user.id ? 'buyer' : 'provider')
            const buyer_done = effectiveRole === 'buyer' ? true : t.buyer_done
            const provider_done = effectiveRole === 'provider' ? true : t.provider_done
            const bothDone = buyer_done && provider_done
            const settlement_txid = bothDone && !t.settlement_txid ? generateRandomTxid() : t.settlement_txid

            const roleMsg = effectiveRole === 'buyer' ? `@${t.buyer_username} (Buyer)` : `@${t.provider_username} (Provider)`

            return {
              ...t,
              buyer_done,
              provider_done,
              status: bothDone ? 'completed' : t.status,
              settlement_txid,
              messages: [
                ...t.messages,
                {
                  id: `msg-${Date.now()}`,
                  ticket_id: ticketId,
                  sender_id: 'system',
                  sender_username: 'Discreet Log Oracle',
                  content: `${roleMsg} confirmed fulfillment. ${
                    bothDone
                      ? `🎉 Deal 100% Completed! 2-of-3 Taproot covenant successfully executed. Released ${t.amount_btc} BTC ($${t.amount_usd.toLocaleString()}) to ${t.provider_username}. Settlement TxID: ${settlement_txid}`
                      : 'Waiting for counterpart confirmation to release locked sats.'
                  }`,
                  is_system: true,
                  created_at: new Date().toISOString(),
                },
              ],
            }
          }),
        }))
      },

      sendMessage: (ticketId, content) => {
        const user = get().currentUser
        const newMsg = {
          id: `msg-${Date.now()}`,
          ticket_id: ticketId,
          sender_id: user.id,
          sender_username: user.username,
          content,
          created_at: new Date().toISOString(),
        }

        set((state) => ({
          tickets: state.tickets.map((t) => {
            if (t.id !== ticketId) return t
            return {
              ...t,
              messages: [...t.messages, newMsg],
            }
          }),
        }))
      },

      faucetDeposit: (amountBtc) => {
        set((state) => {
          const user = state.currentUser
          const updatedUser = {
            ...user,
            balance_btc: Number((user.balance_btc + amountBtc).toFixed(6)),
          }
          return {
            currentUser: updatedUser,
          }
        })
      },

      resetToDefault: () => {
        set({
          tickets: INITIAL_TICKETS,
          activePersonaKey: 'alice',
          currentUser: PERSONAS.alice,
          btcPrice: 94850,
        })
      },
    }),
    {
      name: 'btcovenants-storage-v1',
    }
  )
)
