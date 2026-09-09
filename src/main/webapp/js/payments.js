const API_BASE_URL = 'http://localhost:8081/api/payments';

let currentUser = null;
let payments = [];
let paymentToDelete = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadUserFromStorage();
    if (currentUser) {
        loadPayments();
        setupEventListeners();
    } else {
        redirectToLogin();
    }
});

function loadUserFromStorage() {
    const userData = localStorage.getItem('user');
    if (userData) {
        currentUser = JSON.parse(userData);
    }
}

function redirectToLogin() {
    window.location.href = '/login';
}

function setupEventListeners() {
    // Modal controls
    document.getElementById('addPaymentBtn').addEventListener('click', showAddPaymentModal);
    document.getElementById('closeAddModal').addEventListener('click', hideAddPaymentModal);
    document.getElementById('cancelAddPayment').addEventListener('click', hideAddPaymentModal);
    
    document.getElementById('closeEditModal').addEventListener('click', hideEditPaymentModal);
    document.getElementById('cancelEditPayment').addEventListener('click', hideEditPaymentModal);
    
    document.getElementById('cancelDeletePayment').addEventListener('click', hideDeletePaymentModal);
    document.getElementById('confirmDeletePayment').addEventListener('click', confirmDeletePayment);
    
    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = '/';
    });

    // Form submissions
    document.getElementById('addPaymentForm').addEventListener('submit', handleAddPayment);
    document.getElementById('editPaymentForm').addEventListener('submit', handleEditPayment);

    // Payment method change
    document.getElementById('paymentMethod').addEventListener('change', toggleCardInterface);

    // Card input formatting
    document.getElementById('cardNumber').addEventListener('input', formatCardNumber);
    document.getElementById('expiryDate').addEventListener('input', formatExpiryDate);
    document.getElementById('cvv').addEventListener('input', formatCVV);
}

async function loadPayments() {
    try {
        const response = await fetch(`${API_BASE_URL}/user/${currentUser.id}`);
        if (response.ok) {
            payments = await response.json();
            renderPayments();
            updateStats();
        } else {
            showError('Failed to load payments');
        }
    } catch (error) {
        console.error('Error loading payments:', error);
        showError('Failed to load payments');
    }
}

function renderPayments() {
    const tbody = document.getElementById('paymentsTableBody');
    tbody.innerHTML = '';

    if (payments.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                    <div class="flex flex-col items-center">
                        <svg class="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                        </svg>
                        <p class="text-lg font-medium">No payments found</p>
                        <p class="text-sm">Start by adding your first payment</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    payments.forEach(payment => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        
        const statusBadge = getStatusBadge(payment.status);
        const createdDate = formatDate(payment.createdAt);
        const paidDate = payment.createdAt ? formatDate(payment.createdAt) : '-';
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#${payment.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$${payment.amount}</td>
            <td class="px-6 py-4 whitespace-nowrap">${statusBadge}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${createdDate}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${paidDate}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                    <button onclick="editPayment(${payment.id})" class="text-blue-600 hover:text-blue-900">Edit</button>
                    <button onclick="deletePayment(${payment.id})" class="text-red-600 hover:text-red-900">Delete</button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

function getStatusBadge(status) {
    const statusClasses = {
        'PENDING': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800',
        'COMPLETED': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
        'FAILED': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800',
        'CANCELLED': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800',
        'REFUNDED': 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'
    };
    
    return `<span class="${statusClasses[status] || statusClasses['PENDING']}">${status}</span>`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function updateStats() {
    const totalPayments = payments.length;
    const completedPayments = payments.filter(p => p.status === 'COMPLETED').length;
    const pendingPayments = payments.filter(p => p.status === 'PENDING').length;
    
    document.getElementById('totalPayments').textContent = totalPayments;
    document.getElementById('completedPayments').textContent = completedPayments;
    document.getElementById('pendingPayments').textContent = pendingPayments;
}

function showAddPaymentModal() {
    document.getElementById('addPaymentModal').classList.remove('hidden');
    document.getElementById('addPaymentForm').reset();
    document.getElementById('cardPaymentInterface').classList.add('hidden');
    clearFormErrors('addPaymentForm');
}

function hideAddPaymentModal() {
    document.getElementById('addPaymentModal').classList.add('hidden');
}

function showEditPaymentModal(payment) {
    document.getElementById('editPaymentModal').classList.remove('hidden');
    document.getElementById('editPaymentId').value = payment.id;
    document.getElementById('editPaymentAmount').value = payment.amount;
    document.getElementById('editPaymentStatus').textContent = payment.status;
    clearFormErrors('editPaymentForm');
}

function hideEditPaymentModal() {
    document.getElementById('editPaymentModal').classList.add('hidden');
}

function showDeletePaymentModal(paymentId) {
    paymentToDelete = paymentId;
    document.getElementById('deletePaymentModal').classList.remove('hidden');
}

function hideDeletePaymentModal() {
    document.getElementById('deletePaymentModal').classList.add('hidden');
    paymentToDelete = null;
}

function toggleCardInterface() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const cardInterface = document.getElementById('cardPaymentInterface');
    
    if (paymentMethod === 'card') {
        cardInterface.classList.remove('hidden');
    } else {
        cardInterface.classList.add('hidden');
    }
}

function formatCardNumber(event) {
    let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    if (formattedValue.length > 19) formattedValue = formattedValue.substr(0, 19);
    event.target.value = formattedValue;
}

function formatExpiryDate(event) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    event.target.value = value;
}

function formatCVV(event) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.substring(0, 4);
    event.target.value = value;
}

function validateCardNumber(cardNumber) {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleanNumber);
}

