'use client';
import { ColorPick, Icon, Shell, Stepper } from './ui';
import { COL, sz, summ } from '@/lib/pricing';
import type { App } from '@/lib/useApp';

export function ListView({ app }: { app: App }) {
  const { files, g } = app;
  const ed = files.filter(f => f.edit).length, pg = files.reduce((a, f) => a + f.pages, 0);
  return (
    <Shell app={app}>
      <Stepper n={2} />
      <p className="eb">Draft batch · belum dipesan</p>
      <h1>Atur setiap lampiran</h1>
      <p className="sub">{files.length} file berhasil diunggah. Pilih satu mode warna untuk setiap file.</p>
      <div className="note i" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 10 }}><Icon n="sl" />
          <div><b>Pengaturan umum aktif</b><small style={{ color: 'var(--mut)' }}>{COL[g.color]} · {g.copies} salinan · {g.orient}</small></div></div>
        <button className="hl" onClick={() => app.go('upload')}>Ubah</button>
      </div>
      <button className="hl" style={{ marginBottom: 14 }} onClick={app.applyAll}><Icon n="cc" />Terapkan pengaturan umum ke semua file</button>
      <div className="fgrid">
      {files.map(f => (
        <div className="card" key={f.id}>
          <div className="fh">
            <div className="fi"><Icon n="file" /></div>
            <div style={{ flex: 1 }}><div className="n">{f.name}</div><small>{f.pages} halaman · {sz(f.size)}</small></div>
            <button className="ib" style={{ color: 'var(--mut)' }} onClick={() => app.delFile(f.id)} aria-label="Hapus"><Icon n="trash" /></button>
          </div>
          <div style={{ marginTop: 12 }}><ColorPick app={app} id={f.id} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--mut)', marginBottom: 10 }}>
            <span>{summ(f, g)}</span><b style={{ color: 'var(--pri)' }}>{Object.keys(f.ov).length ? 'Personal' : 'Umum'}</b>
          </div>
          <button className="ib" style={{ fontSize: 14, gap: 8 }} onClick={() => app.patchFile(f.id, { edit: !f.edit })}>
            <span className={'cb' + (f.edit ? ' on' : '')}>{f.edit && <Icon n="check" />}</span>Perlu diedit admin
            {f.edit && <span className="tag" style={{ color: 'var(--wtx)', background: 'none', border: 0 }}>Ditandai</span>}
          </button>
          <button className="lnk" onClick={() => app.openDetail(f.id)}>Personalisasi file <Icon n="ext" /></button>
        </div>
      ))}
      </div>
      <div className="cols"><div>
      <button className="btn l" style={{ borderStyle: 'solid' }} onClick={app.pick}><Icon n="plus" />Tambah file lain</button>
      <div className="note w"><Icon n="info" /><div><b style={{ fontWeight: 500 }}>Biaya edit admin</b>Rp500 per 10 halaman yang diedit. Kurang dari 10 halaman gratis.</div></div>
      </div><div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--mut)', marginBottom: 12 }}>
        <span>{files.length} file · {pg} halaman sumber</span><b style={{ color: 'var(--wtx)' }}>{ed} file perlu edit</b>
      </div>
      <button className="btn p" disabled={!files.length} onClick={() => { app.movePv(-app.pv, 1); app.go('prev'); }}><Icon n="arr" />Lihat pratinjau cetak</button>
      </div></div>
    </Shell>
  );
}
