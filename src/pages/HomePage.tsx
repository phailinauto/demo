import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Star, Eye, Calendar, Flame } from 'lucide-react';
import type { Movie } from '@/types';
import { statusLabel, statusColor } from '@/types';
import { getFeaturedMovies, getTopDayMovies, getNewMovies } from '@/lib/api';
import MovieCard from '@/components/MovieCard';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [featured, setFeatured] = useState<Movie[]>([]);
  const [topDay, setTopDay] = useState<Movie[]>([]);
  const [newMovies, setNewMovies] = useState<Movie[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [f, t, n] = await Promise.all([getFeaturedMovies(), getTopDayMovies(), getNewMovies()]);
        setFeatured(f);
        setTopDay(t);
        setNewMovies(n);
      } catch (err) {
        console.error('Failed to load movies:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (featured.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % featured.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  const current = featured[currentSlide];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Carousel */}
      {current && (
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={current.backdrop_url || current.poster_url || ''}
              alt={current.title}
              className="w-full h-full object-cover transition-opacity duration-700"
              key={currentSlide}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
          </div>

          <div className="relative h-full max-w-[1400px] mx-auto px-4 lg:px-8 flex items-end pb-16">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${statusColor(current.status)}`}>
                  {statusLabel(current.status)}
                </span>
                {current.quality && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white backdrop-blur-sm">
                    {current.quality}
                  </span>
                )}
                {current.is_new && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white">NEW</span>
                )}
              </div>

              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-3 leading-tight">{current.title}</h1>
              {current.original_title && (
                <p className="text-lg text-gray-400 mb-4">{current.original_title}</p>
              )}

              <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
                {current.rating > 0 && (
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    {current.rating}
                  </span>
                )}
                {current.year && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {current.year}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {current.views ? current.views.toLocaleString() : '0'} lượt xem
                </span>
                {current.duration && <span>{current.duration}</span>}
              </div>

              <p className="text-gray-300 text-base lg:text-lg mb-6 line-clamp-3 leading-relaxed">
                {current.description}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate(`/phim/${current.slug}`)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-rose-500/50"
                >
                  <Play className="w-5 h-5 fill-white" />
                  Xem Phim
                </button>
                <button
                  onClick={() => onNavigate(`/phim/${current.slug}`)}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all backdrop-blur-sm"
                >
                  Chi Tiết
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Controls */}
          {featured.length > 1 && (
            <>
              <button
                onClick={() => setCurrentSlide((s) => (s - 1 + featured.length) % featured.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-rose-500 text-white flex items-center justify-center transition-all backdrop-blur-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCurrentSlide((s) => (s + 1) % featured.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-rose-500 text-white flex items-center justify-center transition-all backdrop-blur-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {featured.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentSlide ? 'w-8 bg-rose-500' : 'w-1.5 bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 -mt-8 relative z-10 space-y-12 pb-16">
        {/* Top Phim Ngày */}
        {topDay.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
                <Flame className="w-6 h-6 text-rose-500" />
                Top Phim Ngày
              </h2>
              <button
                onClick={() => onNavigate('/danh-sach/top-phim-ngay')}
                className="text-sm text-rose-400 hover:text-rose-300 transition-colors font-medium"
              >
                Xem tất cả →
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4">
              {topDay.slice(0, 12).map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={() => onNavigate(`/phim/${movie.slug}`)} />
              ))}
            </div>
          </section>
        )}

        {/* Phim Mới Cập Nhật */}
        {newMovies.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
                <Play className="w-6 h-6 text-rose-500" />
                Phim Mới Cập Nhật
              </h2>
              <button
                onClick={() => onNavigate('/danh-sach/phim-moi')}
                className="text-sm text-rose-400 hover:text-rose-300 transition-colors font-medium"
              >
                Xem tất cả →
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4">
              {newMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={() => onNavigate(`/phim/${movie.slug}`)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
