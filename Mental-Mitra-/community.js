
// --- STATE MANAGEMENT ---
const getUsername = () => localStorage.getItem('username') || localStorage.getItem('email') || 'guest';
const keyFor = (k) => `${k}:${getUsername()}`;
const load = (k, fallback) => { try { const v = localStorage.getItem(keyFor(k)); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
const save = (k, v) => { try { localStorage.setItem(keyFor(k), JSON.stringify(v)); } catch {} };

let state = {
    currentPage: 'feed', // 'feed', 'following', 'discover'
    currentFilter: { type: 'all', value: null }, // type: 'all', 'channel', 'profile'
    currentUser: {
        id: `user_${getUsername()}`,
        name: getUsername(),
        avatar: 'https://placehold.co/40x40/2c251d/fdfaf6?text=ME'
    },
    channels: load('community_channels', [
        { name: 'Student Support', subscribed: true, notifications: true, permanent: true },
        { name: 'Study Group', subscribed: true, notifications: true, permanent: true },
        { name: 'Wellness', subscribed: true, notifications: true, permanent: false },
    ]),
    discoverableClubs: load('community_discover', [
        { name: 'Peer Support', icon: 'users' },
        { name: 'Study Buddies', icon: 'book-open' },
        { name: 'Mindfulness', icon: 'sun' },
        { name: 'Career Prep', icon: 'briefcase' },
        { name: 'Fitness', icon: 'activity' },
        { name: 'Creative Circle', icon: 'palette' },
    ]),
    people: load('community_people', [
        { id: 'peer_supporter', name: 'Student Ally', avatar: 'https://placehold.co/40x40/34d399/000?text=SA', following: true },
        { id: 'study_buddy', name: 'Study Buddy', avatar: 'https://placehold.co/40x40/60a5fa/000?text=SB', following: false },
        { id: 'wellness_pal', name: 'Wellness Pal', avatar: 'https://placehold.co/40x40/fbbf24/000?text=WP', following: false },
    ]),
    posts: load('community_posts', [
        { id: 1, author: { name: 'Student Ally', avatar: 'https://placehold.co/40x40/34d399/ffffff?text=SA' }, channel: 'Student Support', content: "It's okay to ask for help. Share one win from today, no matter how small. 💛", timestamp: new Date(Date.now() - 60000 * 15), userId: 'peer_supporter' },
        { id: 2, author: { name: 'Study Buddy', avatar: 'https://placehold.co/40x40/60a5fa/ffffff?text=SB' }, channel: 'Study Group', content: 'Anyone up for a 25-min Pomodoro at 7 PM? I can host a meet link.', timestamp: new Date(Date.now() - 60000 * 35), userId: 'study_buddy' },
        { id: 3, author: { name: 'Wellness Pal', avatar: 'https://placehold.co/40x40/fbbf24/ffffff?text=WP' }, channel: 'Wellness', content: 'Tried a 5-minute breathing exercise — feeling calmer. Happy to share the steps if anyone wants. 🌿', timestamp: new Date(Date.now() - 60000 * 60 * 3), userId: 'wellness_pal' },
        { id: 4, author: { name: getUsername(), avatar: 'https://placehold.co/40x40/2c251d/fdfaf6?text=ME' }, channel: 'Student Support', content: 'Grateful for this community. What helps you reset after a tough day?', timestamp: new Date(Date.now() - 60000 * 60 * 5), userId: `user_${getUsername()}` }
    ]),
};

// --- DOM ELEMENTS ---
const dom = {
    sidebarLinks: document.querySelectorAll('.sidebar-link'),
    mainContent: document.querySelector('.main-content'),
    pages: {
        feed: document.getElementById('page-feed'),
        following: document.getElementById('page-following'),
        discover: document.getElementById('page-discover')
    },
    feedContainer: document.getElementById('feed-container'),
    feedTitle: document.getElementById('feed-title'),
    postInput: document.getElementById('post-input'),
    channelSelect: document.getElementById('channel-select'),
    postButton: document.getElementById('post-button'),
    channelsList: document.getElementById('channels-list'),
    profileLink: document.getElementById('profile-link'),
    followingContainer: document.getElementById('following-container'),
    discoverContainer: document.getElementById('discover-container'),
    attachmentBtn: document.getElementById('attachment-btn'),
    attachmentModal: document.getElementById('attachment-modal'),
    closeModalBtn: document.getElementById('close-modal-btn')
};

// --- RENDER FUNCTIONS ---
function renderAll() {
    renderChannelsList();
    renderPage();
    renderPosts();
    updateActiveSidebar();
    lucide.createIcons();
    // Update avatars in HTML to match current user initials
    const initials = (state.currentUser.name || 'ME').slice(0,2).toUpperCase();
    const composerAvatar = document.getElementById('composer-avatar');
    if (composerAvatar) composerAvatar.src = `https://placehold.co/40x40/2c251d/fdfaf6?text=${encodeURIComponent(initials)}`;
    const sidebarAvatar = document.getElementById('sidebar-profile-avatar');
    if (sidebarAvatar) sidebarAvatar.src = `https://placehold.co/40x40/2c251d/fdfaf6?text=${encodeURIComponent(initials)}`;
}

function renderPage() {
    Object.values(dom.pages).forEach(page => page.classList.add('hidden'));
    if (dom.pages[state.currentPage]) {
        dom.pages[state.currentPage].classList.remove('hidden');
    }
    if (state.currentPage === 'following') renderFollowingPage();
    if (state.currentPage === 'discover') renderDiscoverPage();
}

function updateActiveSidebar() {
    document.querySelectorAll('.sidebar-link, .channel-link, #profile-link').forEach(link => {
        link.style.backgroundColor = '';
        link.classList.remove('text-white', 'font-semibold');
        link.classList.add('text-gray-800');
    });

    if (state.currentFilter.type === 'profile') {
        const profileLink = document.getElementById('profile-link');
        if (profileLink) {
            profileLink.style.backgroundColor = 'var(--accent-orange)';
            profileLink.classList.add('text-white', 'font-semibold');
        }
    } else if (state.currentFilter.type === 'channel') {
        const activeChannelLink = document.querySelector(`.channel-link[data-channel="${state.currentFilter.value}"]`);
        if (activeChannelLink) {
            activeChannelLink.style.backgroundColor = 'var(--accent-orange)';
            activeChannelLink.classList.add('text-white', 'font-semibold');
        }
    } else { // 'all'
        const activePageLink = document.querySelector(`.sidebar-link[data-page="${state.currentPage}"]`);
        if (activePageLink) {
            activePageLink.style.backgroundColor = 'var(--accent-orange)';
            activePageLink.classList.add('text-white', 'font-semibold');
        }
    }
}

function renderChannelsList() {
    dom.channelsList.innerHTML = '';
    state.channels.filter(c => c.subscribed).forEach(channel => {
        const channelDiv = document.createElement('div');
        channelDiv.className = 'group relative flex items-center justify-between';

    let icon = 'hash';
    if (channel.name === 'Study Group') icon = 'graduation-cap';
    if (channel.name === 'Student Support') icon = 'users';
    if (channel.name === 'Wellness') icon = 'heart';

        channelDiv.innerHTML = `
            <a href="#" data-channel="${channel.name}" class="channel-link flex-grow flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors duration-200">
                <i data-lucide="${icon}" class="w-5 h-5"></i> ${channel.name}
            </a>
            ${!channel.permanent ? `
            <button class="club-options-btn absolute right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-200" data-channel="${channel.name}">
                <i data-lucide="more-vertical" class="w-4 h-4"></i>
            </button>
            <div class="popover w-48 bg-white border border-[var(--border-color)] rounded-lg shadow-xl" id="popover-${channel.name.replace(/\s+/g, '-')}">
                <ul class="py-1">
                    <li><a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100" data-action="toggle-notification" data-channel="${channel.name}">Turn off notifications</a></li>
                    <li><a href="#" class="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100" data-action="exit-club" data-channel="${channel.name}">Exit the club</a></li>
                </ul>
            </div>
            ` : ''}
        `;
        dom.channelsList.appendChild(channelDiv);
    });

    // Populate dropdown
    dom.channelSelect.innerHTML = state.channels.filter(c => c.subscribed).map(c => `<option value="${c.name}">${c.name}</option>`).join('');
}

function renderPosts() {
    if (state.currentPage !== 'feed') return;

    let filteredPosts = [];
    const subscribedChannels = state.channels.filter(c => c.subscribed).map(c => c.name);

    if (state.currentFilter.type === 'all') {
        filteredPosts = state.posts.filter(post => subscribedChannels.includes(post.channel));
        dom.feedTitle.textContent = 'All Activity';
    } else if (state.currentFilter.type === 'channel') {
        filteredPosts = state.posts.filter(post => post.channel === state.currentFilter.value);
        dom.feedTitle.textContent = `${state.currentFilter.value} Feed`;
    } else if (state.currentFilter.type === 'profile') {
        filteredPosts = state.posts.filter(post => post.userId === state.currentUser.id);
        dom.feedTitle.textContent = 'My Posts';
    }

    filteredPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    dom.feedContainer.innerHTML = '';

    if (filteredPosts.length === 0) {
        dom.feedContainer.innerHTML = `<div class="text-center text-gray-400 py-10"><i data-lucide="message-square-off" class="mx-auto h-12 w-12"></i><p class="mt-4">No posts found.</p></div>`;
        lucide.createIcons();
        return;
    }

    filteredPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'bg-white border border-[var(--border-color)] p-4 rounded-lg shadow-sm';
        postElement.innerHTML = `
            <div class="flex items-start gap-4">
                <img src="${post.author.avatar}" alt="${post.author.name}" class="w-10 h-10 rounded-full">
                <div class="flex-1">
                    <div class="flex items-baseline gap-2 flex-wrap">
                        <span class="font-bold font-serif">${post.author.name}</span>
                        <span class="text-xs text-gray-500">• ${timeSince(new Date(post.timestamp))}</span>
                        <span class="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">${post.channel}</span>
                    </div>
                    <p class="mt-2 text-gray-700 whitespace-pre-wrap">${post.content}</p>
                    ${post.image ? `<img src="${post.image}" alt="Post image" class="mt-4 rounded-lg border border-[var(--border-color)] max-w-full h-auto">` : ''}
                </div>
            </div>
        `;
        dom.feedContainer.appendChild(postElement);
    });
}

