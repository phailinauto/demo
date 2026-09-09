import { useEffect, useState } from 'react';
import { Play, Star, Eye, Calendar, Clock, Globe, Heart, Share2, ChevronLeft, List } from 'lucide-react';
import type { MovieWithGenres, Episode } from '@/types';
import { statusLabel, statusColor } from '@/types';
import { getMovieBySlug, getEpisodes, incrementViews, toggleFavorite, isFavorite, getNewMovies } from '@/lib/api';
import { getSessionId } from '@/lib/session';
import MovieCard from '@/components/MovieCard';
import type { Movie } from '@/types';

interface MovieDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export default function MovieDetailPage({ slug, onNavigate }: MovieDetailPageProps) {
  const [movie, setMovie] = useState<MovieWithGenres | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [related, setRelated] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [isFav, setIsFav] = useState(false);
  const [showEpisodes, setShowEpisodes] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const m = await getMovieBySlug(slug);
        setMovie(m);
        if (m) {
          const eps = await getEpisodes(m.id);
          setEpisodes(eps);
          if (eps.length > 0) setSelectedEpisode(eps[0]);
          incrementViews(m.id);
          setIsFav(await isFavorite(getSessionId(), m.id));
          const nm = await getNewMovies();
          setRelated(nm.filter(r => r.id !== m.id).slice(0, 12));
        }
      } catch (err) {
        console.error('Failed to load movie:', err);
      } finally {
        setLoading(false);
      }
    })();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-white mb-4">Không tìm thấy phim</p>
          <button onClick={() => onNavigate('/')} className="text-rose-400 hover:text-rose-300">
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const videoUrl = selectedEpisode?.video_url || movie.video_url || '';
  const isTrailer = movie.status === 'trailer';

  const handleFav = async () => {
    const result = await toggleFavorite(getSessionId(), movie.id);
    setIsFav(result);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Backdrop */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={movie.backdrop_url || movie.poster_url || ''}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 -mt-64 relative z-10">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors mb-4 text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0 mx-auto lg:mx-0">
            <div className="w-48 lg:w-64 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10">
              {movie.poster_url ? (
                <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full aspect-[2/3] bg-slate-800 flex items-center justify-center">
                  <Play className="w-12 h-12 text-gray-600" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${statusColor(movie.status)}`}>
                {statusLabel(movie.status)}
              </span>
              {movie.quality && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white backdrop-blur-sm">
                  {movie.quality}
                </span>
              )}
              {movie.is_new && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white">NEW</span>
              )}
              {movie.type === 'series' && movie.episode_count && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/80 text-white">
                  {movie.episode_count} tập
                </span>
              )}
            </div>

            <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">{movie.title}</h1>
            {movie.original_title && (
              <p className="text-lg text-gray-400 mb-4">{movie.original_title}</p>
            )}

            <div className="flex items-center gap-4 mb-4 text-sm flex-wrap">
              {movie.rating > 0 && (
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {movie.rating}
                </span>
              )}
              {movie.year && (
                <span className="flex items-center gap-1 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  {movie.year}
                </span>
              )}
              {movie.duration && (
                <span className="flex items-center gap-1 text-gray-300">
                  <Clock className="w-4 h-4" />
                  {movie.duration}
                </span>
              )}
              {movie.country && (
                <span className="flex items-center gap-1 text-gray-300">
                  <Globe className="w-4 h-4" />
                  {movie.country}
                </span>
              )}
              <span className="flex items-center gap-1 text-gray-300">
                <Eye className="w-4 h-4" />
                {movie.views ? movie.views.toLocaleString() : '0'} lượt xem
              </span>
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {movie.genres.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => onNavigate(`/the-loai/${g.slug}`)}
                    className="px-3 py-1 rounded-lg bg-white/5 hover:bg-rose-500/20 text-gray-300 hover:text-rose-300 text-sm transition-all"
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            )}

            <p className="text-gray-300 leading-relaxed mb-6 max-w-3xl">{movie.description}</p>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => document.getElementById('player')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-rose-500/50"
              >
                <Play className="w-5 h-5 fill-white" />
                {isTrailer ? 'Xem Trailer' : 'Xem Phim'}
              </button>
              <button
                onClick={handleFav}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                  isFav
                    ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-400' : ''}`} />
                {isFav ? 'Đã Yêu Thích' : 'Yêu Thích'}
              </button>
              <button
                onClick={() => navigator.share?.({ title: movie.title, url: window.location.href }).catch(() => {})}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 font-semibold transition-all"
              >
                <Share2 className="w-5 h-5" />
                Chia Sẻ
              </button>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div id="player" className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              {isTrailer ? 'Trailer' : selectedEpisode ? `${selectedEpisode.title || `Tập ${selectedEpisode.episode_number}`}` : 'Xem Phim'}
            </h2>
            {episodes.length > 1 && (
              <button
                onClick={() => setShowEpisodes(!showEpisodes)}
                className="flex items-center gap-2 text-sm text-rose-400 hover:text-rose-300 transition-colors lg:hidden"
              >
                <List className="w-4 h-4" />
                Danh sách tập
              </button>
            )}
          </div>

          <div className="flex gap-4">
            {/* Player */}
            <div className="flex-1">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl shadow-black/50 ring-1 ring-white/10">
                {videoUrl ? (
                  <video
                    key={videoUrl}
                    src={videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full"
                    poster={movie.backdrop_url || movie.poster_url || ''}
                  >
                    <source src={videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Play className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p>Chưa có video cho phim này</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Episode List - Desktop */}
            {episodes.length > 1 && (
              <div className={`hidden lg:block w-72 shrink-0 ${showEpisodes ? 'block' : 'hidden'}`}>
                <div className="bg-slate-900/50 rounded-2xl p-4 ring-1 ring-white/10 max-h-[400px] overflow-y-auto">
                  <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Danh Sách Tập</h3>
                  <div className="space-y-2">
                    {episodes.map((ep) => (
                      <button
                        key={ep.id}
                        onClick={() => {
                          setSelectedEpisode(ep);
                          document.getElementById('player')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2 ${
                          selectedEpisode?.id === ep.id
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        <span className="font-mono text-xs shrink-0">#{ep.episode_number}</span>
                        <span className="truncate">{ep.title || `Tập ${ep.episode_number}`}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Episode List - Mobile */}
          {episodes.length > 1 && showEpisodes && (
            <div className="lg:hidden mt-4">
              <div className="bg-slate-900/50 rounded-2xl p-4 ring-1 ring-white/10 max-h-300 overflow-y-auto">
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {episodes.map((ep) => (
                    <button
                      key={ep.id}
                      onClick={() => {
                        setSelectedEpisode(ep);
                        setShowEpisodes(false);
                        document.getElementById('player')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`px-2 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedEpisode?.id === ep.id
                          ? 'bg-rose-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {ep.episode_number}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Movies */}
        {related.length > 0 && (
          <div className="mt-16 pb-16">
            <h2 className="text-xl lg:text-2xl font-bold text-white mb-6">Phim Liên Quan</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4">
              {related.map((m) => (
                <MovieCard key={m.id} movie={m} onClick={() => onNavigate(`/phim/${m.slug}`)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
