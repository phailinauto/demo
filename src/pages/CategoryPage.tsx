import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Flame, Film } from 'lucide-react';
import type { Movie } from '@/types';
import { getMoviesByGenre, getTopDayMovies, getNewMovies, getGenres } from '@/lib/api';
import MovieCard from '@/components/MovieCard';

interface CategoryPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

const TITLES: Record<string, string> = {
  'top-phim-ngay': 'Top Phim Ngày',
  'phim-moi': 'Phim Mới Cập Nhật',
};

export default function CategoryPage({ slug, onNavigate }: CategoryPageProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [title, setTitle] = useState('');
  const perPage = 24;

  useEffect(() => {
    (async () => {
      setLoading(true);
      setPage(1);
      try {
        if (slug === 'top-phim-ngay') {
          const m = await getTopDayMovies();
          setMovies(m);
          setTotal(m.length);
          setTitle('Top Phim Ngày');
        } else if (slug === 'phim-moi') {
          const m = await getNewMovies();
          setMovies(m);
          setTotal(m.length);
          setTitle('Phim Mới Cập Nhật');
        } else {
          const { movies: ms, total: t } = await getMoviesByGenre(slug, 1, perPage);
          setMovies(ms);
          setTotal(t);
          const genres = await getGenres();
          const g = genres.find(x => x.slug === slug);
          setTitle(g?.name || 'Thể Loại');
        }
      } catch (err) {
        console.error('Failed to load category:', err);
      } finally {
        setLoading(false);
      }
    })();
    window.scrollTo(0, 0);
  }, [slug]);

  const totalPages = Math.ceil(total / perPage) || 1;

  const loadPage = async (p: number) => {
    setLoading(true);
    setPage(p);
    try {
      if (slug === 'top-phim-ngay' || slug === 'phim-moi') {
        // Already loaded all
      } else {
        const { movies: ms } = await getMoviesByGenre(slug, p, perPage);
        setMovies(ms);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          {slug === 'top-phim-ngay' ? (
            <Flame className="w-8 h-8 text-rose-500" />
          ) : (
            <Film className="w-8 h-8 text-rose-500" />
          )}
          <h1 className="text-2xl lg:text-3xl font-bold text-white">{title}</h1>
          <span className="text-gray-500 text-sm">({total} phim)</span>
        </div>

        {movies.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">Chưa có phim trong danh mục này</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4">
              {movies.map((m) => (
                <MovieCard key={m.id} movie={m} onClick={() => onNavigate(`/phim/${m.slug}`)} />
              ))}
            </div>

            {totalPages > 1 && slug !== 'top-phim-ngay' && slug !== 'phim-moi' && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => loadPage(page - 1)}
                  disabled={page <= 1}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => loadPage(p)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                        page === p
                          ? 'bg-rose-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => loadPage(page + 1)}
                  disabled={page >= totalPages}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
