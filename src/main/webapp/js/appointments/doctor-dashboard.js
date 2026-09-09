document.addEventListener('DOMContentLoaded', function() {
    const API_BASE_URL = '/api/appointments';
    const doctorEmail = 'doctor@doctor.com';
    
    // Elements
    const appointmentsTableBody = document.getElementById('appointmentsTableBody');
    const noAppointments = document.getElementById('noAppointments');
    const statusFilter = document.getElementById('statusFilter');
    const refreshBtn = document.getElementById('refreshBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // Stats elements
    const totalAppointmentsEl = document.getElementById('totalAppointments');
    const pendingAppointmentsEl = document.getElementById('pendingAppointments');
    const acceptedAppointmentsEl = document.getElementById('acceptedAppointments');
    const rejectedAppointmentsEl = document.getElementById('rejectedAppointments');
    
    // Modal elements
    const statusModal = document.getElementById('statusModal');
    const deleteModal = document.getElementById('deleteModal');
    const closeModal = document.getElementById('closeModal');
    const cancelUpdate = document.getElementById('cancelUpdate');
    const confirmUpdate = document.getElementById('confirmUpdate');
    const cancelDelete = document.getElementById('cancelDelete');
    const confirmDelete = document.getElementById('confirmDelete');
    const modalPatientName = document.getElementById('modalPatientName');
    const modalReason = document.getElementById('modalReason');
    const modalAppointedDate = document.getElementById('modalAppointedDate');
    const newStatus = document.getElementById('newStatus');
    
    let currentAppointmentId = null;
    let allAppointments = [];

    // Check authentication
    function checkAuthentication() {
        const remembered = localStorage.getItem('doctorRememberMe');
        const sessionLoggedIn = sessionStorage.getItem('doctorLoggedIn');
        
        if (remembered !== 'true' && sessionLoggedIn !== 'true') {
            window.location.href = '/doctor-login';
            return false;
        }
        
        const email = localStorage.getItem('doctorEmail') || sessionStorage.getItem('doctorEmail');
        if (email) {
            document.getElementById('doctorEmail').textContent = email;
        }
        
        return true;
    }

    // Show/hide loading spinner
    function setLoading(loading) {
        if (loading) {
            loadingSpinner.classList.remove('hidden');
        } else {
            loadingSpinner.classList.add('hidden');
        }
    }

    // Format date
    function formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    // Get status badge class
    function getStatusBadgeClass(status) {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'ACCEPTED':
                return 'bg-green-100 text-green-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    // Render appointments table
    function renderAppointments(appointments) {
        if (appointments.length === 0) {
            appointmentsTableBody.innerHTML = '';
            noAppointments.classList.remove('hidden');
            return;
        }
        
        noAppointments.classList.add('hidden');
        appointmentsTableBody.innerHTML = appointments.map(appointment => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <i class="fas fa-user text-blue-600"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">
                                ${appointment.user.firstName} ${appointment.user.lastName}
                            </div>
                            <div class="text-sm text-gray-500">${appointment.user.email}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${appointment.reason}</div>
                    ${appointment.description ? `<div class="text-sm text-gray-500">${appointment.description}</div>` : ''}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${formatDate(appointment.appointedDate)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}">
                        ${appointment.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${formatDate(appointment.createdAt)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="openStatusModal(${appointment.id})" 
                            class="text-blue-600 hover:text-blue-900 mr-3">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${appointment.status === 'REJECTED' ? `
                        <button onclick="openDeleteModal(${appointment.id})" 
                                class="text-red-600 hover:text-red-900">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    }

    // Update stats
    function updateStats(appointments) {
        const total = appointments.length;
        const pending = appointments.filter(a => a.status === 'PENDING').length;
        const accepted = appointments.filter(a => a.status === 'ACCEPTED').length;
        const rejected = appointments.filter(a => a.status === 'REJECTED').length;
        
        totalAppointmentsEl.textContent = total;
        pendingAppointmentsEl.textContent = pending;
        acceptedAppointmentsEl.textContent = accepted;
        rejectedAppointmentsEl.textContent = rejected;
    }

    // Load appointments
    async function loadAppointments() {
        if (!checkAuthentication()) return;
        
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}`);
            if (response.ok) {
                allAppointments = await response.json();
                filterAppointments();
            } else {
                console.error('Failed to load appointments');
                allAppointments = [];
                renderAppointments([]);
                updateStats([]);
            }
        } catch (error) {
            console.error('Error loading appointments:', error);
            allAppointments = [];
            renderAppointments([]);
            updateStats([]);
        } finally {
            setLoading(false);
        }
    }

    // Filter appointments
    function filterAppointments() {
        const selectedStatus = statusFilter.value;
        let filteredAppointments = allAppointments;
        
        if (selectedStatus) {
            filteredAppointments = allAppointments.filter(appointment => 
                appointment.status === selectedStatus
            );
        }
        
        renderAppointments(filteredAppointments);
        updateStats(filteredAppointments);
    }

    // Open status modal
    window.openStatusModal = function(appointmentId) {
        const appointment = allAppointments.find(a => a.id === appointmentId);
        if (!appointment) return;
        
        currentAppointmentId = appointmentId;
        modalPatientName.textContent = `${appointment.user.firstName} ${appointment.user.lastName}`;
        modalReason.textContent = appointment.reason;
        modalAppointedDate.textContent = formatDate(appointment.appointedDate);
        newStatus.value = appointment.status;
        
        statusModal.classList.remove('hidden');
    };

    // Close modal
    function closeStatusModal() {
        statusModal.classList.add('hidden');
        currentAppointmentId = null;
    }

    // Open delete modal
    window.openDeleteModal = function(appointmentId) {
        currentAppointmentId = appointmentId;
        deleteModal.classList.remove('hidden');
    };

    // Close delete modal
    function closeDeleteModal() {
        deleteModal.classList.add('hidden');
        currentAppointmentId = null;
    }

    // Delete appointment
    async function deleteAppointment() {
        if (!currentAppointmentId) return;
        
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/${currentAppointmentId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                // Remove from local data
                allAppointments = allAppointments.filter(a => a.id !== currentAppointmentId);
                
                filterAppointments();
                closeDeleteModal();
                
                // Show success message
                showNotification('Appointment deleted successfully', 'success');
            } else {
                showNotification('Failed to delete appointment', 'error');
            }
        } catch (error) {
            console.error('Error deleting appointment:', error);
            showNotification('Error deleting appointment', 'error');
        } finally {
            setLoading(false);
        }
    }

    // Update appointment status
    async function updateAppointmentStatus() {
        if (!currentAppointmentId) return;
        
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/${currentAppointmentId}/status?status=${newStatus.value}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                // Update local data
                const appointment = allAppointments.find(a => a.id === currentAppointmentId);
                if (appointment) {
                    appointment.status = newStatus.value;
                }
                
                filterAppointments();
                closeStatusModal();
                
                // Show success message
                showNotification('Appointment status updated successfully', 'success');
            } else {
                showNotification('Failed to update appointment status', 'error');
            }
        } catch (error) {
            console.error('Error updating appointment status:', error);
            showNotification('Error updating appointment status', 'error');
        } finally {
            setLoading(false);
        }
    }

    // Show notification
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Logout
    function logout() {
        localStorage.removeItem('doctorRememberMe');
        localStorage.removeItem('doctorEmail');
        sessionStorage.removeItem('doctorLoggedIn');
        sessionStorage.removeItem('doctorEmail');
        
        window.location.href = '/doctor-login';
    }

    // Event listeners
    statusFilter.addEventListener('change', filterAppointments);
    refreshBtn.addEventListener('click', loadAppointments);
    logoutBtn.addEventListener('click', logout);
    
    // Modal event listeners
    closeModal.addEventListener('click', closeStatusModal);
    cancelUpdate.addEventListener('click', closeStatusModal);
    confirmUpdate.addEventListener('click', updateAppointmentStatus);
    
    // Delete modal event listeners
    cancelDelete.addEventListener('click', closeDeleteModal);
    confirmDelete.addEventListener('click', deleteAppointment);
    
    // Close modal on outside click
    statusModal.addEventListener('click', function(e) {
        if (e.target === statusModal) {
            closeStatusModal();
        }
    });

    deleteModal.addEventListener('click', function(e) {
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });

    // Initialize
    loadAppointments();
    
    // Auto-refresh every 30 seconds
    setInterval(loadAppointments, 30000);
});
