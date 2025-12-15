package com.nexis.billing.service;

import com.nexis.billing.dto.*;
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;

import java.math.BigDecimal;

@WebService
public interface BillingService {
    @WebMethod
    InvoiceResponse createInvoice(
            @WebParam(name = "studentId") String studentId,
            @WebParam(name = "amount") BigDecimal amount,
            @WebParam(name = "description") String description,
            @WebParam(name = "dueDate") String dueDate);

    @WebMethod
    InvoiceResponse getInvoice(@WebParam(name = "invoiceId") Long invoiceId);

    @WebMethod
    InvoiceListResponse getStudentInvoices(@WebParam(name = "studentId") String studentId);

    @WebMethod
    PaymentResponse recordPayment(
            @WebParam(name = "invoiceId") Long invoiceId,
            @WebParam(name = "amount") BigDecimal amount,
            @WebParam(name = "paymentMethod") String paymentMethod,
            @WebParam(name = "transactionId") String transactionId);

    @WebMethod
    PaymentListResponse getPaymentHistory(@WebParam(name = "studentId") String studentId);

    @WebMethod
    BalanceResponse getOutstandingBalance(@WebParam(name = "studentId") String studentId);

    @WebMethod
    StatusResponse cancelInvoice(@WebParam(name = "invoiceId") Long invoiceId);
}
