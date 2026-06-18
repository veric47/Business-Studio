import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // Onboarding Wizard steps: 1 = Name, 2 = Layout Architecture, 3 = Category, 4 = Studio Workspace Canvas
  const [step, setStep] = useState(1); 
  const [businessName, setBusinessName] = useState('My Business');
  const [subdomain, setSubdomain] = useState('mybusiness'); // Added subdomain state tracking
  const [layoutStyle, setLayoutStyle] = useState('single_page');
  const [category, setCategory] = useState('');
  
  // Track active visual components inside the live workspace view
  const [canvasComponents, setCanvasComponents] = useState([]);

  // 📥 DATABASE LIFECYCLE: Look for existing layouts on boot
  useEffect(() => {
    const savedRecord = localStorage.getItem('business_studio_persistent_db');
    if (savedRecord) {
      try {
        const databasePayload = JSON.parse(savedRecord);
        setBusinessName(databasePayload.businessName);
        setSubdomain(databasePayload.subdomain || 'mybusiness');
        setLayoutStyle(databasePayload.layoutStyle);
        setCategory(databasePayload.category);
        setCanvasComponents(databasePayload.components);
        setStep(4); // Bypass onboarding straight to stored records
      } catch (err) {
        console.error("Local records cleared cleanly.");
      }
    }
  }, []);

  // Form handling to process step choices and populate industry elements
  const handleOnboardingSubmit = (e) => {
    e.preventDefault();
    let defaultComponents = [{ id: '1', type: 'header', content: businessName }];

    if (category === 'Music') {
      defaultComponents.push(
        { id: '2', type: 'audio_player', title: 'EARFQUAKE - Beats By Z' },
        { id: '3', type: 'text', content: 'Listen to my latest tracks below. Hit play to start the stream!' }
      );
    } else if (category === 'Artwork') {
      defaultComponents.push(
        { id: '2', type: 'gallery', title: 'Creative Art Portfolio' },
        { id: '3', type: 'text', content: 'Explore my creative layout galleries and written entries.' }
      );
    } else if (category === 'Food') {
      defaultComponents.push(
        { id: '2', type: 'text', content: 'Welcome to our catering portal. Fresh culinary choices delivered daily.' }
      );
    }
    setCanvasComponents(defaultComponents);
    setStep(4); // Advance to layout canvas workspace
  };

  // Append new layout modules from control sidebar
  const addComponent = (type) => {
    const newId = (canvasComponents.length + 1).toString();
    let newComp = { id: newId, type: type, content: 'Click text field to update content...' };
    if (type === 'audio_player') {
      newComp = { id: newId, type: 'audio_player', title: 'New Custom Track Audio' };
    }
    setCanvasComponents([...canvasComponents, newComp]);
  };

  // Inline canvas handler to capture real-time textual updates
  const updateTextContent = (id, newContent) => {
    setCanvasComponents(canvasComponents.map(comp => 
      comp.id === id ? { ...comp, content: newContent } : comp
    ));
  };

  // 🗑️ DEV TRICK: Clear storage to test onboarding again during pitch
  const handleResetApp = () => {
    localStorage.removeItem('business_studio_persistent_db');
    setStep(1);
    setBusinessName('My Business');
    setSubdomain('mybusiness');
    setLayoutStyle('single_page');
    setCategory('');
    setCanvasComponents([]);
    alert("Application data state flushed successfully!");
  };

  return (
    <>
      {/* Top Main Navigation Block */}
      <section id="center" style={{ paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <h2 style={{ margin: 0, color: 'var(--accent)', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
            BusinessStudio<span style={{ color: 'var(--text-h)' }}>.com</span>
          </h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            {step === 4 && (
              <button 
                onClick={handleResetApp}
                style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Reset Studio
              </button>
            )}
            {step === 4 && (
              <button 
                onClick={async () => {
                  const currentPayload = { 
                    businessName, 
                    subdomain, 
                    layoutStyle, 
                    category, 
                    components: canvasComponents 
                  };

                  // 1. Still save locally as a persistent frontend fallback snapshot
                  localStorage.setItem('business_studio_persistent_db', JSON.stringify(currentPayload));

                  // 2. 🚀 LIVE ASYNC API FETCH TO FLASK ENGINE
                  try {
                    const response = await fetch('http://127.0.0.1:5000/api/save-layout', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(currentPayload)
                    });

                    const responseData = await response.json();

                    if (response.ok) {
                      alert(`🎉 [SYSTEM ACTION RECOVERY SUCCESS]\n\n${responseData.message}\n\nNamespace Mapping target:\nhttps://${subdomain}.businessstudios.com`);
                    } else {
                      alert(`⚠️ Server rejected the payload: ${responseData.message}`);
                    }
                  } catch (networkError) {
                    console.error("Flask connection refused: ", networkError);
                    alert("⚠️ Failed to reach Flask server runtime. Is your terminal server script running on port 5000?");
                  }
                }} 
                style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'var(--sans)' }}
              >
                Publish Website
              </button>
            )}
          </div>
        </div>
      </section>

      {/* --- WIZARD ONBOARDING REGION --- */}
      {step < 4 && (
        <section id="center">
          <form onSubmit={handleOnboardingSubmit} style={{ textAlign: 'left', maxWidth: '500px', margin: '40px auto', width: '100%' }}>
            
            {step === 1 && (
              <div>
                <code style={{ fontSize: '12px', color: 'var(--accent)', background: 'var(--accent-bg)', border: '1px solid var(--accent-border)' }}>STEP 1 OF 3: BUSINESS IDENTITY</code>
                <h1 style={{ marginTop: '15px' }}>What is your business name?</h1>
                <input 
                  type="text" 
                  value={businessName} 
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                  }}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '14px', background: 'var(--code-bg)', border: '1px solid var(--border)', color: 'var(--text-h)', borderRadius: '6px', margin: '10px 0 20px', fontSize: '16px', fontFamily: 'var(--sans)' }}
                  required
                />

                <h2 style={{ fontSize: '16px', margin: '10px 0 5px' }}>Automated Subdomain Namespace Assignment:</h2>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0 14px', margin: '10px 0 20px' }}>
                  <span style={{ color: 'var(--text)', fontSize: '14px' }}>https://</span>
                  <input 
                    type="text" 
                    value={subdomain} 
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                    style={{ flex: 1, border: 'none', background: 'transparent', padding: '14px 0', color: 'var(--text-h)', fontSize: '15px', outline: 'none' }}
                    required
                  />
                  <span style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: 'bold' }}>.businessstudios.com</span>
                </div>

                <button type="button" onClick={() => setStep(2)} className="counter" style={{ width: '100%', justifyContent: 'center', background: 'var(--accent)', color: '#fff', padding: '14px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>Continue</button>
              </div>
            )}

            {step === 2 && (
              <div>
                <code style={{ fontSize: '12px', color: 'var(--accent)', background: 'var(--accent-bg)', border: '1px solid var(--accent-border)' }}>STEP 2 OF 3: DISPLAY SCHEMA</code>
                <h1 style={{ marginTop: '15px' }}>Choose display style</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
                  {['single_page', 'multiple_pages', 'vertical_scroll'].map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setLayoutStyle(style)}
                      style={{ padding: '16px', borderRadius: '6px', border: '1px solid var(--border)', textAlign: 'left', background: layoutStyle === style ? 'var(--accent-bg)' : 'var(--code-bg)', color: layoutStyle === style ? 'var(--accent)' : 'var(--text)', borderColor: layoutStyle === style ? 'var(--accent)' : 'var(--border)', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: '15px', fontWeight: '500' }}
                    >
                      {style.replace('_', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={() => setStep(1)} className="counter" style={{ width: '50%', justifyContent: 'center', background: 'var(--code-bg)', border: '1px solid var(--border)', color: 'var(--text-h)', padding: '12px', cursor: 'pointer' }}>Back</button>
                  <button type="button" onClick={() => setStep(3)} className="counter" style={{ width: '50%', justifyContent: 'center', background: 'var(--accent)', color: '#fff', border: 'none', padding: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Continue</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <code style={{ fontSize: '12px', color: 'var(--accent)', background: 'var(--accent-bg)', border: '1px solid var(--accent-border)' }}>STEP 3 OF 3: FUNCTIONAL MAPPING</code>
                <h1 style={{ marginTop: '15px' }}>Select business type</h1>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '14px', background: 'var(--code-bg)', border: '1px solid var(--border)', color: 'var(--text-h)', borderRadius: '6px', margin: '20px 0', fontSize: '16px', fontFamily: 'var(--sans)' }}
                  required
                >
                  <option value="">-- Choose Category --</option>
                  <option value="Music">Music & Beats</option>
                  <option value="Artwork">Artwork & Literature</option>
                  <option value="Food">Food & Catering</option>
                </select>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={() => setStep(2)} className="counter" style={{ width: '50%', justifyContent: 'center', background: 'var(--code-bg)', border: '1px solid var(--border)', color: 'var(--text-h)', padding: '12px', cursor: 'pointer' }}>Back</button>
                  <button type="submit" className="counter" style={{ width: '50%', justifyContent: 'center', background: 'var(--accent)', color: '#fff', border: 'none', padding: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Generate Studio</button>
                </div>
              </div>
            )}

          </form>
        </section>
      )}

      {/* --- LIVE STUDIO WORKSPACE REGION --- */}
      {step === 4 && (
        <section id="next-steps" style={{ marginTop: '20px', gap: '20px', display: 'flex', alignItems: 'stretch' }}>
          
          {/* Left Action Control Column */}
          <div id="docs" style={{ flex: '0 0 280px', textAlign: 'left', padding: '20px', background: 'var(--code-bg)', border: '1px solid var(--border)', boxSizing: 'border-box' }}>
            <h2 style={{ fontSize: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Studio Controls</h2>
            <p style={{ margin: '12px 0 6px', fontSize: '14px' }}>Target Brand: <code style={{ fontSize: '13px' }}>{businessName}</code></p>
            <p style={{ margin: '0 0 4px', fontSize: '12px', color: 'var(--text)' }}>Architecture: {layoutStyle.replace('_', ' ')}</p>
            <p style={{ margin: '0 0 20px', fontSize: '11px', color: 'var(--accent)' }}>Subdomain: {subdomain}.businessstudios.com</p>
            
            <h2 style={{ fontSize: '14px', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '10px' }}>Layout components</h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', listStyleType: 'none', padding: 0 }}>
              <li>
                <button onClick={() => addComponent('text')} style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-h)', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', textAlign: 'left', fontFamily: 'var(--sans)' }}>
                  📄 Text Segment
                </button>
              </li>
              <li>
                <button onClick={() => addComponent('audio_player')} style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-h)', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', textAlign: 'left', fontFamily: 'var(--sans)' }}>
                  🎵 Audio Player Stream
                </button>
              </li>
              <li>
                <button onClick={() => addComponent('checkout_button')} style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-h)', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', textAlign: 'left', fontFamily: 'var(--sans)' }}>
                  💳 5% Protected Pay Button
                </button>
              </li>
            </ul>
          </div>

          {/* Right Live Site Template Workspace Sandbox */}
          <div id="social" style={{ flex: 1, textAlign: 'left', padding: '30px', background: 'var(--bg)', boxSizing: 'border-box', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {canvasComponents.map((comp) => {
                if (comp.type === 'header') {
                  return (
                    <input 
                      key={comp.id} 
                      type="text" 
                      value={comp.content} 
                      onChange={(e) => updateTextContent(comp.id, e.target.value)}
                      style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px dashed var(--border)', color: 'var(--text-h)', fontSize: '36px', fontWeight: '500', fontFamily: 'var(--heading)', padding: '4px 0', outline: 'none' }}
                    />
                  );
                }
                
                if (comp.type === 'text') {
                  return (
                    <textarea 
                      key={comp.id} 
                      value={comp.content} 
                      onChange={(e) => updateTextContent(comp.id, e.target.value)}
                      style={{ width: '100%', background: 'var(--code-bg)', border: 'none', borderLeft: '4px solid var(--accent)', color: 'var(--text)', padding: '12px', fontSize: '15px', fontFamily: 'var(--sans)', outline: 'none', resize: 'none', height: '70px', boxSizing: 'border-box' }}
                    />
                  );
                }

                if (comp.type === 'audio_player') {
                  return (
                    <div key={comp.id} style={{ padding: '16px', background: 'var(--code-bg)', border: '1px solid var(--accent-border)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ fontSize: '24px' }}>💿</span>
                      <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '16px', margin: 0, color: 'var(--text-h)' }}>{comp.title}</h2>
                        <span className="counter" style={{ fontSize: '12px', color: 'var(--accent)', background: 'var(--accent-bg)', padding: '2px 6px', marginTop: '4px' }}>
                          0:00 / 3:45 — Live Audio Stream
                        </span>
                      </div>
                    </div>
                  );
                }

                if (comp.type === 'checkout_button') {
                  return (
                    <div key={comp.id} style={{ padding: '20px', background: 'var(--accent-bg)', border: '2px dashed var(--accent)', borderRadius: '8px', textAlign: 'center' }}>
                      <p style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--accent)', margin: '0 0 10px' }}>
                        BUSINESSSTUDIO SECURE CHECKOUT ESCROW
                      </p>
                      <button type="button" className="counter" style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Pay Securely ($20.00)
                      </button>
                      <p style={{ fontSize: '11px', color: 'var(--text)', marginTop: '8px' }}>
                        *5% ($1.00) automatically split to BusinessStudio platform revenue.
                      </p>
                    </div>
                  );
                }
// Replace 'http://127.0.0.1:5000/api/save-layout' with this:
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000';

const response = await fetch(`${backendUrl}/api/save-layout`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(currentPayload)
});
                return null;
              })}
            </div>
          </div>
        </section>
      )}

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App;