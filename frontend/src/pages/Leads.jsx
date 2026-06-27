import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const EMPTY = { firstName:'',lastName:'',email:'',phone:'',company:'',source:'Website',status:'NEW',visits:0,purchases:0,responses:0,socialEngagement:0 };
const SOURCES = ['LinkedIn','Facebook','Instagram','Website','Referral','Email','Cold Call'];
const STATUSES = ['NEW','CONTACTED','NEGOTIATION','CONVERTED','LOST'];

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modal, setModal] = useState(false);
  const [scoreModal, setScoreModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const [l, s] = await Promise.all([api.get('/leads'), api.get('/leads/stats')]);
      setLeads(l.data); setStats(s.data);
    } catch(e) {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filtered = leads.filter(l => {
    const match = `${l.firstName} ${l.lastName} ${l.email} ${l.company}`.toLowerCase().includes(search.toLowerCase());
    return match && (!statusFilter || l.status === statusFilter);
  });

  const openScore = async (id) => {
    const res = await api.get(`/leads/score/${id}`);
    setScoreModal(res.data);
  };

  const save = async () => {
    try {
      const payload = { ...form, visits: Number(form.visits), purchases: Number(form.purchases),
        responses: Number(form.responses), socialEngagement: Number(form.socialEngagement) };
      if (editing) await api.put(`/leads/${editing}`, payload);
      else await api.post('/leads', payload);
      setModal(false); load();
    } catch(e) { alert(e.response?.data?.message || 'Error saving lead'); }
  };

  const del = async (id) => { if (!window.confirm('Delete?')) return; await api.delete(`/leads/${id}`); load(); };

  const priorityBadge = (p) => <span className={`badge badge-${p?.toLowerCase()}`}>{p}</span>;
  const statusBadge = (s) => {
    const map = {NEW:'info',CONTACTED:'purple',NEGOTIATION:'warning',CONVERTED:'success',LOST:'danger'};
    return <span className={`badge badge-${map[s]||'info'}`}>{s}</span>;
  };

  const scoreColor = (s) => s >= 61 ? 'high' : s >= 31 ? 'medium' : 'low';

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>🎯 Lead Management</h2>
        <p>Track, score, and convert your leads with AI-powered prioritization.</p>
      </div>

      <div className="kpi-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        <div className="kpi-card indigo"><div className="kpi-icon indigo">🎯</div><div className="kpi-label">Total Leads</div><div className="kpi-value">{stats.total || 0}</div></div>
        <div className="kpi-card green"><div className="kpi-icon green">✅</div><div className="kpi-label">Converted</div><div className="kpi-value">{stats.converted || 0}</div></div>
        <div className="kpi-card amber"><div className="kpi-icon amber">🔥</div><div className="kpi-label">High Priority</div><div className="kpi-value">{leads.filter(l=>l.priority==='HIGH').length}</div></div>
        <div className="kpi-card red"><div className="kpi-icon red">⚠️</div><div className="kpi-label">Low Priority</div><div className="kpi-value">{leads.filter(l=>l.priority==='LOW').length}</div></div>
      </div>

      <div className="card">
        <div className="search-bar">
          <div className="search-input"><input placeholder="🔍 Search leads..." value={search} onChange={e=>setSearch(e.target.value)} /></div>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{minWidth:'140px'}}>
            <option value="">All Statuses</option>
            {STATUSES.map(s=><option key={s}>{s}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setEditing(null); setModal(true); }}>+ Add Lead</button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead><tr>
              <th>Name</th><th>Company</th><th>Source</th><th>Status</th>
              <th>Priority</th><th>Score</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id}>
                  <td>
                    <strong>{l.firstName} {l.lastName}</strong>
                    <div style={{fontSize:'11px',color:'var(--text-dim)'}}>{l.email}</div>
                  </td>
                  <td>{l.company}</td>
                  <td><span className="badge badge-info">{l.source}</span></td>
                  <td>{statusBadge(l.status)}</td>
                  <td>{priorityBadge(l.priority)}</td>
                  <td>
                    <div style={{minWidth:'80px'}}>
                      <div style={{fontSize:'13px',fontWeight:700,color:'var(--text)'}}>{l.score}/100</div>
                      <div className="score-bar"><div className={`score-fill ${scoreColor(l.score)}`} style={{width:`${l.score}%`}}></div></div>
                    </div>
                  </td>
                  <td>
                    <div style={{display:'flex',gap:'6px'}}>
                      <button className="btn btn-ghost btn-sm" onClick={()=>openScore(l.id)} title="AI Score">🤖</button>
                      <button className="btn btn-ghost btn-sm" onClick={()=>{setForm(l);setEditing(l.id);setModal(true);}}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={()=>del(l.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editing?'Edit Lead':'Add New Lead'}</h3>
              <button className="modal-close" onClick={()=>setModal(false)}>✕</button>
            </div>
            <div className="form-grid">
              {[['firstName','First Name'],['lastName','Last Name'],['email','Email'],['phone','Phone'],['company','Company']].map(([k,l])=>(
                <div className="form-group" key={k}><label>{l}</label><input value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={l} /></div>
              ))}
              <div className="form-group"><label>Source</label>
                <select value={form.source} onChange={e=>setForm({...form,source:e.target.value})}>
                  {SOURCES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Status</label>
                <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                  {STATUSES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{gridColumn:'1/-1',borderTop:'1px solid var(--border)',paddingTop:'16px',marginTop:'8px'}}>
                <p style={{fontSize:'12px',fontWeight:700,color:'var(--text-dim)',marginBottom:'12px',textTransform:'uppercase',letterSpacing:'0.5px'}}>🤖 AI Scoring Inputs</p>
                <div className="form-grid">
                  {[['visits','Visits (×10)'],['purchases','Purchases (×20)'],['responses','Responses (×15)'],['socialEngagement','Social Engagement (×10)']].map(([k,l])=>(
                    <div className="form-group" key={k}><label>{l}</label><input type="number" min="0" value={form[k]||0} onChange={e=>setForm({...form,[k]:e.target.value})} /></div>
                  ))}
                </div>
                <div style={{background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.2)',borderRadius:'10px',padding:'10px 14px',marginTop:'8px'}}>
                  <strong style={{fontSize:'13px',color:'var(--primary-light)'}}>
                    Predicted Score: {Math.min(100, Number(form.visits||0)*10 + Number(form.purchases||0)*20 + Number(form.responses||0)*15 + Number(form.socialEngagement||0)*10)}/100
                  </strong>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>💾 Save</button>
            </div>
          </div>
        </div>
      )}

      {scoreModal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setScoreModal(null)}>
          <div className="modal" style={{maxWidth:'420px'}}>
            <div className="modal-header">
              <h3>🤖 AI Lead Score — {scoreModal.name}</h3>
              <button className="modal-close" onClick={()=>setScoreModal(null)}>✕</button>
            </div>
            <div style={{textAlign:'center',marginBottom:'24px'}}>
              <div style={{fontSize:'64px',fontWeight:900,color:scoreModal.score>=61?'#10b981':scoreModal.score>=31?'#f59e0b':'#ef4444'}}>{scoreModal.score}</div>
              <div style={{fontSize:'14px',color:'var(--text-muted)'}}>out of 100</div>
              <span className={`badge badge-${scoreModal.score>=61?'success':scoreModal.score>=31?'warning':'danger'}`} style={{fontSize:'13px',padding:'6px 16px',marginTop:'8px'}}>{scoreModal.category}</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'16px'}}>
              {Object.entries(scoreModal.breakdown||{}).map(([k,v]) => (
                <div key={k} className="card-sm">
                  <div style={{fontSize:'11px',color:'var(--text-dim)',marginBottom:'4px'}}>{k.replace(/([A-Z])/g,' $1').trim()}</div>
                  <div style={{fontSize:'20px',fontWeight:700,color:'var(--text)'}}>{v}</div>
                </div>
              ))}
            </div>
            <div className="modal-footer"><button className="btn btn-primary" onClick={()=>setScoreModal(null)}>Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
