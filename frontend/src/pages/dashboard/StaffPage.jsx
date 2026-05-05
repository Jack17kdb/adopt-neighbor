import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../store/authStore';
import DashLayout from '../../components/DashLayout';
import SearchFilter from '../../components/SearchFilter';
import { UserCog, ChevronRight } from 'lucide-react';

export default function StaffPage() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');

  useEffect(() => {
    API.get('/admin/staff')
      .then(r => setStaff(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = staff.filter(s => {
    const q = search.toLowerCase();
    const matchQ = !q || s.username.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    const matchR = !filterRole || s.role === filterRole;
    return matchQ && matchR;
  });

  return (
    <DashLayout title="Staff Members" subtitle={`${staff.length} staff members`}>
      <SearchFilter value={search} onChange={setSearch} placeholder="Search by username or email...">
        <select className="input-field" style={{ width: 'auto', minWidth: '130px' }} value={filterRole} onChange={e => setFilterRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
        </select>
      </SearchFilter>

      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-light)' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-light)' }}>
            <UserCog size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.25 }} />
            No staff members found
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s._id} className="clickable" onClick={() => navigate(`/dashboard/staff/${s._id}`)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: s.role === 'admin' ? 'rgba(26,58,42,0.12)' : 'rgba(122,171,138,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forest)', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                        {s.username[0].toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600 }}>{s.username}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-mid)' }}>{s.email}</td>
                  <td><span className={`badge badge-${s.role}`}>{s.role}</span></td>
                  <td style={{ color: 'var(--text-light)', fontSize: '13px' }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td><ChevronRight size={16} color="var(--text-light)" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '12px' }}>Showing {filtered.length} of {staff.length} staff members</p>
    </DashLayout>
  );
}
