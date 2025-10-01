const API_URL = 'http://localhost:8080/api/customers';

const REGEX = {
    fullName: /^[a-zA-Z\s]{2,150}$/,
    gender: /^(Male|Female|Other)$/,
    phoneNumber: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{3,15}$/,
    emailAddress: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    homeAddress: /^.{0,500}$/,
    drivingLicenseNumber: /^[a-zA-Z0-9]{0,50}$/,
    password: /^.{8,100}$/
};

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

    if (fieldId === 'password') {
        if (!value) {
            field.classList.add('invalid');
            error.textContent = 'Password is required';
            error.classList.add('active');
            return false;
        }
        if (!regex.test(value)) {
            field.classList.add('invalid');
            error.textContent = 'Password must be at least 8 characters';
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
    const passwordValid = validateField('password', REGEX.password);
    
    return fullNameValid && dobValid && genderValid && phoneValid && emailValid && addressValid && licenseValid && passwordValid;
}

async function handleSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        showToast('Please fix the errors in the form', 'error');
        return;
    }
    
    const customer = {
        fullName: document.getElementById('fullName').value.trim(),
        dateOfBirth: document.getElementById('dateOfBirth').value,
        gender: document.getElementById('gender').value,
        phoneNumber: document.getElementById('phoneNumber').value.trim(),
        emailAddress: document.getElementById('emailAddress').value.trim(),
        homeAddress: document.getElementById('homeAddress').value.trim() || null,
        drivingLicenseNumber: document.getElementById('drivingLicenseNumber').value.trim() || null,
        password: document.getElementById('password').value.trim()
    };
    
    showLoading();
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        });
        
        const data = await response.json();
        
        hideLoading();
        
        if (data.success) {
            showToast(data.message, 'success');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            showToast(data.error || 'Registration failed', 'error');
        }
    } catch (error) {
        hideLoading();
        showToast('Network error occurred', 'error');
    }
}

function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
    document.getElementById('submitBtn').disabled = true;
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
    document.getElementById('submitBtn').disabled = false;
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
document.getElementById('password').addEventListener('blur', () => validateField('password', REGEX.password));
document.getElementById('drivingLicenseNumber').addEventListener('blur', () => validateField('drivingLicenseNumber', REGEX.drivingLicenseNumber));