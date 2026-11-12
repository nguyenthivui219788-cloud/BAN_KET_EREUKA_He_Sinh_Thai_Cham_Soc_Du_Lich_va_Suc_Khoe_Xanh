(function () {
  if (document.documentElement) document.documentElement.style.backgroundColor = '#04543F';
  const WEBSITE_NAME = 'HỆ SINH THÁI DU LỊCH VÀ CHĂM SÓC SỨC KHỎE XANH TẠI BẾN TRE';

  function applyWebsiteName() {
    const oldTitle = document.title.trim();
    const pageName = oldTitle
      .replace(/\s*[-|–]\s*(?:Bến Tre Admin|Phường Bến Tre|Du lịch Bến Tre).*$/i, '')
      .replace(/^Bến Tre Admin\s*[-|–]\s*/i, '')
      .trim();
    document.title = pageName && !pageName.toLocaleLowerCase('vi').includes('hệ sinh thái du lịch')
      ? `${pageName} | ${WEBSITE_NAME}`
      : WEBSITE_NAME;

    document.querySelectorAll('aside.sidebar').forEach(sidebar => {
      const brand = sidebar.querySelector(':scope > a:first-child');
      if (!brand) return;
      const textBox = brand.children[1];
      if (!textBox || textBox.children.length < 2) return;

      // Giữ logo và tên thương hiệu nằm gọn trong sidebar, không bị ép chữ
      // thành một cột dọc khi CSS riêng của từng trang được tải lại.
      brand.style.setProperty('display', 'flex', 'important');
      brand.style.setProperty('align-items', 'center', 'important');
      brand.style.setProperty('width', '100%', 'important');
      brand.style.setProperty('box-sizing', 'border-box', 'important');
      brand.style.setProperty('padding-left', '14px', 'important');
      brand.style.setProperty('padding-right', '12px', 'important');
      brand.style.setProperty('gap', '10px', 'important');
      if (brand.children[0]) {
        brand.children[0].style.setProperty('flex', '0 0 40px', 'important');
        brand.children[0].style.setProperty('width', '40px', 'important');
        brand.children[0].style.setProperty('height', '40px', 'important');
        brand.children[0].style.setProperty('margin', '0', 'important');
      }
      textBox.style.setProperty('display', 'flex', 'important');
      textBox.style.setProperty('flex-direction', 'column', 'important');
      textBox.style.setProperty('flex', '1 1 auto', 'important');
      textBox.style.setProperty('min-width', '0', 'important');
      textBox.style.setProperty('width', 'auto', 'important');
      textBox.style.setProperty('text-align', 'left', 'important');
      textBox.children[0].textContent = 'HỆ SINH THÁI DU LỊCH';
      textBox.children[1].textContent = 'VÀ CHĂM SÓC SỨC KHỎE XANH TẠI BẾN TRE';
      textBox.children[0].style.setProperty('font-size', '12px', 'important');
      textBox.children[0].style.setProperty('line-height', '1.25', 'important');
      textBox.children[0].style.setProperty('white-space', 'normal', 'important');
      textBox.children[0].style.setProperty('word-break', 'normal', 'important');
      textBox.children[0].style.setProperty('overflow-wrap', 'normal', 'important');
      textBox.children[1].style.setProperty('font-size', '11px', 'important');
      textBox.children[1].style.setProperty('line-height', '1.35', 'important');
      textBox.children[1].style.setProperty('white-space', 'normal', 'important');
      textBox.children[1].style.setProperty('word-break', 'normal', 'important');
      textBox.children[1].style.setProperty('overflow-wrap', 'normal', 'important');
    });
  }
  // Dùng API cùng miền khi chạy qua backend :8080; với Live Server/file://
  // thì gọi thẳng backend để đăng nhập và đăng ký không bị gửi nhầm cổng.
  const isBackendOrigin = ['8080', ''].includes(window.location.port)
    && /^https?:$/.test(window.location.protocol);
  const API_ROOT = isBackendOrigin ? '/api' : 'http://localhost:8080/api';

  async function request(path, options = {}) {
    try {
      const token = localStorage.getItem('token');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      if (options.signal) {
        if (options.signal.aborted) controller.abort();
        else options.signal.addEventListener('abort', () => controller.abort(), { once: true });
      }
      let response;
      try {
        response = await fetch(`${API_ROOT}${path}`, {
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers
          }
        });
      } finally {
        clearTimeout(timeoutId);
      }
      const responseText = response.status === 204 ? '' : await response.text();
      let body = null;
      try {
        body = responseText ? JSON.parse(responseText) : null;
      } catch (_) {
        throw new Error(`Máy chủ trả về dữ liệu không hợp lệ (HTTP ${response.status}).`);
      }
      if (!response.ok) {
        const error = new Error(body?.message || `Yêu cầu thất bại (HTTP ${response.status}).`);
        error.status = response.status;
        error.details = body?.details;
        throw error;
      }
      return body;
    } catch (error) {
      if (error?.name === 'AbortError') throw new Error('Yêu cầu quá thời gian. Vui lòng kiểm tra mạng và thử lại.');
      if (error instanceof TypeError) throw new Error('Không thể kết nối máy chủ. Vui lòng kiểm tra mạng hoặc khởi động backend tại http://localhost:8080.');
      throw error;
    }
  }

  window.BenTreAPI = {
    request,
    login: (username, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
    register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    me: () => request('/auth/me'),
    list: (resource, params = {}) => request(`/${resource}?${new URLSearchParams(params)}`),
    get: (resource, id) => request(`/${resource}/${id}`),
    create: (resource, data) => request(`/${resource}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (resource, id, data) => request(`/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (resource, id) => request(`/${resource}/${id}`, { method: 'DELETE' }),
    createBooking: (data) => request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
    bookings: () => request('/bookings'),
    assignBookingGuide: (bookingId, guideId) => request(`/bookings/${encodeURIComponent(bookingId)}/assign-guide`, { method: 'PATCH', body: JSON.stringify({ guideId }) }),
    updateBookingStatus: (bookingId, status, reason = null) => request(`/bookings/${encodeURIComponent(bookingId)}/status`, {
      method: 'PATCH', body: JSON.stringify({ status, reason })
    }),
    respondBookingAssignment: (bookingId, decision, reason = null) => request(`/bookings/${encodeURIComponent(bookingId)}/guide-response`, {
      method: 'PATCH', body: JSON.stringify({ decision, reason })
    }),
    createReview: (data) => request('/reviews', { method: 'POST', body: JSON.stringify(data) }),
    notifications: (unreadOnly = false) => request(`/notifications?unreadOnly=${unreadOnly}`),
    markNotificationRead: (id) => request(`/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH', body: '{}' }),
    markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PATCH', body: '{}' }),
    saveSession(payload) {
      if (!payload?.token || !payload?.user || !Array.isArray(payload.user.roles)) {
        throw new Error('Dữ liệu phiên đăng nhập không hợp lệ.');
      }
      try {
        localStorage.setItem('token', payload.token);
        localStorage.setItem('currentUser', JSON.stringify(payload.user));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        throw new Error('Trình duyệt không thể lưu phiên đăng nhập. Vui lòng cho phép lưu trữ trang web.');
      }
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
  };

  function getRequiredWorkspaceRole() {
    const path = decodeURIComponent(window.location.pathname).replace(/\\/g, '/');
    if (/\/(admin|admin-ben-tre)\//i.test(path)) return 'ADMIN';
    if (/\/partner\//i.test(path)) return 'GUIDE';
    return null;
  }

  async function enforceWorkspaceAccess() {
    const requiredRole = getRequiredWorkspaceRole();
    if (!requiredRole) return true;

    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('currentUser');
    let currentUser = null;
    try { currentUser = userStr ? JSON.parse(userStr) : null; } catch (_) {}

    const userRoles = Array.isArray(currentUser?.roles)
      ? currentUser.roles
      : (currentUser?.role === 'admin' ? ['ADMIN'] : (currentUser?.role === 'guide' ? ['GUIDE'] : []));

    const hasLocalRole = userRoles.includes(requiredRole);

    if (!token && !hasLocalRole) {
      window.location.replace('../khach-hang/dang-nhap.html');
      return false;
    }

    if (token) {
      try {
        const response = await window.BenTreAPI.me();
        const apiRoles = response?.data?.roles || [];
        if (!apiRoles.includes(requiredRole) && !hasLocalRole) {
          window.BenTreAPI.logout();
          window.location.replace('../khach-hang/dang-nhap.html');
          return false;
        }
        return true;
      } catch (error) {
        if (hasLocalRole) return true;
        window.BenTreAPI.logout();
        window.location.replace('../khach-hang/dang-nhap.html');
        return false;
      }
    }

    if (hasLocalRole) return true;

    window.location.replace('../khach-hang/dang-nhap.html');
    return false;
  }

  // Nút đăng xuất dùng chung cho toàn bộ giao diện quản trị.
  window.logoutAdmin = function () {
    window.BenTreAPI.logout();
    sessionStorage.clear();
    window.location.href = '../khach-hang/dang-nhap.html';
  };

  function addAdminLogoutButton() {
    if (getRequiredWorkspaceRole() !== 'ADMIN') return;
    const sidebar = document.querySelector('aside.sidebar, .sidebar');
    if (!sidebar) return;

    // Loại bỏ nút trùng thừa do script cũ tiêm vào nếu có
    const injected = document.getElementById('adminLogoutButton');
    if (injected) injected.remove();

    // Tìm toàn bộ các phần tử đăng xuất đang có trong sidebar
    const allLogouts = Array.from(sidebar.querySelectorAll('a, button')).filter(el => {
      const text = (el.textContent || '').trim();
      const href = (el.getAttribute('href') || '').toLowerCase();
      return text.includes('Đăng xuất') || href.includes('dang-nhap.html');
    });

    // Nếu có từ 2 nút trở lên trong sidebar, xóa triệt để các nút thừa, chỉ giữ đúng 1 nút
    if (allLogouts.length > 1) {
      for (let i = 1; i < allLogouts.length; i++) {
        const container = allLogouts[i].closest('div');
        if (container && container !== sidebar && container.children.length === 1) {
          container.remove();
        } else {
          allLogouts[i].remove();
        }
      }
    }

    // Lấy nút đăng xuất duy nhất còn lại hoặc tạo mới nếu trang chưa có
    let logoutBtn = allLogouts[0];
    if (!logoutBtn) {
      const container = document.createElement('div');
      container.className = 'sidebar-logout-container';
      container.style.cssText = 'margin-top: auto; padding: 14px 14px 16px; width: 100%; box-sizing: border-box;';
      logoutBtn = document.createElement('a');
      logoutBtn.href = '../khach-hang/dang-nhap.html';
      container.appendChild(logoutBtn);
      sidebar.appendChild(container);
    }

    // Chuẩn hóa 100% giao diện và sự kiện cho nút đăng xuất theo đúng 1 mẫu thiết kế chuẩn
    logoutBtn.className = 'sidebar-logout-btn';
    logoutBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
      <span>Đăng xuất</span>
    `;
    logoutBtn.setAttribute('style', `
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 8px !important;
      background: #FFFFFF !important;
      color: #DC2626 !important;
      font-weight: 700 !important;
      font-size: 13px !important;
      padding: 10px 14px !important;
      border-radius: 10px !important;
      text-decoration: none !important;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15) !important;
      transition: all 0.2s ease !important;
      cursor: pointer !important;
      width: 100% !important;
      box-sizing: border-box !important;
      border: none !important;
      outline: none !important;
    `);

    logoutBtn.onmouseenter = () => {
      logoutBtn.style.setProperty('background', '#FEE2E2', 'important');
      logoutBtn.style.setProperty('transform', 'translateY(-1px)', 'important');
    };
    logoutBtn.onmouseleave = () => {
      logoutBtn.style.setProperty('background', '#FFFFFF', 'important');
      logoutBtn.style.setProperty('transform', 'translateY(0)', 'important');
    };

    logoutBtn.onclick = function (e) {
      e.preventDefault();
      window.logoutAdmin();
    };

    const parent = logoutBtn.parentElement;
    if (parent && parent !== sidebar) {
      parent.style.marginTop = 'auto';
      parent.style.padding = '14px 14px 16px';
    }
  }

  // Ép một giao diện sidebar thống nhất trên mọi trang admin. Nhiều trang cũ có
  // CSS và inline style riêng nên nếu không chuẩn hóa tại đây, khi chuyển trang
  // sidebar sẽ quay lại màu trắng hoặc mất màu active.
  function applySharedAdminSidebarTheme() {
    const sidebar = document.querySelector('aside.sidebar, .sidebar');
    if (!sidebar) return;
    sidebar.style.setProperty('background', '#04543F', 'important');
    sidebar.style.setProperty('color', '#ecfdf5', 'important');
    sidebar.style.setProperty('border-right-color', '#033F30', 'important');

    if (document.getElementById('sharedAdminSidebarTheme')) return;
    const style = document.createElement('style');
    style.id = 'sharedAdminSidebarTheme';
    style.textContent = `
      html{background-color:#04543f!important}
      body{background-color:#f8fafc!important}
      aside.sidebar,.sidebar{background:#04543f!important;color:#ecfdf5!important;border-right-color:#033f30!important;scrollbar-color:#34d399 #04543f!important;transition:transform .3s cubic-bezier(0.4, 0, 0.2, 1),width .25s ease!important}
      aside.sidebar::-webkit-scrollbar-thumb,.sidebar::-webkit-scrollbar-thumb{background:#34d399!important}
      aside.sidebar>a:first-child,.sidebar>a:first-child,.sidebar .sidebar-logo{padding:20px 18px 16px!important;gap:12px!important}
      aside.sidebar>a:first-child>div:first-child,.sidebar>a:first-child>div:first-child{width:42px!important;height:42px!important;background:#fff!important;border-color:#34d399!important;box-shadow:none!important}
      aside.sidebar>a:first-child>div:last-child>div:first-child,.sidebar>a:first-child>div:last-child>div:first-child{color:#fff!important;font-size:18px!important;font-weight:900!important}
      aside.sidebar>a:first-child>div:last-child>div:last-child,.sidebar>a:first-child>div:last-child>div:last-child{color:#a7f3d0!important;font-size:12px!important}
      aside.sidebar>nav,.sidebar-nav-list,.sidebar-nav{padding:6px 12px!important;gap:5px!important}
      aside.sidebar .sidebar-item-link,.sidebar .sidebar-item-link,.sidebar .nav-item{min-height:42px!important;padding:11px 14px!important;color:#ecfdf5!important;font-size:14px!important;font-weight:700!important;line-height:1.35!important;background:transparent!important}
      aside.sidebar .sidebar-item-left,.sidebar .sidebar-item-left{display:flex!important;align-items:center!important;gap:12px!important}
      aside.sidebar .sidebar-icon-svg,.sidebar .sidebar-icon-svg{width:18px!important;height:18px!important;display:inline-block!important}
      aside.sidebar .sidebar-sub-icon-svg,.sidebar .sidebar-sub-icon-svg{width:16px!important;height:16px!important;display:inline-block!important}
      aside.sidebar .sidebar-arrow-icon,.sidebar .sidebar-arrow-icon{display:inline-block!important}
      aside.sidebar .sidebar-sub-container,.sidebar .sidebar-sub-container,.guide-health-submenu{gap:3px!important;padding:4px 0 6px 8px!important}
      aside.sidebar .sidebar-sub-item,.sidebar .sidebar-sub-item,.guide-health-submenu a{display:flex!important;align-items:center!important;min-height:36px!important;padding:9px 14px!important;gap:11px!important;color:#d1fae5!important;font-size:13.5px!important;font-weight:600!important;line-height:1.3!important;background:transparent!important}
      aside.sidebar .sidebar-item-link:hover,aside.sidebar .sidebar-sub-item:hover,.sidebar .sidebar-item-link:hover,.sidebar .sidebar-sub-item:hover,.sidebar .nav-item:hover,.guide-health-submenu a:hover{background:#066b50!important;color:#fff!important}
      aside.sidebar a.sidebar-item-link.active,aside.sidebar .sidebar-sub-item.active,.sidebar a.sidebar-item-link.active,.sidebar .sidebar-sub-item.active,.sidebar .nav-item.active,.guide-health-submenu a.active{background:#10b981!important;color:#fff!important}
      aside.sidebar div:has(> .sidebar-sub-container) > .sidebar-item-link{background:transparent!important}
      .sidebar-logout-btn{display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;background:#fff!important;color:#dc2626!important;font-weight:700!important;font-size:13px!important;padding:10px 14px!important;border-radius:10px!important;text-decoration:none!important;box-shadow:0 2px 6px rgba(0,0,0,.15)!important;transition:all .2s ease!important;cursor:pointer!important;width:100%!important;box-sizing:border-box!important;border:none!important;outline:none!important}
      .sidebar-logout-btn:hover{background:#fee2e2!important;transform:translateY(-1px)!important}
      #adminLogoutButton{display:none!important}
      .stats-grid-4 .stat-icon-wrapper{display:none!important}
      .stats-grid-4 .stat-card-health{align-items:center!important;text-align:center!important}
      .stats-grid-4 .stat-card-top-row{width:100%!important;display:flex!important;justify-content:center!important;align-items:center!important;gap:0!important}
      .stats-grid-4 .stat-top-info{width:100%!important;display:flex!important;flex-direction:column!important;align-items:center!important;text-align:center!important}
      .stats-grid-4 .stat-big-number{order:1!important;font-size:34px!important;line-height:1.05!important;margin:0 0 6px!important;text-align:center!important}
      .stats-grid-4 .stat-card-title{order:2!important;width:100%!important;text-align:center!important}
      .stats-grid-4 .stat-big-unit{order:3!important;width:100%!important;text-align:center!important}
      .stats-grid-4 .stat-breakdown-list{width:100%!important;text-align:center!important}
      .stats-grid-4 .stat-breakdown-list li{display:grid!important;grid-template-columns:minmax(130px,160px) 36px!important;justify-content:center!important;column-gap:16px!important;text-align:left!important}
      .stats-grid-4 .stat-bullet-val{text-align:right!important}
      .stats-grid-4 .stat-bullet-name:before{content:none!important}
      .stats-grid-4 .stat-card-health>div:last-child{display:grid!important;grid-template-columns:minmax(130px,160px) 58px!important;justify-content:center!important;column-gap:16px!important;width:100%!important;text-align:left!important}
      .tabs-nav-bar .tab-health-btn:not(.active){display:none!important}
      .tourism-module-nav-tabs{display:flex!important;align-items:center!important;gap:10px!important;background:#fff!important;padding:10px 14px!important;border-radius:14px!important;border:1px solid #e2e8f0!important;box-shadow:0 1px 3px rgba(0,0,0,.02)!important;flex-wrap:wrap!important;margin-bottom:14px!important;width:100%!important;box-sizing:border-box!important}
      .module-tab-btn{display:inline-flex!important;align-items:center!important;gap:8px!important;padding:8px 16px!important;border-radius:9px!important;font-size:13px!important;font-weight:700!important;color:#374151!important;text-decoration:none!important;background:#f8fafc!important;border:1px solid #e2e8f0!important;transition:all .15s ease!important}
      .module-tab-btn svg{width:16px!important;height:16px!important;stroke:currentColor!important;stroke-width:2!important;display:inline-block!important;flex-shrink:0!important}
      .module-tab-btn:hover{background:#ecfdf5!important;color:#065f46!important;border-color:#a7f3d0!important;text-decoration:none!important}
      .module-tab-btn.active{background:#064e3b!important;color:#fff!important;border-color:#064e3b!important;box-shadow:0 2px 6px rgba(6,78,59,.25)!important;text-decoration:none!important}
      .module-tab-btn.active svg{stroke:#fff!important}
      .page-title, h1.page-title{font-size:22px!important;font-weight:800!important;color:#111827!important;letter-spacing:-0.4px!important;line-height:1.2!important}
      .page-sub, p.page-sub{font-size:13px!important;color:#64748b!important;margin-top:2px!important;line-height:1.4!important}

      /* === NÚT TOGGLE THU GỌN VÀ OVERLAY CHO ADMIN & HDV & NHÂN VIÊN === */
      .admin-sidebar-toggle-btn,#adminSidebarToggleBtn{display:none!important}

      .admin-sidebar-close-btn{display:none;position:absolute!important;top:14px!important;right:12px!important;width:32px!important;height:32px!important;border-radius:8px!important;border:1px solid rgba(255,255,255,.2)!important;background:rgba(0,0,0,.25)!important;color:#fff!important;font-size:20px!important;line-height:1!important;cursor:pointer!important;align-items:center!important;justify-content:center!important;transition:all .2s ease!important;z-index:100!important}
      .admin-sidebar-close-btn:hover{background:rgba(239,68,68,.75)!important;border-color:#ef4444!important;color:#fff!important}

      .admin-sidebar-backdrop{display:none;position:fixed!important;inset:0!important;background:rgba(4,30,20,.55)!important;backdrop-filter:blur(4px)!important;-webkit-backdrop-filter:blur(4px)!important;z-index:1995!important;opacity:0;transition:opacity .25s ease!important;pointer-events:none}
      body.sidebar-open .admin-sidebar-backdrop{display:block!important;opacity:1!important;pointer-events:auto!important}

      .mobile-partner-top-bar{display:none;align-items:center;gap:12px;background:#fff;border-bottom:1px solid #e2e8f0;padding:10px 16px;position:sticky;top:0;z-index:100;box-shadow:0 1px 4px rgba(0,0,0,.04)}
      .mobile-partner-title{font-size:15px;font-weight:800;color:#04543f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

      /* Desktop Thu gọn sidebar khi ấn toggle */
      @media (min-width: 1025px) {
        body.sidebar-collapsed aside.sidebar,body.sidebar-collapsed .sidebar{width:72px!important;min-width:72px!important;max-width:72px!important;transition:width .25s cubic-bezier(0.4, 0, 0.2, 1)!important}
        body.sidebar-collapsed aside.sidebar>a:first-child,body.sidebar-collapsed .sidebar>a:first-child,body.sidebar-collapsed .sidebar .sidebar-logo{padding:14px 6px!important;justify-content:center!important}
        body.sidebar-collapsed aside.sidebar>a:first-child>div:last-child,body.sidebar-collapsed .sidebar-logo-text,body.sidebar-collapsed .brand-title-box,body.sidebar-collapsed .sidebar-sub-container,body.sidebar-collapsed .sidebar-arrow-icon,body.sidebar-collapsed .health-arrow,body.sidebar-collapsed .sidebar-eco-badge,body.sidebar-collapsed .badge-count,body.sidebar-collapsed #adminLogoutButton span,body.sidebar-collapsed .nav-logout-item span{display:none!important}
        body.sidebar-collapsed aside.sidebar .sidebar-item-link,body.sidebar-collapsed .sidebar .sidebar-item-link,body.sidebar-collapsed .sidebar .nav-item{justify-content:center!important;padding:11px 0!important;font-size:0!important}
        body.sidebar-collapsed aside.sidebar .sidebar-icon-svg,body.sidebar-collapsed aside.sidebar .sidebar-item-left svg,body.sidebar-collapsed .sidebar .nav-item svg{margin:0!important}
        body.sidebar-collapsed .main-wrapper,body.sidebar-collapsed .main,body.sidebar-collapsed .main-content{margin-left:72px!important;transition:margin-left .25s cubic-bezier(0.4, 0, 0.2, 1)!important}
      }

      /* Tablet & Mobile Offcanvas Drawer (< 1025px) - Thu gọn thông tin */
      @media (max-width: 1024px) {
        .admin-sidebar-close-btn{display:flex!important}
        .mobile-partner-top-bar{display:flex!important}
        aside.sidebar,.sidebar{position:fixed!important;top:0!important;bottom:0!important;left:0!important;width:min(290px,84vw)!important;min-width:0!important;max-width:84vw!important;height:100vh!important;height:100dvh!important;z-index:2000!important;transform:translateX(-100%)!important;transition:transform .3s cubic-bezier(0.4, 0, 0.2, 1)!important;box-shadow:none!important;overflow-y:auto!important}
        body.sidebar-open aside.sidebar,body.sidebar-open .sidebar,aside.sidebar.open,.sidebar.open{transform:translateX(0)!important;box-shadow:0 10px 40px rgba(0,0,0,.45)!important}
        .main-wrapper,.main,.main-content,.admin-main{margin-left:0!important;width:100%!important;max-width:100vw!important;min-width:0!important;box-sizing:border-box!important}
        html,body{max-width:100vw!important;overflow-x:hidden!important}
        .top-navbar,.top-header,.top{height:auto!important;min-height:60px!important;padding:10px 16px!important;gap:10px!important;flex-wrap:wrap!important}
        .header-left,.top-header-left{display:flex!important;flex-direction:row!important;align-items:center!important;gap:10px!important;min-width:0!important;flex:1 1 auto!important}
        .page-title,h1.page-title,.top-header-title{font-size:clamp(16px,3.2vw,20px)!important;line-height:1.25!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;max-width:100%!important}
        .page-sub,p.page-sub{display:none!important}
        .content-container,.content-body,.content{padding:16px!important;gap:16px!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important}
        .stats-grid-8{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}
        .stats-grid-4,.stats,.admin-stats-row{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}
        .charts-grid-3,.sched-grid-layout,.report-grid,.admin-grid-layout,.bottom-sections-grid,.grid-2-col{grid-template-columns:1fr!important;gap:16px!important}
        .charts-grid-3 .chart-box-card:last-child{grid-column:auto!important}
        .sched-hero-banner,.cust-hero-banner{padding:16px 18px!important;border-radius:16px!important}
        .hero-main-row{flex-direction:column!important;align-items:flex-start!important;gap:12px!important}
        .hero-title-text{font-size:1.35rem!important}
        .hero-pills-row,.schedule-filter-pills-row,.cust-filter-bar-hero{gap:8px!important;flex-wrap:wrap!important}
        .toolbar,.filter-row,.search-filter-box{flex-wrap:wrap!important;gap:10px!important}
      }

      /* Màn hình điện thoại nhỏ (<= 640px) */
      @media (max-width: 640px) {
        .top-navbar,.top-header,.top{padding:8px 12px!important}
        .header-right,.top-header-right{gap:8px!important}
        .date-filter-pill-btn{padding:6px 10px!important;font-size:11px!important}
        .date-filter-pill-btn svg{display:none!important}
        .user-info,.user-header-name,.hero-user-name{display:none!important}
        .stats-grid-8{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}
        .stats-grid-4,.stats,.admin-stats-row{grid-template-columns:1fr!important;gap:10px!important}
        .stat-card-health{padding:12px 10px!important}
        .stat-card-health .stat-big-number{font-size:24px!important}
        .stat-card-health .stat-card-title{font-size:11.5px!important}
        .stat-card-health .stat-breakdown-list li{grid-template-columns:1fr auto!important;column-gap:8px!important;font-size:11px!important}
        .content-container,.content-body,.content{padding:12px 10px!important;gap:12px!important}
        .tour-item-row{flex-direction:column!important;align-items:flex-start!important;gap:10px!important;padding:12px!important}
        .tour-row-thumb{width:100%!important;height:120px!important;border-radius:10px!important}
        .tour-row-status-col{margin:0!important;flex-direction:row!important;justify-content:space-between!important;width:100%!important}
        .btn-view-detail-mint{width:100%!important;justify-content:center!important}
        .schedule-card-normal{flex-direction:column!important;align-items:flex-start!important;padding:14px!important;gap:14px!important}
        .card-normal-thumb{width:100%!important;height:130px!important}
        .card-banner-flush-right{display:none!important}
        .form-group-row{grid-template-columns:1fr!important;gap:10px!important}
      }

      /* Tự động cuộn mượt cho các bảng dữ liệu */
      .table-responsive-auto-wrap{width:100%!important;max-width:100%!important;overflow-x:auto!important;-webkit-overflow-scrolling:touch!important;margin-bottom:16px!important;border-radius:12px!important}
      .table-responsive-auto-wrap::-webkit-scrollbar{height:6px!important}
      .table-responsive-auto-wrap::-webkit-scrollbar-thumb{background:#34d399!important;border-radius:4px!important}
    `;
    document.head.appendChild(style);
  }

  function initializeResponsiveSidebarToggle() {
    const sidebar = document.querySelector('aside.sidebar, .sidebar');
    if (!sidebar) return;

    let backdrop = document.getElementById('adminSidebarBackdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'adminSidebarBackdrop';
      backdrop.className = 'admin-sidebar-backdrop';
      document.body.appendChild(backdrop);
    }

    if (!sidebar.querySelector('.admin-sidebar-close-btn')) {
      const closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'admin-sidebar-close-btn';
      closeBtn.setAttribute('aria-label', 'Đóng menu');
      closeBtn.title = 'Đóng menu';
      closeBtn.innerHTML = '&times;';
      sidebar.prepend(closeBtn);
      closeBtn.addEventListener('click', () => closeSidebar());
    }

    function toggleSidebar() {
      if (window.innerWidth <= 1024) {
        const isOpen = document.body.classList.toggle('sidebar-open');
        sidebar.classList.toggle('open', isOpen);
      } else {
        document.body.classList.toggle('sidebar-collapsed');
      }
    }

    function closeSidebar() {
      document.body.classList.remove('sidebar-open');
      sidebar.classList.remove('open');
    }

    backdrop.addEventListener('click', closeSidebar);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSidebar();
    });

    sidebar.querySelectorAll('a, button:not(.admin-sidebar-close-btn)').forEach(el => {
      el.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          closeSidebar();
        }
      });
    });

    function createToggleBtn() {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'admin-sidebar-toggle-btn';
      btn.id = 'adminSidebarToggleBtn';
      btn.setAttribute('aria-label', 'Mở / Thu gọn menu');
      btn.title = 'Mở / Thu gọn menu';
      btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      `;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSidebar();
      });
      return btn;
    }

    let navHeader = document.querySelector('.top-navbar, .top-header, .top, .header');
    if (!navHeader && !document.getElementById('mobilePartnerTopBar')) {
      const mainWrapper = document.querySelector('.main-wrapper, .main, .main-content');
      if (mainWrapper) {
        const mobileBar = document.createElement('div');
        mobileBar.id = 'mobilePartnerTopBar';
        mobileBar.className = 'mobile-partner-top-bar';
        const toggleBtn = createToggleBtn();
        const titleEl = document.createElement('div');
        titleEl.className = 'mobile-partner-title';
        titleEl.textContent = 'HỆ THỐNG ĐIỀU HÀNH BẾN TRE';
        mobileBar.appendChild(toggleBtn);
        mobileBar.appendChild(titleEl);
        mainWrapper.insertBefore(mobileBar, mainWrapper.firstChild);
      }
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) {
        closeSidebar();
      }
    });
  }

  function ensureResponsiveTables() {
    document.querySelectorAll('table').forEach(table => {
      if (table.closest('.table-responsive, .table-wrap, .table-container, .overflow-x-auto, .table-responsive-auto-wrap')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'table-responsive-auto-wrap';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }

  function initializeMonochromeIcons() {
    if (!document.getElementById('ben-tre-monochrome-icon-style')) {
      const style = document.createElement('style');
      style.id = 'ben-tre-monochrome-icon-style';
      style.textContent = `.ui-emoji-icon{display:inline-block;min-width:1em;margin:0 .08em;color:#0e4b25;
        font-family:"Segoe UI Symbol","Noto Sans Symbols 2",sans-serif!important;font-style:normal;
        font-variant-emoji:text;filter:grayscale(1);vertical-align:-.08em;text-align:center}`;
      document.head.appendChild(style);
    }
    const emojiPattern = /\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?)*/gu;
    const ignoredParents = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'OPTION', 'CODE', 'PRE']);
    const normalizeNode = root => {
      if (!root || root.nodeType !== Node.ELEMENT_NODE || root.closest?.('.ui-emoji-icon')) return;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.nodeValue || ignoredParents.has(node.parentElement?.tagName)
          || node.parentElement?.closest('.ui-emoji-icon')) continue;
        emojiPattern.lastIndex = 0;
        if (emojiPattern.test(node.nodeValue)) textNodes.push(node);
      }
      textNodes.forEach(node => {
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        emojiPattern.lastIndex = 0;
        for (const match of node.nodeValue.matchAll(emojiPattern)) {
          if (match.index > lastIndex) fragment.append(node.nodeValue.slice(lastIndex, match.index));
          const icon = document.createElement('span');
          icon.className = 'ui-emoji-icon';
          icon.setAttribute('aria-hidden', 'true');
          icon.textContent = match[0].replace(/\uFE0F/g, '') + '\uFE0E';
          fragment.append(icon);
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < node.nodeValue.length) fragment.append(node.nodeValue.slice(lastIndex));
        node.replaceWith(fragment);
      });
    };
    normalizeNode(document.body);
    const observer = new MutationObserver(records => {
      records.forEach(record => record.addedNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.parentElement) normalizeNode(node.parentElement);
        else if (node.nodeType === Node.ELEMENT_NODE) normalizeNode(node);
      }));
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function adminNotificationStorageKey() {
    let user = {};
    try { user = JSON.parse(localStorage.getItem('currentUser') || '{}'); } catch (_) {}
    const accountId = user.id || user.username || user.email || 'admin';
    return `benTreAdminReadBookingNotifications:${accountId}`;
  }

  function localBookingNotificationIds() {
    let bookings = [];
    try { bookings = JSON.parse(localStorage.getItem('benTreCustomerBookings') || '[]'); } catch (_) {}
    if (!Array.isArray(bookings)) return [];
    return bookings.map(item => String(item?.bookingCode || item?.id || '').trim())
      .filter(Boolean).map(code => `customer-booking-${code}`);
  }

  function getAdminReadBookingIds() {
    try {
      const ids = JSON.parse(localStorage.getItem(adminNotificationStorageKey()) || '[]');
      return Array.isArray(ids) ? ids.map(String) : [];
    } catch (_) { return []; }
  }

  function saveAdminReadBookingIds(ids) {
    const uniqueIds = [...new Set(ids.map(String))].slice(-1000);
    try { localStorage.setItem(adminNotificationStorageKey(), JSON.stringify(uniqueIds)); }
    catch (error) { console.warn('Không thể lưu trạng thái thông báo Admin:', error.message); }
  }

  function updateAdminNotificationBadge(unread) {
    document.querySelectorAll('.notif-bell .notif-badge, .notif-badge').forEach(badge => {
      badge.textContent = String(unread);
      badge.style.display = unread > 0 ? 'inline-flex' : 'none';
    });
    document.querySelectorAll('.notif-bell').forEach(bell => {
      bell.setAttribute('aria-label', unread > 0 ? `${unread} thông báo chưa đọc` : 'Không có thông báo chưa đọc');
      bell.title = unread > 0 ? `${unread} thông báo chưa đọc` : 'Không có thông báo mới';
    });
  }

  async function refreshAdminNotificationBadge() {
    if (getRequiredWorkspaceRole() !== 'ADMIN') return;
    const localIds = localBookingNotificationIds();
    const readIds = new Set(getAdminReadBookingIds());
    let unread = localIds.filter(id => !readIds.has(id)).length;
    if (localStorage.getItem('token')) {
      try {
        const response = await window.BenTreAPI.notifications(true);
        unread += Array.isArray(response?.data) ? response.data.length : 0;
      } catch (error) {
        console.warn('Không thể tải số thông báo Admin:', error.message);
      }
    }
    updateAdminNotificationBadge(unread);
  }

  async function markAdminNotificationsRead() {
    const localIds = localBookingNotificationIds();
    saveAdminReadBookingIds([...getAdminReadBookingIds(), ...localIds]);
    if (localStorage.getItem('token')) {
      try { await window.BenTreAPI.markAllNotificationsRead(); }
      catch (error) { console.warn('Không thể lưu trạng thái đã đọc lên máy chủ:', error.message); }
    }
    updateAdminNotificationBadge(0);
  }

  function notificationTime(value) {
    if (!value) return '';
    const date = new Date(String(value).replace(' ', 'T'));
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleString('vi-VN');
  }

  function localAdminNotifications() {
    let bookings = [];
    try { bookings = JSON.parse(localStorage.getItem('benTreCustomerBookings') || '[]'); } catch (_) {}
    if (!Array.isArray(bookings)) return [];
    return bookings.map(item => ({
      id: `customer-booking-${item.bookingCode || item.id}`,
      title: 'Khách vừa đặt tour mới',
      message: `${item.contactName || item.ownerName || 'Khách hàng'} đã đặt tour “${item.tourName || 'Tour Bến Tre'}” — ${Number(item.guests) || 1} khách${item.departureDate ? `, ngày đi ${item.departureDate}` : ''}.`,
      created_at: item.createdAt,
      action_url: '/admin/dat-tour.html'
    }));
  }

  function ensureAdminNotificationPanel() {
    let panel = document.getElementById('adminNotificationPanel');
    if (panel) return panel;
    panel = document.createElement('section');
    panel.id = 'adminNotificationPanel';
    panel.setAttribute('aria-label', 'Danh sách thông báo');
    panel.style.cssText = 'display:none;position:fixed;z-index:2000000;top:68px;right:24px;width:min(410px,calc(100vw - 28px));max-height:70vh;overflow:hidden;background:#fff;border:1px solid #e5e7eb;border-radius:14px;box-shadow:0 18px 45px rgba(15,23,42,.2);';
    panel.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;padding:15px 17px;border-bottom:1px solid #eef2f7;"><strong style="font-size:15px;color:#111827;">Thông báo</strong><button type="button" data-close-notifications aria-label="Đóng" style="border:0;background:transparent;font-size:20px;color:#6b7280;cursor:pointer;">×</button></div><div data-notification-list style="max-height:calc(70vh - 54px);overflow-y:auto;"></div>';
    document.body.appendChild(panel);
    panel.querySelector('[data-close-notifications]').addEventListener('click', () => { panel.style.display = 'none'; });
    return panel;
  }

  function renderAdminNotificationPanel(panel, notifications, errorMessage = '') {
    const list = panel.querySelector('[data-notification-list]');
    list.replaceChildren();
    if (errorMessage) {
      const error = document.createElement('div');
      error.style.cssText = 'padding:24px;text-align:center;color:#b91c1c;font-size:13px;';
      error.textContent = errorMessage;
      list.appendChild(error);
      return;
    }
    if (!notifications.length) {
      const empty = document.createElement('div');
      empty.style.cssText = 'padding:32px 20px;text-align:center;color:#6b7280;font-size:13px;';
      empty.textContent = 'Chưa có thông báo.';
      list.appendChild(empty);
      return;
    }
    notifications.slice(0, 50).forEach(item => {
      const row = document.createElement(item.action_url ? 'a' : 'article');
      if (item.action_url) row.href = item.action_url;
      row.style.cssText = 'display:block;padding:13px 17px;border-bottom:1px solid #f1f5f9;text-decoration:none;color:inherit;background:#fff;';
      const title = document.createElement('strong');
      title.style.cssText = 'display:block;color:#064e3b;font-size:13px;margin-bottom:5px;';
      title.textContent = item.title || 'Thông báo hệ thống';
      const message = document.createElement('div');
      message.style.cssText = 'color:#374151;font-size:12.5px;line-height:1.5;white-space:normal;';
      message.textContent = item.message || 'Không có nội dung.';
      const time = document.createElement('time');
      time.style.cssText = 'display:block;color:#9ca3af;font-size:11px;margin-top:6px;';
      time.textContent = notificationTime(item.created_at || item.createdAt);
      row.append(title, message, time);
      list.appendChild(row);
    });
  }

  async function toggleAdminNotificationPanel(event) {
    event?.preventDefault();
    event?.stopPropagation();
    const panel = ensureAdminNotificationPanel();
    if (panel.style.display === 'block') {
      panel.style.display = 'none';
      return;
    }
    panel.style.display = 'block';
    renderAdminNotificationPanel(panel, []);
    const list = panel.querySelector('[data-notification-list]');
    list.textContent = 'Đang tải thông báo...';
    list.style.cssText = 'max-height:calc(70vh - 54px);overflow-y:auto;padding:22px;text-align:center;color:#6b7280;font-size:13px;';
    try {
      let serverItems = [];
      if (localStorage.getItem('token')) {
        const response = await window.BenTreAPI.notifications(false);
        serverItems = Array.isArray(response?.data) ? response.data : [];
      }
      const merged = [...serverItems, ...localAdminNotifications()]
        .sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0));
      list.style.cssText = 'max-height:calc(70vh - 54px);overflow-y:auto;';
      renderAdminNotificationPanel(panel, merged);
      await markAdminNotificationsRead();
    } catch (error) {
      list.style.cssText = 'max-height:calc(70vh - 54px);overflow-y:auto;';
      const localItems = localAdminNotifications();
      renderAdminNotificationPanel(panel, localItems, localItems.length ? '' : (error.message || 'Không thể tải thông báo.'));
    }
  }

  function initializeAdminNotifications() {
    if (getRequiredWorkspaceRole() !== 'ADMIN') return;
    document.querySelectorAll('.notif-bell').forEach(bell => {
      bell.removeAttribute('onclick');
      bell.setAttribute('role', 'button');
      bell.setAttribute('tabindex', '0');
      bell.addEventListener('click', toggleAdminNotificationPanel);
      bell.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleAdminNotificationPanel(event);
        }
      });
    });
    document.addEventListener('click', event => {
      const panel = document.getElementById('adminNotificationPanel');
      if (panel && !panel.contains(event.target) && !event.target.closest('.notif-bell')) panel.style.display = 'none';
    });
    refreshAdminNotificationBadge();
  }

  const SIDEBAR_MENU_STATE_KEY = 'benTreAdminSidebarMenuState';

  function getSidebarMenuState() {
    try {
      const value = JSON.parse(sessionStorage.getItem(SIDEBAR_MENU_STATE_KEY) || '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch (_) {
      return {};
    }
  }

  function saveSidebarMenuState(submenuId, isOpen) {
    try {
      const state = getSidebarMenuState();
      state[submenuId] = Boolean(isOpen);
      sessionStorage.setItem(SIDEBAR_MENU_STATE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  function setSidebarMenuVisibility(submenu, trigger, isOpen) {
    submenu.style.setProperty('display', isOpen ? 'flex' : 'none', 'important');
    if (!trigger) return;
    trigger.setAttribute('aria-expanded', String(isOpen));
    const arrow = trigger.querySelector('.sidebar-arrow-icon, .chevron-icon, .menu-arrow-btn');
    if (arrow) arrow.textContent = isOpen ? '⌃' : '⌄';
  }

  function restoreSidebarMenuStates() {
    const state = getSidebarMenuState();
    document.querySelectorAll('.sidebar-sub-container[id]').forEach(submenu => {
      const trigger = submenu.previousElementSibling;
      const hasSavedState = Object.prototype.hasOwnProperty.call(state, submenu.id);
      const shouldOpen = hasSavedState ? state[submenu.id] === true : Boolean(submenu.querySelector('.active'));
      setSidebarMenuVisibility(submenu, trigger, shouldOpen);
    });
  }

  // Sidebar Admin: nhấn vào hàng nhóm hoặc mũi tên đều mở/thu submenu.
  // Chỉ các liên kết con mới chuyển sang trang khác.
  window.navigateOrToggleSidebar = function (event, destination, submenuId, trigger) {
    event.preventDefault();
    event.stopPropagation();
    const submenu = document.getElementById(submenuId);
    if (!submenu) return;
    const isClosed = window.getComputedStyle(submenu).display === 'none';
    setSidebarMenuVisibility(submenu, trigger, isClosed);
    saveSidebarMenuState(submenuId, isClosed);
  };

  window.toggleSidebarMenu = window.toggleSidebarMenu || function (submenuId, trigger) {
    const submenu = document.getElementById(submenuId);
    if (!submenu) return false;
    const isClosed = window.getComputedStyle(submenu).display === 'none';
    setSidebarMenuVisibility(submenu, trigger, isClosed);
    saveSidebarMenuState(submenuId, isClosed);
    return isClosed;
  };

  // Giữ nguyên vị trí cuộn sidebar khi chuyển giữa các trang quản trị.
  const SIDEBAR_SCROLL_KEY = 'benTreAdminSidebarScrollTop';

  function getSidebar() {
    return document.querySelector('.sidebar');
  }

  function saveSidebarScroll() {
    const sidebar = getSidebar();
    if (sidebar) sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(sidebar.scrollTop));
  }

  function restoreSidebarScroll() {
    const sidebar = getSidebar();
    const saved = Number(sessionStorage.getItem(SIDEBAR_SCROLL_KEY));
    if (!sidebar || !Number.isFinite(saved)) return;
    sidebar.style.scrollBehavior = 'auto';
    sidebar.scrollTop = saved;
    requestAnimationFrame(() => {
      sidebar.scrollTop = saved;
      requestAnimationFrame(() => { sidebar.scrollTop = saved; });
    });
  }

  document.addEventListener('click', (event) => {
    if (event.target.closest('.sidebar a[href], .sidebar [onclick*="location.href"], .sidebar [onclick*="navigateOrToggleSidebar"]')) {
      saveSidebarScroll();
    }
  }, true);
  window.addEventListener('pagehide', saveSidebarScroll);

  function initializeSmoothNavigation() {
    // Để trình duyệt chuyển trang tự nhiên 100% chuẩn định dạng và CSS
    return;
  }

  function cleanupLegacySpaFrames() {
    document.querySelectorAll('#adminSpaFrame, #adminSmoothNavigationStyle').forEach(el => el.remove());
  }

  function ensureTourismNavTabs() {
    // Tránh tự động chèn thêm hàng tab điều hướng bị trùng lặp ở trên
    document.querySelectorAll('.tourism-module-nav-tabs').forEach(el => el.remove());
  }

  function normalizeTourismSidebar() {
    // Giữ nguyên menu con dropdown đầy đủ trong sidebar
  }

  // ==========================================
  // KIỂM TRA & ĐỊNH DẠNG GIÁ TIỀN VÀ SỐ LƯỢNG (>= 0, MẶC ĐỊNH '000 VNĐ')
  // ==========================================
  const NEGATIVE_WARNING_MSG = '⚠️ Cảnh báo: Giá tiền và số lượng không được là số âm! Mọi giá trị phải lớn hơn hoặc bằng 0 (>= 0).';

  function showNegativeValueWarning(customMsg) {
    const msg = customMsg || NEGATIVE_WARNING_MSG;
    let banner = document.getElementById('benTreNegativeWarningToast');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'benTreNegativeWarningToast';
      banner.style.cssText = [
        'position:fixed',
        'top:24px',
        'left:50%',
        'transform:translateX(-50%) translateY(-24px)',
        'background:linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
        'color:#FFFFFF',
        'padding:14px 26px',
        'border-radius:14px',
        'font-size:14.5px',
        'font-weight:700',
        'box-shadow:0 14px 34px rgba(220, 38, 38, 0.45), 0 3px 8px rgba(0,0,0,0.2)',
        'z-index:99999999',
        'display:flex',
        'align-items:center',
        'gap:12px',
        'transition:all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        'opacity:0',
        'pointer-events:none',
        'max-width:min(680px, 92vw)',
        'text-align:left',
        'line-height:1.4'
      ].join(';') + ';';
      document.body.appendChild(banner);
    }
    banner.innerHTML = `<span style="font-size:22px; flex-shrink:0; line-height:1;">⚠️</span><span>${msg}</span>`;
    banner.style.opacity = '1';
    banner.style.pointerEvents = 'auto';
    banner.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(banner._timeout);
    banner._timeout = setTimeout(() => {
      banner.style.opacity = '0';
      banner.style.pointerEvents = 'none';
      banner.style.transform = 'translateX(-50%) translateY(-24px)';
    }, 4500);
  }

  window.showNegativeValueWarning = showNegativeValueWarning;

  function formatPriceWithThousandDefault(rawValue) {
    if (rawValue === null || rawValue === undefined) return 'Miễn phí vé vào cổng';
    const text = String(rawValue).trim();
    if (!text) return 'Miễn phí vé vào cổng';

    if (text.includes('-') || (Number(text) < 0)) {
      showNegativeValueWarning();
      return 'Miễn phí vé vào cổng';
    }

    if (/miễn\s*phí|mien\s*phi|free/i.test(text)) {
      return 'Miễn phí vé vào cổng';
    }

    const digits = text.replace(/[^0-9]/g, '');
    if (!digits) return text;
    let n = parseInt(digits, 10);
    if (n === 0) return 'Miễn phí vé vào cổng';

    // Nếu người dùng nhập số < 1000 (vd: 50, 650, 850) -> mặc định thêm 000 vnđ (50.000 VNĐ, 650.000 VNĐ)
    if (n < 1000) {
      n = n * 1000;
    }

    return n.toLocaleString('vi-VN') + ' VNĐ';
  }

  window.formatPriceWithThousandDefault = formatPriceWithThousandDefault;

  function isPriceField(input) {
    if (!input || input.type === 'hidden' || input.type === 'submit' || input.type === 'button') return false;
    const id = (input.id || '').toLowerCase();
    const name = (input.name || '').toLowerCase();
    const placeholder = (input.placeholder || '').toLowerCase();
    const className = (input.className || '').toLowerCase();
    
    const formGroup = input.closest('.form-group, div');
    const labelText = formGroup ? (formGroup.querySelector('label')?.textContent || '').toLowerCase() : '';

    if (labelText.includes('đánh giá') || placeholder.includes('sao') || id.includes('rating') || id.includes('review')) {
      return false;
    }

    const priceKeywords = ['price', 'dongia', 'đơn giá', 'giá vé', 'chi phí', 'giá tour', 'mức giá', 'giá', 'tiền', 'cost', 'fee'];
    return priceKeywords.some(k => id.includes(k) || name.includes(k) || placeholder.includes(k) || className.includes(k) || labelText.includes(k));
  }

  function isQuantityField(input) {
    if (!input || input.type === 'hidden' || input.type === 'submit' || input.type === 'button') return false;
    if (input.type === 'number') return true;
    const id = (input.id || '').toLowerCase();
    const name = (input.name || '').toLowerCase();
    const placeholder = (input.placeholder || '').toLowerCase();
    const formGroup = input.closest('.form-group, div');
    const labelText = formGroup ? (formGroup.querySelector('label')?.textContent || '').toLowerCase() : '';

    const qtyKeywords = ['capacity', 'quantity', 'guests', 'seats', 'soluong', 'số lượng', 'sức chứa', 'số khách', 'số chỗ', 'eco'];
    return qtyKeywords.some(k => id.includes(k) || name.includes(k) || placeholder.includes(k) || labelText.includes(k));
  }

  function attachPriceAndQuantityValidation(root = document) {
    const inputs = root.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      if (input._bentreValidated) return;

      const isPrice = isPriceField(input);
      const isQty = !isPrice && isQuantityField(input);

      if (!isPrice && !isQty) return;
      input._bentreValidated = true;

      if (isPrice) {
        if (input.placeholder && (input.placeholder.includes('50.000đ') || input.placeholder.includes('650.000đ') || input.placeholder.includes('690.000đ') || input.placeholder.includes('450.000đ'))) {
          input.placeholder = input.placeholder.replace(/đ\b/g, ' VNĐ').replace(/50\.000đ/g, '50.000 VNĐ');
        }

        const id = (input.id || '').toLowerCase();
        const placeholder = (input.placeholder || '').toLowerCase();
        const formGroup = input.closest('.form-group, div');
        const labelText = formGroup ? (formGroup.querySelector('label')?.textContent || '').toLowerCase() : '';
        const isTicketField = id.includes('placeprice') || labelText.includes('giá vé') || placeholder.includes('giá vé');
        if (isTicketField && (!input.value || input.value === '0' || /^(0\s*(vnđ|vnd|đ)?|miễn phí.*)$/i.test(input.value.trim()))) {
          input.value = 'Miễn phí vé vào cổng';
        }

        input.addEventListener('keydown', (e) => {
          if (e.key === '-' || e.key === 'Subtract') {
            e.preventDefault();
            showNegativeValueWarning();
          }
        });

        input.addEventListener('input', () => {
          if (input.value.includes('-')) {
            input.value = input.value.replace(/-/g, '');
            showNegativeValueWarning();
          }
        });

        input.addEventListener('blur', () => {
          const val = input.value.trim();
          if (!val) {
            input.value = 'Miễn phí vé vào cổng';
            return;
          }
          if (val.includes('-')) {
            input.value = 'Miễn phí vé vào cổng';
            showNegativeValueWarning();
          } else {
            input.value = formatPriceWithThousandDefault(val);
          }
        });
      } else if (isQty) {
        input.setAttribute('min', '0');

        input.addEventListener('keydown', (e) => {
          if (e.key === '-' || e.key === 'Subtract') {
            e.preventDefault();
            showNegativeValueWarning();
          }
        });

        input.addEventListener('input', () => {
          if (input.value.includes('-') || (Number(input.value) < 0)) {
            input.value = Math.max(0, Math.abs(parseFloat(input.value) || 0));
            showNegativeValueWarning();
          }
        });

        input.addEventListener('blur', () => {
          if (Number(input.value) < 0 || input.value.includes('-')) {
            input.value = '0';
            showNegativeValueWarning();
          }
        });
      }
    });
  }

  window.attachPriceAndQuantityValidation = attachPriceAndQuantityValidation;

  async function initializeSharedAdminUI() {
    // Hide notif-bell and user-profile across all admin pages (including admin-ben-tre)
    if (/\/(admin|admin-ben-tre)\//i.test(window.location.pathname)) {
      const adminHeaderHideStyle = document.createElement('style');
      adminHeaderHideStyle.textContent = `
        .notif-bell, .user-profile, header .user-profile, .top-navbar .user-profile, .top .admin, .topbar .user-profile, .topbar .notif-bell,
        .sidebar-user-box, .sidebar-eco-card {
          display: none !important;
        }
      `;
      document.head.appendChild(adminHeaderHideStyle);
    }

    applyWebsiteName();
    applySharedAdminSidebarTheme();
    initializeResponsiveSidebarToggle();
    ensureResponsiveTables();
    normalizeTourismSidebar();
    attachPriceAndQuantityValidation();

    if (document.body && !window._adminTableObserverSet) {
      window._adminTableObserverSet = true;
      let tableDebounce = null;
      const tableObserver = new MutationObserver(() => {
        if (tableDebounce) clearTimeout(tableDebounce);
        tableDebounce = setTimeout(() => {
          ensureResponsiveTables();
          attachPriceAndQuantityValidation();
        }, 250);
      });
      tableObserver.observe(document.body, { childList: true, subtree: true });
    }

    if (!(await enforceWorkspaceAccess())) return;
    document.querySelectorAll('aside.sidebar img[alt="Bến Tre Sông Nước"], aside.sidebar .sidebar-banner-img').forEach(image => {
      const banner = image.closest('.sidebar-bottom-banner') || image.parentElement;
      if (banner && banner !== document.querySelector('aside.sidebar')) banner.remove();
      else image.remove();
    });
    restoreSidebarScroll();
    restoreSidebarMenuStates();
    addAdminLogoutButton();
    initializeAdminNotifications();
    initializeMonochromeIcons();
    ensureTourismNavTabs();
    initializeSmoothNavigation();
  }

  window.addEventListener('storage', event => {
    if (event.key === 'benTreCustomerBookings' || event.key === adminNotificationStorageKey()) {
      refreshAdminNotificationBadge();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSharedAdminUI);
  } else {
    initializeSharedAdminUI();
  }
})();