function renderFollowingPage() {
    dom.followingContainer.innerHTML = '';
    state.people.forEach(person => {
        const personEl = document.createElement('div');
        personEl.className = 'flex items-center justify-between bg-white border border-[var(--border-color)] p-4 rounded-lg';
        personEl.innerHTML = `
            <div class="flex items-center gap-4">
                <img src="${person.avatar}" alt="${person.name}" class="w-12 h-12 rounded-full">
                <div>
                    <h3 class="font-semibold font-serif">${person.name}</h3>
                    <p class="text-sm text-gray-500">@${person.name.toLowerCase().replace(' ', '')}</p>
                </div>
            </div>
            <button class="follow-btn ${person.following ? 'bg-gray-200 text-gray-800' : 'btn-dark'} font-semibold px-4 py-1.5 rounded-full text-sm transition-colors" data-userid="${person.id}">
                ${person.following ? 'Following' : 'Follow'}
            </button>
        `;
        dom.followingContainer.appendChild(personEl);
    });
}

function renderDiscoverPage() {
    dom.discoverContainer.innerHTML = '';
    state.discoverableClubs.forEach(club => {
        const clubEl = document.createElement('div');
        clubEl.className = 'bg-white border border-[var(--border-color)] p-4 rounded-lg flex flex-col items-center justify-center text-center';
        clubEl.innerHTML = `
            <i data-lucide="${club.icon || 'hash'}" class="w-10 h-10 mb-3 text-gray-400"></i>
            <h3 class="font-bold text-lg font-serif">${club.name}</h3>
            <p class="text-sm text-gray-500 mb-4">Join the conversation</p>
            <button class="join-club-btn w-full btn-dark font-semibold px-4 py-2 rounded-lg text-sm transition-colors" data-clubname="${club.name}">
                Join Club
            </button>
        `;
        dom.discoverContainer.appendChild(clubEl);
    });
    lucide.createIcons();
}

