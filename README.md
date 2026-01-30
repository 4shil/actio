# Actio

Paste instructions. Get actions.

A minimalist web app that converts long, unstructured instructions into clear, actionable checklists.

## Features

- Extracts actionable steps from any text (emails, notices, forms)
- Strict mode for explicit-only actions
- Automatic deadline detection and highlighting
- Copy as plain text or Markdown
- Mobile-first, responsive design
- No accounts, no storage, no tracking

## Tech Stack

- Next.js 15 (React 19)
- Tailwind CSS (Soft Neo-Brutalism)
- OpenRouter API (Gemini 2.0 Flash)
- Vercel Serverless Functions

## Getting Started

1. Clone the repo:
```bash
git clone https://github.com/4shil/actio.git
cd actio
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local`:
```env
OPENROUTER_API_KEY=your_openrouter_key
```

4. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Privacy

- Text is processed in memory only
- No storage, no logs
- Data is immediately discarded after processing

## License

MIT
