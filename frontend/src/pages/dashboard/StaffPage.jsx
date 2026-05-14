import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../store/authStore';
import DashLayout from '../../components/DashLayout';
import SearchFilter from '../../components/SearchFilter';
import { ChevronRight } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';

export default function StaffPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');

  useEffect(() => {
    API.get('/admin/staff').then(r => setStaff(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = staff.filter(s => {
    const q = search.toLowerCase();
    return (!q || s.username.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)) && (!filterRole || s.role === filterRole);
  });

  return (
    <DashLayout title="Staff" subtitle={`${staff.length} users`}>
      <SearchFilter value={search} onChange={setSearch} placeholder="Search staff...">
        <select className="input-field" style={{ width: isMobile ? '100%' : '140px' }} value={filterRole} onChange={e => setFilterRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
        </select>
      </SearchFilter>

      <div className="card" style={{ overflowX: 'auto' }}>
        {loading ? <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div> : (
          <table className="data-table">
            <thead><tr><th>User</th>{!isMobile && <th>Email</th>}<th>Role</th><th></th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s._id} className="clickable" onClick={() => navigate(`/dashboard/staff/${s._id}`)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                        {s.username[0].toUpperCase()}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{s.username}</span>
                        {isMobile && <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>{s.email}</span>}
                      </div>
                    </div>
                  </td>
                  {!isMobile && <td style={{ color: 'var(--text-mid)' }}>{s.email}</td>}
                  <td><span className={`badge badge-${s.role}`}>{s.role}</span></td>
                  <td><ChevronRight size={16}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashLayout>
  );
}
