import { useEffect, useState } from 'react';
import { API } from '../store/authStore';

export default function CustomAdBanner({ placement }) {
  const [ad, setAd] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAd(null);
    setChecked(false);
    API.get('/ads?placement=' + placement)
      .then(r => {
        const active = (r.data || []).filter(a => a.status === 'ACTIVE');
        if (active.length > 0) {
          setAd(active[Math.floor(Math.random() * active.length)]);
        }
      })
      .catch(() => {})
      .finally(() => setChecked(true));
  }, [placement]);

  if (!checked || !ad) return null;

  return (
    <div style={{ width: '100%', overflow: 'hidden', textAlign: 'center', paddingBottom: '16px' }}>
      <a
        href={ad.targetUrl && ad.targetUrl !== '#' ? ad.targetUrl : undefined}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'block', cursor: ad.targetUrl && ad.targetUrl !== '#' ? 'pointer' : 'default' }}
      >
        <img
          src={ad.image}
          alt={ad.title}
          style={{ width: '100%', maxWidth: '720px', height: 'auto', borderRadius: '12px', display: 'block', margin: '0 auto', objectFit: 'cover' }}
        />
      </a>
      <p style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '4px', letterSpacing: '0.5px' }}>SPONSORED</p>
    </div>
  );
}
