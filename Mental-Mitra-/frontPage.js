
document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const authModal = document.getElementById('auth-modal');
    const showLoginBtn = document.querySelector('#header-signin-btn');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');

    // Header auth toggles
    const headerSignInBtn = document.getElementById('header-signin-btn');
    const headerProfileLink = document.getElementById('header-profile-link');
    const headerProfileName = document.getElementById('header-profile-name');
    const headerProfileAvatar = document.getElementById('header-profile-avatar');

    const getStoredUser = () => { try { return JSON.parse(localStorage.getItem('auth_user')) || null; } catch { return null; } };
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
        if (parts.length === 1) initials = parts[0].slice(0, 2); else initials = (parts[0][0] || '') + (parts[1][0] || '');
        return initials.toUpperCase();
    };

    const applyHeaderAuthState = () => {
        const isLoggedIn = localStorage.getItem('is_logged_in') === 'true';
        if (isLoggedIn) {
            if (headerSignInBtn) headerSignInBtn.style.display = 'none';
            if (headerProfileLink) headerProfileLink.style.display = 'inline-flex';
            const initials = getInitials(getBestName());
            if (headerProfileName) headerProfileName.style.display = 'none'; // initials only
            if (headerProfileAvatar) {
                headerProfileAvatar.alt = initials;
                headerProfileAvatar.src = `https://placehold.co/28x28/2c251d/fdfaf6?text=${encodeURIComponent(initials)}`;
            }
        } else {
            if (headerSignInBtn) headerSignInBtn.style.display = '';
            if (headerProfileLink) headerProfileLink.style.display = 'none';
        }
    };
    applyHeaderAuthState();

    // Show the modal when "SIGN-IN" is clicked (only if not logged in)
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (localStorage.getItem('is_logged_in') === 'true') return;
            authModal.classList.add('active');
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
        });
    }

    // Hide the modal when clicking on the overlay background
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.remove('active');
        }
    });

    // Switch to Sign Up form with animation
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('exiting');
        setTimeout(() => {
            loginForm.style.display = 'none';
            loginForm.classList.remove('exiting');
            signupForm.style.display = 'block';
        }, 300); // Duration should match CSS transition
    });

    // Switch back to Login form with animation
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.classList.add('exiting');
        setTimeout(() => {
            signupForm.style.display = 'none';
            signupForm.classList.remove('exiting');
            loginForm.style.display = 'block';
        }, 300); // Duration should match CSS transition
    });

    // ===== Signup submit -> Register user -> Redirect to verify-otp =====
    // Build API base using current hostname to avoid localhost vs 127.0.0.1 mismatches
    let API_BASE = 'http://localhost:8000/api/v1';
    try {
        if (window.location.protocol.startsWith('http')) {
            const host = window.location.hostname || 'localhost';
            API_BASE = `${window.location.protocol}//${host}:8000/api/v1`;
        }
    } catch (_) { /* fallback stays localhost */ }
    const signupFormEl = signupForm ? signupForm.querySelector('form') : null;
    if (signupFormEl) {
        signupFormEl.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const username = document.getElementById('signup-username')?.value?.trim();
                const email = document.getElementById('signup-email')?.value?.trim();
                const password = document.getElementById('signup-password')?.value;
                const institutionId = document.getElementById('signup-institute')?.value;

                if (!username || !email || !password || !institutionId) {
                    alert('Please fill all required fields.');
                    return;
                }

                const registerBtn = signupFormEl.querySelector('.auth-btn');
                if (registerBtn) {
                    registerBtn.disabled = true;
                    registerBtn.textContent = 'Creating account...';
                }

                const res = await fetch(`${API_BASE}/users/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ username, email, password, institutionId })
                });
                const data = await res.json().catch(() => ({}));

                if (!res.ok || data.success === false) {
                    const msg = data?.message || `Registration failed (HTTP ${res.status}).`;
                    alert(msg);
                } else {
                    // Expecting { success: true, data: { email } }
                    const returnedEmail = data?.data?.email || email;
                    // Keep email also in sessionStorage as a fallback
                    sessionStorage.setItem('verify_email', returnedEmail);
                    window.location.href = `verify-otp.html?email=${encodeURIComponent(returnedEmail)}`;
                }
            } catch (err) {
                console.error('Signup error:', err);
                alert('Something went wrong while creating your account. Please try again.');
            } finally {
                const registerBtn = signupFormEl.querySelector('.auth-btn');
                if (registerBtn) {
                    registerBtn.disabled = false;
                    registerBtn.textContent = 'Sign Up';
                }
            }
        });
    }

    // ===== Login submit -> Authenticate -> Redirect to profile =====
    const loginFormEl = loginForm ? loginForm.querySelector('form') : null;
    if (loginFormEl) {
        loginFormEl.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const email = document.getElementById('login-email')?.value?.trim();
                const password = document.getElementById('login-password')?.value;
                if (!email || !password) {
                    alert('Please enter your email and password.');
                    return;
                }

                const btn = loginFormEl.querySelector('.auth-btn');
                if (btn) { btn.disabled = true; btn.textContent = 'Logging in...'; }

                const res = await fetch(`${API_BASE}/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json().catch(() => ({}));

                if (!res.ok || data.success === false) {
                    const msg = data?.message || `Login failed (HTTP ${res.status}).`;
                    alert(msg);
                    return;
                }

                const user = data?.data?.user || null;
                const accessToken = data?.data?.accessToken || null;
                if (user) {
                    localStorage.setItem('auth_user', JSON.stringify(user));
                    if (user.username) localStorage.setItem('username', user.username);
                    if (user.email) localStorage.setItem('email', user.email);
                    if (user.role) localStorage.setItem('role', user.role);
                    if (user._id) localStorage.setItem('user_id', user._id);
                    if (user.institutionId) localStorage.setItem('institution_id', user.institutionId);
                } else {
                    // Fallback store basic email
                    localStorage.setItem('email', email);
                }
                if (accessToken) localStorage.setItem('access_token', accessToken);
                localStorage.setItem('is_logged_in', 'true');

                // Redirect to profile page
                window.location.href = 'profile.html';
            } catch (err) {
                console.error('Login error:', err);
                alert(`Something went wrong while logging in. ${err?.message || ''}`.trim());
            } finally {
                const btn = loginFormEl.querySelector('.auth-btn');
                if (btn) { btn.disabled = false; btn.textContent = 'Login'; }
            }
        });
    }

    // If redirected with auth=login, open modal on login view and prefill email
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'login' && localStorage.getItem('is_logged_in') !== 'true') {
        authModal.classList.add('active');
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        const emailPrefill = params.get('email') || sessionStorage.getItem('verify_email');
        if (emailPrefill) {
            const emailInput = document.getElementById('login-email');
            if (emailInput) emailInput.value = emailPrefill;
        }
        // Clean query params to avoid reopening on refresh
        if (history.replaceState) {
            const cleanUrl = window.location.pathname;
            history.replaceState({}, document.title, cleanUrl);
        }
    }
});

