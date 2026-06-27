import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'https://business-studio-7tqf.onrender.com';

const CATEGORIES = [
  { id: 'Music', label: 'Music & Beats', desc: 'MP3 player, playlists, track listings' },
  { id: 'Artwork', label: 'Artwork & Literature', desc: 'Image galleries, portfolio, books' },
  { id: 'Food', label: 'Food & Catering', desc: 'Menu, specials, order info' },
  { id: 'Delivery', label: 'Delivery Service', desc: 'Service areas, contact, tracking' },
  { id: 'Clothing', label: 'Clothing & Fashion', desc: 'Product catalog, lookbook' },
  { id: 'News', label: 'News & Blog', desc: 'Articles, categories, subscriptions' },
  { id: 'Accommodation', label: 'Accommodation', desc: 'Room listings, booking forms' },
];

const LAYOUT_STYLES = [
  { id: 'single_page', label: 'Single Page', desc: 'All content on one scrollable page' },
  { id: 'long_page', label: 'Long Page', desc: 'Extended layout with many sections' },
  { id: 'multiple_pages', label: 'Multiple Pages', desc: 'Separate pages for each section' },
];

const THEMES = [
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
];

const COMPONENT_TYPES_BY_CATEGORY = {
  Music: [
    { type: 'audio_player', label: 'Music Track', desc: 'Add a playable music track' },
    { type: 'text', label: 'Text Block', desc: 'Paragraph of text' },
    { type: 'image', label: 'Image', desc: 'Album art or photo' },
    { type: 'video', label: 'Music Video', desc: 'YouTube / video embed' },
    { type: 'checkout_button', label: 'Buy / Tip Button', desc: 'Accept payments' },
    { type: 'contact', label: 'Booking Contact', desc: 'Phone, email, address' },
  ],
  Artwork: [
    { type: 'gallery', label: 'Gallery', desc: 'Image grid / portfolio' },
    { type: 'text', label: 'Text Block', desc: 'Description or bio' },
    { type: 'image', label: 'Single Image', desc: 'Featured artwork' },
    { type: 'checkout_button', label: 'Buy Artwork', desc: 'Commission / purchase' },
    { type: 'contact', label: 'Contact', desc: 'Get in touch info' },
  ],
  Food: [
    { type: 'menu', label: 'Menu', desc: 'Food items with prices' },
    { type: 'text', label: 'Text Block', desc: 'Description or story' },
    { type: 'image', label: 'Photo', desc: 'Food or restaurant photo' },
    { type: 'checkout_button', label: 'Order / Pay', desc: 'Take orders or payments' },
    { type: 'contact', label: 'Location & Contact', desc: 'Address & phone' },
    { type: 'gallery', label: 'Photo Gallery', desc: 'Food photography' },
  ],
  Delivery: [
    { type: 'text', label: 'Service Info', desc: 'What you deliver' },
    { type: 'image', label: 'Photo', desc: 'Fleet or product photo' },
    { type: 'contact', label: 'Contact & Order', desc: 'Phone, email, address' },
    { type: 'checkout_button', label: 'Book Delivery', desc: 'Accept payments' },
  ],
  Clothing: [
    { type: 'gallery', label: 'Lookbook Gallery', desc: 'Product photo grid' },
    { type: 'image', label: 'Feature Image', desc: 'Hero product shot' },
    { type: 'text', label: 'Brand Story', desc: 'About your brand' },
    { type: 'menu', label: 'Products & Prices', desc: 'Catalog with prices' },
    { type: 'checkout_button', label: 'Buy Now', desc: 'Accept payments' },
    { type: 'contact', label: 'Contact', desc: 'Store info' },
  ],
  News: [
    { type: 'text', label: 'Article', desc: 'News article or blog post' },
    { type: 'image', label: 'Article Image', desc: 'Photo for article' },
    { type: 'gallery', label: 'Photo Story', desc: 'Photo journalism grid' },
    { type: 'contact', label: 'Tips & Contact', desc: 'News tips contact info' },
  ],
  Accommodation: [
    { type: 'gallery', label: 'Room Gallery', desc: 'Photo gallery of rooms' },
    { type: 'menu', label: 'Rooms & Rates', desc: 'Room types with prices' },
    { type: 'text', label: 'Description', desc: 'Property description' },
    { type: 'image', label: 'Feature Photo', desc: 'Hero property image' },
    { type: 'checkout_button', label: 'Book Now', desc: 'Accept booking payments' },
    { type: 'contact', label: 'Location & Contact', desc: 'Address & phone' },
    { type: 'video', label: 'Property Tour', desc: 'Video walkthrough' },
  ],
};

