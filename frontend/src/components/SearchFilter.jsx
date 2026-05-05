export default function SearchFilter({ value, onChange, placeholder, children }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
      <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
        <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" fill="none" stroke="var(--text-light)" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          className="input-field"
          style={{ paddingLeft: '38px' }}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || 'Search...'}
        />
      </div>
      {children}
    </div>
  );
}
