import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../store/authStore';
import DashLayout from '../../components/DashLayout';
import SearchFilter from '../../components/SearchFilter';
import { ChevronRight, CheckCircle, XCircle, Calendar, Phone } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';

export default function VolunteersPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterEligibility, setFilterEligibility] = useState('');

  useEffect(() => {
    API.get('/admin/volunteers').then(r => setVolunteers(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = volunteers.filter(v => {
    const q = search.toLowerCase();
    const matchQ = !q || v.name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q) || v.phone.includes(q);
    const matchS = !filterStatus || v.status === filterStatus;
    const matchE = !filterEligibility || (filterEligibility === 'eligible' ? v.eligibility : !v.eligibility);
    return matchQ && matchS && matchE;
  });

  return (
    <DashLayout title="Volunteers" subtitle={`${volunteers.length} total`}>
      <SearchFilter value={search} onChange={setSearch} placeholder="Search volunteers...">
        <div style={{ display: 'flex', gap: '8px', flexWrap: isMobile ? 'wrap' : 'nowrap', width: isMobile ? '100%' : 'auto' }}>
          <select className="input-field" style={{ flex: 1 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Statuses</option>
            <option value="unmatched">Unmatched</option>
            <option value="matched">Matched</option>
          </select>
          <select className="input-field" style={{ flex: 1 }} value={filterEligibility} onChange={e => setFilterEligibility(e.target.value)}>
            <option value="">Eligibility</option>
            <option value="eligible">Eligible</option>
            <option value="ineligible">Ineligible</option>
          </select>
        </div>
      </SearchFilter>

      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>Loading...</div>
      ) : isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(v => (
            <div key={v._id} className="card" style={{ padding: '16px' }} onClick={() => navigate(`/dashboard/volunteers/${v._id}`)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700 }}>{v.name}</span>
                <span className={`badge badge-${v.status}`}>{v.status}</span>
              </div>
              <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-mid)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14}/> {v.phone}
              </div>
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: v.eligibility ? 'var(--forest)' : '#991b1b' }}>
                {v.eligibility ? <CheckCircle size={14}/> : <XCircle size={14}/>}
                {v.eligibility ? 'Eligible' : 'Ineligible'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Eligibility</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v._id} className="clickable" onClick={() => navigate(`/dashboard/volunteers/${v._id}`)}>
                  <td style={{ fontWeight: 600 }}>{v.name}</td>
                  <td style={{ color: 'var(--text-mid)' }}>{v.email}</td>
                  <td>{v.eligibility ? <CheckCircle size={16} color="#1a3a2a"/> : <XCircle size={16} color="#991b1b"/>}</td>
                  <td><span className={`badge badge-${v.status}`}>{v.status}</span></td>
                  <td><ChevronRight size={16}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashLayout>
  );
}
