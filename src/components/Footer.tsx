import { Film } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 mt-16">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Phim<span className="text-rose-500">HDC</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Nền tảng xem phim trực tuyến miễn phí, nổi bật với chất lượng hình ảnh cao và giao diện dễ sử dụng. Kho phim với hơn 33.000+ tựa phim mới và hấp dẫn.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Danh Mục</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-rose-400 transition-colors cursor-pointer">Phim Ngắn</li>
              <li className="hover:text-rose-400 transition-colors cursor-pointer">Top Phim Ngày</li>
              <li className="hover:text-rose-400 transition-colors cursor-pointer">Phim Mới</li>
              <li className="hover:text-rose-400 transition-colors cursor-pointer">Phim Hoàn Tất</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Thể Loại</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm text-gray-400">
              <li className="hover:text-rose-400 transition-colors cursor-pointer">Tình Cảm</li>
              <li className="hover:text-rose-400 transition-colors cursor-pointer">Hành Động</li>
              <li className="hover:text-rose-400 transition-colors cursor-pointer">Cổ Trang</li>
              <li className="hover:text-rose-400 transition-colors cursor-pointer">Hài Hước</li>
              <li className="hover:text-rose-400 transition-colors cursor-pointer">Tâm Lý</li>
              <li className="hover:text-rose-400 transition-colors cursor-pointer">Phiêu Lưu</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-sm text-gray-500">
            © 2026 PhimHDC. Xem Phim HD VietSub Thuyết Minh. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
