<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Underwriter Documents</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gray-50">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-800 mb-2">Underwriter Documents Management</h1>
            <p class="text-gray-600">Review and manage customer submitted documents</p>
        </div>

        <div class="mb-6 flex gap-4 flex-wrap">
            <button onclick="filterStatus('ALL')" class="px-4 py-2 rounded-lg font-semibold transition bg-gray-800 text-white" id="filterALL">
                All Documents
            </button>
            <button onclick="filterStatus('PENDING')" class="px-4 py-2 rounded-lg font-semibold transition bg-gray-200 text-gray-700 hover:bg-gray-300" id="filterPENDING">
                Pending
            </button>
            <button onclick="filterStatus('IN_REVIEW')" class="px-4 py-2 rounded-lg font-semibold transition bg-gray-200 text-gray-700 hover:bg-gray-300" id="filterIN_REVIEW">
                In Review
            </button>
            <button onclick="filterStatus('APPROVED')" class="px-4 py-2 rounded-lg font-semibold transition bg-gray-200 text-gray-700 hover:bg-gray-300" id="filterAPPROVED">
                Approved
            </button>
            <button onclick="filterStatus('REJECTED')" class="px-4 py-2 rounded-lg font-semibold transition bg-gray-200 text-gray-700 hover:bg-gray-300" id="filterREJECTED">
                Rejected
            </button>
        </div>

        <div id="documentsGrid" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"></div>
    </div>

    <!-- Review/Edit Modal -->
    <div id="documentModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 class="text-2xl font-bold text-gray-800">Review Document</h2>
                <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700 text-2xl">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="p-6 space-y-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-500 mb-1">Document ID</p>
                            <p class="font-semibold" id="viewDocId"></p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 mb-1">Customer Email</p>
                            <p class="font-semibold" id="viewEmail"></p>
                        </div>
                    </div>
                </div>

                <div>
                    <p class="text-sm font-semibold text-gray-700 mb-3">
                        <i class="fas fa-paperclip mr-1"></i>
                        Submitted Files
                    </p>
                    <div id="viewMediaUrls" class="space-y-2"></div>
                </div>

                <form id="documentForm" class="space-y-6 border-t pt-6">
                    <input type="hidden" id="documentId">
                    
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Status *
                        </label>
                        <select id="status" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="PENDING">Pending</option>
                            <option value="IN_REVIEW">In Review</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">
                            Reply Message
                        </label>
                        <textarea id="replyMessage" rows="5"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your response to the customer..."></textarea>
                        <p class="text-sm text-gray-500 mt-1">This message will be visible to the customer</p>
                    </div>

                    <div class="flex gap-3">
                        <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
                            <i class="fas fa-save mr-2"></i>Update Document
                        </button>
                        <button type="button" onclick="closeModal()" class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
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

    <script src="js/admin-underwriter-documents.js"></script>
</body>
</html>