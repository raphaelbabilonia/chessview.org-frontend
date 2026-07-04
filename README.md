# ChessView.org Frontend

ChessView is an open source platform for making physical chess events easier to publish, follow, and manage. The frontend provides the public event experience and organizer-facing tournament screens for the ChessView MVP.

The founding idea is simple: help clubs, academies, organizers, players, and spectators bring more over-the-board chess activity online. Today this app focuses on public event listings, manual tournament management, registrations, pairings, results, and standings. Over time, ChessView can grow toward camera-assisted game reconstruction, where inexpensive chess clock or board-side camera workflows help turn physical games into reviewable digital records.

This repository contains only the public React frontend. The backend lives at [raphaelbabilonia/chessview.org-backend](https://github.com/raphaelbabilonia/chessview.org-backend).

## Open Source And Commercial Boundaries

- Source code is licensed under AGPL-3.0-only.
- The ChessView name, ChessView.org name, logos, icons, domains, and brand identity are reserved trademarks/brand assets. See [TRADEMARKS.md](./TRADEMARKS.md).
- Production databases, curated tournament/news data, source evidence, dedupe state, AI search indexes, analytics databases, embeddings, recommendations, uploads, and commercial datasets are not open source. See [DATA_LICENSE.md](./DATA_LICENSE.md).
- Contributors must keep private data, third-party proprietary material, credentials, and production exports out of pull requests. See [CONTRIBUTING.md](./CONTRIBUTING.md).
- The official hosted ChessView service may include paid hosting, support, integrations, AI search, analytics, and other commercial services built around the AGPL core.

See [OPEN_SOURCE_POLICY.md](./OPEN_SOURCE_POLICY.md) for the full policy.

## Current MVP

- Browse public chess events.
- View event details, sections, players, rounds, pairings, results, and standings.
- Register and log in.
- Use a light/dark theme with local preference persistence.
- Let organizers manage events, sections, players, registrations, rounds, manual pairings, and results.
- Keep the UI mobile-first for phones, tablets, and desktop screens.

## Tech Stack

- React 18
- Vite
- React Router
- Axios
- CSS variables
- Lucide React icons

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The dev server runs at `http://localhost:3000` by default.

## Environment Variables

Create `.env` from `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, point `VITE_API_URL` to the deployed API, for example:

```env
VITE_API_URL=https://api.chessview.org/api
```

## Backend

Run the backend locally from the backend repository:

```bash
npm install
cp .env.example .env
npm run seed
npm run dev
```

## Demo Users

These accounts are for local development and demo data only:

- `organizer@chessview.local` / `password123`
- `admin@chessview.local` / `password123`
- `player@chessview.local` / `password123`

Never use demo credentials in production.

## Clean-room Note

ChessView is a clean-room rebuild inspired by common chess tournament workflows. Do not copy Vesus source code, branding, protected text, private assets, credentials, cookies, or private user data into this project.

## License

This project source code is licensed under the GNU Affero General Public License v3.0 only. See [LICENSE](./LICENSE).

The code license does not grant rights to ChessView trademarks, brand assets, production data, curated datasets, AI/analytics assets, private infrastructure, or hosted-service data. See [OPEN_SOURCE_POLICY.md](./OPEN_SOURCE_POLICY.md).
