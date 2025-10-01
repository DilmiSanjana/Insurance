<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Customer Registration</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #6f727f 0%, #bda7d3 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }

        .register-container {
            background: #ffffff;
            border-radius: 1rem;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            width: 100%;
            max-width: 600px;
            padding: 3rem;
            animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .register-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .register-header i {
            font-size: 3rem;
            color: #667eea;
            margin-bottom: 1rem;
        }

        .register-header h1 {
            font-size: 2rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 0.5rem;
        }

        .register-header p {
            color: #64748b;
            font-size: 0.875rem;
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

        .btn {
            width: 100%;
            padding: 0.875rem 1.5rem;
            background: #000000;
            color: #ffffff;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 1rem;
        }

        .btn:hover {
            background: #18181b;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .btn:active {
            transform: translateY(0);
        }

        .btn:disabled {
            background: #94a3b8;
            cursor: not-allowed;
            transform: none;
        }

        .login-link {
            text-align: center;
            margin-top: 1.5rem;
            color: #64748b;
            font-size: 0.875rem;
        }

        .login-link a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.2s;
        }

        .login-link a:hover {
            color: #764ba2;
            text-decoration: underline;
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

        @media (max-width: 640px) {
            .form-row {
                grid-template-columns: 1fr;
            }

            .register-container {
                padding: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="register-container">
        <div class="register-header">
            <i class="fas fa-user-plus"></i>
            <h1>Create Account</h1>
            <p>Fill in your details to register</p>
        </div>

        <form id="registerForm" onsubmit="handleSubmit(event)">
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
                    <input type="tel" id="phoneNumber" placeholder="+94771234567" required>
                    <div class="error" id="phoneNumberError"></div>
                </div>

                <div class="form-group">
                    <label for="emailAddress">Email Address <span class="required">*</span></label>
                    <input type="email" id="emailAddress" placeholder="you@example.com" required>
                    <div class="error" id="emailAddressError"></div>
                </div>
            </div>

            <div class="form-group">
                <label for="homeAddress">Home Address</label>
                <textarea id="homeAddress" placeholder="Enter your home address"></textarea>
                <div class="error" id="homeAddressError"></div>
            </div>

            <div class="form-group">
                <label for="drivingLicenseNumber">Driving License Number</label>
                <input type="text" id="drivingLicenseNumber" placeholder="B1234567">
                <div class="error" id="drivingLicenseNumberError"></div>
            </div>

            <div class="form-group">
                <label for="password">Password <span class="required">*</span></label>
                <input type="password" id="password" placeholder="Enter a strong password" required autocomplete="new-password">
                <div class="error" id="passwordError"></div>
            </div>

            <button type="submit" class="btn" id="submitBtn">
                <i class="fas fa-user-plus"></i>
                <span>Create Account</span>
            </button>
        </form>

        <div class="login-link">
            Already have an account? <a href="/login">Login here</a>
        </div>
    </div>

    <div class="loading-overlay" id="loadingOverlay">
        <div class="spinner"></div>
    </div>

    <div class="toast" id="toast">
        <i class="fas fa-check-circle"></i>
        <span id="toastMessage"></span>
    </div>

    <script src="/js/register.js"></script>
</body>
</html>