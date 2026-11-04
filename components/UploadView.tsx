'use client';
import { useState } from 'react';
import { ColorPick, Icon, Sel, Shell, Stepper, Thumb } from './ui';
import { OPT, meta } from '@/lib/pricing';
import type { App } from '@/lib/useApp';

export function UploadView({ app }: { app: App }) {
  const { files, g, setG, name, setName } = app, n = files.length;
  const [dr, setDr] = useState(false);
  return (
    <Shell app={app} root>
      <Stepper n={1} />
      <p className="eb">Cetak tanpa ribet</p>
      <h1>Dari file,<br />jadi siap ambil.</h1>
      <p className="sub">Kirim dokumen, atur cetakan, lalu bawa invoice saat mengambil pesanan.</p>
      <div className="cols"><div>
      <div className={'drop' + (dr ? ' dr' : '')}
        onDragOver={e => { e.preventDefault(); setDr(true); }} onDragLeave={() => setDr(false)}
        onDrop={e => { e.preventDefault(); setDr(false); const l = [...e.dataTransfer.files].filter(f => /\.(pdf|docx?|jpe?g|png)$/i.test(f.name)); if (l.length) app.addFiles(l); }}>
        <div className="big"><Icon n="file" /></div>
        <h2>Satu file atau sekaligus banyak</h2><p>PDF, DOC, DOCX, JPG, PNG<span className="dkt"> · atau seret file ke sini</span></p>
        <button className="btn p" onClick={app.pick}><Icon n="up" />Pilih file dari perangkat</button>
        <p style={{ margin: 0 }}>{app.reading ? 'Membaca file…' : n ? 'Bisa tambah file lagi kapan saja.' : 'Pilih beberapa file untuk unggah batch.'}</p>
      </div>
      {n > 0 && (
        <div className="card ul">
          <div className="ulh"><h3>File terunggah</h3><span className="ok"><Icon n="check" />{n} file</span></div>
          {files.map(f => (
            <div className="fh ulr" key={f.id}>
              <Thumb f={f} lg />
              <div style={{ flex: 1 }}><div className="n">{f.name}</div><small>{meta(f)}</small></div>
              <button className="ib" style={{ color: 'var(--mut)' }} onClick={() => app.delFile(f.id)} aria-label={'Hapus ' + f.name}><Icon n="trash" /></button>
            </div>
          ))}
        </div>
      )}
      <label className="f">Nama pemesan</label>
      <input className="t" value={name} onChange={e => setName(e.target.value)} placeholder="Nama kamu" style={{ marginBottom: 20 }} />
      </div><div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18 }}><h3>Pengaturan umum</h3><Icon n="sl" /></div>
        <p className="sub" style={{ fontSize: 13, marginBottom: 12 }}>Berlaku untuk semua file. Pengaturan personal bisa diubah di tiap lampiran.</p>
        <ColorPick app={app} />
        <div className="g2">
          <div><label className="f">Salinan</label><Sel v={g.copies} o={OPT.copies} on={v => setG({ ...g, copies: +v })} /></div>
          <div><label className="f">Rentang halaman</label><Sel v="Semua halaman" o={['Semua halaman']} on={() => {}} dis /></div>
        </div>
        <label className="f">Orientasi</label>
        <Sel v={g.orient} o={OPT.orient} on={v => setG({ ...g, orient: v })} />
        <p style={{ color: 'var(--pri)', fontSize: 12, display: 'flex', gap: 6, alignItems: 'center', margin: '12px 0 0' }}><Icon n="cc" />Otomatis diterapkan ke semua file baru</p>
      </div>
      <button className="btn p" disabled={!n} onClick={() => app.go('list')}><Icon n="arr" />Lanjut ke daftar lampiran</button>
      <p className="hint">{n ? '' : 'Unggah file terlebih dahulu untuk melanjutkan.'}</p>
      </div></div>
    </Shell>
  );
}
