import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/Business Studio.jpeg';

export default function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await fetch((import.meta.env.VITE_API_URL || 'https://business-studio-7tqf.onrender.com') + '/api/auth/logout', { method: 'POST', credentials: 'include' });
    onLogout();
    navigate('/');
  };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <img src={logo} alt="Business Studio Logo" style={{ width: 52, height: 52, objectFit: 'contain', borderRadius: 8 }} />
          <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-h)' }}>
            Business<span style={{ color: 'var(--accent)' }}>Studio</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Link to="/gallery" className="btn btn-ghost" style={{ color: isActive('/gallery') ? 'var(--text-h)' : 'var(--text)', fontSize: 14 }}>Gallery</Link>

          {!user ? (
            <>
              <Link to="/login" className="btn btn-ghost" style={{ fontSize: 14 }}>Log in</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="btn btn-ghost" style={{ color: isActive('/dashboard') ? 'var(--text-h)' : 'var(--text)', fontSize: 14 }}>Dashboard</Link>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 100, padding: '4px 12px 4px 4px', cursor: 'pointer' }}
                >
                  {user.profile_picture_url ? (
                    <img
                      src={user.profile_picture_url}
                      alt={user.name}
                      style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <span style={{ fontSize: 13, color: 'var(--text-h)', fontWeight: 500 }}>{user.name?.split(' ')[0]}</span>
                </button>
                {menuOpen && (
                  <div style={{ position: 'absolute', right: 0, top: '110%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 8, minWidth: 200, boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}>
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-h)' }}>{user.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text)' }}>{user.email}</div>
                      <span className="badge badge-purple" style={{ marginTop: 6 }}>{user.plan === 'premium' ? 'Premium' : 'Starter'}</span>
                    </div>
                    <button onClick={() => { setMenuOpen(false); navigate('/dashboard'); }} className="btn btn-ghost" style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: 13, borderRadius: 'var(--radius-sm)' }}>Dashboard</button>
                    <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="btn btn-ghost" style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: 13, color: 'var(--red)', borderRadius: 'var(--radius-sm)' }}>Log out</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
