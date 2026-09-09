<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Our Policies</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
        body{font-family:'Inter',sans-serif}
        .policy-card{transition:transform .3s,box-shadow .3s}
        .policy-card:hover{transform:translateY(-4px);box-shadow:0 20px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04)}
        .gradient-bg{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%)}
    </style>

</head>
<body class="bg-gray-50 font-sans bg-cover bg-center bg-no-repeat"
      style="background-image: url('https://img.freepik.com/premium-vector/company-policies-concept_107173-16738.jpg');">

<header class="text-white gradient-bg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 class="text-4xl md:text-5xl font-bold flex items-center gap-3">
            <i class="fas fa-shield-alt"></i>
            Our Insurance Policies
        </h1>
        <p class="mt-4 text-lg opacity-90">Transparent, reliable and tailored for you</p>
    </div>
</header>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="relative w-full sm:w-96">
            <input id="searchInput" type="text" placeholder="Search policies..."
                   class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none">
            <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
        </div>
        <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600">Filter:</span>
            <select id="statusFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none">
                <option value="all">All Policies</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
            </select>
        </div>
    </div>

    <div id="policyGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>

    <div id="emptyState" class="hidden text-center py-20">
        <i class="fas fa-folder-open text-6xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 text-lg">No policies found</p>
    </div>
</main>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="/js/policy_management/customerView.js"></script>
</body>

</html>