<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Appointments - SeCrud</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 min-h-screen">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <div class="flex-shrink-0 flex items-center">
                        <i class="fas fa-calendar-alt text-indigo-600 text-2xl mr-3"></i>
                        <h1 class="text-xl font-bold text-gray-900">My Appointments</h1>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="/dashboard" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                        <i class="fas fa-home mr-1"></i>
                        Dashboard
                    </a>
                    <button id="logoutBtn" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                        <i class="fas fa-sign-out-alt mr-1"></i>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Total Appointments -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-calendar-alt text-indigo-600 text-2xl"></i>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">Total Appointments</dt>
                                <dd class="text-lg font-medium text-gray-900" id="totalAppointments">0</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pending Appointments -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-clock text-yellow-600 text-2xl"></i>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">Pending</dt>
                                <dd class="text-lg font-medium text-gray-900" id="pendingAppointments">0</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Accepted Appointments -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-check-circle text-green-600 text-2xl"></i>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">Accepted</dt>
                                <dd class="text-lg font-medium text-gray-900" id="acceptedAppointments">0</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Rejected Appointments -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-times-circle text-red-600 text-2xl"></i>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">Rejected</dt>
                                <dd class="text-lg font-medium text-gray-900" id="rejectedAppointments">0</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Actions Bar -->
        <div class="bg-white shadow rounded-lg mb-6">
            <div class="px-6 py-4 border-b border-gray-200">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h3 class="text-lg font-medium text-gray-900">Appointment Management</h3>
                    <div class="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <select id="statusFilter" class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="ACCEPTED">Accepted</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                        <button id="createAppointmentBtn" class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors">
                            <i class="fas fa-plus mr-1"></i>
                            New Appointment
                        </button>
                        <button id="refreshBtn" class="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition-colors">
                            <i class="fas fa-sync-alt mr-1"></i>
                            Refresh
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Appointments Table -->
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-medium text-gray-900">Appointments</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointed Date</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="appointmentsTableBody" class="bg-white divide-y divide-gray-200">
                        <!-- Appointments will be loaded here -->
                    </tbody>
                </table>
            </div>
            <div id="noAppointments" class="text-center py-8 text-gray-500 hidden">
                <i class="fas fa-calendar-times text-4xl mb-4"></i>
                <p>No appointments found</p>
            </div>
        </div>
    </div>

    <!-- Create Appointment Modal -->
    <div id="createModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Create New Appointment</h3>
                    <button id="closeCreateModal" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="createAppointmentForm" class="space-y-4">
                    <div>
                        <label for="createDoctorName" class="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                        <input type="text" id="createDoctorName" name="doctorName" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <div id="createDoctorNameError" class="text-red-500 text-sm mt-1 hidden"></div>
                    </div>
                    <div>
                        <label for="createReason" class="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                        <input type="text" id="createReason" name="reason" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <div id="createReasonError" class="text-red-500 text-sm mt-1 hidden"></div>
                    </div>
                    <div>
                        <label for="createDescription" class="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                        <textarea id="createDescription" name="description" rows="3"
                                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                        <div id="createDescriptionError" class="text-red-500 text-sm mt-1 hidden"></div>
                    </div>
                    <div>
                        <label for="createAppointedDate" class="block text-sm font-medium text-gray-700 mb-1">Appointed Date & Time</label>
                        <input type="datetime-local" id="createAppointedDate" name="appointedDate" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <div id="createAppointedDateError" class="text-red-500 text-sm mt-1 hidden"></div>
                    </div>
                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" id="cancelCreate" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" id="confirmCreate" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
                            Create Appointment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Appointment Modal -->
    <div id="editModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Edit Appointment</h3>
                    <button id="closeEditModal" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <form id="editAppointmentForm" class="space-y-4">
                    <input type="hidden" id="editAppointmentId" name="id">
                    <div>
                        <label for="editDoctorName" class="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                        <input type="text" id="editDoctorName" name="doctorName" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <div id="editDoctorNameError" class="text-red-500 text-sm mt-1 hidden"></div>
                    </div>
                    <div>
                        <label for="editReason" class="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                        <input type="text" id="editReason" name="reason" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <div id="editReasonError" class="text-red-500 text-sm mt-1 hidden"></div>
                    </div>
                    <div>
                        <label for="editDescription" class="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                        <textarea id="editDescription" name="description" rows="3"
                                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                        <div id="editDescriptionError" class="text-red-500 text-sm mt-1 hidden"></div>
                    </div>
                    <div>
                        <label for="editAppointedDate" class="block text-sm font-medium text-gray-700 mb-1">Appointed Date & Time</label>
                        <input type="datetime-local" id="editAppointedDate" name="appointedDate" required
                               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <div id="editAppointedDateError" class="text-red-500 text-sm mt-1 hidden"></div>
                    </div>
                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" id="cancelEdit" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" id="confirmEdit" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
                            Update Appointment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div id="deleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                        <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900">Delete Appointment</h3>
                </div>
                <p class="text-gray-600 mb-6">Are you sure you want to delete this appointment? This action cannot be undone.</p>
                <div class="flex justify-end space-x-3">
                    <button id="cancelDelete" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                        Cancel
                    </button>
                    <button id="confirmDelete" class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">
                        Delete Appointment
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Loading Spinner -->
    <div id="loadingSpinner" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white p-6 rounded-lg shadow-lg">
            <div class="flex items-center">
                <i class="fas fa-spinner fa-spin text-indigo-600 text-2xl mr-3"></i>
                <span class="text-gray-700">Loading...</span>
            </div>
        </div>
    </div>

    <!-- Success/Error Messages -->
    <div id="messageContainer" class="fixed top-4 right-4 z-50"></div>

    <script src="/js/appointments/my-appointments.js"></script>
</body>
</html>