function makeDefaultComponents(category, businessName) {
  const header = { id: 'h1', type: 'header', content: businessName, subtitle: '' };
  const defaults = {
    Music: [
      header,
      { id: 'c1', type: 'text', content: 'Welcome to my music page. Stream my latest tracks and get in touch for bookings.' },
      { id: 'c2', type: 'audio_player', title: 'My Latest Track', url: '' },
    ],
    Artwork: [
      header,
      { id: 'c1', type: 'text', content: 'Welcome to my portfolio. Explore my artwork and get in touch for commissions.' },
      { id: 'c2', type: 'gallery', title: 'Portfolio Gallery', images: [] },
    ],
    Food: [
      header,
      { id: 'c1', type: 'text', content: 'Fresh, delicious food made with love. Check out our menu below.' },
      { id: 'c2', type: 'menu', title: 'Our Menu', items: [
        { name: 'Starter Dish', desc: 'Fresh and tasty', price: '$5.99' },
        { name: 'Main Course', desc: 'Our signature dish', price: '$12.99' },
      ]},
    ],
    Delivery: [
      header,
      { id: 'c1', type: 'text', content: 'Fast and reliable delivery service. We deliver to your door.' },
      { id: 'c2', type: 'contact', email: '', phone: '', address: '' },
    ],
    Clothing: [
      header,
      { id: 'c1', type: 'text', content: 'Discover our latest collection. Style that speaks for itself.' },
      { id: 'c2', type: 'gallery', title: 'Our Collection', images: [] },
    ],
    News: [
      header,
      { id: 'c1', type: 'text', content: 'Your trusted source for the latest news and stories.' },
    ],
    Accommodation: [
      header,
      { id: 'c1', type: 'text', content: 'Experience comfort and luxury. Book your stay today.' },
      { id: 'c2', type: 'menu', title: 'Rooms & Rates', items: [
        { name: 'Standard Room', desc: 'Cozy and comfortable', price: '$60/night' },
        { name: 'Deluxe Suite', desc: 'Spacious with premium amenities', price: '$120/night' },
      ]},
    ],
  };
  return defaults[category] || [header];
}

// --- Sub-editors ---
function HeaderEditor({ comp, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="form-group">
        <label className="form-label">Business / Site Title</label>
        <input value={comp.content || ''} onChange={e => onChange({ ...comp, content: e.target.value })} placeholder="Your business name" />
      </div>
      <div className="form-group">
        <label className="form-label">Subtitle / Tagline (optional)</label>
        <input value={comp.subtitle || ''} onChange={e => onChange({ ...comp, subtitle: e.target.value })} placeholder="e.g. Fresh meals delivered daily" />
      </div>
    </div>
  );
}

function TextEditor({ comp, onChange }) {
  return (
    <div className="form-group">
      <label className="form-label">Content</label>
      <textarea value={comp.content || ''} onChange={e => onChange({ ...comp, content: e.target.value })} rows={5} placeholder="Write your text here..." style={{ resize: 'vertical' }} />
    </div>
  );
}

function AudioEditor({ comp, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="form-group">
        <label className="form-label">Track Title</label>
        <input value={comp.title || ''} onChange={e => onChange({ ...comp, title: e.target.value })} placeholder="e.g. Summer Vibes - Beat #1" />
      </div>
      <div className="form-group">
        <label className="form-label">Audio URL (MP3 link)</label>
        <input value={comp.url || ''} onChange={e => onChange({ ...comp, url: e.target.value })} placeholder="https://example.com/track.mp3" />
        <span className="form-hint">Paste a direct MP3 URL or SoundCloud embed link</span>
      </div>
    </div>
  );
}