// ...existing code...
// ...existing code...
document.addEventListener("DOMContentLoaded", function () {
    const playButton = document.querySelector('.play-button');
    const audio = document.getElementById('background-audio');
    const bars = document.querySelectorAll('.sound-bars span');
    let isPlaying = false;
    let animationId;

    function animateBars() {
        bars.forEach((bar, i) => {
            // Move bars slowly: use sine wave for smooth slow animation
            const now = Date.now();
            const base = 30 + Math.abs(Math.sin((now / 1000) + i)) * 50;
            bar.style.height = base + '%';
        });
        animationId = requestAnimationFrame(animateBars);
    }

    playButton.addEventListener('click', function () {
        if (!isPlaying) {
            audio.play();
            isPlaying = true;
            playButton.innerHTML = '&#10073;&#10073;'; // Pause icon
            animateBars();
        } else {
            audio.pause();
            isPlaying = false;
            playButton.innerHTML = '&#9658;'; // Play icon
            cancelAnimationFrame(animationId);
            bars.forEach((bar) => {
                bar.style.height = '';
            });
        }
    });

    audio.addEventListener('ended', function () {
        isPlaying = false;
        playButton.innerHTML = '&#9658;';
        cancelAnimationFrame(animationId);
        bars.forEach((bar) => {
            bar.style.height = '';
        });
    });

});
// ...existing code...