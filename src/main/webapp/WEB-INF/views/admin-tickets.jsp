<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Customer Support</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-white min-h-screen">
<div class="container mx-auto px-4 py-8 max-w-6xl">
    <h1 class="text-3xl font-bold mb-8 text-black">Admin - Support Tickets</h1>

    <div class="mb-6 flex gap-4">
        <button id="loadAllTickets" class="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
            <i class="fas fa-sync mr-2"></i>Load All Tickets
        </button>
    </div>

    <div class="bg-white border border-gray-200 rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-black">All Tickets</h2>
        <div id="ticketsList"></div>
    </div>
</div>

<div id="replyModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-black">Update Ticket</h2>
            <button id="closeReplyModal" class="text-gray-500 hover:text-black">
                <i class="fas fa-times text-xl"></i>
            </button>
        </div>
        <form id="replyForm">
            <input type="hidden" id="replyTicketId">

            <div class="mb-4">
                <label class="block text-sm font-medium mb-2 text-black">Customer Email</label>
                <input type="text" id="replyEmail" class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" disabled>
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium mb-2 text-black">Title</label>
                <input type="text" id="replyTitle" class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" disabled>
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium mb-2 text-black">Description</label>
                <textarea id="replyDescription" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" disabled></textarea>
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium mb-2 text-black">Status</label>
                <select id="replyStatus" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required>
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                </select>
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium mb-2 text-black">Reply</label>
                <textarea id="replyText" rows="5" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" required></textarea>
                <span id="replyTextError" class="text-red-600 text-sm hidden"></span>
            </div>

            <button type="submit" class="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
                <i class="fas fa-save mr-2"></i>Update Ticket
            </button>
        </form>
    </div>
</div>

<script src="/js/admin-tickets.js"></script>
</body>
</html>