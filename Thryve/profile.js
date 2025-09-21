
lucide.createIcons();

// ====== Auth + Profile bootstrap ======
function computeApiBase() {
    let base = 'http://localhost:8000/api/v1';
    try {
        if (window.location.protocol.startsWith('http')) {
            const host = window.location.hostname || 'localhost';
            base = `${window.location.protocol}//${host}:8000/api/v1`;
        }
    } catch (_) {}
    return base;
}

// Current username resolution for per-user storage
let CURRENT_USERNAME = localStorage.getItem('username') || null;

function storageKey(prefix) {
    return CURRENT_USERNAME ? `${prefix}:${CURRENT_USERNAME}` : null;
}

function loadUserData(prefix, fallback) {
    const key = storageKey(prefix);
    if (!key) return fallback;
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
        return fallback;
    }
}

function saveUserData(prefix, data) {
    const key = storageKey(prefix);
    if (!key) return;
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (_) {}
}

async function fetchProfile() {
    const API_BASE = computeApiBase();
    try {
        const res = await fetch(`${API_BASE}/users/profile`, { credentials: 'include' });
        if (res.status === 401 || res.status === 403) {
            // Not authenticated -> send to login modal on frontPage
            window.location.href = 'frontPage.html?auth=login';
            return null;
        }
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) {
            console.warn('Profile fetch failed:', data?.message || res.status);
            return null;
        }
        return data?.data || null;
    } catch (err) {
        console.error('Profile fetch error:', err);
        return null;
    }
}

function setText(id, value, fallback = '') {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? fallback;
}

function setInputValue(id, value, fallback = '') {
    const el = document.getElementById(id);
    if (el) el.value = (value ?? fallback);
}

function setAvatar(id, url, username) {
    const el = document.getElementById(id);
    if (!el) return;
    if (url) {
        el.src = url;
    } else {
        const initials = (username || 'U').slice(0, 2).toUpperCase();
        el.src = `https://placehold.co/128x128/f5a67c/2c251d?text=${encodeURIComponent(initials)}`;
    }
}

let onlineSeconds = 0;
let onlineTimerInterval = null;
function initOnlineTimer(initialMinutes = 0) {
    onlineSeconds = Math.max(0, Math.round(initialMinutes * 60));
    const onlineTimer = document.getElementById('online-timer');
    const update = () => {
        const mins = Math.floor(onlineSeconds / 60);
        if (onlineTimer) onlineTimer.textContent = `for ${mins}m`;
    };
    update();
    if (onlineTimerInterval) clearInterval(onlineTimerInterval);
    onlineTimerInterval = setInterval(() => { onlineSeconds += 60; update(); }, 60000);
}

async function bootstrapProfile() {
    const user = await fetchProfile();
    if (!user) return;

    // Actual shape: user fields at root; nested institution, presence, stats
    const institution = user.institution || {};
    const presence = user.presence || {};
    const stats = user.stats || {};

    // Update current username for per-user storage
    if (user.username) {
        CURRENT_USERNAME = user.username;
    }

    // Header info
    const displayName = user.pseudoname || user.username || user.email || 'User';
    setText('profile-display-name', displayName);
    setText('profile-status-text', user.status || '');
    setAvatar('profile-avatar', user.avatarUrl || '', displayName);

    // Online status label and timer
    const statusLabel = document.getElementById('online-status-label');
    if (statusLabel) {
        statusLabel.textContent = presence.isOnline === false ? 'Offline' : 'Online';
        statusLabel.classList.toggle('text-green-600', presence.isOnline !== false);
        statusLabel.classList.toggle('text-gray-500', presence.isOnline === false);
    }
    initOnlineTimer(presence.onlineForMinutes || 0);

    // Settings inputs
    setInputValue('profile-name-input', user.pseudoname || '');
    setInputValue('profile-year-input', user.year || '');
    setInputValue('profile-username-input', user.username || '');
    const statusInput = document.getElementById('status-input');
    if (statusInput && user.status != null) statusInput.value = user.status;
    const thoughtInput = document.getElementById('thought-input');
    if (thoughtInput && user.todaysThought != null) thoughtInput.value = user.todaysThought;

    // Optional: map institution/stats once you add IDs to HTML
    // setText('institution-name', institution.name || '');
    // setText('stat-screenings', stats.screeningCount ?? 0);
}

// Per-user persisted data
let journalHistory = loadUserData('journal', {});
let moodHistory = loadUserData('mood', {}); // { 'YYYY-MM-DD': 'Happy' | 'Calm' | ... }
let goalsList = loadUserData('goals', [
    { text: 'Meditate 10 mins daily', completed: true },
    { text: 'Practice gratitude journaling', completed: false },
    { text: 'Go for a 30-min walk 3x a week', completed: true }
]);
let selectedJournalDate = new Date().toISOString().split('T')[0];

