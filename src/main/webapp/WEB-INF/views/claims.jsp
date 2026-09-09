<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Claims (Admin)</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js"></script>
</head>
<body class="bg-gray-50">
<header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
        <div class="flex items-center space-x-3">
            <i class="fas fa-clipboard-list text-2xl text-sky-600"></i>
            <h1 class="text-xl font-semibold">Claims Administration</h1>
        </div>
    </div>
</header>

<main class="max-w-7xl mx-auto px-4 py-6">
    <!-- Filters -->
    <div class="bg-white shadow rounded-lg p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="relative">
                <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input id="searchInput" type="text" placeholder="Search by email, status, vehicle, amount" class="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-sky-500">
            </div>
            <div class="relative">
                <i class="fas fa-clipboard-check absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <select id="statusFilter" class="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-sky-500">
                    <option value="">All Statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>
            <div class="relative">
                <i class="fas fa-tag absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <select id="typeFilter" class="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-sky-500">
                    <option value="">All Types</option>
                    <option value="CHILD">Child</option>
                    <option value="ADULT">Adult</option>
                    <option value="SENIOR">Senior</option>
                    <option value="CORPORATE">Corporate</option>
                </select>
            </div>
            <div class="relative hidden">
                <select value="CAR" id="vehicleFilter" class="hidden w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-sky-500">
                    <option value="">All Vehicles</option>
                    <option value="CAR">Car</option>
                    <option value="BIKE">Bike</option>
                    <option value="VAN">Van</option>
                    <option value="TRUCK">Truck</option>
                    <option value="OTHER">Other</option>
                </select>
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
                <!-- Rows injected via claims.js -->
                </tbody>
            </table>
        </div>
        <div id="emptyState" class="p-6 text-center text-gray-500 hidden">No claims found</div>
        <div id="loadingState" class="p-6 text-center text-gray-500 hidden">
            <i class="fas fa-spinner fa-spin"></i> Loading claims...
        </div>
    </div>
</main>

<!-- Update Status Modal -->
<div id="statusModal" class="fixed inset-0 z-50 hidden">
    <div class="absolute inset-0 bg-black bg-opacity-40" data-modal-close></div>
    <div class="relative bg-white rounded-lg shadow max-w-md mx-auto mt-24 p-6">
        <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">Update Claim Status</h2>
            <button class="text-gray-400 hover:text-gray-600" data-modal-close>
                <i class="fas fa-times"></i>
            </button>
        </div>
        <form id="statusForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <select id="statusSelect" class="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500">
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
                <div id="statusSelectError" class="text-red-600 text-sm mt-1"></div>
            </div>
            <div class="flex justify-end space-x-2 pt-2">
                <button type="button" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300" data-modal-close>Cancel</button>
                <button type="submit" class="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700">Update</button>
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
            <!-- Filled via claims.js -->
        </div>
        <div class="flex justify-end mt-4">
            <button id="exportSinglePdfBtn" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Export to PDF</button>
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
<script src="/js/claims.js"></script>
</body>
</html>