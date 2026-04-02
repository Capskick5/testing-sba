/**
 * ShoesView.jsx
 * Mục đích: Trang xem chi tiết thông tin của một Shoes.
 * Chức năng:
 *   - Tải thông tin shoes từ API theo ID trên URL
 *   - Hiển thị tất cả các field dưới dạng read-only (chỉ xem, không chỉnh sửa)
 *   - Khác với màn hình Edit: không có form input, chỉ hiển thị text
 *   - Có nút quay lại danh sách và nút chuyển sang trang Edit
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container, Row, Col, Card, Button,
  Alert, Spinner, Table
} from 'react-bootstrap';
import { getShoesById } from '../api/shoesApi';

/**
 * Component ShoesView
 * Hiển thị thông tin chi tiết của 1 shoes ở chế độ chỉ đọc (read-only).
 */
const ShoesView = () => {
  // Lấy id từ URL params (ví dụ: /shoes/view/5 → id = "5")
  const { id } = useParams();

  // State lưu thông tin shoes từ API
  const [shoe, setShoe] = useState(null);

  // State quản lý trạng thái loading
  const [loading, setLoading] = useState(true);

  // State quản lý lỗi
  const [error, setError] = useState(null);

  // Tải thông tin shoes khi component mount hoặc khi id thay đổi
  useEffect(() => {
    const fetchShoe = async () => {
      setLoading(true);
      try {
        const res = await getShoesById(id);
        setShoe(res.data);
      } catch {
        setError('Failed to load shoes details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchShoe();
  }, [id]);

  /**
   * Hàm format ngày từ timestamp (số ms) hoặc ISO string sang dd/MM/yyyy
   * @param {number|string} dateValue - Giá trị ngày từ API
   * @returns {string} Chuỗi ngày định dạng dd/MM/yyyy
   */
  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    const date = new Date(dateValue);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Hiển thị spinner khi đang tải
  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading...</p>
      </Container>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
        <Link to="/">
          <Button variant="secondary">Back to List</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h4">Shoes Details</Card.Header>
            <Card.Body>
              {shoe && (
                /* Dùng Table để hiển thị thông tin dạng label - value
                   Cách này gọn gàng và đồng nhất hơn dùng Row/Col */
                <Table bordered>
                  <tbody>
                    <tr>
                      <th style={{ width: '35%' }} className="table-light">Shoes ID</th>
                      <td>{shoe.shoesId}</td>
                    </tr>
                    <tr>
                      <th className="table-light">Shoes Name</th>
                      <td>{shoe.shoesName}</td>
                    </tr>
                    <tr>
                      <th className="table-light">Price</th>
                      {/* toLocaleString() format số theo locale của trình duyệt */}
                      <td>{shoe.price ? shoe.price.toLocaleString() : 'N/A'}</td>
                    </tr>
                    <tr>
                      <th className="table-light">Quantity</th>
                      <td>{shoe.quantity}</td>
                    </tr>
                    <tr>
                      <th className="table-light">Manufacturer</th>
                      <td>{shoe.manufacturer}</td>
                    </tr>
                    <tr>
                      <th className="table-light">Production Date</th>
                      <td>{formatDate(shoe.productionDate)}</td>
                    </tr>
                    <tr>
                      <th className="table-light">Import Date</th>
                      <td>{formatDate(shoe.importDate)}</td>
                    </tr>
                    <tr>
                      <th className="table-light">Category</th>
                      <td>{shoe.categoryName}</td>
                    </tr>
                  </tbody>
                </Table>
              )}

              {/* Các nút hành động */}
              <div className="d-flex gap-2">
                {/* Nút quay về danh sách */}
                <Link to="/">
                  <Button variant="secondary">Back to List</Button>
                </Link>
                {/* Nút chuyển sang trang chỉnh sửa */}
                <Link to={`/shoes/edit/${id}`}>
                  <Button variant="warning">Edit</Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ShoesView;
