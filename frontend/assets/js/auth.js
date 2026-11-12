/**
 * AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC) MOCKUP
 * Phân quyền chạy thử mẫu cho Admin & Hướng dẫn viên (không cần database)
 */

// Global Helper Functions available immediately across all pages
function globalOpenBookingModal(tourName) {
    const title = tourName || 'Một ngày xanh – Khám phá Bến Tre';
    if (typeof showCustomNotifyModal === 'function') {
        showCustomNotifyModal(`🎫 Đã chọn tour: "${title}". Đang chuyển hướng tới trang Đặt Tour!`, 'Đặt Tour Bến Tre', '🎫');
        setTimeout(() => {
            if (typeof window !== 'undefined') window.location.href = '../khach-hang/du-lich.html';
        }, 1100);
    } else {
        if (typeof window !== 'undefined') window.location.href = '../khach-hang/du-lich.html';
    }
}

function handleTourScheduleSelect(el) {
    if (!el) return;
    const tourName = el.value || el.innerText || 'Tour Bến Tre';
    if (typeof showCustomNotifyModal === 'function') {
        showCustomNotifyModal(`📋 Đã chuyển lịch trình hiển thị sang: ${tourName}`, 'Lịch trình HDV', '📋');
    }
}

if (typeof window !== 'undefined') {
    window.globalOpenBookingModal = globalOpenBookingModal;
    window.handleTourScheduleSelect = handleTourScheduleSelect;
}

// Initial Mock Accounts
const MOCK_USERS = {
    'admin': {
        username: 'admin',
        password: '123',
        role: 'admin',
        roles: ['ADMIN'],
        name: 'Quản trị viên Bến Tre',
        roleTitle: 'Quản trị viên Hệ thống Command Center',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop'
    },
    'hdv': {
        username: 'hdv',
        password: '123',
        role: 'guide',
        roles: ['GUIDE'],
        name: 'Nguyễn Minh Anh',
        roleTitle: 'Hướng dẫn viên Bến Tre Tour Guide',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
    },
    'khach': {
        username: 'khach',
        password: '123',
        role: 'user',
        roles: ['USER'],
        name: 'Khách hàng Lê Văn Nam',
        roleTitle: 'Thành viên Thân thiết',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
    }
};

// Initial Mock Tour Assignment Data for HDV
const MOCK_GUIDE_TOURS = [
    {
        id: 'T01',
        title: 'Một ngày xanh Bến Tre',
        time: '10:00 - Bến Tre (Ngày 11 tháng 2023)',
        location: 'Tour toàn: Bến Tre',
        guestCount: 8,
        status: 'Đang dẫn đoàn',
        guests: [
            { name: 'Khách hàng 8', phone: '0903 123 456', seats: 2, checkedIn: true, note: 'Đã điểm danh' },
            { name: 'Khách hàng 4', phone: '0918 987 654', seats: 2, checkedIn: true, note: 'Đã điểm danh' },
            { name: 'Bên nhóm 2', phone: '0982 111 222', seats: 2, checkedIn: true, note: 'Đã điểm danh' },
            { name: 'Khách hàng 3', phone: '0973 333 444', seats: 2, checkedIn: true, note: 'Đã điểm danh' }
        ]
    }
];