// Online timer is handled by initOnlineTimer() after presence fetch

document.querySelectorAll(".accordion-header").forEach(header => {
    header.addEventListener("click", () => {
        const content = header.nextElementSibling, chevron = header.querySelector('[data-lucide="chevron-right"]'), isOpen = content.style.maxHeight;
        document.querySelectorAll('.accordion-content').forEach(c => c.style.maxHeight = null);
        document.querySelectorAll('.accordion-header [data-lucide="chevron-right"]').forEach(i => i.classList.remove('chevron-rotate'));
        if (!isOpen) { content.style.maxHeight = content.scrollHeight + "px"; chevron.classList.add("chevron-rotate"); }
    });
});

const modals = {};
document.querySelectorAll('[id$="Modal"]').forEach(modal => modals[modal.id] = modal);
document.querySelectorAll('[data-modal]').forEach(trigger => trigger.addEventListener('click', () => openModal(trigger.dataset.modal)));
Object.values(modals).forEach(modal => {
    modal.addEventListener('click', (event) => { if (event.target === modal || event.target.closest('[data-action="close-modal"]')) closeModal(modal.id); });
});

function openModal(modalId) {
    const modal = modals[modalId];
    if (!modal) return;
    modal.classList.remove('hidden');
    setTimeout(() => modal.querySelector('.modal-content').classList.remove('opacity-0', '-translate-y-4'), 10);
}

function closeModal(modalId) {
    const modal = modals[modalId];
    if (!modal) return;
    modal.querySelector('.modal-content').classList.add('opacity-0', '-translate-y-4');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

document.getElementById('status-input').addEventListener('input', (e) => { document.getElementById('profile-status-text').textContent = e.target.value; });
document.getElementById('thought-input').addEventListener('input', (e) => {
    const value = e.target.value.trim();
    document.getElementById('thought-text').textContent = value ? `"${value}"` : '';
});

function renderCalendar(container) {
    const calendarGrid = container.querySelector('#calendar-grid'), controls = container.querySelector('#calendar-controls');
    let currentMonth = new Date(new Date(selectedJournalDate).getFullYear(), new Date(selectedJournalDate).getMonth(), 1);

    function draw() {
        calendarGrid.innerHTML = '';
        controls.innerHTML = `<button id="prev-month"><i data-lucide="chevron-left"></i></button><span class="font-semibold">${currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span><button id="next-month"><i data-lucide="chevron-right"></i></button>`;
        const dayHeaders = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => `<div class="calendar-header">${d}</div>`).join('');
        const firstDay = currentMonth.getDay(), daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
        let days = Array(firstDay).fill('<div class="empty"></div>').join('');
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            days += `<div class="calendar-day ${journalHistory[dateStr] ? 'has-entry' : ''}" data-date="${dateStr}">${i}</div>`;
        }
        calendarGrid.innerHTML = `<div id="calendar">${dayHeaders}${days}</div>`;

        // Highlight the selected day and update text fields
        calendarGrid.querySelectorAll('.calendar-day').forEach(day => {
            if (day.dataset.date === selectedJournalDate) {
                day.classList.add('selected');
            }
        });

        const entryForSelectedDate = journalHistory[selectedJournalDate] || '';
        container.querySelector('#journal-entry').value = entryForSelectedDate;
        container.querySelector('#history-display').textContent = entryForSelectedDate || 'No entry for this date.';

        const wordCount = container.querySelector('#word-count');
        const words = entryForSelectedDate.trim().split(/\s+/).filter(Boolean).length;
        wordCount.textContent = `${Math.min(words, 50)} / 50 words`;

        lucide.createIcons();
    }

    draw();
    controls.addEventListener('click', e => {
        const target = e.target.closest('button');
        if (!target) return;

        const newDate = new Date(currentMonth);
        if (target.id === 'prev-month') newDate.setMonth(newDate.getMonth() - 1);
        if (target.id === 'next-month') newDate.setMonth(newDate.getMonth() + 1);

        currentMonth = newDate;
        draw();
    });
    calendarGrid.addEventListener('click', e => {
        const day = e.target.closest('.calendar-day:not(.empty)');
        if (day && day.dataset.date) {
            selectedJournalDate = day.dataset.date;
            draw(); // Redraw to update selection and text fields
        }
    });
}

