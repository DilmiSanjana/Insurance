(() => {
    const tbody     = document.querySelector('#policyTable tbody');
    const searchInp = document.getElementById('searchInput');
    const createBtn = document.getElementById('createBtn');
    const noData    = document.getElementById('noData');
    let policies    = [];

    const fetchPolicies = async () => {
        try {
            const res = await fetch('/api/policies');
            if (!res.ok) throw new Error('Fetch failed');
            policies = await res.json();
            render(policies);
        } catch (e) {
            alert('Error loading policies');
        }
    };

    const render = (list) => {
        if (!list.length) {
            tbody.innerHTML = '';
            noData.style.display = 'block';
            return;
        }
        noData.style.display = 'none';
        tbody.innerHTML = list.map(p => `
            <tr data-id="${p.id}">
                <td>${p.policyTitle}</td>
                <td>${p.policyIdentificationNumber}</td>
                <td>${p.activeStatus ? 'Active' : 'Inactive'}</td>
                <td class="actions">
                    <button class="btn" onclick="editPolicy('${p.policyIdentificationNumber}')">
                        <i class="fa-solid fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deletePolicy(${p.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <button class="btn" onclick="printPolicy(${p.id})">
                        <i class="fa-solid fa-print"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    };

    window.editPolicy = (pid) => {
        location.href = `/admin/policies/edit?policyId=${pid}`;
    };

    window.deletePolicy = async (id) => {
        if (!confirm('Delete this policy?')) return;
        try {
            const res = await fetch(`/api/policies/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            policies = policies.filter(p => p.id !== id);
            render(policies);
        } catch (e) {
            alert('Error deleting policy');
        }
    };

    window.printPolicy = (id) => {
        const p = policies.find(x => x.id === id);
        if (!p) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Policy Details', 14, 20);
        doc.setFontSize(12);
        doc.text(`Title: ${p.policyTitle}`, 14, 35);
        doc.text(`Policy ID: ${p.policyIdentificationNumber}`, 14, 45);
        doc.text(`Description: ${p.description || 'N/A'}`, 14, 55);
        doc.text(`Additional Details: ${p.additionalDetails || 'N/A'}`, 14, 65);
        doc.text(`Status: ${p.activeStatus ? 'Active' : 'Inactive'}`, 14, 75);
        doc.save(`policy_${p.policyIdentificationNumber}.pdf`);
    };

    searchInp.addEventListener('input', () => {
        const q = searchInp.value.trim().toLowerCase();
        const filtered = policies.filter(p =>
            p.policyTitle.toLowerCase().includes(q) ||
            p.policyIdentificationNumber.toLowerCase().includes(q)
        );
        render(filtered);
    });

    createBtn.addEventListener('click', () => {
        location.href = '/admin/policies/create';
    });

    fetchPolicies();
})();