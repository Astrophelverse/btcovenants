import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Ticket, CheckSquare, User, Settings,
  Bitcoin, LogOut, Menu, X, ChevronRight,
} from 'lucide-react'
import { useAuthStore } from '../../store/auth'

const navItems = [
  { label: 'DASHBOARD', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'TICKETS',   icon: Ticket,          path: '/tickets' },
  { label: 'DEALS',     icon: CheckSquare,     path: '/deals' },
  { label: 'PROFILE',   icon: User,            path: '/profile' },
  { label: 'SETTINGS',  icon: Settings,        path: '/settings' },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="flex min-h-screen" style={{ background: 'oklch(0.04 0.005 260)' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col transition-all duration-300 relative"
        style={{
          width: collapsed ? '64px' : '220px',
          background: 'oklch(0.055 0.007 260)',
          borderRight: '1px solid oklch(0.12 0.01 260)',
          flexShrink: 0,
        }}
      >
        {/* Grid bg on sidebar */}
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center justify-between px-4 py-5" style={{ borderBottom: '1px solid oklch(0.1 0.01 260)' }}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'oklch(0.75 0.18 145 / 0.15)', border: '1px solid oklch(0.75 0.18 145 / 0.3)' }}>
                <Bitcoin size={14} style={{ color: 'oklch(0.75 0.18 145)' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.75rem', color: 'oklch(0.95 0.01 260)', letterSpacing: '0.1em' }}>
                BTCOVENANTS
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto p-1.5 rounded-lg transition-colors"
            style={{ color: 'oklch(0.4 0.01 260)', border: '1px solid oklch(0.12 0.01 260)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'oklch(0.75 0.18 145)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'oklch(0.4 0.01 260)')}
          >
            {collapsed ? <Menu size={14} /> : <X size={14} />}
          </button>
        </div>

        {/* Nav items */}
        <nav className="relative flex flex-col gap-1 p-2 flex-1">
          {navItems.map(({ label, icon: Icon, path }) => {
            const active = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                title={collapsed ? label : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: collapsed ? '0.625rem' : '0.625rem 0.75rem',
                  borderRadius: '8px', textDecoration: 'none',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  background: active ? 'oklch(0.75 0.18 145 / 0.12)' : 'transparent',
                  border: active ? '1px solid oklch(0.75 0.18 145 / 0.25)' : '1px solid transparent',
                  color: active ? 'oklch(0.75 0.18 145)' : 'oklch(0.4 0.01 260)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'oklch(0.08 0.009 260)'; e.currentTarget.style.color = 'oklch(0.75 0.01 260)' } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'oklch(0.4 0.01 260)' } }}
              >
                <Icon size={15} />
                {!collapsed && (
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: '0.08em', fontWeight: active ? 700 : 500 }}>
                    {label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User + logout */}
        <div className="relative p-3" style={{ borderTop: '1px solid oklch(0.1 0.01 260)' }}>
          {!collapsed && user && (
            <div className="flex items-center gap-2 px-2 py-2 mb-2 rounded-lg"
              style={{ background: 'oklch(0.07 0.008 260)', border: '1px solid oklch(0.12 0.01 260)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'oklch(0.75 0.18 145 / 0.2)', color: 'oklch(0.75 0.18 145)', fontFamily: 'var(--font-display)' }}>
                {(user.username || user.email)?.[0]?.toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: 'oklch(0.85 0.01 260)', letterSpacing: '0.05em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.username || 'unnamed'}
                </p>
                <p style={{ fontSize: '0.65rem', color: 'oklch(0.4 0.01 260)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              justifyContent: collapsed ? 'center' : 'flex-start',
              width: '100%', padding: collapsed ? '0.625rem' : '0.625rem 0.75rem',
              borderRadius: '8px', border: 'none', background: 'transparent',
              color: 'oklch(0.4 0.01 260)', cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'oklch(0.65 0.2 25)'; e.currentTarget.style.background = 'oklch(0.65 0.2 25 / 0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'oklch(0.4 0.01 260)'; e.currentTarget.style.background = 'transparent' }}
          >
            <LogOut size={15} />
            {!collapsed && <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: '0.08em' }}>LOGOUT</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto relative">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  )
}
