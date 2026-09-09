<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile - Insurance Portal</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-4">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                    </div>
                    <div>
                        <h1 class="text-xl font-bold text-gray-900">My Profile</h1>
                        <p class="text-sm text-gray-500">Manage your account settings</p>
                    </div>
                </div>
                <button id="logoutBtn" class="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    <span class="font-medium">Logout</span>
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <!-- Success Message -->
            <div id="successMessage" class="hidden bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mx-6 mt-6"></div>

            <!-- Profile View -->
            <div id="profileView" class="p-6">
                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                    <div class="space-y-4">
                        <div class="flex items-center py-4 border-b border-gray-200">
                            <div class="w-32 text-sm font-medium text-gray-500">First Name:</div>
                            <div class="text-gray-900" id="viewFirstName"></div>
                        </div>
                        <div class="flex items-center py-4 border-b border-gray-200">
                            <div class="w-32 text-sm font-medium text-gray-500">Last Name:</div>
                            <div class="text-gray-900" id="viewLastName"></div>
                        </div>
                        <div class="flex items-center py-4 border-b border-gray-200">
                            <div class="w-32 text-sm font-medium text-gray-500">Email:</div>
                            <div class="text-gray-900" id="viewEmail"></div>
                        </div>
                        <div class="flex items-center py-4 border-b border-gray-200">
                            <div class="w-32 text-sm font-medium text-gray-500">Contact:</div>
                            <div class="text-gray-900" id="viewContactNumber"></div>
                        </div>
                        <div class="flex items-center py-4">
                            <div class="w-32 text-sm font-medium text-gray-500">Gender:</div>
                            <div class="text-gray-900" id="viewGender"></div>
                        </div>
                    </div>
                </div>

                <div class="flex gap-4">
                    <button id="editBtn" class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg">
                        Edit Profile
                    </button>
                    <button id="deleteBtn" class="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg">
                        Delete Account
                    </button>
                </div>
            </div>

            <!-- Profile Edit -->
            <div id="profileEdit" class="hidden p-6">
                <form id="editForm" class="space-y-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                            <input type="text" id="firstName" name="firstName" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <span class="error-message text-red-500 text-sm mt-1 hidden"></span>
                        </div>

                        <div>
                            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <input type="text" id="lastName" name="lastName" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <span class="error-message text-red-500 text-sm mt-1 hidden"></span>
                        </div>

                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input type="email" id="email" name="email" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <span class="error-message text-red-500 text-sm mt-1 hidden"></span>
                        </div>

                        <div>
                            <label for="contactNumber" class="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                            <input type="text" id="contactNumber" name="contactNumber" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <span class="error-message text-red-500 text-sm mt-1 hidden"></span>
                        </div>

                        <div>
                            <label for="gender" class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                            <select id="gender" name="gender" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Select Gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                            <span class="error-message text-red-500 text-sm mt-1 hidden"></span>
                        </div>

                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input type="password" id="password" name="password" placeholder="Leave blank to keep current" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <span class="error-message text-red-500 text-sm mt-1 hidden"></span>
                        </div>
                    </div>

                    <div class="flex gap-4 pt-6">
                        <button type="submit" class="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg">
                            Save Changes
                        </button>
                        <button type="button" id="cancelBtn" class="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </main>

    <!-- Delete Modal -->
    <div id="deleteModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                </div>
                <h2 class="text-xl font-bold text-gray-900">Delete Account</h2>
            </div>
            <p class="text-gray-600 mb-6">Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.</p>
            <div class="flex gap-3">
                <button id="confirmDeleteBtn" class="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors">
                    Delete Account
                </button>
                <button id="cancelDeleteBtn" class="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors">
                    Cancel
                </button>
            </div>
        </div>
    </div>

    <script src="/js/profile.js"></script>
</body>
</html>