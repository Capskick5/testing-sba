/**
 * ShoesList.jsx
 * Mục đích: Trang chính hiển thị danh sách tất cả shoes dưới dạng bảng có phân trang.
 * Chức năng:
 *   - Hiển thị danh sách shoes với các thông tin cơ bản
 *   - Phân trang (pagination) để điều hướng giữa các trang
 *   - Nút/link để xem chi tiết (View), chỉnh sửa (Edit), xóa (Delete) từng shoes
 *   - Nút Add New để thêm shoes mới
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Table, Button, Container, Pagination,
  Alert, Spinner, Row, Col
} from 'react-bootstrap';
import { getShoesList, deleteShoes } from '../api/shoesApi';

// Số lượng shoes hiển thị trên mỗi trang
const PAGE_SIZE = 5;

/**
 * Component ShoesList
 * Trang danh sách shoes với phân trang và các thao tác CRUD cơ bản.
 */
const ShoesList = () => {
  // State lưu danh sách shoes trả về từ API
  const [shoesList, setShoesList] = useState([]);

  // State lưu thông tin phân trang từ API (PageResponse)
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
  });

  // State quản lý trạng thái loading
  const [loading, setLoading] = useState(false);

  // State quản lý thông báo lỗi
  const [error, setError] = useState(null);

  // State quản lý thông báo thành công
  const [successMsg, setSuccessMsg] = useState(null);

  /**
   * Hàm tải danh sách shoes từ API với phân trang
   * @param {number} page - Số trang cần tải (bắt đầu từ 0)
   */
  const loadShoesList = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      // Gọi API lấy danh sách shoes có phân trang
      const res = await getShoesList(page, PAGE_SIZE);
      // Lưu danh sách shoes vào state
      setShoesList(res.data.content);
      // Lưu thông tin phân trang vào state
      setPagination({
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
        totalElements: res.data.totalElements,
        first: res.data.first,
        last: res.data.last,
      });
    } catch {
      setError('Failed to load shoes list. Please check the API server.');
    } finally {
      // Luôn tắt loading dù thành công hay thất bại
      setLoading(false);
    }
  };

  // useEffect: tải danh sách khi component được mount lần đầu
  useEffect(() => {
    loadShoesList(0);
  }, []);

  /**
   * Hàm xử lý xóa shoes
   * Hiển thị confirm dialog trước khi xóa thật sự
   * @param {number} id - ID của shoes cần xóa
   */
  const handleDelete = async (id) => {
    // Hỏi xác nhận người dùng trước khi xóa
    if (window.confirm('Are you sure you want to delete this shoe?')) {
      try {
        await deleteShoes(id);
        setSuccessMsg('Shoes deleted successfully!');
        // Tải lại trang hiện tại sau khi xóa
        loadShoesList(pagination.currentPage);
        // Tự ẩn thông báo thành công sau 3 giây
        setTimeout(() => setSuccessMsg(null), 3000);
      } catch {
        setError('Failed to delete. Please try again.');
      }
    }
  };

  /**
   * Hàm format ngày từ timestamp (số) hoặc chuỗi ISO sang định dạng dd/MM/yyyy
   * Spring Boot mặc định serialize java.util.Date dưới dạng timestamp (số ms)
   * @param {number|string} dateValue - Timestamp hoặc ISO string từ API
   * @returns {string} Chuỗi ngày theo định dạng dd/MM/yyyy
   */
  const formatDate = (dateValue) => {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    // Dùng padStart(2,'0') để đảm bảo ngày/tháng luôn có 2 chữ số
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  /**
   * Tạo danh sách các Pagination.Item cho component phân trang
   * @returns {Array} Mảng các Pagination.Item component
   */
  const renderPaginationItems = () => {
    const items = [];
    for (let i = 0; i < pagination.totalPages; i++) {
      items.push(
        <Pagination.Item
          key={i}
          // Highlight trang đang active
          active={i === pagination.currentPage}
          onClick={() => loadShoesList(i)}
        >
          {i + 1}
        </Pagination.Item>
      );
    }
    return items;
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <h2>Shoes List</h2>
        </Col>
        <Col className="text-end">
          {/* Link điều hướng đến trang thêm shoes mới */}
          <Link to="/shoes/add">
            <Button variant="primary">Add New Shoes</Button>
          </Link>
        </Col>
      </Row>

      {/* Hiển thị thông báo thành công nếu có */}
      {successMsg && <Alert variant="success" onClose={() => setSuccessMsg(null)} dismissible>{successMsg}</Alert>}

      {/* Hiển thị thông báo lỗi nếu có */}
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      {/* Hiển thị spinner khi đang tải dữ liệu */}
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading...</p>
        </div>
      ) : (
        <>
          {/* Bảng hiển thị danh sách shoes */}
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Shoes Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Manufacturer</th>
                <th>Production Date</th>
                <th>Import Date</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shoesList.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center">No shoes found.</td>
                </tr>
              ) : (
                shoesList.map((shoe, index) => (
                  <tr key={shoe.shoesId}>
                    {/* STT = (trang hiện tại × số item/trang) + vị trí trong trang + 1 */}
                    <td>{pagination.currentPage * PAGE_SIZE + index + 1}</td>
                    <td>{shoe.shoesName}</td>
                    <td>{shoe.price.toLocaleString()}</td>
                    <td>{shoe.quantity}</td>
                    <td>{shoe.manufacturer}</td>
                    <td>{formatDate(shoe.productionDate)}</td>
                    <td>{formatDate(shoe.importDate)}</td>
                    <td>{shoe.categoryName}</td>
                    <td>
                      {/* Link xem chi tiết */}
                      <Link to={`/shoes/view/${shoe.shoesId}`} className="me-2 text-info">
                        View
                      </Link>
                      {/* Link chỉnh sửa */}
                      <Link to={`/shoes/edit/${shoe.shoesId}`} className="me-2 text-warning">
                        Edit
                      </Link>
                      {/* Nút xóa - có confirm dialog */}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(shoe.shoesId)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* Phân trang - chỉ hiển thị khi có nhiều hơn 1 trang */}
          {pagination.totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center">
              <Pagination className="mb-0">
                {/* Nút về trang đầu */}
                <Pagination.First
                  onClick={() => loadShoesList(0)}
                  disabled={pagination.first}
                />
                {/* Nút về trang trước */}
                <Pagination.Prev
                  onClick={() => loadShoesList(pagination.currentPage - 1)}
                  disabled={pagination.first}
                />
                {/* Các trang số */}
                {renderPaginationItems()}
                {/* Nút đến trang tiếp theo */}
                <Pagination.Next
                  onClick={() => loadShoesList(pagination.currentPage + 1)}
                  disabled={pagination.last}
                />
                {/* Nút đến trang cuối */}
                <Pagination.Last
                  onClick={() => loadShoesList(pagination.totalPages - 1)}
                  disabled={pagination.last}
                />
              </Pagination>
              <span className="text-muted">
                Total: {pagination.totalElements} shoes
              </span>
            </div>
          )}

          {/* Hiển thị tổng số khi chỉ có 1 trang */}
          {pagination.totalPages <= 1 && (
            <p className="text-muted">Total: {pagination.totalElements} shoes</p>
          )}
        </>
      )}
    </Container>
  );
};

export default ShoesList;
