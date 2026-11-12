# Database MySQL

Thiết kế này dành cho MySQL 8.0+ và bám theo các màn hình frontend hiện có.

## Khởi tạo

```bash
mysql -u root -p < database/schema.sql
```

Schema tạo database `ben_tre_sustainable`, toàn bộ bảng, khóa ngoại, chỉ mục, dữ liệu danh mục nền và hai view cho dashboard.

## Nhóm dữ liệu

- Tài khoản/RBAC: `users`, `roles`, `user_roles`.
- Hướng dẫn viên: `guides`, `languages`, `guide_languages`.
- Du lịch: `places`, `tours`, `tour_itinerary_items`, `tour_departures`, `tourism_services`.
- Đặt tour: `bookings`, `booking_guests`, `payments`, `booking_status_history`.
- Sức khỏe: `medical_facilities`, `health_services`, `health_activities`, `health_activity_registrations`.
- Nội dung: `articles`, `events`, `media`, `categories`.
- Tương tác/kiểm duyệt: `reviews`, `customer_feedback`, `content_reports`, `notifications`.

## Quy ước tích hợp backend

- API dùng ID số nội bộ; hiển thị cho người dùng bằng `code`, `booking_code` hoặc `slug`.
- Tiền dùng `DECIMAL`, không dùng `FLOAT`; thời gian lưu `DATETIME`/`TIMESTAMP` và backend nên thống nhất múi giờ UTC.
- Không lưu mật khẩu thô. Backend tạo `password_hash` bằng Argon2id hoặc bcrypt.
- Các thao tác đặt/chốt/hủy tour phải chạy trong transaction; khi tăng ghế đã đặt cần khóa dòng `tour_departures` bằng `SELECT ... FOR UPDATE` để tránh bán vượt số chỗ.
- `deleted_at` là xóa mềm cho dữ liệu nghiệp vụ chính. Không xóa cứng tour/người dùng đã phát sinh booking.
- `content_reports.target_id` là quan hệ đa hình nên được kiểm tra ở service/backend theo `target_type`.
- `average_rating` trong `guides` là trường cache; backend cập nhật sau khi duyệt/ẩn đánh giá hoặc có thể tính trực tiếp bằng truy vấn tổng hợp.

## Thứ tự API nên triển khai

1. Đăng nhập, người dùng và phân quyền.
2. CRUD địa điểm, tour, lịch trình, chuyến khởi hành và HDV.
3. Đặt tour, thanh toán, lịch sử trạng thái và điểm danh khách.
4. Cơ sở/dịch vụ/hoạt động sức khỏe.
5. Tin tức, sự kiện, đánh giá, phản hồi và kiểm duyệt.
