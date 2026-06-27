import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6'];
const PLATFORMS = ['LinkedIn', 'Facebook', 'Instagram', 'Website', 'Referral'];
const EMPTY_CAMPAIGN = { campaignName: '', platform: 'LinkedIn', clicks: 0, conversions: 0, revenue: 0 };

export default function Social() {
  const [platforms, setPlatforms] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_CAMPAIGN);

  const load = async () => {
    try {
      const [p, c] = await Promise.all([api.get('/social/platforms'), api.get('/social/campaigns')]);
      setPlatforms(p.data); setCampaigns(c.data);
    } catch(e) {} finally { setLoading(false); }
  };

  useEffect(() => {
    load();
  }, []);

  const deleteCampaign = async (name) => {
    if (!window.confirm(`Delete campaign "${name}" and all its records?`)) return;
    setLoading(true);
    try {
      await api.delete(`/social/campaigns/${encodeURIComponent(name)}`);
      await load();
    } catch(e) {
      alert('Error deleting campaign data');
    } finally {
      setLoading(false);
    }
  };

  const saveCampaign = async () => {
    if (!form.campaignName.trim()) {
      alert('Please enter a campaign name');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        campaignName: form.campaignName,
        platform: form.platform,
        clicks: Number(form.clicks),
        conversions: Number(form.conversions),
        revenue: Number(form.revenue)
      };
      await api.post('/social', payload);
      setModal(false);
      setForm(EMPTY_CAMPAIGN);
      await load();
    } catch(e) {
      alert('Error saving campaign data');
    } finally {
      setLoading(false);
    }
  };

  const pieData = platforms.map(p => ({ name: p.platform, value: Number(p.totalRevenue || 0) }));
  const barData = platforms.map(p => ({ platform: p.platform, Clicks: Number(p.totalClicks||0), Conversions: Number(p.totalConversions||0) }));

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div className="page-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h2>🌐 Social Analytics</h2>
          <p>Track lead sources, platform performance, and campaign effectiveness.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY_CAMPAIGN); setModal(true); }}>
          + Add Campaign Data
        </button>
      </div>

      <div className="kpi-grid" style={{gridTemplateColumns:`repeat(${platforms.length||1},1fr)`, marginBottom:'20px'}}>
        {platforms.map((p,i) => (
          <div key={p.platform} className={`kpi-card ${['indigo','green','amber','red','blue'][i%5]}`}>
            <div className={`kpi-icon ${['indigo','green','amber','red','blue'][i%5]}`}>
              {p.platform==='LinkedIn'?'💼':p.platform==='Facebook'?'👥':p.platform==='Instagram'?'📸':p.platform==='Website'?'🌐':'🤝'}
            </div>
            <div className="kpi-label">{p.platform}</div>
            <div className="kpi-value">₹{(Number(p.totalRevenue||0)/1000).toFixed(0)}K</div>
            <div className="kpi-sub">Conv: {p.totalConversions} | Rate: {p.conversionRate}%</div>
          </div>
        ))}
      </div>

      <div className="chart-grid">
        <div className="card">
          <div className="chart-title">📊 Clicks vs Conversions by Platform</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="platform" stroke="#64748b" tick={{fontSize:12}} />
              <YAxis stroke="#64748b" tick={{fontSize:12}} />
              <Tooltip contentStyle={{background:'#1e293b',border:'1px solid #334155',borderRadius:'12px'}} />
              <Legend />
              <Bar dataKey="Clicks" fill="#6366f1" radius={[4,4,0,0]} />
              <Bar dataKey="Conversions" fill="#10b981" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="chart-title">💰 Revenue by Platform</div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={55} dataKey="value"
                label={({name,percent})=>`${name}: ${(percent*100).toFixed(0)}%`}>
                {pieData.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{background:'#1e293b',border:'1px solid #334155',borderRadius:'12px'}}
                formatter={v=>[`₹${(v/1000).toFixed(1)}K`]} />
              <Legend verticalAlign="bottom" height={36} iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="chart-title">📋 Campaign Performance</div>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Campaign</th><th>Platform</th><th>Clicks</th><th>Conversions</th><th>Revenue</th><th>Actions</th></tr></thead>
            <tbody>
              {campaigns.length === 0
                ? <tr><td colSpan={6} style={{textAlign:'center',padding:'32px',color:'var(--text-dim)'}}>No campaign data</td></tr>
                : campaigns.map((c,i) => (
                  <tr key={i}>
                    <td><strong>{c.campaignName}</strong></td>
                    <td><span className="badge badge-info">{c.platform}</span></td>
                    <td>{Number(c.totalClicks||0).toLocaleString()}</td>
                    <td>{Number(c.totalConversions||0).toLocaleString()}</td>
                    <td style={{color:'#10b981',fontWeight:600}}>₹{Number(c.totalRevenue||0).toLocaleString()}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteCampaign(c.campaignName)} title="Delete Campaign">🗑️</button>
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
              <h3>🌐 Add Campaign Data</h3>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group full">
                <label>Campaign Name</label>
                <input value={form.campaignName} onChange={e => setForm({...form, campaignName: e.target.value})} placeholder="e.g. Winter Sale Promo" />
              </div>

              <div className="form-group">
                <label>Platform Source</label>
                <select value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}>
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Clicks Count</label>
                <input type="number" min="0" value={form.clicks} onChange={e => setForm({...form, clicks: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Conversions Count</label>
                <input type="number" min="0" value={form.conversions} onChange={e => setForm({...form, conversions: e.target.value})} />
              </div>

              <div className="form-group full">
                <label>Generated Revenue (₹)</label>
                <input type="number" min="0" value={form.revenue} onChange={e => setForm({...form, revenue: e.target.value})} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveCampaign}>💾 Save Campaign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
