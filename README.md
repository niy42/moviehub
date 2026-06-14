# MovieHub — Frontend Assessment

A movie discovery dashboard built with React, TypeScript, Vite, and Tailwind CSS.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS** — utility-first styling
- **TanStack Query** — async state management and caching
- **React Router v6** — client-side routing
- **Axios** — HTTP client

## Features

- **Home Page** — Now Playing, Popular, and Top Rated sections with card grids
- **Search & Filters** — Debounced search with genre, year, rating, and sort filters; URL-synced state
- **Movie Detail Page** — Full metadata, cast, genres, backdrop image, and similar movies
- Loading skeletons, error states, and empty states throughout

## Project Structure

```
src/
├── api/
│   └── tmdb.ts          # Axios client + all API functions
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── movies/
│   │   ├── MovieCard.tsx
│   │   └── MovieSection.tsx
│   └── ui/
│       ├── RatingBadge.tsx
│       ├── Skeleton.tsx
│       └── States.tsx
├── hooks/
│   ├── useMovies.ts     # All TanStack Query hooks
│   └── useDebounce.ts
├── pages/
│   ├── HomePage.tsx
│   ├── SearchPage.tsx
│   └── MovieDetailPage.tsx
├── types/
│   └── movie.ts         # TypeScript interfaces
└── utils/
    └── format.ts        # Date, currency, runtime formatters
```

## Setup

### 1. Get a TMDB API Key

1. Create a free account at https://www.themoviedb.org
2. Go to Settings → API and request a key (choose "Developer")
3. Copy your API Key (v3 auth)

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_TMDB_API_KEY=your_actual_api_key_here
```

### 3. Install & Run

```bash
npm install
npm run dev
```

App runs at http://localhost:5173

### Build for Production

```bash
npm run build
npm run preview
```
