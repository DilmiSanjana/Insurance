<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Policy Management</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        :root{--primary:#0d6efd;--danger:#dc3545;--gray:#6c757d;--light:#f8f9fa}
        body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:var(--light);margin:0;padding:2rem}
        .card{background:#fff;border-radius:.5rem;box-shadow:0 .125rem .25rem rgba(0,0,0,.075);padding:1.5rem}
        h2{margin-top:0;display:flex;align-items:center;gap:.5rem}
        .toolbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;flex-wrap:wrap;gap:1rem}
        .search-box{display:flex;align-items:center;gap:.5rem}
        .search-box input{padding:.5rem;border:1px solid #ced4da;border-radius:.25rem;width:220px}
        .btn{background:var(--primary);color:#fff;border:none;padding:.5rem .75rem;border-radius:.25rem;font-size:.9rem;cursor:pointer;display:inline-flex;align-items:center;gap:.5rem}
        .btn-danger{background:var(--danger)}
        table{width:100%;border-collapse:collapse}
        th,td{padding:.75rem;text-align:left;border-bottom:1px solid #dee2e6}
        th{background:var(--light);font-weight:600}
        .actions{display:flex;gap:.5rem}
        .no-data{text-align:center;padding:2rem;color:var(--gray)}
        @media print{body{padding:0}.card{box-shadow:none}.toolbar,.actions{display:none}}
    </style>
</head>
<body>

<div class="card">
    <h2><i class="fa-solid fa-list"></i> Policy Management</h2>

    <div class="toolbar">
        <div class="search-box">
            <i class="fa-solid fa-search"></i>
            <input id="searchInput" placeholder="Search policies...">
        </div>
        <button id="createBtn" class="btn">
            <i class="fa-solid fa-plus"></i> Create
        </button>
    </div>

    <table id="policyTable">
        <thead>
        <tr>
            <th>Title</th>
            <th>Policy ID</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody></tbody>
    </table>
    <div id="noData" class="no-data" style="display:none">No policies found</div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="/js/policy_management/adminList.js"></script>
</body>
</html>