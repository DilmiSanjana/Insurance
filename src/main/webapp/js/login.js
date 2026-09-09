const API_BASE_URL = '/api/users/login';

const validationRules = {
    email: {
        pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: 'Invalid email format'
    },
    password: {
        pattern: /^.{8,100}$/,
        message: 'Password must be 8-100 characters'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) {
        console.error('Login form not found');
        return;
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (!emailInput || !passwordInput) {
            console.error('Email or password input not found');
            return;
        }

        const formData = {
            email: emailInput.value.trim(),
            password: passwordInput.value
        };

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                showSuccess(data.message);
                localStorage.setItem('user', JSON.stringify(data.data));
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
            } else {
                showError(null, data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            showError(null, 'Login failed. Please try again.');
        }
    });
});

function validateForm() {
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
        const input = document.getElementById(field);
        if (!input) {
            console.error(`Input field '${field}' not found`);
            return;
        }
        
        const value = input.value.trim();
        const rule = validationRules[field];

        if (!rule.pattern.test(value)) {
            showError(input, rule.message);
            isValid = false;
        } else {
            clearError(input);
        }
    });

    return isValid;
}

function showError(input, message) {
    if (input) {
        const formGroup = input.parentElement;
        formGroup.classList.add('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = message;
        }
    } else {
        // Show general error message
        const successDiv = document.getElementById('successMessage');
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.className = 'bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6';
            successDiv.style.display = 'block';
        }
    }
}

function clearError(input) {
    if (!input) return;
    
    const formGroup = input.parentElement;
    formGroup.classList.remove('error');
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.textContent = '';
    }
}

function hideFieldError(input) {
    if (!input) return;
    
    const formGroup = input.parentElement;
    formGroup.classList.remove('error');
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.textContent = '';
    }
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.className = 'bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6';
        successDiv.style.display = 'block';
    }
}

// Add event listeners for input validation
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            clearError(input);
        });
    });
});