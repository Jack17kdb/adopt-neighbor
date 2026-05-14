export default function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="stat-card" style={{ height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-light)', marginBottom: '10px' }}>{label}</p>
          <p className="font-display" style={{ fontSize: 'clamp(32px, 8vw, 40px)', fontWeight: 700, color: color || 'var(--forest)', lineHeight: 1 }}>{value}</p>
          {sub && <p style={{ fontSize: '12px', marginTop: '6px', color: 'var(--text-light)', lineHeight: '1.3' }}>{sub}</p>}
        </div>
        {Icon && (
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color || 'var(--forest)'}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={22} style={{ color: color || 'var(--forest)' }} />
          </div>
        )}
      </div>
    </div>
  );
}