/* ===== UNIVERSAL CUSTOM NOTIFICATION & CONFIRM MODAL SYSTEM ===== */
function ensureCustomModalContainers() {
    if (typeof document === 'undefined') return;

    if (!document.getElementById('customNotifyModalStyles')) {
        const style = document.createElement('style');
        style.id = 'customNotifyModalStyles';
        style.innerHTML = `
            @keyframes notifyModalPop {
                0% { opacity: 0; transform: scale(0.85) translateY(12px); }
                100% { opacity: 1; transform: scale(1) translateY(0); }
            }
        `;
        if (document.head) document.head.appendChild(style);
    }

    if (!document.getElementById('customNotifyFormModal')) {
        const notifyDiv = document.createElement('div');
        notifyDiv.id = 'customNotifyFormModal';
        notifyDiv.className = 'modal-overlay';
        notifyDiv.style.cssText = 'display:none; position:fixed; inset:0; z-index:2000001; backdrop-filter:blur(8px); background:rgba(17,24,39,0.65); align-items:center; justify-content:center;';
        notifyDiv.onclick = function(e) { if (e.target === notifyDiv) closeCustomNotifyModal(); };
        notifyDiv.innerHTML = `
            <div class="modal-card" style="max-width: 440px; width: 90%; border-radius: 24px; padding: 28px; text-align: center; border: 1px solid rgba(255,255,255,0.25); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); animation: notifyModalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; background: #FFFFFF; font-family: 'Be Vietnam Pro', sans-serif;">
                <div id="notifyModalIconBox" style="width: 64px; height: 64px; border-radius: 50%; background: #ECFDF5; border: 2px solid #A7F3D0; color: #059669; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 16px auto; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.15);">
                    <svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 id="notifyModalTitle" style="font-size: 1.25rem; font-weight: 900; color: #111827; margin-bottom: 10px; letter-spacing: -0.3px;">
                    Thông báo hệ thống
                </h3>
                <div id="notifyModalMessage" style="font-size: 0.95rem; color: #374151; font-weight: 600; line-height: 1.55; margin-bottom: 24px; word-break: break-word;">
                    Nội dung thông báo
                </div>
                <button type="button" onclick="closeCustomNotifyModal()" style="width: 100%; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: #FFFFFF; font-size: 0.96rem; font-weight: 800; padding: 13px 20px; border-radius: 14px; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35); transition: all 0.2s ease; outline: none;">
                    Đồng ý
                </button>
            </div>
        `;
        if (document.body) document.body.appendChild(notifyDiv);
    }

    if (!document.getElementById('customConfirmFormModal')) {
        const confirmDiv = document.createElement('div');
        confirmDiv.id = 'customConfirmFormModal';
        confirmDiv.className = 'modal-overlay';
        confirmDiv.style.cssText = 'display:none; position:fixed; inset:0; z-index:2000001; backdrop-filter:blur(8px); background:rgba(17,24,39,0.65); align-items:center; justify-content:center;';
        confirmDiv.onclick = function(e) { if (e.target === confirmDiv) closeCustomConfirmModal(false); };
        confirmDiv.innerHTML = `
            <div class="modal-card" style="max-width: 450px; width: 90%; border-radius: 24px; padding: 28px; text-align: center; border: 1px solid rgba(255,255,255,0.25); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); animation: notifyModalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; background: #FFFFFF; font-family: 'Be Vietnam Pro', sans-serif;">
                <div id="confirmModalIconBox" style="width: 64px; height: 64px; border-radius: 50%; background: #FEF2F2; border: 2px solid #FECACA; color: #DC2626; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 16px auto; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);">
                    <svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </div>
                <h3 id="confirmModalTitle" style="font-size: 1.25rem; font-weight: 900; color: #111827; margin-bottom: 10px; letter-spacing: -0.3px;">
                    Xác nhận thao tác
                </h3>
                <div id="confirmModalMessage" style="font-size: 0.95rem; color: #374151; font-weight: 600; line-height: 1.55; margin-bottom: 24px; word-break: break-word;">
                    Bạn có chắc chắn muốn thực hiện thao tác này?
                </div>
                <div style="display: flex; gap: 12px;">
                    <button type="button" onclick="closeCustomConfirmModal(false)" style="flex: 1; background: #F3F4F6; color: #374151; font-size: 0.94rem; font-weight: 700; padding: 13px 18px; border-radius: 14px; border: 1px solid #E5E7EB; cursor: pointer;">
                        Hủy bỏ
                    </button>
                    <button type="button" id="confirmModalOkBtn" onclick="closeCustomConfirmModal(true)" style="flex: 1; background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); color: #FFFFFF; font-size: 0.94rem; font-weight: 800; padding: 13px 18px; border-radius: 14px; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(220, 38, 38, 0.35);">
                        Xác nhận
                    </button>
                </div>
            </div>
        `;
        if (document.body) document.body.appendChild(confirmDiv);
    }
}

