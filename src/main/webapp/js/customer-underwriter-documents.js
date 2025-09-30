const API_BASE = '/api/underwriter-documents';
const UPLOAD_API = '/api/uploads/batch';

let documents = [];
let currentMediaUrls = [];
let deleteId = null;

// Email regex validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Load documents on page load
document.addEventListener('DOMContentLoaded', loadDocuments);

async function loadDocuments() {
    try {
        const res = await fetch(API_BASE);
        documents = await res.json();
        renderDocuments();
    } catch (err) {
        console.error('Failed to load documents:', err);
    }
}

function renderDocuments() {
    const grid = document.getElementById('documentsGrid');
    
    if (documents.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-folder-open text-6xl text-gray-300 mb-4"></i>
                <p class="text-gray-500 text-lg">No documents submitted yet</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = documents.map(doc => `
        <div class="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
            <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                        <i class="fas fa-envelope text-gray-400"></i>
                        <span class="text-sm text-gray-600 truncate">${doc.customerEmail}</span>
                    </div>
                    <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(doc.status)}">
                        ${doc.status}
                    </span>
                </div>
            </div>

            ${doc.replyMessage ? `
                <div class="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
                    <p class="text-sm text-gray-700"><strong>Admin Reply:</strong></p>
                    <p class="text-sm text-gray-600 mt-1">${doc.replyMessage}</p>
                </div>
            ` : ''}

            <div class="mb-4">
                <p class="text-sm font-semibold text-gray-700 mb-2">
                    <i class="fas fa-paperclip mr-1"></i>
                    Attachments (${doc.mediaUrls.length})
                </p>
                <div class="flex flex-wrap gap-2">
                    ${doc.mediaUrls.slice(0, 3).map(url => `
                        <a href="${url}" target="_blank" class="text-blue-600 hover:text-blue-800 text-xs underline">
                            View file
                        </a>
                    `).join('')}
                    ${doc.mediaUrls.length > 3 ? `<span class="text-xs text-gray-500">+${doc.mediaUrls.length - 3} more</span>` : ''}
                </div>
            </div>

            ${canEdit(doc.status) ? `
                <div class="flex gap-2 pt-4 border-t">
                    <button onclick="openEditModal(${doc.id})" class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition">
                        <i class="fas fa-edit mr-1"></i>Edit
                    </button>
                    <button onclick="openDeleteModal(${doc.id})" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            ` : `
                <div class="pt-4 border-t text-center text-sm text-gray-500">
                    <i class="fas fa-lock mr-1"></i>
                    Cannot edit documents in ${doc.status} status
                </div>
            `}
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

function canEdit(status) {
    return status === 'PENDING' || status === 'REJECTED';
}

function openCreateModal() {
    document.getElementById('modalTitle').textContent = 'Submit New Document';
    document.getElementById('documentForm').reset();
    document.getElementById('documentId').value = '';
    currentMediaUrls = [];
    renderMediaUrls();
    document.getElementById('documentModal').classList.remove('hidden');
}

async function openEditModal(id) {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;

    document.getElementById('modalTitle').textContent = 'Edit Document';
    document.getElementById('documentId').value = doc.id;
    document.getElementById('customerEmail').value = doc.customerEmail;
    currentMediaUrls = [...doc.mediaUrls];
    renderMediaUrls();
    document.getElementById('documentModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('documentModal').classList.add('hidden');
    document.getElementById('documentForm').reset();
    currentMediaUrls = [];
    document.getElementById('emailError').classList.add('hidden');
}

function renderMediaUrls() {
    const container = document.getElementById('mediaUrlsContainer');
    
    if (currentMediaUrls.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <div class="border border-gray-300 rounded-lg p-4">
            <p class="text-sm font-semibold text-gray-700 mb-3">Uploaded Files (${currentMediaUrls.length})</p>
            <div class="space-y-2">
                ${currentMediaUrls.map((url, idx) => `
                    <div class="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <a href="${url}" target="_blank" class="text-sm text-blue-600 hover:text-blue-800 truncate flex-1 mr-2">
                            <i class="fas fa-file mr-1"></i>
                            File ${idx + 1}
                        </a>
                        <button type="button" onclick="removeMediaUrl(${idx})" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function removeMediaUrl(idx) {
    currentMediaUrls.splice(idx, 1);
    renderMediaUrls();
}

document.getElementById('fileInput').addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const progress = document.getElementById('uploadProgress');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    try {
        progress.classList.remove('hidden');
        progressBar.style.width = '50%';
        progressText.textContent = 'Uploading files...';

        const res = await fetch(UPLOAD_API, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) throw new Error('Upload failed');

        const data = await res.json();
        currentMediaUrls.push(...data.urls);
        
        progressBar.style.width = '100%';
        progressText.textContent = 'Upload complete!';
        
        setTimeout(() => {
            progress.classList.add('hidden');
            progressBar.style.width = '0%';
            e.target.value = '';
        }, 1000);

        renderMediaUrls();
    } catch (err) {
        alert('Failed to upload files: ' + err.message);
        progress.classList.add('hidden');
        progressBar.style.width = '0%';
    }
});

document.getElementById('documentForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('customerEmail').value.trim();
    const emailError = document.getElementById('emailError');

    // Validate email
    if (!emailRegex.test(email)) {
        emailError.classList.remove('hidden');
        return;
    }
    emailError.classList.add('hidden');

    if (currentMediaUrls.length === 0) {
        alert('Please upload at least one media file');
        return;
    }

    const id = document.getElementById('documentId').value;
    const payload = {
        customerEmail: email,
        mediaUrls: currentMediaUrls,
        status: 'PENDING'
    };

    try {
        const url = id ? `${API_BASE}/${id}` : API_BASE;
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Failed to save document');

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