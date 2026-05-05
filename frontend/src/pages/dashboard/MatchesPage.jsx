import { useEffect, useState } from 'react';
import { API } from '../../store/authStore';
import DashLayout from '../../components/DashLayout';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import SearchFilter from '../../components/SearchFilter';
import { GitMerge, Plus, CheckCircle, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [neighbors, setNeighbors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [matchForm, setMatchForm] = useState({ volunteerName: '', neighborName: '' });
  const [creating, setCreating] = useState(false);

  const fetchAll = async () => {
    try {
      const [mRes, vRes, nRes] = await Promise.all([
        API.get('/matches'),
        API.get('/admin/volunteers'),
        API.get('/admin/neighbors'),
      ]);
      setMatches(mRes.data);
      setVolunteers(vRes.data.filter(v => v.status === 'unmatched' && v.eligibility));
      setNeighbors(nRes.data.filter(n => n.status === 'unmatched'));
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const createMatch = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await API.post('/matches', matchForm);
      toast.success('Match created! Emails sent to both parties.');
      setShowCreate(false);
      setMatchForm({ volunteerName: '', neighborName: '' });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create match');
    } finally { setCreating(false); }
  };

  const confirmVolunteer = async (name) => {
    try {
      await API.post('/matches/confirm-volunteer', { name });
      toast.success('Volunteer confirmed');
      fetchAll();
    } catch { toast.error('Failed to confirm volunteer'); }
  };

  const confirmNeighbor = async (name) => {
    try {
      await API.post('/matches/confirm-neighbor', { name });
      toast.success('Neighbor confirmed');
      fetchAll();
    } catch { toast.error('Failed to confirm neighbor'); }
  };

  const rematch = async (matchId) => {
    if (!confirm('Are you sure you want to close this match and release both parties?')) return;
    try {
      await API.put(`/matches/rematch/${matchId}`);
      toast.success('Match closed, parties released');
      fetchAll();
    } catch { toast.error('Failed to rematch'); }
  };

  const filtered = matches.filter(m => {
    const matchS = !filterStatus || m.status === filterStatus;
    return matchS;
  });

  return (
    <DashLayout
      title="Matches"
      subtitle={`${matches.length} total matches`}
      action={
        <button className="btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={16} /> Create Match
        </button>
      }
    >
      <SearchFilter value={search} onChange={setSearch} placeholder="Search matches...">
        <select className="input-field" style={{ width: 'auto', minWidth: '150px' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="managed">Managed</option>
          <option value="closed">Closed</option>
        </select>
      </SearchFilter>

      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-light)' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-light)' }}>
            <GitMerge size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.25 }} />
            No matches found
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Match ID</th>
                <th>Status</th>
                <th>Volunteer</th>
                <th>Neighbor</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-light)' }}>#{m._id.slice(-8)}</td>
                  <td><span className={`badge badge-${m.status}`}>{m.status}</span></td>
                  <td>
                    <div style={{ fontSize: '13px' }}>
                      <div style={{ color: 'var(--text-mid)', marginTop: '2px' }}>
                        Conf: <span className={`badge badge-${m.confirmedVolunteer === 'C' ? 'confirmed' : 'pending'}`} style={{ fontSize: '11px', padding: '2px 8px' }}>{m.confirmedVolunteer === 'C' ? 'Yes' : 'No'}</span>
                        {m.confirmedVolunteer !== 'C' && m.status !== 'closed' && (
                          <button onClick={() => confirmVolunteer(m.volunteerId)} className="btn-primary" style={{ fontSize: '11px', padding: '3px 10px', marginLeft: '6px', borderRadius: '6px' }}>
                            <CheckCircle size={11} /> Confirm
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px' }}>
                      <div style={{ color: 'var(--text-mid)', marginTop: '2px' }}>
                        Conf: <span className={`badge badge-${m.confirmedNeighbor === 'C' ? 'confirmed' : 'pending'}`} style={{ fontSize: '11px', padding: '2px 8px' }}>{m.confirmedNeighbor === 'C' ? 'Yes' : 'No'}</span>
                        {m.confirmedNeighbor !== 'C' && m.status !== 'closed' && (
                          <button onClick={() => confirmNeighbor(m.neighborId)} className="btn-primary" style={{ fontSize: '11px', padding: '3px 10px', marginLeft: '6px', borderRadius: '6px' }}>
                            <CheckCircle size={11} /> Confirm
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-light)', fontSize: '13px' }}>{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td>
                    {m.status !== 'closed' && (
                      <button onClick={() => rematch(m._id)} className="btn-danger" style={{ fontSize: '12px', padding: '6px 12px' }}>
                        <RotateCcw size={12} /> Close
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Match Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create New Match">
        <p style={{ color: 'var(--text-mid)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>Select an eligible, unmatched volunteer and an unmatched neighbor. Both will receive email notifications.</p>
        <form onSubmit={createMatch}>
          <FormField label="Volunteer" required hint="Only eligible, unmatched volunteers shown">
            <select className="input-field" value={matchForm.volunteerName} onChange={e => setMatchForm(p => ({ ...p, volunteerName: e.target.value }))} required>
              <option value="">Select volunteer...</option>
              {volunteers.map(v => <option key={v._id} value={v.name}>{v.name} — {v.address}</option>)}
            </select>
          </FormField>
          <FormField label="Neighbor" required hint="Only unmatched neighbors shown">
            <select className="input-field" value={matchForm.neighborName} onChange={e => setMatchForm(p => ({ ...p, neighborName: e.target.value }))} required>
              <option value="">Select neighbor...</option>
              {neighbors.map(n => <option key={n._id} value={n.name}>{n.name} — {n.needs.slice(0, 40)}</option>)}
            </select>
          </FormField>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="button" className="btn-outline" onClick={() => setShowCreate(false)} style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={creating} style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>
              <GitMerge size={16} /> {creating ? 'Creating...' : 'Create Match'}
            </button>
          </div>
        </form>
      </Modal>
    </DashLayout>
  );
}
