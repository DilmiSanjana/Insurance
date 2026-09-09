const API_BASE_URL = '/api/users';

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

document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
});

function initializeProfile() {
    const userData = localStorage.getItem('user');
    if (!userData) {
        window.location.href = '/login';
        return;
    }
    
    try {
        currentUser = JSON.parse(userData);
        loadProfile();
        initializeEventListeners();
    } catch (error) {
        console.error('Error parsing user data:', error);
        window.location.href = '/login';
    }
}

function initializeEventListeners() {
    // Edit button
    const editBtn = document.getElementById('editBtn');
    if (editBtn) {
        editBtn.addEventListener('click', handleEditClick);
    }

    // Cancel button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', handleCancelClick);
    }

    // Edit form
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', handleFormSubmit);
    }

    // Delete button
    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', handleDeleteClick);
    }

    // Cancel delete button
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', handleCancelDeleteClick);
    }

    // Confirm delete button
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', handleConfirmDeleteClick);
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogoutClick);
    }

    // Input validation listeners
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => {
            clearError(input);
        });
    });
}

function handleEditClick() {
    if (!currentUser) return;
    
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const contactNumber = document.getElementById('contactNumber');
    const gender = document.getElementById('gender');
    const password = document.getElementById('password');
    
    if (firstName) firstName.value = currentUser.firstName || '';
    if (lastName) lastName.value = currentUser.lastName || '';
    if (email) email.value = currentUser.email || '';
    if (contactNumber) contactNumber.value = currentUser.contactNumber || '';
    if (gender) gender.value = currentUser.gender || '';
    if (password) password.value = '';
    
    const profileView = document.getElementById('profileView');
    const profileEdit = document.getElementById('profileEdit');
    
    if (profileView) profileView.style.display = 'none';
    if (profileEdit) profileEdit.style.display = 'block';
}

function handleCancelClick() {
    const profileView = document.getElementById('profileView');
    const profileEdit = document.getElementById('profileEdit');
    
    if (profileView) profileView.style.display = 'block';
    if (profileEdit) profileEdit.style.display = 'none';
    
    clearAllErrors();
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const contactNumber = document.getElementById('contactNumber');
    const gender = document.getElementById('gender');
    const password = document.getElementById('password');

    if (!firstName || !lastName || !email || !contactNumber || !gender) {
        showError(null, 'Required fields are missing');
        return;
    }

    const formData = {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim(),
        contactNumber: contactNumber.value.trim(),
        gender: gender.value
    };

    if (password && password.value) {
        formData.password = password.value;
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
            
            const profileView = document.getElementById('profileView');
            const profileEdit = document.getElementById('profileEdit');
            
            if (profileView) profileView.style.display = 'block';
            if (profileEdit) profileEdit.style.display = 'none';
            
            showSuccess(data.message);
        } else {
            showError(null, data.message);
        }
    } catch (error) {
        console.error('Update error:', error);
        showError(null, 'Update failed. Please try again.');
    }
}

function handleDeleteClick() {
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
        deleteModal.style.display = 'flex';
    }
}

function handleCancelDeleteClick() {
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
        deleteModal.style.display = 'none';
    }
}

async function handleConfirmDeleteClick() {
    try {
        const response = await fetch(`${API_BASE_URL}/${currentUser.id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            localStorage.removeItem('user');
            showSuccess(data.message);
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        } else {
            showError(null, data.message);
        }
    } catch (error) {
        console.error('Delete error:', error);
        showError(null, 'Delete failed. Please try again.');
    }
    
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
        deleteModal.style.display = 'none';
    }
}

function handleLogoutClick() {
    localStorage.removeItem('user');
    window.location.href = '/login';
}

function loadProfile() {
    if (!currentUser) return;
    
    const viewFirstName = document.getElementById('viewFirstName');
    const viewLastName = document.getElementById('viewLastName');
    const viewEmail = document.getElementById('viewEmail');
    const viewContactNumber = document.getElementById('viewContactNumber');
    const viewGender = document.getElementById('viewGender');
    
    if (viewFirstName) viewFirstName.textContent = currentUser.firstName || '';
    if (viewLastName) viewLastName.textContent = currentUser.lastName || '';
    if (viewEmail) viewEmail.textContent = currentUser.email || '';
    if (viewContactNumber) viewContactNumber.textContent = currentUser.contactNumber || '';
    if (viewGender) viewGender.textContent = currentUser.gender || '';
}

function validateForm() {
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
        if (field === 'password') {
            const input = document.getElementById(field);
            if (!input) return;
            
            const value = input.value;
            
            if (value && !validationRules[field].pattern.test(value)) {
                showError(input, validationRules[field].message);
                isValid = false;
            } else {
                clearError(input);
            }
        } else {
            const input = document.getElementById(field);
            if (!input) return;
            
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
    if (gender && !gender.value) {
        showError(gender, 'Please select a gender');
        isValid = false;
    } else if (gender) {
        clearError(gender);
    }

    return isValid;
}

function showError(input, message) {
    if (input) {
        const formGroup = input.parentElement;
        if (formGroup) {
            formGroup.classList.add('error');
            const errorMessage = formGroup.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.textContent = message;
                errorMessage.classList.remove('hidden');
            }
        }
    } else {
        // Show general error message
        const successDiv = document.getElementById('successMessage');
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.className = 'bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mx-6 mt-6';
            successDiv.classList.remove('hidden');
        }
    }
}

function clearError(input) {
    if (!input) return;
    
    const formGroup = input.parentElement;
    if (formGroup) {
        formGroup.classList.remove('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = '';
            errorMessage.classList.add('hidden');
        }
    }
}

function clearAllErrors() {
    document.querySelectorAll('.form-group').forEach(formGroup => {
        formGroup.classList.remove('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = '';
            errorMessage.classList.add('hidden');
        }
    });
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.className = 'bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mx-6 mt-6';
        successDiv.classList.remove('hidden');
        setTimeout(() => {
            successDiv.classList.add('hidden');
        }, 3000);
    }
}