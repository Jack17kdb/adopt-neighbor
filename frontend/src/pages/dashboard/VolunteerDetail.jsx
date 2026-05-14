import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../../store/authStore';
import DashLayout from '../../components/DashLayout';
import { ArrowLeft, User } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';

export default function VolunteerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [v, setV] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/admin/volunteers/${id}`)
      .then(r => setV(r.data))
      .catch(() => navigate('/dashboard/volunteers'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <DashLayout><div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div></DashLayout>;
  if (!v) return null;

  return (
    <DashLayout
      title="Volunteer Profile"
      action={<button className="btn-outline" onClick={() => navigate('/dashboard/volunteers')}><ArrowLeft size={15}/> Back</button>}
    >
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div className="card" style={{ padding: 'clamp(20px, 5vw, 32px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(26,58,42,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={28} color="var(--forest)" />
            </div>
            <div>
              <h2 className="font-display" style={{ fontSize: '24px', fontWeight: 700 }}>{v.name}</h2>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <span className={`badge badge-${v.status}`}>{v.status}</span>
                <span className={`badge badge-${v.eligibility ? 'eligible' : 'ineligible'}`}>{v.eligibility ? 'Eligible' : 'Ineligible'}</span>
              </div>
            </div>
          </div>
          {[
            { label: 'Email', value: v.email },
            { label: 'Phone', value: v.phone },
            { label: 'Address', value: v.address },
            { label: 'Comments', value: v.comments || v.comment || '—' },
            { label: 'Member Since', value: new Date(v.createdAt).toLocaleDateString() },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border)', gap: isMobile ? '4px' : '12px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-light)', fontSize: '13px', textTransform: 'uppercase' }}>{label}</span>
              <span style={{ color: 'var(--text-dark)' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </DashLayout>
  );
}
