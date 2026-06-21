import { Link } from 'react-router-dom';
const CATEGORIES = [
  { icon: '🎵', name: 'Music', desc: 'MP3 player, playlists, track listings & booking links' },
  { icon: '🎨', name: 'Artwork', desc: 'Image galleries, portfolio grids, literature sections' },
  { icon: '🍽️', name: 'Food', desc: 'Menu pages, order forms, catering showcases' },
  { icon: '🚚', name: 'Delivery', desc: 'Service areas, order tracking & contact forms' },
  { icon: '👗', name: 'Clothing', desc: 'Product catalogs, size guides & lookbooks' },
  { icon: '📰', name: 'News', desc: 'Article layouts, categories & subscriptions' },
  { icon: '🏨', name: 'Accommodation', desc: 'Room listings, booking forms & amenities' },
];
const FEATURES = [
  { icon: '⚡', title: 'Launch in Minutes', desc: '3-step wizard gets your site live faster than making a coffee.' },
  { icon: '🎨', title: 'Business-Specific Templates', desc: 'Pre-built layouts and tools tailored to your exact industry.' },
  { icon: '🔧', title: 'Drag & Drop Builder', desc: 'Add, remove and rearrange sections with zero technical knowledge.' },
  { icon: '📱', title: 'Mobile Responsive', desc: 'Every site looks perfect on phones, tablets and desktops.' },
  { icon: '🌐', title: 'Free Subdomain', desc: 'Your site gets a free yourname.businessstudios.com address instantly.' },
  { icon: '📢', title: 'Social Promotion', desc: 'Pay to have your site promoted across our Instagram, TikTok & more.' },
];
const STATS = [
  { value: '91%', label: "of users don't have a website yet" },
  { value: '87%', label: 'found website creation difficult' },
  { value: '95%+', label: 'want a platform like ours' },
  { value: '65%', label: 'ready to pay for premium features' },
];
export default function LandingPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* HERO */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: 24 }}>
          <span className="badge badge-purple" style={{ fontSize: 13, padding: '6px 14px' }}>🚀 Free to get started — no credit card needed</span>
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-2px' }}>
          Build your business website<br />
          <span className="gradient-text">in under 5 minutes</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text2)', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.6 }}>
          BusinessStudio gives every entrepreneur — musicians, artists, chefs, and creators — a professional website without the technical hassle.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/signup" className="btn btn-primary btn-lg" style={{ fontSize: 16 }}>Start Building Free →</Link>
          <Link to="/gallery" className="btn btn-secondary btn-lg" style={{ fontSize: 16 }}>Browse Sites</Link>
        </div>
        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 1, marginTop: 64, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          {STATS.map(s => (
            <div key={s.value} style={{ background: 'var(--bg2)', padding: '24px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent2)', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>
      {/* BUSINESS CATEGORIES */}
      <section style={{ padding: '60px 24px', background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, marginBottom: 12 }}>Built for your industry</h2>
            <p style={{ color: 'var(--text2)', fontSize: 16 }}>Choose your category and get a fully pre-configured site template</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {CATEGORIES.map(cat => (
              <Link to="/signup" key={cat.name} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--bg3)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg)'; }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{cat.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{cat.name}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* FEATURES */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, marginBottom: 12 }}>Everything you need to go live</h2>
            <p style={{ color: 'var(--text2)', fontSize: 16 }}>No coding. No designers. No agencies.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="card" style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* HOW IT WORKS */}
      <section style={{ padding: '60px 24px', background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, marginBottom: 48 }}>3 steps to your business website</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
            {[
              { step: '01', title: 'Name your business', desc: 'Enter your business name and get an automatic subdomain instantly.' },
              { step: '02', title: 'Pick your template', desc: 'Select your business type and layout style. Pre-built sections load automatically.' },
              { step: '03', title: 'Customize & publish', desc: "Edit text, add images, music, menus and more. Hit publish when you're ready." },
            ].map(s => (
              <div key={s.step}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(124,58,237,0.15)', border: '2px solid rgba(124,58,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--accent2)', fontSize: 14, margin: '0 auto 16px' }}>{s.step}</div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* PRICING */}
      <section id="pricing" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, marginBottom: 12 }}>Simple, transparent pricing</h2>
            <p style={{ color: 'var(--text2)' }}>Start free, upgrade when you're ready</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            <div className="card">
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Free</h3>
              <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20 }}>Perfect for getting started</p>
              <div style={{ fontSize: 40, fontWeight: 800, color: 'var(--text)', marginBottom: 24 }}>Free Plan<span style={{ fontSize: 16, fontWeight: 400, color: 'var(--text2)' }}></span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {['1 website', 'All 7 business categories', 'Free subdomain', 'Drag & drop builder', 'Basic templates', 'Gallery listing'].map(f => (
                  <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: 'var(--text2)' }}>
                    <span style={{ color: 'var(--success)' }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <Link to="/signup" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Get Started Free</Link>
            </div>
            <div style={{ background: 'var(--bg2)', border: '2px solid var(--accent)', borderRadius: 'var(--radius)', padding: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 16, right: 16 }}><span className="badge badge-purple">⭐ Popular</span></div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: 'var(--text)' }}>Premium</h3>
              <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20 }}>For serious businesses</p>
              <div style={{ fontSize: 40, fontWeight: 800, color: 'var(--text)', marginBottom: 24 }}>10,000 Naira<span style={{ fontSize: 16, fontWeight: 400, color: 'var(--text2)' }}>/month</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {['Everything in Free', 'Up to 5 websites', 'Custom domain support', 'Advanced templates', 'Social media promotion', 'Priority support', 'Analytics dashboard', 'Remove BusinessStudio branding'].map(f => (
                  <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: 'var(--text2)' }}>
                    <span style={{ color: 'var(--accent2)' }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <Link to="/signup" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Start Premium Trial</Link>
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text2)' }}>
            BusinessStudio earns 5% of any transactions processed through your website checkout.
          </p>
        </div>
      </section>
      {/* CTA BANNER */}
      <section style={{ padding: '60px 24px', textAlign: 'center', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, marginBottom: 16 }}>Ready to go live?</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 28, fontSize: 16 }}>Join hundreds of entrepreneurs building their online presence with BusinessStudio.</p>
          <Link to="/signup" className="btn btn-primary btn-lg">Create Your Free Site →</Link>
        </div>
      </section>
    </div>
  );
}