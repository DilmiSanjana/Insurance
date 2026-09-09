const API_URL = '/api/support-tickets';

// Regex validations
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const titleRegex = /^.{3,100}$/;
const descriptionRegex = /^.{10,2000}$/;

// Current user
let currentUser = null;

// Check authentication
const checkAuth = () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
        window.location.href = '/login';
        return null;
    }
    return JSON.parse(userData);
};

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    currentUser = checkAuth();
    if (currentUser) {
        initializePage();
        loadTickets();
    }
});

// Initialize page with user data
const initializePage = () => {
    // Set user email in create form (disabled)
    document.getElementById('createEmail').value = currentUser.email || '';
};

// Load tickets automatically
const loadTickets = async () => {
    const userEmail = currentUser.email;

    if (!userEmail || !emailRegex.test(userEmail)) {
        displayTickets([]);
        return;
    }

    try {
        const response = await fetch(API_URL);
        const tickets = await response.json();

        const userTickets = tickets.filter(t => t.customerEmail === userEmail);
        displayTickets(userTickets);
    } catch (error) {
        showNotification('Error loading tickets', 'error');
        displayTickets([]);
    }
};

// Display tickets
function displayTickets(tickets) {
    const container = document.getElementById('ticketsList');

    if (tickets.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
                <h3 class="text-lg font-semibold text-gray-700 mb-2">No tickets found</h3>
                <p class="text-gray-500 mb-4">You haven't created any support tickets yet</p>
                <button onclick="document.getElementById('openCreateModal').click()" class="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all">
                    Create Your First Ticket
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = tickets.map(ticket => `
        <div class="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-3">
                <div class="flex-1">
                    <h3 class="font-bold text-lg text-gray-900 mb-1">${escapeHtml(ticket.title)}</h3>
                    <p class="text-sm text-gray-500">Ticket #${ticket.id} • ${formatDate(ticket.createdDate)}</p>
                </div>
                <div class="flex items-center gap-2">
                    <span class="px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(ticket.status)}">${ticket.status.replace('_', ' ')}</span>
                    ${(ticket.status === 'PENDING' && ticket.customerEmail === currentUser.email )? `
                        <button onclick="editTicket(${ticket.id})" class="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Edit">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        <button onclick="deleteTicket(${ticket.id})" class="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Delete">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                    ` : ''}
                </div>
            </div>
            <p class="text-gray-700 mb-4">${escapeHtml(ticket.description)}</p>
            ${ticket.reply ? `
                <div class="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 rounded-lg p-4 mt-4">
                    <div class="flex items-center mb-2">
                        <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                        </svg>
                        <p class="text-sm font-bold text-green-800">Support Reply</p>
                    </div>
                    <p class="text-gray-700">${escapeHtml(ticket.reply)}</p>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Get status class
function getStatusClass(status) {
    switch(status) {
        case 'PENDING': return 'bg-yellow-100 text-yellow-800';
        case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
        case 'RESOLVED': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show notification
function showNotification(message, type = 'success') {
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Modal handlers
document.getElementById('openCreateModal').addEventListener('click', () => {
    document.getElementById('createEmail').value = currentUser.email || '';
    document.getElementById('createModal').classList.remove('hidden');
});

document.getElementById('closeCreateModal').addEventListener('click', closeCreateModal);
document.getElementById('cancelCreate').addEventListener('click', closeCreateModal);

function closeCreateModal() {
    document.getElementById('createModal').classList.add('hidden');
    document.getElementById('createForm').reset();
    document.getElementById('createEmail').value = currentUser.email || '';
    hideError('createEmailError');
    hideError('createTitleError');
    hideError('createDescriptionError');
}

document.getElementById('closeEditModal').addEventListener('click', closeEditModal);
document.getElementById('cancelEdit').addEventListener('click', closeEditModal);

function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    document.getElementById('editForm').reset();
    hideError('editEmailError');
    hideError('editTitleError');
    hideError('editDescriptionError');
}

// Create ticket
document.getElementById('createForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = currentUser.email;
    const title = document.getElementById('createTitle').value.trim();
    const description = document.getElementById('createDescription').value.trim();

    let valid = true;

    if (!titleRegex.test(title)) {
        showError('createTitleError', 'Title must be between 3 and 100 characters');
        valid = false;
    } else {
        hideError('createTitleError');
    }

    if (!descriptionRegex.test(description)) {
        showError('createDescriptionError', 'Description must be between 10 and 2000 characters');
        valid = false;
    } else {
        hideError('createDescriptionError');
    }

    if (!valid) return;

    const ticket = {
        customerEmail: email,
        title: title,
        description: description,
        status: 'PENDING',
        reply: null
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticket)
        });

        if (response.ok) {
            showNotification('Ticket submitted successfully');
            closeCreateModal();
            loadTickets();
        } else {
            showNotification('Failed to submit ticket', 'error');
        }
    } catch (error) {
        showNotification('Error submitting ticket', 'error');
    }
});

// Edit ticket
async function editTicket(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const ticket = await response.json();

        document.getElementById('editId').value = ticket.id;
        document.getElementById('editEmail').value = ticket.customerEmail;
        document.getElementById('editTitle').value = ticket.title;
        document.getElementById('editDescription').value = ticket.description;

        document.getElementById('editModal').classList.remove('hidden');
    } catch (error) {
        showNotification('Error loading ticket', 'error');
    }
}

document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('editId').value;
    const email = document.getElementById('editEmail').value.trim();
    const title = document.getElementById('editTitle').value.trim();
    const description = document.getElementById('editDescription').value.trim();

    let valid = true;

    if (!titleRegex.test(title)) {
        showError('editTitleError', 'Title must be between 3 and 100 characters');
        valid = false;
    } else {
        hideError('editTitleError');
    }

    if (!descriptionRegex.test(description)) {
        showError('editDescriptionError', 'Description must be between 10 and 2000 characters');
        valid = false;
    } else {
        hideError('editDescriptionError');
    }

    if (!valid) return;

    const ticket = {
        customerEmail: email,
        title: title,
        description: description,
        status: 'PENDING',
        reply: null
    };

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticket)
        });

        if (response.ok) {
            showNotification('Ticket updated successfully');
            closeEditModal();
            loadTickets();
        } else {
            showNotification('Failed to update ticket', 'error');
        }
    } catch (error) {
        showNotification('Error updating ticket', 'error');
    }
});

// Delete ticket
async function deleteTicket(id) {
    if (!confirm('Are you sure you want to delete this ticket?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok || response.status === 204) {
            showNotification('Ticket deleted successfully');
            loadTickets();
        } else {
            showNotification('Failed to delete ticket', 'error');
        }
    } catch (error) {
        showNotification('Error deleting ticket', 'error');
    }
}

// Error handlers
function showError(id, message) {
    const el = document.getElementById(id);
    el.textContent = message;
    el.classList.remove('hidden');
}

function hideError(id) {
    document.getElementById(id).classList.add('hidden');
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
});

// Add animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes slide-in {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    .animate-slide-in {
        animation: slide-in 0.3s ease-out;
    }
`;
document.head.appendChild(style);