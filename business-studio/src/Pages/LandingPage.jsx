import { Link } from 'react-router-dom';

const SAMPLE_SITES = [
  { name: 'Rhythm House', category: 'Music', sub: 'rhythmhouse', desc: 'Afrobeats & Amapiano producer — beats, bookings and exclusive drops', color: '#7c3aed' },
  { name: 'Canvas & Quill', category: 'Artwork', sub: 'canvasquill', desc: 'Digital illustrations, prints and literary portfolio', color: '#db2777' },
  { name: 'Mama Zara Kitchen', category: 'Food', sub: 'mamazara', desc: 'Home-cooked West African meals — catering and private orders', color: '#d97706' },
  { name: 'Swift Drop', category: 'Delivery', sub: 'swiftdrop', desc: 'Same-day courier service covering 25km radius', color: '#2563eb' },
  { name: 'Stitch & Thread', category: 'Clothing', sub: 'stitchthread', desc: 'Handmade streetwear and custom tailoring', color: '#059669' },
  { name: 'The Inner Circle', category: 'News', sub: 'innercircle', desc: 'Independent culture and entertainment publication', color: '#dc2626' },
];

const CATEGORIES = [
  { name: 'Music', desc: 'MP3 player, playlists, track listings and booking links' },
  { name: 'Artwork', desc: 'Image galleries, portfolio grids and literature sections' },
  { name: 'Food', desc: 'Menu pages, order forms and catering showcases' },
  { name: 'Delivery', desc: 'Service areas, order tracking and contact forms' },
  { name: 'Clothing', desc: 'Product catalogs, size guides and lookbooks' },
  { name: 'News', desc: 'Article layouts, categories and subscription pages' },
  { name: 'Accommodation', desc: 'Room listings, booking forms and amenities' },
];

const FEATURES = [
  { title: 'Business-Specific Templates', desc: 'Pre-built layouts and tools tailored to your exact industry. Not generic — built for your type of business.' },
  { title: 'Build Without Code', desc: 'Add, remove and rearrange sections without any technical knowledge. What you see is what your customers see.' },
  { title: 'Works on Every Device', desc: 'Every site looks sharp on phones, tablets and desktops automatically — no extra work needed.' },
  { title: 'Your Own Web Address', desc: 'Your site gets a yourname.businessstudios.com address the moment you publish. Custom domains available.' },
  { title: 'Social Promotion', desc: 'Pay to have your site promoted across our Instagram, TikTok and more to reach new customers.' },
  { title: 'Always Online', desc: 'Reliable hosting with no maintenance on your end. Your site stays live around the clock.' },
];

const STATS = [
  { value: '91%', label: 'of entrepreneurs don\'t have a website yet' },
  { value: '87%', label: 'found website creation too difficult' },
  { value: '95%+', label: 'want a platform built for their business type' },
  { value: '65%', label: 'ready to invest in premium features' },
];

