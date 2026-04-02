/**
 * ShoesAdd.jsx
 * Mục đích: Trang thêm mới một Shoes vào hệ thống.
 * Chức năng:
 *   - Form nhập liệu với đầy đủ các fields của ShoesRequest
 *   - Validation cơ bản: required, kiểu dữ liệu, định dạng ngày
 *   - Dropdown chọn Category (gọi API lấy danh sách)
 *   - Gọi API POST để tạo mới và điều hướng về ShoesList sau khi thành công
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container, Form, Button, Row, Col,
  Alert, Spinner, Card
} from 'react-bootstrap';
import { createShoes } from '../api/shoesApi';
import { getAllCategories } from '../api/categoryApi';

/**
 * Component ShoesAdd
 * Hiển thị form nhập liệu để thêm mới shoes.
 * Sau khi submit thành công, điều hướng về trang danh sách.
 */
const ShoesAdd = () => {
  // State lưu dữ liệu form - tương ứng với ShoesRequest DTO
  const [formData, setFormData] = useState({
    shoesName: '',
    price: '',
    quantity: '',
    manufacturer: '',
    productionDate: '',  // Định dạng: yyyy-MM-dd (từ HTML input type="date")
    importDate: '',      // Định dạng: yyyy-MM-dd (từ HTML input type="date")
    categoryId: '',
  });

  // State lưu danh sách categories cho dropdown
  const [categories, setCategories] = useState([]);

  // State lưu các lỗi validation theo từng field
  const [errors, setErrors] = useState({});

  // State quản lý trạng thái đang gửi form
  const [submitting, setSubmitting] = useState(false);

  // State quản lý lỗi chung từ API
  const [apiError, setApiError] = useState(null);

  const navigate = useNavigate();

  // Tải danh sách categories khi component được mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res.data);
      } catch {
        setApiError('Failed to load categories.');
      }
    };
    fetchCategories();
  }, []);

  /**
   * Hàm xử lý khi người dùng thay đổi giá trị của bất kỳ input nào
   * Cập nhật formData và xóa lỗi của field đó
   * @param {Event} e - Sự kiện onChange của input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Cập nhật field tương ứng trong formData bằng spread operator
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Xóa lỗi của field vừa thay đổi để UX tốt hơn
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  /**
   * Hàm validate toàn bộ form trước khi submit
   * Kiểm tra các quy tắc: required, kiểu số, khoảng giá trị
   * @returns {boolean} true nếu form hợp lệ, false nếu có lỗi
   */
  const validate = () => {
    const newErrors = {};

    // Validate shoesName: bắt buộc, không được để trống
    if (!formData.shoesName.trim()) {
      newErrors.shoesName = 'Shoes name is required.';
    }

    // Validate price: bắt buộc, phải là số dương
    if (!formData.price) {
      newErrors.price = 'Price is required.';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number.';
    }

    // Validate quantity: bắt buộc, phải là số nguyên không âm
    if (formData.quantity === '') {
      newErrors.quantity = 'Quantity is required.';
    } else if (!Number.isInteger(Number(formData.quantity)) || Number(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity must be a non-negative integer.';
    }

    // Validate manufacturer: bắt buộc
    if (!formData.manufacturer.trim()) {
      newErrors.manufacturer = 'Manufacturer is required.';
    }

    // Validate productionDate: bắt buộc
    if (!formData.productionDate) {
      newErrors.productionDate = 'Production date is required.';
    }

    // Validate importDate: bắt buộc
    if (!formData.importDate) {
      newErrors.importDate = 'Import date is required.';
    }

    // Validate categoryId: bắt buộc, phải chọn category
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required.';
    }

    // Cập nhật state lỗi
    setErrors(newErrors);
    // Trả về true nếu không có lỗi nào (object rỗng)
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Hàm chuyển chuỗi ngày từ định dạng yyyy-MM-dd (HTML input)
   * sang timestamp (milliseconds) để gửi lên Spring Boot API
   * Spring Boot mặc định nhận java.util.Date dưới dạng timestamp
   * @param {string} dateString - Chuỗi ngày dạng yyyy-MM-dd
   * @returns {number|null} Timestamp milliseconds hoặc null
   */
  const toTimestamp = (dateString) => {
    if (!dateString) return null;
    // new Date('yyyy-MM-dd') tạo Date object và .getTime() trả về milliseconds
    return new Date(dateString).getTime();
  };

  /**
   * Hàm xử lý submit form
   * Validate trước, sau đó gọi API tạo mới và điều hướng về danh sách
   * @param {Event} e - Sự kiện submit của form
   */
  const handleSubmit = async (e) => {
    // Ngăn form reload trang (hành vi mặc định của HTML form)
    e.preventDefault();

    // Kiểm tra validation trước khi gửi
    if (!validate()) return;

    setSubmitting(true);
    setApiError(null);

    try {
      // Chuẩn bị dữ liệu request theo ShoesRequest DTO
      const requestData = {
        shoesName: formData.shoesName.trim(),
        price: Number(formData.price),         // Chuyển string sang number
        quantity: Number(formData.quantity),    // Chuyển string sang number
        manufacturer: formData.manufacturer.trim(),
        productionDate: toTimestamp(formData.productionDate), // Chuyển sang timestamp
        importDate: toTimestamp(formData.importDate),         // Chuyển sang timestamp
        categoryId: Number(formData.categoryId), // Chuyển string sang number (Long)
      };

      // Gọi API POST để tạo mới
      await createShoes(requestData);

      // Điều hướng về trang danh sách sau khi tạo thành công
      navigate('/', { state: { message: 'Shoes added successfully!' } });
    } catch (err) {
      // Hiển thị lỗi từ API (ví dụ: tên shoes đã tồn tại)
      if (err.response && err.response.data && err.response.data.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError('Failed to add shoes. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h4">Add New Shoes</Card.Header>
            <Card.Body>
              {/* Hiển thị lỗi từ API nếu có */}
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
                    // isInvalid: hiển thị viền đỏ khi có lỗi
                    isInvalid={!!errors.shoesName}
                    placeholder="Enter shoes name"
                  />
                  {/* Feedback lỗi hiển thị inline dưới input */}
                  <Form.Control.Feedback type="invalid">
                    {errors.shoesName}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Fields Price và Quantity trên cùng một hàng */}
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

                {/* Fields Production Date và Import Date trên cùng một hàng */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="productionDate">
                      <Form.Label>Production Date <span className="text-danger">*</span></Form.Label>
                      {/* type="date" hiển thị date picker, format yyyy-MM-dd */}
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

                {/* Field: Category - Dropdown chọn từ danh sách */}
                <Form.Group className="mb-3" controlId="categoryId">
                  <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                  {/* Form.Select: component dropdown của React Bootstrap */}
                  <Form.Select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    isInvalid={!!errors.categoryId}
                  >
                    <option value="">-- Select Category --</option>
                    {/* Render danh sách category từ API */}
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
                    {/* Hiển thị spinner khi đang submit */}
                    {submitting ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Saving...
                      </>
                    ) : 'Save'}
                  </Button>
                  {/* Nút Cancel: quay về trang danh sách */}
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

export default ShoesAdd;
