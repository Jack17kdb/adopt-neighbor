import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', margin: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(18px, 5vw, 22px)', fontWeight: 700, color: 'var(--forest)' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', display: 'flex', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            <X size={18} color="var(--text-light)" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
