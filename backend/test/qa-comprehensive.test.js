const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const { app, pool, config } = require('../src/server');

let server;
let baseUrl;

// Helper: thực hiện request JSON
async function apiRequest(path, options = {}) {
  const headers = { ...options.headers };
  if (options.body && typeof options.body === 'object' && !(options.body instanceof String)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }
  const res = await fetch(`${baseUrl}${path}`, { ...options, headers });
  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch (_) {
    data = text;
  }
  return { status: res.status, ok: res.ok, data };
}

// Helper: đăng nhập để lấy token và user
async function loginAs(username, password = '123') {
  const res = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: { username, password }
  });
  assert.equal(res.status, 200, `Đăng nhập ${username} thất bại`);
  return res.data.data;
}

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

test.after(async () => {
  // Dọn dẹp dữ liệu test E2E tạo ra
  await pool.query("DELETE FROM booking_guests WHERE booking_id IN (SELECT id FROM bookings WHERE contact_name LIKE 'E2ETest%')");
  await pool.query("DELETE FROM booking_status_history WHERE booking_id IN (SELECT id FROM bookings WHERE contact_name LIKE 'E2ETest%')");
  await pool.query("DELETE FROM reviews WHERE title LIKE 'E2ETest%'");
  await pool.query("DELETE FROM bookings WHERE contact_name LIKE 'E2ETest%'");
  await pool.query("DELETE FROM user_roles WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'e2e_user_%')");
  await pool.query("DELETE FROM users WHERE username LIKE 'e2e_user_%'");

  await new Promise((resolve) => server.close(resolve));
  await pool.end();
});

// ============================================================================
// 1. KIỂM THỬ CHỨC NĂNG (FUNCTIONAL TESTING)
// ============================================================================

test('1.1 Happy Path: Đăng nhập thành công với các vai trò (ADMIN, GUIDE, USER)', async () => {
  const adminSession = await loginAs('admin', '123');
  assert.ok(adminSession.token);
  assert.ok(adminSession.user.roles.includes('ADMIN'));

  const guideSession = await loginAs('hdv', '123');
  assert.ok(guideSession.token);
  assert.ok(guideSession.user.roles.includes('GUIDE'));

  const userSession = await loginAs('khach', '123');
  assert.ok(userSession.token);
});

test('1.2 Happy Path: Lấy danh sách tài nguyên công khai (tours, places, facilities)', async () => {
  const tours = await apiRequest('/api/tours?page=1&limit=5');
  assert.equal(tours.status, 200);
  assert.equal(tours.data.success, true);
  assert.ok(Array.isArray(tours.data.data));
  assert.ok(tours.data.pagination.total >= 0);

  const places = await apiRequest('/api/places?page=1&limit=5');
  assert.equal(places.status, 200);
  assert.equal(places.data.success, true);
  assert.ok(Array.isArray(places.data.data));

  const facilities = await apiRequest('/api/facilities?page=1&limit=5');
  assert.equal(facilities.status, 200);
  assert.equal(facilities.data.success, true);
});

test('1.3 Boundary & Input: Nhập rỗng hoặc khoảng trắng cho tìm kiếm địa điểm', async () => {
  const emptyRes = await apiRequest('/api/places/search?q=');
  assert.equal(emptyRes.status, 400);
  assert.equal(emptyRes.data.success, false);
  assert.match(emptyRes.data.message, /Vui lòng nhập địa điểm/i);

  const spaceRes = await apiRequest('/api/places/search?q=%20%20%20');
  assert.equal(spaceRes.status, 400);
  assert.equal(spaceRes.data.success, false);
});

test('1.4 Boundary & Input: Từ khóa tìm kiếm vượt quá 200 ký tự trả về 400', async () => {
  const longQuery = 'a'.repeat(201);
  const res = await apiRequest(`/api/places/search?q=${longQuery}`);
  assert.equal(res.status, 400);
  assert.equal(res.data.success, false);
  assert.match(res.data.message, /quá dài/i);
});

