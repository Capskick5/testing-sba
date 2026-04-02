/**
 * main.jsx
 * Mục đích: Điểm khởi đầu (entry point) của ứng dụng React.
 * File này chịu trách nhiệm:
 *   - Import Bootstrap CSS để áp dụng styling mặc định
 *   - Mount (gắn) component App vào DOM element có id="root" trong index.html
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Import Bootstrap CSS - bắt buộc để React Bootstrap hoạt động đúng
// Phải import trước khi import bất kỳ component nào
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App.jsx';

// createRoot: API của React 18+ để render ứng dụng
// getElementById('root'): tìm element trong index.html
createRoot(document.getElementById('root')).render(
  // StrictMode: bật các cảnh báo bổ sung trong môi trường development
  <StrictMode>
    <App />
  </StrictMode>,
);
