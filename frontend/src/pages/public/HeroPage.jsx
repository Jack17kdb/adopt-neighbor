import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Leaf, Heart, Users, Shield, Mail, ArrowRight, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HeroPage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const btnsRef = useRef(null);
  const statsRef = useRef(null);
  const howRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Hero entrance
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.hero-badge', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
        .fromTo('.title-word', { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, '-=0.3')
        .fromTo(subtitleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.4')
        .fromTo('.hero-btn', { y: 20, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1 }, '-=0.3')
        .fromTo('.hero-scroll-hint', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.1');

      // Floating leaves
      gsap.utils.toArray('.leaf-deco').forEach((el, i) => {
        gsap.to(el, {
          y: -25 + Math.random() * 50,
          x: -15 + Math.random() * 30,
          rotation: -15 + Math.random() * 30,
          duration: 3 + Math.random() * 3,
          repeat: -1, yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.35,
        });
      });

      // Stats scroll
      gsap.fromTo('.stat-item', { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power2.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 80%' } });

      // How cards
      gsap.fromTo('.how-card', { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.2, ease: 'power2.out',
          scrollTrigger: { trigger: howRef.current, start: 'top 75%' } });

      // Features
      gsap.fromTo('.feature-item', { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: featuresRef.current, start: 'top 80%' } });

      // CTA
      gsap.fromTo('.cta-section', { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: '.cta-section', start: 'top 80%' } });

    }, heroRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef}>
      {/* HERO */}
      <section className="hero-bg">
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(122,171,138,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(200,168,75,0.08)', pointerEvents: 'none' }} />

        {/* Floating leaves */}
        {[...Array(7)].map((_, i) => (
          <div key={i} className="leaf-deco" style={{ position: 'absolute', left: `${12 + i * 13}%`, top: `${10 + (i % 3) * 28}%`, pointerEvents: 'none', opacity: 0.12 }}>
            <Leaf size={14 + (i % 3) * 12} color="white" />
          </div>
        ))}

        {/* Nav */}
        <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={18} color="white" />
            </div>
            <span className="font-display" style={{ color: 'white', fontSize: '20px', fontWeight: 700 }}>Adopt a Neighbor</span>
          </div>
          <button
            onClick={() => navigate('/staff/login')}
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: 'white', padding: '9px 22px', borderRadius: '50px', fontSize: '14px', cursor: 'pointer', backdropFilter: 'blur(8px)', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
          >
            Staff Login
          </button>
        </nav>

        {/* Hero content */}
        <div style={{ textAlign: 'center', padding: '70px 24px 130px', maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(200,168,75,0.2)', border: '1px solid rgba(200,168,75,0.4)', color: 'var(--gold-light)', padding: '7px 20px', borderRadius: '50px', fontSize: '13px', fontWeight: 600, marginBottom: '36px', backdropFilter: 'blur(8px)' }}>
            <Star size={13} fill="currentColor" /> Community Care Program
          </div>

          <h1 ref={titleRef} className="font-display" style={{ fontSize: 'clamp(44px, 8vw, 88px)', fontWeight: 700, color: 'white', lineHeight: 1.05, letterSpacing: '-1px', marginBottom: '28px' }}>
            <span className="title-word" style={{ display: 'inline-block', marginRight: '16px' }}>Neighbors</span>
            <span className="title-word" style={{ display: 'inline-block', color: 'var(--gold-light)', fontStyle: 'italic', marginRight: '16px' }}>helping</span>
            <span className="title-word" style={{ display: 'inline-block' }}>neighbors</span>
          </h1>

          <p ref={subtitleRef} style={{ fontSize: '18px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, marginBottom: '52px', maxWidth: '560px', margin: '0 auto 52px', fontWeight: 300 }}>
            Connecting compassionate volunteers with elderly and vulnerable community members who need a helping hand. No sign-up required — just show up with kindness.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="hero-btn btn-gold" onClick={() => navigate('/volunteer')} style={{ padding: '16px 40px', fontSize: '16px', fontWeight: 600 }}>
              <Heart size={18} /> I can help
            </button>
            <button className="hero-btn" onClick={() => navigate('/neighbor')} style={{ background: 'rgba(255,255,255,0.12)', border: '2px solid rgba(255,255,255,0.35)', color: 'white', padding: '14px 40px', borderRadius: '50px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'all 0.25s', backdropFilter: 'blur(8px)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <Users size={18} /> I need help
            </button>
          </div>

          <p className="hero-scroll-hint" style={{ marginTop: '68px', color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>Scroll to learn more ↓</p>
        </div>

        {/* Wave */}
        <svg style={{ position: 'absolute', bottom: '-2px', left: 0, width: '100%', display: 'block' }} viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
          <path d="M0 80L1440 80L1440 30C1200 70 960 10 720 40C480 70 240 10 0 30Z" fill="#fdfaf5" />
        </svg>
      </section>

      {/* STATS */}
      <section ref={statsRef} style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          {[
            { num: '500+', label: 'Volunteers', icon: '🤝' },
            { num: '1,200+', label: 'Neighbors Helped', icon: '🏡' },
            { num: '98%', label: 'Satisfaction Rate', icon: '⭐' },
            { num: '5 yrs', label: 'Of Community Care', icon: '🌿' },
          ].map(s => (
            <div key={s.label} className="stat-item" style={{ textAlign: 'center', padding: '32px 20px', background: 'white', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{s.icon}</div>
              <div className="font-display" style={{ fontSize: '40px', fontWeight: 700, color: 'var(--forest)', lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-light)', marginTop: '6px', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section ref={howRef} style={{ padding: '40px 24px 80px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ background: 'rgba(26,58,42,0.1)', color: 'var(--forest-light)', padding: '5px 18px', borderRadius: '50px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase' }}>How It Works</span>
          <h2 className="font-display" style={{ fontSize: '40px', fontWeight: 700, marginTop: '18px', color: 'var(--forest)' }}>Simple. Human. Effective.</h2>
          <p style={{ color: 'var(--text-mid)', marginTop: '12px', maxWidth: '460px', margin: '12px auto 0', lineHeight: 1.7 }}>No complicated registration. Fill in your details and our staff will handle the rest.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            { step: '01', title: 'Fill Your Details', desc: 'Tell us who you are — volunteer or neighbor. Simple form, no account needed.', icon: '📝' },
            { step: '02', title: 'We Match You', desc: 'Our caring staff reviews and personally matches volunteers with neighbors nearby.', icon: '💚' },
            { step: '03', title: 'Start Connecting', desc: 'You receive an email confirmation and a meaningful community connection begins.', icon: '🌱' },
          ].map(h => (
            <div key={h.step} className="how-card" style={{ background: 'white', borderRadius: '20px', padding: '36px 28px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-soft)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-8px', right: '-4px', fontFamily: 'Playfair Display, serif', fontSize: '90px', fontWeight: 700, color: 'var(--forest)', opacity: 0.04, lineHeight: 1 }}>{h.step}</div>
              <div style={{ fontSize: '38px', marginBottom: '20px' }}>{h.icon}</div>
              <h3 className="font-display" style={{ fontSize: '22px', fontWeight: 700, color: 'var(--forest)', marginBottom: '10px' }}>{h.title}</h3>
              <p style={{ color: 'var(--text-mid)', lineHeight: 1.7, fontSize: '15px' }}>{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section ref={featuresRef} style={{ padding: '80px 24px', background: 'var(--forest)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(200,168,75,0.05)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' }}>
          <div>
            <span style={{ background: 'rgba(200,168,75,0.2)', color: 'var(--gold-light)', padding: '5px 18px', borderRadius: '50px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase' }}>Our Promise</span>
            <h2 className="font-display" style={{ fontSize: '40px', fontWeight: 700, color: 'white', marginTop: '18px', lineHeight: 1.15 }}>Built on trust &<br />community care</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '18px', lineHeight: 1.75, fontSize: '16px' }}>Every match is carefully handled by our dedicated staff who genuinely care about the wellbeing of both volunteers and neighbors.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {[
              { icon: Shield, title: 'Safe & Verified', desc: 'All volunteers are reviewed before matching. Your safety is our priority.' },
              { icon: Heart, title: 'Personal Matching', desc: 'Our staff carefully matches based on location, availability, and specific needs.' },
              { icon: Mail, title: 'Stay Informed', desc: 'Regular check-in emails keep everyone connected and supported.' },
              { icon: Users, title: 'Real Community', desc: "We're not an app. We're real people building real connections." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="feature-item" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} color="var(--gold-light)" />
                </div>
                <div>
                  <div className="font-display" style={{ color: 'white', fontWeight: 600, marginBottom: '5px', fontSize: '17px' }}>{title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', lineHeight: 1.65 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <svg style={{ position: 'absolute', bottom: '-2px', left: 0, width: '100%', display: 'block' }} viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none">
          <path d="M0 60L1440 60L1440 20C1200 50 960 0 720 30C480 60 240 0 0 20Z" fill="#fdfaf5" />
        </svg>
      </section>

      {/* CTA */}
      <section className="cta-section" style={{ padding: '100px 24px', textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <h2 className="font-display" style={{ fontSize: '44px', fontWeight: 700, color: 'var(--forest)', marginBottom: '16px' }}>Ready to make a difference?</h2>
        <p style={{ color: 'var(--text-mid)', fontSize: '17px', lineHeight: 1.75, marginBottom: '44px' }}>Whether you want to give or receive — there's a place for you here.</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/volunteer')} className="btn-primary" style={{ padding: '15px 36px', fontSize: '16px' }}>
            <Heart size={18} /> Become a Volunteer <ArrowRight size={16} />
          </button>
          <button onClick={() => navigate('/neighbor')} className="btn-outline" style={{ padding: '13px 36px', fontSize: '16px' }}>
            <Users size={18} /> Request Help
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--charcoal)', color: 'rgba(255,255,255,0.45)', textAlign: 'center', padding: '28px 24px', fontSize: '13px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <Leaf size={14} color="var(--sage)" />
          <span className="font-display" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px' }}>Adopt a Neighbor</span>
        </div>
        <p>Connecting communities with compassion · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
