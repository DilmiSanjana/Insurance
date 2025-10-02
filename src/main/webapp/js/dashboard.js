let currentUser = null;

const dummyBookings = [
    { id: 1, bookingRef: 'BK001', train: 'Colombo Express', from: 'Colombo Fort', to: 'Kandy', date: '2025-10-15', time: '08:30 AM', seats: 2, class: 'First Class', status: 'CONFIRMED' },
    { id: 2, bookingRef: 'BK002', train: 'Rajarata Rajini', from: 'Colombo Fort', to: 'Anuradhapura', date: '2025-10-20', time: '06:00 AM', seats: 1, class: 'Second Class', status: 'PENDING' },
    { id: 3, bookingRef: 'BK003', train: 'Udarata Menike', from: 'Badulla', to: 'Colombo Fort', date: '2025-09-28', time: '09:45 AM', seats: 3, class: 'Third Class', status: 'COMPLETED' },
    { id: 4, bookingRef: 'BK004', train: 'Galu Kumari', from: 'Colombo Fort', to: 'Galle', date: '2025-10-05', time: '07:15 AM', seats: 2, class: 'First Class', status: 'CANCELLED' }
];

const dummyTickets = [
    { id: 1, ticketNo: 'TKT001', bookingRef: 'BK001', train: 'Colombo Express', from: 'Colombo Fort', to: 'Kandy', date: '2025-10-15', time: '08:30 AM', seat: '12A', class: 'First Class', passengerName: 'John Doe', status: 'CONFIRMED' },
    { id: 2, ticketNo: 'TKT002', bookingRef: 'BK001', train: 'Colombo Express', from: 'Colombo Fort', to: 'Kandy', date: '2025-10-15', time: '08:30 AM', seat: '12B', class: 'First Class', passengerName: 'Jane Doe', status: 'CONFIRMED' },
    { id: 3, ticketNo: 'TKT003', bookingRef: 'BK002', train: 'Rajarata Rajini', from: 'Colombo Fort', to: 'Anuradhapura', date: '2025-10-20', time: '06:00 AM', seat: '45C', class: 'Second Class', passengerName: 'John Doe', status: 'PENDING' }
];

const dummyPayments = [
    { id: 1, paymentId: 'PAY001', bookingRef: 'BK001', amount: 5000, method: 'Credit Card', date: '2025-10-01', time: '02:30 PM', status: 'COMPLETED' },
    { id: 2, paymentId: 'PAY002', bookingRef: 'BK002', amount: 2500, method: 'Debit Card', date: '2025-10-02', time: '10:15 AM', status: 'PENDING' },
    { id: 3, paymentId: 'PAY003', bookingRef: 'BK003', amount: 3500, method: 'Cash', date: '2025-09-25', time: '11:45 AM', status: 'COMPLETED' },
    { id: 4, paymentId: 'PAY004', bookingRef: 'BK004', amount: 4500, method: 'Credit Card', date: '2025-09-30', time: '03:20 PM', status: 'COMPLETED' }
];

window.addEventListener('DOMContentLoaded', () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
        window.location.href = '/login';
        return;
    }
    
    currentUser = JSON.parse(userData);
    loadDashboard();
});

function loadDashboard() {
    document.getElementById('userName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    document.getElementById('bookingsCount').textContent = dummyBookings.length;
    document.getElementById('ticketsCount').textContent = dummyTickets.filter(t => t.status === 'CONFIRMED' || t.status === 'PENDING').length;
    document.getElementById('paymentsCount').textContent = dummyPayments.length;
}

document.querySelectorAll('.btn-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const section = e.target.dataset.section;
        showSection(section);
    });
});

document.querySelectorAll('.btn-back').forEach(btn => {
    btn.addEventListener('click', () => {
        showDashboard();
    });
});

function showSection(section) {
    document.getElementById('dashboardView').style.display = 'none';
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    if (section === 'bookings') {
        document.getElementById('bookingsSection').classList.add('active');
        loadBookings();
    } else if (section === 'tickets') {
        document.getElementById('ticketsSection').classList.add('active');
        loadTickets();
    } else if (section === 'payments') {
        document.getElementById('paymentsSection').classList.add('active');
        loadPayments();
    }
}

function showDashboard() {
    document.getElementById('dashboardView').style.display = 'block';
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
}

function loadBookings() {
    const container = document.getElementById('bookingsTable');
    
    if (dummyBookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <h3>No Bookings Found</h3>
                <p>You haven't made any bookings yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Booking Ref</th>
                    <th>Train</th>
                    <th>Route</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Seats</th>
                    <th>Class</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${dummyBookings.map(booking => `
                    <tr>
                        <td>${booking.bookingRef}</td>
                        <td>${booking.train}</td>
                        <td>${booking.from} → ${booking.to}</td>
                        <td>${booking.date}</td>
                        <td>${booking.time}</td>
                        <td>${booking.seats}</td>
                        <td>${booking.class}</td>
                        <td><span class="status status-${booking.status.toLowerCase()}">${booking.status}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function loadTickets() {
    const container = document.getElementById('ticketsTable');
    
    if (dummyTickets.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎟️</div>
                <h3>No Tickets Found</h3>
                <p>You don't have any tickets</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Ticket No</th>
                    <th>Booking Ref</th>
                    <th>Train</th>
                    <th>Route</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Seat</th>
                    <th>Passenger</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${dummyTickets.map(ticket => `
                    <tr>
                        <td>${ticket.ticketNo}</td>
                        <td>${ticket.bookingRef}</td>
                        <td>${ticket.train}</td>
                        <td>${ticket.from} → ${ticket.to}</td>
                        <td>${ticket.date}</td>
                        <td>${ticket.time}</td>
                        <td>${ticket.seat}</td>
                        <td>${ticket.passengerName}</td>
                        <td><span class="status status-${ticket.status.toLowerCase()}">${ticket.status}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function loadPayments() {
    const container = document.getElementById('paymentsTable');
    
    if (dummyPayments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💳</div>
                <h3>No Payments Found</h3>
                <p>You haven't made any payments yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Payment ID</th>
                    <th>Booking Ref</th>
                    <th>Amount (LKR)</th>
                    <th>Method</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${dummyPayments.map(payment => `
                    <tr>
                        <td>${payment.paymentId}</td>
                        <td>${payment.bookingRef}</td>
                        <td>${payment.amount.toLocaleString()}</td>
                        <td>${payment.method}</td>
                        <td>${payment.date}</td>
                        <td>${payment.time}</td>
                        <td><span class="status status-${payment.status.toLowerCase()}">${payment.status}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

document.getElementById('profileBtn').addEventListener('click', () => {
    window.location.href = '/profile';
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
});