const API_URL = 'http://localhost:8080/api/customers';

const REGEX = {
    fullName: /^[a-zA-Z\s]{2,150}$/,
    gender: /^(Male|Female|Other)$/,
    phoneNumber: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{3,15}$/,
    emailAddress: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    homeAddress: /^.{0,500}$/,
    drivingLicenseNumber: /^[a-zA-Z0-9]{0,50}$/
};

let customerData = null;

function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const customer = sessionStorage.getItem('customer');

    if (isLoggedIn !== 'true' || !customer) {
        window.location.href = '/login';
        return;
    }

    customerData = JSON.parse(customer);
    displayProfile();
}

function displayProfile() {
    document.getElementById('navUserName').textContent = customerData.fullName;
    document.getElementById('navUserEmail').textContent = customerData.emailAddress;

    document.getElementById('profileName').textContent = customerData.fullName;
    document.getElementById('profileEmail').textContent = customerData.emailAddress;

    document.getElementById('infoName').textContent = customerData.fullName;
    document.getElementById('infoDob').textContent = formatDate(customerData.dateOfBirth);
    document.getElementById('infoGender').textContent = customerData.gender;

    const addressEl = document.getElementById('infoAddress');
    if (customerData.homeAddress) {
        addressEl.textContent = customerData.homeAddress;
        addressEl.classList.remove('empty');
    } else {
        addressEl.textContent = 'Not provided';
        addressEl.classList.add('empty');
    }

    document.getElementById('infoEmailAddress').textContent = customerData.emailAddress;
    document.getElementById('infoPhone').textContent = customerData.phoneNumber;

    const licenseEl = document.getElementById('infoLicense');
    if (customerData.drivingLicenseNumber) {
        licenseEl.textContent = customerData.drivingLicenseNumber;
        licenseEl.classList.remove('empty');
    } else {
        licenseEl.textContent = 'Not provided';
        licenseEl.classList.add('empty');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function openEditModal() {
    document.getElementById('fullName').value = customerData.fullName;
    document.getElementById('dateOfBirth').value = customerData.dateOfBirth;
    document.getElementById('gender').value = customerData.gender;
    document.getElementById('phoneNumber').value = customerData.phoneNumber;
    document.getElementById('emailAddress').value = customerData.emailAddress;
    document.getElementById('homeAddress').value = customerData.homeAddress || '';
    document.getElementById('drivingLicenseNumber').value = customerData.drivingLicenseNumber || '';

    clearErrors();
    document.getElementById('editModal').classList.add('active');
}

function closeModal() {
    document.getElementById('editModal').classList.remove('active');
    clearErrors();
}

function clearErrors() {
    document.querySelectorAll('.error').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('input, select, textarea').forEach(el => el.classList.remove('invalid'));
}

function validateField(fieldId, regex, errorMsg) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}Error`);
    const value = field.value.trim();

    if (fieldId === 'fullName') {
        if (!value) {
            field.classList.add('invalid');
            error.textContent = 'Full name is required';
            error.classList.add('active');
            return false;
        }
        if (!regex.test(value)) {
            field.classList.add('invalid');
            error.textContent = 'Full name must be 2-150 letters and spaces only';
            error.classList.add('active');
            return false;
        }
    }

    if (fieldId === 'dateOfBirth') {
        if (!value) {
            field.classList.add('invalid');
            error.textContent = 'Date of birth is required';
            error.classList.add('active');
            return false;
        }
        const dob = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 18 || age > 120) {
            field.classList.add('invalid');
            error.textContent = 'Age must be between 18 and 120 years';
            error.classList.add('active');
            return false;
        }
    }

    if (fieldId === 'gender') {
        if (!value) {
            field.classList.add('invalid');
            error.textContent = 'Gender is required';
            error.classList.add('active');
            return false;
        }
        if (!regex.test(value)) {
            field.classList.add('invalid');
            error.textContent = 'Invalid gender selection';
            error.classList.add('active');
            return false;
        }
    }

    if (fieldId === 'phoneNumber') {
        if (!value) {
            field.classList.add('invalid');
            error.textContent = 'Phone number is required';
            error.classList.add('active');
            return false;
        }
        if (!regex.test(value) || value.length < 7 || value.length > 20) {
            field.classList.add('invalid');
            error.textContent = 'Phone number must be 7-20 characters with valid format';
            error.classList.add('active');
            return false;
        }
    }

    if (fieldId === 'emailAddress') {
        if (!value) {
            field.classList.add('invalid');
            error.textContent = 'Email address is required';
            error.classList.add('active');
            return false;
        }
        if (!regex.test(value) || value.length > 150) {
            field.classList.add('invalid');
            error.textContent = 'Invalid email format or exceeds 150 characters';
            error.classList.add('active');
            return false;
        }
    }

    if (fieldId === 'homeAddress' && value) {
        if (!regex.test(value)) {
            field.classList.add('invalid');
            error.textContent = 'Home address must not exceed 500 characters';
            error.classList.add('active');
            return false;
        }
    }

    if (fieldId === 'drivingLicenseNumber' && value) {
        if (!regex.test(value)) {
            field.classList.add('invalid');
            error.textContent = 'License number must be alphanumeric and max 50 characters';
            error.classList.add('active');
            return false;
        }
    }

    field.classList.remove('invalid');
    error.classList.remove('active');
    return true;
}

function validateForm() {
    const fullNameValid = validateField('fullName', REGEX.fullName);
    const dobValid = validateField('dateOfBirth', null);
    const genderValid = validateField('gender', REGEX.gender);
    const phoneValid = validateField('phoneNumber', REGEX.phoneNumber);
    const emailValid = validateField('emailAddress', REGEX.emailAddress);
    const addressValid = validateField('homeAddress', REGEX.homeAddress);
    const licenseValid = validateField('drivingLicenseNumber', REGEX.drivingLicenseNumber);

    return fullNameValid && dobValid && genderValid && phoneValid && emailValid && addressValid && licenseValid;
}

async function handleUpdate(event) {
    event.preventDefault();

    if (!validateForm()) {
        showToast('Please fix the errors in the form', 'error');
        return;
    }

    const updatedCustomer = {
        fullName: document.getElementById('fullName').value.trim(),
        dateOfBirth: document.getElementById('dateOfBirth').value,
        gender: document.getElementById('gender').value,
        phoneNumber: document.getElementById('phoneNumber').value.trim(),
        emailAddress: document.getElementById('emailAddress').value.trim(),
        homeAddress: document.getElementById('homeAddress').value.trim() || null,
        drivingLicenseNumber: document.getElementById('drivingLicenseNumber').value.trim() || null,
        password: customerData.password || 'unchanged'
    };

    showLoading();

    try {
        const response = await fetch(`${API_URL}/${customerData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedCustomer)
        });

        const data = await response.json();

        hideLoading();

        if (data.success) {
            customerData = {
                ...customerData,
                fullName: updatedCustomer.fullName,
                dateOfBirth: updatedCustomer.dateOfBirth,
                gender: updatedCustomer.gender,
                phoneNumber: updatedCustomer.phoneNumber,
                emailAddress: updatedCustomer.emailAddress,
                homeAddress: updatedCustomer.homeAddress,
                drivingLicenseNumber: updatedCustomer.drivingLicenseNumber
            };

            sessionStorage.setItem('customer', JSON.stringify(customerData));
            displayProfile();
            closeModal();
            showToast(data.message, 'success');
        } else {
            showToast(data.error || 'Update failed', 'error');
        }
    } catch (error) {
        hideLoading();
        showToast('Network error occurred', 'error');
    }
}

