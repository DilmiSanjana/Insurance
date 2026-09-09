<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Policy - Insurance Portal</title>
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <div>
                    <h1 class="text-xl font-bold text-gray-900">Create Policy</h1>
                    <p class="text-sm text-gray-500">Add a new insurance policy</p>
                </div>
            </div>
            <button onclick="history.back()" class="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span class="font-medium">Back</span>
            </button>
        </div>
    </div>
</header>

<!-- Main Content -->
<main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <div class="flex items-center space-x-3">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <h2 class="text-2xl font-bold text-white">New Policy Form</h2>
            </div>
        </div>

        <form id="policyForm" class="p-6 space-y-6" novalidate>
            <!-- Policy Title -->
            <div>
                <label for="title" class="block text-sm font-semibold text-gray-700 mb-2">
                    Policy Title <span class="text-red-500">*</span>
                </label>
                <input
                        type="text"
                        id="title"
                        maxlength="100"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter policy title (5-100 characters)"
                        required
                >
                <div class="error hidden text-red-600 text-sm mt-1" id="titleErr"></div>
            </div>

            <!-- Description -->
            <div>
                <label for="description" class="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span class="text-red-500">*</span>
                </label>
                <textarea
                        id="description"
                        maxlength="1000"
                        rows="4"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
                        placeholder="Enter policy description (10-1000 characters)"
                        required
                ></textarea>
                <div class="error hidden text-red-600 text-sm mt-1" id="descErr"></div>
            </div>

            <!-- Additional Details -->
            <div>
                <label for="details" class="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Details
                </label>
                <textarea
                        id="details"
                        maxlength="2000"
                        rows="5"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
                        placeholder="Enter additional details (optional, max 2000 characters)"
                ></textarea>
            </div>

            <!-- Policy ID Number -->
            <div>
                <label for="policyId" class="block text-sm font-semibold text-gray-700 mb-2">
                    Policy ID Number <span class="text-red-500">*</span>
                </label>
                <input
                        type="text"
                        id="policyId"
                        maxlength="50"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all uppercase"
                        placeholder="Enter policy ID (3-50 alphanumeric characters)"
                        required
                >
                <div class="error hidden text-red-600 text-sm mt-1" id="idErr"></div>
            </div>

            <!-- Active Status -->
            <div class="flex items-center">
                <input
                        type="checkbox"
                        id="active"
                        class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                <label for="active" class="ml-2 text-sm font-medium text-gray-700">
                    Active Policy
                </label>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                        type="button"
                        onclick="history.back()"
                        class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                    <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Cancel
                </button>
                <button
                        type="submit"
                        class="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                    <svg class="spinner hidden animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span class="btn-text">Save Policy</span>
                </button>
            </div>
        </form>
    </div>

    <!-- Help Section -->
    <div class="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div class="flex items-start space-x-3">
            <svg class="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
                <h3 class="font-semibold text-blue-900 mb-2">Policy Creation Guidelines</h3>
                <ul class="text-sm text-blue-800 space-y-1">
                    <li>• Policy Title: 5-100 characters (letters, numbers, spaces, and basic punctuation)</li>
                    <li>• Description: 10-1000 characters minimum</li>
                    <li>• Policy ID: 3-50 alphanumeric characters (will be converted to uppercase)</li>
                    <li>• Mark as "Active" to make the policy immediately available</li>
                </ul>
            </div>
        </div>
    </div>
</main>

<script src="/js/policy_management/create.js"></script>
</body>
</html>