function validateExpiryDate(expiryDate) {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(expiryDate)) return false;
    
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expYear = parseInt(year);
    const expMonth = parseInt(month);
    
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        return false;
    }
    
    return true;
}

function validateCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
}

function validateCardholderName(name) {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
}

function validatePaymentForm(formData) {
    const errors = {};
    
    if (!formData.amount || formData.amount <= 0) {
        errors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.paymentMethod) {
        errors.paymentMethod = 'Please select a payment method';
    }
    
    if (formData.paymentMethod === 'card') {
        if (!validateCardNumber(formData.cardNumber)) {
            errors.cardNumber = 'Please enter a valid card number';
        }
        
        if (!validateExpiryDate(formData.expiryDate)) {
            errors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
        }
        
        if (!validateCVV(formData.cvv)) {
            errors.cvv = 'Please enter a valid CVV';
        }
        
        if (!validateCardholderName(formData.cardholderName)) {
            errors.cardholderName = 'Please enter a valid cardholder name';
        }
    }
    
    return errors;
}

function showFormErrors(formId, errors) {
    const form = document.getElementById(formId);
    Object.keys(errors).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            const errorSpan = field.parentNode.querySelector('.error-message');
            if (errorSpan) {
                errorSpan.textContent = errors[fieldName];
                errorSpan.classList.remove('hidden');
            }
        }
    });
}

function clearFormErrors(formId) {
    const form = document.getElementById(formId);
    const errorSpans = form.querySelectorAll('.error-message');
    errorSpans.forEach(span => {
        span.classList.add('hidden');
        span.textContent = '';
    });
}

async function handleAddPayment(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const paymentData = {
        amount: parseFloat(formData.get('amount')),
        paymentMethod: formData.get('paymentMethod'),
        cardNumber: formData.get('cardNumber'),
        expiryDate: formData.get('expiryDate'),
        cvv: formData.get('cvv'),
        cardholderName: formData.get('cardholderName')
    };
    
    clearFormErrors('addPaymentForm');
    
    const errors = validatePaymentForm(paymentData);
    if (Object.keys(errors).length > 0) {
        showFormErrors('addPaymentForm', errors);
        return;
    }
    
    try {
        const requestData = {
            amount: paymentData.amount,
            userId: currentUser.id,
            status: 'PENDING'
        };
        
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        
        if (response.ok) {
            const newPayment = await response.json();
            payments.push(newPayment);
            renderPayments();
            updateStats();
            hideAddPaymentModal();
            showSuccess('Payment added successfully');
        } else {
            showError('Failed to add payment');
        }
    } catch (error) {
        console.error('Error adding payment:', error);
        showError('Failed to add payment');
    }
}

async function handleEditPayment(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const paymentId = document.getElementById('editPaymentId').value;
    const amount = parseFloat(formData.get('amount'));
    
    clearFormErrors('editPaymentForm');
    
    if (!amount || amount <= 0) {
        showFormErrors('editPaymentForm', { amount: 'Amount must be greater than 0' });
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${paymentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount
            })
        });
        
        if (response.ok) {
            const updatedPayment = await response.json();
            const index = payments.findIndex(p => p.id === updatedPayment.id);
            if (index !== -1) {
                payments[index] = updatedPayment;
            }
            renderPayments();
            updateStats();
            hideEditPaymentModal();
            showSuccess('Payment updated successfully');
        } else {
            showError('Failed to update payment');
        }
    } catch (error) {
        console.error('Error updating payment:', error);
        showError('Failed to update payment');
    }
}

async function confirmDeletePayment() {
    if (!paymentToDelete) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/${paymentToDelete}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            payments = payments.filter(p => p.id !== paymentToDelete);
            renderPayments();
            updateStats();
            hideDeletePaymentModal();
            showSuccess('Payment deleted successfully');
        } else {
            showError('Failed to delete payment');
        }
    } catch (error) {
        console.error('Error deleting payment:', error);
        showError('Failed to delete payment');
    }
}

function editPayment(paymentId) {
    const payment = payments.find(p => p.id === paymentId);
    if (payment) {
        showEditPaymentModal(payment);
    }
}

function deletePayment(paymentId) {
    showDeletePaymentModal(paymentId);
}

function showSuccess(message) {
    // Create a temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function showError(message) {
    // Create a temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}