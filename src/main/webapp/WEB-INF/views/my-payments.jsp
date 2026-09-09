<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Payments - Insurance Portal</title>
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
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                        </svg>
                    </div>
                    <div>
                        <h1 class="text-xl font-bold text-gray-900">My Payments</h1>
                        <p class="text-sm text-gray-500">Manage your payment history</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <button id="addPaymentBtn" class="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                        Add Payment
                    </button>
                    <button id="backBtn" class="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <p class="text-blue-100 text-sm font-medium">Total Payments</p>
                        <h3 class="text-3xl font-bold mt-2" id="totalPayments">0</h3>
                    </div>
                    <div class="bg-white bg-opacity-20 p-3 rounded-lg">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                        </svg>
                    </div>
                </div>
                <p class="text-blue-100 text-sm">All time payments</p>
            </div>

            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <p class="text-green-100 text-sm font-medium">Completed</p>
                        <h3 class="text-3xl font-bold mt-2" id="completedPayments">0</h3>
                    </div>
                    <div class="bg-white bg-opacity-20 p-3 rounded-lg">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                </div>
                <p class="text-green-100 text-sm">Successfully processed</p>
            </div>

            <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <p class="text-orange-100 text-sm font-medium">Pending</p>
                        <h3 class="text-3xl font-bold mt-2" id="pendingPayments">0</h3>
                    </div>
                    <div class="bg-white bg-opacity-20 p-3 rounded-lg">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                </div>
                <p class="text-orange-100 text-sm">Awaiting processing</p>
            </div>
        </div>

        <!-- Payments Table -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-xl font-bold text-gray-900">Payment History</h2>
            </div>
            
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="paymentsTableBody" class="bg-white divide-y divide-gray-200">
                        <!-- Payment rows will be populated by JavaScript -->
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <!-- Add Payment Modal -->
    <div id="addPaymentModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Add New Payment</h2>
                <button id="closeAddModal" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <form id="addPaymentForm" class="space-y-6">
                <div>
                    <label for="paymentAmount" class="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
                    <input type="number" id="paymentAmount" name="amount" step="0.01" min="0.01" required 
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <span class="error-message text-red-500 text-sm mt-1 hidden"></span>
                </div>

                <div>
                    <label for="paymentMethod" class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <select id="paymentMethod" name="paymentMethod" required 
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select Payment Method</option>
                        <option value="card">Credit/Debit Card</option>
                        <option value="bank">Bank Transfer</option>
                        <option value="cash">Cash</option>
                    </select>
                    <span class="error-message text-red-500 text-sm mt-1 hidden"></span>
                </div>

                <!-- Card Payment Interface -->
                <div id="cardPaymentInterface" class="hidden space-y-4 p-4 bg-gray-50 rounded-lg">
                    <h3 class="text-lg font-medium text-gray-900">Card Details</h3>
                    
                    <div>
                        <label for="cardNumber" class="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19"
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <span class="error-message text-red-500 text-sm mt-1 hidden"></span>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="expiryDate" class="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                            <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" maxlength="5"
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <span class="error-message text-red-500 text-sm mt-1 hidden"></span>
                        </div>
                        <div>
                            <label for="cvv" class="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                            <input type="text" id="cvv" name="cvv" placeholder="123" maxlength="4"
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <span class="error-message text-red-500 text-sm mt-1 hidden"></span>
                        </div>
                    </div>

                    <div>
                        <label for="cardholderName" class="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                        <input type="text" id="cardholderName" name="cardholderName" placeholder="John Doe"
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <span class="error-message text-red-500 text-sm mt-1 hidden"></span>
                    </div>
                </div>

                <div class="flex gap-4">
                    <button type="submit" class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
                        Process Payment
                    </button>
                    <button type="button" id="cancelAddPayment" class="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Edit Payment Modal -->
    <div id="editPaymentModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Edit Payment</h2>
                <button id="closeEditModal" class="text-gray-400 hover:text-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <form id="editPaymentForm" class="space-y-6">
                <input type="hidden" id="editPaymentId">
                
                <div>
                    <label for="editPaymentAmount" class="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
                    <input type="number" id="editPaymentAmount" name="amount" step="0.01" min="0.01" required 
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <span class="error-message text-red-500 text-sm mt-1 hidden"></span>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div class="px-4 py-3 bg-gray-100 rounded-lg text-gray-600">
                        <span id="editPaymentStatus">PENDING</span>
                        <p class="text-xs text-gray-500 mt-1">Status can only be changed by administrators</p>
                    </div>
                </div>

                <div class="flex gap-4">
                    <button type="submit" class="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200">
                        Update Payment
                    </button>
                    <button type="button" id="cancelEditPayment" class="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div id="deletePaymentModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                </div>
                <h2 class="text-xl font-bold text-gray-900">Delete Payment</h2>
            </div>
            <p class="text-gray-600 mb-6">Are you sure you want to delete this payment? This action cannot be undone.</p>
            <div class="flex gap-3">
                <button id="confirmDeletePayment" class="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors">
                    Delete Payment
                </button>
                <button id="cancelDeletePayment" class="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors">
                    Cancel
                </button>
            </div>
        </div>
    </div>

    <script src="/js/payments.js"></script>
</body>
</html>
