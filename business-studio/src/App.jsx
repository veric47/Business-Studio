import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import LandingPage from './Pages/LandingPage';
import AuthPage from './Pages/AuthPage';
import Dashboard from './Pages/Dashboard';
import StudioBuilder from './Pages/StudioBuilder';
import Gallery from './Pages/Gallery';
import SiteView from './Pages/SiteView';
const API = 'http://localhost:8080';
function ProtectedRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
function AppLayout({ user, onLogout, children, hideFooter }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar user={user} onLogout={onLogout} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    fetch(API + '/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.status === 'success') setUser(d.user); })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, []);
  const handleLogout = () => setUser(null);
  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
        <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <AppLayout user={user} onLogout={handleLogout}>
            <LandingPage />
          </AppLayout>
        } />
        <Route path="/login" element={
          user ? <Navigate to="/dashboard" replace /> :
          <AuthPage mode="login" onLogin={setUser} />
        } />
        <Route path="/signup" element={
          user ? <Navigate to="/dashboard" replace /> :
          <AuthPage mode="signup" onLogin={setUser} />
        } />
        <Route path="/gallery" element={
          <AppLayout user={user} onLogout={handleLogout}>
            <Gallery />
          </AppLayout>
        } />
        <Route path="/site/:subdomain" element={
          <SiteView />
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout}>
              <Dashboard user={user} />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/studio/:id" element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout} hideFooter>
              <StudioBuilder user={user} />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="*" element={
          <AppLayout user={user} onLogout={handleLogout}>
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>404</div>
              <h2 style={{ marginBottom: 10 }}>Page not found</h2>
              <a href="/" className="btn btn-secondary" style={{ display: 'inline-flex', marginTop: 16 }}>← Go Home</a>
            </div>
          </AppLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}