export default function LandingPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* HERO */}
      <section style={{ padding: '72px 24px 48px', textAlign: 'center', maxWidth: 800, margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-2px', color: 'var(--text-h)' }}>
          Build your business<br />
          <span className="gradient-text">website today</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-m)', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.7 }}>
          BusinessStudio gives every entrepreneur — musicians, artists, chefs and creators — a professional website without the technical hassle.
        </p>
        <Link to="/signup" className="btn btn-primary btn-lg" style={{ fontSize: 16 }}>
          Start Building
        </Link>
      </section>

      {/* FEATURED SITES — Like Webtoon: show the work, not the platform */}
      <section style={{ padding: '0 24px 72px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div className="section-label">Live on BusinessStudio</div>
              <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 700 }}>Sites built by entrepreneurs</h2>
            </div>
            <Link to="/gallery" className="btn btn-secondary btn-sm">View all sites</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {SAMPLE_SITES.map(site => (
              <div key={site.sub} style={{
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
                onMouseOver={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseOut={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'none'; }}
              >
                {/* Site preview banner */}
                <div style={{ height: 120, background: `linear-gradient(135deg, ${site.color}22, ${site.color}44)`, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '0 20px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: site.color, letterSpacing: '-0.5px' }}>{site.name}</div>
                    <div style={{ fontSize: 11, color: site.color, opacity: 0.8, marginTop: 4, fontFamily: 'var(--mono)' }}>{site.sub}.businessstudios.com</div>
                  </div>
                  <div style={{ position: 'absolute', top: 12, right: 12 }}>
                    <span style={{ background: site.color, color: '#fff', borderRadius: 100, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>{site.category}</span>
                  </div>
                </div>
                <div style={{ padding: '16px 20px' }}>
                  <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{site.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1 }}>
            {STATS.map(s => (
              <div key={s.value} style={{ padding: '36px 24px', textAlign: 'center', borderRight: '1px solid var(--border)' }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent)', marginBottom: 8 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUSINESS CATEGORIES */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label">Business Types</div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, marginBottom: 12 }}>Built for your industry</h2>
            <p style={{ color: 'var(--text-m)', fontSize: 16 }}>Choose your category and get a fully pre-configured site template</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {CATEGORIES.map(cat => (
              <Link to="/signup" key={cat.name} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '20px 24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  height: '100%',
                }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.background = 'var(--accent-bg)'; e.currentTarget.style.boxShadow = '0 4px 12px var(--accent-glow)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%', marginBottom: 14 }} />
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-h)', marginBottom: 8 }}>{cat.name}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 24px', background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div className="section-label">How it works</div>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, marginBottom: 60 }}>3 steps to your business website</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
            {[
              { step: '01', title: 'Name your business', desc: 'Enter your business name and get an automatic web address instantly.' },
              { step: '02', title: 'Pick your template', desc: 'Select your business type and layout style. Pre-built sections load automatically.' },
              { step: '03', title: 'Customize and publish', desc: 'Edit text, add images, music, menus and more. Hit publish when you are ready.' },
            ].map(s => (
              <div key={s.step}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--accent-bg)', border: '2px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--accent)', fontSize: 15, margin: '0 auto 20px' }}>{s.step}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-h)', marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div className="section-label">Features</div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, marginBottom: 12 }}>Everything you need to go live</h2>
            <p style={{ color: 'var(--text-m)', fontSize: 16 }}>No coding. No designers. No agencies.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px 24px' }}>
                <div style={{ width: 4, height: 32, background: 'var(--accent)', borderRadius: 4, marginBottom: 18 }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-h)', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '80px 24px', background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div className="section-label">Pricing</div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, marginBottom: 12 }}>Simple, transparent pricing</h2>
            <p style={{ color: 'var(--text-m)' }}>Start building, upgrade when you are ready</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {/* Starter */}
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px 24px' }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Starter</h3>
              <p style={{ color: 'var(--text)', fontSize: 14, marginBottom: 24 }}>Get your business online</p>
              <div style={{ fontSize: 42, fontWeight: 800, color: 'var(--text-h)', marginBottom: 28 }}>$0<span style={{ fontSize: 16, fontWeight: 400, color: 'var(--text)' }}>/month</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                {['1 website', 'All 7 business categories', 'Your own web address', 'Site builder', 'Basic templates', 'Gallery listing'].map(f => (
                  <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: 'var(--text-m)' }}>
                    <span style={{ color: 'var(--green)', fontWeight: 700 }}>+</span> {f}
                  </div>
                ))}
              </div>
              <Link to="/signup" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Get Started</Link>
            </div>
            {/* Premium */}
            <div style={{ background: 'var(--bg)', border: '2px solid var(--accent)', borderRadius: 'var(--radius)', padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 16, right: 16 }}>
                <span className="badge badge-purple">Popular</span>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: 'var(--text-h)' }}>Premium</h3>
              <p style={{ color: 'var(--text)', fontSize: 14, marginBottom: 24 }}>For serious businesses</p>
              <div style={{ fontSize: 42, fontWeight: 800, color: 'var(--text-h)', marginBottom: 28 }}>$9.99<span style={{ fontSize: 16, fontWeight: 400, color: 'var(--text)' }}>/month</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                {['Everything in Starter', 'Up to 5 websites', 'Custom domain support', 'Advanced templates', 'Social media promotion', 'Priority support', 'Analytics dashboard', 'Remove BusinessStudio branding'].map(f => (
                  <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: 'var(--text-m)' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>+</span> {f}
                  </div>
                ))}
              </div>
              <Link to="/signup" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Start Premium</Link>
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text)' }}>
            BusinessStudio earns 5% of any transactions processed through your website checkout.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, marginBottom: 16 }}>Ready to go live?</h2>
          <p style={{ color: 'var(--text-m)', marginBottom: 32, fontSize: 16, lineHeight: 1.7 }}>Join entrepreneurs building their online presence with BusinessStudio.</p>
          <Link to="/signup" className="btn btn-primary btn-lg">Create Your Site</Link>
        </div>
      </section>

    </div>
  );
}
