
window.addEventListener('load', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Per-user storage helpers
    const getUsername = () => localStorage.getItem('username') || localStorage.getItem('email') || 'guest';
    const keyFor = (k) => `${k}:${getUsername()}`;
    const load = (k, fallback) => { try { const v = localStorage.getItem(keyFor(k)); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
    const save = (k, v) => { try { localStorage.setItem(keyFor(k), JSON.stringify(v)); } catch {} };

    // Header initials avatar
    const computeInitials = () => {
        const authUserRaw = localStorage.getItem('auth_user');
        let name = '';
        if (authUserRaw) {
            try {
                const obj = JSON.parse(authUserRaw);
                name = obj?.name || obj?.fullName || obj?.username || obj?.email || '';
            } catch {}
        }
        if (!name) name = localStorage.getItem('username') || localStorage.getItem('email') || 'User';
        const parts = String(name).trim().split(/\s+/);
        let initials = '';
        if (parts.length === 1) {
            const p = parts[0];
            if (p.includes('@')) initials = p[0];
            else initials = p.slice(0, 2);
        } else {
            initials = (parts[0][0] || '') + (parts[1][0] || '');
        }
        return initials.toUpperCase();
    };
    const avatarEl = document.getElementById('header-profile-avatar');
    if (avatarEl) avatarEl.textContent = computeInitials();

    const app = {
        moodData: load('dashboard_mood', {}),
        calendarDate: new Date(),
        selectedDateKey: new Date().toISOString().split('T')[0],

        init() {
            this.cacheDOMElements();
            this.addEventListeners();
            this.renderMoodCalendar();
            this.updateMoodScore();
        },
        cacheDOMElements() {
            this.dom = {
                modals: document.querySelectorAll('.modal-overlay'),
                closeModalBtns: document.querySelectorAll('.close-modal-btn'),
                exploreModal: document.getElementById('explore-modal'),
                exploreMoreBtn: document.getElementById('explore-more-btn'),
                trackMoodBtn: document.getElementById('track-mood-btn'),
                moodTrackerModal: document.getElementById('mood-tracker-modal'),
                moodCalendar: document.getElementById('mood-calendar'),
                moodOptions: document.querySelectorAll('.mood-option'),
                moodMonthYear: document.getElementById('mood-month-year'),
                moodPrevMonthBtn: document.getElementById('mood-prev-month'),
                moodNextMonthBtn: document.getElementById('mood-next-month'),
                anxietyReliefBtns: document.querySelectorAll('.anxiety-relief-btn'),
                comingSoonPopover: document.getElementById('coming-soon-popover'),
                moodScoreDisplay: document.getElementById('mood-score-display'),
            };
        },
        addEventListeners() {
            this.dom.exploreMoreBtn.addEventListener('click', () => this.toggleModal(this.dom.exploreModal, true));
            this.dom.trackMoodBtn.addEventListener('click', () => {
                this.calendarDate = new Date();
                this.selectedDateKey = new Date().toISOString().split('T')[0];
                this.renderMoodCalendar();
                this.toggleModal(this.dom.moodTrackerModal, true)
            });
            this.dom.closeModalBtns.forEach(btn => btn.addEventListener('click', () => this.closeAllModals()));
            this.dom.modals.forEach(modal => modal.addEventListener('click', (e) => { if (e.target === modal) this.closeAllModals(); }));
            this.dom.moodOptions.forEach(btn => btn.addEventListener('click', (e) => this.selectMood(e.currentTarget.dataset.mood)));
            this.dom.anxietyReliefBtns.forEach(btn => btn.addEventListener('click', () => this.showComingSoon()));
            this.dom.moodPrevMonthBtn.addEventListener('click', () => this.changeMoodMonth(-1));
            this.dom.moodNextMonthBtn.addEventListener('click', () => this.changeMoodMonth(1));
        },
        toggleModal(modal, show) {
            modal.classList.toggle('hidden', !show);
            modal.classList.toggle('flex', show);
            if (show && typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        },
        closeAllModals() {
            this.dom.modals.forEach(modal => this.toggleModal(modal, false));
        },
        changeMoodMonth(direction) {
            this.calendarDate.setMonth(this.calendarDate.getMonth() + direction);
            this.renderMoodCalendar();
        },
        renderMoodCalendar() {
            this.dom.moodMonthYear.textContent = this.calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            this.dom.moodCalendar.innerHTML = '';
            const year = this.calendarDate.getFullYear();
            const month = this.calendarDate.getMonth();
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let i = 0; i < firstDay; i++) {
                this.dom.moodCalendar.appendChild(document.createElement('div'));
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const dayEl = document.createElement('button');
                const date = new Date(year, month, day);
                const dateKey = date.toISOString().split('T')[0];
                dayEl.className = 'h-10 w-10 flex items-center justify-center text-sm rounded-full hover:bg-gray-100';
                dayEl.textContent = this.moodData[dateKey] ? this.moodData[dateKey] : day;
                if (this.moodData[dateKey]) dayEl.classList.add('text-2xl');

                if (dateKey === this.selectedDateKey) {
                    dayEl.classList.add('day-selected');
                }

                dayEl.addEventListener('click', () => {
                    this.selectedDateKey = dateKey;
                    this.renderMoodCalendar();
                });
                this.dom.moodCalendar.appendChild(dayEl);
            }
        },
        selectMood(mood) {
            if (!this.selectedDateKey) return;
            this.moodData[this.selectedDateKey] = mood;
            save('dashboard_mood', this.moodData);
            this.renderMoodCalendar();
            this.updateMoodScore();
        },
        updateMoodScore() {
            let moodsInLast7Days = [];
            const today = new Date();
            for (let i = 0; i < 7; i++) {
                const day = new Date(today);
                day.setDate(today.getDate() - i);
                const dayKey = day.toISOString().split('T')[0];
                if (this.moodData[dayKey]) {
                    moodsInLast7Days.push(this.moodData[dayKey]);
                }
            }

            if (moodsInLast7Days.length > 0) {
                const moodCounts = moodsInLast7Days.reduce((acc, mood) => {
                    acc[mood] = (acc[mood] || 0) + 1;
                    return acc;
                }, {});
                const mostFrequentMood = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b);
                this.dom.moodScoreDisplay.textContent = mostFrequentMood;
            } else {
                this.dom.moodScoreDisplay.textContent = '?';
            }
        },
        showComingSoon() {
            const popover = this.dom.comingSoonPopover;
            popover.classList.remove('hidden');
            setTimeout(() => popover.classList.add('hidden'), 2000);
        }
    };
    app.init();
});


