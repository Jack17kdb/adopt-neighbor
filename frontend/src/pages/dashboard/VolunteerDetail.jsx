import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../../store/authStore';
import DashLayout from '../../components/DashLayout';
import { ArrowLeft, User } from 'lucide-react';

export default function VolunteerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [v, setV] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/admin/volunteers/${id}`)
      .then(r => setV(r.data))
      .catch(() => navigate('/dashboard/volunteers'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <DashLayout><div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-light)' }}>Loading...</div></DashLayout>;
  if (!v) return null;

  return (
    <DashLayout
      title="Volunteer Details"
      action={
        <button className="btn-outline" onClick={() => navigate('/dashboard/volunteers')} style={{ padding: '10px 20px', fontSize: '14px' }}>
          <ArrowLeft size={15} /> Back to Volunteers
        </button>
      }
    >
      <div style={{ maxWidth: '680px' }}>
        <div className="card" style={{ padding: '32px', marginBottom: '20px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(26,58,42,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={28} color="var(--forest)" />
            </div>
            <div>
              <h2 className="font-display" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--forest)' }}>{v.name}</h2>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                <span className={`badge badge-${v.status}`}>{v.status}</span>
                <span className={`badge badge-${v.eligibility ? 'eligible' : 'ineligible'}`}>{v.eligibility ? 'Eligible' : 'Not Eligible'}</span>
              </div>
            </div>
          </div>

          {/* Details */}
          {[
            { label: 'Email', value: v.email },
            { label: 'Phone', value: v.phone },
            { label: 'Address', value: v.address },
            { label: 'Comments', value: v.comments || v.comment || '—' },
            { label: 'Joined', value: new Date(v.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
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
