import { useEffect, useState } from 'react';
import { useAdStore } from '../../store/adStore';
import DashLayout from '../../components/DashLayout';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import toast from 'react-hot-toast';
import { Plus, Trash2, ToggleLeft, ToggleRight, Image as ImageIcon, ExternalLink, Megaphone, Calendar, Globe } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';

export default function AdsPage() {
  const isMobile = useIsMobile();
  const { ads, isLoading, fetchAds, createAd, toggleAdStatus, deleteAd } = useAdStore();
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    businessName: '', businessEmail: '', title: '', description: '',
    targetUrl: '', placement: 'DASHBOARD', durationDays: '30', amountPaid: '0', status: 'ACTIVE'
  });

  useEffect(() => { fetchAds(); }, []);

  const handleToggle = async (id) => {
    try {
      await toggleAdStatus(id);
      toast.success('Status updated');
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this advertisement permanently?')) return;
    try {
      await deleteAd(id);
      toast.success('Ad removed');
    } catch (err) { toast.error(err.message); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Upload a banner image');
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    formData.append('image', file);
    try {
      await createAd(formData);
      toast.success('Ad deployed');
      setShowModal(false);
      setFile(null);
    } catch (err) { toast.error(err.message); }
  };

  const ActionButtons = ({ ad }) => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <a 
        href={ad.targetUrl} 
        target="_blank" 
        rel="noreferrer" 
        className="icon-btn"
        style={{ color: 'var(--text-mid)', padding: '6px', borderRadius: '6px', border: '1px solid var(--border)' }}
      >
        <ExternalLink size={16} />
      </a>
      <button 
        onClick={() => handleToggle(ad._id)} 
        className="icon-btn"
        style={{ 
            color: ad.status === 'ACTIVE' ? '#22c55e' : 'var(--text-light)', 
            padding: '4px', 
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: '6px'
        }}
      >
        {ad.status === 'ACTIVE' ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
      </button>
      <button 
        onClick={() => handleDelete(ad._id)} 
        className="icon-btn"
        style={{ color: '#ef4444', padding: '6px', borderRadius: '6px', border: '1px solid var(--border)' }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <DashLayout 
      title="Advertisements" 
      subtitle="Manage local campaigns and sponsorship banners"
      action={
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> {isMobile ? 'Add' : 'Create Advertisement'}
        </button>
      }
    >
      {isLoading && ads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
      ) : ads.length === 0 ? (
        <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <Megaphone size={40} style={{ opacity: 0.1, marginBottom: '12px' }} />
          <p style={{ color: 'var(--text-light)' }}>No advertisements found.</p>
        </div>
      ) : (
        <div className={isMobile ? "" : "card"}>
          {isMobile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ads.map(ad => (
                <div key={ad._id} className="card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <img src={ad.image} style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '15px' }}>{ad.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{ad.businessName}</div>
                      <span className={`badge badge-${ad.status === 'ACTIVE' ? 'confirmed' : 'pending'}`} style={{ marginTop: '6px' }}>
                        {ad.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-light)', textTransform: 'uppercase' }}>Placement</div>
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>{ad.placement}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--text-light)', textTransform: 'uppercase' }}>Billing</div>
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>KES {ad.amountPaid} / {ad.durationDays}d</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                    <ActionButtons ad={ad} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '16px 20px', fontSize: '12px', color: 'var(--text-light)' }}>CAMPAIGN & CLIENT</th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', color: 'var(--text-light)' }}>PLACEMENT</th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', color: 'var(--text-light)' }}>BILLING</th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', color: 'var(--text-light)' }}>STATUS</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right', fontSize: '12px', color: 'var(--text-light)' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {ads.map(ad => (
                  <tr key={ad._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={ad.image} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{ad.title}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{ad.businessName}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Globe size={14} /> {ad.placement}
                        </div>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '13px' }}>
                        <div>KES {ad.amountPaid}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>{ad.durationDays} Days</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span className={`badge badge-${ad.status === 'ACTIVE' ? 'confirmed' : 'pending'}`}>{ad.status}</span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <ActionButtons ad={ad} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal remains same but use the gridTemplateColumns fix */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Create Campaign Banner">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <FormField label="Business Name" required>
              <input className="input-field" type="text" value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })} required />
            </FormField>
            <FormField label="Business Email" required>
              <input className="input-field" type="email" value={form.businessEmail} onChange={e => setForm({ ...form, businessEmail: e.target.value })} required />
            </FormField>
          </div>

          <FormField label="Ad Title" required>
            <input className="input-field" type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <FormField label="Placement" required>
              <select className="input-field" value={form.placement} onChange={e => setForm({ ...form, placement: e.target.value })}>
                <option value="DASHBOARD">Dashboard Sidebar</option>
                <option value="HOME_BANNER">Home Top Banner</option>
                <option value="SIDEBAR">General Sidebar</option>
              </select>
            </FormField>
            <FormField label="Days to Show" required>
              <input className="input-field" type="number" value={form.durationDays} onChange={e => setForm({ ...form, durationDays: e.target.value })} required />
            </FormField>
          </div>

          <FormField label="Target URL" required>
            <input className="input-field" type="url" value={form.targetUrl} onChange={e => setForm({ ...form, targetUrl: e.target.value })} placeholder="https://..." required />
          </FormField>

          <FormField label="Banner Image" required>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '1px dashed var(--border)', borderRadius: '8px', cursor: 'pointer' }}>
              <ImageIcon size={20} />
              <span style={{ fontSize: '13px' }}>{file ? file.name : 'Choose image...'}</span>
              <input type="file" onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} />
            </label>
          </FormField>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button type="button" className="btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 2 }}>Deploy Ad</button>
          </div>
        </form>
      </Modal>
    </DashLayout>
  );
}
