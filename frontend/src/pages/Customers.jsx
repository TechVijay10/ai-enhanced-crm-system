import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const EMPTY = { firstName:'',lastName:'',email:'',phone:'',company:'',industry:'',status:'ACTIVE',category:'STANDARD',address:'',city:'',country:'' };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [interactionModal, setInteractionModal] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [interactionForm, setInteractionForm] = useState({ interactionType:'CALL', notes:'' });

  const load = async () => {
    setLoading(true);
    try {
      const [c, s] = await Promise.all([api.get('/customers'), api.get('/customers/stats')]);
      setCustomers(c.data); setStats(s.data);
    } catch(e) {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filtered = customers.filter(c =>
    `${c.firstName} ${c.lastName} ${c.email} ${c.company}`.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (c) => { setForm(c); setEditing(c.id); setModal(true); };

  const save = async () => {
    try {
      if (editing) await api.put(`/customers/${editing}`, form);
      else await api.post('/customers', form);
      setModal(false); load();
    } catch(e) { alert(e.response?.data?.message || 'Error saving customer'); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    await api.delete(`/customers/${id}`); load();
  };

  const openInteractions = async (c) => {
    setInteractionModal(c);
    const res = await api.get(`/customers/${c.id}/interactions`);
    setInteractions(res.data);
  };

  const addInteraction = async () => {
    await api.post(`/customers/${interactionModal.id}/interactions`, interactionForm);
    const res = await api.get(`/customers/${interactionModal.id}/interactions`);
    setInteractions(res.data);
    setInteractionForm({ interactionType:'CALL', notes:'' });
  };

  const statusBadge = (s) => {
    const map = { ACTIVE:'active', INACTIVE:'inactive' };
    return <span className={`badge badge-${map[s] || 'info'}`}>{s}</span>;
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>👥 Customer Management</h2>
        <p>Manage all your customers, interactions, and profiles.</p>
      </div>

      <div className="kpi-grid" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
        <div className="kpi-card indigo"><div className="kpi-icon indigo">👥</div><div className="kpi-label">Total</div><div className="kpi-value">{stats.total || 0}</div></div>
        <div className="kpi-card green"><div className="kpi-icon green">✅</div><div className="kpi-label">Active</div><div className="kpi-value">{stats.active || 0}</div></div>
        <div className="kpi-card red"><div className="kpi-icon red">❌</div><div className="kpi-label">Inactive</div><div className="kpi-value">{stats.inactive || 0}</div></div>
      </div>

      <div className="card">
        <div className="search-bar">
          <div className="search-input"><input placeholder="🔍 Search customers..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Customer</button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead><tr>
              <th>Name</th><th>Email</th><th>Company</th><th>Industry</th>
              <th>Status</th><th>Category</th><th>City</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{textAlign:'center',padding:'40px',color:'var(--text-dim)'}}>No customers found</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.firstName} {c.lastName}</strong></td>
                  <td><div className="email-cell" title={c.email}>{c.email}</div></td>
                  <td>{c.company}</td>
                  <td>{c.industry}</td>
                  <td>{statusBadge(c.status)}</td>
                  <td><span className="badge badge-info">{c.category}</span></td>
                  <td>{c.city}</td>
                  <td>
                    <div style={{display:'flex',gap:'6px'}}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openInteractions(c)}>📋</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => del(c.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editing ? 'Edit Customer' : 'Add New Customer'}</h3>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <div className="form-grid">
              {[['firstName','First Name'],['lastName','Last Name'],['email','Email'],['phone','Phone'],
                ['company','Company'],['industry','Industry'],['city','City'],['country','Country']].map(([k,l]) => (
                <div className="form-group" key={k}>
                  <label>{l}</label>
                  <input value={form[k] || ''} onChange={e => setForm({...form,[k]:e.target.value})} placeholder={l} />
                </div>
              ))}
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={e => setForm({...form,status:e.target.value})}>
                  <option>ACTIVE</option><option>INACTIVE</option>
                </select>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm({...form,category:e.target.value})}>
                  <option>STANDARD</option><option>PREMIUM</option><option>VIP</option>
                </select>
              </div>
              <div className="form-group full">
                <label>Address</label>
                <input value={form.address || ''} onChange={e => setForm({...form,address:e.target.value})} placeholder="Address" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>💾 Save</button>
            </div>
          </div>
        </div>
      )}

      {interactionModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setInteractionModal(null)}>
          <div className="modal" style={{maxWidth:'640px'}}>
            <div className="modal-header">
              <h3>📋 {interactionModal.firstName} {interactionModal.lastName} — Interactions</h3>
              <button className="modal-close" onClick={() => setInteractionModal(null)}>✕</button>
            </div>
            <div style={{marginBottom:'16px'}}>
              <div className="form-grid" style={{gridTemplateColumns:'1fr 2fr'}}>
                <div className="form-group">
                  <label>Type</label>
                  <select value={interactionForm.interactionType} onChange={e => setInteractionForm({...interactionForm,interactionType:e.target.value})}>
                    <option>CALL</option><option>EMAIL</option><option>MEETING</option><option>DEMO</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <input value={interactionForm.notes} onChange={e => setInteractionForm({...interactionForm,notes:e.target.value})} placeholder="Interaction notes..." />
                </div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={addInteraction}>+ Add Interaction</button>
            </div>
            <div style={{maxHeight:'300px',overflowY:'auto'}}>
              {interactions.length === 0 ? <div className="empty-state"><p>No interactions yet</p></div> :
                interactions.map(i => (
                  <div key={i.id} className="card-sm" style={{marginBottom:'8px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                      <span className="badge badge-info">{i.interactionType}</span>
                      <span style={{fontSize:'11px',color:'var(--text-dim)'}}>{new Date(i.interactionDate).toLocaleString()}</span>
                    </div>
                    <p style={{fontSize:'13px',color:'var(--text-muted)'}}>{i.notes}</p>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
