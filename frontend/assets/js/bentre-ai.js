const ROBOT_AVATAR_SVG = `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Radial Gradient -->
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
      <stop offset="0%" stop-color="#E8F5E9" />
      <stop offset="100%" stop-color="#C8E6C9" />
    </radialGradient>
    
    <!-- Conical Hat Gradient -->
    <linearGradient id="hatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFDE7" />
      <stop offset="40%" stop-color="#FFF59D" />
      <stop offset="100%" stop-color="#FBC02D" />
    </linearGradient>
    
    <!-- Torso (Áo bà ba) Gradient -->
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#A1887F" />
      <stop offset="100%" stop-color="#5D4037" />
    </linearGradient>
    
    <!-- Head Gradient (3D Sphere effect) -->
    <radialGradient id="headGrad" cx="35%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="60%" stop-color="#E0F2F1" />
      <stop offset="100%" stop-color="#80CBC4" />
    </radialGradient>
    
    <!-- Screen Face Gradient -->
    <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2D3748" />
      <stop offset="100%" stop-color="#1A202C" />
    </linearGradient>
    
    <!-- Drop Shadow Filter -->
    <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="3" stdDeviation="2" flood-color="#000" flood-opacity="0.2" />
    </filter>

    <!-- Hat Shadow on Face -->
    <filter id="hatShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="1.5" flood-color="#000" flood-opacity="0.3" />
    </filter>

    <!-- Eyes Glow -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Circle with 3D Radial Depth -->
  <circle cx="50" cy="50" r="48" fill="url(#bgGrad)" stroke="#B2DFDB" stroke-width="1" />
  
  <!-- Torso (Áo bà ba) 3D Rounded -->
  <path d="M 28,78 C 28,78 30,53 34,53 L 66,53 C 70,53 72,78 72,78 Z" fill="url(#bodyGrad)" filter="url(#dropShadow)" />
  <!-- V-neck collar for áo bà ba -->
  <path d="M 45,53 L 50,63 L 55,53" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" />
  <!-- 3D Pearly Button -->
  <circle cx="50" cy="69" r="3" fill="#FFFFFF" filter="url(#dropShadow)" />
  <circle cx="49.2" cy="68.2" r="1" fill="#ECEFF1" />
  
  <!-- Neck -->
  <rect x="44" y="47" width="12" height="8" rx="3" fill="#80CBC4" filter="url(#dropShadow)" />
  
  <!-- Ears -->
  <rect x="25" y="32" width="6" height="8" rx="2" fill="#00796B" filter="url(#dropShadow)" />
  <rect x="69" y="32" width="6" height="8" rx="2" fill="#00796B" filter="url(#dropShadow)" />

  <!-- Head (Spherical 3D Chibi) -->
  <rect x="29" y="24" width="42" height="26" rx="12" fill="url(#headGrad)" filter="url(#dropShadow)" />

  <!-- Screen / Face -->
  <rect x="36" y="29.5" width="28" height="15" rx="6" fill="url(#screenGrad)" />
  <!-- Glass Reflection -->
  <path d="M 38,31.5 L 56,31.5 L 48,42.5 L 38,42.5 Z" fill="#FFFFFF" opacity="0.08" />
  
  <!-- Glowing smiling eyes -->
  <path d="M 40,36 Q 43,32.5 46,36" fill="none" stroke="#4ADE80" stroke-width="3" stroke-linecap="round" filter="url(#glow)" />
  <path d="M 54,36 Q 57,32.5 60,36" fill="none" stroke="#4ADE80" stroke-width="3" stroke-linecap="round" filter="url(#glow)" />
  <!-- Smiling Mouth -->
  <path d="M 47.5,41 Q 50,43 52.5,41" fill="none" stroke="#4ADE80" stroke-width="2" stroke-linecap="round" filter="url(#glow)" />

  <!-- Quai nón (Pink Ribbon under the chin) -->
  <path d="M 27,29 Q 50,47 73,29" fill="none" stroke="#FF4081" stroke-width="2.5" />

  <!-- Nón lá (Conical Hat with 3D gradient & shadow) -->
  <polygon points="50,2 14,29 86,29" fill="url(#hatGrad)" filter="url(#hatShadow)" />
  <!-- Conical Hat Texture Lines -->
  <line x1="50" y1="2" x2="32" y2="29" stroke="#E6EE9C" stroke-width="1.2" opacity="0.8" />
  <line x1="50" y1="2" x2="68" y2="29" stroke="#E6EE9C" stroke-width="1.2" opacity="0.8" />
  <line x1="50" y1="2" x2="50" y2="29" stroke="#E6EE9C" stroke-width="1.5" opacity="0.8" />
  <line x1="50" y1="2" x2="23" y2="29" stroke="#E6EE9C" stroke-width="1" opacity="0.6" />
  <line x1="50" y1="2" x2="77" y2="29" stroke="#E6EE9C" stroke-width="1" opacity="0.6" />
</svg>`;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Chatbot HTML Markup
    const chatbotHTML = `
        <!-- Floating Chat Button -->
        <div class="ai-chat-btn" id="aiChatBtn">
            <div class="ai-chat-btn-icon-wrapper">
                <div class="ai-chat-btn-pulse"></div>
                💬
            </div>
            <div class="ai-chat-btn-text">
                <span class="ai-chat-btn-title">Trợ lý Bến Tre AI</span>
                <span class="ai-chat-btn-subtitle">Tôi có thể giúp bạn lên kế hoạch!</span>
            </div>
        </div>

        <!-- Chat Window -->
        <div class="ai-chat-window" id="aiChatWindow">
            <div class="ai-chat-header">
                <div class="ai-chat-header-info">
                    <div class="ai-chat-header-avatar">${ROBOT_AVATAR_SVG}</div>
                    <div class="ai-chat-header-title-wrapper">
                        <div class="ai-chat-header-title">Trợ lý Bến Tre AI</div>
                        <div class="ai-chat-header-status">Đang trực tuyến</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <button class="ai-chat-new-btn" id="aiChatNew" title="Bắt đầu đoạn chat mới" style="background: none; border: none; color: rgba(255,255,255,0.7); font-size: 1.5rem; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; transition: color 0.2s ease; font-weight: 700; margin-right: 4px;">+</button>
                    <button class="ai-chat-close-btn" id="aiChatClose" style="background: none; border: none; color: rgba(255,255,255,0.7); font-size: 1.6rem; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; transition: color 0.2s ease;">&times;</button>
                </div>
            </div>

            <!-- Messages Area -->
            <div class="ai-chat-messages" id="aiChatMessages"></div>

            <!-- Quick Suggestions -->
            <div class="ai-chat-quick-suggestions" id="aiChatPills">
                <span class="quick-pill" data-type="itinerary">📅 Tạo lịch trình riêng</span>
                <span class="quick-pill" data-type="recommend">🌴 Tư vấn tour 1 ngày</span>
                <span class="quick-pill" data-type="sustain">🌱 Du lịch bền vững</span>
                <span class="quick-pill" data-type="health">❤️ Tour nhẹ & y tế gần đây</span>
            </div>

            <!-- Input Box -->
            <div class="ai-chat-input-area">
                <input type="text" class="ai-chat-input" id="aiChatInput" placeholder="Nhập câu hỏi của bạn tại đây...">
                <button class="ai-chat-send-btn" id="aiChatSend">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
            </div>
        </div>

        <!-- HTML-based Confirmation Modal -->
        <div class="ai-confirm-modal-overlay" id="aiChatConfirmModal" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: none; align-items: center; justify-content: center; z-index: 10000; backdrop-filter: blur(4px); font-family: 'Be Vietnam Pro', sans-serif; transition: all 0.3s ease;">
            <div class="ai-confirm-modal-card" style="background: #ffffff; padding: 28px 24px; border-radius: 16px; width: 90%; max-width: 380px; box-shadow: 0 20px 40px rgba(0,0,0,0.25); border: 1px solid rgba(0,0,0,0.05); text-align: center; transform: scale(0.9); transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);">
                <div style="font-size: 2.2rem; margin-bottom: 12px;">🗑️</div>
                <h3 style="font-size: 1.15rem; font-weight: 800; color: #0E4B25; margin-bottom: 12px; line-height: 1.35;">Bắt đầu đoạn chat mới?</h3>
                <p style="font-size: 0.88rem; color: #4B5563; line-height: 1.5; margin-bottom: 24px; padding: 0 6px;">Lịch sử trò chuyện và tư vấn cũ của bạn sẽ bị xóa hoàn toàn. Bạn có muốn tiếp tục không?</p>
                <div style="display: flex; gap: 12px;">
                    <button id="aiConfirmCancel" style="flex: 1; height: 40px; border: 1px solid #E5E7EB; background: #ffffff; border-radius: 8px; font-weight: 700; color: #4B5563; cursor: pointer; font-family: inherit; font-size: 0.84rem; transition: background 0.2s ease;">Hủy bỏ</button>
                    <button id="aiConfirmOk" style="flex: 1; height: 40px; border: none; background: #0E4B25; border-radius: 8px; font-weight: 700; color: #ffffff; cursor: pointer; font-family: inherit; font-size: 0.84rem; transition: background 0.2s ease;">Xác nhận</button>
                </div>
            </div>
        </div>
    `;

    // Append to body
    const div = document.createElement('div');
    div.innerHTML = chatbotHTML;
    document.body.appendChild(div);

    // 2. DOM Elements
    const chatBtn = document.getElementById('aiChatBtn');
    const chatWindow = document.getElementById('aiChatWindow');
    const chatClose = document.getElementById('aiChatClose');
    const chatNew = document.getElementById('aiChatNew');
    const chatMessages = document.getElementById('aiChatMessages');
    const chatInput = document.getElementById('aiChatInput');
    const chatSend = document.getElementById('aiChatSend');
    const chatPills = document.getElementById('aiChatPills');

    // Load Chat History from LocalStorage
    loadChatHistory();

    // New Chat Modal Handling
    const confirmModal = document.getElementById('aiChatConfirmModal');
    const confirmCard = confirmModal.querySelector('.ai-confirm-modal-card');
    const confirmCancel = document.getElementById('aiConfirmCancel');
    const confirmOk = document.getElementById('aiConfirmOk');

    chatNew.addEventListener('click', () => {
        confirmModal.style.display = 'flex';
        setTimeout(() => {
            confirmCard.style.transform = 'scale(1)';
        }, 10);
    });

    confirmCancel.addEventListener('click', () => {
        confirmCard.style.transform = 'scale(0.9)';
        setTimeout(() => {
            confirmModal.style.display = 'none';
        }, 150);
    });

    confirmOk.addEventListener('click', () => {
        localStorage.removeItem('bentre_ai_history');
        state = { inGuide: false, step: 0, answers: {} };
        loadChatHistory();
        confirmCard.style.transform = 'scale(0.9)';
        setTimeout(() => {
            confirmModal.style.display = 'none';
        }, 150);
    });

    // Hover effects for modal buttons
    confirmCancel.addEventListener('mouseenter', () => confirmCancel.style.background = '#F3F4F6');
    confirmCancel.addEventListener('mouseleave', () => confirmCancel.style.background = '#ffffff');
    confirmOk.addEventListener('mouseenter', () => confirmOk.style.background = '#0A391C');
    confirmOk.addEventListener('mouseleave', () => confirmOk.style.background = '#0E4B25');

    // 3. Chatbot Guided State
    let state = {
        inGuide: false,
        step: 0,
        answers: {}
    };

    // 4. Toggle Chat Window
    chatBtn.addEventListener('click', () => {
        const isOpened = chatWindow.style.display === 'flex';
        chatWindow.style.display = isOpened ? 'none' : 'flex';
        if (!isOpened) {
            chatInput.focus();
            scrollToBottom();
        }
    });

    chatClose.addEventListener('click', () => {
        chatWindow.style.display = 'none';
    });

    // 5. Send Message Actions
    chatSend.addEventListener('click', handleUserSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserSend();
    });

    // 6. Quick Suggestions Pills
    chatPills.addEventListener('click', (e) => {
        const target = e.target.closest('.quick-pill');
        if (!target) return;
        const type = target.getAttribute('data-type');
        
        if (type === 'itinerary') {
            startItineraryGuide();
        } else if (type === 'recommend') {
            sendUserMessage("Tư vấn cho tôi tour đi 1 ngày");
            setTimeout(() => {
                respondRecommendTour();
            }, 600);
        } else if (type === 'sustain') {
            sendUserMessage("Tôi muốn đi Bến Tre nhưng muốn hạn chế tác động môi trường");
            setTimeout(() => {
                respondSustainTour();
            }, 600);
        } else if (type === 'health') {
            sendUserMessage("Tìm tour sức khỏe nhẹ nhàng và cơ sở y tế gần nhất");
            setTimeout(() => {
                respondHealthInfo();
            }, 600);
        }
    });

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sanitizeChatHtml(html) {
        const template = document.createElement('template');
        template.innerHTML = String(html || '');
        template.content.querySelectorAll('script,style,iframe,object,embed,form').forEach(node => node.remove());
        template.content.querySelectorAll('*').forEach(node => {
            Array.from(node.attributes).forEach(attribute => {
                const name = attribute.name.toLowerCase();
                const value = attribute.value.trim().toLowerCase();
                if (name.startsWith('on') || ((name === 'href' || name === 'src') && value.startsWith('javascript:'))) {
                    node.removeAttribute(attribute.name);
                }
            });
        });
        return template.innerHTML;
    }

    function saveMessageToHistory(sender, html) {
        try {
            let history = JSON.parse(localStorage.getItem('bentre_ai_history') || '[]');
            if (!Array.isArray(history)) history = [];
            history.push({ sender: sender === 'user' ? 'user' : 'bot', html: String(html || '').slice(0, 12000) });
            localStorage.setItem('bentre_ai_history', JSON.stringify(history.slice(-100)));
        } catch (error) {
            console.warn('Không thể lưu lịch sử trò chuyện:', error.message);
        }
    }

    function loadChatHistory() {
        let history = [];
        try {
            history = JSON.parse(localStorage.getItem('bentre_ai_history') || '[]');
            if (!Array.isArray(history)) history = [];
        } catch (error) {
            localStorage.removeItem('bentre_ai_history');
        }
        if (history.length === 0) {
            const welcomeHTML = `
                Xin chào! Tôi là <strong>Trợ lý Bến Tre AI</strong>. 🌴 
                <br><br>
                Tôi có thể giúp bạn lên kế hoạch du lịch xanh, đề xuất các tour sức khỏe nhẹ nhàng, tìm kiếm cơ sở y tế gần nhất, hoặc tự tạo lịch trình riêng tối ưu nhất.
                <br><br>
                Hãy chọn các nút ý kiến nhanh bên dưới hoặc trò chuyện tự nhiên với tôi nhé!
            `;
            history.push({ sender: 'bot', html: welcomeHTML });
            localStorage.setItem('bentre_ai_history', JSON.stringify(history));
        }

        // Render history
        chatMessages.innerHTML = '';
        history.forEach(msg => {
            const msgRow = document.createElement('div');
            msgRow.className = `msg-row msg-${msg.sender}`;
            if (msg.sender === 'bot') {
                const avatar = document.createElement('div');
                avatar.className = 'msg-avatar';
                avatar.innerHTML = ROBOT_AVATAR_SVG;
                const bubble = document.createElement('div');
                bubble.className = 'msg-bubble';
                bubble.innerHTML = sanitizeChatHtml(msg.html);
                msgRow.append(avatar, bubble);
            } else {
                const bubble = document.createElement('div');
                bubble.className = 'msg-bubble';
                bubble.textContent = String(msg.html || '');
                msgRow.appendChild(bubble);
            }
            chatMessages.appendChild(msgRow);
        });
        setTimeout(scrollToBottom, 50);
    }

    function appendBotMessage(htmlContent) {
        const msgRow = document.createElement('div');
        msgRow.className = 'msg-row msg-bot';
        const avatar = document.createElement('div');
        avatar.className = 'msg-avatar';
        avatar.innerHTML = ROBOT_AVATAR_SVG;
        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        bubble.innerHTML = sanitizeChatHtml(htmlContent);
        msgRow.append(avatar, bubble);
        chatMessages.appendChild(msgRow);
        scrollToBottom();
        saveMessageToHistory('bot', htmlContent);
    }

    function sendUserMessage(text) {
        const msgRow = document.createElement('div');
        msgRow.className = 'msg-row msg-user';
        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        bubble.textContent = String(text || '');
        msgRow.appendChild(bubble);
        chatMessages.appendChild(msgRow);
        scrollToBottom();
        saveMessageToHistory('user', text);
    }

    function handleUserSend() {
        const text = chatInput.value.trim();
        if (!text) return;

        sendUserMessage(text);
        chatInput.value = '';

        setTimeout(() => {
            if (state.inGuide) {
                handleGuideStep(text);
            } else {
                analyzeNaturalQuery(text);
            }
        }, 800);
    }

    // 7. Natural Language Analysis (Keyword Engine)
    async function analyzeNaturalQuery(query) {
        const q = query.toLowerCase().trim();
        const normalized = q.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd');

        // Chào lại ngắn gọn khi người dùng chỉ gửi một lời chào.
        const isGreeting = /^(xin\s+chào|chào|hello|hi|hey|alo)(\s+(bạn|ai|trợ\s*lý|admin))?[!,.?\s]*$/i.test(q);
        if (isGreeting) {
            appendBotMessage(`
                Xin chào bạn! 👋 Tôi là <strong>Trợ lý Bến Tre AI</strong>.<br>
                Tôi có thể giúp gì cho bạn?
            `);
            return;
        }

        // Ưu tiên Gemini + dữ liệu MySQL thật. Nếu Gemini chưa được cấu hình hoặc
        // mất kết nối, bộ quy tắc cục bộ bên dưới vẫn tiếp tục trả lời.
        if (await requestGeminiReply(query)) return;

        // Ưu tiên tuyệt đối các yêu cầu đã có địa điểm/thời gian/câu hỏi cụ thể.
        // Các trường hợp này phải được tư vấn trực tiếp, không trả menu chung.
        const mentionsConThoiSon = /con\s*thoi\s*son/.test(normalized);
        const mentionsDestination = /(con\s*(thoi\s*son|phung|quy|phu\s*da)|vam\s*ho|cho\s*lach|cai\s*mon|ben\s*tre|mien\s*tay)/.test(normalized);
        const mentionsDuration = /(\d+|mot|hai|ba|bon|nam|bay)\s*(ngay|dem)|ngay\s*\d+|\d+\s*ngay\s*\d+\s*(dem|de)/.test(normalized);
        const asksSpecificQuestion = /(tour|ktour)\s*(gom|co)|bao\s*gom|can\s*chuan\s*bi|chuan\s*bi\s*gi|dat\s*(mot\s*)?tour|tu\s*van|gia\s*(bao\s*nhieu|tour)|khoi\s*hanh/.test(normalized);

        if (mentionsConThoiSon) {
            respondConThoiSonTour();
            return;
        }

        if (mentionsDestination || mentionsDuration || asksSpecificQuestion) {
            respondSpecificTourQuestion(normalized);
            return;
        }

        // 1. Check for Itinerary Intent
        if (q.includes('lịch trình') || q.includes('kế hoạch') || q.includes('tự thiết kế') || q.includes('lên lịch')) {
            startItineraryGuide();
            return;
        }

        // 2. Check for health medical intent
        if (q.includes('y tế') || q.includes('bệnh viện') || q.includes('trạm y tế') || q.includes('bác sĩ')) {
            respondHealthInfo();
            return;
        }

        // 3. Check for specific gentle/health tour intent
        if (q.includes('nhẹ nhàng') || q.includes('ít đi bộ') || q.includes('sức khỏe') || q.includes('trị liệu') || q.includes('ngâm chân')) {
            respondGentleTour();
            return;
        }

        // 4. Check for sustainability intent
        if (q.includes('bền vững') || q.includes('môi trường') || q.includes('hạn chế tác động') || q.includes('xanh') || q.includes('nhựa')) {
            respondSustainTour();
            return;
        }

        // 5. Check for 1 day / budget tour intent
        if ((q.includes('1 ngày') || q.includes('một ngày') || q.includes('700')) && (q.includes('2 người') || q.includes('ngân sách') || q.includes('người'))) {
            respondRecommendTour();
            return;
        }

        // Fallback generic response
        appendBotMessage(`
            Cảm ơn bạn đã nhắn tin! Tôi có thể hiểu được rất nhiều nhu cầu của bạn:
            <ul style="margin-left: 18px; margin-top: 8px; display: flex; flex-direction: column; gap: 4px;">
                <li>📍 Trực tiếp lên lịch trình riêng (hãy nhập <strong>"Lên lịch trình"</strong>)</li>
                <li>🌱 Tư vấn về môi trường / du lịch xanh (hãy nhập <strong>"Du lịch bền vững"</strong>)</li>
                <li>❤️ Gợi ý các hoạt động thư giãn, trị liệu sức khỏe hoặc cơ sở y tế (nhập <strong>"Y tế"</strong> hoặc <strong>"Sức khỏe"</strong>)</li>
                <li>🌴 Tư vấn tour 1 ngày giá rẻ phù hợp (nhập <strong>"Tư vấn tour"</strong>)</li>
            </ul>
        `);
    }

    async function requestGeminiReply(message) {
        try {
            const isBackendOrigin = ['8080', ''].includes(window.location.port)
                && /^https?:$/.test(window.location.protocol);
            const apiUrl = isBackendOrigin ? '/api/chat' : 'http://localhost:8080/api/chat';
            const needsLocation = /(gần tôi|gần đây|xung quanh tôi|quanh đây)/i.test(message);
            const location = needsLocation ? await getCustomerLocation() : null;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);
            let response;
            try {
                response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, location }),
                signal: controller.signal
                });
            } finally {
                clearTimeout(timeoutId);
            }
            if (!response.ok) return false;

            const data = await response.json();
            if (!data.reply) return false;

            const safeReply = String(data.reply)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/^[-•]\s+(.+)$/gm, '• $1')
                .replace(/\n/g, '<br>');
            appendBotMessage(safeReply);
            return true;
        } catch (error) {
            console.warn('Gemini không khả dụng, chuyển sang tư vấn cục bộ:', error.message);
            return false;
        }
    }

    function getCustomerLocation() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) return resolve(null);
            navigator.geolocation.getCurrentPosition(
                (position) => resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }),
                () => resolve(null),
                { enableHighAccuracy: false, timeout: 7000, maximumAge: 300000 }
            );
        });
    }

    // 8. Specific Responses Mockups
    function respondConThoiSonTour() {
        appendBotMessage(`
            Dạ em chào Anh/Chị! Đi <strong>Cồn Thới Sơn (Tiền Giang) 2 ngày 1 đêm</strong> là lựa chọn tuyệt vời để trải nghiệm trọn vẹn miền Tây sông nước. Em xin giải đáp các thắc mắc của mình ạ:

            <p style="margin-top: 12px;"><strong>Tour 2 ngày 1 đêm đã bao gồm trọn gói:</strong></p>
            <ul style="margin-left: 18px; margin-top: 8px; display: flex; flex-direction: column; gap: 6px;">
                <li><strong>Vận chuyển:</strong> Xe đưa đón khứ hồi và tàu thuyền/đò chèo tham quan trên sông.</li>
                <li><strong>Lưu trú:</strong> 1 đêm tại homestay sân vườn mát mẻ hoặc khách sạn tiêu chuẩn.</li>
                <li><strong>Ăn uống:</strong> Các bữa chính với đặc sản miền Tây, trái cây tại vườn và trà mật ong.</li>
                <li><strong>Trải nghiệm:</strong> Vé tham quan, nghe đờn ca tài tử, tham quan lò kẹo dừa và đi xe ngựa đường làng.</li>
                <li><strong>Khác:</strong> Hướng dẫn viên theo suốt tuyến và bảo hiểm du lịch.</li>
            </ul>

            <p style="margin-top: 12px;"><strong>Những vật dụng Anh/Chị cần chuẩn bị:</strong></p>
            <ul style="margin-left: 18px; margin-top: 8px; display: flex; flex-direction: column; gap: 6px;">
                <li>Quần áo gọn nhẹ, thoải mái và giày/dép bệt để dễ lên xuống tàu.</li>
                <li>Mũ nón, ô dù và kem chống nắng.</li>
                <li>Thuốc xịt muỗi/côn trùng vì hành trình có đi vào miệt vườn.</li>
                <li>Sạc dự phòng để thoải mái chụp ảnh.</li>
            </ul>

            <p style="margin-top: 12px;"><strong>Anh/Chị dự kiến khởi hành khi nào và đoàn có bao nhiêu người để em báo giá chi tiết và giữ chỗ ạ?</strong></p>
        `);
    }

    function respondSpecificTourQuestion(normalizedQuery) {
        const duration = normalizedQuery.includes('2 ngay') && (normalizedQuery.includes('1 dem') || normalizedQuery.includes('1 de'))
            ? '2 ngày 1 đêm'
            : 'theo thời gian Anh/Chị dự kiến';

        appendBotMessage(`
            Dạ, em đã hiểu Anh/Chị đang cần tư vấn một tour <strong>${duration}</strong>. Em xin trả lời trực tiếp như sau:
            <p style="margin-top: 12px;"><strong>Tour dự kiến bao gồm:</strong></p>
            <ul style="margin-left: 18px; margin-top: 8px; display: flex; flex-direction: column; gap: 6px;">
                <li>Phương tiện đưa đón và di chuyển trong chương trình.</li>
                <li>Vé tham quan, các hoạt động trải nghiệm theo lịch trình.</li>
                <li>Các bữa ăn được ghi trong chương trình và nơi lưu trú nếu tour có qua đêm.</li>
                <li>Hướng dẫn viên đồng hành và bảo hiểm du lịch.</li>
            </ul>
            <p style="margin-top: 12px;"><strong>Anh/Chị nên chuẩn bị:</strong></p>
            <ul style="margin-left: 18px; margin-top: 8px; display: flex; flex-direction: column; gap: 6px;">
                <li>Trang phục thoải mái, giày/dép dễ di chuyển.</li>
                <li>Mũ, kem chống nắng, thuốc cá nhân và sạc dự phòng.</li>
                <li>Giấy tờ tùy thân nếu chương trình có lưu trú.</li>
            </ul>
            <p style="margin-top: 12px;"><strong>Anh/Chị cho em biết điểm đến, ngày khởi hành và số người để em tư vấn lịch trình cùng mức giá chính xác nhé?</strong></p>
        `);
    }

    function respondRecommendTour() {
        appendBotMessage(`
            Tôi đã phân tích nhu cầu của bạn (1 ngày, 2 người, ngân sách ~700.000đ/người) và đề xuất tour phù hợp nhất cho bạn dưới đây:
            <div class="msg-tour-card">
                <div class="msg-tour-card-header">
                    <span class="msg-tour-card-tag">🌴 Tour phù hợp nhất</span>
                    <div class="msg-tour-card-title">Một Ngày Xanh – Khám Phá Bến Tre</div>
                    <div class="msg-tour-card-meta">⭐ 4.9 · 🌱 Điểm bền vững: 92/100</div>
                </div>
                <div class="msg-tour-card-body">
                    <div class="msg-tour-card-price">💰 690.000đ/người</div>
                    <strong>Lịch trình chi tiết:</strong>
                    <div class="msg-tour-card-schedule">
                        <div class="msg-tour-card-step"><strong>07:30</strong> – Đón khách tại điểm hẹn</div>
                        <div class="msg-tour-card-step"><strong>08:30</strong> – Đi thuyền tham quan cồn sinh thái</div>
                        <div class="msg-tour-card-step"><strong>11:30</strong> – Thưởng thức cơm miệt vườn hữu cơ</div>
                        <div class="msg-tour-card-step"><strong>13:30</strong> – Đạp xe dưới bóng dừa mát rượi</div>
                        <div class="msg-tour-card-step"><strong>15:00</strong> – Trải nghiệm làm kẹo dừa truyền thống</div>
                        <div class="msg-tour-card-step"><strong>17:00</strong> – Kết thúc hành trình đầy ý nghĩa</div>
                    </div>
                </div>
                <div class="msg-tour-card-footer">
                    <button class="msg-btn msg-btn-primary" style="width: 100%;" onclick="window.location.href='?guide=0&tourTitle='+encodeURIComponent('Một Ngày Xanh Bến Tre: Sông Nước, Miệt Vườn & Làng Nghề Cổ Truyền');">Xem tour</button>
                </div>
            </div>
        `);
    }

    function respondSustainTour() {
        appendBotMessage(`
            Để hạn chế tối đa tác động tiêu cực đến môi trường tự nhiên và hỗ trợ bà con xứ Dừa, tôi ưu tiên gợi ý các tour có **chỉ số du lịch bền vững rất cao**:
            <br><br>
            1. **Một Ngày Xanh Bến Tre** (🌱 92/100)
            <br>
            2. **Trải Nghiệm Sinh Thái Rừng Ngập Mặn Vàm Hồ** (🌱 99/100)
            <br><br>
            <strong>Lý do lựa chọn du lịch xanh:</strong>
            <ul style="margin-left: 18px; margin-top: 8px; display: flex; flex-direction: column; gap: 4px;">
                <li>🚲 <strong>Phương tiện ít khí thải:</strong> Ưu tiên đạp xe, đi bộ xuyên rừng và chèo thuyền ba lá truyền thống thay vì động cơ xăng.</li>
                <li>🥬 <strong>Thực phẩm hữu cơ:</strong> Sử dụng nông sản và cá sông đánh bắt tự nhiên của địa phương, kích cầu kinh tế hộ gia đình.</li>
                <li>♻️ <strong>Hạn chế nhựa:</strong> Cam kết sử dụng nước dừa tươi nguyên quả và bình nước thủy tinh tái sử dụng, không mang rác thải nhựa vào khu sinh thái.</li>
                <li>👨‍🌾 <strong>Phát triển cộng đồng:</strong> Trực tiếp trả phí trải nghiệm làm nghề dệt chiếu, làm bánh cho nghệ nhân, giữ gìn văn hóa bản địa.</li>
            </ul>
            <br>
            Bạn có muốn tham khảo chi tiết tour du lịch bền vững Vàm Hồ không?
        `);
    }

    function respondGentleTour() {
        appendBotMessage(`
            Với yêu cầu lịch trình nhẹ nhàng, ít vận động và hồi phục thể chất, tôi ưu tiên giới thiệu chương trình dưỡng sinh sau:
            <div class="msg-tour-card">
                <div class="msg-tour-card-header">
                    <span class="msg-tour-card-tag" style="background:#E0F2FE; color:#0369A1;">❤️ Tour Chăm sóc sức khỏe</span>
                    <div class="msg-tour-card-title">Trị Liệu Sức Khỏe & Ngâm Chân Thảo Dược Nam Bộ</div>
                    <div class="msg-tour-card-meta">⭐ 4.9 · 🌱 Điểm bền vững: 97/100</div>
                </div>
                <div class="msg-tour-card-body">
                    <div class="msg-tour-card-price">💰 950.000đ/người</div>
                    <div style="margin-bottom:8px;">🟢 <strong>Mức độ vận động: Nhẹ nhàng</strong></div>
                    <p style="color:#4B5563; line-height:1.4;">Chuyến đi thư thái hoàn toàn bằng xe điện cao cấp và xuồng chèo chậm rãi dưới bóng rợp của dừa. Hoạt động điểm nhấn là ngâm chân phục hồi cơ khớp bằng thảo mộc tự nhiên theo y học cổ truyền và thưởng trà thảo mộc kết hợp súp dưỡng sinh miệt vườn.</p>
                </div>
                <div class="msg-tour-card-footer">
                    <button class="msg-btn msg-btn-primary" style="width: 100%;" onclick="window.location.href='?guide=4&tourTitle='+encodeURIComponent('Trị Liệu Sức Khỏe & Ngâm Chân Thảo Dược Nam Bộ');">Xem tour</button>
                </div>
            </div>
        `);
    }

    function respondHealthInfo() {
        appendBotMessage(`
            🏥 <strong>Danh sách cơ sở y tế gần các điểm du lịch Phường Bến Tre:</strong>
            <br><br>
            1. <strong>Trạm Y tế Phường Bến Tre</strong>
            <br>📍 Địa chỉ: Cách Khu hành chính trung tâm 800m
            <br>📞 Điện thoại liên hệ: 0275 3822 111
            <br><br>
            2. <strong>Bệnh viện Đa khoa Nguyễn Đình Chiểu (Tuyến Tỉnh)</strong>
            <br>📍 Địa chỉ: Cách trung tâm Phường Bến Tre 1.8 km
            <br>📞 Đường dây nóng cấp cứu: 0275 3822 222
            <br><br>
            ⚠️ <em>Lưu ý an toàn: Trợ lý AI chỉ cung cấp thông tin vị trí và số điện thoại công cộng của các cơ sở y tế để hỗ trợ tìm kiếm khẩn cấp, hoàn toàn không có chức năng tự chẩn đoán bệnh lý hay thay thế lời khuyên của bác sĩ chuyên môn.</em>
        `);
    }

    // 9. Guided Itinerary Planner (Step-by-step form)
    function startItineraryGuide() {
        state.inGuide = true;
        state.step = 1;
        state.answers = {};
        
        appendBotMessage(`
            Hãy cùng tôi thiết kế một <strong>Hành trình Bến Tre dành riêng cho bạn</strong> nhé! 
            <br><br>
            📅 <strong>Câu hỏi 1:</strong> Bạn dự định đi du lịch mấy ngày? 
            <br><em>(Ví dụ: 1 ngày, 3 ngày 2 đêm, 1 tuần)</em>
        `);
    }

    function handleGuideStep(input) {
        if (state.step === 1) {
            state.answers.days = input;
            state.step = 2;
            appendBotMessage(`
                👥 <strong>Câu hỏi 2:</strong> Đoàn của bạn dự kiến đi bao nhiêu người?
                <br><em>(Ví dụ: 2 người, gia đình 4 người...)</em>
            `);
        } else if (state.step === 2) {
            state.answers.people = input;
            state.step = 3;
            appendBotMessage(`
                💰 <strong>Câu hỏi 3:</strong> Ngân sách dự kiến cho mỗi người là bao nhiêu VNĐ?
                <br><em>(Ví dụ: 700.000đ, 2 triệu...)</em>
            `);
        } else if (state.step === 3) {
            state.answers.budget = input;
            state.step = 4;
            appendBotMessage(`
                🌴 <strong>Câu hỏi 4:</strong> Bạn thích những hoạt động nào nhất?
                <br><em>(Ví dụ: Miệt vườn hoa trái, ẩm thực sông nước, chăm sóc sức khỏe trị liệu, di tích lịch sử...)</em>
            `);
        } else if (state.step === 4) {
            state.answers.preferences = input;
            state.step = 5;
            appendBotMessage(`
                🚲 <strong>Câu hỏi 5:</strong> Mức độ vận động thể chất mong muốn của bạn thế nào?
                <br><em>(Nhập: Nhẹ nhàng, Trung bình, hoặc Vận động nhiều)</em>
            `);
        } else if (state.step === 5) {
            state.answers.exercise = input;
            state.step = 6;
            appendBotMessage(`
                🌱 <strong>Câu hỏi 6:</strong> Bạn có đặc biệt ưu tiên yếu tố du lịch xanh/bền vững (không rác thải nhựa, hỗ trợ dân địa phương) không?
                <br><em>(Nhập: Có hoặc Không)</em>
            `);
        } else if (state.step === 6) {
            state.answers.green = input;
            state.inGuide = false; // Reset state
            state.step = 0;

            appendBotMessage("🔄 Đang phân tích các tiêu chí và lập trình lịch trình cá nhân hóa cho bạn...");
            
            setTimeout(() => {
                generateCustomItineraryCard();
            }, 1200);
        }
    }

    function generateCustomItineraryCard() {
        const days = state.answers.days || "1 ngày";
        const budget = state.answers.budget || "700.000 VNĐ";
        const exercise = state.answers.exercise || "Nhẹ nhàng";
        const isGreen = (state.answers.green || "").toLowerCase().includes("có");
        const sustainScore = isGreen ? "95/100" : "91/100";
        
        let itineraryHTML = '';
        if (days.includes("3 ngày") || days.includes("3")) {
            itineraryHTML = `
                <div class="msg-tour-card-step"><strong>Ngày 1 (Cổ Truyền)</strong>: 08:00 Tham quan miệt vườn - 12:00 Ăn trưa bánh xèo - 14:00 Trải nghiệm làm kẹo dừa dẻo.</div>
                <div class="msg-tour-card-step"><strong>Ngày 2 (Sức Khỏe)</strong>: 08:30 Ngâm chân thảo mộc - 11:30 Dùng tiệc súp chay dưỡng sinh - 14:00 Đi xuồng ba lá ngắm rặng dừa nước.</div>
                <div class="msg-tour-card-step"><strong>Ngày 3 (Thư Giãn)</strong>: 09:00 Khám phá chợ nổi - 13:00 Đạp xe quanh bờ bao sông Ba Lai - 16:30 Kết thúc hành trình.</div>
            `;
        } else if (days.includes("tuần") || days.includes("7")) {
            itineraryHTML = `
                <div class="msg-tour-card-step"><strong>Ngày 1-2</strong>: Tham quan miệt vườn Cái Mơn, Chợ Lách & tự tay làm vườn trái cây.</div>
                <div class="msg-tour-card-step"><strong>Ngày 3-4</strong>: Nghỉ dưỡng trị liệu, ngâm chân phục hồi sức khỏe, đi du thuyền ngắm hoàng hôn.</div>
                <div class="msg-tour-card-step"><strong>Ngày 5-6</strong>: Đi xe đạp quanh bờ đê cồn Phú Đa, thưởng thức bánh phồng Sơn Đốc.</div>
                <div class="msg-tour-card-step"><strong>Ngày 7</strong>: Mua sắm đặc sản dừa địa phương và chào tạm biệt Bến Tre xanh.</div>
            `;
        } else {
            // Default 1 day
            itineraryHTML = `
                <div class="msg-tour-card-step"><strong>08:00</strong> – 🌴 Bắt đầu đón khách & tản bộ miệt vườn trái cây Cái Mơn</div>
                <div class="msg-tour-card-step"><strong>10:30</strong> – 🚤 Xuồng ba lá rẽ nước len lỏi rạch dừa mát mẻ</div>
                <div class="msg-tour-card-step"><strong>12:00</strong> – 🍽️ Dùng cơm miệt vườn với các rau sông đặc trưng</div>
                <div class="msg-tour-card-step"><strong>14:00</strong> – 🥥 Tham quan & trải nghiệm quy trình ép dầu dừa truyền thống</div>
                <div class="msg-tour-card-step"><strong>16:00</strong> – 🚲 Đạp xe dạo quanh cồn sinh thái bình dị</div>
                <div class="msg-tour-card-step"><strong>17:30</strong> – 🏨 Trở về điểm xuất phát, khép lại ngày ý nghĩa</div>
            `;
        }

        appendBotMessage(`
            Thiết kế lịch trình thành công! Dưới đây là hành trình được thiết kế may đo riêng biệt theo nhu cầu của bạn:
            <div class="msg-tour-card">
                <div class="msg-tour-card-header" style="background:#F0FDF4; border-bottom:1px solid #DCFCE7;">
                    <span class="msg-tour-card-tag" style="background:#DCFCE7; color:#15803D;">🌿 Hành trình dành riêng cho bạn</span>
                    <div class="msg-tour-card-title">Hành Trình Khám Phá Bến Tre Xanh Của Bạn</div>
                    <div class="msg-tour-card-meta">Theo khảo sát 6 tiêu chí cá nhân hóa</div>
                </div>
                <div class="msg-tour-card-body" style="background:#FAFDFB;">
                    <strong>Lịch trình đề xuất (${days}):</strong>
                    <div class="msg-tour-card-schedule" style="margin-top:10px;">
                        ${itineraryHTML}
                    </div>
                    <hr style="margin:12px 0; border:0; border-top:1px solid #E5E7EB;">
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:0.78rem;">
                        <div>💰 <strong>Dự kiến:</strong> ~${budget} / người</div>
                        <div>🌱 <strong>Điểm bền vững:</strong> ${sustainScore}</div>
                        <div>❤️ <strong>Vận động:</strong> ${exercise}</div>
                        <div>🚶 <strong>Quãng đường:</strong> ~5,4 km</div>
                    </div>
                </div>
                <div class="msg-tour-card-footer">
                    <button class="msg-btn msg-btn-primary" style="width:100%;" onclick="alert('Đã lưu lịch trình cá nhân hóa này! Hệ thống đã tự động kết nối dữ liệu tour của hướng dẫn viên phù hợp nhất cho bạn.');">Đặt tour này</button>
                </div>
            </div>
        `);
    }
});
