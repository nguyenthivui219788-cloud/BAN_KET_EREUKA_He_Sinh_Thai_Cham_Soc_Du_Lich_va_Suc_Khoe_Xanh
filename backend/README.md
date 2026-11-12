# Backend Node.js + MySQL

## Cài đặt

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run db:setup
npm start
```

Mở `http://localhost:8080`. Kiểm tra API tại `http://localhost:8080/api/health`.

## Tài khoản mẫu

| Vai trò | Tài khoản | Mật khẩu |
|---|---|---|
| Admin | `admin` | `123` |
| Hướng dẫn viên | `hdv` | `123` |
| Nhân viên | `nv1` | `123` |
| Khách hàng | `khach` | `123` |

## API chính

- `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me`
- CRUD: `/api/tours`, `/api/places`, `/api/tourism-services`, `/api/facilities`
- CRUD: `/api/health-services`, `/api/health-activities`, `/api/articles`, `/api/events`
- Quản trị: `/api/users`, `/api/guides`, `/api/feedback`, `/api/reports`
- Booking: `GET/POST /api/bookings`, `PATCH /api/bookings/:id/status`
- Đánh giá: `GET/POST /api/reviews`, `PATCH /api/reviews/:id/moderate`
- Dashboard: `GET /api/dashboard`

Các API ghi dữ liệu yêu cầu header `Authorization: Bearer <token>` và quyền phù hợp.
