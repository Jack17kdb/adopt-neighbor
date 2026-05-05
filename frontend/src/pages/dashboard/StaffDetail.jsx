import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../../store/authStore';
import DashLayout from '../../components/DashLayout';
import { ArrowLeft, UserCog } from 'lucide-react';

export default function StaffDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/admin/staff/${id}`)
      .then(r => setMember(r.data))
      .catch(() => navigate('/dashboard/staff'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <DashLayout><div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-light)' }}>Loading...</div></DashLayout>;
  if (!member) return null;

  return (
    <DashLayout
      title="Staff Member Details"
      action={
        <button className="btn-outline" onClick={() => navigate('/dashboard/staff')} style={{ padding: '10px 20px', fontSize: '14px' }}>
          <ArrowLeft size={15} /> Back to Staff
        </button>
      }
    >
      <div style={{ maxWidth: '600px' }}>
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(26,58,42,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forest)', fontFamily: 'Playfair Display, serif', fontSize: '26px', fontWeight: 700 }}>
              {member.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="font-display" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--forest)' }}>{member.username}</h2>
              {member.role && <span className={`badge badge-${member.role}`} style={{ marginTop: '6px', display: 'inline-block' }}>{member.role}</span>}
            </div>
          </div>
          {[
            { label: 'Email', value: member.email },
            { label: 'Role', value: member.role || '—' },
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
