import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
const API =import.meta.env.VITE_API_URL ||  'https://business-studio-7tqf.onrender.com';
const CATEGORY_ICONS = { Music: '🎵', Artwork: '🎨', Food: '🍽️', Delivery: '🚚', Clothing: '👗', News: '📰', Accommodation: '🏨' };
export default function SiteView() {
  const { subdomain } = useParams();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    fetch(`${API}/api/gallery/${subdomain}`)
      .then(r => r.json())
      .then(d => {
        if (d.status === 'success') setSite(d.site);
        else setError('Site not found.');
      })
      .catch(() => setError('Could not load this site.'))
      .finally(() => setLoading(false));
  }, [subdomain]);
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
    </div>
  );
  if (error || !site) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>404</div>
      <h2 style={{ marginBottom: 10 }}>Site not found</h2>
      <p style={{ color: 'var(--text2)', marginBottom: 28 }}>The site "{subdomain}" doesn't exist or isn't published.</p>
      <Link to="/gallery" className="btn btn-secondary">← Back to Gallery</Link>
    </div>
  );
  const theme = site.theme || 'dark';
  const themeVars = theme === 'light'
    ? { bg: '#ffffff', bg2: '#f8f9fa', text: '#374151', textH: '#111827', border: '#e5e7eb', accent: '#8b5cf6' }
    : { bg: '#0a0a0f', bg2: '#111118', text: '#94a3b8', textH: '#f1f5f9', border: '#2a2a3a', accent: '#a78bfa' };
  return (
    <div style={{ background: themeVars.bg, minHeight: '100vh', color: themeVars.text }}>
      <div style={{ background: '#8b5cf6', color: '#fff', textAlign: 'center', padding: '8px', fontSize: 13 }}>
        🌐 This website was built with{' '}
        <Link to="/" style={{ color: '#fff', fontWeight: 700 }}>BusinessStudio.com</Link>
        {' '} — <Link to="/signup" style={{ color: '#fff', fontWeight: 700 }}>Build yours free →</Link>
      </div>
      <header style={{ background: themeVars.bg2, borderBottom: `1px solid ${themeVars.border}`, padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: themeVars.textH }}>{site.business_name}</div>
          <div style={{ fontSize: 13, color: themeVars.accent }}>{CATEGORY_ICONS[site.category]} {site.category}</div>
        </div>
        <div style={{ fontSize: 12, color: themeVars.text }}>{subdomain}.businessstudios.com</div>
      </header>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        {site.components?.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: themeVars.text }}>
            <p>This site has no content yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {site.components.map((comp, i) => <RenderComponent key={i} comp={comp} theme={themeVars} />)}
          </div>
        )}
      </main>
      <footer style={{ borderTop: `1px solid ${themeVars.border}`, padding: '24px', textAlign: 'center', fontSize: 13, color: themeVars.text, marginTop: 60 }}>
        <span>{site.business_name} · Powered by </span>
        <Link to="/" style={{ color: themeVars.accent }}>BusinessStudio.com</Link>
      </footer>
    </div>
  );
}
function RenderComponent({ comp, theme }) {
  if (comp.type === 'header') return (
    <div style={{ borderBottom: `2px solid ${theme.border}`, paddingBottom: 20 }}>
      <h1 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, color: theme.textH, marginBottom: 8 }}>{comp.content}</h1>
      {comp.subtitle && <p style={{ fontSize: 18, color: theme.text, lineHeight: 1.6 }}>{comp.subtitle}</p>}
    </div>
  );
  if (comp.type === 'text') return (
    <div style={{ background: theme.bg2, borderLeft: `4px solid ${theme.accent}`, padding: '16px 20px', borderRadius: '0 8px 8px 0' }}>
      <p style={{ fontSize: 16, lineHeight: 1.7, color: theme.text, whiteSpace: 'pre-wrap' }}>{comp.content}</p>
    </div>
  );
  if (comp.type === 'audio_player') return (
    <div style={{ background: theme.bg2, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 56, height: 56, borderRadius: 8, background: `${theme.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>💿</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, color: theme.textH, marginBottom: 4 }}>{comp.title}</div>
        {comp.url ? (
          <audio controls style={{ width: '100%', marginTop: 8 }} src={comp.url}><track kind="captions"/></audio>
        ) : (
          <div style={{ fontSize: 13, color: theme.text, background: `${theme.accent}15`, padding: '4px 10px', borderRadius: 4, display: 'inline-block' }}>
            🎵 Music Track
          </div>
        )}
      </div>
    </div>
  );
  if (comp.type === 'image') return (
    <div>
      {comp.url ? (
        <img src={comp.url} alt={comp.caption || ''} style={{ width: '100%', borderRadius: 12, objectFit: 'cover', maxHeight: 420 }} />
      ) : (
        <div style={{ width: '100%', height: 200, background: theme.bg2, border: `1px dashed ${theme.border}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.text, fontSize: 14 }}>🖼️ Image</div>
      )}
      {comp.caption && <p style={{ textAlign: 'center', fontSize: 13, color: theme.text, marginTop: 8 }}>{comp.caption}</p>}
    </div>
  );
  if (comp.type === 'gallery') return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: theme.textH, marginBottom: 16 }}>{comp.title || 'Gallery'}</h2>
      {comp.images?.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {comp.images.map((url, i) => (
            <img key={i} src={url} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 8 }} />
          ))}
        </div>
      ) : (
        <div style={{ padding: 40, textAlign: 'center', background: theme.bg2, borderRadius: 12, color: theme.text }}>🖼️ Gallery section</div>
      )}
    </div>
  );
  if (comp.type === 'menu') return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: theme.textH, marginBottom: 16 }}>{comp.title || 'Menu'}</h2>
      {comp.items?.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {comp.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: i % 2 === 0 ? theme.bg2 : 'transparent', borderRadius: 8 }}>
              <div>
                <div style={{ fontWeight: 600, color: theme.textH }}>{item.name}</div>
                {item.desc && <div style={{ fontSize: 13, color: theme.text }}>{item.desc}</div>}
              </div>
              {item.price && <div style={{ fontWeight: 700, color: theme.accent }}>{item.price}</div>}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: 40, textAlign: 'center', background: theme.bg2, borderRadius: 12, color: theme.text }}>🍽️ Menu items</div>
      )}
    </div>
  );
  if (comp.type === 'checkout_button') return (
    <div style={{ padding: 24, background: theme.bg2, border: `2px dashed ${theme.accent}`, borderRadius: 12, textAlign: 'center' }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: theme.accent, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Secure Checkout</p>
      <button style={{ background: theme.accent, color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
        Pay Securely — {comp.amount || '$20.00'}
      </button>
      <p style={{ fontSize: 11, color: theme.text, marginTop: 10 }}>5% platform fee applies via BusinessStudio</p>
    </div>
  );
  if (comp.type === 'contact') return (
    <div style={{ background: theme.bg2, border: `1px solid ${theme.border}`, borderRadius: 12, padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: theme.textH, marginBottom: 16 }}>Contact Us</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {comp.email && <div style={{ fontSize: 14, color: theme.text }}>📧 {comp.email}</div>}
        {comp.phone && <div style={{ fontSize: 14, color: theme.text }}>📞 {comp.phone}</div>}
        {comp.address && <div style={{ fontSize: 14, color: theme.text }}>📍 {comp.address}</div>}
      </div>
    </div>
  );
  if (comp.type === 'video') return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: theme.textH, marginBottom: 12 }}>{comp.title || 'Video'}</h2>
      {comp.url ? (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 12 }}>
          <iframe src={comp.url.replace('watch?v=', 'embed/')} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', borderRadius: 12 }} title={comp.title || 'Video'} allowFullScreen />
        </div>
      ) : (
        <div style={{ padding: 60, textAlign: 'center', background: theme.bg2, borderRadius: 12, color: theme.text }}>🎬 Video section</div>
      )}
    </div>
  );
  return null;
}

