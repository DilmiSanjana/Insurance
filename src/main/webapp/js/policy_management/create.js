(() => {
    const form   = document.getElementById('policyForm');
    const fields = {
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

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            policyTitle                 : fields.title.value.trim(),
            description                 : fields.description.value.trim(),
            additionalDetails         : fields.details.value.trim(),
            policyIdentificationNumber: fields.policyId.value.trim().toUpperCase(),
            deleteStatus               : false,
            activeStatus               : fields.active.checked
        };

        toggleLoading(true);
        try {
            const res = await fetch('/api/policies', {
                method : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body   : JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Save failed');
            window.location.href=  "/policy-management"
        } catch (err) {
            alert('Error: ' + err.message);
            toggleLoading(false);
        }
    });
})();