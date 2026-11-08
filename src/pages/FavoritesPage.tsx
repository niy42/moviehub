import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { personalApi } from '../api/personal';
import { tmdbClient } from '../api/client';
import type { Movie } from '../types/movie';
import { MovieCard } from '../components/movies/MovieCard';

export function FavoritesPage(){
 const qc=useQueryClient();
 const {data: favorites,isLoading,error}=useQuery({queryKey:['favorites'],queryFn:personalApi.favorites});
 const {data:movies,isLoading:moviesLoading}=useQuery({queryKey:['favorite-movies',favorites?.map(f=>f.movieId)],enabled:!!favorites,queryFn:async()=>Promise.all((favorites||[]).map(async f=>{try{return (await tmdbClient.get<Movie>(`/movie/${f.movieId}`)).data}catch{return null}}))});
 const remove=async(id:number)=>{await personalApi.removeFavorite(id);await qc.invalidateQueries({queryKey:['favorites']});await qc.invalidateQueries({queryKey:['favorite-movies']});};
 return <section className="max-w-6xl mx-auto space-y-6"><div><h1 className="text-3xl font-semibold text-text-primary">Your Favorites</h1><p className="text-text-secondary mt-2">Movies you have saved in this browser.</p></div>{(isLoading||moviesLoading)&&<p className="text-text-secondary">Loading favorites…</p>}{error&&<p role="alert" className="text-red-400">Could not load favorites. Check your connection and try again.</p>}{!isLoading&&!error&&(!favorites?.length)&&<div className="rounded-2xl border border-surface-border p-8 text-center"><p className="text-text-primary font-medium">No favorites yet</p><p className="text-text-secondary mt-2">Open a movie and save it to find it here.</p><Link className="inline-block mt-4 text-brand-primary" to="/">Discover movies</Link></div>}<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">{movies?.filter((m):m is Movie=>!!m).map(m=><div key={m.id} className="space-y-2"><MovieCard movie={m}/><button onClick={()=>void remove(m.id)} className="text-sm text-red-400 hover:underline">Remove favorite</button></div>)}</div></section>
}
