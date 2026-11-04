import { NextResponse } from 'next/server';

const TARGET = 'https://print.rantaimediadigital.com/printreq';

export async function POST(req: Request) {
  const body = await req.json();

  if (process.env.PRINTREQ_MODE === 'live') {
    try {
      const r = await fetch(TARGET, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      let data: any = {};
      try { data = await r.json(); } catch {}
      return NextResponse.json({ ok: r.ok, simulated: false, ticket: data.ticket ?? data.id }, { status: r.ok ? 200 : 502 });
    } catch {
      return NextResponse.json({ ok: false, simulated: false }, { status: 502 });
    }
  }

  // Mode simulasi (default): tiru request + response, tidak menghubungi server asli
  await new Promise(r => setTimeout(r, 800));
  console.log(`[printreq:simulasi] POST ${TARGET}`, JSON.stringify(body));
  return NextResponse.json({ ok: true, simulated: true, ticket: 'SIM-' + String(body.no ?? '').replace('INV-', '') });
}
