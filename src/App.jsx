/**
 * App.jsx
 * Mục đích: Component gốc của ứng dụng React.
 * Thiết lập cấu hình routing (điều hướng) cho toàn bộ ứng dụng
 * sử dụng React Router DOM.
 * 
 * Cấu trúc routing:
 *   /                  → ShoesList (trang chủ - danh sách shoes)
 *   /shoes/add         → ShoesAdd (thêm shoes mới)
 *   /shoes/edit/:id    → ShoesEdit (chỉnh sửa shoes theo id)
 *   /shoes/view/:id    → ShoesView (xem chi tiết shoes theo id)
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import các component và pages
import AppNavbar from './components/AppNavbar';
import ShoesList from './pages/ShoesList';
import ShoesAdd from './pages/ShoesAdd';
import ShoesEdit from './pages/ShoesEdit';
import ShoesView from './pages/ShoesView';

/**
 * Component App - Root component
 * BrowserRouter: sử dụng HTML5 History API để quản lý URL
 * Routes: container chứa tất cả các Route
 * Route: mapping giữa path URL và component tương ứng
 */
const App = () => {
  return (
    // BrowserRouter bọc toàn bộ ứng dụng để cho phép điều hướng
    <Router>
      {/* AppNavbar luôn hiển thị ở đầu trang bất kể route nào */}
      <AppNavbar />

      {/* Vùng nội dung chính - thay đổi theo route */}
      <Routes>
        {/* Trang chủ: danh sách shoes */}
        <Route path="/" element={<ShoesList />} />

        {/* Trang thêm shoes mới */}
        <Route path="/shoes/add" element={<ShoesAdd />} />

        {/* Trang chỉnh sửa shoes - :id là tham số động từ URL */}
        <Route path="/shoes/edit/:id" element={<ShoesEdit />} />

        {/* Trang xem chi tiết shoes */}
        <Route path="/shoes/view/:id" element={<ShoesView />} />
      </Routes>
    </Router>
  );
};

export default App;