test('1.5 Boundary & Input: Validation đăng ký tài khoản (độ dài, email, phone)', async () => {
  // Tên đăng nhập ngắn (< 3 ký tự)
  const shortUser = await apiRequest('/api/auth/register', {
    method: 'POST',
    body: { username: 'ab', password: 'password123', fullName: 'Khách Thử' }
  });
  assert.equal(shortUser.status, 400);

  // Email sai định dạng
  const invalidEmail = await apiRequest('/api/auth/register', {
    method: 'POST',
    body: { username: 'user_invalid_mail', password: 'password123', fullName: 'Khách Thử', email: 'khongphaiemail' }
  });
  assert.equal(invalidEmail.status, 400);
  assert.match(invalidEmail.data.message, /Email không hợp lệ/i);

  // Số điện thoại sai định dạng
  const invalidPhone = await apiRequest('/api/auth/register', {
    method: 'POST',
    body: { username: 'user_invalid_phone', password: 'password123', fullName: 'Khách Thử', phone: 'abc12345' }
  });
  assert.equal(invalidPhone.status, 400);
  assert.match(invalidPhone.data.message, /Số điện thoại không hợp lệ/i);
});

test('1.6 Boundary & Input: ID không hợp lệ (số âm, chuỗi chữ) trả 400', async () => {
  const negativeId = await apiRequest('/api/tours/-5');
  assert.equal(negativeId.status, 400);
  assert.equal(negativeId.data.success, false);

  const stringId = await apiRequest('/api/tours/abc-not-number');
  assert.equal(stringId.status, 400);
  assert.equal(stringId.data.success, false);
});

test('1.7 Boundary & Input: Phân trang tự động chuẩn hóa khi truyền số âm hoặc quá lớn', async () => {
  const res = await apiRequest('/api/tours?page=-2&limit=99999');
  assert.equal(res.status, 200);
  // Hệ thống tự động kẹp page >= 1 và limit <= 100
  assert.equal(res.data.pagination.page, 1);
  assert.equal(res.data.pagination.limit, 100);
});

test('1.8 Error Handling: Endpoint không tồn tại trả 404 có cấu trúc rõ ràng', async () => {
  const res = await apiRequest('/api/tours/99999999');
  assert.equal(res.status, 404);
  assert.equal(res.data.success, false);
  assert.ok(res.data.message);
});

test('1.9 End-to-End (E2E): Toàn bộ vòng đời người dùng (Đăng ký -> Đăng nhập -> /me -> Xem tour -> Đặt tour -> Đánh giá review -> Admin duyệt)', async () => {
  const timestamp = Date.now();
  const testUsername = `e2e_user_${timestamp}`;
  const testPassword = 'Password123@!';

  // Bước 1: Đăng ký
  const regRes = await apiRequest('/api/auth/register', {
    method: 'POST',
    body: {
      username: testUsername,
      password: testPassword,
      fullName: 'E2ETest Khách Hàng',
      email: `e2e_${timestamp}@example.com`,
      phone: '0988776655'
    }
  });
  assert.equal(regRes.status, 201, 'Đăng ký phải trả về 201 Created');
  assert.ok(regRes.data.data.token);

  // Bước 2: Đăng nhập
  const loginRes = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: { username: testUsername, password: testPassword }
  });
  assert.equal(loginRes.status, 200);
  const customerToken = loginRes.data.data.token;

  // Bước 3: Xác thực thông tin /me
  const meRes = await apiRequest('/api/auth/me', {
    headers: { Authorization: `Bearer ${customerToken}` }
  });
  assert.equal(meRes.status, 200);
  assert.equal(meRes.data.data.username, testUsername);
  assert.deepEqual(meRes.data.data.roles, ['CUSTOMER']);

  // Bước 4: Đảm bảo có chuyến đi OPEN còn chỗ trống để đặt (tăng capacity nếu cần)
  await pool.query("UPDATE tour_departures SET capacity = capacity + 5 WHERE status='OPEN' ORDER BY id LIMIT 1");
  const [[openDeparture]] = await pool.query("SELECT id, tour_id FROM tour_departures WHERE status='OPEN' AND booked_seats < capacity LIMIT 1");
  assert.ok(openDeparture, 'Cần có ít nhất 1 chuyến đi OPEN còn chỗ trống trong cơ sở dữ liệu');

  // Bước 5: Đặt tour
  const bookingRes = await apiRequest('/api/bookings/', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: {
      departureId: openDeparture.id,
      adultCount: 1,
      childCount: 0,
      contactName: 'E2ETest Khách Hàng',
      contactPhone: '0988776655',
      contactEmail: `e2e_${timestamp}@example.com`,
      pickupAddress: 'Bến Tre Hotel',
      specialRequest: 'Ăn chay nhẹ nhàng',
      guests: [{ fullName: 'E2ETest Khách Hàng', guestType: 'ADULT' }]
    }
  });
  assert.equal(bookingRes.status, 201, 'Đặt tour thành công phải trả 201');
  const bookingId = bookingRes.data.data.id;
  assert.ok(bookingId);

  // Bước 6: Khách kiểm tra danh sách đơn đặt tour của chính mình
  const myBookings = await apiRequest('/api/bookings/', {
    headers: { Authorization: `Bearer ${customerToken}` }
  });
  assert.equal(myBookings.status, 200);
  const foundBooking = myBookings.data.data.find((b) => b.id === bookingId);
  assert.ok(foundBooking, 'Đơn đặt tour phải hiển thị trong danh sách của khách');
  assert.equal(foundBooking.contact_name, 'E2ETest Khách Hàng');

  // Bước 7: Khách gửi đánh giá review
  const reviewRes = await apiRequest('/api/reviews/', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerToken}` },
    body: {
      targetType: 'TOUR',
      targetId: openDeparture.tour_id,
      bookingId: bookingId,
      rating: 5,
      title: `E2ETest Trải nghiệm tuyệt vời ${timestamp}`,
      content: 'Chuyến đi sinh thái Bến Tre rất ý nghĩa và bảo vệ môi trường.'
    }
  });
  assert.equal(reviewRes.status, 201, 'Tạo review trả về 201');
  const reviewId = reviewRes.data.data.id;

  // Bước 8: Admin đăng nhập và duyệt review
  const admin = await loginAs('admin', '123');
  const moderateRes = await apiRequest(`/api/reviews/${reviewId}/moderate`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${admin.token}` },
    body: { status: 'PUBLISHED', adminReply: 'Cảm ơn quý khách đã tin tưởng và ủng hộ du lịch xanh Bến Tre!' }
  });
  assert.equal(moderateRes.status, 200);
  assert.equal(moderateRes.data.success, true);

  // Bước 9: Kiểm tra review hiển thị công khai
  const publicReviews = await apiRequest('/api/reviews/?targetType=TOUR');
  assert.equal(publicReviews.status, 200);
  const publishedReview = publicReviews.data.data.find((r) => r.id === reviewId);
  assert.ok(publishedReview, 'Review sau khi duyệt phải hiển thị công khai');
  assert.equal(publishedReview.status, 'PUBLISHED');
});

