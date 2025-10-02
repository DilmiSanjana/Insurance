const API_BASE_URL = 'http://localhost:8080/api/users/login';

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

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const formData = {
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value
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
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Login failed. Please try again.');
    }
});

function validateForm() {
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
        const input = document.getElementById(field);
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
    const formGroup = input.parentElement;
    formGroup.classList.add('error');
    const errorMessage = formGroup.querySelector('.error-message');
    errorMessage.textContent = message;
}

function clearError(input) {
    const formGroup = input.parentElement;
    formGroup.classList.remove('error');
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
}

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        clearError(input);
    });
});