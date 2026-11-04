'use client';
import { useEffect, useRef, useState } from 'react';
import { Icon, Shell, Stepper } from './ui';
import { COL, fd, rp } from '@/lib/pricing';
import { downloadInvoicePng, qrOf } from '@/lib/invoicePng';
import type { App } from '@/lib/useApp';

export function InvoiceView({ app }: { app: App }) {
  const o = app.inv, qr = useRef<HTMLDivElement>(null), [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!qr.current || !o) return;
    try {
      qr.current.innerHTML = qrOf(o).createSvgTag({ cellSize: 3, margin: 0, scalable: true });
      const s = qr.current.querySelector('svg'); if (s) s.style.cssText = 'width:100%;height:100%;stroke:none;fill:none;display:block;shape-rendering:crispEdges';
    } catch { qr.current.textContent = 'QR'; }
  }, [o]);
  if (!o) return null;
  const save = async () => {
    setSaving(true);
    try { await downloadInvoicePng(o); } catch { alert('Gagal menyimpan invoice. Coba lagi.'); }
    setSaving(false);
  };
  return (
    <Shell app={app}>
      <Stepper n={5} />
      <p className="eb">Pesanan selesai</p>
      <h1>Cetakanmu siap diambil.</h1>
      <p className="sub">Simpan invoice ini sebagai bukti untuk mengambil pesanan di percetakan.</p>
      <div className="cols inv"><div>
      <div className="card ip" id="inv" style={{ padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><b>🧾 INVOICE PESANAN ANDA</b><span style={{ color: 'var(--okt)', fontSize: 22 }}><Icon n="cc" /></span></div>
        <div style={{ margin: '14px 0 6px', color: 'var(--mut)' }}>Nomor Invoice:</div>
        <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-.3px' }}>{o.no}</div>
        <div className="row" style={{ marginTop: 6 }}><span>Nama Pemesan:</span><b>{o.name}</b></div>
        <div className="row"><span>Tanggal:</span><b>{fd(o.t)}</b></div>
        <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '10px 0' }} />
        {o.items.map((f, i) => (
          <div key={i}>
            <div className="n" style={{ display: 'flex', gap: 8, alignItems: 'center', fontWeight: 600, marginTop: 8 }}><span style={{ color: 'var(--pri)' }}><Icon n="file" /></span>{i + 1}. {f.name}</div>
            <div className="row"><span>Pengaturan:</span><b>{COL[f.color]}</b></div>
            <div className="row"><span>Total Halaman:</span><b>{f.pages}</b></div>
            <div className="row"><span>Salinan:</span><b>{f.copies}</b></div>
            <div className="row"><span>Biaya:</span><b>{rp(f.cost)}</b></div>
          </div>
        ))}
        <div className="tot" style={{ marginBottom: 14 }}><span>TOTAL BIAYA:</span><b>{rp(o.total)}</b></div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
          <div ref={qr} style={{ width: 252, height: 252, maxWidth: '100%', aspectRatio: '1', border: '1px solid var(--line)', borderRadius: 14, padding: 14, background: '#fff' }} />
          <div><b>QR verifikasi</b><p style={{ margin: '4px 0 0', color: 'var(--mut)', fontSize: 12 }}>Gunakan QR ini di Loket ruangan Teaching Factory (TEFA) untuk mengkonfirmasi pesanan print</p></div>
        </div>
        <p className="hint" style={{ margin: '14px 0 0' }}>Terima kasih sudah mencetak bersama PrinPrinan.</p>
      </div>
      </div><div className="sk">
      <div className={'note noprint ' + (o.req === 'failed' ? 'w' : 'i')}>
        <Icon n={o.req === 'failed' ? 'info' : 'check'} />
        <div>
          <b style={{ fontWeight: 500 }}>{o.req === 'failed' ? 'Pesanan belum terkirim ke sistem cetak' : `Pesanan terkirim ke sistem cetak${o.sim ? ' (simulasi)' : ''}`}</b>
          <span style={{ color: o.req === 'failed' ? 'inherit' : 'var(--mut)' }}>
            {o.req === 'failed' ? 'Invoice tetap tersimpan. Coba kirim ulang.' : o.ticket ? `Tiket ${o.ticket}` : 'Jangan lupa simpan invoice dan tunjukkan ke petugas.'}
          </span>
        </div>
      </div>
      {o.req === 'failed' && <button className="btn noprint" disabled={app.busy} onClick={app.resend}>{app.busy ? 'Mengirim…' : 'Kirim ulang pesanan'}</button>}
      <button className="btn p noprint" disabled={saving} onClick={save}><Icon n="dl" />{saving ? 'Menyimpan…' : 'Simpan invoice (PNG)'}</button>
      <button className="btn l noprint" onClick={() => app.go('hist')}>Lihat riwayat pesanan</button>
      </div></div>
    </Shell>
  );
}
