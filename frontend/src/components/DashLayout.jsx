import Sidebar from './Sidebar';

export default function DashLayout({ children, title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f6f2' }}>
      <Sidebar />
      <main className="dash-main" style={{ flex: 1 }}>
        {(title || action) && (
          <div style={{ padding: '32px 32px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              {title && <h1 className="font-display" style={{ fontSize: '30px', fontWeight: 700, color: 'var(--forest)' }}>{title}</h1>}
              {subtitle && <p style={{ color: 'var(--text-light)', fontSize: '14px', marginTop: '4px' }}>{subtitle}</p>}
            </div>
            {action && <div>{action}</div>}
          </div>
        )}
        <div style={{ padding: title ? '24px 32px 32px' : '32px' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
