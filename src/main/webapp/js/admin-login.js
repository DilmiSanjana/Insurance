// Configuration
const ADMIN_EMAIL = 'admin@admin.com';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_DASHBOARD_URL = '/admin-dashboard';

// Regex patterns for validation
const REGEX = {
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/
};

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const errorAlert = document.getElementById('errorAlert');
const errorMessage = document.getElementById('errorMessage');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const togglePassword = document.getElementById('togglePassword');
const eyeIcon = document.getElementById('eyeIcon');

// State management
let isLoading = false;

// Utility Functions
const showError = (message) => {
    errorMessage.textContent = message;
    errorAlert.classList.remove('hidden');
    errorAlert.classList.add('slide-in');

    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
};

const hideError = () => {
    errorAlert.classList.add('hidden');
};

const showFieldError = (element, message) => {
    element.textContent = message;
    element.classList.remove('hidden');
    element.previousElementSibling.classList.add('border-red-500');
};

const hideFieldError = (element) => {
    element.classList.add('hidden');
    element.previousElementSibling.classList.remove('border-red-500');
};

const setLoading = (loading) => {
    isLoading = loading;
    submitBtn.disabled = loading;

    if (loading) {
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
    } else {
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
    }
};

// Validation Functions
const validateEmail = (email) => {
    if (!email) {
        return { valid: false, message: 'Email is required' };
    }

    if (!REGEX.email.test(email)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }

    return { valid: true, message: '' };
};

const validatePassword = (password) => {
    if (!password) {
        return { valid: false, message: 'Password is required' };
    }

    if (password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters' };
    }

    if (!REGEX.password.test(password)) {
        return { valid: false, message: 'Password must contain letters and numbers' };
    }

    return { valid: true, message: '' };
};

const validateForm = (email, password) => {
    let isValid = true;

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
        showFieldError(emailError, emailValidation.message);
        isValid = false;
    } else {
        hideFieldError(emailError);
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        showFieldError(passwordError, passwordValidation.message);
        isValid = false;
    } else {
        hideFieldError(passwordError);
    }

    return isValid;
};

// Authentication Functions
const authenticateUser = (email, password) => {
    return new Promise((resolve, reject) => {
        // Simulate API call delay
        setTimeout(() => {
            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                resolve({ success: true, message: 'Login successful' });
            } else {
                reject({ success: false, message: 'Invalid email or password' });
            }
        }, 1500);
    });
};

const handleLogin = async (email, password) => {
    try {
        setLoading(true);
        hideError();

        const result = await authenticateUser(email, password);

        if (result.success) {
            // Store user session (in real app, use secure token)
            sessionStorage.setItem('isAuthenticated', 'true');
            sessionStorage.setItem('userEmail', email);

            // Show success state briefly
            btnText.textContent = 'Success!';
            btnLoader.classList.add('hidden');
            btnText.classList.remove('hidden');
            submitBtn.classList.add('bg-green-500');

            // Navigate to dashboard
            setTimeout(() => {
                window.location.href = ADMIN_DASHBOARD_URL;
            }, 500);
        }
    } catch (error) {
        setLoading(false);
        showError(error.message || 'An error occurred during login');

        // Shake animation for error
        loginForm.classList.add('animate-shake');
        setTimeout(() => {
            loginForm.classList.remove('animate-shake');
        }, 500);
    }
};

// Event Listeners
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (isLoading) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validate form
    if (!validateForm(email, password)) {
        return;
    }

    // Attempt login
    await handleLogin(email, password);
});

// Real-time validation on input
emailInput.addEventListener('blur', () => {
    const email = emailInput.value.trim();
    const validation = validateEmail(email);

    if (email && !validation.valid) {
        showFieldError(emailError, validation.message);
    } else {
        hideFieldError(emailError);
    }
});

passwordInput.addEventListener('blur', () => {
    const password = passwordInput.value;
    const validation = validatePassword(password);

    if (password && !validation.valid) {
        showFieldError(passwordError, validation.message);
    } else {
        hideFieldError(passwordError);
    }
});

// Clear errors on input
emailInput.addEventListener('input', () => {
    if (!emailError.classList.contains('hidden')) {
        hideFieldError(emailError);
    }
    hideError();
});

passwordInput.addEventListener('input', () => {
    if (!passwordError.classList.contains('hidden')) {
        hideFieldError(passwordError);
    }
    hideError();
});

// Toggle password visibility
togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;

    // Toggle eye icon
    if (type === 'text') {
        eyeIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
        `;
    } else {
        eyeIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        `;
    }
});

// Prevent multiple form submissions
loginForm.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && isLoading) {
        e.preventDefault();
    }
});

// Add shake animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .animate-shake {
        animation: shake 0.5s ease-in-out;
    }
`;
document.head.appendChild(style);

// Initialize - Check if already logged in
if (sessionStorage.getItem('isAuthenticated') === 'true') {
    window.location.href = ADMIN_DASHBOARD_URL;
}