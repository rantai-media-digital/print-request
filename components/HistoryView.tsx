'use client';
import { Icon, Shell } from './ui';
import { COL, fd, rp } from '@/lib/pricing';
import type { App } from '@/lib/useApp';

export function HistoryView({ app }: { app: App }) {
  const H = app.hist;
  return (
    <Shell app={app} root>
      <p className="eb">Tanpa login</p>
      <h1>Riwayat cetak,<br />selalu dekat.</h1>
      <p className="sub">Buka kembali invoice pesanan dari browser yang sama, tanpa membuat akun.</p>
      <div className="note i"><span style={{ fontSize: 20 }}><Icon n="print" /></span>
        <div><b>Tersimpan di browser ini</b><span style={{ color: 'var(--mut)' }}>Riwayat disimpan secara lokal di memori browser, bukan di akun. Riwayat dapat hilang jika data browser dihapus.</span></div></div>
      <div className="hist" style={{ marginTop: 20 }}><h3 style={{ fontSize: 18, color: 'var(--ink)', margin: 0 }}>Pesanan tersimpan</h3><span>{H.length} pesanan</span></div>
      {H.length ? <div className="hgrid">{H.map((o, i) => (
        <div className="card" key={o.no}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span className="ok"><Icon n="cc" />{o.req === 'failed' ? 'Belum terkirim' : 'Selesai'}</span><small style={{ color: 'var(--mut)' }}>{fd(o.t)}</small>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{o.no}</div>
          <div style={{ color: 'var(--mut)', marginBottom: 10 }}>{o.name}</div>
          {o.items.map((f, j) => (
            <div className="fh" key={j} style={{ marginBottom: 8 }}>
              <div className="fi" style={{ background: 'var(--bg)' }}><Icon n="file" /></div>
              <div><div className="n">{f.name}</div><small>{COL[f.color]} · {f.pages} halaman · {f.copies} salinan</small></div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '10px 0' }}><span style={{ color: 'var(--mut)' }}>Total biaya</span><b style={{ fontSize: 20, fontWeight: 500 }}>{rp(o.total)}</b></div>
          <button className="btn" onClick={() => app.openInv(i)} style={{ color: 'var(--pri)', margin: 0 }}><Icon n="file" />Buka invoice</button>
        </div>
      ))}</div> : <div className="card" style={{ textAlign: 'center', color: 'var(--mut)' }}>Belum ada pesanan. Buat pesanan pertamamu sekarang.</div>}
      <button className="btn p" style={{ marginTop: 16 }} onClick={app.reset}><Icon n="plus" />Buat pesanan baru</button>
    </Shell>
  );
}