// ============================================================================
// 2. KIỂM THỬ TÍCH HỢP & DỮ LIỆU (INTEGRATION & DATABASE INTEGRITY)
// ============================================================================

test('2.1 CRUD Integrity: Admin tạo, đọc, cập nhật, xóa địa điểm du lịch', async () => {
  const admin = await loginAs('admin', '123');
  const uniqueName = `Địa điểm Test CRUD ${Date.now()}`;

  // Create
  const createRes = await apiRequest('/api/places', {
    method: 'POST',
    headers: { Authorization: `Bearer ${admin.token}` },
    body: {
      name: uniqueName,
      slug: `dia-diem-test-${Date.now()}`,
      short_description: 'Mô tả ngắn thử nghiệm',
      description: 'Mô tả chi tiết thử nghiệm',
      address: 'Xã An Khánh, Châu Thành, Bến Tre',
      ticket_price: 50000,
      eco_score: 9.0,
      status: 'DRAFT'
    }
  });
  assert.equal(createRes.status, 201);
  const placeId = createRes.data.data.id;
  assert.ok(placeId);

  // Read
  const readRes = await apiRequest(`/api/places/${placeId}`);
  assert.equal(readRes.status, 200);
  assert.equal(readRes.data.data.name, uniqueName);

  // Update
  const updatedName = `${uniqueName} (Đã cập nhật)`;
  const updateRes = await apiRequest(`/api/places/${placeId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${admin.token}` },
    body: { name: updatedName, ticket_price: 65000 }
  });
  assert.equal(updateRes.status, 200);
  assert.equal(updateRes.data.data.name, updatedName);
  assert.equal(updateRes.data.data.ticket_price, 65000);

  // Delete
  const deleteRes = await apiRequest(`/api/places/${placeId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${admin.token}` }
  });
  assert.equal(deleteRes.status, 204);

  // Read after Delete -> 404
  const verifyRes = await apiRequest(`/api/places/${placeId}`);
  assert.equal(verifyRes.status, 404);
});

