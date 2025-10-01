<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Profile</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #ffffff;
            color: #0f172a;
        }

        .navbar {
            background: #000000;
            color: #ffffff;
            padding: 1rem 2rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .navbar-content {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .navbar-brand {
            font-size: 1.5rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .navbar-user {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .user-info {
            text-align: right;
        }

        .user-name {
            font-weight: 600;
            font-size: 0.875rem;
        }

        .user-email {
            font-size: 0.75rem;
            opacity: 0.8;
        }

        .btn-logout {
            padding: 0.5rem 1rem;
            background: #ef4444;
            color: #ffffff;
            border: none;
            border-radius: 0.375rem;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .btn-logout:hover {
            background: #dc2626;
            transform: translateY(-1px);
        }

        .container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 2rem;
        }

        .profile-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 1rem;
            padding: 3rem;
            margin-bottom: 2rem;
            color: #ffffff;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .profile-avatar {
            width: 120px;
            height: 120px;
            background: #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            color: #667eea;
            margin-bottom: 1rem;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .profile-header h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }

        .profile-header p {
            opacity: 0.9;
            font-size: 1rem;
        }

        .profile-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
        }

        .card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #f1f5f9;
        }

        .card-header h2 {
            font-size: 1.25rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .info-group {
            margin-bottom: 1.5rem;
        }

        .info-label {
            font-size: 0.813rem;
            color: #64748b;
            font-weight: 500;
            margin-bottom: 0.375rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .info-value {
            font-size: 1rem;
            color: #0f172a;
            font-weight: 500;
        }

        .info-value.empty {
            color: #94a3b8;
            font-style: italic;
        }

        .actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }

        .btn {
            padding: 0.75rem 1.5rem;
            background: #000000;
            color: #ffffff;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 600;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex: 1;
            justify-content: center;
        }

        .btn:hover {
            background: #18181b;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .btn-danger {
            background: #ef4444;
        }

        .btn-danger:hover {
            background: #dc2626;
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            z-index: 1000;
            animation: fadeIn 0.2s;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .modal-content {
            background: #ffffff;
            padding: 2rem;
            border-radius: 1rem;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            animation: slideUp 0.3s;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }

        .modal-header h2 {
            font-size: 1.5rem;
            font-weight: 700;
        }

        .close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #64748b;
            transition: color 0.2s;
        }

        .close:hover {
            color: #0f172a;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group.full-width {
            grid-column: 1 / -1;
        }

        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            font-size: 0.875rem;
            color: #334155;
        }

        label .required {
            color: #ef4444;
        }

        input, select, textarea {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 2px solid #e2e8f0;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            transition: all 0.2s;
            background: #f8fafc;
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
            background: #ffffff;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        textarea {
            resize: vertical;
            min-height: 80px;
        }

        .error {
            color: #ef4444;
            font-size: 0.813rem;
            margin-top: 0.375rem;
            display: none;
            animation: shake 0.3s;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        .error.active {
            display: block;
        }

        input.invalid, select.invalid, textarea.invalid {
            border-color: #ef4444;
            background: #fef2f2;
        }

        .toast {
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: #000000;
            color: #ffffff;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            display: none;
            align-items: center;
            gap: 0.75rem;
            z-index: 2000;
            animation: slideInRight 0.3s;
            max-width: 400px;
        }

        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .toast.active {
            display: flex;
        }

        .toast.success {
            background: #10b981;
        }

        .toast.error {
            background: #ef4444;
        }

        .loading-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            z-index: 3000;
            align-items: center;
            justify-content: center;
        }

        .loading-overlay.active {
            display: flex;
        }

        .spinner {
            border: 4px solid #f1f5f9;
            border-top: 4px solid #ffffff;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
            .profile-content {
                grid-template-columns: 1fr;
            }

            .form-row {
                grid-template-columns: 1fr;
            }

            .actions {
                flex-direction: column;
            }

            .navbar-user {
                flex-direction: column;
                align-items: flex-end;
                gap: 0.5rem;
            }
        }
    </style>
</head>
<body>
<nav class="navbar">
    <div class="navbar-content">
        <div class="navbar-brand">
            <i class="fas fa-user-circle"></i>
            My Profile
        </div>
        <div class="navbar-user">
            <div class="user-info">
                <div class="user-name" id="navUserName"></div>
                <div class="user-email" id="navUserEmail"></div>
            </div>
            <button class="btn-logout" onclick="handleLogout()">
                <i class="fas fa-sign-out-alt"></i>
                Logout
            </button>
        </div>
    </div>
</nav>

<div class="container">
    <div class="profile-header">
        <div class="profile-avatar">
            <i class="fas fa-user"></i>
        </div>
        <h1 id="profileName"></h1>
        <p id="profileEmail"></p>
    </div>

    <div class="profile-content">
        <div class="card">
            <div class="card-header">
                <h2><i class="fas fa-info-circle"></i> Personal Information</h2>
            </div>
            <div class="info-group">
                <div class="info-label">Full Name</div>
                <div class="info-value" id="infoName"></div>
            </div>
            <div class="info-group">
                <div class="info-label">Date of Birth</div>
                <div class="info-value" id="infoDob"></div>
            </div>
            <div class="info-group">
                <div class="info-label">Gender</div>
                <div class="info-value" id="infoGender"></div>
            </div>
            <div class="info-group">
                <div class="info-label">Home Address</div>
                <div class="info-value" id="infoAddress"></div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2><i class="fas fa-address-book"></i> Contact Details</h2>
            </div>
            <div class="info-group">
                <div class="info-label">Email Address</div>
                <div class="info-value" id="infoEmailAddress"></div>
            </div>
            <div class="info-group">
                <div class="info-label">Phone Number</div>
                <div class="info-value" id="infoPhone"></div>
            </div>
            <div class="info-group">
                <div class="info-label">Driving License Number</div>
                <div class="info-value" id="infoLicense"></div>
            </div>
        </div>
    </div>

    <div class="actions">
        <button class="btn" onclick="openEditModal()">
            <i class="fas fa-edit"></i>
            Update Profile
        </button>
        <button class="btn btn-danger" onclick="confirmDelete()">
            <i class="fas fa-trash"></i>
            Delete Account
        </button>
    </div>
</div>

<div class="modal" id="editModal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Update Profile</h2>
            <button class="close" onclick="closeModal()">&times;</button>
        </div>
        <form id="updateForm" onsubmit="handleUpdate(event)">
            <div class="form-group">
                <label for="fullName">Full Name <span class="required">*</span></label>
                <input type="text" id="fullName" required>
                <div class="error" id="fullNameError"></div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="dateOfBirth">Date of Birth <span class="required">*</span></label>
                    <input type="date" id="dateOfBirth" required>
                    <div class="error" id="dateOfBirthError"></div>
                </div>

                <div class="form-group">
                    <label for="gender">Gender <span class="required">*</span></label>
                    <select id="gender" required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <div class="error" id="genderError"></div>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="phoneNumber">Phone Number <span class="required">*</span></label>
                    <input type="tel" id="phoneNumber" required>
                    <div class="error" id="phoneNumberError"></div>
                </div>

                <div class="form-group">
                    <label for="emailAddress">Email Address <span class="required">*</span></label>
                    <input type="email" id="emailAddress" required>
                    <div class="error" id="emailAddressError"></div>
                </div>
            </div>

            <div class="form-group">
                <label for="homeAddress">Home Address</label>
                <textarea id="homeAddress"></textarea>
                <div class="error" id="homeAddressError"></div>
            </div>

            <div class="form-group">
                <label for="drivingLicenseNumber">Driving License Number</label>
                <input type="text" id="drivingLicenseNumber">
                <div class="error" id="drivingLicenseNumberError"></div>
            </div>

            <button type="submit" class="btn" style="width: 100%;">
                <i class="fas fa-save"></i>
                <span>Save Changes</span>
            </button>
        </form>
    </div>
</div>

<div class="loading-overlay" id="loadingOverlay">
    <div class="spinner"></div>
</div>

<div class="toast" id="toast">
    <i class="fas fa-check-circle"></i>
    <span id="toastMessage"></span>
</div>

<script src="/js/profile.js"></script>
</body>
</html>