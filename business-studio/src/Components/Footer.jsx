import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', marginTop: 'auto', background: 'var(--bg2)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#fff', fontWeight: 700 }}>B</div>
            <span style={{ fontWeight: 700, color: 'var(--text-h)', fontSize: 16 }}>BusinessStudio</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, maxWidth: 220 }}>
            The easiest way to build and launch your business website. No coding needed.
          </p>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text)', marginBottom: 16 }}>Product</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link to="/gallery" style={{ fontSize: 14, color: 'var(--text)', textDecoration: 'none' }} onMouseOver={e=>e.target.style.color='var(--text-h)'} onMouseOut={e=>e.target.style.color='var(--text)'}>Gallery</Link>
            <Link to="/signup" style={{ fontSize: 14, color: 'var(--text)', textDecoration: 'none' }} onMouseOver={e=>e.target.style.color='var(--text-h)'} onMouseOut={e=>e.target.style.color='var(--text)'}>Get Started</Link>
            <Link to="/#pricing" style={{ fontSize: 14, color: 'var(--text)', textDecoration: 'none' }} onMouseOver={e=>e.target.style.color='var(--text-h)'} onMouseOut={e=>e.target.style.color='var(--text)'}>Pricing</Link>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text)', marginBottom: 16 }}>Business Types</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['Music', 'Artwork', 'Food', 'Clothing', 'Delivery', 'News', 'Accommodation'].map(c => (
              <span key={c} style={{ fontSize: 14, color: 'var(--text)' }}>{c}</span>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text)', marginBottom: 16 }}>Social</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['Instagram', 'TikTok', 'Twitter / X', 'YouTube'].map(s => (
              <span key={s} style={{ fontSize: 14, color: 'var(--text)' }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', padding: '16px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--text)' }}>© 2024 BusinessStudio.com</span>
      </div>
    </footer>
  );
}