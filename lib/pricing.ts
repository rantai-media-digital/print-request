import type { OrderItem, PFile, Settings } from './types';

export const COL = { bw: 'Hitam Putih', c: 'Berwarna' } as const;
export const PRICE = { bw: 500, c: 1000 } as const;
export const OPT = {
  copies: [1, 2, 3, 4, 5, 6, 8, 10], orient: ['Tegak', 'Mendatar'],
};
export const DEFAULTS: Settings = { color: 'bw', copies: 2, range: 'all', orient: 'Tegak' };

export const eff = (f: PFile, g: Settings): Settings => ({ ...g, ...f.ov });

export function cnt(f: PFile, e: Settings) {
  if (!e.range || e.range === 'all') return f.pages;
  const s = new Set<number>();
  e.range.split(',').forEach(x => {
    const m = x.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) return;
    let a = +m[1], b = +(m[2] || m[1]);
    if (a > b) [a, b] = [b, a];
    for (let i = Math.max(1, a); i <= Math.min(b, f.pages); i++) s.add(i);
  });
  return s.size || f.pages;
}
export const editCost = (f: PFile, g: Settings) => (f.edit ? Math.floor(cnt(f, eff(f, g)) / 10) * 500 : 0);
export const cost = (f: PFile, g: Settings) => {
  const e = eff(f, g);
  return cnt(f, e) * e.copies * PRICE[e.color] + editCost(f, g);
};
export const total = (fs: PFile[], g: Settings) => fs.reduce((a, f) => a + cost(f, g), 0);
export const summ = (f: PFile, g: Settings) => {
  const e = eff(f, g);
  return `${COL[e.color]} · ${e.copies} salinan · ${e.orient}`;
};
export const toItem = (f: PFile, g: Settings): OrderItem => {
  const e = eff(f, g);
  return { name: f.name, color: e.color, pages: cnt(f, e), copies: e.copies, orient: e.orient,
    range: e.range, edit: f.edit, note: f.note, cost: cost(f, g) };
};

export const rp = (n: number) => 'Rp' + n.toLocaleString('id-ID');
const BLN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
export const fd = (t: number) => { const d = new Date(t); return `${d.getDate()} ${BLN[d.getMonth()]} ${d.getFullYear()}`; };
export const sz = (b: number) => (b > 1048576 ? (b / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB');
