
document.addEventListener('DOMContentLoaded', () => {
    // All element selectors remain the same
    const sidebar = document.getElementById('sidebar');
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    const appName = document.getElementById('appName');
    const newChatBtn = document.getElementById('newChatBtn');
    const recentChatsBlock = document.getElementById('recentChatsBlock');
    const sidebarPen = document.getElementById('sidebarPen');
    const penInSidebar = document.getElementById('penInSidebar');
    const chatHeader = document.getElementById('chatHeader');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const chatHistoryList = document.getElementById('chatHistoryList');
    const messageContainer = document.getElementById('messageContainer');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const addAttachmentBtn = document.getElementById('addAttachmentBtn');
    const attachmentOptions = document.getElementById('attachmentOptions');
    const attachmentContainer = document.getElementById('attachmentContainer');
    const gameModeBtn = document.getElementById('gameModeBtn');
    const gameModeText = document.getElementById('gameModeText');
    // Poll modal elements
    const openPhqBtn = document.getElementById('openPhqBtn');
    const openGhqBtn = document.getElementById('openGhqBtn');
    const pollModal = document.getElementById('pollModal');
    const pollIframe = document.getElementById('pollIframe');
    const pollCloseBtn = document.getElementById('pollCloseBtn');
    const pollTitle = document.getElementById('pollTitle');

    // Header auth toggles
    const headerSignInBtn = document.getElementById('header-signin-btn');
    const headerProfileLink = document.getElementById('header-profile-link');
    const headerProfileName = document.getElementById('header-profile-name');
    const headerProfileAvatar = document.getElementById('header-profile-avatar');

    // Helpers to derive user + initials
    const getStoredUser = () => {
        try { return JSON.parse(localStorage.getItem('auth_user')) || null; } catch { return null; }
    };
    const getBestName = () => {
        const u = getStoredUser();
        return (u && (u.pseudoname || u.username || u.fullName || u.name || u.email)) || localStorage.getItem('username') || localStorage.getItem('email') || '';
    };
    const getInitials = (name) => {
        if (!name) return 'ME';
        const clean = String(name).trim();
        const base = clean.includes('@') ? clean.split('@')[0] : clean;
        const parts = base.split(/\s+/).filter(Boolean);
        let initials = '';
        if (parts.length === 1) {
            initials = parts[0].slice(0, 2);
        } else {
            initials = (parts[0][0] || '') + (parts[1][0] || '');
        }
        return initials.toUpperCase();
    };

    // Initialize header according to login state
    const isLoggedIn = localStorage.getItem('is_logged_in') === 'true';
    if (isLoggedIn) {
        if (headerSignInBtn) headerSignInBtn.classList.add('hidden');
        if (headerProfileLink) headerProfileLink.classList.remove('hidden');
        const displayName = getBestName();
        const initials = getInitials(displayName);
        // We only want to show initials; hide name text and use avatar with initials
        if (headerProfileName) headerProfileName.classList.add('hidden');
        if (headerProfileAvatar) {
            headerProfileAvatar.alt = initials;
            headerProfileAvatar.src = `https://placehold.co/28x28/2c251d/fdfaf6?text=${encodeURIComponent(initials)}`;
        }
    } else {
        if (headerSignInBtn) headerSignInBtn.classList.remove('hidden');
        if (headerProfileLink) headerProfileLink.classList.add('hidden');
    }


    // Per-user chat storage
    const getUsername = () => localStorage.getItem('username') || localStorage.getItem('email') || 'guest';
    const chatsKey = () => `chats:${getUsername()}`;
    const loadChats = () => { try { return JSON.parse(localStorage.getItem(chatsKey())) || []; } catch { return []; } };
    const saveChats = () => { try { localStorage.setItem(chatsKey(), JSON.stringify(chats)); } catch {} };

    let chats = loadChats();
    let currentChatId = null;

    // Webhook endpoint for bot replies
    const WEBHOOK_URL = 'https://n8n-omaf.onrender.com/webhook/chat';

    // Generate/persist a per-user sessionId for the webhook
    const getSessionKey = () => `chat_session_id:${getUsername()}`;
    const getSessionId = () => {
        const key = getSessionKey();
        let sid = localStorage.getItem(key);
        if (!sid) {
            sid = 'sid_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
            localStorage.setItem(key, sid);
        }
        return sid;
    };

    addAttachmentBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        attachmentOptions.classList.toggle('hidden');
        if (!attachmentOptions.classList.contains('hidden')) {
            attachmentOptions.classList.remove('opacity-0', 'scale-95');
            attachmentOptions.classList.add('opacity-100', 'scale-100');
        } else {
            attachmentOptions.classList.remove('opacity-100', 'scale-100');
            attachmentOptions.classList.add('opacity-0', 'scale-95');
        }
    });

    document.addEventListener('click', (event) => {
        if (!attachmentContainer.contains(event.target) && !attachmentOptions.classList.contains('hidden')) {
            attachmentOptions.classList.add('hidden');
            attachmentOptions.classList.remove('opacity-100', 'scale-100');
            attachmentOptions.classList.add('opacity-0', 'scale-95');
        }
    });

    const updateChatView = () => {
        const isChatEmpty = currentChatId === null || chats.find(c => c.id === currentChatId)?.messages.length === 0;
        if (isChatEmpty) {
            welcomeMessage.classList.remove('opacity-0', 'h-0', 'invisible');
            messageContainer.classList.add('justify-center');
        } else {
            welcomeMessage.classList.add('opacity-0', 'h-0', 'invisible');
            messageContainer.classList.remove('justify-center');
        }
    };

    const createMessageElement = (text, type) => {
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('w-full', 'flex', 'mb-4', 'max-w-3xl');
        messageWrapper.classList.add(type === 'user' ? 'justify-end' : 'justify-start');

        const messageBubble = document.createElement('div');
        messageBubble.classList.add('px-5', 'py-3', 'rounded-xl', 'shadow-md', 'text-sm');
        messageBubble.classList.add(type === 'user' ? 'user-message' : 'bot-message');
        messageBubble.textContent = text;

        messageWrapper.appendChild(messageBubble);
        messageContainer.appendChild(messageWrapper);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    };

    // Typing indicator for bot
    let typingEl = null;
    const showTypingIndicator = () => {
        if (typingEl) return;
        typingEl = document.createElement('div');
        typingEl.classList.add('w-full', 'flex', 'mb-4', 'max-w-3xl', 'justify-start');
        const bubble = document.createElement('div');
        bubble.classList.add('px-5', 'py-3', 'rounded-xl', 'shadow-md', 'text-sm', 'bot-message');
        bubble.textContent = '…';
        typingEl.appendChild(bubble);
        messageContainer.appendChild(typingEl);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    };
    const hideTypingIndicator = () => {
        if (typingEl && typingEl.parentNode) {
            typingEl.parentNode.removeChild(typingEl);
        }
        typingEl = null;
    };

    // Extract plain text from webhook raw response (handles array/object/string)
    const extractBotText = (raw) => {
        try {
            const data = JSON.parse(raw);
            if (Array.isArray(data)) {
                for (const item of data) {
                    if (typeof item === 'string' && item.trim()) return item.trim();
                    if (item && typeof item === 'object') {
                        const t = item.output || item.message || item.text || item.reply;
                        if (t && String(t).trim()) return String(t).trim();
                    }
                }
                return JSON.stringify(data);
            }
            if (data && typeof data === 'object') {
                const t = data.output || data.message || data.text || data.reply;
                if (t && String(t).trim()) return String(t).trim();
                const firstStr = Object.values(data).find(v => typeof v === 'string' && v.trim());
                if (firstStr) return firstStr.trim();
                return JSON.stringify(data);
            }
            if (typeof data === 'string') return data.trim();
        } catch (_) {
            // Not JSON; fall back to raw string
        }
        return String(raw || '').trim();
    };

    const setActiveChat = (listItem) => {
        document.querySelectorAll('#chatHistoryList li').forEach(item => {
            item.classList.remove('bg-gray-100', 'border-l-4', 'border-[#f5a67c]');
        });
        if (listItem) {
            listItem.classList.add('bg-gray-100', 'border-l-4', 'border-[#f5a67c]');
        }
    };

    const loadChat = (chatId, listItem) => {
        const chat = chats.find(c => c.id === chatId);
        if (chat) {
            currentChatId = chatId;
            messageContainer.querySelectorAll('.w-full.flex.mb-4').forEach(el => el.remove());
            chat.messages.forEach(msg => {
                createMessageElement(msg.text, msg.type);
            });
            setActiveChat(listItem);
            updateChatView();
        }
    };

    const deleteChat = (chatId) => {
        const chatIndex = chats.findIndex(c => c.id === chatId);
        if (chatIndex > -1) {
            chats.splice(chatIndex, 1);
                saveChats();
            if (currentChatId === chatId) {
                newChat();
            }
            renderChatHistory();
        }
    };

    const renderChatHistory = () => {
        chatHistoryList.innerHTML = '';
        chats.forEach(chat => {
            const listItem = document.createElement('li');
            listItem.classList.add('flex', 'items-center', 'justify-between', 'px-4', 'py-2', 'rounded-lg', 'cursor-pointer', 'hover:bg-gray-100', 'transition-colors', 'chat-history-item');
            listItem.dataset.chatId = chat.id;

            const firstMessage = chat.messages.length > 0 ? chat.messages[0].text : 'New Chat';
            const textSpan = document.createElement('span');
            textSpan.textContent = firstMessage.length > 25 ? firstMessage.substring(0, 25) + '...' : firstMessage;
            textSpan.classList.add('flex-1', 'truncate');
            textSpan.addEventListener('click', () => {
                loadChat(chat.id, listItem);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('p-1', 'ml-2', 'hover:bg-gray-200', 'rounded-full');
            deleteBtn.title = 'Delete chat';
            deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-500 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`;
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteChat(chat.id);
            });

            listItem.appendChild(textSpan);
            listItem.appendChild(deleteBtn);
            chatHistoryList.appendChild(listItem);
        });
    };

    const newChat = () => {
        currentChatId = null;
        messageContainer.querySelectorAll('.w-full.flex.mb-4').forEach(el => el.remove());
        chatInput.value = '';
        setActiveChat(null);
        updateChatView();
    };

    const startGameMode = () => {
        const newChatId = Date.now();
        currentChatId = newChatId;
        const gamePrompt = "Welcome to Mindful Play! Let's start with a simple breathing exercise. Are you ready? (Type 'yes' to begin)";
        chats.unshift({
            id: newChatId,
            messages: [{ text: gamePrompt, type: 'bot' }]
        });

        messageContainer.querySelectorAll('.w-full.flex.mb-4').forEach(el => el.remove());
        chatInput.value = '';
        updateChatView();

        createMessageElement(gamePrompt, 'bot');

            saveChats();
        renderChatHistory();
        const newListItem = chatHistoryList.querySelector(`[data-chat-id='${currentChatId}']`);
        setActiveChat(newListItem);
    };

    const toggleSidebar = () => {
        sidebar.classList.toggle("w-80");
        sidebar.classList.toggle("w-20");
        appName.classList.toggle("hidden");
        newChatBtn.classList.toggle("hidden");
        recentChatsBlock.classList.toggle("hidden");
        sidebarPen.classList.toggle("hidden");
        chatHeader.classList.toggle("hidden");
        gameModeText.classList.toggle("hidden");
        gameModeBtn.classList.toggle("justify-center");
    };

    // Poll modal open/close helpers
    const openPoll = (type) => {
        if (!pollModal || !pollIframe) return;
        const url = type === 'PHQ-9' ? 'phqpoll.html?embed=1' : 'ghqpoll.html?embed=1';
        pollTitle.textContent = type === 'PHQ-9' ? 'PHQ-9 Assessment' : 'GHQ-12 Assessment';
        pollIframe.src = url;
        pollModal.classList.remove('hidden');
        pollModal.classList.add('flex');
    };
    const closePoll = () => {
        if (!pollModal || !pollIframe) return;
        pollModal.classList.add('hidden');
        pollModal.classList.remove('flex');
        pollIframe.src = '';
    };

    if (openPhqBtn) openPhqBtn.addEventListener('click', () => openPoll('PHQ-9'));
    if (openGhqBtn) openGhqBtn.addEventListener('click', () => openPoll('GHQ-12'));
    if (pollCloseBtn) pollCloseBtn.addEventListener('click', closePoll);
    if (pollModal) pollModal.addEventListener('click', (e) => { if (e.target === pollModal) closePoll(); });

    // Listen for poll results from embedded iframe
    window.addEventListener('message', (event) => {
        try {
            const data = event.data;
            if (!data || data.source !== 'thryve' || data.type !== 'poll-submit') return;
            // Build a concise summary message for the chat
            const { poll, payload } = data;
            const total = payload?.total;
            const severity = payload?.severity;
            const summary = `${poll} submitted. Total: ${total}, Severity: ${severity}.`;

            // Ensure we have an active chat
            if (currentChatId === null) {
                const newChatId = Date.now();
                currentChatId = newChatId;
                chats.unshift({ id: newChatId, messages: [] });
            }
            const currentChat = chats.find(c => c.id === currentChatId);
            // Add as user-side message (poll result)
            currentChat.messages.push({ text: summary, type: 'user' });
            createMessageElement(summary, 'user');
            saveChats();
            renderChatHistory();
            const updatedItem = chatHistoryList.querySelector(`[data-chat-id='${currentChatId}']`);
            setActiveChat(updatedItem);

            // Optionally, send to webhook for a follow-up response
            if (WEBHOOK_URL) {
                (async () => {
                    showTypingIndicator();
                    try {
                        const res = await fetch(WEBHOOK_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ sessionId: getSessionId(), message: `Poll ${poll} submitted with total ${total} and severity ${severity}.` })
                        });
                        const raw = await res.text();
                        let botText = extractBotText(raw);
                        if (!botText) botText = 'Thanks for completing the assessment.';
                        currentChat.messages.push({ text: botText, type: 'bot' });
                        createMessageElement(botText, 'bot');
                        saveChats();
                        renderChatHistory();
                        const it = chatHistoryList.querySelector(`[data-chat-id='${currentChatId}']`);
                        setActiveChat(it);
                    } catch (e) {
                        const msg = 'Thanks for completing the assessment.';
                        currentChat.messages.push({ text: msg, type: 'bot' });
                        createMessageElement(msg, 'bot');
                        saveChats();
                        renderChatHistory();
                    } finally {
                        hideTypingIndicator();
                    }
                })();
            }
        } finally {
            closePoll();
        }
    });

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessageText = chatInput.value.trim();
        if (userMessageText === '') return;

        if (currentChatId === null) {
            const newChatId = Date.now();
            currentChatId = newChatId;
            chats.unshift({ id: newChatId, messages: [] });
        }

        const currentChat = chats.find(c => c.id === currentChatId);
        currentChat.messages.push({ text: userMessageText, type: 'user' });
        updateChatView();
        createMessageElement(userMessageText, 'user');
        saveChats();
        renderChatHistory();
        const activeItem = chatHistoryList.querySelector(`[data-chat-id='${currentChatId}']`);
        setActiveChat(activeItem);
        chatInput.value = '';

        // Call webhook for bot reply
        showTypingIndicator();
        try {
            const res = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: getSessionId(), message: userMessageText })
            });
            const raw = await res.text();
            let botText = '';
            try {
                const data = JSON.parse(raw);
                // Handle object or array payloads from webhook
                if (Array.isArray(data)) {
                    for (const item of data) {
                        if (typeof item === 'string') { botText = item; break; }
                        if (item && typeof item === 'object') {
                            botText = item.output || item.message || item.text || item.reply || '';
                            if (botText) break;
                        }
                    }
                    if (!botText) botText = JSON.stringify(data);
                } else if (data && typeof data === 'object') {
                    botText = data.output || data.message || data.text || data.reply || '';
                    if (!botText) {
                        const firstString = Object.values(data).find(v => typeof v === 'string');
                        if (firstString) botText = firstString;
                    }
                } else if (typeof data === 'string') {
                    botText = data;
                }
            } catch (_) {
                // Not JSON or parse failed; use raw text
                botText = raw;
            }
            botText = (botText || '').toString().trim();
            if (!botText) {
                // If HTTP not OK, include minimal hint in console but show user-friendly message
                console.warn('Empty webhook response. HTTP status:', res.status, 'Raw:', raw);
                botText = 'Sorry, I could not get a response right now. Please try again in a moment.';
            }
            currentChat.messages.push({ text: botText, type: 'bot' });
            createMessageElement(botText, 'bot');
            saveChats();
            renderChatHistory();
            const updatedItem = chatHistoryList.querySelector(`[data-chat-id='${currentChatId}']`);
            setActiveChat(updatedItem);
        } catch (err) {
            console.error('Webhook error:', err);
            const fallback = 'Network error contacting assistant. Check your internet and try again.';
            currentChat.messages.push({ text: fallback, type: 'bot' });
            createMessageElement(fallback, 'bot');
            saveChats();
            renderChatHistory();
            const updatedItem = chatHistoryList.querySelector(`[data-chat-id='${currentChatId}']`);
            setActiveChat(updatedItem);
        } finally {
            hideTypingIndicator();
        }
    });

    // Initial setup
    renderChatHistory();
    updateChatView();
    sidebarToggleBtn.addEventListener('click', toggleSidebar);
    newChatBtn.addEventListener('click', newChat);
    penInSidebar.addEventListener('click', newChat);
    gameModeBtn.addEventListener('click', startGameMode);
});
