const API_URL = '/api/support-tickets';

const replyRegex = /^.{10,2000}$/;

document.getElementById('loadAllTickets').addEventListener('click', loadAllTickets);

document.getElementById('closeReplyModal').addEventListener('click', () => {
    document.getElementById('replyModal').classList.add('hidden');
    document.getElementById('replyForm').reset();
    hideError('replyTextError');
});

document.getElementById('replyForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('replyTicketId').value;
    const status = document.getElementById('replyStatus').value;
    const reply = document.getElementById('replyText').value.trim();
    const email = document.getElementById('replyEmail').value;
    const title = document.getElementById('replyTitle').value;
    const description = document.getElementById('replyDescription').value;

    let valid = true;

    if (!replyRegex.test(reply)) {
        showError('replyTextError', 'Reply must be between 10 and 2000 characters');
        valid = false;
    } else {
        hideError('replyTextError');
    }

    if (!valid) return;

    const ticket = {
        customerEmail: email,
        title: title,
        description: description,
        status: status,
        reply: reply
    };

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticket)
        });

        if (response.ok) {
            alert('Ticket updated successfully');
            document.getElementById('replyModal').classList.add('hidden');
            document.getElementById('replyForm').reset();
            loadAllTickets();
        } else {
            alert('Failed to update ticket');
        }
    } catch (error) {
        alert('Error updating ticket');
    }
});

async function loadAllTickets() {
    try {
        const response = await fetch(API_URL);
        const tickets = await response.json();
        displayTickets(tickets);
    } catch (error) {
        alert('Error loading tickets');
    }
}

function displayTickets(tickets) {
    const container = document.getElementById('ticketsList');

    if (tickets.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No tickets found</p>';
        return;
    }

    container.innerHTML = tickets.map(ticket => `
        <div class="border border-gray-200 rounded-lg p-4 mb-4">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <h3 class="font-semibold text-lg text-black">${ticket.title}</h3>
                    <p class="text-sm text-gray-600"><i class="fas fa-envelope mr-2"></i>${ticket.customerEmail}</p>
                </div>
                <div class="flex items-center gap-2">
                    <span class="px-3 py-1 rounded-full text-sm ${getStatusClass(ticket.status)}">${ticket.status}</span>
                    <button onclick="openReplyModal(${ticket.id})" class="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition text-sm">
                        <i class="fas fa-reply mr-1"></i>Update
                    </button>
                    <button onclick="deleteTicket(${ticket.id})" class="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition text-sm">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="text-gray-700 mb-2">${ticket.description}</p>
            ${ticket.reply ? `
                <div class="bg-gray-50 border border-gray-200 rounded p-3 mt-3">
                    <p class="text-sm font-semibold text-black mb-1"><i class="fas fa-comment mr-2"></i>Reply:</p>
                    <p class="text-gray-700">${ticket.reply}</p>
                </div>
            ` : ''}
        </div>
    `).join('');
}

async function openReplyModal(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const ticket = await response.json();

        document.getElementById('replyTicketId').value = ticket.id;
        document.getElementById('replyEmail').value = ticket.customerEmail;
        document.getElementById('replyTitle').value = ticket.title;
        document.getElementById('replyDescription').value = ticket.description;
        document.getElementById('replyStatus').value = ticket.status;
        document.getElementById('replyText').value = ticket.reply || '';

        document.getElementById('replyModal').classList.remove('hidden');
    } catch (error) {
        alert('Error loading ticket');
    }
}

async function deleteTicket(id) {
    if (!confirm('Are you sure you want to delete this ticket?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok || response.status === 204) {
            alert('Ticket deleted successfully');
            loadAllTickets();
        } else {
            alert('Failed to delete ticket');
        }
    } catch (error) {
        alert('Error deleting ticket');
    }
}

function getStatusClass(status) {
    switch(status) {
        case 'PENDING': return 'bg-gray-200 text-black';
        case 'IN_PROGRESS': return 'bg-gray-300 text-black';
        case 'RESOLVED': return 'bg-black text-white';
        default: return 'bg-gray-200 text-black';
    }
}

function showError(id, message) {
    const el = document.getElementById(id);
    el.textContent = message;
    el.classList.remove('hidden');
}

function hideError(id) {
    document.getElementById(id).classList.add('hidden');
}

loadAllTickets();