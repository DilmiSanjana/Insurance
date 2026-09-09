<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Details - SeCrud</title>
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
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h4><i class="fas fa-credit-card"></i> Payment Details</h4>
                        <span class="badge bg-${payment.status == 'COMPLETED' ? 'success' : payment.status == 'PENDING' ? 'warning' : payment.status == 'FAILED' ? 'danger' : 'secondary'} fs-6">
                            ${payment.status}
                        </span>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Payment Information</h6>
                                <table class="table table-borderless">
                                    <tr>
                                        <td><strong>Payment ID:</strong></td>
                                        <td>${payment.id}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Amount:</strong></td>
                                        <td><fmt:formatNumber value="${payment.amount}" type="currency" currencyCode="USD"/></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Status:</strong></td>
                                        <td>
                                            <span class="badge bg-${payment.status == 'COMPLETED' ? 'success' : payment.status == 'PENDING' ? 'warning' : payment.status == 'FAILED' ? 'danger' : 'secondary'}">
                                                ${payment.status}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Created:</strong></td>
                                        <td><fmt:formatDate value="${payment.createdAt}" pattern="yyyy-MM-dd HH:mm"/></td>
                                    </tr>
                                    <c:if test="${not empty payment.paidDate}">
                                        <tr>
                                            <td><strong>Paid Date:</strong></td>
                                            <td><fmt:formatDate value="${payment.paidDate}" pattern="yyyy-MM-dd HH:mm"/></td>
                                        </tr>
                                    </c:if>
                                </table>
                            </div>
                            
                            <div class="col-md-6">
                                <h6>User Information</h6>
                                <table class="table table-borderless">
                                    <tr>
                                        <td><strong>Name:</strong></td>
                                        <td>${payment.user.firstName} ${payment.user.lastName}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Email:</strong></td>
                                        <td>${payment.user.email}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Contact:</strong></td>
                                        <td>${payment.user.contactNumber}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        
                        <c:if test="${not empty payment.additionalDate1 || not empty payment.additionalDate2 || not empty payment.additionalDate3}">
                            <hr>
                            <h6>Additional Dates</h6>
                            <div class="row">
                                <c:if test="${not empty payment.additionalDate1}">
                                    <div class="col-md-4">
                                        <strong>Additional Date 1:</strong><br>
                                        <fmt:formatDate value="${payment.additionalDate1}" pattern="yyyy-MM-dd HH:mm"/>
                                    </div>
                                </c:if>
                                <c:if test="${not empty payment.additionalDate2}">
                                    <div class="col-md-4">
                                        <strong>Additional Date 2:</strong><br>
                                        <fmt:formatDate value="${payment.additionalDate2}" pattern="yyyy-MM-dd HH:mm"/>
                                    </div>
                                </c:if>
                                <c:if test="${not empty payment.additionalDate3}">
                                    <div class="col-md-4">
                                        <strong>Additional Date 3:</strong><br>
                                        <fmt:formatDate value="${payment.additionalDate3}" pattern="yyyy-MM-dd HH:mm"/>
                                    </div>
                                </c:if>
                            </div>
                        </c:if>
                        
                        <hr>
                        <div class="d-flex gap-2">
                            <a href="/payments/${payment.id}/edit" class="btn btn-outline-primary">
                                <i class="fas fa-edit"></i> Edit Payment
                            </a>
                            
                            <c:if test="${payment.status == 'PENDING'}">
                                <form action="/payments/${payment.id}/status" method="post" class="d-inline">
                                    <input type="hidden" name="status" value="COMPLETED">
                                    <button type="submit" class="btn btn-success">
                                        <i class="fas fa-check"></i> Mark as Completed
                                    </button>
                                </form>
                                <form action="/payments/${payment.id}/status" method="post" class="d-inline">
                                    <input type="hidden" name="status" value="FAILED">
                                    <button type="submit" class="btn btn-danger">
                                        <i class="fas fa-times"></i> Mark as Failed
                                    </button>
                                </form>
                            </c:if>
                            
                            <c:if test="${payment.status == 'COMPLETED'}">
                                <form action="/payments/${payment.id}/status" method="post" class="d-inline">
                                    <input type="hidden" name="status" value="REFUNDED">
                                    <button type="submit" class="btn btn-warning">
                                        <i class="fas fa-undo"></i> Refund
                                    </button>
                                </form>
                            </c:if>
                            
                            <form action="/payments/${payment.id}/delete" method="post" class="d-inline" 
                                  onsubmit="return confirm('Are you sure you want to delete this payment?')">
                                <button type="submit" class="btn btn-outline-danger">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
