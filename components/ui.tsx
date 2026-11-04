'use client';
import { Fragment, type ReactNode } from 'react';
import { P } from '@/lib/icons';
import { COL, eff } from '@/lib/pricing';
import type { App } from '@/lib/useApp';
import type { Color } from '@/lib/types';

export const Icon = ({ n }: { n: string }) => <svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: P[n] }} />;

export function Shell({ app, root, children }: { app: App; root?: boolean; children: ReactNode }) {
  const h = app.view === 'hist';
  return (
    <>
      <header>
        <div className="hi">
          {root ? <div className="logo"><i><Icon n="print" /></i>Prin<b>Prinan</b></div>
            : <button className="ib" onClick={app.back} aria-label="Kembali"><Icon n="back" /><span className="logo">Prin<b>Prinan</b></span></button>}
          <div className="hn">
            <button className={'hl dk' + (h ? '' : ' on')} onClick={app.reset}><Icon n="pl" />Pesanan baru</button>
            <button className={'hl' + (h ? ' on' : '')} onClick={() => app.go('hist')}><Icon n="hist" />Riwayat</button>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <nav className="nav noprint">
        <button className={h ? '' : 'on'} onClick={app.reset}><Icon n="pl" />Pesanan baru</button>
        <button className={h ? 'on' : ''} onClick={() => app.go('hist')}><Icon n="hist" />Riwayat</button>
      </nav>
    </>
  );
}

export function Stepper({ n }: { n: number }) {
  return (
    <div className="steps">
      {['Unggah', 'Atur file', 'Preview', 'Invoice'].map((t, i) => (
        <Fragment key={t}>
          {i > 0 && <hr />}
          <span className={i + 1 < n ? 'd' : i + 1 === n ? 'c' : ''}><em>{i + 1 < n ? <Icon n="check" /> : i + 1}</em>{t}</span>
        </Fragment>
      ))}
    </div>
  );
}

export function ColorPick({ app, id }: { app: App; id?: number }) {
  const f = id == null ? null : app.files.find(x => x.id === id)!;
  const e = f ? eff(f, app.g) : app.g;
  return (
    <div className="g2" style={{ marginBottom: 10 }}>
      {(['bw', 'c'] as Color[]).map(c => (
        <button key={c} className={'opt' + (e.color === c ? ' on' : '')}
          onClick={() => (id == null ? app.setG({ ...app.g, color: c }) : app.setOv(id, 'color', c))}>
          <span className="cb">{e.color === c && <Icon n="check" />}</span>{COL[c]}
          {f && c === 'bw' && <span className="tag">Umum</span>}
          {f && f.ov.color === c && c !== app.g.color && <span className="tag o">Override</span>}
        </button>
      ))}
    </div>
  );
}

export const Sel = ({ v, o, on, dis }: { v: string | number; o: (string | number)[]; on: (v: string) => void; dis?: boolean }) => (
  <select value={v} disabled={dis} onChange={e => on(e.target.value)}>{o.map(x => <option key={x}>{x}</option>)}</select>
);
