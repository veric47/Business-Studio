import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import logo from '../assets/Business Studio.jpeg';

const API =
  import.meta.env.VITE_API_URL ||
  'https://business-studio-7tqf.onrender.com';

// Replace with your Google OAuth Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = '675706282959-4p37tqg14u9b3u0h5j5r3j5r3j5r3j5r.apps.googleusercontent.com';

export default function AuthPage({ mode = 'login', onLogin }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const isSignup = mode === 'signup';

  const handleChange = (e) =>
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(API + '/api/auth/google', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Google authentication failed');
        setLoading(false);
        return;
      }

      onLogin(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError('Could not connect to server.');
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Failed to sign in with Google. Please try again.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const endpoint = isSignup
        ? '/api/auth/register'
        : '/api/auth/login';

      const res = await fetch(API + endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
        setLoading(false);
        return;
      }

      onLogin(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError('Could not connect to server.');
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'var(--bg)',
          padding: 24,
        }}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <img
                src={logo}
                alt="Business Studio Logo"
                style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 8 }}
              />
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 22,
                  color: 'var(--text-h)',
                }}
              >
                BusinessStudio
              </span>
            </Link>
          </div>

          <div className="card" style={{ padding: 32 }}>
            <h2
              style={{
                textAlign: 'center',
                fontSize: 24,
                marginBottom: 6,
              }}
            >
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h2>

            <p
              style={{
                textAlign: 'center',
                color: 'var(--text)',
                marginBottom: 28,
              }}
            >
              {isSignup
                ? 'Start building your business website today'
                : 'Sign in to your BusinessStudio account'}
            </p>

            {error && (
              <div
                className="alert alert-error"
                style={{ marginBottom: 20 }}
              >
                {error}
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                width={400}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ color: 'var(--text)', fontSize: 13 }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {isSignup && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={
                    isSignup
                      ? 'At least 6 characters'
                      : 'Your password'
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: 12,
                }}
              >
                {loading
                  ? isSignup
                    ? 'Creating account...'
                    : 'Signing in...'
                  : isSignup
                  ? 'Create Account'
                  : 'Sign In'}
              </button>
            </form>
          </div>

          <p
            style={{
              textAlign: 'center',
              marginTop: 20,
            }}
          >
            {isSignup
              ? 'Already have an account? '
              : "Don't have an account? "}

            <Link
              to={isSignup ? '/login' : '/signup'}
              style={{
                color: 'var(--accent2)',
                fontWeight: 600,
              }}
            >
              {isSignup ? 'Sign in' : 'Sign up'}
            </Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}