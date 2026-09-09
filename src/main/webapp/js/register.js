const API_BASE_URL = 'http://localhost:8081/api/users';

const validationRules = {
    firstName: {
        pattern: /^[A-Za-z]{2,50}$/,
        message: 'First name must be 2-50 letters only'
    },
    lastName: {
        pattern: /^[A-Za-z]{2,50}$/,
        message: 'Last name must be 2-50 letters only'
    },
    email: {
        pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: 'Invalid email format'
    },
    contactNumber: {
        pattern: /^\+?\d{10,15}$/,
        message: 'Contact number must be 10-15 digits, optional + prefix'
    },
    password: {
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/,
        message: 'Password must be 8-100 characters with uppercase, lowercase, number and special character'
    }
};

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        contactNumber: document.getElementById('contactNumber').value.trim(),
        gender: document.getElementById('gender').value,
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
            document.getElementById('registerForm').reset();
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Registration failed. Please try again.');
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

    const gender = document.getElementById('gender');
    if (!gender.value) {
        showError(gender, 'Please select a gender');
        isValid = false;
    } else {
        clearError(gender);
    }

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showError(document.getElementById('confirmPassword'), 'Passwords do not match');
        isValid = false;
    } else if (confirmPassword) {
        clearError(document.getElementById('confirmPassword'));
    }

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

document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => {
        clearError(input);
    });
});