function showCustomNotifyModal(msg, title = "Thông báo hệ thống", icon = "🔔") {
    if (typeof document === 'undefined') return;
    ensureCustomModalContainers();
    const modal = document.getElementById('customNotifyFormModal');
    const msgEl = document.getElementById('notifyModalMessage');
    const titleEl = document.getElementById('notifyModalTitle');
    const iconEl = document.getElementById('notifyModalIconBox');
    if (!modal) return;

    const combinedText = `${title || ''} ${msg || ''}`;
    const isLogout = /đăng xuất/i.test(combinedText);
    let iconType = isLogout ? 'logout' : 'info';
    if (msg && typeof msg === 'string') {
        if (msg.includes('🎉') || msg.includes('✅') || msg.includes('thành công')) {
            iconType = isLogout ? 'logout' : 'success';
            if (iconEl) { iconEl.style.background = '#ECFDF5'; iconEl.style.borderColor = '#A7F3D0'; iconEl.style.color = '#059669'; }
        } else if (msg.includes('📞')) {
            iconType = 'phone';
            if (iconEl) { iconEl.style.background = '#EFF6FF'; iconEl.style.borderColor = '#BFDBFE'; iconEl.style.color = '#2563EB'; }
        } else if (msg.includes('💬')) {
            iconType = 'message';
            if (iconEl) { iconEl.style.background = '#F5F3FF'; iconEl.style.borderColor = '#DDD6FE'; iconEl.style.color = '#7C3AED'; }
        } else if (msg.includes('🔒')) {
            iconType = isLogout ? 'logout' : 'lock';
            if (iconEl) { iconEl.style.background = '#FEF2F2'; iconEl.style.borderColor = '#FECACA'; iconEl.style.color = '#DC2626'; }
        }
    }

    const svgIcons = {
        success: '<svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        logout: '<svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
        phone: '<svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z"/></svg>',
        message: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>',
        lock: '<svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
        info: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };
    if (iconEl) iconEl.innerHTML = svgIcons[iconType] || svgIcons.info;
    if (titleEl) titleEl.innerText = String(title || '').replace(/[🎉✅🔒📞💬👋]/gu, '').trim();
    if (msgEl) msgEl.innerHTML = String(msg || '').replace(/[🎉✅🔒📞💬👋]/gu, '').trim();

    modal.style.setProperty('z-index', '2000001', 'important');
    modal.style.setProperty('display', 'flex', 'important');
}

function closeCustomNotifyModal() {
    if (typeof document === 'undefined') return;
    const modal = document.getElementById('customNotifyFormModal');
    if (modal) modal.style.display = 'none';
}

let customConfirmCallbackGlobal = null;
function showCustomConfirmModal(msg, callback, title = "Xác nhận thao tác", btnText = "Xác nhận", icon = "⚠️") {
    if (typeof document === 'undefined') return;
    ensureCustomModalContainers();
    const modal = document.getElementById('customConfirmFormModal');
    const msgEl = document.getElementById('confirmModalMessage');
    const titleEl = document.getElementById('confirmModalTitle');
    const iconEl = document.getElementById('confirmModalIconBox');
    const okBtn = document.getElementById('confirmModalOkBtn');
    if (!modal) return;

    customConfirmCallbackGlobal = callback;

    if (iconEl) {
        const isLogout = /đăng xuất/i.test(`${title} ${btnText} ${msg}`) || icon === '🚪';
        iconEl.innerHTML = isLogout
            ? '<svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>'
            : '<svg width="29" height="29" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 2.9 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0z"/></svg>';
    }
    if (titleEl) titleEl.innerText = title;
    if (msgEl) msgEl.innerHTML = msg || '';
    if (okBtn) okBtn.innerText = btnText;

    modal.style.setProperty('z-index', '2000001', 'important');
    modal.style.setProperty('display', 'flex', 'important');
}

function closeCustomConfirmModal(isConfirmed = false) {
    if (typeof document === 'undefined') return;
    const modal = document.getElementById('customConfirmFormModal');
    if (modal) modal.style.display = 'none';
    if (typeof customConfirmCallbackGlobal === 'function') {
        const cb = customConfirmCallbackGlobal;
        customConfirmCallbackGlobal = null;
        cb(isConfirmed);
    }
}

// Global window overrides
if (typeof window !== 'undefined') {
    window.alert = function(message) {
        showCustomNotifyModal(message);
    };
}

