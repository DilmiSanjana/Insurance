(() => {
    const form   = document.getElementById('policyForm');
    const fields = {
        id         : document.getElementById('policyDbId'),
        title      : document.getElementById('title'),
        description: document.getElementById('description'),
        details    : document.getElementById('details'),
        policyId   : document.getElementById('policyId'),
        active     : document.getElementById('active')
    };
    const errors = {
        title: document.getElementById('titleErr'),
        desc : document.getElementById('descErr'),
        id   : document.getElementById('idErr')
    };
    const spinner = document.querySelector('.spinner');
    const btnText = document.querySelector('.btn-text');

    const patterns = {
        title   : /^[A-Za-z0-9\s\-.,()&]{5,100}$/,
        desc    : /^[\w\s\-.,()&]{10,1000}$/,
        policyId: /^[A-Z0-9]{3,50}$/i
    };

    const toggleLoading = (loading) => {
        spinner.style.display = loading ? 'inline-block' : 'none';
        form.querySelector('button[type="submit"]').disabled = loading;
    };

    const showError = (el, msg) => { el.textContent = msg; el.style.display = 'block'; };
    const hideError = (el) => el.style.display = 'none';

    const validate = () => {
        let ok = true;
        if (!patterns.title.test(fields.title.value.trim())) {
            showError(errors.title, '5-100 chars: letters, numbers, spaces, - . , ( ) &');
            ok = false;
        } else hideError(errors.title);

        if (!patterns.desc.test(fields.description.value.trim())) {
            showError(errors.desc, '10-1000 chars: letters, numbers, spaces, - . , ( ) &');
            ok = false;
        } else hideError(errors.desc);

        if (!patterns.policyId.test(fields.policyId.value.trim())) {
            showError(errors.id, '3-50 alphanumeric chars');
            ok = false;
        } else hideError(errors.id);

        return ok;
    };

    const loadPolicy = async () => {
        const params = new URLSearchParams(location.search);
        const pid    = params.get('policyId');
        if (!pid) { alert('Missing policyId'); history.back(); return; }

        try {
            const res = await fetch('/api/policies');
            if (!res.ok) throw new Error('Fetch failed');
            const list = await res.json();
            const p    = list.find(x => x.policyIdentificationNumber === pid);
            if (!p) { alert('Policy not found'); history.back(); return; }

            fields.id.value   = p.id;
            fields.title.value= p.policyTitle;
            fields.description.value = p.description;
            fields.details.value     = p.additionalDetails || '';
            fields.policyId.value    = p.policyIdentificationNumber;
            fields.active.value      = p.activeStatus.toString();
        } catch (e) {
            alert('Error loading policy');
            history.back();
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            policyTitle                 : fields.title.value.trim(),
            description                 : fields.description.value.trim(),
            additionalDetails         : fields.details.value.trim(),
            policyIdentificationNumber: fields.policyId.value.trim().toUpperCase(),
            deleteStatus               : false,
            activeStatus               : fields.active.value === 'true'
        };

        toggleLoading(true);
        try {
            const res = await fetch(`/api/policies/${fields.id.value}`, {
                method : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body   : JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Update failed');
            window.location.href=  "/policy-management"
        } catch (err) {
            alert('Error: ' + err.message);
            toggleLoading(false);
        }
    });

    loadPolicy();
})();