/**
 * ShoesEdit.jsx
 * Mục đích: Trang chỉnh sửa thông tin Shoes đã tồn tại.
 * Chức năng:
 *   - Tải thông tin hiện tại của shoes từ API theo ID trên URL
 *   - Form nhập liệu đã được điền sẵn dữ liệu cũ
 *   - Validate tương tự trang Add New
 *   - Gọi API PUT để cập nhật và điều hướng về danh sách sau khi thành công
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Container, Form, Button, Row, Col,
  Alert, Spinner, Card
} from 'react-bootstrap';
import { getShoesById, updateShoes } from '../api/shoesApi';
import { getAllCategories } from '../api/categoryApi';

/**
 * Component ShoesEdit
 * Hiển thị form chỉnh sửa shoes, tải dữ liệu cũ từ API và cho phép cập nhật.
 */
const ShoesEdit = () => {
  // useParams: lấy tham số id từ URL (ví dụ: /shoes/edit/5 → id = "5")
  const { id } = useParams();
  const navigate = useNavigate();

  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    shoesName: '',
    price: '',
    quantity: '',
    manufacturer: '',
    productionDate: '',
    importDate: '',
    categoryId: '',
  });

  // State danh sách categories cho dropdown
  const [categories, setCategories] = useState([]);

  // State lỗi validation theo từng field
  const [errors, setErrors] = useState({});

  // State trạng thái đang tải dữ liệu ban đầu
  const [loading, setLoading] = useState(true);

  // State trạng thái đang submit form
  const [submitting, setSubmitting] = useState(false);

  // State lỗi chung từ API
  const [apiError, setApiError] = useState(null);

  /**
   * Hàm chuyển timestamp (milliseconds) hoặc ISO string
   * sang định dạng yyyy-MM-dd để set vào HTML input type="date"
   * @param {number|string} dateValue - Timestamp hoặc ISO string từ API
   * @returns {string} Chuỗi ngày dạng yyyy-MM-dd
   */
  const toInputDate = (dateValue) => {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    // Format chuẩn cho HTML input[type="date"]
    return `${year}-${month}-${day}`;
  };

  // Tải dữ liệu shoes và categories khi component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Gọi 2 API song song để tối ưu thời gian tải
        // Promise.all: chờ tất cả promises hoàn thành
        const [shoesRes, categoriesRes] = await Promise.all([
          getShoesById(id),
          getAllCategories(),
        ]);

        const shoe = shoesRes.data;
        setCategories(categoriesRes.data);

        // Điền dữ liệu cũ vào form, chuyển đổi định dạng ngày phù hợp
        setFormData({
          shoesName: shoe.shoesName || '',
          price: shoe.price || '',
          quantity: shoe.quantity || '',
          manufacturer: shoe.manufacturer || '',
          productionDate: toInputDate(shoe.productionDate),
          importDate: toInputDate(shoe.importDate),
          // Cần tìm categoryId từ categoryName vì ShoesResponse chỉ trả về categoryName
          // Giải pháp: tìm trong danh sách categories
          categoryId: '', // Sẽ set sau khi có categories
        });

        // Tìm categoryId từ categoryName
        const matchedCat = categoriesRes.data.find(
          (cat) => cat.categoryName === shoe.categoryName
        );
        if (matchedCat) {
          setFormData((prev) => ({ ...prev, categoryId: String(matchedCat.id) }));
        }
      } catch {
        setApiError('Failed to load shoes data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]); // Re-run khi id thay đổi

  /**
   * Hàm xử lý khi người dùng thay đổi giá trị input
   * Cập nhật formData và xóa lỗi của field đó
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  /**
   * Hàm validate form - kiểm tra các quy tắc hợp lệ
   * @returns {boolean} true nếu hợp lệ
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.shoesName.trim()) {
      newErrors.shoesName = 'Shoes name is required.';
    }
    if (!formData.price) {
      newErrors.price = 'Price is required.';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number.';
    }
    if (formData.quantity === '') {
      newErrors.quantity = 'Quantity is required.';
    } else if (!Number.isInteger(Number(formData.quantity)) || Number(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity must be a non-negative integer.';
    }
    if (!formData.manufacturer.trim()) {
      newErrors.manufacturer = 'Manufacturer is required.';
    }
    if (!formData.productionDate) {
      newErrors.productionDate = 'Production date is required.';
    }
    if (!formData.importDate) {
      newErrors.importDate = 'Import date is required.';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Chuyển chuỗi yyyy-MM-dd sang timestamp milliseconds để gửi API
   */
  const toTimestamp = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).getTime();
  };

  /**
   * Hàm xử lý submit form cập nhật
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    setApiError(null);

    try {
      // Chuẩn bị dữ liệu request theo ShoesRequest DTO
      const requestData = {
        shoesName: formData.shoesName.trim(),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        manufacturer: formData.manufacturer.trim(),
        productionDate: toTimestamp(formData.productionDate),
        importDate: toTimestamp(formData.importDate),
        categoryId: Number(formData.categoryId),
      };

      // Gọi API PUT để cập nhật theo ID
      await updateShoes(id, requestData);

      // Điều hướng về danh sách sau khi cập nhật thành công
      navigate('/', { state: { message: 'Shoes updated successfully!' } });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError('Failed to update shoes. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Hiển thị spinner trong khi tải dữ liệu ban đầu
  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading shoes data...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h4">Edit Shoes</Card.Header>
            <Card.Body>
              {apiError && <Alert variant="danger">{apiError}</Alert>}

              <Form onSubmit={handleSubmit} noValidate>
                {/* Field: Shoes Name */}
                <Form.Group className="mb-3" controlId="shoesName">
                  <Form.Label>Shoes Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="shoesName"
                    value={formData.shoesName}
                    onChange={handleChange}
                    isInvalid={!!errors.shoesName}
                    placeholder="Enter shoes name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.shoesName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="price">
                      <Form.Label>Price <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        isInvalid={!!errors.price}
                        placeholder="Enter price"
                        min="0"
                        step="0.01"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.price}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="quantity">
                      <Form.Label>Quantity <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        isInvalid={!!errors.quantity}
                        placeholder="Enter quantity"
                        min="0"
                        step="1"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.quantity}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Field: Manufacturer */}
                <Form.Group className="mb-3" controlId="manufacturer">
                  <Form.Label>Manufacturer <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    isInvalid={!!errors.manufacturer}
                    placeholder="Enter manufacturer"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.manufacturer}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="productionDate">
                      <Form.Label>Production Date <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="date"
                        name="productionDate"
                        value={formData.productionDate}
                        onChange={handleChange}
                        isInvalid={!!errors.productionDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.productionDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="importDate">
                      <Form.Label>Import Date <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="date"
                        name="importDate"
                        value={formData.importDate}
                        onChange={handleChange}
                        isInvalid={!!errors.importDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.importDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Field: Category Dropdown */}
                <Form.Group className="mb-3" controlId="categoryId">
                  <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    isInvalid={!!errors.categoryId}
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.categoryId}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Các nút hành động */}
                <div className="d-flex gap-2">
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Updating...
                      </>
                    ) : 'Update'}
                  </Button>
                  <Link to="/">
                    <Button variant="secondary">Cancel</Button>
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ShoesEdit;
