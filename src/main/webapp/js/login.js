const API_URL = 'http://localhost:8080/api/customers/authenticate';

const REGEX = {
    emailAddress: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^.{8,100}$/
};

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

function clearErrors() {
    document.querySelectorAll('.error').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('input').forEach(el => el.classList.remove('invalid'));
}

function validateField(fieldId, regex, errorMsg) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}Error`);
    const value = field.value.trim();
    
    if (fieldId === 'emailAddress') {
        if (!value) {
            field.classList.add('invalid');
            error.textContent = 'Email address is required';
            error.classList.add('active');
            return false;
        }
        if (!regex.test(value)) {
            field.classList.add('invalid');
            error.textContent = 'Invalid email format';
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
            error.textContent = 'Password must be 8-100 characters';
            error.classList.add('active');
            return false;
        }
    }
    
    field.classList.remove('invalid');
    error.classList.remove('active');
    return true;
}

function validateForm() {
    const emailValid = validateField('emailAddress', REGEX.emailAddress);
    const passwordValid = validateField('password', REGEX.password);
    
    return emailValid && passwordValid;
}

async function handleSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        showToast('Please fix the errors in the form', 'error');
        return;
    }
    
    const credentials = {
        emailAddress: document.getElementById('emailAddress').value.trim(),
        password: document.getElementById('password').value
    };
    
    showLoading();
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        
        const data = await response.json();
        
        hideLoading();
        
        if (data.success) {
            storeCustomerData(data.data);
            showToast(data.message, 'success');
            setTimeout(() => {
                window.location.href = '/profile';
            }, 1500);
        } else {
            showToast(data.error || 'Invalid email or password', 'error');
        }
    } catch (error) {
        hideLoading();
        showToast('Network error occurred', 'error');
    }
}

function storeCustomerData(customer) {
    const customerData = {
        id: customer.id,
        fullName: customer.fullName,
        emailAddress: customer.emailAddress,
        phoneNumber: customer.phoneNumber,
        gender: customer.gender,
        dateOfBirth: customer.dateOfBirth,
        homeAddress: customer.homeAddress,
        drivingLicenseNumber: customer.drivingLicenseNumber
    };
    
    sessionStorage.setItem('customer', JSON.stringify(customerData));
    sessionStorage.setItem('isLoggedIn', 'true');
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

function checkIfLoggedIn() {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = '/dashboard';
    }
}

document.getElementById('emailAddress').addEventListener('blur', () => validateField('emailAddress', REGEX.emailAddress));
document.getElementById('password').addEventListener('blur', () => validateField('password', REGEX.password));

document.addEventListener('DOMContentLoaded', checkIfLoggedIn);