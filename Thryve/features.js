
document.addEventListener('DOMContentLoaded', () => {
    const authModal = document.getElementById('auth-modal');
    const showLoginBtn = document.querySelector('.btn-get-started');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');

    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        authModal.classList.add('active');
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    });

    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.remove('active');
        }
    });

    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('exiting');
        setTimeout(() => {
            loginForm.style.display = 'none';
            loginForm.classList.remove('exiting');
            signupForm.style.display = 'block';
        }, 300);
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.classList.add('exiting');
        setTimeout(() => {
            signupForm.style.display = 'none';
            signupForm.classList.remove('exiting');
            loginForm.style.display = 'block';
        }, 300);
    });
});
