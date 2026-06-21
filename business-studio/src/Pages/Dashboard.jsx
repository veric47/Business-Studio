import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const API =import.meta.env.VITE_API_URL || 'https://business-studio-7tqf.onrender.com';
const CATEGORY_ICONS = { Music: '🎵', Artwork: '🎨', Food: '🍽️', Delivery: '🚚', Clothing: '👗', News: '📰', Accommodation: '🏨' };
export default function Dashboard({ user }) {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(API + '/api/sites', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d.status === 'success') setSites(d.sites); })
      .finally(() => setLoading(false));
  }, []);
  const deleteSite = async (id) => {
    if (!confirm('Delete this site? This cannot be undone.')) return;
    setDeleting(id);
    await fetch(`${API}/api/sites/${id}`, { method: 'DELETE', credentials: 'include' });
    setSites(s => s.filter(site => site.id !== id));
    setDeleting(null);
  };
  const canCreate = user?.plan === 'premium' ? sites.length < 5 : sites.length < 1;
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>My Websites</h1>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Welcome back, {user?.name?.split(' ')[0]} 👋</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {!canCreate && (
            <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 'var(--radius-sm)', padding: '8px 14px', fontSize: 13, color: 'var(--accent2)' }}>
              ⭐ Upgrade to Premium for up to 5 sites
            </div>
          )}
          <button
            onClick={() => canCreate ? navigate('/studio/new') : null}
            className="btn btn-primary"
            style={{ opacity: canCreate ? 1 : 0.5, cursor: canCreate ? 'pointer' : 'not-allowed' }}
            title={canCreate ? '' : 'Upgrade to Premium for more sites'}
          >
            + New Website
          </button>
        </div>
      </div>
      {/* Plan badge */}
      <div className="card" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className={`badge ${user?.plan === 'premium' ? 'badge-purple' : 'badge-cyan'}`}>
            {user?.plan === 'premium' ? '⭐ Premium' : 'Free Plan'}
          </span>
          <span style={{ fontSize: 14, color: 'var(--text2)' }}>
            {sites.length} / {user?.plan === 'premium' ? '5' : '1'} websites used
          </span>
        </div>
        {user?.plan !== 'premium' && (
          <button className="btn btn-primary btn-sm">⭐ Upgrade to Premium — 10,000 Naira/mo</button>
        )}
      </div>
      {/* Sites Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3, margin: '0 auto' }} />
        </div>
      ) : sites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌐</div>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>No websites yet</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 28, fontSize: 15 }}>Create your first business website in under 5 minutes.</p>
          <Link to="/studio/new" className="btn btn-primary btn-lg">Build Your First Site →</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {sites.map(site => (
            <div key={site.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), var(--bg3))', padding: '24px 20px', borderBottom: '1px solid var(--border)', position: 'relative' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{CATEGORY_ICONS[site.category] || '🌐'}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{site.business_name}</h3>
                <div style={{ fontSize: 12, color: 'var(--accent2)' }}>{site.subdomain}.businessstudios.com</div>
                <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 6 }}>
                  <span className="badge badge-green">● Live</span>
                  <span className="badge badge-cyan">{site.category}</span>
                </div>
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text2)' }}>
                  <span>Layout: <strong style={{ color: 'var(--text)' }}>{site.layout_style?.replace('_', ' ')}</strong></span>
                  <span>👁 {site.views} views</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text2)' }}>
                  {site.components?.length || 0} components · Updated {new Date(site.updated_at).toLocaleDateString()}
                </div>
              </div>
              <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
                <button onClick={() => navigate(`/studio/${site.id}`)} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>✏️ Edit</button>
                <Link to={`/site/${site.subdomain}`} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>👁 Preview</Link>
                <button onClick={() => deleteSite(site.id)} className="btn btn-danger btn-sm" disabled={deleting === site.id} style={{ justifyContent: 'center' }}>
                  {deleting === site.id ? '...' : '🗑'}
                </button>
              </div>
            </div>
          ))}
          {canCreate && (
            <Link to="/studio/new" style={{ textDecoration: 'none' }}>
              <div style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius)', padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer', minHeight: 200, transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'rgba(124,58,237,0.05)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: 'var(--accent2)' }}>+</div>
                <span style={{ color: 'var(--text2)', fontWeight: 500, fontSize: 15 }}>Create new site</span>
              </div>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}