// Current User Helpers
function getCurrentUser() {
    if (typeof localStorage === 'undefined') return null;
    try {
        const data = localStorage.getItem('currentUser');
        if (!data) return null;
        const user = JSON.parse(data);
        const roles = Array.isArray(user.roles) ? user.roles : [];
        const primaryRole = roles.includes('ADMIN') ? 'admin' : (roles.includes('GUIDE') ? 'guide' : 'user');
        return {
            ...user,
            role: user.role || primaryRole,
            name: user.name || user.fullName || user.username || 'Khách hàng',
            roleTitle: user.roleTitle || (primaryRole === 'admin' ? 'Quản trị viên' : (primaryRole === 'guide' ? 'Hướng dẫn viên' : 'Khách du lịch')),
            avatar: user.avatar || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Ccircle cx="32" cy="32" r="32" fill="%23dcfce7"/%3E%3Ccircle cx="32" cy="24" r="11" fill="%23059669"/%3E%3Cpath d="M12 58c2-14 10-21 20-21s18 7 20 21" fill="%23059669"/%3E%3C/svg%3E'
        };
    } catch (e) {
        console.error('Error parsing currentUser from localStorage:', e);
        return null;
    }
}

function setCurrentUser(user) {
    if (typeof localStorage === 'undefined') return;
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('currentUser');
    }
}

function loginAs(username) {
    const user = MOCK_USERS[username];
    if (user) {
        const fullUser = {
            ...user,
            roles: user.roles || (user.role === 'admin' ? ['ADMIN'] : (user.role === 'guide' ? ['GUIDE'] : ['USER']))
        };
        setCurrentUser(fullUser);
        try { localStorage.setItem('token', 'mock-token-' + Date.now()); } catch(e){}
        showCustomNotifyModal(
            `Đăng nhập thành công với vai trò:<br><strong>${fullUser.name}</strong><br><span style="font-size:0.85rem; color:#6B7280;">(${fullUser.roleTitle})</span>`,
            'Đăng nhập thành công 🎉',
            '🎉'
        );
        setTimeout(() => {
            if (typeof window !== 'undefined') {
                if (fullUser.role === 'guide') {
                    window.location.href = '../partner/dashboard.html';
                } else if (fullUser.role === 'admin') {
                    window.location.href = '../admin/dashboard.html';
                } else {
                    window.location.href = '../khach-hang/index.html';
                }
            }
        }, 1100);
    }
}

/* ===== LOGOUT: TOTALLY CLEAR ALL USER SESSIONS ===== */
function logout() {
    showCustomConfirmModal(
        'Bạn có chắc chắn muốn đăng xuất tài khoản khỏi hệ thống Bến Tre?',
        function(confirmed) {
            if (confirmed) {
                if (typeof localStorage !== 'undefined') {
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('token');
                    localStorage.removeItem('guideToursData');
                }
                if (typeof sessionStorage !== 'undefined') sessionStorage.clear();
                showCustomNotifyModal('Đã đăng xuất tài khoản thành công!', 'Đã đăng xuất');
                setTimeout(() => {
                    if (typeof window !== 'undefined') window.location.href = '../khach-hang/index.html';
                }, 1100);
            }
        },
        'Xác nhận đăng xuất',
        'Đăng xuất',
        '🚪'
    );
}

