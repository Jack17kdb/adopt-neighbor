import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, API } from '../../store/authStore';
import DashLayout from '../../components/DashLayout';
import SearchFilter from '../../components/SearchFilter';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import { ChevronRight, UserPlus, ShieldCheck } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';
import toast from 'react-hot-toast';

export default function StaffPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { addStaffMember } = useAuthStore();
  
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const fetchStaff = () => {
    setLoading(true);
    API.get('/admin/staff')
      .then(r => setStaff(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addStaffMember(form);
      toast.success('Staff member created successfully');
      setShowModal(false);
      setForm({ username: '', email: '', password: '' });
      fetchStaff();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = staff.filter(s => {
    const q = search.toLowerCase();
    return (!q || s.username.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)) && 
           (!filterRole || s.role === filterRole);
  });

  return (
    <DashLayout 
      title="Staff" 
      subtitle={`${staff.length} users`}
      action={
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <UserPlus size={18} /> {isMobile ? 'Add' : 'Create Staff'}
        </button>
      }
    >
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
            <thead>
              <tr>
                <th>User</th>
                {!isMobile && <th>Email</th>}
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
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

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add New Staff Member">
        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <ShieldCheck size={20} color="var(--forest)" />
          <p style={{ fontSize: '12px', color: 'var(--text-mid)', margin: 0 }}>
            New members are created with <strong>staff</strong> role.
          </p>
        </div>

        <form onSubmit={handleAddStaff} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FormField label="Username" required>
            <input 
              className="input-field" 
              type="text" 
              value={form.username} 
              onChange={e => setForm({...form, username: e.target.value})} 
              required 
            />
          </FormField>

          <FormField label="Email" required>
            <input 
              className="input-field" 
              type="email" 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
              required 
            />
          </FormField>

          <FormField label="Password" required>
            <input 
              className="input-field" 
              type="password" 
              value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})} 
              required 
              minLength={6}
            />
          </FormField>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button type="button" className="btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ flex: 2 }}>
              {submitting ? 'Creating...' : 'Create Staff'}
            </button>
          </div>
        </form>
      </Modal>
    </DashLayout>
  );
}
