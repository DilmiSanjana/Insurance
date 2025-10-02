<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile - Train Reservation System</title>
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
            max-width: 800px;
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

        .btn-logout {
            padding: 10px 20px;
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
        }

        .btn-logout:hover {
            background: #c0392b;
        }

        .profile-card {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .profile-view {
            display: block;
        }

        .profile-edit {
            display: none;
        }

        .profile-info {
            margin-bottom: 30px;
        }

        .info-row {
            display: flex;
            padding: 15px 0;
            border-bottom: 1px solid #eee;
        }

        .info-row:last-child {
            border-bottom: none;
        }

        .info-label {
            font-weight: 600;
            color: #555;
            width: 180px;
        }

        .info-value {
            color: #333;
            flex: 1;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            color: #333;
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 14px;
        }

        .form-group input,
        .form-group select {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: #2a5298;
        }

        .form-group.error input,
        .form-group.error select {
            border-color: #e74c3c;
        }

        .error-message {
            color: #e74c3c;
            font-size: 12px;
            margin-top: 5px;
            display: none;
        }

        .form-group.error .error-message {
            display: block;
        }

        .action-buttons {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }

        .btn {
            flex: 1;
            padding: 14px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .btn:hover {
            transform: translateY(-2px);
        }

        .btn-edit {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
        }

        .btn-delete {
            background: #e74c3c;
            color: white;
        }

        .btn-save {
            background: #27ae60;
            color: white;
        }

        .btn-cancel {
            background: #95a5a6;
            color: white;
        }

        .success-message {
            background: #2ecc71;
            color: white;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 20px;
            display: none;
            text-align: center;
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .modal-content {
            background: white;
            border-radius: 12px;
            padding: 30px;
            max-width: 400px;
            width: 90%;
        }

        .modal-content h2 {
            color: #e74c3c;
            margin-bottom: 15px;
        }

        .modal-content p {
            color: #666;
            margin-bottom: 25px;
        }

        .modal-buttons {
            display: flex;
            gap: 15px;
        }

        .btn-confirm {
            flex: 1;
            padding: 12px;
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
        }

        .btn-cancel-modal {
            flex: 1;
            padding: 12px;
            background: #95a5a6;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>My Profile</h1>
            <button class="btn-logout" id="logoutBtn">Logout</button>
        </div>

        <div class="profile-card">
            <div class="success-message" id="successMessage"></div>

            <div class="profile-view" id="profileView">
                <div class="profile-info">
                    <div class="info-row">
                        <div class="info-label">First Name:</div>
                        <div class="info-value" id="viewFirstName"></div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Last Name:</div>
                        <div class="info-value" id="viewLastName"></div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Email:</div>
                        <div class="info-value" id="viewEmail"></div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Contact Number:</div>
                        <div class="info-value" id="viewContactNumber"></div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Gender:</div>
                        <div class="info-value" id="viewGender"></div>
                    </div>
                </div>

                <div class="action-buttons">
                    <button class="btn btn-edit" id="editBtn">Edit Profile</button>
                    <button class="btn btn-delete" id="deleteBtn">Delete Account</button>
                </div>
            </div>

            <div class="profile-edit" id="profileEdit">
                <form id="editForm">
                    <div class="form-group">
                        <label for="firstName">First Name</label>
                        <input type="text" id="firstName" name="firstName" required>
                        <span class="error-message"></span>
                    </div>

                    <div class="form-group">
                        <label for="lastName">Last Name</label>
                        <input type="text" id="lastName" name="lastName" required>
                        <span class="error-message"></span>
                    </div>

                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                        <span class="error-message"></span>
                    </div>

                    <div class="form-group">
                        <label for="contactNumber">Contact Number</label>
                        <input type="text" id="contactNumber" name="contactNumber" required>
                        <span class="error-message"></span>
                    </div>

                    <div class="form-group">
                        <label for="gender">Gender</label>
                        <select id="gender" name="gender" required>
                            <option value="">Select Gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                        <span class="error-message"></span>
                    </div>

                    <div class="form-group">
                        <label for="password">Password (leave blank to keep current)</label>
                        <input type="password" id="password" name="password">
                        <span class="error-message"></span>
                    </div>

                    <div class="action-buttons">
                        <button type="submit" class="btn btn-save">Save Changes</button>
                        <button type="button" class="btn btn-cancel" id="cancelBtn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal" id="deleteModal">
        <div class="modal-content">
            <h2>Delete Account</h2>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div class="modal-buttons">
                <button class="btn-confirm" id="confirmDeleteBtn">Delete</button>
                <button class="btn-cancel-modal" id="cancelDeleteBtn">Cancel</button>
            </div>
        </div>
    </div>

    <script src="/js/profile.js"></script>
</body>
</html>