function ImageEditor({ comp, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="form-group">
        <label className="form-label">Image URL</label>
        <input value={comp.url || ''} onChange={e => onChange({ ...comp, url: e.target.value })} placeholder="https://example.com/image.jpg" />
        <span className="form-hint">Paste an image URL (from Unsplash, your hosting, etc.)</span>
      </div>
      {comp.url && (
        <img src={comp.url} alt="" style={{ maxHeight: 160, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} onError={e => e.target.style.display='none'} />
      )}
      <div className="form-group">
        <label className="form-label">Caption (optional)</label>
        <input value={comp.caption || ''} onChange={e => onChange({ ...comp, caption: e.target.value })} placeholder="Image caption" />
      </div>
    </div>
  );
}

function GalleryEditor({ comp, onChange }) {
  const images = comp.images || [];
  const addImage = (url) => {
    if (!url.trim()) return;
    onChange({ ...comp, images: [...images, url.trim()] });
  };
  const removeImage = (i) => onChange({ ...comp, images: images.filter((_, idx) => idx !== i) });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="form-group">
        <label className="form-label">Gallery Title</label>
        <input value={comp.title || ''} onChange={e => onChange({ ...comp, title: e.target.value })} placeholder="Gallery title" />
      </div>
      <div className="form-group">
        <label className="form-label">Add Image URL</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input id="gallery-url-input" placeholder="https://example.com/image.jpg" onKeyDown={e => { if(e.key==='Enter'){e.preventDefault();addImage(e.target.value);e.target.value='';} }} />
          <button type="button" className="btn btn-secondary btn-sm" style={{ whiteSpace: 'nowrap' }}
            onClick={() => { const el = document.getElementById('gallery-url-input'); addImage(el.value); el.value=''; }}>
            Add
          </button>
        </div>
        <span className="form-hint">Press Enter or click Add after each URL</span>
      </div>
      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8 }}>
          {images.map((url, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <img src={url} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} onError={e => e.target.style.opacity='0.3'} />
              <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: '50%', background: 'var(--red)', color: '#fff', border: 'none', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MenuEditor({ comp, onChange }) {
  const items = comp.items || [];
  const updateItem = (i, field, val) => {
    const updated = items.map((item, idx) => idx === i ? { ...item, [field]: val } : item);
    onChange({ ...comp, items: updated });
  };
  const addItem = () => onChange({ ...comp, items: [...items, { name: '', desc: '', price: '' }] });
  const removeItem = (i) => onChange({ ...comp, items: items.filter((_, idx) => idx !== i) });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="form-group">
        <label className="form-label">Menu Title</label>
        <input value={comp.title || ''} onChange={e => onChange({ ...comp, title: e.target.value })} placeholder="e.g. Our Menu" />
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-m)' }}>Items</div>
      {items.map((item, i) => (
        <div key={i} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, alignItems: 'center' }}>
            <input value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} placeholder="Item name" />
            <input value={item.price} onChange={e => updateItem(i, 'price', e.target.value)} placeholder="Price (e.g. $12.99)" />
            <button onClick={() => removeItem(i)} className="btn btn-danger btn-sm" style={{ whiteSpace: 'nowrap' }}>✕</button>
          </div>
          <input value={item.desc} onChange={e => updateItem(i, 'desc', e.target.value)} placeholder="Description (optional)" />
        </div>
      ))}
      <button type="button" onClick={addItem} className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>+ Add Item</button>
    </div>
  );
}

function CheckoutEditor({ comp, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="form-group">
        <label className="form-label">Button Label</label>
        <input value={comp.label || ''} onChange={e => onChange({ ...comp, label: e.target.value })} placeholder="e.g. Buy Now / Book Now / Pay" />
      </div>
      <div className="form-group">
        <label className="form-label">Amount</label>
        <input value={comp.amount || ''} onChange={e => onChange({ ...comp, amount: e.target.value })} placeholder="e.g. $20.00" />
      </div>
    </div>
  );
}

