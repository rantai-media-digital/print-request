'use client';
import { ColorPick, Icon, Sel, Shell, Thumb } from './ui';
import { OPT, cnt, eff, editCost, meta, rp } from '@/lib/pricing';
import type { App } from '@/lib/useApp';

export function DetailView({ app }: { app: App }) {
  const f = app.files.find(x => x.id === app.cur);
  if (!f) return null;
  const { g, setOv } = app, e = eff(f, g), o = f.ov, all = e.range === 'all';
  const badge = (k: keyof typeof o) => (o[k] !== undefined ? <span className="tag o">Override</span> : <span className="tag">Umum</span>);
  return (
    <Shell app={app}>
      <p className="eb">Draft batch / personalisasi</p>
      <h1>Detail cetak file</h1>
      <p className="sub">Pengaturan ini hanya untuk file yang dipilih, bukan untuk seluruh lampiran.</p>
      <div className="cols"><div>
      <div className="card"><div className="fh"><Thumb f={f} /><div><div className="n">{f.name}</div><small>{meta(f)}</small></div></div></div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><h3>Pengaturan personal</h3><button className="hl" onClick={() => app.patchFile(f.id, { ov: {} })}>Ikuti umum</button></div>
        <label className="f" style={{ marginTop: 10 }}>Mode warna</label><ColorPick app={app} id={f.id} />
        <label className="f">Salinan</label>
        <div className="stepper">
          <button onClick={() => setOv(f.id, 'copies', Math.max(1, e.copies - 1))}><Icon n="minus" /></button><b>{e.copies}</b>
          <button onClick={() => setOv(f.id, 'copies', Math.min(99, e.copies + 1))}><Icon n="plus" /></button>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}><span className="tag">Umum: {g.copies}</span>{o.copies !== undefined && <span className="tag o">Override</span>}</div>
        <label className="f">Rentang halaman</label>
        <select value={all ? 'all' : 'x'} onChange={ev => setOv(f.id, 'range', ev.target.value === 'all' ? 'all' : '1-1')}>
          <option value="all">Semua halaman (1–{f.pages})</option><option value="x">Halaman tertentu</option>
        </select>
        {!all && <input className="t" value={e.range} onChange={ev => setOv(f.id, 'range', ev.target.value.trim() || 'all')} placeholder="Contoh: 1-5, 8, 12" style={{ marginTop: 8 }} />}
        <p style={{ fontSize: 12, color: 'var(--mut)', margin: '6px 0 14px' }}>Untuk halaman tertentu, tulis misalnya 1–5, 8, 12.</p>
        <label className="f">Orientasi</label><Sel v={e.orient} o={OPT.orient} on={v => setOv(f.id, 'orient', v)} />
        <div style={{ marginTop: 6 }}>{badge('orient')}</div>
      </div>
      </div><div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><h3 style={{ fontSize: 16 }}>Perlu diedit admin</h3><small style={{ color: 'var(--mut)' }}>Tandai sebelum dokumen dicetak</small></div>
          <button onClick={() => app.patchFile(f.id, { edit: !f.edit })} aria-label="Edit admin"
            style={{ width: 46, height: 26, borderRadius: 99, border: 0, background: f.edit ? 'var(--pri)' : 'var(--line)', position: 'relative' }}>
            <i style={{ position: 'absolute', top: 3, [f.edit ? 'right' : 'left']: 3, width: 20, height: 20, borderRadius: '50%', background: '#fff' }} />
          </button>
        </div>
        {f.edit && (<>
          <label className="f" style={{ marginTop: 12 }}>Catatan untuk admin</label>
          <textarea rows={3} value={f.note} onChange={ev => app.patchFile(f.id, { note: ev.target.value })} placeholder="Tulis catatan edit" />
          <div className="note w" style={{ marginTop: 12 }}><Icon n="info" /><div><b style={{ fontWeight: 500 }}>Biaya edit admin</b>Rp500 per 10 halaman yang diedit. Kurang dari 10 halaman gratis.</div></div>
          <div className="row"><span>{cnt(f, e)} halaman diedit × Rp500 / 10</span><b>{rp(editCost(f, g))}</b></div>
        </>)}
      </div>
      <button className="btn p" onClick={() => app.go('list')}><Icon n="check" />Simpan pengaturan file</button>
      <p className="hint">Kembali ke {app.files.length} lampiran · file lain tidak berubah</p>
      </div></div>
    </Shell>
  );
}
