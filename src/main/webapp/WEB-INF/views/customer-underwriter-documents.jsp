<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Documents</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-50">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800">My Documents</h1>
            <button onclick="openCreateModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition">
                <i class="fas fa-plus"></i>
                <span>Submit New Document</span>
            </button>
        </div>

        <div id="documentsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
    </div>

    <!-- Create/Edit Modal -->
    <div id="documentModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 id="modalTitle" class="text-2xl font-bold text-gray-800">Submit New Document</h2>
                <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700 text-2xl">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <form id="documentForm" class="p-6 space-y-6">
                <input type="hidden" id="documentId">
                
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <input type="email" id="customerEmail" required 
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your.email@example.com">
                    <p class="text-red-500 text-sm mt-1 hidden" id="emailError">Please enter a valid email address</p>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Upload Media Files *</label>
                    <input type="file" id="fileInput" multiple accept="image/*,video/*,.pdf"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <p class="text-sm text-gray-500 mt-1">Upload images, videos, or PDF documents</p>
                    <div id="uploadProgress" class="hidden mt-3">
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div id="progressBar" class="bg-blue-600 h-2 rounded-full transition-all" style="width: 0%"></div>
                        </div>
                        <p class="text-sm text-gray-600 mt-1" id="progressText">Uploading...</p>
                    </div>
                </div>

                <div id="mediaUrlsContainer" class="space-y-2"></div>

                <div class="flex gap-3 pt-4">
                    <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
                        <i class="fas fa-check mr-2"></i>Submit
                    </button>
                    <button type="button" onclick="closeModal()" class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div id="deleteModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div class="text-center">
                <i class="fas fa-exclamation-triangle text-red-500 text-5xl mb-4"></i>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Delete Document?</h3>
                <p class="text-gray-600 mb-6">This action cannot be undone. Are you sure you want to delete this document?</p>
                <div class="flex gap-3">
                    <button onclick="closeDeleteModal()" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                        Cancel
                    </button>
                    <button onclick="confirmDelete()" class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script src="js/customer-underwriter-documents.js"></script>
</body>
</html>