import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊', section: 'MAIN' },
  { path: '/customers', label: 'Customers', icon: '👥', section: 'CRM' },
  { path: '/leads', label: 'Leads', icon: '🎯', section: 'CRM' },
  { path: '/tasks', label: 'Tasks', icon: '✅', section: 'CRM' },
  { path: '/analytics', label: 'Analytics', icon: '📈', section: 'INSIGHTS' },
  { path: '/social', label: 'Social Analytics', icon: '🌐', section: 'INSIGHTS' },
  { path: '/recommendations', label: 'AI Recommendations', icon: '🤖', section: 'INSIGHTS' },
];

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const sections = [...new Set(navItems.map(i => i.section))];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>🏢 CRM Pro</h1>
        <p>AI-Enhanced CRM System</p>
      </div>

      <nav className="sidebar-nav">
        {sections.map(section => (
          <div className="nav-section" key={section}>
            <div className="nav-section-title">{section}</div>
            {navItems.filter(i => i.section === section).map(item => (
              <NavLink key={item.path} to={item.path} onClick={onClose}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-user-info">
          <div className="avatar">{user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}</div>
          <div className="user-details">
            <p>{user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.username}</p>
            <span>{user?.role || 'User'}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>🚪 Sign Out</button>
      </div>
    </aside>
  );
}
