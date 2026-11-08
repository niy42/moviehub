import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { tmdbClient, getPosterUrl } from '../api/client';
import { personalApi } from '../api/personal';
import type { Movie } from '../types/movie';

export function WatchlistDetailPage() {
  const { id = '' } = useParams();
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const qc = useQueryClient();
  const lists = useQuery({ queryKey: ['watchlists'], queryFn: personalApi.watchlists });
  const list = lists.data?.find((item) => item.id === id);
  const entries = useQuery({ queryKey: ['watchlist-entries', id], queryFn: () => personalApi.entries(id), enabled: !!id });
  const searchResults = useQuery({
    queryKey: ['watchlist-movie-search', searchTerm],
    queryFn: async () => (await tmdbClient.get<{ results: Movie[] }>('/search/movie', { params: { query: searchTerm, page: 1 } })).data.results,
    enabled: searchTerm.trim().length >= 2,
  });
  const add = useMutation({
    mutationFn: (movieId: number) => personalApi.addToWatchlist(id, movieId),
    onSuccess: async () => { setMessage('Movie added to your watchlist.'); await qc.invalidateQueries({ queryKey: ['watchlist-entries', id] }); void personalApi.event('watchlist_movie_added'); },
    onError: () => setMessage('Could not add that movie. Please try again.'),
  });
  const remove = useMutation({ mutationFn: (movieId: number) => personalApi.removeFromWatchlist(id, movieId), onSuccess: async () => { await qc.invalidateQueries({ queryKey: ['watchlist-entries', id] }); setMessage('Movie removed.'); }, onError: () => setMessage('Could not remove that movie.') });
  const existing = new Set(entries.data?.map((entry) => entry.movieId) ?? []);

  return <section className="max-w-5xl mx-auto space-y-6">
    <Link to="/watchlists" className="text-indigo-400 text-sm">← All watchlists</Link>
    <div><h1 className="text-3xl font-semibold text-text-primary">{list?.name || (lists.isLoading ? 'Loading watchlist…' : 'Watchlist')}</h1><p className="text-text-secondary mt-2">Search the movie catalog and add a title to this list.</p></div>
    {lists.isError && <p role="alert" className="text-red-400">Could not load this watchlist.</p>}
    <form className="flex flex-col sm:flex-row gap-3" onSubmit={(event) => { event.preventDefault(); setSearchTerm(search.trim()); setMessage(''); }}>
      <input value={search} onChange={(event) => setSearch(event.target.value)} minLength={2} maxLength={120} placeholder="Search movies by title" aria-label="Search movies" className="flex-1 rounded-xl border border-surface-border bg-surface-elevated px-4 py-3 text-text-primary" />
      <button disabled={search.trim().length < 2} className="rounded-xl bg-indigo-600 text-white px-5 py-3 disabled:opacity-50">Search movies</button>
    </form>
    {searchResults.isLoading && <p role="status" className="text-text-secondary">Searching movies…</p>}
    {searchResults.isError && <p role="alert" className="text-red-400">Movie search is unavailable. Try again.</p>}
    {!!searchTerm && !searchResults.isLoading && !searchResults.isError && !searchResults.data?.length && <p className="text-text-secondary">No movies found for “{searchTerm}”.</p>}
    {!!searchResults.data?.length && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{searchResults.data.slice(0, 9).map((movie) => <div key={movie.id} className="flex gap-3 rounded-xl border border-surface-border p-3"><img src={getPosterUrl(movie.poster_path, 'w92')} alt="" className="w-14 h-20 object-cover rounded-lg bg-surface-elevated"/><div className="min-w-0 flex-1"><Link to={`/movie/${movie.id}`} className="text-text-primary hover:text-indigo-400 font-medium line-clamp-2">{movie.title}</Link><p className="text-text-muted text-xs mt-1">{movie.release_date?.slice(0, 4) || 'Release date unavailable'}</p><button disabled={existing.has(movie.id) || add.isPending} onClick={() => { setMessage(''); add.mutate(movie.id); }} className="mt-2 text-sm text-indigo-400 disabled:text-text-muted">{existing.has(movie.id) ? 'Already added' : add.isPending ? 'Adding…' : 'Add to watchlist'}</button></div></div>)}</div>}
    {message && <p role="status" className="text-sm text-text-secondary">{message}</p>}
    <div className="border-t border-surface-border pt-5 space-y-3"><h2 className="text-xl font-medium text-text-primary">Saved movies</h2>{entries.isLoading && <p className="text-text-secondary">Loading entries…</p>}{entries.isError && <p role="alert" className="text-red-400">Could not load watchlist entries.</p>}{!entries.isLoading && !entries.isError && !entries.data?.length && <p className="text-text-secondary rounded-xl border border-surface-border p-6">This watchlist is empty. Search above to add a movie.</p>}{entries.data?.map((entry) => <div key={entry.movieId} className="flex items-center justify-between border border-surface-border rounded-xl p-4"><Link to={`/movie/${entry.movieId}`} className="text-text-primary hover:text-indigo-400">Open movie #{entry.movieId}</Link><button disabled={remove.isPending} onClick={() => remove.mutate(entry.movieId)} className="text-red-400 text-sm disabled:opacity-50">Remove</button></div>)}</div>
  </section>;
}
