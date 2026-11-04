import type { Order } from './types';

export interface PrintReqResult { ok: boolean; ticket?: string; simulated: boolean }

/** Dipanggil setelah pesanan dikonfirmasi. Lewat /api/printreq supaya tidak kena CORS. */
export async function sendPrintReq(o: Order): Promise<PrintReqResult> {
  const { no, name, t, total, items } = o;
  try {
    const r = await fetch('/api/printreq', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ no, name, t, total, items }),
    });
    const j = await r.json();
    return { ok: r.ok && !!j.ok, ticket: j.ticket, simulated: !!j.simulated };
  } catch {
    return { ok: false, simulated: false };
  }
}
