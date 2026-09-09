import { Play, Star, Eye } from 'lucide-react';
import type { Movie } from '@/types';
import { statusLabel, statusColor } from '@/types';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative rounded-xl overflow-hidden bg-slate-800/50 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-rose-500/20 text-left w-full"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
            <Play className="w-12 h-12 text-gray-600" />
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {movie.is_new && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white">NEW</span>
          )}
          {movie.quality && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur-sm">
              {movie.quality}
            </span>
          )}
        </div>

        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${statusColor(movie.status)}`}>
            {statusLabel(movie.status)}
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-14 h-14 rounded-full bg-rose-500/90 flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-lg shadow-rose-500/50">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight mb-1">{movie.title}</h3>
          <div className="flex items-center gap-2 text-[11px] text-gray-300">
            {movie.year && <span>{movie.year}</span>}
            {movie.rating > 0 && (
              <span className="flex items-center gap-0.5 text-amber-400">
                <Star className="w-3 h-3 fill-amber-400" />
                {movie.rating}
              </span>
            )}
            <span className="flex items-center gap-0.5">
              <Eye className="w-3 h-3" />
              {movie.views ? Math.round(movie.views / 1000) + 'K' : '0'}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
