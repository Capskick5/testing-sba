/**
 * axiosConfig.js
 * Mục đích: Cấu hình Axios instance dùng chung cho toàn bộ project.
 * Tất cả các API call đều sử dụng instance này để đảm bảo đồng nhất
 * về baseURL, headers, và các xử lý chung.
 */

import axios from 'axios';

// Tạo một axios instance với cấu hình mặc định
// baseURL: địa chỉ gốc của Spring Boot API (port 8080)
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