// --- EVENT HANDLERS ---
function handleSidebarNav(e) {
    const target = e.target.closest('.sidebar-link, .channel-link, #profile-link, #header-profile-btn');
    if (!target) return;

    // Route to profile page for profile links
    if (target.matches('#profile-link') || target.matches('#header-profile-btn')) {
        e.preventDefault();
        window.location.href = 'profile.html';
        return;
    }

    // Internal nav: prevent default and switch views
    e.preventDefault();
    if (target.matches('.sidebar-link')) {
        state.currentPage = target.dataset.page;
        state.currentFilter = { type: 'all', value: null };
    } else if (target.matches('.channel-link')) {
        state.currentPage = 'feed';
        state.currentFilter = { type: 'channel', value: target.dataset.channel };
    }
    renderAll();
}

function handlePost() {
    const content = dom.postInput.value.trim();
    const channel = dom.channelSelect.value;
    if (!content) return;

    const newPost = {
        id: Date.now(),
        author: state.currentUser,
        channel: channel,
        content: content,
        timestamp: new Date().toISOString(),
        userId: state.currentUser.id
    };
    state.posts.unshift(newPost);
    dom.postInput.value = '';
    state.currentPage = 'feed';
    state.currentFilter = { type: 'channel', value: channel };
    save('community_posts', state.posts);
    renderAll();
}

