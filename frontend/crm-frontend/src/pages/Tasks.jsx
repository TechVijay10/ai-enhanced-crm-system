import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const EMPTY = { title:'', description:'', status:'PENDING', priority:'MEDIUM', dueDate:'' };
const STATUSES = ['PENDING','IN_PROGRESS','COMPLETED','OVERDUE'];
const PRIORITIES = ['LOW','MEDIUM','HIGH'];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const [t, s] = await Promise.all([api.get('/tasks'), api.get('/tasks/stats')]);
      setTasks(t.data); setStats(s.data);
    } catch(e) {} finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filtered = tasks.filter(t => !statusFilter || t.status === statusFilter);

  const save = async () => {
    try {
      const payload = { ...form, dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null };
      if (editing) await api.put(`/tasks/${editing}`, payload);
      else await api.post('/tasks', payload);
      setModal(false); load();
    } catch(e) { alert('Error saving task'); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete task?')) return;
    await api.delete(`/tasks/${id}`); load();
  };

  const statusBadge = (s) => {
    const map = {PENDING:'warning',IN_PROGRESS:'info',COMPLETED:'success',OVERDUE:'danger'};
    return <span className={`badge badge-${map[s]||'info'}`}>{s?.replace('_',' ')}</span>;
  };
  const priorityBadge = (p) => <span className={`badge badge-${p?.toLowerCase()}`}>{p}</span>;
  const isOverdue = (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED';

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>✅ Task Management</h2>
        <p>Create, assign, and track tasks with deadline monitoring.</p>
      </div>

      <div className="kpi-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        <div className="kpi-card indigo"><div className="kpi-icon indigo">📋</div><div className="kpi-label">Total</div><div className="kpi-value">{stats.total||0}</div></div>
        <div className="kpi-card amber"><div className="kpi-icon amber">⏳</div><div className="kpi-label">Pending</div><div className="kpi-value">{stats.byStatus?.PENDING||0}</div></div>
        <div className="kpi-card green"><div className="kpi-icon green">✅</div><div className="kpi-label">Completed</div><div className="kpi-value">{stats.byStatus?.COMPLETED||0}</div></div>
        <div className="kpi-card red"><div className="kpi-icon red">⚠️</div><div className="kpi-label">Overdue</div><div className="kpi-value">{stats.overdue||0}</div></div>
      </div>

      <div className="card">
        <div className="search-bar">
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{minWidth:'150px'}}>
            <option value="">All Statuses</option>
            {STATUSES.map(s=><option key={s}>{s}</option>)}
          </select>
          <button className="btn btn-primary" onClick={()=>{setForm(EMPTY);setEditing(null);setModal(true);}}>+ New Task</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Title</th><th>Status</th><th>Priority</th><th>Due Date</th><th>Alert</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={6} style={{textAlign:'center',padding:'40px',color:'var(--text-dim)'}}>No tasks found</td></tr>
                : filtered.map(t => (
                  <tr key={t.id} style={isOverdue(t)?{borderLeft:'3px solid #ef4444'}:{}}>
                    <td><strong>{t.title}</strong>{t.description&&<div style={{fontSize:'11px',color:'var(--text-dim)',marginTop:'2px'}}>{t.description.substring(0,50)}...</div>}</td>
                    <td>{statusBadge(t.status)}</td>
                    <td>{priorityBadge(t.priority)}</td>
                    <td style={{fontSize:'12px'}}>{t.dueDate?new Date(t.dueDate).toLocaleDateString():'—'}</td>
                    <td>{isOverdue(t)?<span className="badge badge-danger">OVERDUE</span>:<span className="badge badge-success">OK</span>}</td>
                    <td>
                      <div style={{display:'flex',gap:'6px'}}>
                        <button className="btn btn-ghost btn-sm" onClick={()=>{setForm({...t,dueDate:t.dueDate?new Date(t.dueDate).toISOString().slice(0,16):''});setEditing(t.id);setModal(true);}}>✏️</button>
                        <button className="btn btn-danger btn-sm" onClick={()=>del(t.id)}>🗑️</button>
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
              <h3>{editing?'Edit Task':'Create Task'}</h3>
              <button className="modal-close" onClick={()=>setModal(false)}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group full"><label>Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Task title" /></div>
              <div className="form-group full"><label>Description</label><textarea value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})} /></div>
              <div className="form-group"><label>Status</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select></div>
              <div className="form-group"><label>Priority</label><select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>{PRIORITIES.map(p=><option key={p}>{p}</option>)}</select></div>
              <div className="form-group full"><label>Due Date</label><input type="datetime-local" value={form.dueDate||''} onChange={e=>setForm({...form,dueDate:e.target.value})} /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}>💾 Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
