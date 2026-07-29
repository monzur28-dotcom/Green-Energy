import React, { useState, useEffect } from 'react';
import { Upload, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import { blankHeroSlide } from '../../data.js';
import CategoriesManager from './CategoriesManager.jsx';
import ConcernsManager from './ConcernsManager.jsx';
import BrandsManager from './BrandsManager.jsx';

const blankFaqItem = () => ({ question: 'New question', answer: '' });

const TABS = ['Brand & Nav', 'Hero', 'Homepage', 'Top bar', 'Footer', 'FAQ', 'Categories', 'Concerns', 'Brands'];

export default function AdminContentPage() {
  const { content, setSection } = useStore();
  const [tab, setTab] = useState('Brand & Nav');

  const [brand, setBrand] = useState(content.brand);
  const [nav, setNav] = useState(content.nav);
  const [search, setSearch] = useState(content.search);
  const [hero, setHero] = useState(content.hero);
  const [homepage, setHomepage] = useState(content.homepage);
  const [topbar, setTopbar] = useState(content.topbar);
  const [footer, setFooter] = useState(content.footer);
  const [faq, setFaq] = useState(content.faq);
  const [savedTab, setSavedTab] = useState(null);

  useEffect(() => {
    setBrand(content.brand); setNav(content.nav); setSearch(content.search);
    setHero(content.hero); setHomepage(content.homepage);
    setTopbar(content.topbar); setFooter(content.footer); setFaq(content.faq);
  }, [content]);

  const flash = t => { setSavedTab(t); setTimeout(() => setSavedTab(null), 1800); };
  const saveBrandNav = async () => { await setSection('brand', brand); await setSection('nav', nav); await setSection('search', search); flash('Brand & Nav'); };
  const saveHero = async () => { await setSection('hero', hero); flash('Hero'); };
  const saveHomepage = async () => { await setSection('homepage', homepage); flash('Homepage'); };
  const saveTopbar = async () => { await setSection('topbar', topbar); flash('Top bar'); };
  const saveFooter = async () => { await setSection('footer', footer); flash('Footer'); };
  const saveFaq = async () => { await setSection('faq', faq); flash('FAQ'); };

  const faqItems = faq.items || [];
  const updateFaqItem = (i, patch) => { const next = [...faqItems]; next[i] = { ...next[i], ...patch }; setFaq({ ...faq, items: next }); };
  const addFaqItem = () => setFaq({ ...faq, items: [...faqItems, blankFaqItem()] });
  const removeFaqItem = i => setFaq({ ...faq, items: faqItems.filter((_, idx) => idx !== i) });

  const heroSlides = hero.slides || [];
  const updateSlide = (i, patch) => { const next = [...heroSlides]; next[i] = { ...next[i], ...patch }; setHero({ ...hero, slides: next }); };
  const addSlide = () => setHero({ ...hero, slides: [...heroSlides, blankHeroSlide()] });
  const removeSlide = i => { if (heroSlides.length <= 1) return; setHero({ ...hero, slides: heroSlides.filter((_, idx) => idx !== i) }); };

  const badges = homepage.trustBadges || [];
  const setBadge = (i, patch) => { const next = [...badges]; next[i] = { ...next[i], ...patch }; setHomepage({ ...homepage, trustBadges: next }); };

  return (
    <>
      <div className="ge-admhead">
        <div><h1>Site content</h1><p>Edit banners, menus, and page text</p></div>
      </div>

      <div className="ge-tabbar">
        {TABS.map(t => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}
      </div>

      {tab === 'Brand & Nav' && (
        <div className="ge-panel">
          <h3>Brand identity</h3>
          <div className="ge-2col">
            <div className="ge-field"><label>Store name</label><input value={brand.name} onChange={e => setBrand({ ...brand, name: e.target.value })} /></div>
            <div className="ge-field"><label>Tagline</label><input value={brand.tagline} onChange={e => setBrand({ ...brand, tagline: e.target.value })} /></div>
          </div>

          <h3 style={{ marginTop: 22 }}>Navigation labels</h3>
          <div className="ge-2col">
            <div className="ge-field"><label>"Home" link text</label><input value={nav.home} onChange={e => setNav({ ...nav, home: e.target.value })} /></div>
            <div className="ge-field"><label>"Shop" link text</label><input value={nav.shop} onChange={e => setNav({ ...nav, shop: e.target.value })} /></div>
          </div>
          <div className="ge-field" style={{ maxWidth: 260 }}><label>"Track Order" link text</label><input value={nav.trackOrder} onChange={e => setNav({ ...nav, trackOrder: e.target.value })} /></div>

          <h3 style={{ marginTop: 22 }}>Search bar</h3>
          <div className="ge-field"><label>Placeholder text</label><input value={search.placeholder} onChange={e => setSearch({ ...search, placeholder: e.target.value })} /></div>

          <button className="ge-primary" style={{ maxWidth: 200 }} onClick={saveBrandNav}>{savedTab === 'Brand & Nav' ? 'Saved ✓' : 'Save changes'}</button>
        </div>
      )}

      {tab === 'Hero' && (
        <div className="ge-panel">
          <h3>Hero posters</h3>
          <div className="ge-note" style={{ marginBottom: 18 }}>
            Each poster has its own photo and its own headline — they auto-rotate every few seconds. Add as many as you like, there's no fixed limit.
            Pasting an image URL is more reliable than uploading, especially once you have several posters — uploaded photos are embedded directly in the save, and many/large uploads can exceed the server's request size limit.
          </div>

          {heroSlides.map((slide, i) => (
            <div key={i} style={{ border: '1px solid var(--line)', borderRadius: 14, padding: 16, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <b style={{ fontFamily: "'Outfit',sans-serif" }}>Poster {i + 1}</b>
                <button className="ge-tblbtn danger" onClick={() => removeSlide(i)} disabled={heroSlides.length <= 1}><Trash2 size={12} /> Remove</button>
              </div>
              <div className="ge-field">
                <label>Photo</label>
                <input value={slide.image || ''} onChange={e => updateSlide(i, { image: e.target.value })} placeholder="Paste an image URL…" />
                <div className="ge-editrow">
                  <label className="ge-upload"><Upload size={13} /> Upload from device
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files && e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => updateSlide(i, { image: r.result }); r.readAsDataURL(f); }} />
                  </label>
                  {slide.image && <button className="ge-clear" onClick={() => updateSlide(i, { image: '' })}>Remove photo</button>}
                </div>
              </div>
              <div className="ge-field"><label>Small label (eyebrow)</label><input value={slide.eyebrow} onChange={e => updateSlide(i, { eyebrow: e.target.value })} /></div>
              <div className="ge-field"><label>Headline</label><input value={slide.title} onChange={e => updateSlide(i, { title: e.target.value })} /></div>
              <div className="ge-field"><label>Subtext</label><input value={slide.subtitle} onChange={e => updateSlide(i, { subtitle: e.target.value })} /></div>
              <div className="ge-field" style={{ marginBottom: 0 }}><label>Button text</label><input value={slide.cta} onChange={e => updateSlide(i, { cta: e.target.value })} placeholder="Leave blank to hide the button" /></div>
            </div>
          ))}

          <button className="ge-addtile" style={{ minHeight: 70, marginBottom: 22 }} onClick={addSlide}><Plus size={20} /><span>Add poster</span></button>

          <div className="ge-field" style={{ maxWidth: 380 }}>
            <label>Overlay darkness — {Math.round((hero.overlayOpacity ?? 0.7) * 100)}%</label>
            <input
              type="range" min="0" max="1" step="0.05"
              value={hero.overlayOpacity ?? 0.7}
              onChange={e => setHero({ ...hero, overlayOpacity: Number(e.target.value) })}
              style={{ width: '100%', accentColor: 'var(--green)' }}
            />
            <div className="ge-note">A green overlay keeps your text readable on top of the photos. Lower this to let the photos show through more clearly; raise it if the text gets hard to read.</div>
          </div>

          <button className="ge-primary" style={{ maxWidth: 200 }} onClick={saveHero}>{savedTab === 'Hero' ? 'Saved ✓' : 'Save all posters'}</button>
        </div>
      )}

      {tab === 'Homepage' && (
        <div className="ge-panel">
          <h3>Shop-by-concern label</h3>
          <div className="ge-field" style={{ maxWidth: 320 }}><input value={homepage.concernLabel} onChange={e => setHomepage({ ...homepage, concernLabel: e.target.value })} /></div>

          <h3 style={{ marginTop: 22 }}>Trust badges (the 4 icons under the hero)</h3>
          {badges.map((b, i) => (
            <div className="ge-2col" key={i} style={{ marginBottom: 10 }}>
              <div className="ge-field" style={{ marginBottom: 0 }}><label>Badge {i + 1} title</label><input value={b.title} onChange={e => setBadge(i, { title: e.target.value })} /></div>
              <div className="ge-field" style={{ marginBottom: 0 }}><label>Badge {i + 1} subtitle</label><input value={b.subtitle} onChange={e => setBadge(i, { subtitle: e.target.value })} /></div>
            </div>
          ))}

          <h3 style={{ marginTop: 22 }}>Top brands section</h3>
          <div className="ge-2col">
            <div className="ge-field"><label>Heading</label><input value={homepage.brandsHeading} onChange={e => setHomepage({ ...homepage, brandsHeading: e.target.value })} /></div>
            <div className="ge-field"><label>Subheading</label><input value={homepage.brandsSubheading} onChange={e => setHomepage({ ...homepage, brandsSubheading: e.target.value })} /></div>
          </div>

          <button className="ge-primary" style={{ maxWidth: 200 }} onClick={saveHomepage}>{savedTab === 'Homepage' ? 'Saved ✓' : 'Save changes'}</button>
        </div>
      )}

      {tab === 'Top bar' && (
        <div className="ge-panel">
          <h3>Top announcement bar</h3>
          <div className="ge-field"><label>Promo message (left)</label><input value={topbar.promo} onChange={e => setTopbar({ ...topbar, promo: e.target.value })} /></div>
          <div className="ge-field"><label>Hotline (right)</label><input value={topbar.hotline} onChange={e => setTopbar({ ...topbar, hotline: e.target.value })} /></div>
          <button className="ge-primary" style={{ maxWidth: 200 }} onClick={saveTopbar}>{savedTab === 'Top bar' ? 'Saved ✓' : 'Save top bar'}</button>
        </div>
      )}

      {tab === 'Footer' && (
        <div className="ge-panel">
          <h3>Footer</h3>
          <div className="ge-field"><label>About blurb</label><input value={footer.blurb} onChange={e => setFooter({ ...footer, blurb: e.target.value })} /></div>
          <div className="ge-field"><label>Address</label><input value={footer.address} onChange={e => setFooter({ ...footer, address: e.target.value })} /></div>
          <div className="ge-2col">
            <div className="ge-field"><label>Phone</label><input value={footer.phone} onChange={e => setFooter({ ...footer, phone: e.target.value })} /></div>
            <div className="ge-field"><label>Email</label><input value={footer.email} onChange={e => setFooter({ ...footer, email: e.target.value })} /></div>
          </div>
          <div className="ge-field"><label>Opening hours</label><input value={footer.hours} onChange={e => setFooter({ ...footer, hours: e.target.value })} /></div>
          <div className="ge-2col">
            <div className="ge-field"><label>Facebook URL</label><input value={footer.facebook} onChange={e => setFooter({ ...footer, facebook: e.target.value })} /></div>
            <div className="ge-field"><label>Instagram URL</label><input value={footer.instagram} onChange={e => setFooter({ ...footer, instagram: e.target.value })} /></div>
          </div>
          <div className="ge-field"><label>YouTube URL</label><input value={footer.youtube} onChange={e => setFooter({ ...footer, youtube: e.target.value })} /></div>

          <h3 style={{ marginTop: 22 }}>Column headings</h3>
          <div className="ge-2col">
            <div className="ge-field"><label>Shop column</label><input value={footer.shopHeading} onChange={e => setFooter({ ...footer, shopHeading: e.target.value })} /></div>
            <div className="ge-field"><label>Help column</label><input value={footer.helpHeading} onChange={e => setFooter({ ...footer, helpHeading: e.target.value })} /></div>
          </div>
          <div className="ge-field" style={{ maxWidth: 260 }}><label>Contact column</label><input value={footer.contactHeading} onChange={e => setFooter({ ...footer, contactHeading: e.target.value })} /></div>

          <h3 style={{ marginTop: 22 }}>Copyright line</h3>
          <div className="ge-field"><label>Text after "© {new Date().getFullYear()}"</label><input value={footer.copyrightText} onChange={e => setFooter({ ...footer, copyrightText: e.target.value })} /></div>

          <button className="ge-primary" style={{ maxWidth: 200 }} onClick={saveFooter}>{savedTab === 'Footer' ? 'Saved ✓' : 'Save footer'}</button>
        </div>
      )}

      {tab === 'FAQ' && (
        <div className="ge-panel">
          <h3>Frequently asked questions</h3>
          <div className="ge-note" style={{ marginBottom: 18 }}>Shown on the /faq page, linked from the footer. Add as many as you like.</div>

          {faqItems.map((item, i) => (
            <div key={i} style={{ border: '1px solid var(--line)', borderRadius: 14, padding: 16, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <b style={{ fontFamily: "'Outfit',sans-serif" }}>Question {i + 1}</b>
                <button className="ge-tblbtn danger" onClick={() => removeFaqItem(i)}><Trash2 size={12} /> Remove</button>
              </div>
              <div className="ge-field"><label>Question</label><input value={item.question} onChange={e => updateFaqItem(i, { question: e.target.value })} /></div>
              <div className="ge-field" style={{ marginBottom: 0 }}><label>Answer</label><textarea rows={3} value={item.answer} onChange={e => updateFaqItem(i, { answer: e.target.value })} /></div>
            </div>
          ))}

          <button className="ge-addtile" style={{ minHeight: 70, marginBottom: 22 }} onClick={addFaqItem}><Plus size={20} /><span>Add question</span></button>

          <button className="ge-primary" style={{ maxWidth: 200 }} onClick={saveFaq}>{savedTab === 'FAQ' ? 'Saved ✓' : 'Save FAQ'}</button>
        </div>
      )}

      {tab === 'Categories' && <CategoriesManager />}
      {tab === 'Concerns' && <ConcernsManager />}
      {tab === 'Brands' && <BrandsManager />}
    </>
  );
}