// Persist Wellness Tasks completion per user
(function persistTasks() {
    const getTaskState = () => load('dashboard_tasks', {});
    const setTaskState = (s) => save('dashboard_tasks', s);
    const state = getTaskState();
    document.querySelectorAll('section ul input[type="checkbox"]').forEach(checkbox => {
        const id = checkbox.id || `task_${Math.random().toString(36).slice(2)}`;
        if (!checkbox.id) checkbox.id = id;
        // restore
        if (state[id]) checkbox.checked = true;
        const label = checkbox.nextElementSibling;
        const textEl = label?.querySelector('.task-text') || label;
        if (checkbox.checked) {
            textEl.classList.add('line-through', 'text-gray-400');
            textEl.classList.remove('text-gray-800', 'font-normal');
        }
        checkbox.addEventListener('change', function() {
            const label = this.nextElementSibling;
            const textEl = label?.querySelector('.task-text') || label;
            if (this.checked) {
                textEl.classList.add('line-through', 'text-gray-400');
                textEl.classList.remove('text-gray-800', 'font-normal');
                state[id] = true;
            } else {
                textEl.classList.remove('line-through', 'text-gray-400');
                textEl.classList.add('text-gray-800', 'font-normal');
                delete state[id];
            }
            setTaskState(state);
        });
    });
})();