function setupJournalModal() {
    // refresh per-user state on open
    journalHistory = loadUserData('journal', journalHistory || {});
    const modalContent = modals.journalModal.querySelector('.modal-content');
    modalContent.innerHTML = `<div class="relative grid md:grid-cols-2 gap-8"><button data-action="close-modal" class="absolute -top-2 -right-2 p-2 rounded-full hover:bg-gray-200"><i data-lucide="x" class="w-6 h-6 text-gray-500"></i></button><div><h2 class="text-2xl font-bold">My Daily Journal</h2><p class="text-gray-500 mt-2 mb-4">Reflect on your day.</p><textarea id="journal-entry" maxlength="50" class="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-orange-400 transition" placeholder="Start writing here..."></textarea><div id="word-count" class="text-sm text-right text-gray-500 mt-1">0 / 50 words</div><div class="mt-4 text-right"><button id="save-journal" class="btn-primary font-semibold py-2 px-6 rounded-full">Save Entry</button></div></div><div><h3 class="text-xl font-bold mb-4">Past Entries</h3><div id="calendar-controls" class="flex justify-between items-center mb-2"></div><div id="calendar-grid"></div><div id="history-display" class="mt-4 p-3 bg-gray-100 rounded-lg min-h-[50px] text-gray-600">Select a date.</div></div></div>`;
    const textarea = modalContent.querySelector('#journal-entry'), wordCount = modalContent.querySelector('#word-count');
    textarea.addEventListener('input', () => wordCount.textContent = `${Math.min(textarea.value.trim().split(/\s+/).filter(Boolean).length, 50)} / 50 words`);

    modalContent.querySelector('#save-journal').addEventListener('click', () => {
        const entry = textarea.value.trim();
        if (entry) {
            journalHistory[selectedJournalDate] = entry;
        } else {
            delete journalHistory[selectedJournalDate];
        }
        saveUserData('journal', journalHistory);
        renderCalendar(modalContent);
        closeModal('journalModal');
    });
    renderCalendar(modalContent);
}

function setupMoodTrackerModal() {
    // refresh per-user state on open
    moodHistory = loadUserData('mood', moodHistory || {});
    const modalContent = modals.moodModal.querySelector('.modal-content');
    const moods = { 'Happy': 'smile', 'Calm': 'coffee', 'Sad': 'frown', 'Anxious': 'wind', 'Excited': 'party-popper' };
    let content = `<div class="relative"><button data-action="close-modal" class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200"><i data-lucide="x" class="w-6 h-6 text-gray-500"></i></button><h2 class="text-2xl font-bold mb-6">How have you felt?</h2><div class="space-y-4">`;
    for (let i = 0; i < 5; i++) {
        const date = new Date(); date.setDate(date.getDate() - i);
        const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
        const selectedMood = moodHistory[dateStr] || null;
        content += `<div class="flex justify-between items-center" data-date="${dateStr}"><span class="font-medium">${i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'long' })}</span><div class="flex space-x-2">`;
        Object.entries(moods).forEach(([mood, icon]) => {
            const isSelected = selectedMood === mood;
            content += `<button class="mood-btn p-2 rounded-full ${isSelected ? 'bg-orange-400' : 'bg-gray-200'} hover:bg-orange-300" data-mood="${mood}"><i data-lucide="${icon}" class="w-5 h-5 text-gray-700"></i></button>`;
        });
        content += `</div></div>`;
    }
    modalContent.innerHTML = content + '</div></div>';
    lucide.createIcons();
    modalContent.querySelectorAll('.mood-btn').forEach(btn => btn.addEventListener('click', (e) => {
        const row = btn.closest('[data-date]');
        const dateStr = row?.getAttribute('data-date');
        if (!dateStr) return;
        // Update UI
        row.querySelectorAll('.mood-btn').forEach(b => b.classList.replace('bg-orange-400', 'bg-gray-200'));
        btn.classList.replace('bg-gray-200', 'bg-orange-400');
        // Persist selection
        const mood = btn.getAttribute('data-mood');
        moodHistory[dateStr] = mood;
        saveUserData('mood', moodHistory);
    }));
}

