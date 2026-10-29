import {
  Bitcoin,
  CheckCircle2,
  FileText,
  MessageSquare,
  Scale,
  Settings,
  ShieldCheck,
  Wallet,
  BookOpen,
  LayoutDashboard,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'alice_buyer',
    email: 'alice@btcovenants.org',
    avatar: '',
  },
  teams: [
    {
      name: 'BTCovenants',
      logo: Bitcoin,
      plan: 'Bitcoin-Native Escrow',
    },
    {
      name: 'Taproot 2-of-3 Vault',
      logo: ShieldCheck,
      plan: 'Schnorr Multisig',
    },
    {
      name: 'DLC Oracle Network',
      logo: Scale,
      plan: 'Price Stability Peg',
    },
  ],
  navGroups: [
    {
      title: 'Covenant Escrow',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Deal Tickets',
          url: '/tickets',
          icon: FileText,
          badge: '4',
        },
        {
          title: 'Public Ledger',
          url: '/deals',
          icon: CheckCircle2,
        },
        {
          title: 'Deal Chat',
          url: '/chats',
          icon: MessageSquare,
        },
      ],
    },
    {
      title: 'Bitcoin Protocols',
      items: [
        {
          title: 'Taproot Vault & Wallet',
          url: '/wallet',
          icon: Wallet,
        },
        {
          title: 'DLC Price Lock',
          url: '/dlc-calculator',
          icon: Scale,
        },
      ],
    },
    {
      title: 'Platform',
      items: [
        {
          title: 'Documentation',
          url: '/docs',
          icon: BookOpen,
        },
        {
          title: 'Settings',
          url: '/settings',
          icon: Settings,
        },
      ],
    },
  ],
}
