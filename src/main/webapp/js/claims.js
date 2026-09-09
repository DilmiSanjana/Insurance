// claims.js
// Admin claims: fetch CRUD, filters, status update modal, single-claim PDF, error/loading states
(function () {
    const API_BASE = '/api/claims';

    // Elements
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    const vehicleFilter = document.getElementById('vehicleFilter');
    const tableBody = document.getElementById('claimsTableBody');
    const emptyState = document.getElementById('emptyState');
    const loadingState = document.getElementById('loadingState');

    const statusModal = document.getElementById('statusModal');
    const statusForm = document.getElementById('statusForm');
    const statusSelect = document.getElementById('statusSelect');
    const statusSelectError = document.getElementById('statusSelectError');

    const viewClaimModal = document.getElementById('viewClaimModal');
    const viewClaimContent = document.getElementById('viewClaimContent');
    const exportSinglePdfBtn = document.getElementById('exportSinglePdfBtn');

    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');

    // State
    let claims = [];
    let editingId = null;
    let viewingClaim = null;

    // Toast
    function showToast(message, type = 'info') {
        toastMessage.textContent = message;
        toastIcon.className = 'fas ' + (type === 'error' ? 'fa-exclamation-circle text-red-600' : type === 'success' ? 'fa-check-circle text-green-600' : 'fa-info-circle text-gray-600');
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 2500);
    }

    // Modal helpers
    function openModal(modal) { modal.classList.remove('hidden'); }
    function closeModal(modal) { modal.classList.add('hidden'); }
    document.querySelectorAll('[data-modal-close]').forEach(el => el.addEventListener('click', () => { closeModal(statusModal); closeModal(viewClaimModal); }));

    // Fetch helpers
    async function apiGetAll() {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error('Failed to load claims');
        return res.json();
    }
    async function apiUpdate(id, data) {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to update claim');
        return res.json();
    }

    // Rendering
    function renderClaims(list) {
        tableBody.innerHTML = '';
        if (!list.length) { emptyState.classList.remove('hidden'); return; }
        emptyState.classList.add('hidden');
        list.forEach(c => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50';
            tr.innerHTML = `
        <td class="px-4 py-3 text-sm text-gray-800">${escapeHtml(c.claimId || '')}</td>
        <td class="px-4 py-3 text-sm text-gray-800">${formatAmount(c.claimAmount)}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(c.userEmail)}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(c.type || 'CHILD')}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(c.status)}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(c.dateFilled || '')}</td>
    
        <td class="px-4 py-3 text-right">
          <div class="inline-flex items-center space-x-2">
            <button class="px-2 py-1 text-sky-700 hover:text-sky-900" data-action="view" data-id="${c.id}"><i class="fas fa-eye"></i></button>
            <button class="px-2 py-1 text-blue-700 hover:text-blue-900" data-action="edit" data-id="${c.id}"><i class="fas fa-pen"></i></button>
          </div>
        </td>`;
            tableBody.appendChild(tr);
        });
    }

    function escapeHtml(str) {
        return String(str || '').replace(/[&<>"]+/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
    }
    function formatAmount(val) {
        if (val == null) return '';
        return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'LKR' }).format(val);
    }

    // Filtering
    function applyFilters() {
        const q = searchInput.value.trim().toLowerCase();
        const status = statusFilter.value;
        const type = typeFilter.value;
        const vehicle = vehicleFilter.value;
        const filtered = claims.filter(c => {
            const matchQ = !q || [c.claimId || '', c.userEmail, c.status, c.type, c.claimAmount?.toString() || '', c.dateFilled || ''].some(v => String(v).toLowerCase().includes(q));
            const matchStatus = !status || c.status === status;
            const matchType = !type || c.type === type;
            const matchVehicle = !vehicle || c.vehicleType === vehicle;
            return matchQ && matchStatus && matchType && matchVehicle;
        });
        renderClaims(filtered);
    }

    // Load
    async function loadClaims() {
        loadingState.classList.remove('hidden');
        try {
            claims = await apiGetAll();
            applyFilters();
        } catch (e) {
            showToast(e.message, 'error');
        } finally {
            loadingState.classList.add('hidden');
        }
    }

    // Status update
    function openStatusModal(c) {
        editingId = c.id;
        statusSelect.value = c.status || 'PENDING';
        statusSelectError.textContent = '';
        openModal(statusModal);
    }
    statusForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!statusSelect.value) { statusSelectError.textContent = 'Select a status'; return; }
        try {
            const existing = claims.find(x => String(x.id) === String(editingId));
            if (!existing) throw new Error('Claim not found');
            const payload = { ...existing, status: statusSelect.value };
            await apiUpdate(editingId, payload);
            showToast('Status updated', 'success');
            closeModal(statusModal);
            await loadClaims();
        } catch (err) {
            showToast(err.message, 'error');
        }
    });

    // Table actions
    tableBody.addEventListener('click', async (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        const c = claims.find(x => String(x.id) === String(id));
        if (!c) return;

        if (action === 'view') {
            viewingClaim = c;
            viewClaimContent.innerHTML = `
        <div><span class="font-medium">Claim ID:</span> ${escapeHtml(c.claimId || '')}</div>
        <div><span class="font-medium">Amount:</span> ${formatAmount(c.claimAmount)}</div>
        <div><span class="font-medium">User Email:</span> ${escapeHtml(c.userEmail)}</div>
        <div><span class="font-medium">Type:</span> ${escapeHtml(c.type || 'CHILD')}</div>
        <div><span class="font-medium">Status:</span> ${escapeHtml(c.status)}</div>
        <div><span class="font-medium">Date Filled:</span> ${escapeHtml(c.dateFilled || '')}</div>
      `;
            openModal(viewClaimModal);
        }
        if (action === 'edit') {
            openStatusModal(c);
        }
    });

    // PDF export for single claim
    function exportSinglePdf() {
        if (!viewingClaim) return showToast('Open a claim first');
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text('Claim', 14, 16);
        const body = [
            ['Amount', formatAmount(viewingClaim.claimAmount)],
            ['User Email', viewingClaim.userEmail],
            ['Status', viewingClaim.status],
            ['Date Filled', viewingClaim.dateFilled || ''],

        ];
        doc.autoTable({ body, startY: 22, styles: { fontSize: 11 }, theme: 'plain' });
        doc.save(`claim-${viewingClaim.id}.pdf`);
    }

    // Events
    exportSinglePdfBtn.addEventListener('click', exportSinglePdf);
    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    vehicleFilter.addEventListener('change', applyFilters);

    document.addEventListener('DOMContentLoaded', loadClaims);
})();