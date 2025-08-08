# MEDS-Game (Rewrite)

Simulasi anamnesis/diagnosis sederhana. Frontend static di GitHub Pages, backend tipis via serverless function untuk panggilan LLM (API key aman di environment).

## Fitur
- Generate kasus pasien (LLM → JSON terstruktur)
- Catatan user → mempengaruhi prompt
- Review hasil + rating
- Persist state (localStorage)

## Stack
- Frontend: HTML + Tailwind CDN + Alpine.js
- Backend: Serverless (TypeScript)
- CI/CD: GitHub Pages + GitHub Actions

## Jalankan Lokal
```bash
# 1) clone
git clone <repo-url>
cd MEDS-Game

# 2) jalankan static server (opsional)
#   atau cukup buka public/index.html langsung di browser
npx serve public

# 3) serverless lokal (pilih salah satu platform)
# vercel
npm i -g vercel
vercel dev

# 4) env
# buat .env lokal untuk serverless
OPENAI_API_KEY=sk-...
MODEL=gpt-4o-mini
