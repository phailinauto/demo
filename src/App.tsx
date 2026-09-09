import { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import MovieDetailPage from '@/pages/MovieDetailPage';
import CategoryPage from '@/pages/CategoryPage';
import SearchPage from '@/pages/SearchPage';
import FavoritesPage from '@/pages/FavoritesPage';
import type { Genre } from '@/types';
import { getGenres } from '@/lib/api';

type Route =
  | { name: 'home' }
  | { name: 'movie'; slug: string }
  | { name: 'category'; slug: string }
  | { name: 'search'; query: string }
  | { name: 'favorites' };

function parsePath(path: string): Route {
  if (path === '/' || path === '') return { name: 'home' };
  if (path.startsWith('/phim/')) return { name: 'movie', slug: path.slice(5) };
  if (path.startsWith('/the-loai/')) return { name: 'category', slug: path.slice(10) };
  if (path.startsWith('/danh-sach/top-phim-ngay')) return { name: 'category', slug: 'top-phim-ngay' };
  if (path.startsWith('/danh-sach/phim-moi')) return { name: 'category', slug: 'phim-moi' };
  if (path.startsWith('/danh-sach/yeu-thich')) return { name: 'favorites' };
  if (path.startsWith('/tim-kiem/')) return { name: 'search', query: decodeURIComponent(path.slice(10)) };
  return { name: 'home' };
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    getGenres().then(setGenres).catch(console.error);
  }, []);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    window.history.pushState({}, '', to);
    setPath(to);
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = useCallback((query: string) => {
    navigate(`/tim-kiem/${encodeURIComponent(query)}`);
  }, [navigate]);

  const route = parsePath(path);

  return (
    <div className="min-h-screen bg-slate-950">
      <Header genres={genres} onSearch={handleSearch} onNavigate={navigate} currentPath={path} />

      <main>
        {route.name === 'home' && <HomePage onNavigate={navigate} />}
        {route.name === 'movie' && <MovieDetailPage slug={route.slug} onNavigate={navigate} />}
        {route.name === 'category' && <CategoryPage slug={route.slug} onNavigate={navigate} />}
        {route.name === 'search' && <SearchPage query={route.query} onNavigate={navigate} />}
        {route.name === 'favorites' && <FavoritesPage onNavigate={navigate} />}
      </main>

      <Footer />
    </div>
  );
}
