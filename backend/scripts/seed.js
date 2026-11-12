const bcrypt = require('bcryptjs');
const { pool, transaction } = require('../src/server');

(async () => {
  const hash = await bcrypt.hash('123', 12);
  await transaction(async (db) => {
    await db.query('SET FOREIGN_KEY_CHECKS=0');
    try {
      for (const table of ['notifications','booking_status_history','payments','booking_guests','bookings','tour_departures','tour_itinerary_items','reviews','health_activity_registrations','health_activities','health_services','medical_facilities','events','articles','tourism_services','places','tours','guide_languages','guides','user_roles','users']) {
        await db.query(`DELETE FROM ${table}`);
      }
    } finally {
      await db.query('SET FOREIGN_KEY_CHECKS=1');
    }
    const users = [
      ['admin','admin@bentre.vn','0901000001','Quản trị viên Bến Tre'],
      ['hdv','hdv@bentre.vn','0901000002','Nguyễn Minh Anh'],
      ['nv1','nv1@bentre.vn','0901000004','Nhân viên Nguyễn Thị Hoa'],
      ['khach','khach@bentre.vn','0901000003','Lê Văn Nam']
    ];
    const ids = {};
    for (const user of users) {
      const [result] = await db.query(`INSERT INTO users(username,email,phone,password_hash,full_name,status,email_verified_at)
        VALUES (?,?,?,?,?,'ACTIVE',NOW())`, [user[0],user[1],user[2],hash,user[3]]);
      ids[user[0]] = result.insertId;
    }
    for (const [username, role] of [['admin','ADMIN'],['hdv','GUIDE'],['nv1','GUIDE'],['khach','CUSTOMER']]) {
      await db.query('INSERT INTO user_roles(user_id,role_id) SELECT ?,id FROM roles WHERE code=?', [ids[username], role]);
    }
    const [guide] = await db.query(`INSERT INTO guides(user_id,guide_code,license_number,experience_years,specialties,bio,eco_training_certified,health_first_aid_certified,average_rating)
      VALUES (?,?,?,8,?,?,1,1,4.9)`, [ids.hdv,'HDV001','BT-HDV-2026-001','Du lịch sinh thái, văn hóa địa phương','Hướng dẫn viên am hiểu Bến Tre.']);
    const [[tourCat]] = await db.query("SELECT id FROM categories WHERE module='TOUR' LIMIT 1");
    const [[placeCat]] = await db.query("SELECT id FROM categories WHERE module='PLACE' LIMIT 1");
    const [place] = await db.query(`INSERT INTO places(category_id,name,slug,short_description,address,latitude,longitude,opening_time,closing_time,ticket_price,eco_score,status,created_by)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`, [placeCat.id,'Cồn Phụng','con-phung','Điểm du lịch sinh thái sông nước.','Cồn Phụng, Bến Tre',10.2328,106.3658,'07:00','17:30',50000,9.2,'PUBLISHED',ids.admin]);
    const [place2] = await db.query(`INSERT INTO places(category_id,name,slug,short_description,address,ticket_price,eco_score,status,created_by)
      VALUES (?,?,?,?,?,?,?,?,?)`, [placeCat.id,'Khu du lịch Lan Vương','khu-du-lich-lan-vuong','Trải nghiệm miệt vườn và trò chơi dân gian.','Tỉnh lộ 887, Bến Tre',80000,8.8,'PUBLISHED',ids.admin]);
    const [tour] = await db.query(`INSERT INTO tours(category_id,code,name,slug,summary,description,duration_minutes,meeting_point,adult_price,child_price,min_guests,max_guests,eco_score,status,created_by)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [tourCat.id,'TOUR-BT-01','Một ngày xanh Bến Tre','mot-ngay-xanh-ben-tre','Khám phá sông nước, vườn dừa và ẩm thực địa phương.','Tour sinh thái một ngày, ưu tiên phương tiện xanh.',480,'Trung tâm phường Bến Tre',850000,550000,2,20,9.5,'PUBLISHED',ids.admin]);
    const [tour2] = await db.query(`INSERT INTO tours(category_id,code,name,slug,summary,duration_minutes,meeting_point,adult_price,child_price,min_guests,max_guests,eco_score,status,created_by)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [tourCat.id,'TOUR-BT-02','Miệt vườn và làng nghề','miet-vuon-va-lang-nghe','Hai ngày trải nghiệm văn hóa bản địa.',1080,'Bến xe Bến Tre',1650000,1100000,4,16,9.0,'PUBLISHED',ids.admin]);
    await db.query('INSERT INTO tour_places(tour_id,place_id,visit_order,stay_minutes) VALUES (?,?,1,150),(?,?,2,180)', [tour.insertId,place.insertId,tour.insertId,place2.insertId]);
    await db.query(`INSERT INTO tour_itinerary_items(tour_id,item_order,start_time,end_time,title,description,place_id) VALUES
      (?,1,'07:30','08:00','Đón khách','Tập trung và phổ biến hành trình',NULL),
      (?,2,'08:30','11:00','Khám phá Cồn Phụng','Đi thuyền và tham quan làng nghề',?)`, [tour.insertId,tour.insertId,place.insertId]);
    const starts = new Date(Date.now()+7*86400000); const ends = new Date(starts.getTime()+8*3600000);
    const [departure] = await db.query('INSERT INTO tour_departures(tour_id,guide_id,starts_at,ends_at,capacity,status) VALUES (?,?,?,?,20,\'OPEN\')', [tour.insertId,guide.insertId,starts,ends]);
    const [facility] = await db.query(`INSERT INTO medical_facilities(category_id,name,license_number,description,address,phone,emergency_phone,opening_hours,is_emergency_24h,status)
      SELECT id,?,?,?,?,?,?,?,1,'ACTIVE' FROM categories WHERE module='MEDICAL' LIMIT 1`, ['Bệnh viện Đa khoa Bến Tre','CSYT-001','Khám và cấp cứu đa khoa.','Số 1 Nguyễn Văn Tư, Bến Tre','02753821111','115','24/7']);
    await db.query(`INSERT INTO health_services(facility_id,name,description,duration_minutes,price_from,status) VALUES
      (?, 'Khám sức khỏe tổng quát','Gói khám cơ bản cho du khách',60,350000,'ACTIVE'),
      (?, 'Tư vấn dinh dưỡng','Tư vấn chế độ ăn lành mạnh',45,200000,'ACTIVE')`, [facility.insertId,facility.insertId]);
    const hStart = new Date(Date.now()+10*86400000); const hEnd = new Date(hStart.getTime()+2*3600000);
    await db.query(`INSERT INTO health_activities(organizer_facility_id,title,description,location,starts_at,ends_at,capacity,status)
      VALUES (?,?,?,?,?,?,100,'OPEN')`, [facility.insertId,'Đi bộ vì sức khỏe','Hoạt động cộng đồng miễn phí.','Công viên Bến Tre',hStart,hEnd]);
    const [articleCat] = await db.query("SELECT id FROM categories WHERE module='ARTICLE' LIMIT 1");
    await db.query(`INSERT INTO articles(category_id,author_id,title,slug,excerpt,content,status,published_at) VALUES
      (?,?,?,?,?,?,'PUBLISHED',NOW())`, [articleCat[0].id,ids.admin,'Bến Tre phát triển du lịch xanh','ben-tre-phat-trien-du-lich-xanh','Các mô hình du lịch thân thiện môi trường.','Nội dung bài viết mẫu về du lịch bền vững tại Bến Tre.']);
    const [eventCat] = await db.query("SELECT id FROM categories WHERE module='EVENT' LIMIT 1");
    await db.query(`INSERT INTO events(category_id,organizer_id,title,slug,description,location,starts_at,ends_at,capacity,status)
      VALUES (?,?,?,?,?,?,?,?,300,'PUBLISHED')`, [eventCat[0].id,ids.admin,'Ngày hội Xứ Dừa','ngay-hoi-xu-dua','Không gian văn hóa và ẩm thực dừa.','Quảng trường Bến Tre',hStart,hEnd]);
    const subtotal = 1700000;
    const [booking] = await db.query(`INSERT INTO bookings(booking_code,departure_id,customer_id,adult_count,contact_name,contact_phone,contact_email,subtotal,total_amount,status)
      VALUES ('BT20260827-001',?,?,2,'Lê Văn Nam','0901000003','khach@bentre.vn',?,?,'CONFIRMED')`, [departure.insertId,ids.khach,subtotal,subtotal]);
    await db.query('UPDATE tour_departures SET booked_seats=2 WHERE id=?', [departure.insertId]);
    await db.query(`INSERT INTO booking_status_history(booking_id,new_status,changed_by,note) VALUES (?,'CONFIRMED',?,'Dữ liệu mẫu')`, [booking.insertId,ids.admin]);
    await db.query(`INSERT INTO payments(booking_id,transaction_code,method,amount,status,paid_at) VALUES (?,'PAY-DEMO-001','BANK_TRANSFER',?,'SUCCESS',NOW())`, [booking.insertId,subtotal]);
    await db.query(`INSERT INTO reviews(user_id,booking_id,target_type,tour_id,rating,title,content,status) VALUES (?,?, 'TOUR',?,5,'Trải nghiệm tuyệt vời','Tour xanh, HDV nhiệt tình.','PUBLISHED')`, [ids.khach,booking.insertId,tour.insertId]);
  });
  console.log('Đã thêm dữ liệu mẫu. Tài khoản admin/hdv/nv1/khach, mật khẩu chung: 123');
  await pool.end();
})().catch(async (error) => { console.error('Seed thất bại:', error); await pool.end(); process.exit(1); });
