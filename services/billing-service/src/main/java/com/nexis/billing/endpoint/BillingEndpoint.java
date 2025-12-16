package com.nexis.billing.endpoint;

import com.nexis.billing.model.Invoice;
import com.nexis.billing.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import jakarta.xml.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@Endpoint
@RequiredArgsConstructor
public class BillingEndpoint {
    
    private static final String NAMESPACE_URI = "http://nexis.com/billing";
    
    private final InvoiceRepository invoiceRepository;
    
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getInvoicesRequest")
    @ResponsePayload
    public GetInvoicesResponse getInvoices(@RequestPayload GetInvoicesRequest request) {
        List<Invoice> invoices;
        if (request.getStudentId() != null && !request.getStudentId().isEmpty()) {
            invoices = invoiceRepository.findByStudentId(request.getStudentId());
        } else {
            invoices = invoiceRepository.findAll();
        }
        
        GetInvoicesResponse response = new GetInvoicesResponse();
        response.setInvoices(invoices);
        return response;
    }
    
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "createInvoiceRequest")
    @ResponsePayload
    public CreateInvoiceResponse createInvoice(@RequestPayload CreateInvoiceRequest request) {
        Invoice invoice = new Invoice();
        invoice.setStudentId(request.getStudentId());
        invoice.setDescription(request.getDescription());
        invoice.setAmount(request.getAmount());
        invoice.setDueDate(LocalDate.parse(request.getDueDate()));
        invoice.setStatus("pending");
        invoice.setCreatedAt(LocalDate.now());
        
        Invoice saved = invoiceRepository.save(invoice);
        
        CreateInvoiceResponse response = new CreateInvoiceResponse();
        response.setInvoice(saved);
        response.setSuccess(true);
        return response;
    }
    
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "recordPaymentRequest")
    @ResponsePayload
    public RecordPaymentResponse recordPayment(@RequestPayload RecordPaymentRequest request) {
        RecordPaymentResponse response = new RecordPaymentResponse();
        
        Invoice invoice = invoiceRepository.findById(request.getInvoiceId()).orElse(null);
        if (invoice == null) {
            response.setSuccess(false);
            response.setMessage("Invoice not found");
            return response;
        }
        
        invoice.setStatus("paid");
        invoice.setPaymentDate(LocalDate.now());
        invoiceRepository.save(invoice);
        
        response.setSuccess(true);
        response.setMessage("Payment recorded successfully");
        response.setInvoice(invoice);
        return response;
    }
    
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getBalanceRequest")
    @ResponsePayload
    public GetBalanceResponse getBalance(@RequestPayload GetBalanceRequest request) {
        List<Invoice> invoices = invoiceRepository.findByStudentId(request.getStudentId());
        
        double totalAmount = invoices.stream().mapToDouble(Invoice::getAmount).sum();
        double totalPaid = invoices.stream()
            .filter(i -> "paid".equals(i.getStatus()))
            .mapToDouble(Invoice::getAmount).sum();
        
        GetBalanceResponse response = new GetBalanceResponse();
        response.setStudentId(request.getStudentId());
        response.setTotalAmount(totalAmount);
        response.setTotalPaid(totalPaid);
        response.setBalance(totalAmount - totalPaid);
        return response;
    }
    
    // Request/Response classes
    @XmlRootElement(name = "getInvoicesRequest", namespace = NAMESPACE_URI)
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class GetInvoicesRequest {
        private String studentId;
        public String getStudentId() { return studentId; }
        public void setStudentId(String studentId) { this.studentId = studentId; }
    }
    
    @XmlRootElement(name = "getInvoicesResponse", namespace = NAMESPACE_URI)
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class GetInvoicesResponse {
        @XmlElement(name = "invoice")
        private List<Invoice> invoices;
        public List<Invoice> getInvoices() { return invoices; }
        public void setInvoices(List<Invoice> invoices) { this.invoices = invoices; }
    }
    
    @XmlRootElement(name = "createInvoiceRequest", namespace = NAMESPACE_URI)
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class CreateInvoiceRequest {
        private String studentId;
        private String description;
        private Double amount;
        private String dueDate;
        public String getStudentId() { return studentId; }
        public void setStudentId(String studentId) { this.studentId = studentId; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
        public String getDueDate() { return dueDate; }
        public void setDueDate(String dueDate) { this.dueDate = dueDate; }
    }
    
    @XmlRootElement(name = "createInvoiceResponse", namespace = NAMESPACE_URI)
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class CreateInvoiceResponse {
        private Invoice invoice;
        private boolean success;
        public Invoice getInvoice() { return invoice; }
        public void setInvoice(Invoice invoice) { this.invoice = invoice; }
        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }
    }
    
    @XmlRootElement(name = "recordPaymentRequest", namespace = NAMESPACE_URI)
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class RecordPaymentRequest {
        private Long invoiceId;
        public Long getInvoiceId() { return invoiceId; }
        public void setInvoiceId(Long invoiceId) { this.invoiceId = invoiceId; }
    }
    
    @XmlRootElement(name = "recordPaymentResponse", namespace = NAMESPACE_URI)
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class RecordPaymentResponse {
        private boolean success;
        private String message;
        private Invoice invoice;
        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public Invoice getInvoice() { return invoice; }
        public void setInvoice(Invoice invoice) { this.invoice = invoice; }
    }
    
    @XmlRootElement(name = "getBalanceRequest", namespace = NAMESPACE_URI)
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class GetBalanceRequest {
        private String studentId;
        public String getStudentId() { return studentId; }
        public void setStudentId(String studentId) { this.studentId = studentId; }
    }
    
    @XmlRootElement(name = "getBalanceResponse", namespace = NAMESPACE_URI)
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class GetBalanceResponse {
        private String studentId;
        private double totalAmount;
        private double totalPaid;
        private double balance;
        public String getStudentId() { return studentId; }
        public void setStudentId(String studentId) { this.studentId = studentId; }
        public double getTotalAmount() { return totalAmount; }
        public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
        public double getTotalPaid() { return totalPaid; }
        public void setTotalPaid(double totalPaid) { this.totalPaid = totalPaid; }
        public double getBalance() { return balance; }
        public void setBalance(double balance) { this.balance = balance; }
    }
}
