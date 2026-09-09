<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payments - SeCrud</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand" href="/">SeCrud</a>
            <div class="navbar-nav ms-auto">
                <a class="nav-link" href="/payments/create">
                    <i class="fas fa-plus"></i> New Payment
                </a>
            </div>
        </div>
    </nav>

    <div class="container mt-4">
        <div class="row">
            <div class="col-12">
                <h2><i class="fas fa-credit-card"></i> All Payments</h2>
                
                <c:if test="${not empty payments}">
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>User</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Paid Date</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <c:forEach var="payment" items="${payments}">
                                    <tr>
                                        <td>${payment.id}</td>
                                        <td>${payment.user.firstName} ${payment.user.lastName}</td>
                                        <td><fmt:formatNumber value="${payment.amount}" type="currency" currencyCode="USD"/></td>
                                        <td>
                                            <span class="badge bg-${payment.status == 'COMPLETED' ? 'success' : payment.status == 'PENDING' ? 'warning' : payment.status == 'FAILED' ? 'danger' : 'secondary'}">
                                                ${payment.status}
                                            </span>
                                        </td>
                                        <td>
                                            <c:if test="${not empty payment.paidDate}">
                                                <fmt:formatDate value="${payment.paidDate}" pattern="yyyy-MM-dd HH:mm"/>
                                            </c:if>
                                        </td>
                                        <td><fmt:formatDate value="${payment.createdAt}" pattern="yyyy-MM-dd HH:mm"/></td>
                                        <td>
                                            <a href="/payments/${payment.id}" class="btn btn-sm btn-outline-primary">
                                                <i class="fas fa-eye"></i> View
                                            </a>
                                            <a href="/payments/${payment.id}/edit" class="btn btn-sm btn-outline-secondary">
                                                <i class="fas fa-edit"></i> Edit
                                            </a>
                                        </td>
                                    </tr>
                                </c:forEach>
                            </tbody>
                        </table>
                    </div>
                </c:if>
                
                <c:if test="${empty payments}">
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle"></i> No payments found.
                    </div>
                </c:if>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
