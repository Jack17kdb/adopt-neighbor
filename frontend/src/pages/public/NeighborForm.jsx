import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../store/authStore';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import { Leaf, ArrowLeft, Users } from 'lucide-react';
import FormField from '../../components/FormField';
import AdBanner from '../../components/AdBanner';

export default function NeighborForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', needs: '', comment: '' });
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
      await API.post('/neighbors', form);
      toast.success("Request received! Our team will reach out soon.");
      setTimeout(() => navigate('/'), 1800);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2d1a3a 0%, var(--forest) 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          left: '-80px',
          width: 'clamp(220px, 40vw, 400px)',
          height: 'clamp(220px, 40vw, 400px)',
          borderRadius: '50%',
          background: 'rgba(200,168,75,0.06)',
          pointerEvents: 'none'
        }}
      />

      <nav
        style={{
          padding: '20px clamp(16px, 4vw, 32px)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '50px',
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: 0
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'var(--gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Leaf size={14} color="white" />
          </div>

          <span
            className="font-display"
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '15px',
              whiteSpace: 'nowrap'
            }}
          >
            Adopt a Neighbor
          </span>
        </div>
      </nav>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px clamp(16px, 4vw, 24px) 40px'
        }}
      >
        <div
          ref={cardRef}
          style={{
            background: 'white',
            borderRadius: '24px',
            padding: 'clamp(24px, 5vw, 40px)',
            maxWidth: '560px',
            width: '100%',
            boxShadow: '0 24px 80px rgba(0,0,0,0.2)'
          }}
        >
          <div
            style={{
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              flexDirection: window.innerWidth <= 480 ? 'column' : 'row'
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'rgba(200,168,75,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Users size={24} color="var(--gold)" />
            </div>

            <div style={{ minWidth: 0 }}>
              <h1
                className="font-display"
                style={{
                  fontSize: 'clamp(24px, 5vw, 28px)',
                  fontWeight: 700,
                  color: 'var(--forest)',
                  lineHeight: 1.1,
                  wordBreak: 'break-word'
                }}
              >
                I Need Help
              </h1>

              <p
                style={{
                  color: 'var(--text-light)',
                  fontSize: '14px',
                  marginTop: '6px',
                  lineHeight: 1.6
                }}
              >
                You're not alone. Share your details and our caring team will connect you with a local volunteer.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <FormField label="Full Name" required>
              <input
                className="input-field"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="John Smith"
                required
              />
            </FormField>

            <FormField label="Email Address" required>
              <input
                className="input-field"
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="john@example.com"
                required
              />
            </FormField>

            <FormField label="Phone Number" required>
              <input
                className="input-field"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="+254 700 000000"
                required
              />
            </FormField>

            <FormField label="Home Address" required>
              <input
                className="input-field"
                value={form.address}
                onChange={e => set('address', e.target.value)}
                placeholder="456 Oak Avenue, Nairobi"
                required
              />
            </FormField>

            <FormField
              label="What kind of help do you need?"
              required
              hint="e.g., grocery shopping, medical appointments, companionship"
            >
              <textarea
                className="input-field"
                value={form.needs}
                onChange={e => set('needs', e.target.value)}
                placeholder="I need help with weekly grocery shopping..."
                required
              />
            </FormField>

            <FormField label="Additional comments">
              <textarea
                className="input-field"
                value={form.comment}
                onChange={e => set('comment', e.target.value)}
                placeholder="Anything else our staff should know..."
                style={{ minHeight: '80px' }}
              />
            </FormField>

            <button
              type="submit"
              className="btn-gold"
              disabled={loading}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px',
                fontSize: '15px',
                marginTop: '8px'
              }}
            >
              <Users size={17} />
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>

          <p
            style={{
              textAlign: 'center',
              fontSize: '13px',
              color: 'var(--text-light)',
              marginTop: '16px',
              lineHeight: 1.6
            }}
          >
            Your information is kept private and only shared with your matched volunteer.
          </p>
        </div>

        <div
          style={{
            maxWidth: '560px',
            width: '100%',
            marginTop: '16px',
            overflow: 'hidden'
          }}
        >
          <AdBanner
            slot="3894664502"
            format="auto"
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              width: '100%'
            }}
          />
        </div>
      </div>
    </div>
  );
}
