'use client';
import { useEffect, useRef, useState } from 'react';
import type { Order, PFile, Settings, View } from './types';
import { DEFAULTS, toItem, total } from './pricing';
import { sendPrintReq } from './printreq';

const KEY = 'pp_hist';

export function useApp() {
  const [view, setView] = useState<View>('upload');
  const [name, setName] = useState('');
  const [g, setG] = useState<Settings>(DEFAULTS);
  const [files, setFiles] = useState<PFile[]>([]);
  const [cur, setCur] = useState<number | null>(null);
  const [pv, setPv] = useState(0);
  const [inv, setInv] = useState<Order | null>(null);
  const [hist, setHist] = useState<Order[]>([]);
  const [busy, setBusy] = useState(false);
  const seq = useRef(0);

  useEffect(() => { try { setHist(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch {} }, []);
  const saveHist = (h: Order[]) => { setHist(h); try { localStorage.setItem(KEY, JSON.stringify(h)); } catch {} };

  const go = (v: View) => { setView(v); window.scrollTo(0, 0); };
  const back = () => go(({ list: 'upload', detail: 'list', prev: 'list', inv: 'hist' } as Record<string, View>)[view] || 'upload');
  const reset = () => { setFiles([]); setName(''); setG(DEFAULTS); go('upload'); };

  const patchFile = (id: number, p: Partial<PFile>) => setFiles(fs => fs.map(f => (f.id === id ? { ...f, ...p } : f)));
  const setOv = (id: number, k: keyof Settings, v: string | number) =>
    setFiles(fs => fs.map(f => {
      if (f.id !== id) return f;
      const ov: any = { ...f.ov };
      if (v === g[k]) delete ov[k]; else ov[k] = v;
      return { ...f, ov };
    }));
  const delFile = (id: number) => { const r = files.filter(f => f.id !== id); setFiles(r); if (!r.length) go('upload'); };
  const applyAll = () => setFiles(fs => fs.map(f => ({ ...f, ov: {} })));
  const openDetail = (id: number) => { setCur(id); go('detail'); };
  const movePv = (d: number, n: number) => setPv(p => (p + d + n) % n);

  async function addFiles(list: File[]) {
    const add: PFile[] = [];
    for (const file of list) {
      const ext = (file.name.split('.').pop() || '').toUpperCase();
      let pages = 1, thumb: string | undefined;
      try {
        if (ext === 'PDF') {
          const t = new TextDecoder('latin1').decode(await file.arrayBuffer());
          pages = Math.max(1, (t.match(/\/Type\s*\/Page(?![s\w])/g) || []).length);
        } else if (file.type.startsWith('image/')) thumb = URL.createObjectURL(file);
      } catch {}
      add.push({ id: ++seq.current, name: file.name, size: file.size, pages, ext, thumb, file, ov: {}, edit: false, note: '' });
    }
    setFiles(fs => [...fs, ...add]);
  }
  const pick = () => {
    const i = document.createElement('input');
    i.type = 'file'; i.multiple = true; i.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
    i.onchange = () => addFiles([...(i.files || [])]);
    i.click();
  };

  const finish = (o: Order, rest: Order[]) => { saveHist([o, ...rest]); setInv(o); };
  async function confirm() {
    setBusy(true);
    const o: Order = { no: 'INV-' + Date.now(), name: name || 'Tanpa nama', t: Date.now(), total: total(files, g), items: files.map(f => toItem(f, g)) };
    const r = await sendPrintReq(o);
    finish({ ...o, req: r.ok ? 'sent' : 'failed', ticket: r.ticket, sim: r.simulated }, hist);
    setBusy(false); go('inv');
  }
  async function resend() {
    if (!inv) return;
    setBusy(true);
    const r = await sendPrintReq(inv);
    const o: Order = { ...inv, req: r.ok ? 'sent' : 'failed', ticket: r.ticket, sim: r.simulated };
    finish(o, hist.filter(x => x.no !== inv.no));
    setBusy(false);
  }
  const openInv = (i: number) => { setInv(hist[i]); go('inv'); };

  return { view, go, back, reset, name, setName, g, setG, files, patchFile, setOv, delFile, applyAll, pick, addFiles,
    cur, openDetail, pv, movePv, inv, hist, busy, confirm, resend, openInv };
}
export type App = ReturnType<typeof useApp>;
