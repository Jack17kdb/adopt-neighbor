import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../../store/authStore';
import DashLayout from '../../components/DashLayout';
import { ArrowLeft, Home } from 'lucide-react';

export default function NeighborDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [n, setN] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/admin/neighbors/${id}`)
      .then(r => setN(r.data))
      .catch(() => navigate('/dashboard/neighbors'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <DashLayout><div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-light)' }}>Loading...</div></DashLayout>;
  if (!n) return null;

  return (
    <DashLayout
      title="Neighbor Details"
      action={
        <button className="btn-outline" onClick={() => navigate('/dashboard/neighbors')} style={{ padding: '10px 20px', fontSize: '14px' }}>
          <ArrowLeft size={15} /> Back to Neighbors
        </button>
      }
    >
      <div style={{ maxWidth: '680px' }}>
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
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
            { label: 'Joined', value: new Date(n.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
          ].map(({ label, value }) => (
            <div key={label} className="detail-row">
              <span className="detail-label">{label}</span>
              <span className="detail-value">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </DashLayout>
  );
}
