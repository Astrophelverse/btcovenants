import { User, Key, Palette, Bell, Monitor, HelpCircle, ChevronRight } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'

const sections = [
  {
    label: 'Other',
    items: [
      { icon: User,       label: 'Profile',       desc: 'Update your username and email' },
      { icon: Key,        label: 'Account',       desc: 'Password and security settings' },
      { icon: Palette,    label: 'Appearance',    desc: 'Theme preferences' },
      { icon: Bell,       label: 'Notifications', desc: 'Deal and ticket alerts' },
      { icon: Monitor,    label: 'Display',       desc: 'Layout and display options' },
    ],
  },
]

export default function Settings() {
  return (
    <AppLayout>
      <div className="p-8 max-w-2xl">
        <div className="mb-8">
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.65rem', color: 'oklch(0.75 0.18 145)', letterSpacing: '0.2em', marginBottom: '0.35rem' }}>PREFERENCES</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, color: 'oklch(0.95 0.01 260)' }}>SETTINGS</h1>
        </div>

        {sections.map(section => (
          <div key={section.label} className="mb-6">
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.6rem', color: 'oklch(0.4 0.01 260)', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>{section.label.toUpperCase()}</p>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid oklch(0.13 0.01 260)' }}>
              {section.items.map((item, i) => (
                <button key={item.label} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem 1.25rem', background: 'oklch(0.07 0.008 260)',
                  borderBottom: i < section.items.length - 1 ? '1px solid oklch(0.1 0.01 260)' : 'none',
                  border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0.09 0.01 260)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'oklch(0.07 0.008 260)')}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'oklch(0.1 0.01 260)', border: '1px solid oklch(0.15 0.01 260)' }}>
                    <item.icon size={14} style={{ color: 'oklch(0.55 0.01 260)' }} />
                  </div>
                  <div className="flex-1">
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.78rem', color: 'oklch(0.85 0.01 260)', fontWeight: 600, letterSpacing: '0.03em' }}>{item.label}</p>
                    <p style={{ fontSize: '0.72rem', color: 'oklch(0.4 0.01 260)', marginTop: '0.15rem' }}>{item.desc}</p>
                  </div>
                  <ChevronRight size={14} style={{ color: 'oklch(0.3 0.01 260)' }} />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Help center */}
        <button style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '1rem',
          padding: '1rem 1.25rem', background: 'oklch(0.07 0.008 260)',
          border: '1px solid oklch(0.13 0.01 260)', borderRadius: '12px',
          cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0.09 0.01 260)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'oklch(0.07 0.008 260)')}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'oklch(0.1 0.01 260)', border: '1px solid oklch(0.15 0.01 260)' }}>
            <HelpCircle size={14} style={{ color: 'oklch(0.55 0.01 260)' }} />
          </div>
          <div className="flex-1">
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.78rem', color: 'oklch(0.85 0.01 260)', fontWeight: 600, letterSpacing: '0.03em' }}>Help Center</p>
            <p style={{ fontSize: '0.72rem', color: 'oklch(0.4 0.01 260)', marginTop: '0.15rem' }}>Documentation and support</p>
          </div>
          <ChevronRight size={14} style={{ color: 'oklch(0.3 0.01 260)' }} />
        </button>
      </div>
    </AppLayout>
  )
}