function handleFollowToggle(e) {
    if (!e.target.matches('.follow-btn')) return;
    const userId = e.target.dataset.userid;
    const person = state.people.find(p => p.id === userId);
    if (person) {
        person.following = !person.following;
        save('community_people', state.people);
        renderFollowingPage();
    }
}

function handleJoinClub(e) {
    if (!e.target.matches('.join-club-btn')) return;
    const clubName = e.target.dataset.clubname;
    const clubIndex = state.discoverableClubs.findIndex(c => c.name === clubName);
    if (clubIndex > -1) {
        const [clubToJoin] = state.discoverableClubs.splice(clubIndex, 1);
        state.channels.push({
            name: clubToJoin.name,
            subscribed: true,
            notifications: true,
            permanent: false
        });
        save('community_channels', state.channels);
        save('community_discover', state.discoverableClubs);
        renderAll();
    }
}

function handleClubOptions(e) {
    const button = e.target.closest('.club-options-btn');
    if (button) {
        e.stopPropagation();
        const channelName = button.dataset.channel;
        const popover = document.getElementById(`popover-${channelName.replace(/\s+/g, '-')}`);
        document.querySelectorAll('.popover').forEach(p => {
            if (p !== popover) p.classList.remove('show');
        });
        popover.classList.toggle('show');
    }

    const actionLink = e.target.closest('a[data-action]');
    if (actionLink) {
        e.preventDefault();
        e.stopPropagation();
        const action = actionLink.dataset.action;
        const channelName = actionLink.dataset.channel;
        const channel = state.channels.find(c => c.name === channelName);

        if (action === 'exit-club') {
            if (channel) {
                const clubIndex = state.channels.findIndex(c => c.name === channelName);
                const [exitedClub] = state.channels.splice(clubIndex, 1);
                state.discoverableClubs.push({ name: exitedClub.name, icon: 'hash' });
                if (state.currentFilter.type === 'channel' && state.currentFilter.value === channelName) {
                    state.currentFilter = { type: 'all', value: null };
                }
                save('community_channels', state.channels);
                save('community_discover', state.discoverableClubs);
                renderAll();
            }
        }
        document.querySelectorAll('.popover').forEach(p => p.classList.remove('show'));
    }
}

// --- UTILITY ---
function timeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
}

// --- EVENT LISTENERS ---
document.addEventListener('click', (e) => {
    const sidebar = e.target.closest('aside');
    const headerProfileBtn = e.target.closest('#header-profile-btn');

    if (sidebar) {
        handleSidebarNav(e);
    }
    if (headerProfileBtn) {
        handleSidebarNav(e);
        e.preventDefault(); // Only prevent default for profile button
    }
});
dom.postButton.addEventListener('click', handlePost);
dom.followingContainer.addEventListener('click', handleFollowToggle);
dom.discoverContainer.addEventListener('click', handleJoinClub);
dom.channelsList.addEventListener('click', handleClubOptions);

// Modal listeners
dom.attachmentBtn.addEventListener('click', () => dom.attachmentModal.classList.remove('hidden'));
dom.closeModalBtn.addEventListener('click', () => dom.attachmentModal.classList.add('hidden'));
dom.attachmentModal.addEventListener('click', (e) => {
    if (e.target === dom.attachmentModal || e.target.closest('.modal-option')) {
        dom.attachmentModal.classList.add('hidden');
    }
});
window.addEventListener('click', (e) => {
    if (!e.target.closest('.club-options-btn')) {
        document.querySelectorAll('.popover').forEach(p => p.classList.remove('show'));
    }
});

// --- INITIAL RENDER ---
document.addEventListener('DOMContentLoaded', renderAll);
