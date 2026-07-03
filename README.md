# NexGen Affilates

Smart link geo‑control for affiliates.

## Features
- Real‑time click tracking (Turbo & Slow modes)
- Weighted country‑specific offer rotators
- Returning visitor rotation (Second Offer / Round Robin)
- Custom domains with CNAME verification
- Bulk CSV link import
- Public shareable analytics dashboard
- Weekly email reports with PDF
- Detailed click logs with duplicate & fake detection
- Bot protection (User‑Agent filtering)
- IP2Location.io geo‑detection with automatic key rotation & Redis caching

## Quick Start

1. Clone the repo.
2. Copy `.env.local.example` to `.env.local` and fill in credentials.
3. Run `npm install`.
4. Run `npx prisma db push` to create the database schema.
5. Run `npm run dev` to start development server.
6. Deploy to Vercel with environment variables set.

## Environment Variables

Check `.env.local.example` for all required keys.

## License

MIT