import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6'];
const EMPTY_REVENUE = { month: 1, year: 2025, revenue: 0, expenses: 0 };

export default function Analytics() {
  const [revenue, setRevenue] = useState([]);
  const [summary, setSummary] = useState({});
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_REVENUE);

  const load = async () => {
    try {
      const [r, s, rep] = await Promise.all([
        api.get('/analytics/revenue/all'),
        api.get('/analytics/dashboard'),
        api.get('/analytics/reports'),
      ]);
      setRevenue(r.data); setSummary(s.data); setReports(rep.data);
    } catch(e) {} finally { setLoading(false); }
  };

  useEffect(() => {
    load();
  }, []);

  const saveRevenue = async () => {
    setLoading(true);
    try {
      const rev = Number(form.revenue);
      const exp = Number(form.expenses);
      const payload = {
        month: Number(form.month),
        year: Number(form.year),
        revenue: rev,
        expenses: exp,
        profit: rev - exp
      };
      await api.post('/analytics/revenue', payload);
      setModal(false);
      setForm(EMPTY_REVENUE);
      await load();
    } catch(e) {
      alert('Error saving financial record');
    } finally {
      setLoading(false);
    }
  };

  const deleteRevenue = async (id) => {
    if (!window.confirm('Delete this monthly financial record?')) return;
    setLoading(true);
    try {
      await api.delete(`/analytics/revenue/${id}`);
      await load();
    } catch(e) {
      alert('Error deleting financial record');
    } finally {
      setLoading(false);
    }
  };

  // Sort chronologically (year ASC, month ASC) before charting
  const sortedRevenue = [...revenue].sort((a, b) =>
    a.year !== b.year ? a.year - b.year : a.month - b.month
  );
  const revenueChart = sortedRevenue.map(r => ({
    month: `${MONTHS[(r.month||1)-1]} ${r.year}`,
    Revenue: Number(r.revenue||0), Profit: Number(r.profit||0), Expenses: Number(r.expenses||0),
  }));

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div className="page-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h2>📈 Business Analytics</h2>
          <p>Revenue, conversion, and growth intelligence dashboard.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY_REVENUE); setModal(true); }}>
          + Add Monthly Finance
        </button>
      </div>

      <div className="kpi-grid" style={{marginBottom:'20px'}}>
        {[
          {label:'Total Revenue',value:`₹${((summary.totalRevenue||0)/1000).toFixed(0)}K`,icon:'💰',color:'indigo'},
          {label:'Total Profit', value:`₹${((summary.totalProfit||0)/1000).toFixed(0)}K`,icon:'📈',color:'green'},
          {label:'Total Leads',  value:summary.totalLeads||0,icon:'🎯',color:'amber'},
          {label:'Converted',    value:summary.convertedLeads||0,icon:'✅',color:'blue'},
          {label:'Conv. Rate',   value:`${summary.conversionRate||0}%`,icon:'📊',color:'purple'},
          {label:'New Customers',value:summary.newCustomers||0,icon:'👥',color:'red'},
        ].map(k=>(
          <div key={k.label} className={`kpi-card ${k.color}`}>
            <div className={`kpi-icon ${k.color}`}>{k.icon}</div>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{marginBottom:'20px'}}>
        <div className="chart-title">📊 Revenue vs Expenses vs Profit (Monthly)</div>
        {revenueChart.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueChart}>
              <defs>
                <linearGradient id="cRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="cProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#64748b" tick={{fontSize:12}} />
              <YAxis stroke="#64748b" tick={{fontSize:12}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{background:'#1e293b',border:'1px solid #334155',borderRadius:'12px'}} formatter={v=>[`₹${(v/1000).toFixed(1)}K`]} />
              <Legend />
              <Area type="monotone" dataKey="Revenue" stroke="#6366f1" fill="url(#cRev)" strokeWidth={2} />
              <Area type="monotone" dataKey="Profit" stroke="#10b981" fill="url(#cProfit)" strokeWidth={2} />
              <Line type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 2" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        ) : <div className="empty-state" style={{padding:'40px'}}><p>No revenue data registered yet. Add a monthly record to get analytics charts.</p></div>}
      </div>

      <div className="chart-grid" style={{marginBottom:'20px'}}>
        <div className="card">
          <div className="chart-title">📊 Monthly Revenue Bar Chart</div>
          {revenueChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#64748b" tick={{fontSize:12}} />
                <YAxis stroke="#64748b" tick={{fontSize:12}} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{background:'#1e293b',border:'1px solid #334155',borderRadius:'12px'}} formatter={v=>[`₹${(v/1000).toFixed(1)}K`]} />
                <Legend />
                <Bar dataKey="Revenue" fill="#6366f1" radius={[4,4,0,0]} />
                <Bar dataKey="Profit" fill="#10b981" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="empty-state"><p>No revenue data yet</p></div>}
        </div>

        <div className="card">
          <div className="chart-title">📋 Monthly Financial Ledger</div>
          <div style={{maxHeight:'240px',overflowY:'auto'}}>
            {revenue.length === 0 ? <div className="empty-state"><p>No records logged yet</p></div> :
              [...revenue].sort((a,b) => a.year !== b.year ? a.year - b.year : a.month - b.month).map(r => (
                <div key={r.id} className="card-sm" style={{marginBottom:'8px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div style={{flex:1}}>
                    <strong style={{fontSize:'13px'}}>{MONTHS[(r.month||1)-1]} {r.year}</strong>
                    <div style={{display:'flex', gap:'12px', flexWrap:'wrap', fontSize:'11px', color:'var(--text-dim)', marginTop:'4px'}}>
                      <span style={{color:'#6366f1'}}>💰 Rev: ₹{Number(r.revenue||0).toLocaleString()}</span>
                      <span style={{color:'#ef4444'}}>📉 Exp: ₹{Number(r.expenses||0).toLocaleString()}</span>
                      <span style={{color:'#10b981'}}>📈 Profit: ₹{Number(r.profit||0).toLocaleString()}</span>
                    </div>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteRevenue(r.id)} title="Delete Record">🗑️</button>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="chart-title">📋 Analytics Reports <span style={{fontSize:'12px',color:'var(--text-dim)',fontWeight:400}}>— Auto-generated from your revenue data</span></div>
        <div style={{maxHeight:'280px',overflowY:'auto'}}>
          {reports.length === 0
            ? <div className="empty-state"><p>No revenue data yet. Add monthly finance records above to generate reports.</p></div>
            : reports.map((r,idx) => (
              <div key={idx} className="card-sm" style={{marginBottom:'10px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}}>
                      <strong style={{fontSize:'13px'}}>📅 {MONTHS[(r.reportMonth||1)-1]} {r.reportYear}</strong>
                      <span className="badge badge-info" style={{fontSize:'10px'}}>{r.reportType}</span>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'6px'}}>
                      <div style={{background:'rgba(99,102,241,0.08)',borderRadius:'8px',padding:'6px 8px',textAlign:'center'}}>
                        <div style={{fontSize:'10px',color:'var(--text-dim)'}}>Revenue</div>
                        <div style={{fontSize:'12px',fontWeight:700,color:'#6366f1'}}>₹{Number(r.totalRevenue||0).toLocaleString()}</div>
                      </div>
                      <div style={{background:'rgba(16,185,129,0.08)',borderRadius:'8px',padding:'6px 8px',textAlign:'center'}}>
                        <div style={{fontSize:'10px',color:'var(--text-dim)'}}>Total Leads</div>
                        <div style={{fontSize:'12px',fontWeight:700,color:'#10b981'}}>{r.totalLeads||0}</div>
                      </div>
                      <div style={{background:'rgba(245,158,11,0.08)',borderRadius:'8px',padding:'6px 8px',textAlign:'center'}}>
                        <div style={{fontSize:'10px',color:'var(--text-dim)'}}>Converted</div>
                        <div style={{fontSize:'12px',fontWeight:700,color:'#f59e0b'}}>{r.convertedLeads||0}</div>
                      </div>
                    </div>
                    {r.reportData && <div style={{fontSize:'11px',color:'var(--text-dim)',marginTop:'6px',padding:'4px 8px',background:'rgba(255,255,255,0.03)',borderRadius:'6px'}}>{r.reportData}</div>}
                  </div>
                  <span className="badge badge-success" style={{marginLeft:'12px',flexShrink:0}}>✓ Live</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>📈 Log Monthly Financial Record</h3>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Month</label>
                <select value={form.month} onChange={e => setForm({...form, month: e.target.value})}>
                  {MONTHS.map((m, idx) => <option key={m} value={idx + 1}>{m}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Year</label>
                <input type="number" value={form.year} onChange={e => setForm({...form, year: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Monthly Revenue (₹)</label>
                <input type="number" min="0" value={form.revenue} onChange={e => setForm({...form, revenue: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Monthly Expenses (₹)</label>
                <input type="number" min="0" value={form.expenses} onChange={e => setForm({...form, expenses: e.target.value})} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveRevenue}>💾 Save Finance Record</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
