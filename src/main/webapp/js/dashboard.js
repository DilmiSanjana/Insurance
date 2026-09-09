// Check authentication
const checkAuth = () => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (!isAuthenticated || isAuthenticated !== 'true') {
        window.location.href = '/login';
    }
};

// Logout functionality
const logout = () => {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userEmail');
    window.location.href = '/login';
};

// API Base URL
const API_BASE = '/api';

// Fetch dashboard data
const fetchDashboardData = async () => {
    try {
        // Fetch data from all APIs
        const [policiesResponse, ticketsResponse, claimsResponse] = await Promise.all([
            fetch(`${API_BASE}/policies`),
            fetch(`${API_BASE}/support-tickets`),
            fetch(`${API_BASE}/claims`)
        ]);

        const policies = await policiesResponse.json();
        const tickets = await ticketsResponse.json();
        const claims = await claimsResponse.json();

        // Update statistics
        updateStatistics(policies, tickets, claims);
        
        // Update management cards
        updateManagementCards(policies, tickets, claims);
        
        // Update recent activity
        updateRecentActivity(policies, tickets, claims);

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Show fallback data or error message
        showErrorMessage('Failed to load dashboard data. Please refresh the page.');
    }
};

// Update statistics cards
const updateStatistics = (policies, tickets, claims) => {
    // Update Total Policies
    const totalPoliciesElement = document.querySelector('.bg-gradient-to-br.from-blue-500 h3');
    if (totalPoliciesElement && Array.isArray(policies)) {
        totalPoliciesElement.textContent = policies.length.toLocaleString();
    }

    // Update Active Tickets
    const activeTicketsElement = document.querySelector('.bg-gradient-to-br.from-green-500 h3');
    if (activeTicketsElement && Array.isArray(tickets)) {
        totalPoliciesElement.textContent = tickets.length.toLocaleString();
    }

    // Update Pending Claims
    const pendingClaimsElement = document.querySelector('.bg-gradient-to-br.from-purple-500 h3');
    if (pendingClaimsElement && Array.isArray(claims)) {
        pendingClaimsElement.textContent = claims.length.toLocaleString();
    }
};

// Update management cards with real data
const updateManagementCards = (policies, tickets, claims) => {
    // Update Policy Management Card
    const policyCard = document.querySelector('a[href="/policy-management"]');
    if (policyCard && Array.isArray(policies)) {
        const activePoliciesCount = policyCard.querySelector('.text-2xl.font-bold.text-gray-900');
        const expiringSoonCount = policyCard.querySelector('.text-2xl.font-bold.text-orange-500');
        
        if (activePoliciesCount) {
            activePoliciesCount.textContent = policies.length.toLocaleString();
        }
        
        // Calculate expiring soon (mock calculation - you can implement actual logic)
        if (expiringSoonCount) {
            const expiring = Math.floor(policies.length * 0.02); // 2% expiring soon
            expiringSoonCount.textContent = expiring.toString();
        }
    }

    // Update Customer Support Card
    const supportCard = document.querySelector('a[href="/admin-tickets"]');
    if (supportCard && Array.isArray(tickets)) {
        const openTicketsCount = supportCard.querySelector('.text-2xl.font-bold.text-gray-900');
        const urgentCount = supportCard.querySelector('.text-2xl.font-bold.text-red-500');
        
        if (openTicketsCount) {
            openTicketsCount.textContent = tickets.length.toLocaleString();
        }
        
        // Calculate urgent tickets (mock calculation)
        if (urgentCount) {
            const urgent = Math.floor(tickets.length * 0.15); // 15% urgent
            urgentCount.textContent = urgent.toString();
        }
    }

    // Update Claims Management Card
    const claimsCard = document.querySelector('a[href="/claims-management"]');
    if (claimsCard && Array.isArray(claims)) {
        const pendingClaimsCount = claimsCard.querySelector('.text-2xl.font-bold.text-gray-900');
        const approvedTodayCount = claimsCard.querySelector('.text-2xl.font-bold.text-green-500');
        
        if (pendingClaimsCount) {
            pendingClaimsCount.textContent = claims.length.toLocaleString();
        }
        
        // Calculate approved today (mock calculation)
        if (approvedTodayCount) {
            const approvedToday = Math.floor(claims.length * 0.2); // 20% approved today
            approvedTodayCount.textContent = approvedToday.toString();
        }
    }
};

// Update recent activity with real data
const updateRecentActivity = (policies, tickets, claims) => {
    const activityContainer = document.querySelector('.space-y-4');
    if (!activityContainer) return;

    // Clear existing activities
    activityContainer.innerHTML = '';

    const activities = [];

    // Add recent policies (latest 2)
    if (Array.isArray(policies) && policies.length > 0) {
        policies.slice(-2).forEach(policy => {
            activities.push({
                type: 'policy',
                icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                title: 'New policy created',
                subtitle: `Policy #${policy.id || 'N/A'} - Recently added`,
                bgColor: 'bg-blue-100',
                iconColor: 'text-blue-600'
            });
        });
    }

    // Add recent tickets (latest 2)
    if (Array.isArray(tickets) && tickets.length > 0) {
        tickets.slice(-2).forEach(ticket => {
            activities.push({
                type: 'ticket',
                icon: 'M5 13l4 4L19 7',
                title: 'Support ticket updated',
                subtitle: `Ticket #${ticket.id || 'N/A'} - Recently modified`,
                bgColor: 'bg-green-100',
                iconColor: 'text-green-600'
            });
        });
    }

    // Add recent claims (latest 2)
    if (Array.isArray(claims) && claims.length > 0) {
        claims.slice(-2).forEach(claim => {
            activities.push({
                type: 'claim',
                icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
                title: 'Claim processed',
                subtitle: `Claim #${claim.claimId || claim.id || 'N/A'} - Recently updated`,
                bgColor: 'bg-purple-100',
                iconColor: 'text-purple-600'
            });
        });
    }

    // Limit to 6 activities and render them
    activities.slice(0, 6).forEach(activity => {
        const activityElement = document.createElement('div');
        activityElement.className = 'flex items-center space-x-4 p-4 bg-gray-50 rounded-lg';
        activityElement.innerHTML = `
            <div class="w-10 h-10 ${activity.bgColor} rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 ${activity.iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${activity.icon}"></path>
                </svg>
            </div>
            <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">${activity.title}</p>
                <p class="text-xs text-gray-500">${activity.subtitle}</p>
            </div>
        `;
        activityContainer.appendChild(activityElement);
    });

    // Show message if no activities
    if (activities.length === 0) {
        activityContainer.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <p>No recent activity to display</p>
            </div>
        `;
    }
};

// Show error message
const showErrorMessage = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50';
    errorDiv.innerHTML = `
        <span class="block sm:inline">${message}</span>
        <button class="float-right ml-4 font-bold" onclick="this.parentElement.remove()">×</button>
    `;
    document.body.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
};

// DOM Elements
const logoutBtn = document.getElementById('logoutBtn');

// Event Listeners
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        logout();
    });
}

// Initialize
checkAuth();
fetchDashboardData();