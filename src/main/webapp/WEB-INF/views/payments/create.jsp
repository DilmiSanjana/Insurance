<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create Payment - SeCrud</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand" href="/">SeCrud</a>
            <div class="navbar-nav ms-auto">
                <a class="nav-link" href="/payments">
                    <i class="fas fa-list"></i> All Payments
                </a>
            </div>
        </div>
    </nav>

    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <h4><i class="fas fa-plus"></i> Create New Payment</h4>
                    </div>
                    <div class="card-body">
                        <form action="/payments/create" method="post">
                            <div class="mb-3">
                                <label for="userId" class="form-label">User</label>
                                <select class="form-select" id="userId" name="userId" required>
                                    <option value="">Select a user</option>
                                    <c:forEach var="user" items="${users}">
                                        <option value="${user.id}">${user.firstName} ${user.lastName} (${user.email})</option>
                                    </c:forEach>
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label for="amount" class="form-label">Amount</label>
                                <div class="input-group">
                                    <span class="input-group-text">$</span>
                                    <input type="number" class="form-control" id="amount" name="amount" 
                                           step="0.01" min="0.01" required>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="additionalDate1" class="form-label">Additional Date 1 (Optional)</label>
                                <input type="datetime-local" class="form-control" id="additionalDate1" name="additionalDate1">
                            </div>
                            
                            <div class="mb-3">
                                <label for="additionalDate2" class="form-label">Additional Date 2 (Optional)</label>
                                <input type="datetime-local" class="form-control" id="additionalDate2" name="additionalDate2">
                            </div>
                            
                            <div class="mb-3">
                                <label for="additionalDate3" class="form-label">Additional Date 3 (Optional)</label>
                                <input type="datetime-local" class="form-control" id="additionalDate3" name="additionalDate3">
                            </div>
                            
                            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                <a href="/payments" class="btn btn-secondary me-md-2">
                                    <i class="fas fa-times"></i> Cancel
                                </a>
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save"></i> Create Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
