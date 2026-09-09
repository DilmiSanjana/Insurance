<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Edit Policy</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        :root{--primary:#0d6efd;--danger:#dc3545;--gray:#6c757d;--light:#f8f9fa}
        body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:var(--light);margin:0;padding:2rem}
        .card{max-width:600px;margin:auto;background:#fff;border-radius:.5rem;box-shadow:0 .125rem .25rem rgba(0,0,0,.075);padding:2rem}
        h2{margin-top:0;display:flex;align-items:center;gap:.5rem}
        .form-group{margin-bottom:1rem}
        label{display:block;margin-bottom:.25rem;font-weight:600}
        input,textarea,select{width:100%;padding:.5rem;border:1px solid #ced4da;border-radius:.25rem;font-size:1rem}
        textarea{resize:vertical;min-height:100px}
        .error{color:var(--danger);font-size:.875rem;margin-top:.25rem;display:none}
        .btn{background:var(--primary);color:#fff;border:none;padding:.5rem 1rem;border-radius:.25rem;font-size:1rem;cursor:pointer;display:inline-flex;align-items:center;gap:.5rem}
        .btn:disabled{opacity:.65;cursor:not-allowed}
        .spinner{display:none}
        .actions{display:flex;gap:.5rem;margin-top:1.5rem}
    </style>
</head>
<body>

<div class="card">
    <h2><i class="fa-solid fa-pen-to-square"></i> Edit Policy</h2>

    <form id="policyForm" novalidate>
        <input type="hidden" id="policyDbId">

        <div class="form-group">
            <label>Policy Title</label>
            <input id="title" maxlength="100" required>
            <div class="error" id="titleErr"></div>
        </div>

        <div class="form-group">
            <label>Description</label>
            <textarea id="description" maxlength="1000" required></textarea>
            <div class="error" id="descErr"></div>
        </div>

        <div class="form-group">
            <label>Additional Details</label>
            <textarea id="details" maxlength="2000"></textarea>
        </div>

        <div class="form-group">
            <label>Policy ID Number</label>
            <input id="policyId" maxlength="50" required readonly>
            <div class="error" id="idErr"></div>
        </div>

        <div class="form-group">
            <label>Status</label>
            <select id="active">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
            </select>
        </div>

        <div class="actions">
            <button type="submit" class="btn">
                <i class="fa-solid fa-spinner spinner"></i>
                <span class="btn-text">Update</span>
            </button>
            <button type="button" class="btn" style="background:var(--gray)" onclick="history.back()">
                <i class="fa-solid fa-arrow-left"></i> Back
            </button>
        </div>
    </form>
</div>

<script src="/js/policy_management/edit.js"></script>
</body>
</html>