/**
 * AppNavbar.jsx
 * Mục đích: Thanh điều hướng (Navigation Bar) dùng chung cho toàn bộ ứng dụng.
 * Hiển thị tên ứng dụng và các link điều hướng chính.
 * Sử dụng React Bootstrap Navbar component.
 */

import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

/**
 * Component AppNavbar
 * Hiển thị navigation bar ở đầu trang với các link điều hướng.
 * useLocation() dùng để xác định trang hiện tại và highlight link tương ứng.
 */
const AppNavbar = () => {
  // Hook lấy thông tin về URL hiện tại
  const location = useLocation();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        {/* Logo / tên ứng dụng - click về trang chủ */}
        <Navbar.Brand as={Link} to="/">
          SBA301 - Shoe Management System
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            {/* Link điều hướng đến trang danh sách Shoes
                active: highlight khi đang ở trang tương ứng */}
            <Nav.Link
              as={Link}
              to="/"
              active={location.pathname === '/'}
            >
              Shoes List
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/shoes/add"
              active={location.pathname === '/shoes/add'}
            >
              Add New Shoes
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
