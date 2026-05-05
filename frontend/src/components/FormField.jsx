export default function FormField({ label, required, error, children, hint }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-dark)' }}>
        {label} {required && <span style={{ color: 'var(--gold)' }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ fontSize: '12px', marginTop: '5px', color: 'var(--text-light)' }}>{hint}</p>}
      {error && <p style={{ fontSize: '12px', marginTop: '5px', color: '#dc3545' }}>{error}</p>}
    </div>
  );
}
