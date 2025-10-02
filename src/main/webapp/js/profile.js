const API_BASE_URL = 'http://localhost:8080/api/users';

let currentUser = null;

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

window.addEventListener('DOMContentLoaded', () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = JSON.parse(userData);
    loadProfile();
});

function loadProfile() {
    document.getElementById('viewFirstName').textContent = currentUser.firstName;
    document.getElementById('viewLastName').textContent = currentUser.lastName;
    document.getElementById('viewEmail').textContent = currentUser.email;
    document.getElementById('viewContactNumber').textContent = currentUser.contactNumber;
    document.getElementById('viewGender').textContent = currentUser.gender;
}

document.getElementById('editBtn').addEventListener('click', () => {
    document.getElementById('firstName').value = currentUser.firstName;
    document.getElementById('lastName').value = currentUser.lastName;
    document.getElementById('email').value = currentUser.email;
    document.getElementById('contactNumber').value = currentUser.contactNumber;
    document.getElementById('gender').value = currentUser.gender;
    document.getElementById('password').value = '';
    
    document.getElementById('profileView').style.display = 'none';
    document.getElementById('profileEdit').style.display = 'block';
});

document.getElementById('cancelBtn').addEventListener('click', () => {
    document.getElementById('profileView').style.display = 'block';
    document.getElementById('profileEdit').style.display = 'none';
    clearAllErrors();
});

document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        contactNumber: document.getElementById('contactNumber').value.trim(),
        gender: document.getElementById('gender').value
    };

    const password = document.getElementById('password').value;
    if (password) {
        formData.password = password;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${currentUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            currentUser = data.data;
            localStorage.setItem('user', JSON.stringify(currentUser));
            loadProfile();
            document.getElementById('profileView').style.display = 'block';
            document.getElementById('profileEdit').style.display = 'none';
            showSuccess(data.message);
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Update failed. Please try again.');
    }
});

document.getElementById('deleteBtn').addEventListener('click', () => {
    document.getElementById('deleteModal').style.display = 'flex';
});

document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
    document.getElementById('deleteModal').style.display = 'none';
});

document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/${currentUser.id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            localStorage.removeItem('user');
            alert(data.message);
            window.location.href = 'login.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Delete failed. Please try again.');
    }
    
    document.getElementById('deleteModal').style.display = 'none';
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
});

function validateForm() {
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
        if (field === 'password') {
            const input = document.getElementById(field);
            const value = input.value;
            
            if (value && !validationRules[field].pattern.test(value)) {
                showError(input, validationRules[field].message);
                isValid = false;
            } else {
                clearError(input);
            }
        } else {
            const input = document.getElementById(field);
            const value = input.value.trim();
            const rule = validationRules[field];

            if (!rule.pattern.test(value)) {
                showError(input, rule.message);
                isValid = false;
            } else {
                clearError(input);
            }
        }
    });

    const gender = document.getElementById('gender');
    if (!gender.value) {
        showError(gender, 'Please select a gender');
        isValid = false;
    } else {
        clearError(gender);
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

function clearAllErrors() {
    document.querySelectorAll('.form-group').forEach(formGroup => {
        formGroup.classList.remove('error');
    });
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 3000);
}

document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => {
        clearError(input);
    });
});