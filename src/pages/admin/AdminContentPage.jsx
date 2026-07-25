import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useStore } from '../../context/StoreContext.jsx';
import CategoriesManager from './CategoriesManager.jsx';

const TABS = ['Hero', 'Top bar', 'Footer', 'Categories'];

export default function AdminContentPage() {
  const { content, setSection } = useStore();
  const [tab, setTab] = useState('Hero');

  const [hero, setHero] = useState(content.hero);
  const [topbar, setTopbar] = useState(content.topbar);
  const [footer, setFooter] = useState(content.footer);
  const [savedTab, setSavedTab] = useState(null);

  useEffect(() => { setHero(content.hero); setTopbar(content.topbar); setFooter(content.footer); }, [content]);

  const flash = t => { setSavedTab(t); setTimeout(() => setSavedTab(null), 1800); };
  const saveHero = async () => { await setSection('hero', hero); flash('Hero'); };
  const saveTopbar = async () => { await setSection('topbar', topbar); flash('Top bar'); };
  const saveFooter = async () => { await setSection('footer', footer); flash('Footer'); };

  const heroImgs = hero.images || ['', '', ''];
  const setHeroImg = (i, v) => { const next = [...heroImgs]; next[i] = v; setHero({ ...hero, images: next }); };

  return (
    <>
      <div className="ge-admhead">
        <div><h1>Site content</h1><p>Edit banners, menus, and page text</p></div>
      </div>

      <div className="ge-tabbar">
        {TABS.map(t => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}
      </div>

      {tab === 'Hero' && (
        <div className="ge-panel">
          <h3>Hero section</h3>
          <div className="ge-field"><label>Small label (eyebrow)</label><input value={hero.eyebrow} onChange={e => setHero({ ...hero, eyebrow: e.target.value })} /></div>
          <div className="ge-field"><label>Headline</label><input value={hero.title} onChange={e => setHero({ ...hero, title: e.target.value })} /></div>
          <div className="ge-field"><label>Subtext</label><input value={hero.subtitle} onChange={e => setHero({ ...hero, subtitle: e.target.value })} /></div>
          <div className="ge-field"><label>Button text</label><input value={hero.cta} onChange={e => setHero({ ...hero, cta: e.target.value })} placeholder="Leave blank to hide the button" /></div>
          <div className="ge-field">
            <label>Background images (up to 3 — they auto-rotate)</label>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ marginBottom: 10 }}>
                <input value={heroImgs[i] || ''} onChange={e => setHeroImg(i, e.target.value)} placeholder={`Image ${i + 1} URL…`} />
                <div className="ge-editrow">
                  <label className="ge-upload"><Upload size={13} /> Upload from device
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files && e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => setHeroImg(i, r.result); r.readAsDataURL(f); }} />
                  </label>
                  {heroImgs[i] && <button className="ge-clear" onClick={() => setHeroImg(i, '')}>Remove image</button>}
                </div>
              </div>
            ))}
            <div className="ge-note">A green overlay keeps your text readable on top of the photos.</div>
          </div>
          <button className="ge-primary" style={{ maxWidth: 200 }} onClick={saveHero}>{savedTab === 'Hero' ? 'Saved ✓' : 'Save hero'}</button>
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
          <button className="ge-primary" style={{ maxWidth: 200 }} onClick={saveFooter}>{savedTab === 'Footer' ? 'Saved ✓' : 'Save footer'}</button>
        </div>
      )}

      {tab === 'Categories' && <CategoriesManager />}
    </>
  );
}
