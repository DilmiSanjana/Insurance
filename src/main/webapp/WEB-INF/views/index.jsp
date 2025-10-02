<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Management System</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.5);
            animation: fadeIn 0.3s;
        }
        
        .modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            background-color: #fefefe;
            padding: 0;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            animation: slideIn 0.3s;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .time-slot {
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .time-slot:hover:not(.occupied) {
            transform: scale(1.05);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .time-slot.selected {
            border: 2px solid #3b82f6;
            background-color: #dbeafe;
        }
        
        .time-slot.occupied {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 2000;
            animation: slideInRight 0.3s;
        }
        
        @keyframes slideInRight {
            from { transform: translateX(400px); }
            to { transform: translateX(0); }
        }
        
        .toast.success { background-color: #10b981; }
        .toast.error { background-color: #ef4444; }
        .toast.info { background-color: #3b82f6; }
    </style>
</head>
<body class="bg-gray-100">
    <div class="container mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold text-gray-800">
                    <i class="fas fa-calendar-check text-blue-600"></i> Appointment Management
                </h1>
                <button onclick="openCreateModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                    <i class="fas fa-plus"></i> New Appointment
                </button>
            </div>
            
            <div class="mb-4 flex gap-4 flex-wrap">
                <input type="text" id="searchInput" placeholder="Search by patient or doctor..." 
                    class="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <button onclick="loadAppointments()" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
            </div>
            
            <div id="appointmentsList" class="space-y-4">
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-spinner fa-spin text-4xl mb-2"></i>
                    <p>Loading appointments...</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Create/Edit Modal -->
    <div id="appointmentModal" class="modal">
        <div class="modal-content">
            <div class="bg-blue-600 text-white p-6 rounded-t-lg">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">
                        <i class="fas fa-calendar-plus"></i> <span id="modalTitle">New Appointment</span>
                    </h2>
                    <button onclick="closeModal()" class="text-white hover:text-gray-200 text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <form id="appointmentForm" class="p-6">
                <input type="hidden" id="appointmentId">
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">
                            <i class="fas fa-user"></i> Patient Name *
                        </label>
                        <input type="text" id="patientName" required 
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">
                            <i class="fas fa-phone"></i> Contact Number *
                        </label>
                        <input type="tel" id="contactNumber" required 
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>
                
                <div class="mb-4">
                    <label class="block text-gray-700 font-semibold mb-2">
                        <i class="fas fa-envelope"></i> Email *
                    </label>
                    <input type="email" id="email" required 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">
                            <i class="fas fa-calendar"></i> Date *
                        </label>
                        <input type="date" id="date" required onchange="checkTimeSlots()"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">
                            <i class="fas fa-user-md"></i> Doctor Name *
                        </label>
                        <select id="doctorName" required onchange="checkTimeSlots()"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Doctor</option>
                            <option value="Dr. Smith">Dr. Smith</option>
                            <option value="Dr. Johnson">Dr. Johnson</option>
                            <option value="Dr. Williams">Dr. Williams</option>
                            <option value="Dr. Brown">Dr. Brown</option>
                            <option value="Dr. Davis">Dr. Davis</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-6">
                    <label class="block text-gray-700 font-semibold mb-3">
                        <i class="fas fa-clock"></i> Available Time Slots *
                    </label>
                    <div id="timeSlots" class="grid grid-cols-3 md:grid-cols-4 gap-2">
                        <!-- Time slots will be generated here -->
                    </div>
                    <input type="hidden" id="time" required>
                </div>
                
                <div class="flex gap-4">
                    <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
                        <i class="fas fa-save"></i> Save Appointment
                    </button>
                    <button type="button" onclick="closeModal()" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-semibold transition">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script src="/js/appointments.js"></script>
</body>
</html>