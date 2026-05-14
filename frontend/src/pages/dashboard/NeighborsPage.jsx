import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../store/authStore';
import DashLayout from '../../components/DashLayout';
import SearchFilter from '../../components/SearchFilter';
import { Heart, ChevronRight, Calendar, Phone } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';

export default function NeighborsPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [neighbors, setNeighbors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    API.get('/admin/neighbors')
      .then(r => setNeighbors(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = neighbors.filter(n => {
    const q = search.toLowerCase();
    const matchQ = !q || n.name.toLowerCase().includes(q) || n.email.toLowerCase().includes(q) || n.phone.includes(q) || n.needs.toLowerCase().includes(q);
    const matchS = !filterStatus || n.status === filterStatus;
    return matchQ && matchS;
  });

  return (
    <DashLayout title="Neighbors" subtitle={`${neighbors.length} total`}>
      <SearchFilter value={search} onChange={setSearch} placeholder="Search neighbors...">
        <select 
          className="input-field" 
          style={{ width: isMobile ? '100%' : '160px' }} 
          value={filterStatus} 
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="unmatched">Unmatched</option>
          <option value="matched">Matched</option>
        </select>
      </SearchFilter>

      <div style={{ background: 'transparent' }}>
        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-light)' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-light)' }}>
            <Heart size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.25 }} />
            No neighbors found
          </div>
        ) : isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(n => (
              <div key={n._id} className="card" style={{ padding: '16px' }} onClick={() => navigate(`/dashboard/neighbors/${n._id}`)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--forest)' }}>{n.name}</span>
                  <span className={`badge badge-${n.status}`}>{n.status}</span>
                </div>
                <div style={{ fontSize: '13px', display: 'flex', gap: '8px', marginBottom: '8px', color: 'var(--text-mid)' }}>
                  <Phone size={14} /> {n.phone}
                </div>
                <div style={{ fontSize: '13px', padding: '8px', background: 'var(--bg-light)', borderRadius: '6px', marginBottom: '12px' }}>
                  {n.needs}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-light)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12}/> {new Date(n.createdAt).toLocaleDateString()}</span>
                  <span style={{ color: 'var(--forest)', fontWeight: 600 }}>View Details →</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Needs</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(n => (
                  <tr key={n._id} className="clickable" onClick={() => navigate(`/dashboard/neighbors/${n._id}`)}>
                    <td style={{ fontWeight: 600 }}>{n.name}</td>
                    <td style={{ fontSize: '13px' }}>{n.email}<br/><span style={{ opacity: 0.6 }}>{n.phone}</span></td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.needs}</td>
                    <td><span className={`badge badge-${n.status}`}>{n.status}</span></td>
                    <td style={{ fontSize: '13px' }}>{new Date(n.createdAt).toLocaleDateString()}</td>
                    <td><ChevronRight size={16} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashLayout>
  );
}
