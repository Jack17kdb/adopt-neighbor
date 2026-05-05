import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../store/authStore';
import DashLayout from '../../components/DashLayout';
import SearchFilter from '../../components/SearchFilter';
import { Users, ChevronRight } from 'lucide-react';

export default function VolunteersPage() {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterEligibility, setFilterEligibility] = useState('');

  useEffect(() => {
    API.get('/admin/volunteers')
      .then(r => setVolunteers(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = volunteers.filter(v => {
    const q = search.toLowerCase();
    const matchQ = !q || v.name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q) || v.phone.includes(q);
    const matchS = !filterStatus || v.status === filterStatus;
    const matchE = !filterEligibility || (filterEligibility === 'eligible' ? v.eligibility : !v.eligibility);
    return matchQ && matchS && matchE;
  });

  return (
    <DashLayout title="Volunteers" subtitle={`${volunteers.length} registered volunteers`}>
      <SearchFilter value={search} onChange={setSearch} placeholder="Search by name, email or phone...">
        <select className="input-field" style={{ width: 'auto', minWidth: '140px' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="unmatched">Unmatched</option>
          <option value="matched">Matched</option>
        </select>
        <select className="input-field" style={{ width: 'auto', minWidth: '150px' }} value={filterEligibility} onChange={e => setFilterEligibility(e.target.value)}>
          <option value="">All Eligibilities</option>
          <option value="eligible">Eligible</option>
          <option value="ineligible">Not Eligible</option>
        </select>
      </SearchFilter>

      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-light)' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-light)' }}>
            <Users size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.25 }} />
            No volunteers found
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Eligibility</th>
                <th>Status</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v._id} className="clickable" onClick={() => navigate(`/dashboard/volunteers/${v._id}`)}>
                  <td style={{ fontWeight: 600 }}>{v.name}</td>
                  <td style={{ color: 'var(--text-mid)' }}>{v.email}</td>
                  <td style={{ color: 'var(--text-mid)' }}>{v.phone}</td>
                  <td><span className={`badge badge-${v.eligibility ? 'eligible' : 'ineligible'}`}>{v.eligibility ? 'Eligible' : 'Not Eligible'}</span></td>
                  <td><span className={`badge badge-${v.status}`}>{v.status}</span></td>
                  <td style={{ color: 'var(--text-light)', fontSize: '13px' }}>{new Date(v.createdAt).toLocaleDateString()}</td>
                  <td><ChevronRight size={16} color="var(--text-light)" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '12px' }}>Showing {filtered.length} of {volunteers.length} volunteers</p>
    </DashLayout>
  );
}
