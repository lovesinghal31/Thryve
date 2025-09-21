
document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const authModal = document.getElementById('auth-modal');
    const showLoginBtn = document.querySelector('.btn-get-started');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');

    // Show the modal when "SIGN-IN" is clicked
    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        authModal.classList.add('active');
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    });

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
});
