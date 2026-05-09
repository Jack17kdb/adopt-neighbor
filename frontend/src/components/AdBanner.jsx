import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function AdBanner({ slot, format = 'auto', layout, style = {}, className = '' }) {
  const location = useLocation();
  const adRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    pushed.current = false;
  }, [location.pathname]);

  useEffect(() => {
    if (pushed.current) return;
    const timer = setTimeout(() => {
      try {
        if (adRef.current && adRef.current.getAttribute('data-ad-status') !== 'done') {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushed.current = true;
        }
      } catch (e) {}
    }, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!slot) return null;

  return (
    <div className={className} style={{ overflow: 'hidden', textAlign: 'center', ...style }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2209522216706705"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        {...(layout ? { 'data-ad-layout': layout } : {})}
      />
    </div>
  );
}
