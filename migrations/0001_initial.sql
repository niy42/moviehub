PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id TEXT NOT NULL,
  movie_id INTEGER NOT NULL CHECK(movie_id > 0),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE(owner_id, movie_id)
);
CREATE INDEX IF NOT EXISTS idx_favorites_owner_created ON favorites(owner_id, created_at DESC);
CREATE TABLE IF NOT EXISTS watchlists (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  name TEXT NOT NULL CHECK(length(trim(name)) BETWEEN 1 AND 80),
  description TEXT CHECK(description IS NULL OR length(description) <= 500),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_watchlists_owner_updated ON watchlists(owner_id, updated_at DESC);
CREATE TABLE IF NOT EXISTS watchlist_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  watchlist_id TEXT NOT NULL REFERENCES watchlists(id) ON DELETE CASCADE,
  movie_id INTEGER NOT NULL CHECK(movie_id > 0),
  added_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  position INTEGER NOT NULL DEFAULT 0,
  UNIQUE(watchlist_id, movie_id)
);
CREATE INDEX IF NOT EXISTS idx_watchlist_entries_list ON watchlist_entries(watchlist_id, position, added_at);
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  metadata TEXT NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_analytics_type_created ON analytics_events(event_type, created_at);
