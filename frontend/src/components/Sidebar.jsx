import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { LayoutDashboard, Users, Heart, GitMerge, UserCog, LogOut, Menu, X, Leaf, Megaphone } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/staff/login');
  };

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { to: '/dashboard/volunteers', icon: Users, label: 'Volunteers' },
    { to: '/dashboard/neighbors', icon: Heart, label: 'Neighbors' },
    { to: '/dashboard/matches', icon: GitMerge, label: 'Matches' },
    ...(user?.role === 'admin' ? [
      { to: '/dashboard/staff', icon: UserCog, label: 'Staff Members' },
      { to: '/dashboard/ads', icon: Megaphone, label: 'Advertisements' }
    ] : []),
  ];

  return (
    <>
      <button
        style={{ display: 'none', position: 'fixed', top: '16px', left: '16px', zIndex: 100, background: 'var(--forest)', color: 'white', border: 'none', borderRadius: '10px', padding: '10px', cursor: 'pointer' }}
        className="sidebar-toggle"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40, display: 'none' }} className="sidebar-overlay" />
      )}

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Leaf size={18} color="white" />
            </div>
            <div>
              <div className="font-display" style={{ color: 'white', fontSize: '15px', fontWeight: 700, lineHeight: 1.2 }}>Adopt a</div>
              <div className="font-display" style={{ color: 'var(--gold-light)', fontSize: '15px', lineHeight: 1.2 }}>Neighbor</div>
            </div>
          </div>
        </div>

        {/* User */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--forest)', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.username}</div>
              <span className={`badge badge-${user?.role}`} style={{ fontSize: '11px', padding: '2px 8px', marginTop: '3px', display: 'inline-block' }}>{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.8px', textTransform: 'uppercase', padding: '8px 10px 6px' }}>Menu</div>
          {links.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={handleLogout} className="sidebar-link" style={{ color: 'rgba(255,120,120,0.8)' }}>
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-toggle { display: flex !important; }
          .sidebar-overlay { display: block !important; }
        }
      `}</style>
    </>
  );
}
