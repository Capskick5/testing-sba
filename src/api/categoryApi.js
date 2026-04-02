/**
 * categoryApi.js
 * Mục đích: Chứa các hàm gọi API liên quan đến entity Category.
 * Category là bảng One trong quan hệ One-to-Many với Shoes.
 * Chủ yếu dùng để lấy danh sách category cho dropdown trong form Shoes.
 */

import axiosInstance from './axiosConfig';

/**
 * Lấy tất cả danh mục (categories) - dùng cho dropdown chọn category khi thêm/sửa shoes
 * @returns Promise chứa List<ShoesCategoryResponse>: [{ id, categoryName, description }]
 */
export const getAllCategories = () => {
  return axiosInstance.get('/categories');
};
