# SBA301 - Shoe Management System (SMS)

## 📋 Tổng Quan Dự Án

Đây là ứng dụng web quản lý giày dép (Shoe Management System) được xây dựng bằng React + Vite. Ứng dụng cho phép thực hiện các thao tác CRUD (Create, Read, Update, Delete) trên dữ liệu Shoes, kết nối với Spring Boot REST API ở backend.

---

## 🛠 Công Nghệ Sử Dụng

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **React** | 19.x | UI framework chính |
| **Vite** | 8.x | Build tool & dev server |
| **React Bootstrap** | 2.x | UI component library |
| **Bootstrap** | 5.x | CSS framework |
| **Axios** | 1.x | HTTP client gọi API |
| **React Router DOM** | 7.x | Client-side routing |
| **JavaScript** | ES2022+ | Ngôn ngữ lập trình (KHÔNG dùng TypeScript) |

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
sba301-pe-sms/
├── public/                    # Static assets (favicon, icons...)
├── src/
│   ├── api/                   # Layer giao tiếp với REST API
│   │   ├── axiosConfig.js     # Cấu hình Axios instance chung
│   │   ├── shoesApi.js        # Tất cả API calls cho Shoes
│   │   └── categoryApi.js     # API calls cho Category
│   ├── components/            # Shared components dùng nhiều nơi
│   │   └── AppNavbar.jsx      # Navigation bar
│   ├── pages/                 # Các trang (screens) của ứng dụng
│   │   ├── ShoesList.jsx      # Trang danh sách + phân trang
│   │   ├── ShoesAdd.jsx       # Trang thêm mới shoes
│   │   ├── ShoesEdit.jsx      # Trang chỉnh sửa shoes
│   │   └── ShoesView.jsx      # Trang xem chi tiết shoes
│   ├── App.jsx                # Root component + cấu hình routing
│   └── main.jsx               # Entry point - mount React vào DOM
├── index.html                 # HTML template (root element)
├── vite.config.js             # Cấu hình Vite
├── package.json               # Dependencies và scripts
└── PROJECT_GUIDE.md           # Tài liệu này
```

---

## 🗃 Cơ Sở Dữ Liệu (Quan Hệ)

```
Category (1) ──────── (Many) Shoes
  id                    shoesId
  categoryName          shoesName
  description           price
                        quantity
                        manufacturer
                        productionDate
                        importDate
                        categoryId (FK)
```

---

## 🔗 API Endpoints (Spring Boot - Port 8080)

### Shoes API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/shoes?page=0&size=5&sortBy=shoesName&sortDir=asc` | Lấy danh sách có phân trang |
| GET | `/api/shoes/{id}` | Lấy 1 shoes theo ID |
| POST | `/api/shoes` | Tạo mới shoes |
| PUT | `/api/shoes/{id}` | Cập nhật shoes theo ID |
| DELETE | `/api/shoes/{id}` | Xóa shoes theo ID |

### Category API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/categories` | Lấy tất cả categories |

---

## 📦 Cấu Trúc Dữ Liệu (DTOs)

### ShoesRequest (gửi lên API)
```json
{
  "shoesName": "Nike Air Max",
  "price": 2500000,
  "quantity": 50,
  "manufacturer": "Nike",
  "productionDate": 1704067200000,
  "importDate": 1706745600000,
  "categoryId": 1
}
```
> **Lưu ý**: `productionDate` và `importDate` gửi dưới dạng **timestamp (milliseconds)**

### ShoesResponse (nhận từ API)
```json
{
  "shoesId": 1,
  "shoesName": "Nike Air Max",
  "price": 2500000,
  "quantity": 50,
  "manufacturer": "Nike",
  "productionDate": 1704067200000,
  "importDate": 1706745600000,
  "categoryName": "Sport"
}
```

### PageResponse (phân trang)
```json
{
  "content": [...],
  "currentPage": 0,
  "pageSize": 5,
  "totalElements": 25,
  "totalPages": 5,
  "first": true,
  "last": false
}
```

---

## 🌊 Luồng Chạy Ứng Dụng

```
[Browser] → index.html
         → main.jsx          (Mount React + Import Bootstrap CSS)
         → App.jsx           (BrowserRouter + Routes setup)
         → AppNavbar.jsx     (Hiển thị navigation bar)
         → [Route matching]
             /                → ShoesList.jsx
             /shoes/add       → ShoesAdd.jsx
             /shoes/edit/:id  → ShoesEdit.jsx
             /shoes/view/:id  → ShoesView.jsx
```

### Luồng gọi API
```
Page Component
  → gọi hàm từ src/api/ (shoesApi.js / categoryApi.js)
  → axiosConfig.js (axiosInstance với baseURL http://localhost:8080/api)
  → Spring Boot REST API (port 8080)
  → Nhận response → cập nhật state → re-render UI
```

---

## 🖥 Các Màn Hình

### 1. Shoes List (`/`)
- Bảng danh sách shoes với các cột: #, Shoes Name, Price, Quantity, Manufacturer, Production Date, Import Date, Category, Actions
- Actions: **View** | **Edit** | **Delete**
- Phân trang ở dưới bảng (First, Prev, 1 2 3..., Next, Last)
- Nút **Add New Shoes** ở trên cùng

### 2. Add New Shoes (`/shoes/add`)
- Form với các fields: Shoes Name, Price, Quantity, Manufacturer, Production Date, Import Date, Category (dropdown)
- Validation inline (hiển thị đỏ dưới input)
- Nút **Save** và **Cancel**

