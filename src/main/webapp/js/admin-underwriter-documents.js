const API_BASE = '/api/underwriter-documents';

let documents = [];
let filteredDocuments = [];
let currentFilter = 'ALL';
let deleteId = null;

document.addEventListener('DOMContentLoaded', loadDocuments);

async function loadDocuments() {
    try {
        const res = await fetch(API_BASE);
        documents = await res.json();
        applyFilter();
    } catch (err) {
        console.error('Failed to load documents:', err);
    }
}

function filterStatus(status) {
    currentFilter = status;
    
    document.querySelectorAll('[id^="filter"]').forEach(btn => {
        btn.className = 'px-4 py-2 rounded-lg font-semibold transition bg-gray-200 text-gray-700 hover:bg-gray-300';
    });
    
    document.getElementById('filter' + status).className = 'px-4 py-2 rounded-lg font-semibold transition bg-gray-800 text-white';
    
    applyFilter();
}

function applyFilter() {
    if (currentFilter === 'ALL') {
        filteredDocuments = documents;
    } else {
        filteredDocuments = documents.filter(doc => doc.status === currentFilter);
    }
    renderDocuments();
}

function renderDocuments() {
    const grid = document.getElementById('documentsGrid');
    
    if (filteredDocuments.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
                <p class="text-gray-500 text-lg">No documents found</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredDocuments.map(doc => `
        <div class="bg-white rounded-lg shadow hover:shadow-lg transition">
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex-1">
                        <p class="text-xs text-gray-500 mb-1">ID: ${doc.id}</p>
                        <div class="flex items-center gap-2 mb-2">
                            <i class="fas fa-envelope text-gray-400"></i>
                            <span class="text-sm font-medium text-gray-700 truncate">${doc.customerEmail}</span>
                        </div>
                        <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(doc.status)}">
                            ${doc.status}
                        </span>
                    </div>
                </div>

                <div class="mb-4">
                    <p class="text-sm font-semibold text-gray-700 mb-2">
                        <i class="fas fa-paperclip mr-1"></i>
                        Files (${doc.mediaUrls.length})
                    </p>
                    <div class="flex flex-wrap gap-2">
                        ${doc.mediaUrls.slice(0, 2).map((url, idx) => `
                            <a href="${url}" target="_blank" class="text-xs text-blue-600 hover:text-blue-800 underline">
                                File ${idx + 1}
                            </a>
                        `).join('')}
                        ${doc.mediaUrls.length > 2 ? `<span class="text-xs text-gray-500">+${doc.mediaUrls.length - 2} more</span>` : ''}
                    </div>
                </div>

                ${doc.replyMessage ? `
                    <div class="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
                        <p class="text-xs text-gray-600 font-semibold mb-1">Your Reply:</p>
                        <p class="text-sm text-gray-700 line-clamp-2">${doc.replyMessage}</p>
                    </div>
                ` : ''}
            </div>

            <div class="border-t px-6 py-3 bg-gray-50 flex gap-2">
                <button onclick="openReviewModal(${doc.id})" class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition">
                    <i class="fas fa-edit mr-1"></i>Review
                </button>
                <button onclick="openDeleteModal(${doc.id})" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function getStatusColor(status) {
    const colors = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        IN_REVIEW: 'bg-blue-100 text-blue-800',
        APPROVED: 'bg-green-100 text-green-800',
        REJECTED: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

async function openReviewModal(id) {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;

    document.getElementById('documentId').value = doc.id;
    document.getElementById('viewDocId').textContent = doc.id;
    document.getElementById('viewEmail').textContent = doc.customerEmail;
    document.getElementById('status').value = doc.status;
    document.getElementById('replyMessage').value = doc.replyMessage || '';

    const mediaContainer = document.getElementById('viewMediaUrls');
    mediaContainer.innerHTML = doc.mediaUrls.map((url, idx) => `
        <div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div class="flex items-center gap-3 flex-1">
                <i class="fas fa-file text-gray-400"></i>
                <span class="text-sm text-gray-700">File ${idx + 1}</span>
            </div>
            <a href="${url}" target="_blank" class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition">
                <i class="fas fa-external-link-alt mr-1"></i>View
            </a>
        </div>
    `).join('');

    document.getElementById('documentModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('documentModal').classList.add('hidden');
    document.getElementById('documentForm').reset();
}

document.getElementById('documentForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('documentId').value;
    const doc = documents.find(d => d.id == id);
    if (!doc) return;

    const payload = {
        customerEmail: doc.customerEmail,
        status: document.getElementById('status').value,
        replyMessage: document.getElementById('replyMessage').value.trim() || null,
        mediaUrls: doc.mediaUrls
    };

    try {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Failed to update document');

        closeModal();
        loadDocuments();
    } catch (err) {
        alert('Error: ' + err.message);
    }
});

function openDeleteModal(id) {
    deleteId = id;
    document.getElementById('deleteModal').classList.remove('hidden');
}

function closeDeleteModal() {
    deleteId = null;
    document.getElementById('deleteModal').classList.add('hidden');
}

async function confirmDelete() {
    if (!deleteId) return;

    try {
        const res = await fetch(`${API_BASE}/${deleteId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete');

        closeDeleteModal();
        loadDocuments();
    } catch (err) {
        alert('Error: ' + err.message);
    }
}