import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const EMPTY_BEHAVIOR = { customerId: '', responseRate: 0, purchaseFrequency: 0, interactionGapDays: 0, totalPurchases: 0 };

export default function Recommendations() {
  const [recs, setRecs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_BEHAVIOR);

  const load = async () => {
    setLoading(true);
    try {
      const [rRes, cRes] = await Promise.all([
        api.get('/recommendations/all'),
        api.get('/customers')
      ]);
      setRecs(rRes.data);
      setCustomers(cRes.data);
    } catch(e) {} finally { setLoading(false); }
  };

  useEffect(() => {
    load();
  }, []);

  const priorityColor = (p) => {
    if (p === 'URGENT') return { bg:'rgba(239,68,68,0.1)', border:'rgba(239,68,68,0.3)', color:'#ef4444', icon:'🚨' };
    if (p === 'HIGH')   return { bg:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.3)', color:'#f59e0b', icon:'🔥' };
    if (p === 'MEDIUM') return { bg:'rgba(59,130,246,0.1)', border:'rgba(59,130,246,0.3)', color:'#60a5fa', icon:'📊' };
    return { bg:'rgba(16,185,129,0.1)', border:'rgba(16,185,129,0.3)', color:'#10b981', icon:'✅' };
  };

  const catIcon = (cat) => {
    if (cat?.includes('HIGH VALUE')) return '💎';
    if (cat?.includes('RISK')) return '⚠️';
    if (cat?.includes('MEDIUM')) return '📈';
    return '👤';
  };

  const getCustomerName = (id) => {
    const c = customers.find(item => Number(item.id) === Number(id));
    return c ? `${c.firstName} ${c.lastName}` : `Customer #${id}`;
  };

  const saveBehavior = async () => {
    if (!form.customerId) {
      alert('Please select a customer');
      return;
    }
    try {
      const payload = {
        customerId: Number(form.customerId),
        responseRate: Number(form.responseRate),
        purchaseFrequency: Number(form.purchaseFrequency),
        interactionGapDays: Number(form.interactionGapDays),
        totalPurchases: Number(form.totalPurchases)
      };
      await api.post('/recommendations/behavior', payload);
      setModal(false);
      setForm(EMPTY_BEHAVIOR);
      load();
    } catch(e) {
      alert('Error saving customer behavior data');
    }
  };

  const deleteBehavior = async (customerId) => {
    if (!window.confirm('Delete behavior data and AI recommendations for this customer?')) return;
    try {
      await api.delete(`/recommendations/behavior/${customerId}`);
      load();
    } catch(e) {
      alert('Error deleting behavior data');
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div className="page-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h2>🤖 AI Recommendations</h2>
          <p>Predictive customer intelligence powered by our AI recommendation engine.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY_BEHAVIOR); setModal(true); }}>
          + Adjust Customer Behavior
        </button>
      </div>

      <div className="kpi-grid" style={{gridTemplateColumns:'repeat(4,1fr)', marginBottom:'20px'}}>
        <div className="kpi-card indigo"><div className="kpi-icon indigo">🤖</div><div className="kpi-label">Total Analyzed</div><div className="kpi-value">{recs.length}</div></div>
        <div className="kpi-card green"><div className="kpi-icon green">💎</div><div className="kpi-label">High Value</div><div className="kpi-value">{recs.filter(r=>r.category?.includes('HIGH VALUE')).length}</div></div>
        <div className="kpi-card red"><div className="kpi-icon red">⚠️</div><div className="kpi-label">At Risk</div><div className="kpi-value">{recs.filter(r=>r.category?.includes('RISK')).length}</div></div>
        <div className="kpi-card amber"><div className="kpi-icon amber">📈</div><div className="kpi-label">Avg Conv. %</div><div className="kpi-value">{recs.length?Math.round(recs.reduce((a,r)=>a+(r.conversionProbability||0),0)/recs.length):0}%</div></div>
      </div>

      {recs.length === 0
        ? <div className="card"><div className="empty-state"><p>No behavior data available. Click "+ Adjust Customer Behavior" to get AI recommendations.</p></div></div>
        : <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:'16px'}}>
            {recs.map((r,i) => {
              const pc = priorityColor(r.priority);
              return (
                <div key={i} style={{background:'var(--bg-card)',border:`1px solid var(--border)`,borderRadius:'16px',padding:'20px',
                  borderLeft:`4px solid ${pc.color}`,transition:'transform 0.2s,box-shadow 0.2s',cursor:'default', position:'relative'}}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.3)'}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none'}}>
                  
                  <button className="btn btn-danger btn-sm" 
                    onClick={() => deleteBehavior(r.customerId)}
                    style={{position:'absolute', top:'16px', right:'16px', padding:'4px 8px', fontSize:'12px', zIndex: 10}}
                    title="Delete Behavior Data">
                    🗑️
                  </button>

                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px', paddingRight:'24px'}}>
                    <div>
                      <div style={{fontSize:'22px',marginBottom:'4px'}}>{catIcon(r.category)}</div>
                      <div style={{fontSize:'14px',fontWeight:700,color:'var(--text)'}}>{getCustomerName(r.customerId)}</div>
                      <span style={{display:'inline-block',background:pc.bg,border:`1px solid ${pc.border}`,color:pc.color,
                        borderRadius:'20px',padding:'2px 10px',fontSize:'11px',fontWeight:600,marginTop:'4px'}}>
                        {pc.icon} {r.category}
                      </span>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontSize:'28px',fontWeight:900,color:r.conversionProbability>=70?'#10b981':r.conversionProbability>=40?'#f59e0b':'#ef4444'}}>
                        {r.conversionProbability}%
                      </div>
                      <div style={{fontSize:'11px',color:'var(--text-dim)'}}>Conv. Probability</div>
                    </div>
                  </div>

                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px',marginBottom:'12px'}}>
                    {[['Response Rate',`${r.responseRate||0}%`],['Purchase Freq.',r.purchaseFrequency||0],['Inactivity',`${r.interactionGapDays||0}d`]].map(([l,v])=>(
                      <div key={l} style={{background:'var(--bg-card2)',borderRadius:'8px',padding:'8px',textAlign:'center'}}>
                        <div style={{fontSize:'10px',color:'var(--text-dim)',marginBottom:'2px'}}>{l}</div>
                        <div style={{fontSize:'14px',fontWeight:700,color:'var(--text)'}}>{v}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{background:'rgba(99,102,241,0.06)',border:'1px solid rgba(99,102,241,0.15)',borderRadius:'10px',padding:'10px 12px'}}>
                    <div style={{fontSize:'10px',fontWeight:700,color:'var(--primary-light)',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.5px'}}>💡 AI Recommendation</div>
                    <p style={{fontSize:'12px',color:'var(--text-muted)',lineHeight:'1.6'}}>{r.recommendation}</p>
                  </div>
                </div>
              );
            })}
          </div>
      }

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>🤖 Adjust Customer Behavior</h3>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group full">
                <label>Select Customer</label>
                <select value={form.customerId} onChange={e => setForm({...form, customerId: e.target.value})}>
                  <option value="">-- Choose a Customer --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.company || 'Individual'})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Response Rate (%)</label>
                <input type="number" min="0" max="100" value={form.responseRate} onChange={e => setForm({...form, responseRate: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Purchase Frequency</label>
                <input type="number" min="0" value={form.purchaseFrequency} onChange={e => setForm({...form, purchaseFrequency: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Inactivity Gap (Days)</label>
                <input type="number" min="0" value={form.interactionGapDays} onChange={e => setForm({...form, interactionGapDays: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Total Purchases</label>
                <input type="number" min="0" value={form.totalPurchases} onChange={e => setForm({...form, totalPurchases: e.target.value})} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveBehavior}>💾 Save & Analyze</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
