import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../store/authStore';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import { Leaf, ArrowLeft, Heart } from 'lucide-react';
import FormField from '../../components/FormField';

export default function VolunteerForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', age: '', email: '', phone: '', disability: '', address: '', comment: '' });
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(cardRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' });
  }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

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

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--forest) 0%, var(--forest-mid) 100%)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(200,168,75,0.07)', pointerEvents: 'none' }} />
      <nav style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '50px', fontSize: '14px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={14} color="white" />
          </div>
          <span className="font-display" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px' }}>Adopt a Neighbor</span>
        </div>
      </nav>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 24px 40px' }}>
        <div ref={cardRef} style={{ background: 'white', borderRadius: '24px', padding: '40px', maxWidth: '560px', width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
          <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(26,58,42,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Heart size={24} color="var(--forest)" />
            </div>
            <div>
              <h1 className="font-display" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--forest)', lineHeight: 1.1 }}>I Can Help</h1>
              <p style={{ color: 'var(--text-light)', fontSize: '14px', marginTop: '6px', lineHeight: 1.6 }}>Wonderful! Fill in your details and our team will match you with a neighbor who needs your kindness.</p>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <FormField label="Full Name" required><input className="input-field" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Doe" required /></FormField>
              <FormField label="Age" required hint="Under 60, no disability = eligible"><input className="input-field" type="number" value={form.age} onChange={e => set('age', e.target.value)} placeholder="30" required min="18" max="99" /></FormField>
            </div>
            <FormField label="Email Address" required><input className="input-field" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@example.com" required /></FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
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
            <FormField label="Why do you want to volunteer?" required><textarea className="input-field" value={form.comment} onChange={e => set('comment', e.target.value)} placeholder="Tell us about yourself and why you'd like to help..." required /></FormField>
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', marginTop: '8px' }}>
              <Heart size={17} />{loading ? 'Submitting...' : 'Register as Volunteer'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-light)', marginTop: '16px' }}>No account needed. We'll contact you by email after reviewing your submission.</p>
        </div>
      </div>
    </div>
  );
}
