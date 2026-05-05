import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import { Leaf, LogIn, Eye, EyeOff } from 'lucide-react';
import FormField from '../../components/FormField';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, user, isLoading } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user]);

  useEffect(() => {
    gsap.fromTo(cardRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' });
  }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--forest) 0%, #1e4d30 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(200,168,75,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(122,171,138,0.08)', pointerEvents: 'none' }} />

      <div ref={cardRef} style={{ background: 'white', borderRadius: '24px', padding: '44px 40px', maxWidth: '440px', width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Leaf size={24} color="var(--gold-light)" />
          </div>
          <h1 className="font-display" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--forest)' }}>Staff Login</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '14px', marginTop: '8px' }}>Sign in to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <FormField label="Email Address" required>
            <input className="input-field" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="staff@adoptaneighbor.org" required autoFocus />
          </FormField>
          <FormField label="Password" required>
            <div style={{ position: 'relative' }}>
              <input className="input-field" type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" required style={{ paddingRight: '44px' }} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-light)' }}>
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </FormField>

          <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', marginTop: '8px' }}>
            <LogIn size={17} />
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-light)', marginTop: '24px' }}>
          Need an account?{' '}
          <Link to="/staff/register" style={{ color: 'var(--forest-light)', fontWeight: 600, textDecoration: 'none' }}>Register here</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/" style={{ fontSize: '13px', color: 'var(--text-light)', textDecoration: 'none' }}>← Back to homepage</Link>
        </p>
      </div>
    </div>
  );
}
