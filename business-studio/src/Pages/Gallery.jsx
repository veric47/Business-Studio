import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'https://business-studio-7tqf.onrender.com';
const CATEGORY_ICONS = { Music: '', Artwork: '', Food: '', Delivery: '', Clothing: '', News: '', Accommodation: '' };
const CATEGORY_COLORS = {
  Music: '#8b5cf6', Artwork: '#ec4899', Food: '#f59e0b', Delivery: '#3b82f6',
  Clothing: '#10b981', News: '#6366f1', Accommodation: '#ef4444'
};
const ALL_CATEGORIES = ['All', 'Music', 'Artwork', 'Food', 'Delivery', 'Clothing', 'News', 'Accommodation'];

// Live thumbnail: renders the actual published site in an iframe, scaled down.
// Only mounts the iframe once the card is hovered, so we're not loading dozens
// of full pages at once for a gallery grid.
function SitePreviewThumb({ subdomain, color }) {
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Scale factor: the real site renders at this "virtual" width, then we
  // shrink it down with a CSS transform to fit the small card banner.
  const VIRTUAL_WIDTH = 1280;
  const VIRTUAL_HEIGHT = 860;
  const SCALE = 300 / VIRTUAL_WIDTH; // card banner is ~300px wide

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ height: 160, position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border)', background: `linear-gradient(135deg, ${color}25, ${color}10)` }}
    >
      {/* Fallback label, always present underneath */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hovered && loaded ? 0 : 1, transition: 'opacity 0.15s' }}>
        <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color }}>Hover to preview</span>
      </div>

      {hovered && (
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: VIRTUAL_WIDTH, height: VIRTUAL_HEIGHT,
          transform: `scale(${SCALE})`, transformOrigin: 'top left',
          pointerEvents: 'none',
          opacity: loaded ? 1 : 0, transition: 'opacity 0.2s',
        }}>
          <iframe
            title={`Preview of ${subdomain}`}
            src={`/site/${subdomain}`}
            style={{ width: VIRTUAL_WIDTH, height: VIRTUAL_HEIGHT, border: 'none' }}
            onLoad={() => setLoaded(true)}
            scrolling="no"
          />
        </div>
      )}
    </div>
  );
}

export default function Gallery() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(API + '/api/gallery')
      .then(r => r.json())
      .then(d => { if (d.status === 'success') setSites(d.sites); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = sites.filter(s => {
    const matchCat = filter === 'All' || s.category === filter;
    const matchSearch = !search || s.business_name.toLowerCase().includes(search.toLowerCase()) || s.owner_name?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div className="section-label">Community</div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, marginBottom: 12 }}>Published Sites Gallery</h1>
        <p style={{ color: 'var(--text-m)', fontSize: 16, maxWidth: 500, margin: '0 auto 28px' }}>
          Browse websites built by our community. Hover a card for a live preview, or click to open the full site.
        </p>
        <input
          type="text"
          placeholder="Search by business name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 400, width: '100%', margin: '0 auto', display: 'block' }}
        />
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 36 }}>
        {ALL_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            style={{
              padding: '7px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: '1px solid',
              background: filter === cat ? 'var(--accent)' : 'transparent',
              color: filter === cat ? '#fff' : 'var(--text-m)',
              borderColor: filter === cat ? 'var(--accent)' : 'var(--border)',
              transition: 'all 0.15s',
            }}>
            {cat !== 'All' && CATEGORY_ICONS[cat]} {cat}
          </button>
        ))}
      </div>

      {/* Sites Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3, margin: '0 auto' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>No sites found</h2>
          <p style={{ color: 'var(--text)', marginBottom: 24 }}>
            {sites.length === 0 ? 'Be the first to publish a site!' : 'Try a different category or search term.'}
          </p>
          <Link to="/signup" className="btn btn-primary">Create the First Site →</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map(site => {
            const color = CATEGORY_COLORS[site.category] || '#8b5cf6';
            return (
              <Link to={`/site/${site.subdomain}`} key={site.id} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: 0, overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = color + '60'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${color}20`; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                  {/* Live preview banner */}
                  <SitePreviewThumb subdomain={site.subdomain} color={color} />
                  <div style={{ padding: '16px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-h)' }}>{site.business_name}</h3>
                      <span className="badge" style={{ background: color + '20', color: color, border: `1px solid ${color}40`, fontSize: 11, whiteSpace: 'nowrap' }}>{site.category}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text)', fontFamily: 'var(--mono)', marginBottom: 10 }}>{site.subdomain}.businessstudios.com</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text)' }}>
                      <span>by {site.owner_name}</span>
                      <span>{site.views} views</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* CTA */}
      {!loading && (
        <div style={{ textAlign: 'center', marginTop: 60, padding: '40px 24px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>Want to be featured here?</h2>
          <p style={{ color: 'var(--text-m)', marginBottom: 24 }}>Create your business website and publish it to the gallery.</p>
          <Link to="/signup" className="btn btn-primary btn-lg">Start Building →</Link>
        </div>
      )}
    </div>
  );
}