function confirmDelete() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        handleDelete();
    }
}

async function handleDelete() {
    showLoading();

    try {
        const response = await fetch(`${API_URL}/${customerData.id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        hideLoading();

        if (data.success) {
            showToast('Account deleted successfully', 'success');
            setTimeout(() => {
                clearSession();
                window.location.href = '/login';
            }, 2000);
        } else {
            showToast(data.error || 'Delete failed', 'error');
        }
    } catch (error) {
        hideLoading();
        showToast('Network error occurred', 'error');
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        clearSession();
        showToast('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.href = '/login';
        }, 1000);
    }
}

function clearSession() {
    sessionStorage.removeItem('customer');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.clear();
}

function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toast.className = `toast ${type} active`;
    toastMessage.textContent = message;

    setTimeout(() => {
        toast.classList.remove('active');
    }, 4000);
}

document.getElementById('fullName').addEventListener('blur', () => validateField('fullName', REGEX.fullName));
document.getElementById('dateOfBirth').addEventListener('blur', () => validateField('dateOfBirth', null));
document.getElementById('gender').addEventListener('blur', () => validateField('gender', REGEX.gender));
document.getElementById('phoneNumber').addEventListener('blur', () => validateField('phoneNumber', REGEX.phoneNumber));
document.getElementById('emailAddress').addEventListener('blur', () => validateField('emailAddress', REGEX.emailAddress));
document.getElementById('homeAddress').addEventListener('blur', () => validateField('homeAddress', REGEX.homeAddress));
document.getElementById('drivingLicenseNumber').addEventListener('blur', () => validateField('drivingLicenseNumber', REGEX.drivingLicenseNumber));

window.addEventListener('click', (e) => {
    const modal = document.getElementById('editModal');
    if (e.target === modal) {
        closeModal();
    }
});

document.addEventListener('DOMContentLoaded', checkAuth);