test('2.2 Transaction & Rollback: Khi lỗi giữa chừng trong chuỗi đặt tour, dữ liệu được rollback 100%', async () => {
  const customer = await loginAs('khach', '123');
  const [[departureBefore]] = await pool.query("SELECT id, booked_seats FROM tour_departures WHERE status='OPEN' LIMIT 1");
  assert.ok(departureBefore);

  const initialSeats = departureBefore.booked_seats;

  // Gửi request đặt tour nhưng guest payload chứa lỗi (guest không có fullName)
  const failBookingRes = await apiRequest('/api/bookings/', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customer.token}` },
    body: {
      departureId: departureBefore.id,
      adultCount: 2,
      childCount: 0,
      contactName: 'Lê Văn Nam',
      contactPhone: '0901234567',
      guests: [
        { fullName: 'Khách 1', guestType: 'ADULT' },
        { fullName: '', guestType: 'ADULT' } // Lỗi: fullName rỗng sẽ kích hoạt rollback
      ]
    }
  });

  assert.ok([400, 409].includes(failBookingRes.status), `Expected 400 or 409 but got ${failBookingRes.status}`);

  // Kiểm tra Rollback: booked_seats không được tăng
  const [[departureAfter]] = await pool.query('SELECT booked_seats FROM tour_departures WHERE id=?', [departureBefore.id]);
  assert.equal(departureAfter.booked_seats, initialSeats, 'Transaction rollback phải giữ nguyên số ghế ban đầu');
});

// ============================================================================
// 3. KIỂM THỬ BẢO MẬT (SECURITY TESTING)
// ============================================================================

test('3.1 RBAC & IDOR: Khách hàng thông thường không được phép truy cập Dashboard quản trị', async () => {
  const customer = await loginAs('khach', '123');
  const res = await apiRequest('/api/dashboard/', {
    headers: { Authorization: `Bearer ${customer.token}` }
  });
  assert.equal(res.status, 403, 'User không có role ADMIN phải bị 403');
  assert.match(res.data.message, /không có quyền/i);
});

test('3.2 RBAC: Khách hàng không được tạo hoặc xóa tài nguyên hệ thống', async () => {
  const customer = await loginAs('khach', '123');
  const createRes = await apiRequest('/api/tours', {
    method: 'POST',
    headers: { Authorization: `Bearer ${customer.token}` },
    body: { name: 'Tour Hack' }
  });
  assert.equal(createRes.status, 403);

  const deleteRes = await apiRequest('/api/tours/1', {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${customer.token}` }
  });
  assert.equal(deleteRes.status, 403);
});

test('3.3 RBAC & IDOR: Khách hàng không được xem danh sách người dùng hệ thống (/api/users)', async () => {
  const customer = await loginAs('khach', '123');
  const res = await apiRequest('/api/users', {
    headers: { Authorization: `Bearer ${customer.token}` }
  });
  assert.equal(res.status, 403);
});

test('3.4 Token Security: Từ chối token sai chữ ký hoặc token hết hạn', async () => {
  // Token sai chữ ký
  const fakeToken = jwt.sign({ sub: 1, roles: ['ADMIN'] }, 'wrong-secret-key');
  const fakeRes = await apiRequest('/api/dashboard/', {
    headers: { Authorization: `Bearer ${fakeToken}` }
  });
  assert.equal(fakeRes.status, 401);
  assert.match(fakeRes.data.message, /không hợp lệ hoặc đã hết hạn/i);

  // Token hết hạn
  const expiredToken = jwt.sign({ sub: 1, roles: ['ADMIN'] }, config.jwtSecret, { expiresIn: '-1s' });
  const expiredRes = await apiRequest('/api/dashboard/', {
    headers: { Authorization: `Bearer ${expiredToken}` }
  });
  assert.equal(expiredRes.status, 401);
});

test('3.5 SQL Injection: Input độc hại trong đăng nhập không thể bypass xác thực', async () => {
  const sqlInjections = [
    "' OR '1'='1",
    "admin' --",
    "admin' OR 1=1 --",
    "' UNION SELECT 1, 'admin', 'hash', 'ACTIVE' --"
  ];

  for (const maliciousInput of sqlInjections) {
    const res = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { username: maliciousInput, password: 'password' }
    });
    assert.equal(res.status, 401, `SQLi payload "${maliciousInput}" phải bị từ chối 401`);
  }
});

