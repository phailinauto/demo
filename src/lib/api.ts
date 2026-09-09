import { supabase } from './supabase';
import type { Genre, Movie, MovieWithGenres, Episode } from '@/types';

export async function getGenres(): Promise<Genre[]> {
  const { data, error } = await supabase
    .from('genres')
    .select('*')
    .order('name');
  if (error) throw error;
  return data as Genre[];
}

export async function getFeaturedMovies(): Promise<Movie[]> {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('is_featured', true)
    .order('rating', { ascending: false })
    .limit(10);
  if (error) throw error;
  return data as Movie[];
}

export async function getTopDayMovies(): Promise<Movie[]> {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('is_top_day', true)
    .order('views', { ascending: false })
    .limit(12);
  if (error) throw error;
  return data as Movie[];
}

export async function getNewMovies(): Promise<Movie[]> {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('is_new', true)
    .order('created_at', { ascending: false })
    .limit(18);
  if (error) throw error;
  return data as Movie[];
}

export async function getMoviesByGenre(slug: string, page = 1, perPage = 24): Promise<{ movies: Movie[]; total: number }> {
  const { data: genre } = await supabase
    .from('genres')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  if (!genre) return { movies: [], total: 0 };

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, error, count } = await supabase
    .from('movies')
    .select('*', { count: 'exact' })
    .in('id', (await supabase
      .from('movie_genres')
      .select('movie_id')
      .eq('genre_id', genre.id)
    ).data?.map(r => r.movie_id) ?? [])
    .order('created_at', { ascending: false })
    .range(from, to);
  if (error) throw error;
  return { movies: (data as Movie[]) ?? [], total: count ?? 0 };
}

export async function getAllMovies(page = 1, perPage = 24): Promise<{ movies: Movie[]; total: number }> {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  const { data, error, count } = await supabase
    .from('movies')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);
  if (error) throw error;
  return { movies: (data as Movie[]) ?? [], total: count ?? 0 };
}

export async function getMovieBySlug(slug: string): Promise<MovieWithGenres | null> {
  const { data: movie, error } = await supabase
    .from('movies')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  if (!movie) return null;

  const { data: mgData } = await supabase
    .from('movie_genres')
    .select('genre_id')
    .eq('movie_id', movie.id);

  let genres: Genre[] = [];
  if (mgData && mgData.length > 0) {
    const { data: genreData } = await supabase
      .from('genres')
      .select('*')
      .in('id', mgData.map(r => r.genre_id));
    genres = (genreData as Genre[]) ?? [];
  }

  return { ...movie, genres } as MovieWithGenres;
}

export async function getEpisodes(movieId: string): Promise<Episode[]> {
  const { data, error } = await supabase
    .from('episodes')
    .select('*')
    .eq('movie_id', movieId)
    .order('episode_number', { ascending: true });
  if (error) throw error;
  return (data as Episode[]) ?? [];
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .or(`title.ilike.%${query}%,original_title.ilike.%${query}%`)
    .order('views', { ascending: false })
    .limit(30);
  if (error) throw error;
  return (data as Movie[]) ?? [];
}

export async function incrementViews(movieId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_movie_views', { movie_id: movieId });
  if (error) {
    // Fallback: direct update
    await supabase
      .from('movies')
      .update({ views: (await supabase.from('movies').select('views').eq('id', movieId).maybeSingle()).data?.views + 1 })
      .eq('id', movieId);
  }
}

export async function getFavoriteMovies(sessionId: string): Promise<Movie[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select('movie_id')
    .eq('session_id', sessionId);
  if (error) throw error;

  const movieIds = (data ?? []).map(f => f.movie_id);
  if (movieIds.length === 0) return [];

  const { data: movies, error: mErr } = await supabase
    .from('movies')
    .select('*')
    .in('id', movieIds)
    .order('created_at', { ascending: false });
  if (mErr) throw mErr;
  return (movies as Movie[]) ?? [];
}

export async function isFavorite(sessionId: string, movieId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('session_id', sessionId)
    .eq('movie_id', movieId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

export async function toggleFavorite(sessionId: string, movieId: string): Promise<boolean> {
  const exists = await isFavorite(sessionId, movieId);
  if (exists) {
    await supabase
      .from('favorites')
      .delete()
      .eq('session_id', sessionId)
      .eq('movie_id', movieId);
    return false;
  } else {
    await supabase
      .from('favorites')
      .insert({ session_id: sessionId, movie_id: movieId });
    return true;
  }
}
