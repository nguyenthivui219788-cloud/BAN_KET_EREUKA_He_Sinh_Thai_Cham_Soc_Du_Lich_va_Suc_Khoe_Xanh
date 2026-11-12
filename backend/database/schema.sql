-- CSDL cho hệ thống du lịch bền vững và chăm sóc sức khỏe phường Bến Tre
-- MySQL 8.0+, utf8mb4. Chạy: mysql -u root -p < database/schema.sql

CREATE DATABASE IF NOT EXISTS ben_tre_sustainable
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ben_tre_sustainable;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS content_report_actions;
DROP TABLE IF EXISTS content_reports;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS customer_feedback;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS review_criteria;
DROP TABLE IF EXISTS booking_status_history;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS booking_guests;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS tour_departures;
DROP TABLE IF EXISTS tour_itinerary_items;
DROP TABLE IF EXISTS tour_places;
DROP TABLE IF EXISTS tour_services;
DROP TABLE IF EXISTS tours;
DROP TABLE IF EXISTS tourism_services;
DROP TABLE IF EXISTS health_activity_registrations;
DROP TABLE IF EXISTS health_activities;
DROP TABLE IF EXISTS health_services;
DROP TABLE IF EXISTS medical_facilities;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS places;
DROP TABLE IF EXISTS guide_languages;
DROP TABLE IF EXISTS languages;
DROP TABLE IF EXISTS guides;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS media;
DROP TABLE IF EXISTS categories;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  parent_id BIGINT UNSIGNED NULL,
  module ENUM('PLACE','TOUR','TOURISM_SERVICE','MEDICAL','HEALTH_SERVICE','HEALTH_ACTIVITY','ARTICLE','EVENT') NOT NULL,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(140) NOT NULL,
  description VARCHAR(500) NULL,
  sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_category_module_slug (module, slug),
  KEY idx_category_parent (parent_id),
  CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE media (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  url VARCHAR(1000) NOT NULL,
  mime_type VARCHAR(100) NULL,
  alt_text VARCHAR(255) NULL,
  size_bytes BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(60) NOT NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(20) NULL,
  password_hash VARCHAR(255) NOT NULL COMMENT 'Chỉ lưu bcrypt/argon2 hash',
  full_name VARCHAR(150) NOT NULL,
  gender ENUM('MALE','FEMALE','OTHER','UNSPECIFIED') NOT NULL DEFAULT 'UNSPECIFIED',
  date_of_birth DATE NULL,
  address VARCHAR(500) NULL,
  avatar_media_id BIGINT UNSIGNED NULL,
  status ENUM('ACTIVE','INACTIVE','LOCKED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  email_verified_at DATETIME NULL,
  last_login_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE KEY uq_user_username (username),
  UNIQUE KEY uq_user_email (email),
  UNIQUE KEY uq_user_phone (phone),
  CONSTRAINT fk_user_avatar FOREIGN KEY (avatar_media_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE roles (
  id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(30) NOT NULL,
  name VARCHAR(80) NOT NULL,
  UNIQUE KEY uq_role_code (code)
) ENGINE=InnoDB;

CREATE TABLE user_roles (
  user_id BIGINT UNSIGNED NOT NULL,
  role_id SMALLINT UNSIGNED NOT NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_user_role_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_role_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE guides (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  guide_code VARCHAR(30) NOT NULL,
  license_number VARCHAR(80) NULL,
  license_expiry DATE NULL,
  experience_years TINYINT UNSIGNED NOT NULL DEFAULT 0,
  specialties VARCHAR(500) NULL,
  bio TEXT NULL,
  eco_training_certified BOOLEAN NOT NULL DEFAULT FALSE,
  health_first_aid_certified BOOLEAN NOT NULL DEFAULT FALSE,
  availability_status ENUM('AVAILABLE','BUSY','ON_LEAVE','INACTIVE') NOT NULL DEFAULT 'AVAILABLE',
  average_rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_guide_user (user_id),
  UNIQUE KEY uq_guide_code (guide_code),
  CONSTRAINT chk_guide_rating CHECK (average_rating BETWEEN 0 AND 5),
  CONSTRAINT fk_guide_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE languages (
  id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(10) NOT NULL,
  name VARCHAR(80) NOT NULL,
  UNIQUE KEY uq_language_code (code)
) ENGINE=InnoDB;

CREATE TABLE guide_languages (
  guide_id BIGINT UNSIGNED NOT NULL,
  language_id SMALLINT UNSIGNED NOT NULL,
  proficiency ENUM('BASIC','INTERMEDIATE','ADVANCED','NATIVE') NOT NULL DEFAULT 'INTERMEDIATE',
  PRIMARY KEY (guide_id, language_id),
  CONSTRAINT fk_gl_guide FOREIGN KEY (guide_id) REFERENCES guides(id) ON DELETE CASCADE,
  CONSTRAINT fk_gl_language FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE places (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id BIGINT UNSIGNED NULL,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL,
  short_description VARCHAR(500) NULL,
  description TEXT NULL,
  address VARCHAR(500) NOT NULL,
  ward VARCHAR(120) NOT NULL DEFAULT 'Phường Bến Tre',
  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,
  opening_time TIME NULL,
  closing_time TIME NULL,
  ticket_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  eco_score DECIMAL(3,1) NULL,
  capacity INT UNSIGNED NULL,
  contact_phone VARCHAR(20) NULL,
  cover_media_id BIGINT UNSIGNED NULL,
  status ENUM('DRAFT','PUBLISHED','TEMPORARILY_CLOSED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  created_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE KEY uq_place_slug (slug),
  KEY idx_place_status_category (status, category_id),
  KEY idx_place_coordinates (latitude, longitude),
  CONSTRAINT chk_place_eco CHECK (eco_score IS NULL OR eco_score BETWEEN 0 AND 10),
  CONSTRAINT fk_place_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  CONSTRAINT fk_place_cover FOREIGN KEY (cover_media_id) REFERENCES media(id) ON DELETE SET NULL,
  CONSTRAINT fk_place_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE tourism_services (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id BIGINT UNSIGNED NULL,
  provider_name VARCHAR(200) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT NULL,
  address VARCHAR(500) NULL,
  phone VARCHAR(20) NULL,
  email VARCHAR(255) NULL,
  unit_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  unit_name VARCHAR(50) NOT NULL DEFAULT 'lượt',
  eco_certified BOOLEAN NOT NULL DEFAULT FALSE,
  status ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_ts_category_status (category_id, status),
  CONSTRAINT fk_ts_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE tours (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id BIGINT UNSIGNED NULL,
  code VARCHAR(30) NOT NULL,
  name VARCHAR(220) NOT NULL,
  slug VARCHAR(240) NOT NULL,
  summary VARCHAR(700) NULL,
  description TEXT NULL,
  duration_minutes INT UNSIGNED NOT NULL,
  meeting_point VARCHAR(500) NULL,
  adult_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  child_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  min_guests SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  max_guests SMALLINT UNSIGNED NOT NULL,
  eco_score DECIMAL(3,1) NULL,
  carbon_kg_per_guest DECIMAL(8,3) NULL,
  included_services TEXT NULL,
  excluded_services TEXT NULL,
  cancellation_policy TEXT NULL,
  cover_media_id BIGINT UNSIGNED NULL,
  status ENUM('DRAFT','PUBLISHED','PAUSED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  created_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  UNIQUE KEY uq_tour_code (code),
  UNIQUE KEY uq_tour_slug (slug),
  KEY idx_tour_status_category (status, category_id),
  FULLTEXT KEY ftx_tour_search (name, summary, description),
  CONSTRAINT chk_tour_capacity CHECK (max_guests >= min_guests),
  CONSTRAINT chk_tour_eco CHECK (eco_score IS NULL OR eco_score BETWEEN 0 AND 10),
  CONSTRAINT fk_tour_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  CONSTRAINT fk_tour_cover FOREIGN KEY (cover_media_id) REFERENCES media(id) ON DELETE SET NULL,
  CONSTRAINT fk_tour_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE tour_services (
  tour_id BIGINT UNSIGNED NOT NULL,
  service_id BIGINT UNSIGNED NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  is_included BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (tour_id, service_id),
  CONSTRAINT fk_toursvc_tour FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
  CONSTRAINT fk_toursvc_service FOREIGN KEY (service_id) REFERENCES tourism_services(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE tour_places (
  tour_id BIGINT UNSIGNED NOT NULL,
  place_id BIGINT UNSIGNED NOT NULL,
  visit_order SMALLINT UNSIGNED NOT NULL,
  stay_minutes SMALLINT UNSIGNED NULL,
  PRIMARY KEY (tour_id, place_id),
  UNIQUE KEY uq_tour_visit_order (tour_id, visit_order),
  CONSTRAINT fk_tp_tour FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
  CONSTRAINT fk_tp_place FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE tour_itinerary_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tour_id BIGINT UNSIGNED NOT NULL,
  day_number SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  item_order SMALLINT UNSIGNED NOT NULL,
  start_time TIME NULL,
  end_time TIME NULL,
  title VARCHAR(220) NOT NULL,
  description TEXT NULL,
  place_id BIGINT UNSIGNED NULL,
  UNIQUE KEY uq_itinerary_order (tour_id, day_number, item_order),
  CONSTRAINT fk_itinerary_tour FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
  CONSTRAINT fk_itinerary_place FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE tour_departures (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tour_id BIGINT UNSIGNED NOT NULL,
  guide_id BIGINT UNSIGNED NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NULL,
  capacity SMALLINT UNSIGNED NOT NULL,
  booked_seats SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  price_override DECIMAL(12,2) NULL,
  status ENUM('OPEN','FULL','CONFIRMED','IN_PROGRESS','COMPLETED','CANCELLED') NOT NULL DEFAULT 'OPEN',
  note VARCHAR(1000) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_departure_search (tour_id, status, starts_at),
  KEY idx_departure_guide (guide_id, starts_at),
  CONSTRAINT chk_departure_seats CHECK (booked_seats <= capacity),
  CONSTRAINT fk_departure_tour FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE RESTRICT,
  CONSTRAINT fk_departure_guide FOREIGN KEY (guide_id) REFERENCES guides(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE bookings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_code VARCHAR(40) NOT NULL,
  departure_id BIGINT UNSIGNED NOT NULL,
  customer_id BIGINT UNSIGNED NOT NULL,
  adult_count SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  child_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  contact_name VARCHAR(150) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  contact_email VARCHAR(255) NULL,
  pickup_address VARCHAR(500) NULL,
  special_request TEXT NULL,
  subtotal DECIMAL(14,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(14,2) NOT NULL DEFAULT 0,
  status ENUM('PENDING','CONFIRMED','PAID','IN_PROGRESS','COMPLETED','CANCELLED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  cancelled_reason VARCHAR(1000) NULL,
  cancelled_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_booking_code (booking_code),
  KEY idx_booking_customer (customer_id, created_at),
  KEY idx_booking_departure_status (departure_id, status),
  CONSTRAINT chk_booking_guest_count CHECK (adult_count + child_count > 0),
  CONSTRAINT chk_booking_total CHECK (total_amount >= 0),
  CONSTRAINT fk_booking_departure FOREIGN KEY (departure_id) REFERENCES tour_departures(id) ON DELETE RESTRICT,
  CONSTRAINT fk_booking_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE booking_guests (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id BIGINT UNSIGNED NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  guest_type ENUM('ADULT','CHILD') NOT NULL,
  date_of_birth DATE NULL,
  phone VARCHAR(20) NULL,
  health_note VARCHAR(1000) NULL,
  emergency_contact VARCHAR(255) NULL,
  checked_in_at DATETIME NULL,
  KEY idx_guest_booking (booking_id),
  CONSTRAINT fk_guest_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id BIGINT UNSIGNED NOT NULL,
  transaction_code VARCHAR(100) NULL,
  method ENUM('CASH','BANK_TRANSFER','CARD','E_WALLET') NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  status ENUM('PENDING','SUCCESS','FAILED','REFUNDED','PARTIALLY_REFUNDED') NOT NULL DEFAULT 'PENDING',
  paid_at DATETIME NULL,
  gateway_payload JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_payment_transaction (transaction_code),
  KEY idx_payment_booking_status (booking_id, status),
  CONSTRAINT chk_payment_amount CHECK (amount > 0),
  CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE booking_status_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id BIGINT UNSIGNED NOT NULL,
  old_status VARCHAR(30) NULL,
  new_status VARCHAR(30) NOT NULL,
  note VARCHAR(1000) NULL,
  changed_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_bsh_booking_time (booking_id, created_at),
  CONSTRAINT fk_bsh_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_bsh_user FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE medical_facilities (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id BIGINT UNSIGNED NULL,
  name VARCHAR(220) NOT NULL,
  license_number VARCHAR(100) NULL,
  description TEXT NULL,
  address VARCHAR(500) NOT NULL,
  ward VARCHAR(120) NOT NULL DEFAULT 'Phường Bến Tre',
  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,
  phone VARCHAR(20) NOT NULL,
  emergency_phone VARCHAR(20) NULL,
  email VARCHAR(255) NULL,
  opening_hours VARCHAR(255) NULL,
  is_emergency_24h BOOLEAN NOT NULL DEFAULT FALSE,
  cover_media_id BIGINT UNSIGNED NULL,
  status ENUM('ACTIVE','TEMPORARILY_CLOSED','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_facility_category_status (category_id, status),
  CONSTRAINT fk_facility_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  CONSTRAINT fk_facility_cover FOREIGN KEY (cover_media_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE health_services (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  facility_id BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NULL,
  name VARCHAR(220) NOT NULL,
  description TEXT NULL,
  duration_minutes SMALLINT UNSIGNED NULL,
  price_from DECIMAL(12,2) NOT NULL DEFAULT 0,
  requires_appointment BOOLEAN NOT NULL DEFAULT TRUE,
  status ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_hs_facility_status (facility_id, status),
  CONSTRAINT fk_hs_facility FOREIGN KEY (facility_id) REFERENCES medical_facilities(id) ON DELETE CASCADE,
  CONSTRAINT fk_hs_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE health_activities (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id BIGINT UNSIGNED NULL,
  organizer_facility_id BIGINT UNSIGNED NULL,
  title VARCHAR(220) NOT NULL,
  description TEXT NULL,
  location VARCHAR(500) NOT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  capacity INT UNSIGNED NULL,
  fee DECIMAL(12,2) NOT NULL DEFAULT 0,
  contact_phone VARCHAR(20) NULL,
  status ENUM('DRAFT','OPEN','FULL','COMPLETED','CANCELLED') NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_health_activity_time (status, starts_at),
  CONSTRAINT chk_health_activity_time CHECK (ends_at > starts_at),
  CONSTRAINT fk_ha_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  CONSTRAINT fk_ha_facility FOREIGN KEY (organizer_facility_id) REFERENCES medical_facilities(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE health_activity_registrations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  activity_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  attendee_count SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  health_note VARCHAR(1000) NULL,
  status ENUM('REGISTERED','ATTENDED','CANCELLED') NOT NULL DEFAULT 'REGISTERED',
  registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_activity_user (activity_id, user_id),
  CONSTRAINT fk_har_activity FOREIGN KEY (activity_id) REFERENCES health_activities(id) ON DELETE CASCADE,
  CONSTRAINT fk_har_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE articles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id BIGINT UNSIGNED NULL,
  author_id BIGINT UNSIGNED NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(280) NOT NULL,
  excerpt VARCHAR(700) NULL,
  content LONGTEXT NOT NULL,
  cover_media_id BIGINT UNSIGNED NULL,
  status ENUM('DRAFT','PUBLISHED','HIDDEN','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  published_at DATETIME NULL,
  view_count BIGINT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_article_slug (slug),
  KEY idx_article_status_published (status, published_at),
  FULLTEXT KEY ftx_article_search (title, excerpt, content),
  CONSTRAINT fk_article_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  CONSTRAINT fk_article_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_article_cover FOREIGN KEY (cover_media_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id BIGINT UNSIGNED NULL,
  organizer_id BIGINT UNSIGNED NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(280) NOT NULL,
  description TEXT NULL,
  location VARCHAR(500) NOT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  capacity INT UNSIGNED NULL,
  registration_url VARCHAR(1000) NULL,
  cover_media_id BIGINT UNSIGNED NULL,
  status ENUM('DRAFT','PUBLISHED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_event_slug (slug),
  KEY idx_event_status_time (status, starts_at),
  CONSTRAINT chk_event_time CHECK (ends_at > starts_at),
  CONSTRAINT fk_event_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  CONSTRAINT fk_event_organizer FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_event_cover FOREIGN KEY (cover_media_id) REFERENCES media(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE review_criteria (
  id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  target_type ENUM('TOUR','PLACE','GUIDE') NOT NULL,
  code VARCHAR(40) NOT NULL,
  name VARCHAR(120) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE KEY uq_review_criterion (target_type, code)
) ENGINE=InnoDB;

CREATE TABLE reviews (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  booking_id BIGINT UNSIGNED NULL,
  target_type ENUM('TOUR','PLACE','GUIDE') NOT NULL,
  tour_id BIGINT UNSIGNED NULL,
  place_id BIGINT UNSIGNED NULL,
  guide_id BIGINT UNSIGNED NULL,
  rating TINYINT UNSIGNED NOT NULL,
  title VARCHAR(200) NULL,
  content TEXT NULL,
  admin_reply TEXT NULL,
  replied_by BIGINT UNSIGNED NULL,
  replied_at DATETIME NULL,
  status ENUM('PENDING','PUBLISHED','HIDDEN','REJECTED') NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_review_target_status (target_type, status, created_at),
  KEY idx_review_tour (tour_id),
  KEY idx_review_place (place_id),
  KEY idx_review_guide (guide_id),
  CONSTRAINT chk_review_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT chk_review_one_target CHECK (
    (target_type = 'TOUR' AND tour_id IS NOT NULL AND place_id IS NULL AND guide_id IS NULL) OR
    (target_type = 'PLACE' AND place_id IS NOT NULL AND tour_id IS NULL AND guide_id IS NULL) OR
    (target_type = 'GUIDE' AND guide_id IS NOT NULL AND tour_id IS NULL AND place_id IS NULL)
  ),
  CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_review_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
  CONSTRAINT fk_review_tour FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE,
  CONSTRAINT fk_review_place FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
  CONSTRAINT fk_review_guide FOREIGN KEY (guide_id) REFERENCES guides(id) ON DELETE CASCADE,
  CONSTRAINT fk_review_reply_user FOREIGN KEY (replied_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE customer_feedback (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(20) NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority ENUM('LOW','NORMAL','HIGH','URGENT') NOT NULL DEFAULT 'NORMAL',
  status ENUM('NEW','PROCESSING','RESOLVED','CLOSED') NOT NULL DEFAULT 'NEW',
  assigned_to BIGINT UNSIGNED NULL,
  response TEXT NULL,
  responded_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_feedback_status_priority (status, priority, created_at),
  CONSTRAINT fk_feedback_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_feedback_assignee FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE content_reports (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reporter_id BIGINT UNSIGNED NULL,
  target_type ENUM('ARTICLE','EVENT','TOUR','PLACE','REVIEW','OTHER') NOT NULL,
  target_id BIGINT UNSIGNED NOT NULL COMMENT 'ID logic theo target_type',
  reason ENUM('FALSE_INFORMATION','INAPPROPRIATE','SPAM','COPYRIGHT','OTHER') NOT NULL,
  description TEXT NULL,
  status ENUM('NEW','REVIEWING','RESOLVED','REJECTED') NOT NULL DEFAULT 'NEW',
  assigned_to BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME NULL,
  KEY idx_report_queue (status, created_at),
  KEY idx_report_target (target_type, target_id),
  CONSTRAINT fk_report_reporter FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_report_assignee FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE content_report_actions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  report_id BIGINT UNSIGNED NOT NULL,
  actor_id BIGINT UNSIGNED NULL,
  action ENUM('NOTE','HIDE_CONTENT','RESTORE_CONTENT','WARN_USER','REJECT_REPORT','RESOLVE_REPORT') NOT NULL,
  note VARCHAR(1000) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_report_action (report_id, created_at),
  CONSTRAINT fk_cra_report FOREIGN KEY (report_id) REFERENCES content_reports(id) ON DELETE CASCADE,
  CONSTRAINT fk_cra_actor FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE notifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message VARCHAR(1000) NOT NULL,
  action_url VARCHAR(1000) NULL,
  read_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_notification_user_read (user_id, read_at, created_at),
  CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Dữ liệu nền (mật khẩu tài khoản phải được tạo từ backend, không ghi mật khẩu thô ở đây).
INSERT INTO roles (code, name) VALUES
  ('ADMIN', 'Quản trị viên'),
  ('GUIDE', 'Hướng dẫn viên'),
  ('CUSTOMER', 'Khách hàng');

INSERT INTO languages (code, name) VALUES
  ('vi', 'Tiếng Việt'), ('en', 'Tiếng Anh'), ('fr', 'Tiếng Pháp');

INSERT INTO categories (module, name, slug, sort_order) VALUES
  ('PLACE', 'Du lịch sinh thái', 'du-lich-sinh-thai', 1),
  ('PLACE', 'Văn hóa - lịch sử', 'van-hoa-lich-su', 2),
  ('TOUR', 'Tour sinh thái', 'tour-sinh-thai', 1),
  ('TOURISM_SERVICE', 'Ẩm thực', 'am-thuc', 1),
  ('TOURISM_SERVICE', 'Lưu trú', 'luu-tru', 2),
  ('MEDICAL', 'Cơ sở y tế', 'co-so-y-te', 1),
  ('HEALTH_SERVICE', 'Chăm sóc sức khỏe', 'cham-soc-suc-khoe', 1),
  ('HEALTH_ACTIVITY', 'Hoạt động cộng đồng', 'hoat-dong-cong-dong', 1),
  ('ARTICLE', 'Tin du lịch', 'tin-du-lich', 1),
  ('EVENT', 'Sự kiện địa phương', 'su-kien-dia-phuong', 1);

-- View tiện cho dashboard quản trị.
CREATE OR REPLACE VIEW vw_departure_availability AS
SELECT d.id AS departure_id, t.code AS tour_code, t.name AS tour_name,
       d.starts_at, d.capacity, d.booked_seats,
       d.capacity - d.booked_seats AS available_seats, d.status
FROM tour_departures d JOIN tours t ON t.id = d.tour_id;

CREATE OR REPLACE VIEW vw_tour_rating_summary AS
SELECT t.id AS tour_id, t.code, t.name,
       COUNT(r.id) AS review_count, ROUND(AVG(r.rating), 2) AS average_rating
FROM tours t
LEFT JOIN reviews r ON r.tour_id = t.id AND r.status = 'PUBLISHED'
GROUP BY t.id, t.code, t.name;

