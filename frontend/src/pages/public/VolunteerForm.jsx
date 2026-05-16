import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../store/authStore';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import { Leaf, ArrowLeft, Heart, Smartphone, X, Globe } from 'lucide-react';
import FormField from '../../components/FormField';
import PayPalButton from '../../components/PayPalButton';
import AdBanner from '../../components/AdBanner';
import CustomAdBanner from '../../components/CustomAdBanner';

const normalizePhone = (raw) => {
  const cleaned = raw.replace(/\D/g, '');
  if (cleaned.startsWith('254')) return cleaned;
  if (cleaned.startsWith('0')) return '254' + cleaned.slice(1);
  if (cleaned.startsWith('7') || cleaned.startsWith('1')) return '254' + cleaned;
  return cleaned;
};

export default function VolunteerForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', age: '', email: '', phone: '', disability: '', address: '', comment: '' });
  const [loading, setLoading] = useState(false);
  const [showMpesa, setShowMpesa] = useState(false);
  const [showPaypal, setShowPaypal] = useState(false);
  const [mpesaForm, setMpesaForm] = useState({ phone: '', amount: '' });
  const [mpesaLoading, setMpesaLoading] = useState(false);
  const [phoneDisplay, setPhoneDisplay] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const cardRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(cardRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' });
  }, []);

  useEffect(() => {
    if (showMpesa && modalRef.current) {
      gsap.fromTo(modalRef.current, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.4)' });
    }
  }, [showMpesa]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setM = (k, v) => setMpesaForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/volunteers', form);
      toast.success("Thank you! We'll be in touch soon.");
      setTimeout(() => navigate('/'), 1800);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const handleMpesa = async (e) => {
    e.preventDefault();
    const normalized = normalizePhone(mpesaForm.phone);
    if (normalized.length !== 12) return toast.error('Enter a valid Safaricom number (07xx or 2547xx)');
    const amt = parseInt(mpesaForm.amount);
    if (!amt || amt < 1) return toast.error('Enter a valid amount (minimum KES 1)');
    setMpesaLoading(true);
    try {
      await API.post('/mpesa/stk-push', { phone: normalized, amount: amt });
      toast.success('STK push sent! Check your phone to confirm.');
      setShowMpesa(false);
      setMpesaForm({ phone: '', amount: '' });
      setPhoneDisplay('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'M-Pesa request failed. Try again.');
    } finally { setMpesaLoading(false); }
  };

  const handlePhoneInput = (raw) => { setPhoneDisplay(raw); setM('phone', raw); };
  const previewPhone = phoneDisplay ? `Will send to: ${normalizePhone(phoneDisplay)}` : '';

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--forest) 0%, var(--forest-mid) 100%)', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: isMobile ? '240px' : '400px', height: isMobile ? '240px' : '400px', borderRadius: '50%', background: 'rgba(200,168,75,0.07)', pointerEvents: 'none' }} />

      {/* Nav */}
      <nav style={{ padding: isMobile ? '16px 18px' : '20px 32px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '50px', fontSize: '14px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Leaf size={14} color="white" />
          </div>
          <span className="font-display" style={{ color: 'rgba(255,255,255,0.8)', fontSize: isMobile ? '14px' : '15px' }}>Adopt a Neighbor</span>
        </div>
      </nav>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '12px 14px 32px' : '24px 24px 40px' }}>

        <AdBanner slot="3894664502" format="auto" />
        <CustomAdBanner placement="hero-top" />

        {/* Form card */}
        <div ref={cardRef} style={{ background: 'white', borderRadius: isMobile ? '20px' : '24px', padding: isMobile ? '24px 18px' : '40px', maxWidth: '560px', width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>

          {/* Header */}
          <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', gap: isMobile ? '12px' : '16px' }}>
            <div style={{ width: isMobile ? '46px' : '52px', height: isMobile ? '46px' : '52px', borderRadius: '14px', background: 'rgba(26,58,42,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Heart size={isMobile ? 20 : 24} color="var(--forest)" />
            </div>
            <div>
              <h1 className="font-display" style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 700, color: 'var(--forest)', lineHeight: 1.1 }}>I Can Help</h1>
              <p style={{ color: 'var(--text-light)', fontSize: '14px', marginTop: '6px', lineHeight: 1.6 }}>Wonderful! Fill in your details and our team will match you with a neighbor who needs your kindness.</p>
            </div>
          </div>

          {/* Registration form */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '0' : '0 16px' }}>
              <FormField label="Full Name" required><input className="input-field" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Doe" required /></FormField>
              <FormField label="Age" required><input className="input-field" type="number" value={form.age} onChange={e => set('age', e.target.value)} placeholder="30" required min="18" max="99" /></FormField>
            </div>
            <FormField label="Email Address" required><input className="input-field" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@example.com" required /></FormField>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '0' : '0 16px' }}>
              <FormField label="Phone Number" required><input className="input-field" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+254 700 000000" required /></FormField>
              <FormField label="Do you have a disability?" required>
                <select className="input-field" value={form.disability} onChange={e => set('disability', e.target.value)} required>
                  <option value="">Select...</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </FormField>
            </div>
            <FormField label="Home Address" required><input className="input-field" value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Maple Street, Nairobi" required /></FormField>
            <FormField label="How do you want to volunteer?" required><textarea className="input-field" value={form.comment} onChange={e => set('comment', e.target.value)} placeholder="Tell us about yourself and how you'd like to help eg. education, filing taxes, shopping etc." required /></FormField>
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', marginTop: '8px' }}>
              <Heart size={17} />{loading ? 'Submitting...' : 'Register as Volunteer'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: 600, whiteSpace: 'nowrap' }}>WANT TO DO MORE?</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          {/* M-Pesa button */}
          <button type="button" onClick={() => setShowMpesa(true)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '13px', borderRadius: '50px', border: '2px solid #00a651', background: 'transparent', color: '#00a651', fontSize: isMobile ? '14px' : '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#00a651'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#00a651'; }}>
            <Smartphone size={18} /> Contribute via M-Pesa
          </button>

          {/* PayPal button */}
          <button type="button" onClick={() => setShowPaypal(true)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '13px', borderRadius: '50px', border: '2px solid #003087', background: 'transparent', color: '#003087', fontSize: isMobile ? '14px' : '15px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s', marginTop: '10px' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#003087'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#003087'; }}>
            <Globe size={18} /> Contribute via PayPal
          </button>

          <AdBanner slot="3894664502" format="auto" />
          <CustomAdBanner placement="form-bottom" />

          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-light)', marginTop: '12px', lineHeight: 1.6 }}>
            No account needed. We'll contact you by email after reviewing your submission.
          </p>
        </div>
      </div>

      {/* M-Pesa Modal */}
      {showMpesa && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '14px' : '20px', overflowY: 'auto' }} onClick={() => setShowMpesa(false)}>
          <div ref={modalRef} onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '24px', padding: isMobile ? '24px 18px' : '36px 32px', maxWidth: '420px', width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.25)', margin: isMobile ? '20px 0' : '0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#e8f7ef', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Smartphone size={22} color="#00a651" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h2 className="font-display" style={{ fontSize: isMobile ? '20px' : '22px', fontWeight: 700, color: 'var(--forest)', lineHeight: 1.1 }}>Contribute via M-Pesa</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '4px' }}>100% goes to community care</p>
                </div>
              </div>
              <button onClick={() => setShowMpesa(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-light)', display: 'flex', borderRadius: '8px', flexShrink: 0 }} onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                <X size={18} />
              </button>
            </div>
            <div style={{ background: '#f0faf5', border: '1px solid #c3e8d4', borderRadius: '12px', padding: '12px 16px', marginBottom: '22px', fontSize: '13px', color: '#1a6b3a', lineHeight: 1.6 }}>
              Your contribution helps cover operational costs and keeps our matching service free for everyone.
            </div>
            <form onSubmit={handleMpesa}>
              <FormField label="Safaricom Number" required hint={previewPhone || 'Enter 07xx, 7xx, or 2547xx format'}>
                <input className="input-field" type="tel" value={phoneDisplay} onChange={e => handlePhoneInput(e.target.value)} placeholder="0712 345 678" required />
              </FormField>
              <FormField label="Amount (KES)" required hint="Minimum KES 1">
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', fontWeight: 600, color: 'var(--text-mid)' }}>KES</span>
                  <input className="input-field" type="number" value={mpesaForm.amount} onChange={e => setM('amount', e.target.value)} placeholder="500" min="1" required style={{ paddingLeft: '52px' }} />
                </div>
              </FormField>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {[100, 250, 500, 1000].map(amt => (
                  <button key={amt} type="button" onClick={() => setM('amount', String(amt))} style={{ padding: '7px 16px', borderRadius: '50px', fontSize: '13px', fontWeight: 600, border: mpesaForm.amount === String(amt) ? '2px solid #00a651' : '2px solid var(--border)', background: mpesaForm.amount === String(amt) ? '#e8f7ef' : 'white', color: mpesaForm.amount === String(amt) ? '#00a651' : 'var(--text-mid)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s' }}>
                    {amt}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px' }}>
                <button type="button" onClick={() => setShowMpesa(false)} style={{ flex: 1, padding: '13px', borderRadius: '50px', border: '2px solid var(--border)', background: 'transparent', color: 'var(--text-mid)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Cancel</button>
                <button type="submit" disabled={mpesaLoading} style={{ flex: 2, padding: '13px', borderRadius: '50px', border: 'none', background: mpesaLoading ? '#7dbf9a' : '#00a651', color: 'white', fontSize: '14px', fontWeight: 600, cursor: mpesaLoading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
                  <Smartphone size={16} />{mpesaLoading ? 'Sending...' : `Pay KES ${mpesaForm.amount || '—'}`}
                </button>
              </div>
            </form>
            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-light)', marginTop: '16px' }}>Secured by Safaricom M-Pesa · You'll get a prompt on your phone</p>
          </div>
        </div>
      )}

      {/* PayPal Modal */}
      {showPaypal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '14px' : '20px', overflowY: 'auto' }} onClick={() => setShowPaypal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '24px', padding: isMobile ? '24px 18px' : '36px 32px', maxWidth: '440px', width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.25)', margin: isMobile ? '20px 0' : '0' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#e8eeff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Globe size={22} color="#003087" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h2 className="font-display" style={{ fontSize: isMobile ? '20px' : '22px', fontWeight: 700, color: 'var(--forest)', lineHeight: 1.1 }}>Contribute via PayPal</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '4px' }}>Secure international payment</p>
                </div>
              </div>
              <button onClick={() => setShowPaypal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-light)', display: 'flex', borderRadius: '8px', flexShrink: 0 }} onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                <X size={18} />
              </button>
            </div>
            <div style={{ background: '#f0f4ff', border: '1px solid #c8d8f8', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#003087', lineHeight: 1.6 }}>
              Your contribution supports our community matching service. PayPal is secure and accepts all major cards.
            </div>
            <PayPalButton onSuccess={() => setShowPaypal(false)} />
            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-light)', marginTop: '14px' }}>Secured by PayPal · All major cards accepted</p>
          </div>
        </div>
      )}
    </div>
  );
}
