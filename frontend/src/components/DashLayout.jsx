import Sidebar from './Sidebar';

export default function DashLayout({ children, title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', background: '#f8f6f2' }}>
      <Sidebar />
      <main className="dash-main" style={{ flex: 1, width: '100%', overflowX: 'hidden' }}>
        {(title || action) && (
          <div style={{ padding: 'clamp(16px, 5vw, 32px) clamp(16px, 5vw, 32px) 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: '1 1 300px' }}>
              {title && <h1 className="font-display" style={{ fontSize: 'clamp(24px, 6vw, 30px)', fontWeight: 700, color: 'var(--forest)' }}>{title}</h1>}
              {subtitle && <p style={{ color: 'var(--text-light)', fontSize: '14px', marginTop: '4px' }}>{subtitle}</p>}
            </div>
            {action && <div style={{ width: 'auto' }}>{action}</div>}
          </div>
        )}
        <div style={{ padding: title ? '24px clamp(16px, 5vw, 32px) 32px' : 'clamp(16px, 5vw, 32px)' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
