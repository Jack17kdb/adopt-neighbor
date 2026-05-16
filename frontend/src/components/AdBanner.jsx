import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function AdBanner({ slot, format = 'auto', layout, style = {}, className = '' }) {
  const location = useLocation();
  const adRef = useRef(null);
  const pushed = useRef(false);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    pushed.current = false;
    setFilled(false);
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

    const checkFilled = setInterval(() => {
      if (adRef.current) {
        const status = adRef.current.getAttribute('data-ad-status');
        const height = adRef.current.offsetHeight;
        if (status === 'filled' || height > 0) {
          setFilled(true);
          clearInterval(checkFilled);
        }
      }
    }, 500);

    const timeout = setTimeout(() => clearInterval(checkFilled), 5000);

    return () => { 
      clearTimeout(timer); 
      clearInterval(checkFilled); 
      clearTimeout(timeout);
    };
  }, [location.pathname]);

  if (!slot || !filled) {
    return (
      <div style={{ display: 'none' }}>
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

  return (
    <div
      className={className}
      style={{
        overflow: 'hidden',
        textAlign: 'center',
        width: '100%',
        ...style,
      }}
    >
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
