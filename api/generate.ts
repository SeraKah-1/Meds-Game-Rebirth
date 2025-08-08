// /api/generate.ts — Vercel function (Edge/Node)
// npm i zod
import { z } from 'zod';
import { extractJson, isCaseSchema } from '../utils/json';

export const config = { runtime: 'edge' };

const Body = z.object({ notes: z.string().max(1500).default('Tidak ada catatan') });

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const body = Body.parse(await req.json());

    const system = `Kamu generator kasus medis singkat untuk latihan anamnesis.
Output hanya JSON dengan schema:
{
  "case": {
    "id": string,
    "age": number,
    "sex": "M" | "F",
    "chiefComplaint": string,
    "history": string[],
    "vitals": { [k: string]: string | number }
  }
}`;

    const user = `Catatan user: ${body.notes}\nBuat 1 kasus yang logis dan ringkas.`;

    // === contoh panggilan ke OpenAI (fetch API gaya umum) ===
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ],
        temperature: 0.7
      })
    });

    if (!r.ok) {
      const txt = await r.text();
      return new Response(JSON.stringify({ error: 'Upstream error', detail: txt }), { status: 502 });
    }

    const json = await r.json();
    const text = json.choices?.[0]?.message?.content || '';

    let data: any;
    try { data = extractJson(text); } catch { return new Response(JSON.stringify({ error: 'Invalid JSON from model' }), { status: 500 }); }
    if (!isCaseSchema(data)) return new Response(JSON.stringify({ error: 'Schema mismatch' }), { status: 500 });

    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || 'Bad Request' }), { status: 400 });
  }
}
