import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#3b82f6','#8b5cf6'];

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [customerStats, setCustomerStats] = useState({});
  const [leadStats, setLeadStats] = useState({});
  const [taskStats, setTaskStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ana, rev, cust, lead, task] = await Promise.allSettled([
          api.get('/analytics/dashboard'),
          api.get('/analytics/revenue/all'),
          api.get('/customers/stats'),
          api.get('/leads/stats'),
          api.get('/tasks/stats'),
        ]);
        if (ana.status === 'fulfilled') setAnalytics(ana.value.data);
        if (rev.status === 'fulfilled') setRevenue(rev.value.data);
        if (cust.status === 'fulfilled') setCustomerStats(cust.value.data);
        if (lead.status === 'fulfilled') setLeadStats(lead.value.data);
        if (task.status === 'fulfilled') setTaskStats(task.value.data);
      } catch(e) {} finally { setLoading(false); }
    };
    load();
  }, []);

  // Sort chronologically (year ASC, month ASC)
  const sortedRevenue = [...revenue].sort((a, b) =>
    a.year !== b.year ? a.year - b.year : a.month - b.month
  );
  const revenueChart = sortedRevenue.map(r => ({
    name: `${MONTHS[(r.month || 1) - 1]} ${r.year}`,
    Revenue: Number(r.revenue || 0),
    Profit: Number(r.profit || 0),
    Expenses: Number(r.expenses || 0),
  }));

  const leadPieData = Object.entries(leadStats.byStatus || {}).map(([name,value]) => ({ name, value }));
  const taskPieData = Object.entries(taskStats.byStatus || {}).map(([name,value]) => ({ name, value }));

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h2>📊 Dashboard</h2>
        <p>Welcome back! Here's your business overview.</p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card indigo">
          <div className="kpi-icon indigo">👥</div>
          <div className="kpi-label">Total Customers</div>
          <div className="kpi-value">{customerStats.total || 0}</div>
          <div className="kpi-sub">Active: {customerStats.active || 0}</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-icon green">🎯</div>
          <div className="kpi-label">Total Leads</div>
          <div className="kpi-value">{leadStats.total || 0}</div>
          <div className="kpi-sub">Converted: {leadStats.converted || 0}</div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-icon amber">💰</div>
          <div className="kpi-label">Total Revenue</div>
          <div className="kpi-value">₹{((analytics?.totalRevenue || 0)/1000).toFixed(0)}K</div>
          <div className="kpi-sub">Profit: ₹{((analytics?.totalProfit || 0)/1000).toFixed(0)}K</div>
        </div>
        <div className="kpi-card blue">
          <div className="kpi-icon blue">📈</div>
          <div className="kpi-label">Conversion Rate</div>
          <div className="kpi-value">{analytics?.conversionRate || 0}%</div>
          <div className="kpi-sub">Leads converted</div>
        </div>
        <div className="kpi-card red">
          <div className="kpi-icon red">✅</div>
          <div className="kpi-label">Pending Tasks</div>
          <div className="kpi-value">{taskStats.byStatus?.PENDING || 0}</div>
          <div className="kpi-sub">Overdue: {taskStats.overdue || 0}</div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-icon purple">🏢</div>
          <div className="kpi-label">New Customers</div>
          <div className="kpi-value">{analytics?.newCustomers || 0}</div>
          <div className="kpi-sub">This period</div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="card">
          <div className="chart-title">💹 Revenue & Profit Trend</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#64748b" tick={{fontSize:12}} />
              <YAxis stroke="#64748b" tick={{fontSize:12}} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{background:'#1e293b',border:'1px solid #334155',borderRadius:'12px'}}
                formatter={(v) => [`₹${(v/1000).toFixed(1)}K`]} />
              <Legend />
              <Line type="monotone" dataKey="Revenue" stroke="#6366f1" strokeWidth={2} dot={{fill:'#6366f1',r:4}} />
              <Line type="monotone" dataKey="Profit" stroke="#10b981" strokeWidth={2} dot={{fill:'#10b981',r:4}} />
              <Line type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} dot={{fill:'#ef4444',r:4}} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="chart-title">🎯 Leads by Status</div>
          {leadPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <Pie data={leadPieData} cx="50%" cy="50%" outerRadius={55} dataKey="value" label={({name,percent}) => `${name}: ${(percent*100).toFixed(0)}%`}>
                  {leadPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{background:'#1e293b',border:'1px solid #334155',borderRadius:'12px'}} />
                <Legend verticalAlign="bottom" height={36} iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="empty-state"><p>No lead data yet</p></div>}
        </div>
      </div>

      <div className="chart-grid">
        <div className="card">
          <div className="chart-title">📊 Monthly Revenue vs Expenses</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#64748b" tick={{fontSize:12}} />
              <YAxis stroke="#64748b" tick={{fontSize:12}} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{background:'#1e293b',border:'1px solid #334155',borderRadius:'12px'}}
                formatter={(v) => [`₹${(v/1000).toFixed(1)}K`]} />
              <Legend />
              <Bar dataKey="Revenue" fill="#6366f1" radius={[4,4,0,0]} />
              <Bar dataKey="Expenses" fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="chart-title">✅ Tasks by Status</div>
          {taskPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <Pie data={taskPieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" label={({name,value}) => `${name}: ${value}`}>
                  {taskPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{background:'#1e293b',border:'1px solid #334155',borderRadius:'12px'}} />
                <Legend verticalAlign="bottom" height={36} iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="empty-state"><p>No task data yet</p></div>}
        </div>
      </div>
    </div>
  );
}
