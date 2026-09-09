export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface Movie {
  id: string;
  title: string;
  slug: string;
  original_title: string | null;
  description: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  video_url: string | null;
  trailer_url: string | null;
  year: number | null;
  country: string | null;
  duration: string | null;
  quality: string | null;
  status: string | null;
  type: string | null;
  language: string | null;
  rating: number | null;
  views: number | null;
  is_featured: boolean;
  is_top_day: boolean;
  is_new: boolean;
  episode_count: number | null;
  created_at: string;
  genres?: Genre[];
}

export interface Episode {
  id: string;
  movie_id: string;
  episode_number: number;
  title: string | null;
  video_url: string;
  duration: string | null;
}

export interface MovieWithGenres extends Movie {
  genres: Genre[];
}

export function statusLabel(status: string | null): string {
  switch (status) {
    case 'completed':
      return 'Hoàn Tất';
    case 'ongoing':
      return 'Đang Chiếu';
    case 'trailer':
      return 'Trailer';
    default:
      return '';
  }
}

export function statusColor(status: string | null): string {
  switch (status) {
    case 'completed':
      return 'bg-emerald-500';
    case 'ongoing':
      return 'bg-blue-500';
    case 'trailer':
      return 'bg-amber-500';
    default:
      return 'bg-gray-500';
  }
}
