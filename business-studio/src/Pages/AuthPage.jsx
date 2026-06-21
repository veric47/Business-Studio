import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const API = import.meta.env.VITE_API_URL || 'https://business-studio-7tqf.onrender.com';
export default function AuthPage({ mode = 'login', onLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isSignup = mode === 'signup';
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login';
      const res = await fetch(API + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Something went wrong'); setLoading(false); return; }
      onLogin(data.user);
      navigate('/dashboard');
    } catch {
      setError('Could not connect to server. Please try again.');
      setLoading(false);
    }
  };
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff', fontWeight: 700 }}>B</div>
            <span style={{ fontWeight: 700, fontSize: 22, color: 'var(--text)' }}>BusinessStudio</span>
          </Link>
        </div>
        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', textAlign: 'center', marginBottom: 28 }}>
            {isSignup ? 'Start building your business website for free' : 'Sign in to your BusinessStudio account'}
          </p>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {isSignup && (
              <div>
                <label className="label">Full Name</label>
                <input className="input" name="name" type="text" placeholder="Your name" value={form.name} onChange={handleChange} required autoComplete="name" />
              </div>
            )}
            <div>
              <label className="label">Email Address</label>
              <input className="input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required autoComplete="email" />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" name="password" type="password" placeholder={isSignup ? 'At least 6 characters' : 'Your password'} value={form.password} onChange={handleChange} required autoComplete={isSignup ? 'new-password' : 'current-password'} />
              {isSignup && <span style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4, display: 'block' }}>Must be at least 6 characters</span>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15, marginTop: 4 }} disabled={loading}>
              {loading
                ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> {isSignup ? 'Creating account...' : 'Signing in...'}</>
                : (isSignup ? 'Create Free Account' : 'Sign In')}
            </button>
          </form>
        </div>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text2)' }}>
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <Link to={isSignup ? '/login' : '/signup'} style={{ color: 'var(--accent2)', fontWeight: 500 }}>
            {isSignup ? 'Sign in' : 'Sign up free'}
          </Link>
        </p>
      </div>
    </div>
  );
}