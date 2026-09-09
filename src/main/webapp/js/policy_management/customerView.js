(() => {
    const grid        = document.getElementById('policyGrid');
    const searchInp   = document.getElementById('searchInput');
    const statusSel   = document.getElementById('statusFilter');
    const emptyState  = document.getElementById('emptyState');
    let policies      = [];

    const fetchPolicies = async () => {
        try {
            const res = await fetch('/api/policies');
            if (!res.ok) throw new Error('Fetch failed');
            policies = await res.json();
            render();
        } catch (e) {
            alert('Error loading policies');
        }
    };

    const createCard = (p) => {
        const badge = p.activeStatus
            ? '<span class="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">Active</span>'
            : '<span class="absolute top-4 right-4 bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">Inactive</span>';

        return `
        <div class="policy-card relative bg-white rounded-2xl shadow-md overflow-hidden">
            ${badge}
            <div class="p-6">
                <div class="flex items-start gap-4">
                    <div class="bg-purple-100 text-purple-600 rounded-xl p-3">
                        <i class="fas fa-file-contract text-2xl"></i>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-xl font-bold text-gray-800">${p.policyTitle}</h3>
                        <p class="text-sm text-gray-500 mt-1">ID: ${p.policyIdentificationNumber}</p>
                    </div>
                </div>
                <p class="text-gray-600 mt-4 line-clamp-3">${p.description}</p>
                ${p.additionalDetails ? `<details class="mt-4 text-sm text-gray-500"><summary class="cursor-pointer font-medium">More details</summary><p class="mt-2">${p.additionalDetails}</p></details>` : ''}
                <div class="mt-6 flex items-center justify-between">
                    <button onclick="viewPdf('${p.policyIdentificationNumber}')" class="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-2">
                        <i class="fas fa-download"></i> Download PDF
                    </button>
                </div>
            </div>
        </div>`;
    };

    const render = () => {
        const q      = searchInp.value.trim().toLowerCase();
        const status = statusSel.value;
        const filtered = policies.filter(p => {
            const match = p.policyTitle.toLowerCase().includes(q) || p.policyIdentificationNumber.toLowerCase().includes(q);
            if (status === 'all') return match;
            return match && (status === 'active' ? p.activeStatus : !p.activeStatus);
        });

        if (!filtered.length) {
            grid.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }
        emptyState.classList.add('hidden');
        grid.innerHTML = filtered.map(createCard).join('');
    };

    window.viewPdf = (pid) => {
        const p = policies.find(x => x.policyIdentificationNumber === pid);
        if (!p) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('Policy Document', 20, 30);
        doc.setFontSize(12);
        doc.text(`Title: ${p.policyTitle}`, 20, 50);
        doc.text(`Policy ID: ${p.policyIdentificationNumber}`, 20, 60);
        doc.text(`Description: ${p.description}`, 20, 70);
        if (p.additionalDetails) doc.text(`Details: ${p.additionalDetails}`, 20, 80);
        doc.text(`Status: ${p.activeStatus ? 'Active' : 'Inactive'}`, 20, 90);
        doc.save(`policy_${p.policyIdentificationNumber}.pdf`);
    };

    searchInp.addEventListener('input', render);
    statusSel.addEventListener('change', render);

    fetchPolicies();
})();