test('3.6 SQL Injection: Input độc hại trong tham số tìm kiếm không gây lỗi cú pháp SQL', async () => {
  const res = await apiRequest("/api/tours?q=' OR 1=1 --");
  assert.equal(res.status, 200);
  assert.equal(res.data.success, true);
});

test('3.7 XSS Mitigation: Chuỗi script injection trong dữ liệu được lưu an toàn không gây hại', async () => {
  const admin = await loginAs('admin', '123');
  const xssPayload = '<script>alert("XSS Attack")</script>';

  const res = await apiRequest('/api/places', {
    method: 'POST',
    headers: { Authorization: `Bearer ${admin.token}` },
    body: {
      name: `XSS Test Place ${Date.now()}`,
      slug: `xss-place-${Date.now()}`,
      address: 'Địa chỉ XSS Test Bến Tre',
      short_description: xssPayload,
      description: xssPayload,
      status: 'DRAFT'
    }
  });
  assert.equal(res.status, 201);
  const createdPlace = res.data.data;
  assert.equal(createdPlace.short_description, xssPayload);

  // Dọn dẹp
  await apiRequest(`/api/places/${createdPlace.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${admin.token}` }
  });
});

test('3.8 Sensitive Data: API quản trị /api/users không để lộ password_hash', async () => {
  const admin = await loginAs('admin', '123');
  const res = await apiRequest('/api/users?limit=5', {
    headers: { Authorization: `Bearer ${admin.token}` }
  });
  assert.equal(res.status, 200);
  const users = res.data.data;
  assert.ok(users.length > 0);
  for (const u of users) {
    assert.equal(u.password_hash, undefined, 'password_hash tuyệt đối không được lộ ra ngoài API');
    assert.equal(u.password, undefined);
  }
});

// ============================================================================
// 4. KIỂM THỬ HIỆU NĂNG & ĐỘ ỔN ĐỊNH (PERFORMANCE & STABILITY)
// ============================================================================

test('4.1 Performance: Health check phản hồi cực nhanh (< 100ms)', async () => {
  const start = performance.now();
  const res = await apiRequest('/api/health');
  const duration = performance.now() - start;
  assert.equal(res.status, 200);
  assert.ok(duration < 100, `Health check phản hồi ${duration.toFixed(2)}ms (phải < 100ms)`);
});

// ============================================================================
// 5. KIỂM THỬ RÀNG BUỘC GIÁ TIỀN & SỐ LƯỢNG (PRICE & QUANTITY NON-NEGATIVE >= 0)
// ============================================================================

test('5.1 Validation: API từ chối giá vé hoặc chi phí là số âm (< 0)', async () => {
  const admin = await loginAs('admin', '123');
  const res = await apiRequest('/api/places', {
    method: 'POST',
    headers: { Authorization: `Bearer ${admin.token}` },
    body: {
      category_id: 1,
      name: 'Điểm test giá âm',
      slug: `diem-test-gia-am-${Date.now()}`,
      ticket_price: -50000,
      status: 'DRAFT'
    }
  });
  assert.equal(res.status, 400);
  assert.ok(res.data.message.includes('không được là số âm') && res.data.message.includes('>= 0'));
});

test('5.2 Validation: API từ chối số lượng / sức chứa là số âm (< 0)', async () => {
  const admin = await loginAs('admin', '123');
  const res = await apiRequest('/api/places', {
    method: 'POST',
    headers: { Authorization: `Bearer ${admin.token}` },
    body: {
      category_id: 1,
      name: 'Điểm test sức chứa âm',
      slug: `diem-test-suc-chua-am-${Date.now()}`,
      capacity: -20,
      status: 'DRAFT'
    }
  });
  assert.equal(res.status, 400);
  assert.ok(res.data.message.includes('không được là số âm') && res.data.message.includes('>= 0'));
});

test('5.3 Validation: API từ chối giá tour người lớn hoặc trẻ em là số âm (< 0)', async () => {
  const admin = await loginAs('admin', '123');
  const res = await apiRequest('/api/tours', {
    method: 'POST',
    headers: { Authorization: `Bearer ${admin.token}` },
    body: {
      category_id: 1,
      code: `TOUR-NEG-${Date.now()}`,
      name: 'Tour test giá âm',
      adult_price: -690000,
      child_price: 450000,
      status: 'DRAFT'
    }
  });
  assert.equal(res.status, 400);
  assert.ok(res.data.message.includes('không được là số âm') && res.data.message.includes('>= 0'));
});
