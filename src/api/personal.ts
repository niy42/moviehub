import axios from "axios";
const api = axios.create({ baseURL: "/api", withCredentials: true });
export interface Favorite { movieId: number; createdAt: string }
export interface Watchlist { id: string; name: string; description?: string | null; createdAt?: string; updatedAt?: string }
export const personalApi = {
  favorites: async () => (await api.get<{results:Favorite[]}>('/favorites')).data.results,
  addFavorite: async (movieId:number) => api.post('/favorites',{movieId}),
  removeFavorite: async (movieId:number) => api.delete(`/favorites/${movieId}`),
  watchlists: async () => (await api.get<{results:Watchlist[]}>('/watchlists')).data.results,
  createWatchlist: async (name:string) => (await api.post<Watchlist>('/watchlists',{name})).data,
  renameWatchlist: async (id:string,name:string) => api.patch(`/watchlists/${id}`,{name}),
  deleteWatchlist: async (id:string) => api.delete(`/watchlists/${id}`),
  entries: async (id:string) => (await api.get<{results:{movieId:number}[]}>(`/watchlists/${id}/entries`)).data.results,
  addToWatchlist: async (id:string,movieId:number) => api.post(`/watchlists/${id}/entries`,{movieId}),
  removeFromWatchlist: async (id:string,movieId:number) => api.delete(`/watchlists/${id}/entries?movieId=${movieId}`),
  discover: async (prompt:string) => (await api.post<{preferences:string;results:import('../types/movie').Movie[]}>('/ai/discover',{prompt},{timeout:15000})).data,
  event: (type:string,metadata?:Record<string,unknown>) => api.post('/analytics',{type,metadata}).catch(()=>undefined),
};
