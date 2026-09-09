document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('doctorLoginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnText = document.getElementById('loginBtnText');
    const loginSpinner = document.getElementById('loginSpinner');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const successMessage = document.getElementById('successMessage');
    const successText = document.getElementById('successText');

    // Password toggle functionality
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = togglePasswordBtn.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Clear previous errors
        clearFormErrors();
        
        // Email validation
        const email = emailInput.value.trim();
        if (!email) {
            showFieldError('email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Password validation
        const password = passwordInput.value;
        if (!password) {
            showFieldError('password', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showFieldError('password', 'Password must be at least 6 characters');
            isValid = false;
        }
        
        return isValid;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFieldError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        
        const inputElement = document.getElementById(fieldId);
        inputElement.classList.add('border-red-500');
        inputElement.classList.remove('border-gray-300');
    }

    function clearFormErrors() {
        const errorElements = document.querySelectorAll('[id$="Error"]');
        errorElements.forEach(element => {
            element.classList.add('hidden');
            element.textContent = '';
        });
        
        const inputElements = document.querySelectorAll('input');
        inputElements.forEach(element => {
            element.classList.remove('border-red-500');
            element.classList.add('border-gray-300');
        });
        
        hideMessages();
    }

    function showError(message) {
        errorText.textContent = message;
        errorMessage.classList.remove('hidden');
        successMessage.classList.add('hidden');
    }

    function showSuccess(message) {
        successText.textContent = message;
        successMessage.classList.remove('hidden');
        errorMessage.classList.add('hidden');
    }

    function hideMessages() {
        errorMessage.classList.add('hidden');
        successMessage.classList.add('hidden');
    }

    function setLoadingState(loading) {
        if (loading) {
            loginBtn.disabled = true;
            loginBtnText.classList.add('hidden');
            loginSpinner.classList.remove('hidden');
            loginBtn.classList.add('opacity-75', 'cursor-not-allowed');
        } else {
            loginBtn.disabled = false;
            loginBtnText.classList.remove('hidden');
            loginSpinner.classList.add('hidden');
            loginBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    }

    // Form submission
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        setLoadingState(true);
        hideMessages();
        
        try {
            // Simulate API call - in real implementation, this would call your backend
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check credentials
            if (email === 'doctor@doctor.com' && password === 'doctor123') {
                showSuccess('Login successful! Redirecting to dashboard...');
                
                // Store login state
                if (rememberMe) {
                    localStorage.setItem('doctorRememberMe', 'true');
                    localStorage.setItem('doctorEmail', email);
                } else {
                    sessionStorage.setItem('doctorLoggedIn', 'true');
                    sessionStorage.setItem('doctorEmail', email);
                }
                
                // Redirect to doctor dashboard
                setTimeout(() => {
                    window.location.href = '/doctor-dashboard';
                }, 1500);
            } else {
                showError('Invalid email or password. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('Login failed. Please try again.');
        } finally {
            setLoadingState(false);
        }
    });

    // Check for remembered login
    function checkRememberedLogin() {
        const remembered = localStorage.getItem('doctorRememberMe');
        const email = localStorage.getItem('doctorEmail');
        
        if (remembered === 'true' && email) {
            emailInput.value = email;
            document.getElementById('rememberMe').checked = true;
        }
    }

    // Initialize
    checkRememberedLogin();

    // Auto-focus email field
    emailInput.focus();

    // Real-time validation
    emailInput.addEventListener('blur', function() {
        const email = emailInput.value.trim();
        if (email && !isValidEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
        }
    });

    passwordInput.addEventListener('blur', function() {
        const password = passwordInput.value;
        if (password && password.length < 6) {
            showFieldError('password', 'Password must be at least 6 characters');
        }
    });

    // Clear errors on input
    emailInput.addEventListener('input', function() {
        if (emailInput.classList.contains('border-red-500')) {
            emailInput.classList.remove('border-red-500');
            emailInput.classList.add('border-gray-300');
            document.getElementById('emailError').classList.add('hidden');
        }
    });

    passwordInput.addEventListener('input', function() {
        if (passwordInput.classList.contains('border-red-500')) {
            passwordInput.classList.remove('border-red-500');
            passwordInput.classList.add('border-gray-300');
            document.getElementById('passwordError').classList.add('hidden');
        }
    });
});
