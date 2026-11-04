'use client';
import { Icon, Shell, Stepper } from './ui';
import { COL, cnt, cost, editCost, eff, rp, total } from '@/lib/pricing';
import type { App } from '@/lib/useApp';

export function PreviewView({ app }: { app: App }) {
  const { files, g, name } = app;
  const L = files.flatMap(f => Array.from({ length: Math.min(cnt(f, eff(f, g)), f.pages) }, (_, i) => [f, i + 1] as const));
  const i = Math.min(app.pv, L.length - 1);
  if (!L.length) return null;
  const [f, p] = L[i], e = eff(f, g);
  return (
    <Shell app={app}>
      <Stepper n={3} />
      <p className="eb">Periksa sebelum cetak</p>
      <h1>Pratinjau cetak</h1>
      <p className="sub">Periksa dokumen dan setelan cetak sebelum melanjutkan ke invoice.</p>
      <div className="cols"><div className="sk">
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="fh" style={{ padding: 16 }}>
          <div className="fi"><Icon n="file" /></div>
          <div style={{ flex: 1 }}><div className="n">{f.name}</div><small>{f.pages} halaman · {f.ext}</small></div>
          <small style={{ fontWeight: 600 }}>{e.orient}</small>
        </div>
        <div className="pv" style={{ margin: 0 }}>
          <div className="pg">{f.thumb ? <img src={f.thumb} alt="" /> : <div style={{ padding: 10, textAlign: 'left', width: '100%' }}><b style={{ color: '#334' }}>{f.name}</b><br />Halaman {p}</div>}</div>
          <small style={{ color: 'var(--mut)' }}>Contoh pratinjau</small>
        </div>
        <div className="pgr" style={{ padding: '12px 16px' }}>
          <button onClick={() => app.movePv(-1, L.length)} aria-label="Sebelumnya"><Icon n="l" /></button>
          Halaman {i + 1} dari {L.length}
          <button onClick={() => app.movePv(1, L.length)} aria-label="Berikutnya"><Icon n="r" /></button>
        </div>
      </div>
      </div><div>
      <div className="card">
        <h3 style={{ marginBottom: 8 }}>Ringkasan cetak</h3>
        <div className="row"><span>Nama pemesan</span><b>{name || 'Tanpa nama'}</b></div>
        {files.map(x => {
          const ex = eff(x, g), n = cnt(x, ex);
          return (
            <div key={x.id} style={{ borderTop: '1px solid var(--line)', marginTop: 6, paddingTop: 6 }}>
              <div className="n" style={{ fontWeight: 600, fontSize: 13 }}>{x.name}</div>
              <div className="row"><span>Warna cetak</span><b>{COL[ex.color]}</b></div>
              <div className="row"><span>Halaman & salinan</span><b>{n} halaman × {ex.copies} salinan</b></div>
              <div className="row"><span>Orientasi</span><b>{ex.orient}</b></div>
              <div className="row"><span>Edit admin</span><b>{x.edit ? rp(editCost(x, g)) : 'Tidak diperlukan'}</b></div>
              <div className="row"><span>Biaya</span><b>{rp(cost(x, g))}</b></div>
            </div>
          );
        })}
        <div className="tot"><span>TOTAL BIAYA</span><b>{rp(total(files, g))}</b></div>
      </div>
      <p className="sub" style={{ fontSize: 13 }}>Sudah sesuai? Konfirmasi pesanan untuk melanjutkan ke invoice.</p>
      <button className="btn p" disabled={app.busy} onClick={app.confirm}>{app.busy ? 'Mengirim pesanan…' : <>Konfirmasi & lanjut invoice <Icon n="arr" /></>}</button>
      <button className="btn" style={{ color: 'var(--pri)' }} onClick={() => app.go('list')}><Icon n="back" />Kembali ubah pengaturan</button>
      </div></div>
    </Shell>
  );
}