### 3. Edit Shoes (`/shoes/edit/:id`)
- Giống màn hình Add New nhưng form được điền sẵn dữ liệu cũ
- Nút **Update** và **Cancel**

### 4. View Shoes (`/shoes/view/:id`)
- Bảng hiển thị tất cả thông tin ở chế độ read-only
- Nút **Back to List** và **Edit**

---

## ✅ Validation Rules

| Field | Quy tắc |
|-------|---------|
| Shoes Name | Bắt buộc (required) |
| Price | Bắt buộc, là số dương > 0 |
| Quantity | Bắt buộc, là số nguyên không âm ≥ 0 |
| Manufacturer | Bắt buộc |
| Production Date | Bắt buộc, định dạng dd/MM/yyyy |
| Import Date | Bắt buộc, định dạng dd/MM/yyyy |
| Category | Bắt buộc, phải chọn |

---

## 🚀 Cách Chạy Dự Án

### Yêu cầu
- Node.js 18+ 
- Spring Boot API đang chạy tại `http://localhost:8080`

### Bước 1: Cài dependencies
```bash
npm install
```

### Bước 2: Chạy development server
```bash
npm run dev
```

### Bước 3: Mở trình duyệt
```
http://localhost:5173
```

### Build production
```bash
npm run build
```

---

## 🔑 Kỹ Thuật Quan Trọng

### 1. React Hooks được sử dụng
- **`useState`**: Quản lý state cục bộ trong component
  ```jsx
  const [data, setData] = useState(initialValue);
  ```
- **`useEffect`**: Thực thi side effects (gọi API, subscriptions)
  ```jsx
  useEffect(() => {
    // Code chạy sau khi component render
    fetchData();
  }, [dependency]); // [] = chỉ chạy 1 lần khi mount
  ```
- **`useParams`**: Lấy tham số động từ URL
  ```jsx
  const { id } = useParams(); // URL: /shoes/view/5 → id = "5"
  ```
- **`useNavigate`**: Điều hướng programmatically
  ```jsx
  const navigate = useNavigate();
  navigate('/'); // Chuyển về trang chủ
  ```
- **`useLocation`**: Lấy thông tin URL hiện tại
  ```jsx
  const location = useLocation();
  // location.pathname = "/shoes/add"
  ```

### 2. Xử lý Date (Ngày tháng)
JavaScript Date trong ứng dụng có 3 dạng:
- **Từ API (Java Date)**: Timestamp milliseconds, ví dụ: `1704067200000`
- **HTML input[type=date]**: String "yyyy-MM-dd", ví dụ: `"2024-01-01"`
- **Hiển thị trên UI**: String "dd/MM/yyyy", ví dụ: `"01/01/2024"`

```javascript
// Timestamp → "dd/MM/yyyy" (hiển thị)
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getDate().toString().padStart(2,'0')}/${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getFullYear()}`;
};

// "yyyy-MM-dd" → Timestamp (gửi API)
const toTimestamp = (dateStr) => new Date(dateStr).getTime();

// Timestamp → "yyyy-MM-dd" (set vào input)
const toInputDate = (timestamp) => {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};
```

### 3. Axios Instance Pattern
Thay vì import `axios` trực tiếp và lặp lại `baseURL`, ta tạo 1 instance dùng chung:
```javascript
// axiosConfig.js
const axiosInstance = axios.create({ baseURL: 'http://localhost:8080/api' });

// shoesApi.js - sử dụng instance đã cấu hình
import axiosInstance from './axiosConfig';
export const getShoesList = () => axiosInstance.get('/shoes');
```

### 4. React Router DOM
- **`<BrowserRouter>`**: Sử dụng HTML5 History API, URL không có `#`
- **`<Routes>` + `<Route>`**: Khai báo mapping URL → Component
- **`<Link>`**: Điều hướng không reload trang (khác `<a href>`)
- **`:id`** trong path: Tham số động, lấy bằng `useParams()`

### 5. Controlled Components
Form inputs được control bởi React state:
```jsx
<input
  value={formData.shoesName}    // State → DOM
  onChange={handleChange}       // DOM event → State
/>
```

### 6. Async/Await + Error Handling
```javascript
const loadData = async () => {
  try {
    const res = await axiosInstance.get('/shoes');
    setData(res.data);
  } catch (err) {
    setError('Error message');
  } finally {
    setLoading(false); // Luôn chạy dù thành công hay thất bại
  }
};
```

---

## 📖 Ghi Chú Dành Cho Sinh Viên

1. **Tại sao dùng Vite thay vì Create React App (CRA)?**
   Vite nhanh hơn nhiều nhờ sử dụng ES modules native, build time ngắn hơn đáng kể.

2. **Tại sao dùng React Bootstrap thay vì CSS thuần?**
   React Bootstrap cung cấp sẵn các component (Table, Form, Button...) đã được styled, giúp tập trung vào logic thay vì CSS.

3. **Vì sao `useEffect` có dependency array `[]`?**
   `[]` = chỉ chạy 1 lần sau lần render đầu tiên. Không có `[]` = chạy mỗi lần component re-render (có thể gây vòng lặp vô tận).

4. **Sự khác biệt giữa `shoesName` và `categoryName` trong response?**
   API trả về `categoryName` (string) chứ không phải `categoryId` (number). Khi Edit, ta phải tìm ngược lại `categoryId` từ `categoryName` bằng cách so sánh với danh sách categories.

5. **Tại sao gửi date dưới dạng timestamp?**
   Java `java.util.Date` khi serialize bằng Jackson mặc định trả về timestamp (milliseconds). Để nhất quán, ta cũng gửi lên dạng timestamp.
