import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../../store/authStore';
import DashLayout from '../../components/DashLayout';
import { ArrowLeft, Home } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';

export default function NeighborDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [n, setN] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/admin/neighbors/${id}`)
      .then(r => setN(r.data))
      .catch(() => navigate('/dashboard/neighbors'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <DashLayout><div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div></DashLayout>;
  if (!n) return null;

  const detailRowStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    padding: '16px 0',
    borderBottom: '1px solid var(--border)',
    gap: isMobile ? '4px' : '20px'
  };

  return (
    <DashLayout
      title="Neighbor Details"
      action={
        <button className="btn-outline" onClick={() => navigate('/dashboard/neighbors')}>
          <ArrowLeft size={15} /> Back
        </button>
      }
    >
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div className="card" style={{ padding: 'clamp(20px, 5vw, 32px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(200,168,75,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Home size={28} color="var(--gold)" />
            </div>
            <div>
              <h2 className="font-display" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--forest)' }}>{n.name}</h2>
              <span className={`badge badge-${n.status}`} style={{ marginTop: '6px', display: 'inline-block' }}>{n.status}</span>
            </div>
          </div>
          {[
            { label: 'Email', value: n.email || '—' },
            { label: 'Phone', value: n.phone },
            { label: 'Address', value: n.address },
            { label: 'Needs', value: n.needs },
            { label: 'Comments', value: n.comments || n.comment || '—' },
            { label: 'Joined', value: new Date(n.createdAt).toLocaleDateString() },
          ].map(({ label, value }) => (
            <div key={label} style={detailRowStyle}>
              <span style={{ fontWeight: 600, color: 'var(--text-light)', fontSize: '13px', textTransform: 'uppercase' }}>{label}</span>
              <span style={{ color: 'var(--text-dark)', lineHeight: 1.5 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </DashLayout>
  );
}