function ContactEditor({ comp, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="form-group">
        <label className="form-label">Email</label>
        <input value={comp.email || ''} onChange={e => onChange({ ...comp, email: e.target.value })} placeholder="contact@yourbusiness.com" type="email" />
      </div>
      <div className="form-group">
        <label className="form-label">Phone</label>
        <input value={comp.phone || ''} onChange={e => onChange({ ...comp, phone: e.target.value })} placeholder="+1 234 567 8900" />
      </div>
      <div className="form-group">
        <label className="form-label">Address</label>
        <input value={comp.address || ''} onChange={e => onChange({ ...comp, address: e.target.value })} placeholder="123 Main St, City, Country" />
      </div>
    </div>
  );
}

function VideoEditor({ comp, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="form-group">
        <label className="form-label">Title</label>
        <input value={comp.title || ''} onChange={e => onChange({ ...comp, title: e.target.value })} placeholder="Video title" />
      </div>
      <div className="form-group">
        <label className="form-label">YouTube URL</label>
        <input value={comp.url || ''} onChange={e => onChange({ ...comp, url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
        <span className="form-hint">Paste a YouTube video link</span>
      </div>
    </div>
  );
}

function ComponentEditor({ comp, onChange }) {
  if (comp.type === 'header') return <HeaderEditor comp={comp} onChange={onChange} />;
  if (comp.type === 'text') return <TextEditor comp={comp} onChange={onChange} />;
  if (comp.type === 'audio_player') return <AudioEditor comp={comp} onChange={onChange} />;
  if (comp.type === 'image') return <ImageEditor comp={comp} onChange={onChange} />;
  if (comp.type === 'gallery') return <GalleryEditor comp={comp} onChange={onChange} />;
  if (comp.type === 'menu') return <MenuEditor comp={comp} onChange={onChange} />;
  if (comp.type === 'checkout_button') return <CheckoutEditor comp={comp} onChange={onChange} />;
  if (comp.type === 'contact') return <ContactEditor comp={comp} onChange={onChange} />;
  if (comp.type === 'video') return <VideoEditor comp={comp} onChange={onChange} />;
  return <div style={{ color: 'var(--text)', fontSize: 14 }}>No editor for this component type.</div>;
}

// --- Live Preview Component ---
const COMP_TYPE_LABELS = {
  header: 'Header', text: 'Text', audio_player: 'Music Track', image: 'Image',
  gallery: 'Gallery', menu: 'Menu / Products', checkout_button: 'Pay Button',
  contact: 'Contact', video: 'Video',
};

export default function StudioBuilder({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  // Wizard for new sites
  const [wizardStep, setWizardStep] = useState(isNew ? 1 : 0);
  const [businessName, setBusinessName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [subdomainAvail, setSubdomainAvail] = useState(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [layoutStyle, setLayoutStyle] = useState('single_page');
  const [category, setCategory] = useState('');
  const [theme, setTheme] = useState('dark');

  // Builder state
  const [components, setComponents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [siteId, setSiteId] = useState(null);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');

  // Load existing site
  useEffect(() => {
    if (!isNew && id) {
      fetch(`${API}/api/sites`, { credentials: 'include' })
        .then(r => r.json())
        .then(d => {
          if (d.status === 'success') {
            const site = d.sites.find(s => s.id === parseInt(id));
            if (site) {
              setBusinessName(site.business_name);
              setSubdomain(site.subdomain);
              setLayoutStyle(site.layout_style);
              setCategory(site.category);
              setTheme(site.theme || 'dark');
              setComponents(site.components || []);
              setSiteId(site.id);
            } else setError('Site not found.');
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  // Subdomain availability check
  useEffect(() => {
    if (!subdomain || !isNew) return;
    setSubdomainAvail(null);
    setCheckingSlug(true);
    const t = setTimeout(() => {
      fetch(`${API}/api/check-subdomain/${subdomain}`)
        .then(r => r.json())
        .then(d => setSubdomainAvail(d.available))
        .finally(() => setCheckingSlug(false));
    }, 500);
    return () => clearTimeout(t);
  }, [subdomain, isNew]);

  const handleWizardNext = () => {
    if (wizardStep === 1) {
      if (!businessName.trim() || !subdomain) return;
      setWizardStep(2);
    } else if (wizardStep === 2) {
      if (!category) return;
      const defaultComps = makeDefaultComponents(category, businessName);
      setComponents(defaultComps);
      setSelectedId(defaultComps[0]?.id || null);
      setWizardStep(0);
    }
  };

  const addComponent = (type) => {
    const catMeta = CATEGORIES.find(c => c.id === category);
    const newComp = {
      id: `c${Date.now()}`, type,
      content: '', title: '', subtitle: '', url: '', caption: '',
      items: type === 'menu' ? [] : undefined,
      images: type === 'gallery' ? [] : undefined,
      email: '', phone: '', address: '',
      amount: '$20.00',
    };
    setComponents(cs => [...cs, newComp]);
    setSelectedId(newComp.id);
  };

  const updateComponent = useCallback((id, updated) => {
    setComponents(cs => cs.map(c => c.id === id ? updated : c));
  }, []);

  const moveComponent = (id, dir) => {
    setComponents(cs => {
      const idx = cs.findIndex(c => c.id === id);
      if ((dir === -1 && idx === 0) || (dir === 1 && idx === cs.length - 1)) return cs;
      const arr = [...cs];
      [arr[idx], arr[idx + dir]] = [arr[idx + dir], arr[idx]];
      return arr;
    });
  };

  const removeComponent = (id) => {
    setComponents(cs => cs.filter(c => c.id !== id));
    setSelectedId(null);
  };

  const save = async () => {
    setSaving(true); setSaveMsg('');
    const payload = { businessName, subdomain, layoutStyle, category, components, theme, published: true };
    try {
      let res, data;
      if (isNew || !siteId) {
        res = await fetch(`${API}/api/sites`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload) });
        data = await res.json();
        if (res.ok) { setSiteId(data.site.id); navigate(`/studio/${data.site.id}`, { replace: true }); }
      } else {
        res = await fetch(`${API}/api/sites/${siteId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload) });
        data = await res.json();
      }
      if (res.ok) { setSaveMsg('✓ Saved'); setTimeout(() => setSaveMsg(''), 2500); }
      else setSaveMsg('❌ ' + (data.message || 'Save failed'));
    } catch { setSaveMsg('❌ Connection error'); }
    finally { setSaving(false); }
  };

  const selectedComp = components.find(c => c.id === selectedId);
  const availableComponents = COMPONENT_TYPES_BY_CATEGORY[category] || [];

  // --- WIZARD ---
  if (wizardStep > 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          {/* Progress */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, justifyContent: 'center' }}>
            {[1, 2].map(n => (
              <div key={n} style={{ height: 4, width: 60, borderRadius: 2, background: n <= wizardStep ? 'var(--accent)' : 'var(--border)', transition: 'background 0.3s' }} />
            ))}
          </div>

          {wizardStep === 1 && (
            <div className="fade-in">
              <span className="section-label">Step 1 of 2</span>
              <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Name your business</h2>
              <p style={{ color: 'var(--text)', marginBottom: 28 }}>This will be the title of your website</p>
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: 28 }}>
                <div className="form-group">
                  <label className="form-label">Business Name</label>
                  <input
                    autoFocus
                    value={businessName}
                    onChange={e => {
                      setBusinessName(e.target.value);
                      setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 30));
                    }}
                    placeholder="e.g. Beats By Zion"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Website Address (Subdomain)</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg3)', border: `1px solid ${subdomainAvail === false ? 'var(--red)' : subdomainAvail === true ? 'var(--green)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                    <span style={{ padding: '10px 12px', color: 'var(--text)', fontSize: 14, whiteSpace: 'nowrap', borderRight: '1px solid var(--border)' }}>https://</span>
                    <input
                      value={subdomain}
                      onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 30))}
                      style={{ flex: 1, border: 'none', background: 'transparent', borderRadius: 0, boxShadow: 'none' }}
                      placeholder="yoursite"
                    />
                    <span style={{ padding: '10px 12px', color: 'var(--accent2)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>.businessstudios.com</span>
                  </div>
                  <span className="form-hint" style={{ color: checkingSlug ? 'var(--text)' : subdomainAvail === false ? 'var(--red)' : subdomainAvail === true ? 'var(--green)' : 'var(--text)' }}>
                    {checkingSlug ? 'Checking...' : subdomainAvail === false ? 'Already taken' : subdomainAvail === true ? 'Available' : ''}
                  </span>
                </div>
                <div className="form-group">
                  <label className="form-label">Layout Style</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {LAYOUT_STYLES.map(l => (
                      <label key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: `1px solid ${layoutStyle === l.id ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: layoutStyle === l.id ? 'var(--accent-bg)' : 'var(--bg3)', transition: 'all 0.15s' }}>
                        <input type="radio" name="layout" value={l.id} checked={layoutStyle === l.id} onChange={() => setLayoutStyle(l.id)} style={{ width: 'auto', margin: 0 }} />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-h)', fontSize: 14 }}>{l.label}</div>
                          <div style={{ fontSize: 12, color: 'var(--text)' }}>{l.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Theme</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {THEMES.map(t => (
                      <label key={t.id} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', border: `1px solid ${theme === t.id ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: theme === t.id ? 'var(--accent-bg)' : 'var(--bg3)', fontSize: 14, fontWeight: 500, color: 'var(--text-h)' }}>
                        <input type="radio" name="theme" value={t.id} checked={theme === t.id} onChange={() => setTheme(t.id)} style={{ width: 'auto', margin: 0 }} />
                        {t.label}
                      </label>
                    ))}
                  </div>
                </div>
                <button className="btn btn-primary" style={{ justifyContent: 'center', padding: '12px' }} onClick={handleWizardNext} disabled={!businessName || !subdomain || subdomainAvail === false}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="fade-in">
              <span className="section-label">Step 2 of 2</span>
              <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>What type of business?</h2>
              <p style={{ color: 'var(--text)', marginBottom: 24 }}>This sets up the perfect template for your site</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {CATEGORIES.map(cat => (
                  <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', border: `1px solid ${category === cat.id ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', cursor: 'pointer', background: category === cat.id ? 'var(--accent-bg)' : 'var(--bg2)', transition: 'all 0.15s' }}>
                    <input type="radio" name="category" value={cat.id} checked={category === cat.id} onChange={() => setCategory(cat.id)} style={{ width: 'auto', margin: 0 }} />
                    <span style={{ fontSize: 24 }}>{cat.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-h)' }}>{cat.label}</div>
                      <div style={{ fontSize: 13, color: 'var(--text)' }}>{cat.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setWizardStep(1)}>← Back</button>
                <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center', padding: '12px' }} onClick={handleWizardNext} disabled={!category}>
                  Set Up My Site
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
    </div>
  );

  if (error) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <h2>Error</h2>
      <p style={{ color: 'var(--text)' }}>{error}</p>
      <Link to="/dashboard" className="btn btn-secondary" style={{ marginTop: 20 }}>← Dashboard</Link>
    </div>
  );

  // --- FULL BUILDER UI ---
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/dashboard" className="btn btn-ghost btn-sm" style={{ fontSize: 13 }}>← Dashboard</Link>
          <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-h)', fontSize: 15 }}>{businessName}</div>
            <div style={{ fontSize: 11, color: 'var(--accent2)', fontFamily: 'var(--mono)' }}>{subdomain}.businessstudios.com</div>
          </div>
          <span className="badge badge-purple" style={{ fontSize: 11 }}>{category}</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {saveMsg && <span style={{ fontSize: 13, color: saveMsg.startsWith('✓') ? 'var(--green)' : 'var(--red)', fontWeight: 500 }}>{saveMsg}</span>}
          {siteId && <Link to={`/site/${subdomain}`} target="_blank" className="btn btn-secondary btn-sm">Preview</Link>}
          <button onClick={save} className="btn btn-primary btn-sm" disabled={saving}>
            {saving ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Saving...</> : 'Save & Publish'}
          </button>
        </div>
      </div>

      {/* Main editor area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* LEFT: Components panel */}
        <div style={{ width: 240, background: 'var(--bg2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
          <div style={{ padding: '14px 14px 8px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text)', marginBottom: 8 }}>Add Sections</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {availableComponents.map(ac => (
                <button key={ac.type} onClick={() => addComponent(ac.type)}
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-m)', padding: '8px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12, textAlign: 'left', fontFamily: 'var(--sans)', transition: 'all 0.15s' }}
                  onMouseOver={e => { e.currentTarget.style.background = 'var(--accent-bg)'; e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.color = 'var(--accent2)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-m)'; }}>
                  {ac.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text)', marginBottom: 8, padding: '4px 4px 0' }}>Page Sections</div>
            {components.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--text)', textAlign: 'center', padding: '20px 8px' }}>No sections yet.<br/>Add one above.</div>
            ) : components.map((comp, idx) => (
              <div key={comp.id}
                onClick={() => setSelectedId(comp.id)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 8px', borderRadius: 6, background: selectedId === comp.id ? 'var(--accent-bg)' : 'transparent', border: `1px solid ${selectedId === comp.id ? 'var(--accent-border)' : 'transparent'}`, cursor: 'pointer', marginBottom: 2, transition: 'all 0.15s' }}>
                <span style={{ fontSize: 12, color: selectedId === comp.id ? 'var(--accent2)' : 'var(--text-m)', fontWeight: selectedId === comp.id ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {COMP_TYPE_LABELS[comp.type] || comp.type}
                </span>
                <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                  <button onClick={e => { e.stopPropagation(); moveComponent(comp.id, -1); }} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: 10, padding: '2px 4px' }} title="Move up">↑</button>
                  <button onClick={e => { e.stopPropagation(); moveComponent(comp.id, 1); }} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: 10, padding: '2px 4px' }} title="Move down">↓</button>
                  <button onClick={e => { e.stopPropagation(); removeComponent(comp.id); }} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: 10, padding: '2px 4px' }} title="Delete">✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER: Editor panel */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, background: 'var(--bg)' }}>
          {!selectedComp ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text)', textAlign: 'center', gap: 12 }}>
              <div style={{ fontSize: 40 }}>👈</div>
              <p style={{ fontSize: 15 }}>Select a section from the left to edit it,<br />or add a new section.</p>
            </div>
          ) : (
            <div className="fade-in card" style={{ maxWidth: 640 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600 }}>{COMP_TYPE_LABELS[selectedComp.type] || selectedComp.type}</h3>
                <button onClick={() => removeComponent(selectedComp.id)} className="btn btn-danger btn-sm">Delete Section</button>
              </div>
              <ComponentEditor
                comp={selectedComp}
                onChange={(updated) => updateComponent(selectedComp.id, updated)}
              />
            </div>
          )}
        </div>

        {/* RIGHT: Live preview */}
        <div style={{ width: 320, background: 'var(--bg2)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text)' }}>Live Preview</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {THEMES.map(t => (
                <button key={t.id} onClick={() => setTheme(t.id)}
                  style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: theme === t.id ? 'var(--accent)' : 'var(--bg)', border: '1px solid var(--border)', color: theme === t.id ? '#fff' : 'var(--text)', cursor: 'pointer' }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <MiniPreview components={components} businessName={businessName} category={category} theme={theme} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniPreview({ components, businessName, category, theme }) {
  const dark = theme === 'dark';
  const bg = dark ? '#0a0a0f' : '#ffffff';
  const bg2 = dark ? '#1a1a24' : '#f8f9fa';
  const textH = dark ? '#f1f5f9' : '#111827';
  const text = dark ? '#94a3b8' : '#6b7280';
  const accent = '#a78bfa';
  const border = dark ? '#2a2a3a' : '#e5e7eb';

  return (
    <div style={{ background: bg, minHeight: '100%', padding: 16, fontSize: 12 }}>
      <div style={{ background: bg2, borderRadius: 6, padding: '10px 12px', marginBottom: 12, borderBottom: `1px solid ${border}` }}>
        <div style={{ fontWeight: 700, color: textH, fontSize: 13 }}>{businessName || 'Your Business'}</div>
        <div style={{ fontSize: 10, color: accent }}>businessstudios.com</div>
      </div>
      {components.map(comp => (
        <MiniComp key={comp.id} comp={comp} textH={textH} text={text} bg2={bg2} border={border} accent={accent} />
      ))}
    </div>
  );
}

function MiniComp({ comp, textH, text, bg2, border, accent }) {
  if (comp.type === 'header') return (
    <div style={{ marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${border}` }}>
      <div style={{ fontWeight: 800, color: textH, fontSize: 16 }}>{comp.content || 'Your Business'}</div>
      {comp.subtitle && <div style={{ fontSize: 10, color: text, marginTop: 2 }}>{comp.subtitle}</div>}
    </div>
  );
  if (comp.type === 'text') return (
    <div style={{ marginBottom: 10, padding: '8px 10px', background: bg2, borderLeft: `3px solid ${accent}`, borderRadius: '0 4px 4px 0' }}>
      <div style={{ fontSize: 11, color: text, lineHeight: 1.5, wordBreak: 'break-word' }}>{comp.content || 'Text block'}</div>
    </div>
  );
  if (comp.type === 'audio_player') return (
    <div style={{ marginBottom: 10, padding: '8px 10px', background: bg2, borderRadius: 6, display: 'flex', gap: 8, alignItems: 'center', border: `1px solid ${border}` }}>
      <div style={{ fontSize: 11, color: textH, fontWeight: 500 }}>{comp.title || 'Music Track'}</div>
    </div>
  );
  if (comp.type === 'image') return (
    <div style={{ marginBottom: 10 }}>
      {comp.url ? (
        <img src={comp.url} alt="" style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 6 }} onError={e => e.target.style.display='none'} />
      ) : (
        <div style={{ height: 60, background: bg2, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: text, border: `1px dashed ${border}` }}>🖼️</div>
      )}
    </div>
  );
  if (comp.type === 'gallery') return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: textH, marginBottom: 6 }}>{comp.title || 'Gallery'}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
        {(comp.images?.slice(0, 6) || []).map((url, i) => (
          <img key={i} src={url} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 3 }} onError={e => e.target.style.display='none'} />
        ))}
        {(comp.images?.length || 0) === 0 && [0,1,2].map(i => (
          <div key={i} style={{ aspectRatio: '1', background: bg2, borderRadius: 3, border: `1px dashed ${border}` }} />
        ))}
      </div>
    </div>
  );
  if (comp.type === 'menu') return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: textH, marginBottom: 4 }}>{comp.title || 'Menu'}</div>
      {(comp.items || []).slice(0, 3).map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: `1px solid ${border}` }}>
          <span style={{ fontSize: 10, color: text }}>{item.name}</span>
          <span style={{ fontSize: 10, color: accent, fontWeight: 600 }}>{item.price}</span>
        </div>
      ))}
    </div>
  );
  if (comp.type === 'checkout_button') return (
    <div style={{ marginBottom: 10, textAlign: 'center', padding: '10px', background: bg2, borderRadius: 6, border: `1px dashed ${accent}` }}>
      <div style={{ fontSize: 10, color: accent, fontWeight: 600 }}>💳 {comp.label || 'Pay Now'} {comp.amount || ''}</div>
    </div>
  );
  if (comp.type === 'contact') return (
    <div style={{ marginBottom: 10, padding: '8px 10px', background: bg2, borderRadius: 6, border: `1px solid ${border}` }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: textH, marginBottom: 4 }}>📬 Contact</div>
      {comp.email && <div style={{ fontSize: 10, color: text }}>📧 {comp.email}</div>}
      {comp.phone && <div style={{ fontSize: 10, color: text }}>📞 {comp.phone}</div>}
      {comp.address && <div style={{ fontSize: 10, color: text }}>📍 {comp.address}</div>}
    </div>
  );
  if (comp.type === 'video') return (
    <div style={{ marginBottom: 10, height: 60, background: bg2, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: `1px solid ${border}` }}>🎬</div>
  );
  return null;
}
