const test = require('node:test');
const assert = require('node:assert/strict');
const { app, pool, searchOpenStreetMap } = require('../src/server');

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await pool.end();
});

test('GET / phục vụ trang chủ khách hàng', async () => {
  const response = await fetch(`${baseUrl}/`);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /<!DOCTYPE html>/i);
});

test('API không tồn tại trả JSON 404', async () => {
  const response = await fetch(`${baseUrl}/api/khong-ton-tai`);
  const body = await response.json();
  assert.equal(response.status, 404);
  assert.equal(body.success, false);
});

test('Đăng nhập từ chối body rỗng thay vì crash', async () => {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: 'null'
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.equal(body.success, false);
});

test('Đăng ký kiểm tra mật khẩu ngắn trước khi truy cập database', async () => {
  const response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'abc', password: '123', fullName: 'Khách thử' })
  });
  assert.equal(response.status, 400);
});

test('Chat từ chối câu hỏi rỗng', async () => {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: '   ' })
  });
  assert.equal(response.status, 400);
});

test('Đặt tour yêu cầu đăng nhập', async () => {
  const response = await fetch(`${baseUrl}/api/bookings/`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}'
  });
  assert.equal(response.status, 401);
});

test('HDV đăng nhập và chỉ truy cập được danh sách tour đã phân công', async () => {
  const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'hdv', password: '123' })
  });
  assert.equal(loginResponse.status, 200);
  const loginBody = await loginResponse.json();
  assert.ok(loginBody.data.token);
  assert.deepEqual(loginBody.data.user.roles, ['GUIDE']);

  const bookingsResponse = await fetch(`${baseUrl}/api/bookings/`, {
    headers: { Authorization: `Bearer ${loginBody.data.token}` }
  });
  const bookingsBody = await bookingsResponse.json();
  assert.equal(bookingsResponse.status, 200);
  assert.equal(bookingsBody.success, true);
  assert.ok(Array.isArray(bookingsBody.data));
});

test('CORS từ chối origin không được cấu hình', async () => {
  const response = await fetch(`${baseUrl}/api/health`, { headers: { Origin: 'https://example.invalid' } });
  assert.equal(response.status, 403);
});

test('OpenStreetMap được chuẩn hóa thành dữ liệu an toàn cho chatbox', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => new Response(JSON.stringify([{
    place_id: 123, display_name: 'Khu du lịch thử nghiệm, Bến Tre, Việt Nam',
    lat: '10.123', lon: '106.456', type: 'attraction', extratags: {}
  }]), { status: 200, headers: { 'Content-Type': 'application/json' } });
  try {
    const places = await searchOpenStreetMap('dia-diem-kiem-thu-doc-nhat', null, 1);
    assert.equal(places.length, 1);
    assert.equal(places[0].source, 'OpenStreetMap');
    assert.equal(places[0].latitude, 10.123);
    assert.match(places[0].mapUrl, /openstreetmap\.org/);
  } finally {
    global.fetch = originalFetch;
  }
});

test('OpenStreetMap làm sạch câu hỏi tiệm thuốc trước khi tìm kiếm', async () => {
  const originalFetch = global.fetch;
  let requestedUrl = '';
  global.fetch = async (url) => {
    requestedUrl = String(url);
    return new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
  try {
    await searchOpenStreetMap(
      'Bạn có thông tin về tiệm thuốc Long Châu tại xã An Ngãi Trung, huyện Ba Tri không?', null, 3
    );
    const query = new URL(requestedUrl).searchParams.get('q');
    assert.match(query, /^nhà thuốc Long Châu/i);
    assert.doesNotMatch(query, /Bạn có thông tin/i);
  } finally {
    global.fetch = originalFetch;
  }
});
