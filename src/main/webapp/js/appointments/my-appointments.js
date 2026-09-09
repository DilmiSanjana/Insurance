document.addEventListener('DOMContentLoaded', function() {
    const API_BASE_URL = '/api/appointments';
    let currentUser = null;
    let allAppointments = [];
    let currentAppointmentId = null;
    
    // Elements
    const appointmentsTableBody = document.getElementById('appointmentsTableBody');
    const noAppointments = document.getElementById('noAppointments');
    const statusFilter = document.getElementById('statusFilter');
    const refreshBtn = document.getElementById('refreshBtn');
    const createAppointmentBtn = document.getElementById('createAppointmentBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const messageContainer = document.getElementById('messageContainer');
    
    // Stats elements
    const totalAppointmentsEl = document.getElementById('totalAppointments');
    const pendingAppointmentsEl = document.getElementById('pendingAppointments');
    const acceptedAppointmentsEl = document.getElementById('acceptedAppointments');
    const rejectedAppointmentsEl = document.getElementById('rejectedAppointments');
    
    // Modal elements
    const createModal = document.getElementById('createModal');
    const editModal = document.getElementById('editModal');
    const deleteModal = document.getElementById('deleteModal');
    
    // Form elements
    const createForm = document.getElementById('createAppointmentForm');
    const editForm = document.getElementById('editAppointmentForm');

    // Initialize the application
    function initializeApp() {
        if (!checkAuthentication()) return;
        loadAppointments();
        initializeEventListeners();
    }

    // Check authentication and get current user
    function checkAuthentication() {
        const userData = localStorage.getItem('user');
        if (!userData) {
            window.location.href = '/login';
            return false;
        }
        
        try {
            currentUser = JSON.parse(userData);
            return true;
        } catch (error) {
            console.error('Error parsing user data:', error);
            window.location.href = '/login';
            return false;
        }
    }

    // Initialize event listeners
    function initializeEventListeners() {
        // Filter and action buttons
        statusFilter.addEventListener('change', filterAppointments);
        refreshBtn.addEventListener('click', loadAppointments);
        createAppointmentBtn.addEventListener('click', openCreateModal);
        logoutBtn.addEventListener('click', logout);

        // Create modal
        document.getElementById('closeCreateModal').addEventListener('click', closeCreateModal);
        document.getElementById('cancelCreate').addEventListener('click', closeCreateModal);
        createForm.addEventListener('submit', handleCreateAppointment);

        // Edit modal
        document.getElementById('closeEditModal').addEventListener('click', closeEditModal);
        document.getElementById('cancelEdit').addEventListener('click', closeEditModal);
        editForm.addEventListener('submit', handleEditAppointment);

        // Delete modal
        document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);
        document.getElementById('confirmDelete').addEventListener('click', handleDeleteAppointment);

        // Close modals on outside click
        [createModal, editModal, deleteModal].forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });

        // Input validation listeners
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                clearFieldError(input);
            });
        });
    }

    // Show/hide loading spinner
    function setLoading(loading) {
        if (loading) {
            loadingSpinner.classList.remove('hidden');
        } else {
            loadingSpinner.classList.add('hidden');
        }
    }

    // Show success/error messages
    function showMessage(message, type = 'success') {
        const messageEl = document.createElement('div');
        messageEl.className = `p-4 rounded-lg shadow-lg mb-4 ${
            type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
        }`;
        messageEl.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        messageContainer.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }

    // Format date for display
    function formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    // Format date for datetime-local input
    function formatDateForInput(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
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
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${appointment.doctorName}
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
                    ${appointment.status === 'PENDING' ? `
                        <button onclick="openEditModal(${appointment.id})" 
                                class="text-indigo-600 hover:text-indigo-900 mr-3">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="openDeleteModal(${appointment.id})" 
                                class="text-red-600 hover:text-red-900">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : `
                        <span class="text-gray-400">No actions available</span>
                    `}
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
        if (!currentUser) return;
        
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/user/${currentUser.id}`);
            if (response.ok) {
                allAppointments = await response.json();
                filterAppointments();
            } else {
                console.error('Failed to load appointments');
                allAppointments = [];
                renderAppointments([]);
                updateStats([]);
                showMessage('Failed to load appointments', 'error');
            }
        } catch (error) {
            console.error('Error loading appointments:', error);
            allAppointments = [];
            renderAppointments([]);
            updateStats([]);
            showMessage('Error loading appointments', 'error');
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

    // Validation functions
    function validateForm(formId) {
        let isValid = true;
        const form = document.getElementById(formId);
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                showFieldError(input, `${getFieldLabel(input)} is required`);
                isValid = false;
            } else {
                clearFieldError(input);
            }
        });

        // Validate appointed date
        const appointedDateInput = form.querySelector('input[name="appointedDate"]');
        if (appointedDateInput && appointedDateInput.value) {
            const selectedDate = new Date(appointedDateInput.value);
            const now = new Date();
            
            if (selectedDate <= now) {
                showFieldError(appointedDateInput, 'Appointed date must be in the future');
                isValid = false;
            }
        }

        return isValid;
    }

    function getFieldLabel(input) {
        const label = input.previousElementSibling;
        return label ? label.textContent.replace(':', '').trim() : input.name;
    }

    function showFieldError(input, message) {
        const errorElement = document.getElementById(input.name + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
        input.classList.add('border-red-500');
        input.classList.remove('border-gray-300');
    }

    function clearFieldError(input) {
        const errorElement = document.getElementById(input.name + 'Error');
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
        input.classList.remove('border-red-500');
        input.classList.add('border-gray-300');
    }

    // Modal functions
    function openCreateModal() {
        createForm.reset();
        clearAllFormErrors('createAppointmentForm');
        createModal.classList.remove('hidden');
    }

    function closeCreateModal() {
        createModal.classList.add('hidden');
        createForm.reset();
        clearAllFormErrors('createAppointmentForm');
    }

    function openEditModal(appointmentId) {
        const appointment = allAppointments.find(a => a.id === appointmentId);
        if (!appointment) return;
        
        currentAppointmentId = appointmentId;
        
        document.getElementById('editAppointmentId').value = appointment.id;
        document.getElementById('editDoctorName').value = appointment.doctorName || '';
        document.getElementById('editReason').value = appointment.reason || '';
        document.getElementById('editDescription').value = appointment.description || '';
        document.getElementById('editAppointedDate').value = formatDateForInput(appointment.appointedDate);
        
        clearAllFormErrors('editAppointmentForm');
        editModal.classList.remove('hidden');
    }

    function closeEditModal() {
        editModal.classList.add('hidden');
        editForm.reset();
        clearAllFormErrors('editAppointmentForm');
        currentAppointmentId = null;
    }

    function openDeleteModal(appointmentId) {
        currentAppointmentId = appointmentId;
        deleteModal.classList.remove('hidden');
    }

    function closeDeleteModal() {
        deleteModal.classList.add('hidden');
        currentAppointmentId = null;
    }

    function clearAllFormErrors(formId) {
        const form = document.getElementById(formId);
        const errorElements = form.querySelectorAll('[id$="Error"]');
        errorElements.forEach(element => {
            element.classList.add('hidden');
        });
        
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.classList.remove('border-red-500');
            input.classList.add('border-gray-300');
        });
    }

    // CRUD operations
    async function handleCreateAppointment(e) {
        e.preventDefault();
        
        if (!validateForm('createAppointmentForm')) {
            return;
        }

        const formData = new FormData(createForm);
        const appointmentData = {
            doctorName: formData.get('doctorName'),
            reason: formData.get('reason'),
            description: formData.get('description'),
            appointedDate: formData.get('appointedDate'),
            userId: currentUser.id
        };

        setLoading(true);
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(appointmentData)
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Appointment created successfully', 'success');
                closeCreateModal();
                loadAppointments();
            } else {
                showMessage(data.message || 'Failed to create appointment', 'error');
            }
        } catch (error) {
            console.error('Error creating appointment:', error);
            showMessage('Error creating appointment', 'error');
        } finally {
            setLoading(false);
        }
    }

    async function handleEditAppointment(e) {
        e.preventDefault();
        
        if (!validateForm('editAppointmentForm')) {
            return;
        }

        const formData = new FormData(editForm);
        const appointmentData = {
            doctorName: formData.get('doctorName'),
            reason: formData.get('reason'),
            description: formData.get('description'),
            appointedDate: formData.get('appointedDate')
        };

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/${currentAppointmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(appointmentData)
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Appointment updated successfully', 'success');
                closeEditModal();
                loadAppointments();
            } else {
                showMessage(data.message || 'Failed to update appointment', 'error');
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
            showMessage('Error updating appointment', 'error');
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteAppointment() {
        if (!currentAppointmentId) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/${currentAppointmentId}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            window.location.href = '/my-appointments';
            
        } catch (error) {
            console.error('Error deleting appointment:', error);
            showMessage('Error deleting appointment', 'error');
        } finally {
            setLoading(false);
        }
    }

    // Logout function
    function logout() {
        localStorage.removeItem('user');
        window.location.href = '/login';
    }

    // Global functions for onclick handlers
    window.openEditModal = openEditModal;
    window.openDeleteModal = openDeleteModal;

    // Initialize the application
    initializeApp();
});
