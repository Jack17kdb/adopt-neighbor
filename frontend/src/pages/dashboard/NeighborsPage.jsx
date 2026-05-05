import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../store/authStore';
import DashLayout from '../../components/DashLayout';
import SearchFilter from '../../components/SearchFilter';
import { Heart, ChevronRight } from 'lucide-react';

export default function NeighborsPage() {
  const navigate = useNavigate();
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
    <DashLayout title="Neighbors" subtitle={`${neighbors.length} registered neighbors`}>
      <SearchFilter value={search} onChange={setSearch} placeholder="Search by name, email, phone or needs...">
        <select className="input-field" style={{ width: 'auto', minWidth: '140px' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="unmatched">Unmatched</option>
          <option value="matched">Matched</option>
        </select>
      </SearchFilter>

      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-light)' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-light)' }}>
            <Heart size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.25 }} />
            No neighbors found
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
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
                  <td style={{ color: 'var(--text-mid)' }}>{n.email || '—'}</td>
                  <td style={{ color: 'var(--text-mid)' }}>{n.phone}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-mid)' }}>{n.needs}</td>
                  <td><span className={`badge badge-${n.status}`}>{n.status}</span></td>
                  <td style={{ color: 'var(--text-light)', fontSize: '13px' }}>{new Date(n.createdAt).toLocaleDateString()}</td>
                  <td><ChevronRight size={16} color="var(--text-light)" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '12px' }}>Showing {filtered.length} of {neighbors.length} neighbors</p>
    </DashLayout>
  );
}
