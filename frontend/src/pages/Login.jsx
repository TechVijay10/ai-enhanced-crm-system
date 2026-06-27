import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(form.username, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally { setLoading(false); }
  };

  const fillDemo = (role) => {
    const creds = { admin: { username: 'admin', password: 'password' },
                    manager: { username: 'manager1', password: 'password' },
                    employee: { username: 'emp1', password: 'password' } };
    setForm(creds[role]);
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <h1>🏢 CRM Pro</h1>
          <p>AI-Enhanced Secure CRM System</p>
          <p style={{fontSize:'11px',color:'#4f46e5',marginTop:'4px',fontWeight:600}}>
            Powered by Microservices Architecture
          </p>
        </div>

        <form className="login-form" onSubmit={submit}>
          {error && <div className="login-err">⚠️ {error}</div>}

          <div className="form-group">
            <label>Username</label>
            <input name="username" value={form.username} onChange={handle}
              placeholder="Enter username" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle}
              placeholder="Enter password" required />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳ Signing in...' : '🔐 Sign In'}
          </button>
        </form>

        <div style={{marginTop:'24px',borderTop:'1px solid var(--border)',paddingTop:'20px'}}>
          <p style={{fontSize:'11px',color:'var(--text-dim)',textAlign:'center',marginBottom:'12px',fontWeight:600}}>
            QUICK LOGIN (DEMO)
          </p>
          <div style={{display:'flex',gap:'8px'}}>
            {['admin','manager','employee'].map(r => (
              <button key={r} onClick={() => fillDemo(r)} className="btn btn-ghost btn-sm"
                style={{flex:1,fontSize:'11px',textTransform:'capitalize'}}>
                {r === 'admin' ? '👑' : r === 'manager' ? '💼' : '👤'} {r}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
