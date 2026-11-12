<div align="center">

# 🌿 HỆ SINH THÁI CHĂM SÓC DU LỊCH VÀ SỨC KHỎE XANH - EREUKA
[![Status](https://img.shields.io/badge/Status-B%C3%A1n%20K%E1%BA%BFt%20Eureka-success?style=for-the-badge&logo=appveyor)](https://github.com/nguyenthivui219788-cloud/BAN_KET_EREUKA_He_Sinh_Thai_Cham_Soc_Du_Lich_va_Suc_Khoe_Xanh)
[![Platform](https://img.shields.io/badge/Platform-Web-blue?style=for-the-badge&logo=html5)](https://github.com/nguyenthivui219788-cloud/BAN_KET_EREUKA_He_Sinh_Thai_Cham_Soc_Du_Lich_va_Suc_Khoe_Xanh)
[![License](https://img.shields.io/badge/License-MIT-yellow.badge?style=for-the-badge)](https://github.com/nguyenthivui219788-cloud/BAN_KET_EREUKA_He_Sinh_Thai_Cham_Soc_Du_Lich_va_Suc_Khoe_Xanh)

*Dự án tiêu biểu tham gia Giải thưởng Sinh Viên Nghiên Cứu Khoa Học - Eurka*

</div>

---

## 📌 1. Tổng quan dự án (Overview)
Trong bối cảnh áp lực cuộc sống hiện đại gia tăng và nhu cầu phục hồi "Thân - Tâm - Trí" ngày càng lớn, xu hướng **du lịch xanh kết hợp chăm sóc sức khỏe (Green Wellness Tourism)** đang trở thành sự lựa chọn ưu tiên của cộng đồng. 

**EREUKA** được ra đời với sứ mệnh xây dựng một hệ sinh thái số toàn diện, giúp người dùng dễ dàng tiếp cận các điểm đến du lịch sinh thái bền vững, đồng thời theo dõi, chăm sóc sức khỏe cá nhân thông qua các giải pháp tích hợp thông minh ngay trên nền tảng web. Sản phẩm đã vinh dự vượt qua nhiều vòng tuyển chọn khắt khe để ghi tên mình vào vòng **Bán kết cuộc thi Eureka**.

---

## 🏗️ 2. Sơ đồ kiến trúc hệ thống (System Architecture)
Hệ thống được thiết kế theo mô hình client-server tách biệt nhằm tối ưu hóa hiệu năng, tính bảo mật và khả năng mở rộng trong tương lai:

```text
BAN_KET_EREUKA_He_Sinh_Thai_Cham_Soc_Du_Lich_va_Suc_Khoe_Xanh/
│
├── frontend/                  # Giao diện người dùng (Client-side)
│   ├── assets/                # Hình ảnh, icon, font chữ và các tệp tĩnh
│   ├── css/                   # Tệp định dạng giao diện (Responsive Design)
│   ├── js/                    # Xử lý logic phía client, tương tác DOM, gọi API
│   └── index.html             # Trang chủ hệ sinh thái
│
├── backend/                   # Xử lý logic máy chủ và lưu trữ (Server-side)
│   ├── controllers/           # Điều phối luồng xử lý dữ liệu nghiệp vụ
│   ├── models/                # Định nghĩa cấu trúc dữ liệu cơ sở dữ liệu
│   ├── routes/                # Cấu hình các điểm cuối (Endpoints) API
│   └── server.js / app.js     # Điểm khởi chạy ứng dụng backend
│
├── .vscode/                   # Cấu hình môi trường phát triển chung cho team
└── README.md                  # Tài liệu hướng dẫn sử dụng và mô tả dự án
```

## 💻 3. Công nghệ sử dụng (Tech Stack)
Dự án ứng dụng các công nghệ hiện đại, tối ưu cho việc phát triển web nhanh chóng và hiệu quả:

Frontend:

HTML5, CSS3 (Xây dựng giao diện trực quan, tương thích mượt mà trên cả Desktop, Tablet và Mobile).

JavaScript (ES6+) (Xử lý hiệu ứng động, bất đồng bộ và tương tác người dùng mượt mà).

Backend:

Node.js / Môi trường xử lý mã nguồn phía máy chủ mạnh mẽ.

Xây dựng hệ thống API phục vụ xác thực người dùng, lưu trữ lộ trình và dữ liệu sức khỏe.

Cơ sở dữ liệu (Database):

Quản lý hệ thống tài khoản, danh mục địa điểm du lịch sinh thái, các bài tập và chỉ số sức khỏe.

Công cụ & Môi trường làm việc:

Visual Studio Code (IDE phát triển chính).

Git & GitHub (Quản lý phiên bản mã nguồn, phối hợp nhóm hiệu quả).

## ✨ 4. Các tính năng cốt lõi (Key Features)
🗺️ A. Hệ thống Khám phá Du lịch Xanh
Tra cứu điểm đến sinh thái: Cung cấp thông tin chi tiết về các khu du lịch, nhà vườn, địa điểm nghỉ dưỡng thân thiện với môi trường.

Gợi ý lịch trình thông minh: Đề xuất các chuyến đi ngắn ngày hoặc dài ngày phù hợp với sở thích và thể trạng của từng cá nhân.

Bản đồ trực quan: Hỗ trợ định vị và chỉ đường đến các địa điểm du lịch xanh, không gian thiên nhiên trong lành.

🧘 B. Giải pháp Chăm sóc Sức khỏe (Wellness Tracking)
Góc Thân - Tâm - Trí: Cung cấp các bài viết, bài tập thiền định, yoga và hướng dẫn rèn luyện sức khỏe thể chất gắn liền với chuyến đi.

Theo dõi hành trình cá nhân: Giúp người dùng lưu lại lịch sử chuyến đi cùng các chỉ số vận động, năng lượng tiêu hao trong suốt hành trình.

🛡️ C. Quản lý hệ thống & Trải nghiệm người dùng
Giao diện thiết kế theo phong cách tối giản, thân thiện với thiên nhiên (lấy gam màu xanh lá làm chủ đạo).

Hệ thống phân quyền tài khoản cho người dùng trải nghiệm và ban tổ chức/quản trị viên kiểm duyệt thông tin.

## 🚀 5. Hướng dẫn cài đặt và chạy dự án (Getting Started)
Để chạy thử nghiệm dự án trên máy tính cá nhân, bạn hãy thực hiện theo các bước sau:

Yêu cầu hệ thống chuẩn bị sẵn:
Đã cài đặt Git và Visual Studio Code.

Đã cài đặt Node.js (nếu chạy phần backend).

Các bước thực hiện:
Clone repository về máy tính:

```text
git clone [https://github.com/nguyenthivui219788-cloud/BAN_KET_EREUKA_He_Sinh_Thai_Cham_Soc_Du_Lich_va_Suc_Khoe_Xanh.git](https://github.com/nguyenthivui219788-cloud/BAN_KET_EREUKA_He_Sinh_Thai_Cham_Soc_Du_Lich_va_Suc_Khoe_Xanh.git)
cd BAN_KET_EREUKA_He_Sinh_Thai_Cham_Soc_Du_Lich_va_Suc_Khoe_Xanh
```
Mở dự án bằng Visual Studio Code:

```text
code .
```
Chạy phần Frontend:

Di chuyển vào thư mục frontend/ hoặc mở trực tiếp file index.html.

Khuyến nghị sử dụng extension Live Server trong VS Code: Nhấp chuột phải vào index.html chọn Open with Live Server để có trải nghiệm xem tốt nhất.

Chạy phần Backend:

Mở terminal tích hợp trong VS Code, di chuyển đến thư mục backend:

```text
cd backend
```

Cài đặt các gói phụ thuộc (nếu có):

```text
npm install
```
Khởi chạy máy chủ:


```text
npm start
```

## 👥 6. Nhóm tác giả & Lời cảm ơn
Dự án được nghiên cứu và phát triển bởi đội ngũ sinh viên tham gia tranh tài tại vòng Bán kết giải thưởng Sinh Viên Nghiên Cứu Khoa Học - Eureka.

Xin gửi lời cảm ơn chân thành đến Hội đồng Ban giám khảo, các thầy cô hướng dẫn đã tận tình hỗ trợ, đóng góp ý kiến để nhóm hoàn thiện hệ sinh thái này một cách trọn vẹn nhất.