// Update Header Navigation UI
function updateHeaderAuthUI() {
    if (typeof document === 'undefined') return;
    const user = getCurrentUser();
    const loginBtns = document.querySelectorAll('.btn-login');

    loginBtns.forEach(btn => {
        if (!user) {
            btn.classList.remove('user-profile-badge');
            btn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Đăng nhập</span>
            `;
            btn.setAttribute('href', '../khach-hang/dang-nhap.html');
            btn.onclick = null;
        } else {
            const roleBadgeClass = user.role === 'admin' ? 'badge-admin' : (user.role === 'guide' ? 'badge-guide' : 'badge-user');
            const roleLabel = user.role === 'admin' ? 'ADMIN' : (user.role === 'guide' ? 'HDV' : 'KHÁCH');

            btn.classList.add('user-profile-badge');
            btn.setAttribute('href', 'javascript:void(0);');
            btn.innerHTML = `
                <img src="${user.avatar}" class="header-avatar" alt="Avatar">
                <span class="user-name-text">${user.name}</span>
                <span class="role-tag ${roleBadgeClass}">${roleLabel}</span>
            `;
            
            btn.onclick = (e) => {
                e.preventDefault();
                showUserMenuDropdown(e, user);
            };
        }
    });

    // Add Special Role Links to Navigation Menu
    const nav = document.getElementById('nav');
    if (nav) {
        // Remove existing role links first
        const existingRoleLinks = nav.querySelectorAll('.nav-link-role');
        existingRoleLinks.forEach(el => el.remove());

        if (user && user.role === 'admin') {
            const adminLink = document.createElement('a');
            adminLink.className = 'nav-link nav-link-role nav-link-admin';
            adminLink.href = '../admin/dashboard.html';
            adminLink.innerHTML = `🛡️ <strong>Quản trị Admin</strong>`;
            nav.appendChild(adminLink);
        } else if (user && user.role === 'guide') {
            const guideLink = document.createElement('a');
            guideLink.className = 'nav-link nav-link-role nav-link-guide';
            guideLink.href = '../partner/dashboard.html';
            guideLink.innerHTML = `🚩 <strong>Góc Hướng Dẫn Viên</strong>`;
            nav.appendChild(guideLink);
        }
    }
}

// User Menu Dropdown
function showUserMenuDropdown(event, user) {
    if (typeof document === 'undefined') return;
    let dropdown = document.getElementById('userMenuDropdown');
    if (dropdown) {
        dropdown.remove();
        return;
    }

    dropdown = document.createElement('div');
    dropdown.id = 'userMenuDropdown';
    dropdown.className = 'user-menu-dropdown';

    let roleActionBtn = '';
    if (user.role === 'admin') {
        roleActionBtn = `<button class="dropdown-item item-primary" onclick="openAdminWorkspace(); closeUserMenu();">🛡️ Mở Bảng Quản trị Admin</button>`;
    } else if (user.role === 'guide') {
        roleActionBtn = `<button class="dropdown-item item-primary" onclick="openGuideWorkspace(); closeUserMenu();">🚩 Mở Góc Hướng Dẫn Viên</button>`;
    }

    dropdown.innerHTML = `
        <div class="dropdown-header">
            <img src="${user.avatar}" alt="Avatar">
            <div class="dropdown-user-info">
                <div class="dropdown-name">${user.name}</div>
                <div class="dropdown-sub">${user.roleTitle}</div>
            </div>
        </div>
        <div class="dropdown-divider"></div>
        ${roleActionBtn}
        <button class="dropdown-item" onclick="alert('Tính năng đổi mật khẩu đang mở rộng'); closeUserMenu();"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Đổi mật khẩu</button>
        <button class="dropdown-item" onclick="var p=window.location.pathname; window.location.href=(p.includes('/khach-hang/')?'':'khach-hang/')+'tour-da-dat.html'; closeUserMenu();"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> Xem tour đã đặt</button>
        <div class="dropdown-divider"></div>
        <button type="button" id="customerLogoutButton" class="dropdown-item item-danger"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> Đăng xuất</button>
    `;

    document.body.appendChild(dropdown);
    const logoutButton = document.getElementById('customerLogoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeUserMenu();
            logout();
        });
    }

    // Position near the profile badge button
    const target = event.currentTarget;
    if (target) {
        const rect = target.getBoundingClientRect();
        dropdown.style.position = 'fixed';
        dropdown.style.top = `${rect.bottom + 8}px`;
        dropdown.style.right = `${(typeof window !== 'undefined' ? window.innerWidth : 1200) - rect.right}px`;
    }

    setTimeout(() => {
        if (typeof document !== 'undefined') document.addEventListener('click', closeUserMenuOutside);
    }, 10);
}

function closeUserMenu() {
    if (typeof document === 'undefined') return;
    const dropdown = document.getElementById('userMenuDropdown');
    if (dropdown) dropdown.remove();
    document.removeEventListener('click', closeUserMenuOutside);
}

function closeUserMenuOutside(e) {
    if (typeof document === 'undefined') return;
    const dropdown = document.getElementById('userMenuDropdown');
    if (dropdown && !dropdown.contains(e.target) && !e.target.closest('.user-profile-badge')) {
        closeUserMenu();
    }
}

function openAdminWorkspace() {
    if (typeof window !== 'undefined') window.location.href = '../admin/dashboard.html';
}

function openGuideWorkspace() {
    if (typeof window !== 'undefined') window.location.href = '../partner/dashboard.html';
}

// Auto Initialize
if (typeof document !== 'undefined') {
    const initAuth = () => {
        updateHeaderAuthUI();
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuth);
    } else {
        initAuth();
    }
}
