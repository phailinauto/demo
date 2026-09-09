import { useEffect, useState } from 'react';
import { Search, Menu, X, Film, Heart, Home } from 'lucide-react';
import type { Genre } from '@/types';

interface HeaderProps {
  genres: Genre[];
  onSearch: (query: string) => void;
  onNavigate: (path: string) => void;
  currentPath: string;
}

export default function Header({ genres, onSearch, onNavigate, currentPath }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: 'Trang Chủ', path: '/', icon: Home },
    { label: 'Phim Ngắn', path: '/the-loai/phim-ngan', icon: Film },
    { label: 'Top Phim Ngày', path: '/danh-sach/top-phim-ngay', icon: Film },
    { label: 'Yêu Thích', path: '/danh-sach/yeu-thich', icon: Heart },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/95 backdrop-blur-md shadow-lg shadow-black/50' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <button onClick={() => onNavigate('/')} className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center transition-transform group-hover:scale-110">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight hidden sm:block">
              Phim<span className="text-rose-500">HDC</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    active ? 'text-rose-400 bg-rose-500/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}

            {/* Genre Dropdown */}
            <div className="relative group">
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
                <Film className="w-4 h-4" />
                Thể Loại
              </button>
              <div className="absolute top-full left-0 mt-1 w-64 bg-slate-900/95 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <div className="grid grid-cols-2 gap-1">
                  {genres.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => onNavigate(`/the-loai/${g.slug}`)}
                      className="px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-rose-400 hover:bg-white/5 transition-colors text-left"
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Search & Mobile Menu */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className={`relative ${searchOpen ? 'block' : 'hidden'} lg:block`}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm phim..."
                className="w-40 lg:w-64 bg-white/10 text-white placeholder-gray-400 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:bg-white/15 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
                    active ? 'text-rose-400 bg-rose-500/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
            <div className="pt-2 pb-1 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Thể Loại</div>
            <div className="grid grid-cols-2 gap-1 px-2">
              {genres.map((g) => (
                <button
                  key={g.id}
                  onClick={() => {
                    onNavigate(`/the-loai/${g.slug}`);
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-rose-400 hover:bg-white/5 transition-colors text-left"
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
