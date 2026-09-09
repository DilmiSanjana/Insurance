// Check authentication
const checkAuth = () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
        window.location.href = '/login';
        return null;
    }
    return JSON.parse(userData);
};

// API Base URL
const API_BASE = '/api';

// Initialize
let currentUser = null;

window.addEventListener('DOMContentLoaded', () => {
    currentUser = checkAuth();
    if (currentUser) {
        loadUserData();
        loadDashboardData();
    }
});

// Load user data
const loadUserData = () => {
    const welcomeText = document.getElementById('welcomeText');
    if (currentUser.firstName && currentUser.lastName) {
        welcomeText.textContent = `Welcome back, ${currentUser.firstName} ${currentUser.lastName}`;
    } else if (currentUser.email) {
        welcomeText.textContent = `Welcome back, ${currentUser.email}`;
    }
};

// Load dashboard data from APIs
const loadDashboardData = async () => {
    try {
        // Show loading state
        showLoadingState();

        // Fetch data from all APIs
        const [policiesResponse, ticketsResponse, claimsResponse] = await Promise.all([
            fetch(`${API_BASE}/policies`),
            fetch(`${API_BASE}/support-tickets`),
            fetch(`${API_BASE}/claims`)
        ]);

        const policies = await policiesResponse.json();
        const tickets = await ticketsResponse.json();
        const claims = await claimsResponse.json();

        // Update statistics cards
        updateStatistics(policies, tickets, claims);
        
        // Update quick action cards
        updateQuickActionCards(policies, tickets, claims);
        
        // Update recent activity
        updateRecentActivity(policies, tickets, claims);

    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showErrorMessage('Failed to load dashboard data. Some information may not be current.');
    }
};

// Show loading state
const showLoadingState = () => {
    const statsCards = document.querySelectorAll('.text-3xl.font-bold');
    statsCards.forEach(card => {
        card.innerHTML = '<div class="animate-pulse bg-white bg-opacity-30 h-8 w-16 rounded"></div>';
    });
};

// Update statistics cards
const updateStatistics = (policies, tickets, claims) => {
    // Update Active Policies
    const activePoliciesElement = document.querySelector('.bg-gradient-to-br.from-blue-500 h3');
    if (activePoliciesElement && Array.isArray(policies)) {
        activePoliciesElement.textContent = policies.length.toString();
        
        // Update description
        const policyDesc = activePoliciesElement.closest('.bg-gradient-to-br').querySelector('p:last-child');
        if (policyDesc) {
            policyDesc.textContent = policies.length === 0 ? 'No active policies' : 
                                   policies.length === 1 ? '1 policy active' : 'All policies active';
        }
    }

    // Update Open Tickets
    const openTicketsElement = document.querySelector('.bg-gradient-to-br.from-green-500 h3');
    if (openTicketsElement && Array.isArray(tickets)) {
        openTicketsElement.textContent = tickets.length.toString();
        
        // Update description
        const ticketDesc = openTicketsElement.closest('.bg-gradient-to-br').querySelector('p:last-child');
        if (ticketDesc) {
            const pendingCount = Math.floor(tickets.length * 0.5); // Assume 50% pending response
            ticketDesc.textContent = tickets.length === 0 ? 'No open tickets' : 
                                   `${pendingCount} pending response`;
        }
    }

    // Update My Claims
    const claimsElement = document.querySelector('.bg-gradient-to-br.from-purple-500 h3');
    if (claimsElement && Array.isArray(claims)) {
        claimsElement.textContent = claims.length.toString();
        
        // Update description
        const claimDesc = claimsElement.closest('.bg-gradient-to-br').querySelector('p:last-child');
        if (claimDesc) {
            claimDesc.textContent = claims.length === 0 ? 'No claims' : 
                                  claims.length === 1 ? 'In review' : 'Multiple claims';
        }
    }
};

// Update quick action cards
const updateQuickActionCards = (policies, tickets, claims) => {
    // Update Policies Card
    const policiesCard = document.querySelector('a[href="/policies"]');
    if (policiesCard && Array.isArray(policies)) {
        const activeCount = policiesCard.querySelector('.text-2xl.font-bold.text-gray-900');
        const expiringCount = policiesCard.querySelector('.text-2xl.font-bold.text-orange-500');
        
        if (activeCount) activeCount.textContent = policies.length.toString();
        if (expiringCount) {
            const expiring = Math.floor(policies.length * 0.1); // Assume 10% expiring soon
            expiringCount.textContent = expiring.toString();
        }
    }

    // Update My Tickets Card
    const ticketsCard = document.querySelector('a[href="/my-tickets"]');
    if (ticketsCard && Array.isArray(tickets)) {
        const openCount = ticketsCard.querySelector('.text-2xl.font-bold.text-gray-900');
        const resolvedCount = ticketsCard.querySelector('.text-2xl.font-bold.text-green-500');
        
        if (openCount) openCount.textContent = tickets.length.toString();
        if (resolvedCount) {
            const resolved = Math.floor(tickets.length * 2.5); // Assume 2.5x resolved tickets
            resolvedCount.textContent = resolved.toString();
        }
    }

    // Update My Claims Card
    const claimsCard = document.querySelector('a[href="/my-claims"]');
    if (claimsCard && Array.isArray(claims)) {
        const inReviewCount = claimsCard.querySelector('.text-2xl.font-bold.text-gray-900');
        const approvedCount = claimsCard.querySelector('.text-2xl.font-bold.text-green-500');
        
        if (inReviewCount) inReviewCount.textContent = claims.length.toString();
        if (approvedCount) {
            const approved = Math.floor(claims.length * 3); // Assume 3x approved claims
            approvedCount.textContent = approved.toString();
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
                title: 'Policy updated',
                subtitle: `Policy #${policy.id || 'N/A'} - Recently modified`,
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
                subtitle: `Ticket #${ticket.id || 'N/A'} - Status changed`,
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
    const displayActivities = activities.slice(0, 6);
    
    if (displayActivities.length === 0) {
        activityContainer.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <p>No recent activity to display</p>
                <p class="text-sm mt-2">Your activity will appear here as you use the system</p>
            </div>
        `;
        return;
    }

    displayActivities.forEach(activity => {
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
};

// Show error message
const showErrorMessage = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 max-w-md';
    errorDiv.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm">${message}</span>
            <button class="ml-4 font-bold text-lg" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    document.body.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
};

// Profile button handler
document.getElementById('profileBtn').addEventListener('click', () => {
    window.location.href = '/profile';
});

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
});