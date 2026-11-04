# PrinPrinan (Next.js)

    npm install
    cp .env.example .env.local
    npm run dev

- `PRINTREQ_MODE=simulate` (default): `/api/printreq` hanya meniru response, payload dicetak di console server.
- `PRINTREQ_MODE=live`: `/api/printreq` meneruskan POST JSON ke `https://print.rantaimediadigital.com/printreq`.
- Invoice disimpan sebagai PNG lewat canvas (`lib/invoicePng.ts`), tanpa dependensi tambahan.
- Logika harga: `lib/pricing.ts`, state: `lib/useApp.ts`, kirim request: `lib/printreq.ts` + `app/api/printreq/route.ts`.
