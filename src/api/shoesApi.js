/**
 * shoesApi.js
 * Mục đích: Chứa tất cả các hàm gọi API liên quan đến entity Shoes.
 * Mỗi hàm tương ứng với một endpoint của Spring Boot REST API.
 * Sử dụng axiosInstance đã được cấu hình sẵn.
 */

import axiosInstance from './axiosConfig';

/**
 * Lấy danh sách shoes có phân trang
 * @param {number} page - Trang hiện tại (bắt đầu từ 0)
 * @param {number} size - Số lượng item mỗi trang
 * @param {string} sortBy - Field để sắp xếp (mặc định: shoesName)
 * @param {string} sortDir - Chiều sắp xếp: asc hoặc desc
 * @returns Promise chứa PageResponse<ShoesResponse>
 */
export const getShoesList = (page = 0, size = 5, sortBy = 'shoesName', sortDir = 'asc') => {
  // Gửi request GET với query params phân trang
  return axiosInstance.get('/shoes', { params: { page, size, sortBy, sortDir } });
};

/**
 * Lấy thông tin chi tiết 1 shoes theo ID
 * @param {number} id - ID của shoes cần lấy
 * @returns Promise chứa ShoesResponse
 */
export const getShoesById = (id) => {
  return axiosInstance.get(`/shoes/${id}`);
};

/**
 * Tạo mới 1 shoes
 * @param {Object} data - ShoesRequest: { shoesName, price, quantity, manufacturer, productionDate, importDate, categoryId }
 * @returns Promise chứa ShoesResponse vừa tạo
 */
export const createShoes = (data) => {
  return axiosInstance.post('/shoes', data);
};

/**
 * Cập nhật thông tin 1 shoes theo ID
 * @param {number} id - ID của shoes cần cập nhật
 * @param {Object} data - ShoesRequest chứa dữ liệu mới
 * @returns Promise chứa ShoesResponse đã cập nhật
 */
export const updateShoes = (id, data) => {
  return axiosInstance.put(`/shoes/${id}`, data);
};

/**
 * Xóa 1 shoes theo ID
 * @param {number} id - ID của shoes cần xóa
 * @returns Promise
 */
export const deleteShoes = (id) => {
  return axiosInstance.delete(`/shoes/${id}`);
};
