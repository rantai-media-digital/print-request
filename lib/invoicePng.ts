import qrcode from 'qrcode-generator';
import { COL, fd, rp } from './pricing';
import type { Order } from './types';

/** Isi QR verifikasi. Dipakai bersama oleh tampilan layar dan file PNG. */
export const qrOf = (o: Order) => {
  const q = qrcode(0, 'M');
  q.addData(`${o.no}|${o.name}|${o.total}`);
  q.make();
  return q;
};

// Warna tetap terang supaya PNG selalu terbaca, apa pun tema browser.
const C = { pri: '#2158d8', soft: '#e8f0fe', line: '#e3e8f0', ink: '#16284a', mut: '#6b7a90', okt: '#1f7a4d', okb: '#e3f5ea' };
const FONT = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const W = 420, PAD = 24, SCALE = 3, QR = 280, QR_PAD = 14;

type Ctx = CanvasRenderingContext2D;
const font = (c: Ctx, w: number, s: number) => { c.font = `${w} ${s}px ${FONT}`; };

function wrap(c: Ctx, text: string, max: number): string[] {
  const out: string[] = []; let line = '';
  for (const w of text.split(' ')) {
    const t = line ? line + ' ' + w : w;
    if (c.measureText(t).width <= max || !line) line = t; else { out.push(line); line = w; }
  }
  if (line) out.push(line);
  return out;
}
function fit(c: Ctx, text: string, max: number) {
  if (c.measureText(text).width <= max) return text;
  let t = text;
  while (t.length > 1 && c.measureText(t + '…').width > max) t = t.slice(0, -1);
  return t + '…';
}
function rrect(c: Ctx, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}

const NOTE = 'Gunakan QR ini di Loket ruangan Teaching Factory (TEFA) untuk mengkonfirmasi pesanan print';

/** Gambar invoice ke canvas. Dua kali jalan: pertama mengukur tinggi, kedua menggambar. */
function render(c: Ctx, o: Order, draw: boolean): number {
  const IW = W - PAD * 2;
  let y = 4 + 24;
  const row = (l: string, v: string) => {
    y += 22;
    if (draw) {
      font(c, 400, 13); c.fillStyle = C.mut; c.textAlign = 'left'; c.fillText(l, PAD, y);
      font(c, 600, 13); c.fillStyle = C.ink; c.textAlign = 'right'; c.fillText(fit(c, v, IW - 130), W - PAD, y);
    }
  };

  // Judul + ikon centang
  y += 14;
  if (draw) {
    font(c, 700, 15); c.fillStyle = C.ink; c.textAlign = 'left'; c.fillText('🧾 INVOICE PESANAN ANDA', PAD, y);
    const cx = W - PAD - 11, cy = y - 5;
    c.strokeStyle = C.okt; c.lineWidth = 2; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.arc(cx, cy, 11, 0, Math.PI * 2); c.stroke();
    c.beginPath(); c.moveTo(cx - 4.5, cy); c.lineTo(cx - 1, cy + 3.5); c.lineTo(cx + 5, cy - 3); c.stroke();
  }
  y += 22;
  if (draw) { font(c, 400, 13); c.fillStyle = C.mut; c.textAlign = 'left'; c.fillText('Nomor Invoice:', PAD, y); }
  y += 26;
  if (draw) { font(c, 700, 19); c.fillStyle = C.ink; c.textAlign = 'left'; c.fillText(o.no, PAD, y); }
  y += 4;
  row('Nama Pemesan:', o.name);
  row('Tanggal:', fd(o.t));
  y += 14;
  if (draw) { c.fillStyle = C.line; c.fillRect(PAD, y, IW, 1); }
  y += 6;

  // Item
  o.items.forEach((f, i) => {
    y += 26;
    if (draw) { font(c, 700, 14); c.fillStyle = C.ink; c.textAlign = 'left'; c.fillText(fit(c, `${i + 1}. ${f.name}`, IW), PAD, y); }
    row('Pengaturan:', COL[f.color]);
    row('Total Halaman:', String(f.pages));
    row('Salinan:', String(f.copies));
    row('Biaya:', rp(f.cost));
  });

  // Total
  y += 20;
  if (draw) {
    c.fillStyle = C.soft; rrect(c, PAD, y, IW, 56, 12); c.fill();
    font(c, 700, 12); c.fillStyle = C.pri; c.textAlign = 'left'; c.fillText('TOTAL BIAYA:', PAD + 16, y + 33);
    font(c, 800, 26); c.textAlign = 'right'; c.fillText(rp(o.total), W - PAD - 16, y + 36);
  }
  y += 56 + 28;

  // QR (besar, di tengah)
  const box = QR + QR_PAD * 2, bx = (W - box) / 2;
  if (draw) {
    c.fillStyle = '#fff'; rrect(c, bx, y, box, box, 14); c.fill();
    c.strokeStyle = C.line; c.lineWidth = 1; rrect(c, bx + .5, y + .5, box - 1, box - 1, 14); c.stroke();
    const q = qrOf(o), n = q.getModuleCount();
    const m = Math.floor(QR * SCALE / n) / SCALE; // ukuran modul kelipatan piksel agar tajam
    const off = (W - m * n) / 2, top = y + (box - m * n) / 2;
    c.fillStyle = '#000';
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (q.isDark(r, k)) c.fillRect(off + k * m, top + r * m, m + .001, m + .001);
  }
  y += box + 22;
  if (draw) { font(c, 700, 14); c.fillStyle = C.ink; c.textAlign = 'center'; c.fillText('QR verifikasi', W / 2, y); }
  font(c, 400, 12);
  for (const l of wrap(c, NOTE, IW - 20)) {
    y += 18;
    if (draw) { font(c, 400, 12); c.fillStyle = C.mut; c.textAlign = 'center'; c.fillText(l, W / 2, y); }
  }
  y += 30;
  if (draw) { font(c, 400, 12); c.fillStyle = C.mut; c.textAlign = 'center'; c.fillText('Terima kasih sudah mencetak bersama PrinPrinan.', W / 2, y); }
  return y + 24;
}

export async function invoiceToPng(o: Order): Promise<Blob> {
  try { await Promise.all([document.fonts.load(`400 13px ${FONT}`), document.fonts.load(`700 13px ${FONT}`), document.fonts.load(`800 13px ${FONT}`)]); } catch {}
  const cv = document.createElement('canvas'), c = cv.getContext('2d')!;
  const H = Math.ceil(render(c, o, false));
  cv.width = W * SCALE; cv.height = H * SCALE;
  c.scale(SCALE, SCALE);
  c.fillStyle = '#fff'; c.fillRect(0, 0, W, H);
  c.fillStyle = C.pri; c.fillRect(0, 0, W, 4);
  render(c, o, true);
  return new Promise((res, rej) => cv.toBlob(b => (b ? res(b) : rej(new Error('toBlob gagal'))), 'image/png'));
}

export async function downloadInvoicePng(o: Order) {
  const blob = await invoiceToPng(o), url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = `${o.no}.png`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
