const API_BASE_URL = 'http://localhost:8081/api/payments';

let payments = [];
let currentPaymentId = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadPayments();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('refreshBtn').addEventListener('click', loadPayments);
    document.getElementById('exportBtn').addEventListener('click', exportPayments);
    document.getElementById('cancelStatusUpdate').addEventListener('click', hideStatusModal);
    document.getElementById('confirmStatusUpdate').addEventListener('click', updatePaymentStatus);
    document.getElementById('logoutBtn').addEventListener('click', logout);
}

async function loadPayments() {
    try {
        const response = await fetch(API_BASE_URL);
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
                <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                    <div class="flex flex-col items-center">
                        <svg class="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                        </svg>
                        <p class="text-lg font-medium">No payments found</p>
                        <p class="text-sm">No payment records available</p>
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
        const paidDate = payment.paidDate ? formatDate(payment.paidDate) : '-';
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#${payment.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>
                    <div class="font-medium">${payment.user.firstName} ${payment.user.lastName}</div>
                    <div class="text-gray-500">${payment.user.email}</div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$${payment.amount}</td>
            <td class="px-6 py-4 whitespace-nowrap">${statusBadge}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${createdDate}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${paidDate}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                    <button onclick="showStatusModal(${payment.id}, '${payment.status}')" class="text-blue-600 hover:text-blue-900">Update Status</button>
                    <button onclick="viewPaymentDetails(${payment.id})" class="text-green-600 hover:text-green-900">View Details</button>
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
    const failedPayments = payments.filter(p => p.status === 'FAILED').length;
    
    document.getElementById('totalPayments').textContent = totalPayments;
    document.getElementById('completedPayments').textContent = completedPayments;
    document.getElementById('pendingPayments').textContent = pendingPayments;
    document.getElementById('failedPayments').textContent = failedPayments;
}

function showStatusModal(paymentId, currentStatus) {
    currentPaymentId = paymentId;
    document.getElementById('statusModalPaymentId').textContent = paymentId;
    document.getElementById('statusModalCurrentStatus').textContent = currentStatus;
    document.getElementById('newStatus').value = currentStatus;
    document.getElementById('statusModal').classList.remove('hidden');
}

function hideStatusModal() {
    document.getElementById('statusModal').classList.add('hidden');
    currentPaymentId = null;
}

async function updatePaymentStatus() {
    if (!currentPaymentId) return;
    
    const newStatus = document.getElementById('newStatus').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/${currentPaymentId}/status?status=${newStatus}`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            showSuccess('Payment status updated successfully');
            hideStatusModal();
            loadPayments();
        } else {
            showError('Failed to update payment status');
        }
    } catch (error) {
        console.error('Error updating payment status:', error);
        showError('Failed to update payment status');
    }
}

function viewPaymentDetails(paymentId) {
    const payment = payments.find(p => p.id === paymentId);
    if (payment) {
        const details = `
Payment ID: ${payment.id}
User: ${payment.user.firstName} ${payment.user.lastName}
Email: ${payment.user.email}
Amount: $${payment.amount}
Status: ${payment.status}
Created: ${formatDate(payment.createdAt)}
Paid Date: ${payment.paidDate ? formatDate(payment.paidDate) : 'Not paid'}
Additional Date 1: ${payment.additionalDate1 ? formatDate(payment.additionalDate1) : 'N/A'}
Additional Date 2: ${payment.additionalDate2 ? formatDate(payment.additionalDate2) : 'N/A'}
Additional Date 3: ${payment.additionalDate3 ? formatDate(payment.additionalDate3) : 'N/A'}
        `;
        alert(details);
    }
}

function exportPayments() {
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function generateCSV() {
    const headers = ['Payment ID', 'User Name', 'User Email', 'Amount', 'Status', 'Created Date', 'Paid Date'];
    const rows = payments.map(payment => [
        payment.id,
        `${payment.user.firstName} ${payment.user.lastName}`,
        payment.user.email,
        payment.amount,
        payment.status,
        formatDate(payment.createdAt),
        payment.paidDate ? formatDate(payment.paidDate) : ''
    ]);
    
    const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
    
    return csvContent;
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        window.location.href = '/admin-login';
    }
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}