function setupGoalsModal() {
    // refresh per-user state on open
    goalsList = loadUserData('goals', goalsList || []);
    const container = modals.goalsModal.querySelector('.modal-content');
    container.innerHTML = `<div class="relative"><button data-action="close-modal" class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200"><i data-lucide="x" class="w-6 h-6 text-gray-500"></i></button><h2 class="text-2xl font-bold mb-6">Your Wellness Goals</h2><div id="goals-list" class="space-y-3"></div><div class="mt-6 flex justify-between"><input type="text" id="new-goal-text" class="flex-1 mr-2 p-2 border rounded-md" placeholder="Add a new goal..."><button id="add-goal-btn" class="btn-primary font-semibold py-2 px-6 rounded-full">Add Goal</button></div></div>`;

    function renderGoals() {
        const listEl = container.querySelector('#goals-list');
        listEl.innerHTML = '';
        goalsList.forEach((g, idx) => {
            const row = document.createElement('div');
            row.className = 'flex items-center';
            row.innerHTML = `<input type="checkbox" data-idx="${idx}" class="goal-toggle h-5 w-5 rounded bg-gray-200 border-gray-300 text-orange-500 focus:ring-orange-400" ${g.completed ? 'checked' : ''}><span class="ml-3 text-gray-700 flex-1">${g.text}</span><button data-idx="${idx}" class="ml-2 text-sm text-red-500 hover:underline">Remove</button>`;
            listEl.appendChild(row);
        });
        // Bind handlers
        listEl.querySelectorAll('.goal-toggle').forEach(cb => cb.addEventListener('change', (e) => {
            const i = Number(cb.getAttribute('data-idx'));
            goalsList[i].completed = cb.checked;
            saveUserData('goals', goalsList);
        }));
        listEl.querySelectorAll('button.text-red-500').forEach(btn => btn.addEventListener('click', () => {
            const i = Number(btn.getAttribute('data-idx'));
            goalsList.splice(i, 1);
            saveUserData('goals', goalsList);
            renderGoals();
        }));
    }

    renderGoals();
    const addBtn = container.querySelector('#add-goal-btn');
    const input = container.querySelector('#new-goal-text');
    addBtn.addEventListener('click', () => {
        const text = (input.value || '').trim();
        if (!text) return;
        goalsList.push({ text, completed: false });
        input.value = '';
        saveUserData('goals', goalsList);
        renderGoals();
    });
}

function setupMyPlaceModal() {
    const modalContent = modals.myPlaceModal.querySelector('.modal-content');
    modalContent.innerHTML = `<div class="relative"><button data-action="close-modal" class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200"><i data-lucide="x" class="w-6 h-6 text-gray-500"></i></button><h2 class="text-2xl font-bold mb-4">My Place</h2><p class="text-gray-500 mb-6">Set an image that brings you peace.</p><div class="mb-4"><img id="my-place-image" src="https://placehold.co/600x400/fdfaf6/7a736d?text=Your+Peaceful+Place" alt="My Place Image" class="w-full h-auto max-h-80 object-contain rounded-lg"></div><div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"><input type="url" id="my-place-url" class="w-full p-2 border rounded-md" placeholder="Enter image URL..."><button id="save-my-place" class="btn-primary font-semibold py-2 px-6 rounded-md">Set Image</button></div></div>`;
    const saveBtn = modalContent.querySelector('#save-my-place'), urlInput = modalContent.querySelector('#my-place-url'), imageEl = modalContent.querySelector('#my-place-image');
    saveBtn.addEventListener('click', () => { if (urlInput.value.trim()) imageEl.src = urlInput.value.trim(); });
}

window.onload = () => {
    setupJournalModal();
    setupMoodTrackerModal();
    setupGoalsModal();
    setupMyPlaceModal();
    lucide.createIcons();
    // Fetch and render profile details
    bootstrapProfile();

    // Logout clears local storage and redirects to login modal
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            const API_BASE = computeApiBase();
            const prevText = logoutBtn.textContent;
            logoutBtn.disabled = true;
            logoutBtn.textContent = 'Logging out...';
            try {
                const res = await fetch(`${API_BASE}/users/logout`, {
                    method: 'POST',
                    credentials: 'include'
                });
                const data = await res.json().catch(() => ({}));
                if (res.ok && data?.success === true) {
                    try {
                        localStorage.removeItem('auth_user');
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('is_logged_in');
                        localStorage.removeItem('username');
                        localStorage.removeItem('email');
                        localStorage.removeItem('role');
                        localStorage.removeItem('user_id');
                        localStorage.removeItem('institution_id');
                    } catch (_) {}
                    window.location.href = 'frontPage.html?auth=login';
                } else {
                    const msg = data?.message || `Logout failed (HTTP ${res.status}).`;
                    alert(msg);
                    logoutBtn.disabled = false;
                    logoutBtn.textContent = prevText;
                }
            } catch (err) {
                console.error('Logout error:', err);
                alert('Network error while logging out. Please try again.');
                logoutBtn.disabled = false;
                logoutBtn.textContent = prevText;
            }
        });
    }
};
