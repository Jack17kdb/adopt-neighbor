import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { API } from '../../store/authStore';
import DashLayout from '../../components/DashLayout';
import StatCard from '../../components/StatCard';
import { Users, Heart, GitMerge, UserCog, Mail, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ volunteers: 0, neighbors: 0, matches: 0, confirmed: 0 });
  const [recentMatches, setRecentMatches] = useState([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [vRes, nRes, mRes] = await Promise.all([
          API.get('/admin/volunteers'),
          API.get('/admin/neighbors'),
          API.get('/matches'),
        ]);
        setStats({
          volunteers: vRes.data.length,
          neighbors: nRes.data.length,
          matches: mRes.data.length,
          confirmed: mRes.data.filter(m => m.status === 'confirmed').length,
        });
        setRecentMatches(mRes.data.slice(0, 5));
      } catch { } finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const sendCheckIns = async () => {
    setSending(true);
    try {
      await API.post('/email/checkin');
      toast.success('Check-in emails sent to all confirmed matches!');
    } catch {
      toast.error('Failed to send check-in emails');
    } finally { setSending(false); }
  };

  return (
    <DashLayout
      title={`Welcome back, ${user?.username} 👋`}
      subtitle={`${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
      action={
        <button className="btn-primary" onClick={sendCheckIns} disabled={sending}>
          <Mail size={16} /> {sending ? 'Sending...' : 'Send Check-in Emails'}
        </button>
      }
    >
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <StatCard label="Total Volunteers" value={loading ? '...' : stats.volunteers} icon={Users} color="var(--forest)" />
        <StatCard label="Total Neighbors" value={loading ? '...' : stats.neighbors} icon={Heart} color="var(--gold)" />
        <StatCard label="Total Matches" value={loading ? '...' : stats.matches} icon={GitMerge} color="var(--forest-light)" />
        <StatCard label="Confirmed Matches" value={loading ? '...' : stats.confirmed} icon={CheckCircle} color="#22a06b" sub="Both sides confirmed" />
      </div>

      {/* Quick actions + recent matches */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '20px', alignItems: 'start' }}>
        {/* Quick actions */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 className="font-display" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--forest)', marginBottom: '18px' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'View All Volunteers', to: '/dashboard/volunteers', icon: Users, color: 'var(--forest)' },
              { label: 'View All Neighbors', to: '/dashboard/neighbors', icon: Heart, color: 'var(--gold)' },
              { label: 'Manage Matches', to: '/dashboard/matches', icon: GitMerge, color: 'var(--forest-light)' },
              ...(user?.role === 'admin' ? [{ label: 'Staff Members', to: '/dashboard/staff', icon: UserCog, color: '#6644cc' }] : []),
            ].map(({ label, to, icon: Icon, color }) => (
              <button key={to} onClick={() => navigate(to)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: '12px', background: 'white', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--text-dark)', fontWeight: 500 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}08`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'white'; }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={17} style={{ color }} />
                </div>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Matches */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 className="font-display" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--forest)' }}>Recent Matches</h3>
            <button onClick={() => navigate('/dashboard/matches')} style={{ fontSize: '13px', color: 'var(--forest-light)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>View all →</button>
          </div>
          {recentMatches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-light)', fontSize: '14px' }}>
              <GitMerge size={32} style={{ margin: '0 auto 10px', display: 'block', opacity: 0.3 }} />
              No matches yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentMatches.map(m => (
                <div key={m._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: '10px', background: '#fafaf8' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>Match #{m._id.slice(-6)}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>
                      {new Date(m.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`badge badge-${m.status}`}>{m.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashLayout>
  );
}
