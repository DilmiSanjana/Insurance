<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Claims</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-50">
    <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
            <div class="flex items-center space-x-3">
                <i class="fas fa-file-invoice-dollar text-2xl text-indigo-600"></i>
                <h1 class="text-xl font-semibold">My Claims</h1>
            </div>
            <div class="space-x-2">
                <button id="newClaimBtn" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">New Claim</button>
            </div>
        </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-6">
        <!-- Filters -->
        <div class="bg-white shadow rounded-lg p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="relative">
                    <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input id="searchInput" type="text" placeholder="Search by email, claim ID, type..." class="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500">
                </div>
                <div class="relative">
                    <i class="fas fa-clipboard-check absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <select id="statusFilter" class="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500">
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
                <div class="relative">
                    <i class="fas fa-tag absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <select id="typeFilter" class="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500">
                        <option value="">All Types</option>
                        <option value="CHILD">Child</option>
                        <option value="ADULT">Adult</option>
                        <option value="SENIOR">Senior</option>
                        <option value="CORPORATE">Corporate</option>
                    </select>
                </div>
                <div class="flex items-center space-x-2">
                    <label for="futureOnly" class="text-sm text-gray-600">Future dates only</label>
                    <input id="futureOnly" type="checkbox" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
                </div>
            </div>
        </div>

        <!-- Table -->
        <div class="bg-white shadow rounded-lg">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim ID</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Filled</th>
                            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="claimsTableBody" class="bg-white divide-y divide-gray-200">
                        <!-- Rows injected via my-claims.js -->
                    </tbody>
                </table>
            </div>
            <div id="emptyState" class="p-6 text-center text-gray-500 hidden">No claims found</div>
            <div id="loadingState" class="p-6 text-center text-gray-500 hidden">
                <i class="fas fa-spinner fa-spin"></i> Loading claims...
            </div>
        </div>
    </main>

    <!-- Create/Edit Modal -->
    <div id="claimModal" class="fixed inset-0 z-50 hidden">
        <div class="absolute inset-0 bg-black bg-opacity-40" data-modal-close></div>
        <div class="relative bg-white rounded-lg shadow max-w-xl mx-auto mt-24 p-6">
            <div class="flex items-center justify-between mb-4">
                <h2 id="claimModalTitle" class="text-lg font-semibold">New Claim</h2>
                <button class="text-gray-400 hover:text-gray-600" data-modal-close>
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="claimForm" class="space-y-4">
                <div>

                    <input value="12313" id="claimId" type="hidden" class="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500" />
                    <div id="claimIdError" class="text-red-600 text-sm mt-1"></div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Claim Amount</label>
                    <input id="claimAmount" type="number" step="0.01" min="0" class="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500" />
                    <div id="claimAmountError" class="text-red-600 text-sm mt-1"></div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">User Email</label>
                    <input id="userEmail" type="email" class="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500" />
                    <div id="userEmailError" class="text-red-600 text-sm mt-1"></div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Type</label>
                    <select id="type" class="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500">
                        <option value="CHILD">Child</option>
                        <option value="ADULT">Adult</option>
                        <option value="SENIOR">Senior</option>
                        <option value="CORPORATE">Corporate</option>
                    </select>
                    <div id="typeError" class="text-red-600 text-sm mt-1"></div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Status</label>
                    <select disabled id="status" class="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500">
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                    <div id="statusError" class="text-red-600 text-sm mt-1"></div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Date Filled</label>
                    <input id="dateFilled" type="date" class="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500" />
                    <div id="dateFilledError" class="text-red-600 text-sm mt-1"></div>
                </div>
                <div class="flex justify-end space-x-2 pt-2">
                    <button type="button" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300" data-modal-close>Cancel</button>
                    <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save</button>
                </div>
            </form>
        </div>
    </div>

    <!-- View Modal -->
    <div id="viewClaimModal" class="fixed inset-0 z-50 hidden">
        <div class="absolute inset-0 bg-black bg-opacity-40" data-modal-close></div>
        <div class="relative bg-white rounded-lg shadow max-w-xl mx-auto mt-24 p-6">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold">Claim Details</h2>
                <button class="text-gray-400 hover:text-gray-600" data-modal-close>
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-2 text-sm text-gray-700" id="viewClaimContent">
                <!-- Filled via my-claims.js -->
            </div>
        </div>
    </div>

    <!-- Toast -->
    <div id="toast" class="fixed bottom-6 right-6 hidden">
        <div class="flex items-center space-x-2 bg-white border shadow rounded-md px-4 py-3">
            <i id="toastIcon" class="fas fa-info-circle text-gray-500"></i>
            <span id="toastMessage" class="text-sm text-gray-700"></span>
        </div>
    </div>

    <!-- Operations JS -->
    <script src="/js/my-claims.js"></script>
</body>
</html>