<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Train Reservation System</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            background: white;
            border-radius: 12px;
            padding: 20px 30px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .header h1 {
            color: #1e3c72;
            font-size: 24px;
        }

        .header-right {
            display: flex;
            gap: 15px;
            align-items: center;
        }

        .user-name {
            color: #555;
            font-weight: 600;
        }

        .btn-profile,
        .btn-logout {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
        }

        .btn-profile {
            background: #2a5298;
            color: white;
        }

        .btn-profile:hover {
            background: #1e3c72;
        }

        .btn-logout {
            background: #e74c3c;
            color: white;
        }

        .btn-logout:hover {
            background: #c0392b;
        }

        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s;
        }

        .card:hover {
            transform: translateY(-5px);
        }

        .card-icon {
            width: 50px;
            height: 50px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin-bottom: 15px;
        }

        .card-bookings .card-icon {
            background: #3498db;
            color: white;
        }

        .card-tickets .card-icon {
            background: #e74c3c;
            color: white;
        }

        .card-payments .card-icon {
            background: #27ae60;
            color: white;
        }

        .card h3 {
            color: #333;
            font-size: 18px;
            margin-bottom: 10px;
        }

        .card p {
            color: #666;
            font-size: 14px;
            margin-bottom: 20px;
        }

        .card-count {
            font-size: 32px;
            font-weight: 700;
            color: #1e3c72;
            margin-bottom: 15px;
        }

        .btn-view {
            width: 100%;
            padding: 12px;
            background: #2a5298;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
        }

        .btn-view:hover {
            background: #1e3c72;
        }

        .section {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            display: none;
        }

        .section.active {
            display: block;
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid #eee;
        }

        .section-header h2 {
            color: #1e3c72;
            font-size: 22px;
        }

        .btn-back {
            padding: 10px 20px;
            background: #95a5a6;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
        }

        .btn-back:hover {
            background: #7f8c8d;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            background: #f8f9fa;
        }

        th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            color: #333;
            border-bottom: 2px solid #ddd;
        }

        td {
            padding: 15px;
            border-bottom: 1px solid #eee;
            color: #555;
        }

        tr:hover {
            background: #f8f9fa;
        }

        .status {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }

        .status-confirmed {
            background: #d4edda;
            color: #155724;
        }

        .status-pending {
            background: #fff3cd;
            color: #856404;
        }

        .status-cancelled {
            background: #f8d7da;
            color: #721c24;
        }

        .status-completed {
            background: #d1ecf1;
            color: #0c5460;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #999;
        }

        .empty-state-icon {
            font-size: 60px;
            margin-bottom: 20px;
        }

        .empty-state h3 {
            color: #666;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Dashboard</h1>
            <div class="header-right">
                <span class="user-name" id="userName"></span>
                <button class="btn-profile" id="profileBtn">Profile</button>
                <button class="btn-logout" id="logoutBtn">Logout</button>
            </div>
        </div>

        <div id="dashboardView">
            <div class="dashboard-grid">
                <div class="card card-bookings">
                    <div class="card-icon">🎫</div>
                    <h3>My Bookings</h3>
                    <div class="card-count" id="bookingsCount">0</div>
                    <p>View all your train bookings</p>
                    <button class="btn-view" data-section="bookings">View Bookings</button>
                </div>

                <div class="card card-tickets">
                    <div class="card-icon">🎟️</div>
                    <h3>Active Tickets</h3>
                    <div class="card-count" id="ticketsCount">0</div>
                    <p>View your active tickets</p>
                    <button class="btn-view" data-section="tickets">View Tickets</button>
                </div>

                <div class="card card-payments">
                    <div class="card-icon">💳</div>
                    <h3>Payment History</h3>
                    <div class="card-count" id="paymentsCount">0</div>
                    <p>View all payment transactions</p>
                    <button class="btn-view" data-section="payments">View Payments</button>
                </div>
            </div>
        </div>

        <div class="section" id="bookingsSection">
            <div class="section-header">
                <h2>Booking History</h2>
                <button class="btn-back" data-back="dashboard">Back to Dashboard</button>
            </div>
            <div id="bookingsTable"></div>
        </div>

        <div class="section" id="ticketsSection">
            <div class="section-header">
                <h2>Ticket Details</h2>
                <button class="btn-back" data-back="dashboard">Back to Dashboard</button>
            </div>
            <div id="ticketsTable"></div>
        </div>

        <div class="section" id="paymentsSection">
            <div class="section-header">
                <h2>Payment Details</h2>
                <button class="btn-back" data-back="dashboard">Back to Dashboard</button>
            </div>
            <div id="paymentsTable"></div>
        </div>
    </div>

    <script src="/js/dashboard.js"></script>
</body>
</html>