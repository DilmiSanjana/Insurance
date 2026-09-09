// my-claims.js
// Handles claims CRUD via fetch, modals, Tailwind UI interactions, filters, validations, and states
(function () {
    const API_BASE = '/api/claims';

    // Elements
    const newClaimBtn = document.getElementById('newClaimBtn');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    const futureOnly = document.getElementById('futureOnly');
    const tableBody = document.getElementById('claimsTableBody');
    const emptyState = document.getElementById('emptyState');
    const loadingState = document.getElementById('loadingState');

    const claimModal = document.getElementById('claimModal');
    const claimModalTitle = document.getElementById('claimModalTitle');
    const claimForm = document.getElementById('claimForm');

    const claimIdInput = document.getElementById('claimId');
    const claimAmountInput = document.getElementById('claimAmount');
    const userEmailInput = document.getElementById('userEmail');
    const typeInput = document.getElementById('type');
    const statusInput = document.getElementById('status');
    const dateFilledInput = document.getElementById('dateFilled');

    const claimIdError = document.getElementById('claimIdError');
    const claimAmountError = document.getElementById('claimAmountError');
    const userEmailError = document.getElementById('userEmailError');
    const typeError = document.getElementById('typeError');
    const statusError = document.getElementById('statusError');
    const dateFilledError = document.getElementById('dateFilledError');

    const viewClaimModal = document.getElementById('viewClaimModal');
    const viewClaimContent = document.getElementById('viewClaimContent');

    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');

    // State
    let claims = [];
    let editingId = null;
    let viewingClaim = null;

    // Toast
    function showToast(message, type = 'info') {
        if (!toastMessage || !toastIcon || !toast) return;
        toastMessage.textContent = message;
        toastIcon.className = 'fas ' + (type === 'error' ? 'fa-exclamation-circle text-red-600' : type === 'success' ? 'fa-check-circle text-green-600' : 'fa-info-circle text-gray-600');
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 2500);
    }

    // Modal helpers
    function openModal(modal) {
        if (modal) modal.classList.remove('hidden');
    }

    function closeModal(modal) {
        if (modal) modal.classList.add('hidden');
    }

    document.querySelectorAll('[data-modal-close]').forEach(el => el.addEventListener('click', () => {
        closeModal(claimModal);
        closeModal(viewClaimModal);
    }));

    // Regex validations
    const patterns = {
        // allow up to millions, 2 decimal places
        claimAmount: /^(?!0$)\d{1,9}(?:\.\d{1,2})?$/,
        userEmail: /^[\w.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/,
    };

    function clearErrors() {
        [claimIdError, claimAmountError, userEmailError, typeError, statusError, dateFilledError].forEach(el => {
            if (el) el.textContent = '';
        });
    }

    function todayStr() {
        const d = new Date();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${d.getFullYear()}-${m}-${day}`;
    }

    function setDateMin() {
        const t = todayStr();
        if (dateFilledInput) dateFilledInput.min = t; // prevent picking past dates
    }

    function validateForm(data) {
        clearErrors();
        let valid = true;

        if (!data.claimAmount || !patterns.claimAmount.test(String(data.claimAmount))) {
            if (claimAmountError) claimAmountError.textContent = 'Enter a valid amount (>0, max 2 decimals).';
            valid = false;
        }

        if (!data.userEmail || !patterns.userEmail.test(data.userEmail)) {
            if (userEmailError) userEmailError.textContent = 'Enter a valid email address.';
            valid = false;
        }

        if (!data.type) {
            if (typeError) typeError.textContent = 'Select a claim type.';
            valid = false;
        }

        if (!data.status) {
            if (statusError) statusError.textContent = 'Select a status.';
            valid = false;
        }

        if (!data.dateFilled) {
            if (dateFilledError) dateFilledError.textContent = 'Pick a date.';
            valid = false;
        } else {
            const today = todayStr();
            if (data.dateFilled < today) {
                if (dateFilledError) dateFilledError.textContent = 'Past dates are not allowed.';
                valid = false;
            }
        }

        return valid;
    }

    // Fetch helpers
    async function apiGetAll() {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error('Failed to load claims');
        return res.json();
    }

    async function apiCreate(data) {
        const res = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create claim');
        return res.json();
    }

    async function apiUpdate(id, data) {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to update claim');
        return res.json();
    }

    async function apiDelete(id) {
        const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete claim');
    }

    // Rendering
    function renderClaims(list) {
        if (!tableBody) return;

        tableBody.innerHTML = '';
        if (!list.length) {
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');

        const currentUserEmail = JSON.stringify(localStorage.getItem("user"))

        list = list.filter((claim)=>claim.userEmail === currentUserEmail.email);

        list.forEach(c => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50';
            tr.innerHTML = `
        <td class="px-4 py-3 text-sm text-gray-800">${escapeHtml(c.claimId || '')}</td>
        <td class="px-4 py-3 text-sm text-gray-800">${formatAmount(c.claimAmount)}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(c.userEmail)}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(c.type || '')}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(c.status)}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(c.dateFilled || '')}</td>
        <td class="px-4 py-3 text-right">
          <div class="inline-flex items-center space-x-2">
            <button class="px-2 py-1 text-indigo-700 hover:text-indigo-900" data-action="view" data-id="${c.id}"><i class="fas fa-eye"></i></button>
            <button class="px-2 py-1 text-blue-700 hover:text-blue-900" data-action="edit" data-id="${c.id}"><i class="fas fa-edit"></i></button>
            <button class="px-2 py-1 text-red-700 hover:text-red-900" data-action="delete" data-id="${c.id}"><i class="fas fa-trash"></i></button>
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
        if (!searchInput || !statusFilter || !typeFilter || !futureOnly) return;

        const q = searchInput.value.trim().toLowerCase();
        const status = statusFilter.value;
        const type = typeFilter.value;
        const onlyFuture = futureOnly.checked;

        const filtered = claims.filter(c => {
            const matchQ = !q || [c.claimId || '', c.userEmail, c.status, c.type || '', c.claimAmount?.toString() || '', c.dateFilled || ''].some(v => String(v).toLowerCase().includes(q));
            const matchStatus = !status || c.status === status;
            const matchType = !type || c.type === type;
            const matchFuture = !onlyFuture || (c.dateFilled && c.dateFilled >= todayStr());
            return matchQ && matchStatus && matchType && matchFuture;
        });

        renderClaims(filtered);
    }

    // Load
    async function loadClaims() {
        if (loadingState) loadingState.classList.remove('hidden');

        try {
            claims = await apiGetAll();
            applyFilters();
        } catch (e) {
            showToast(e.message, 'error');
        } finally {
            if (loadingState) loadingState.classList.add('hidden');
        }
    }

    // Form
    function openCreate() {
        editingId = null;
        if (claimModalTitle) claimModalTitle.textContent = 'New Claim';
        if (claimForm) claimForm.reset();
        clearErrors();
        setDateMin();
        if (claimModal) openModal(claimModal);
    }

    function openEdit(c) {
        editingId = c.id;
        if (claimModalTitle) claimModalTitle.textContent = 'Edit Claim';
        if (claimIdInput) claimIdInput.value = c.claimId ?? '';
        if (claimAmountInput) claimAmountInput.value = c.claimAmount ?? '';
        if (userEmailInput) userEmailInput.value = c.userEmail ?? '';
        if (typeInput) typeInput.value = c.type ?? 'ADULT';
        if (statusInput) statusInput.value = c.status ?? '';
        if (dateFilledInput) dateFilledInput.value = c.dateFilled ?? '';
        clearErrors();
        setDateMin();
        if (claimModal) openModal(claimModal);
    }

    function buildFormData() {
        return {
            claimId: claimIdInput ? claimIdInput.value : '',
            claimAmount: claimAmountInput && claimAmountInput.value ? Number(claimAmountInput.value) : null,
            userEmail: userEmailInput ? userEmailInput.value.trim() : '',
            type: typeInput ? typeInput.value : '',
            status: statusInput ? statusInput.value : '',
            dateFilled: dateFilledInput ? dateFilledInput.value : ''
        };
    }

    if (claimForm) {
        claimForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = buildFormData();
            if (!validateForm(data)) return;
            try {
                if (editingId) {
                    await apiUpdate(editingId, data);
                    showToast('Claim updated', 'success');
                } else {
                    await apiCreate(data);
                    showToast('Claim created', 'success');
                }
                closeModal(claimModal);
                await loadClaims();
            } catch (err) {
                showToast(err.message, 'error');
            }
        });
    }

    // Table actions
    if (tableBody) {
        tableBody.addEventListener('click', async (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const id = btn.getAttribute('data-id');
            const action = btn.getAttribute('data-action');
            const c = claims.find(x => String(x.id) === String(id));
            if (!c) return;

            if (action === 'view') {
                viewingClaim = c;
                if (viewClaimContent) {
                    viewClaimContent.innerHTML = `
            <div><span class="font-medium">Claim ID:</span> ${escapeHtml(c.claimId || '')}</div>
            <div><span class="font-medium">Amount:</span> ${formatAmount(c.claimAmount)}</div>
            <div><span class="font-medium">User Email:</span> ${escapeHtml(c.userEmail)}</div>
            <div><span class="font-medium">Type:</span> ${escapeHtml(c.type || '')}</div>
            <div><span class="font-medium">Status:</span> ${escapeHtml(c.status)}</div>
            <div><span class="font-medium">Date Filled:</span> ${escapeHtml(c.dateFilled || '')}</div>
          `;
                }
                openModal(viewClaimModal);
            }
            if (action === 'edit') {
                openEdit(c);
            }
            if (action === 'delete') {
                if (!confirm('Delete this claim?')) return;
                try {
                    await apiDelete(c.id);
                    showToast('Claim deleted', 'success');
                    await loadClaims();
                } catch (err) {
                    showToast(err.message, 'error');
                }
            }
        });
    }

    // Events
    if (newClaimBtn) newClaimBtn.addEventListener('click', openCreate);
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (typeFilter) typeFilter.addEventListener('change', applyFilters);
    if (futureOnly) futureOnly.addEventListener('change', applyFilters);

    document.addEventListener('DOMContentLoaded', () => { setDateMin(); loadClaims(); });
})();
