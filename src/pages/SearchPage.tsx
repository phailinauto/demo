import { useEffect, useState } from 'react';
import { Search, SearchX } from 'lucide-react';
import type { Movie } from '@/types';
import { searchMovies } from '@/lib/api';
import MovieCard from '@/components/MovieCard';

interface SearchPageProps {
  query: string;
  onNavigate: (path: string) => void;
}

export default function SearchPage({ query, onNavigate }: SearchPageProps) {
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const r = await searchMovies(query);
        setResults(r);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    })();
    window.scrollTo(0, 0);
  }, [query]);

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
          <Search className="w-8 h-8 text-rose-500" />
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Kết Quả Tìm Kiếm</h1>
            <p className="text-gray-400 text-sm mt-1">
              Tìm thấy {results.length} kết quả cho "{query}"
            </p>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <SearchX className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Không tìm thấy phim phù hợp</p>
            <p className="text-sm mt-2">Thử từ khóa khác hoặc duyệt theo thể loại</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4">
            {results.map((m) => (
              <MovieCard key={m.id} movie={m} onClick={() => onNavigate(`/phim/${m.slug}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
