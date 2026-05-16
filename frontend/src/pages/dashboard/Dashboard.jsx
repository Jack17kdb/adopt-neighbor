import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { API } from '../../store/authStore';
import DashLayout from '../../components/DashLayout';
import StatCard from '../../components/StatCard';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import { Users, Heart, GitMerge, UserCog, Mail, CheckCircle, Wallet, ArrowDownLeft, ArrowUpRight, Smartphone, X, RefreshCw, Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';

const normalizePhone = (raw) => {
  const cleaned = raw.replace(/\D/g, '');
  if (cleaned.startsWith('254')) return cleaned;
  if (cleaned.startsWith('0')) return '254' + cleaned.slice(1);
  if (cleaned.startsWith('7') || cleaned.startsWith('1')) return '254' + cleaned;
  return cleaned;
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ volunteers: 0, neighbors: 0, matches: 0, confirmed: 0 });
  const [recentMatches, setRecentMatches] = useState([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState({ phone: '', amount: '', reason: 'BusinessPayment' });
  const [phoneDisplay, setPhoneDisplay] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

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

  const fetchBalance = async () => {
    if (user?.role !== 'admin') return;
    setBalanceLoading(true);
    try {
      const { data } = await API.get('/mpesa/balance');
      setBalance(data.balance);
      setTransactions(data.transactions || []);
    } catch {
      toast.error('Failed to fetch balance');
    } finally { setBalanceLoading(false); }
  };

  useEffect(() => {
    fetchStats();
    fetchBalance();
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

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const normalized = normalizePhone(withdrawForm.phone);
    if (normalized.length !== 12) return toast.error('Enter a valid Safaricom number');
    const amt = parseInt(withdrawForm.amount);
    if (!amt || amt < 10) return toast.error('Minimum withdrawal is KES 10');
    if (balance !== null && amt > balance) return toast.error(`Insufficient balance. Available: KES ${balance.toLocaleString()}`);

    setWithdrawing(true);
    try {
      const { data } = await API.post('/mpesa/withdraw', { phone: normalized, amount: amt, reason: withdrawForm.reason });
      toast.success(data.message);
      setShowWithdraw(false);
      setWithdrawForm({ phone: '', amount: '', reason: 'BusinessPayment' });
      setPhoneDisplay('');
      fetchBalance();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Withdrawal failed');
    } finally { setWithdrawing(false); }
  };

  const previewPhone = phoneDisplay ? normalizePhone(phoneDisplay) : '';

  return (
    <DashLayout
      title={`Welcome back, ${user?.username} \u{1F44B}`}
      subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      action={
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {user?.role === 'admin' && (
            <button className="btn-outline" onClick={() => setShowWithdraw(true)} style={{ padding: '10px 20px', fontSize: '14px', borderColor: '#00a651', color: '#00a651', flex: '1 1 auto' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#00a651'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#00a651'; }}>
              <ArrowUpRight size={16} /> Withdraw
            </button>
          )}
          <button className="btn-primary" onClick={sendCheckIns} disabled={sending} style={{ flex: '1 1 auto' }}>
            <Mail size={16} /> {sending ? 'Sending...' : 'Send Check-in Emails'}
          </button>
        </div>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <StatCard label="Total Volunteers" value={loading ? '...' : stats.volunteers} icon={Users} color="var(--forest)" />
        <StatCard label="Total Neighbors" value={loading ? '...' : stats.neighbors} icon={Heart} color="var(--gold)" />
        <StatCard label="Total Matches" value={loading ? '...' : stats.matches} icon={GitMerge} color="var(--forest-light)" />
        <StatCard label="Confirmed Matches" value={loading ? '...' : stats.confirmed} icon={CheckCircle} color="#22a06b" sub="Both sides confirmed" />
        {user?.role === 'admin' && (
          <div className="stat-card" style={{ gridColumn: '1 / -1', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-light)', marginBottom: '10px' }}>Account Balance</p>
                <p className="font-display" style={{ fontSize: 'min(36px, 8vw)', fontWeight: 700, color: '#00a651', lineHeight: 1 }}>
                  {balanceLoading ? '...' : balance === null ? '—' : `KES ${balance.toLocaleString()}`}
                </p>
                <p style={{ fontSize: '12px', marginTop: '6px', color: 'var(--text-light)' }}>M-Pesa contributions</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#e8f7ef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wallet size={22} color="#00a651" />
                </div>
                <button onClick={fetchBalance} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: '2px', borderRadius: '6px', display: 'flex', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--forest)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-light)'}>
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '20px', alignItems: 'start' }}>
        <div className="card" style={{ padding: '24px' }}>
          <h3 className="font-display" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--forest)', marginBottom: '18px' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'View All Volunteers', to: '/dashboard/volunteers', icon: Users, color: 'var(--forest)' },
              { label: 'View All Neighbors', to: '/dashboard/neighbors', icon: Heart, color: 'var(--gold)' },
              { label: 'Manage Matches', to: '/dashboard/matches', icon: GitMerge, color: 'var(--forest-light)' },
              ...(user?.role === 'admin' ? [
                { label: 'Staff Members', to: '/dashboard/staff', icon: UserCog, color: '#6644cc' },
                { label: 'Advertisements', to: '/dashboard/ads', icon: Megaphone, color: '#e05638' }
              ] : []),
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

        {user?.role === 'admin' && (
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 className="font-display" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--forest)' }}>Transactions</h3>
              <button onClick={fetchBalance} style={{ fontSize: '13px', color: 'var(--forest-light)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <RefreshCw size={13} /> Refresh
              </button>
            </div>
            {balanceLoading ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-light)', fontSize: '14px' }}>Loading...</div>
            ) : transactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-light)', fontSize: '14px' }}>
                <Wallet size={28} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.25 }} />
                No transactions yet
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                {transactions.map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', background: t.type === 'credit' ? '#f0faf5' : '#fff8f8' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: t.type === 'credit' ? '#e8f7ef' : '#fde8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {t.type === 'credit'
                        ? <ArrowDownLeft size={16} color="#00a651" />
                        : <ArrowUpRight size={16} color="#dc3545" />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>{t.description}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.phone} · {new Date(t.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: t.type === 'credit' ? '#00a651' : '#dc3545', flexShrink: 0 }}>
                      {t.type === 'credit' ? '+' : '-'}KES {Number(t.amount).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentMatches.map(m => (
                <div key={m._id} onClick={() => navigate('/dashboard/matches')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: '10px', background: '#fafaf8', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0f0ec'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fafaf8'}>
                  <div style={{ overflow: 'hidden', marginRight: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {m.volunteerId?.name || 'Volunteer'} → {m.neighborId?.name || 'Neighbor'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>
                      {new Date(m.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`badge badge-${m.status}`} style={{ flexShrink: 0 }}>{m.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal open={showWithdraw} onClose={() => { setShowWithdraw(false); setWithdrawForm({ phone: '', amount: '', reason: 'BusinessPayment' }); setPhoneDisplay(''); }} title="Withdraw Funds">
        <div style={{ background: '#f0faf5', border: '1px solid #c3e8d4', borderRadius: '12px', padding: '14px 16px', marginBottom: '22px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Available Balance</div>
          <div className="font-display" style={{ fontSize: '28px', fontWeight: 700, color: '#00a651' }}>
            KES {balance !== null ? balance.toLocaleString() : '—'}
          </div>
        </div>
        <form onSubmit={handleWithdraw}>
          <FormField label="Send to (Safaricom Number)" required hint={previewPhone ? `Will send to: ${previewPhone}` : 'Enter 07xx, 7xx, or 2547xx format'}>
            <input className="input-field" type="tel" value={phoneDisplay} onChange={e => { setPhoneDisplay(e.target.value); setWithdrawForm(p => ({ ...p, phone: e.target.value })); }} placeholder="0712 345 678" required />
          </FormField>
          <FormField label="Amount (KES)" required hint="Minimum KES 10">
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', fontWeight: 600, color: 'var(--text-mid)' }}>KES</span>
              <input className="input-field" type="number" value={withdrawForm.amount} onChange={e => setWithdrawForm(p => ({ ...p, amount: e.target.value }))} placeholder="1000" min="10" required style={{ paddingLeft: '52px' }} />
            </div>
          </FormField>
          <FormField label="Reason" required>
            <select className="input-field" value={withdrawForm.reason} onChange={e => setWithdrawForm(p => ({ ...p, reason: e.target.value }))}>
              <option value="BusinessPayment">General Withdrawal</option>
              <option value="SalaryPayment">Salary Payment</option>
              <option value="PromotionPayment">Program Expense</option>
            </select>
          </FormField>
          <div style={{ background: '#fff8e6', border: '1px solid #f0d080', borderRadius: '10px', padding: '10px 14px', marginBottom: '20px', fontSize: '13px', color: '#8a6000' }}>
            ⚠️ This will initiate a real M-Pesa B2C transfer. Please double-check the number and amount.
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button type="button" className="btn-outline" onClick={() => setShowWithdraw(false)} style={{ flex: '1 1 100px', justifyContent: 'center', padding: '12px' }}>Cancel</button>
            <button type="submit" disabled={withdrawing} style={{ flex: '2 1 150px', padding: '13px', borderRadius: '50px', border: 'none', background: withdrawing ? '#7dbf9a' : '#00a651', color: 'white', fontSize: '14px', fontWeight: 600, cursor: withdrawing ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}>
              <ArrowUpRight size={16} />{withdrawing ? 'Processing...' : `Withdraw KES ${withdrawForm.amount || '—'}`}
            </button>
          </div>
        </form>
      </Modal>
    </DashLayout>
  );
}
