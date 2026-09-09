/*
# Create movie streaming database schema

1. New Tables
- `genres`: movie genre/category lookup table (id, name, slug)
- `movies`: main movie table with title, description, poster, backdrop, video URL, year, status, rating, views, etc.
- `movie_genres`: many-to-many join between movies and genres
- `episodes`: episodes for series-type movies (id, movie_id, episode_number, title, video_url, duration)
- `favorites`: user favorites stored by session/device ID (no auth required)

2. Security
- Enable RLS on all tables.
- All tables are public/shared (no auth) — allow anon + authenticated CRUD.
- favorites are scoped by a client-generated session_id so each browser sees only its own favorites.

3. Important Notes
- Movies have a `type` column: 'single' (movie) or 'series' (phim bộ)
- Movies have a `status` column: 'ongoing', 'completed', 'trailer'
- Views counter tracks popularity for "Top Phim Ngày"
- Slug is used for SEO-friendly URLs
*/

CREATE TABLE IF NOT EXISTS genres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE genres ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_genres" ON genres;
CREATE POLICY "anon_select_genres" ON genres FOR SELECT
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS movies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  original_title text,
  description text,
  poster_url text,
  backdrop_url text,
  video_url text,
  trailer_url text,
  year int,
  country text,
  duration text,
  quality text DEFAULT 'HD',
  status text DEFAULT 'ongoing',
  type text DEFAULT 'single',
  language text DEFAULT 'Vietsub + Thuyết Minh',
  rating numeric DEFAULT 0,
  views bigint DEFAULT 0,
  imdb_id text,
  is_featured boolean DEFAULT false,
  is_top_day boolean DEFAULT false,
  is_new boolean DEFAULT false,
  episode_count int DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_movies" ON movies;
CREATE POLICY "anon_select_movies" ON movies FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_movies" ON movies;
CREATE POLICY "anon_insert_movies" ON movies FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_movies" ON movies;
CREATE POLICY "anon_update_movies" ON movies FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_movies" ON movies;
CREATE POLICY "anon_delete_movies" ON movies FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS movie_genres (
  movie_id uuid REFERENCES movies(id) ON DELETE CASCADE,
  genre_id uuid REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, genre_id)
);

ALTER TABLE movie_genres ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_movie_genres" ON movie_genres;
CREATE POLICY "anon_select_movie_genres" ON movie_genres FOR SELECT
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS episodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id uuid REFERENCES movies(id) ON DELETE CASCADE,
  episode_number int NOT NULL,
  title text,
  video_url text NOT NULL,
  duration text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_episodes" ON episodes;
CREATE POLICY "anon_select_episodes" ON episodes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_episodes" ON episodes;
CREATE POLICY "anon_insert_episodes" ON episodes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_episodes" ON episodes;
CREATE POLICY "anon_update_episodes" ON episodes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_episodes" ON episodes;
CREATE POLICY "anon_delete_episodes" ON episodes FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  movie_id uuid REFERENCES movies(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (session_id, movie_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_favorites" ON favorites;
CREATE POLICY "anon_select_favorites" ON favorites FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_favorites" ON favorites;
CREATE POLICY "anon_insert_favorites" ON favorites FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_favorites" ON favorites;
CREATE POLICY "anon_delete_favorites" ON favorites FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_movies_slug ON movies(slug);
CREATE INDEX IF NOT EXISTS idx_movies_featured ON movies(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_movies_top_day ON movies(is_top_day) WHERE is_top_day = true;
CREATE INDEX IF NOT EXISTS idx_movies_new ON movies(is_new) WHERE is_new = true;
CREATE INDEX IF NOT EXISTS idx_movies_views ON movies(views DESC);
CREATE INDEX IF NOT EXISTS idx_movies_created ON movies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_episodes_movie ON episodes(movie_id, episode_number);
CREATE INDEX IF NOT EXISTS idx_favorites_session ON favorites(session_id);
CREATE INDEX IF NOT EXISTS idx_movie_genres_genre ON movie_genres(genre_id);
