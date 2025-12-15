package com.nexis.billing.service;

import com.nexis.billing.dto.*;
import com.nexis.billing.entity.Invoice;
import com.nexis.billing.entity.Payment;
import com.nexis.billing.repository.InvoiceRepository;
import com.nexis.billing.repository.PaymentRepository;
import jakarta.jws.WebService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@WebService(endpointInterface = "com.nexis.billing.service.BillingService")
public class BillingServiceImpl implements BillingService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;

    @Override
    public InvoiceResponse createInvoice(String studentId, BigDecimal amount, String description, String dueDate) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }

        Invoice invoice = new Invoice();
        invoice.setStudentId(studentId);
        invoice.setAmount(amount);
        invoice.setDescription(description);
        invoice.setDueDate(LocalDate.parse(dueDate));
        invoice.setInvoiceNumber(generateInvoiceNumber());

        Invoice savedInvoice = invoiceRepository.save(invoice);
        return new InvoiceResponse(savedInvoice);
    }

    @Override
    public InvoiceResponse getInvoice(Long invoiceId) {
        return invoiceRepository.findById(invoiceId)
                .map(InvoiceResponse::new)
                .orElse(null);
    }

    @Override
    public InvoiceListResponse getStudentInvoices(String studentId) {
        List<InvoiceResponse> invoices = invoiceRepository.findByStudentId(studentId)
                .stream()
                .map(InvoiceResponse::new)
                .collect(Collectors.toList());
        return new InvoiceListResponse(invoices);
    }

    @Override
    public PaymentResponse recordPayment(Long invoiceId, BigDecimal amount, String paymentMethod,
            String transactionId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        if (invoice.getStatus() == Invoice.Status.CANCELLED) {
            throw new RuntimeException("Cannot pay cancelled invoice");
        }

        Payment payment = new Payment();
        payment.setInvoiceId(invoiceId);
        payment.setAmount(amount);
        payment.setPaymentMethod(Payment.PaymentMethod.valueOf(paymentMethod));
        payment.setTransactionId(transactionId);

        Payment savedPayment = paymentRepository.save(payment);

        // Check if fully paid
        checkAndUpdateInvoiceStatus(invoice);

        return new PaymentResponse(savedPayment);
    }

    @Override
    public PaymentListResponse getPaymentHistory(String studentId) {
        // This is a bit inefficient, ideally we should have a join or studentId in
        // payments
        // For now, we get all invoices for student, then all payments for those
        // invoices
        List<Invoice> invoices = invoiceRepository.findByStudentId(studentId);
        List<PaymentResponse> payments = invoices.stream()
                .flatMap(inv -> paymentRepository.findByInvoiceId(inv.getId()).stream())
                .map(PaymentResponse::new)
                .collect(Collectors.toList());
        return new PaymentListResponse(payments);
    }

    @Override
    public BalanceResponse getOutstandingBalance(String studentId) {
        List<Invoice> invoices = invoiceRepository.findByStudentId(studentId);

        BigDecimal totalInvoices = invoices.stream()
                .filter(inv -> inv.getStatus() != Invoice.Status.CANCELLED)
                .map(Invoice::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPaid = invoices.stream()
                .flatMap(inv -> paymentRepository.findByInvoiceId(inv.getId()).stream())
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new BalanceResponse(studentId, totalInvoices, totalPaid, totalInvoices.subtract(totalPaid));
    }

    @Override
    public StatusResponse cancelInvoice(Long invoiceId) {
        return invoiceRepository.findById(invoiceId)
                .map(invoice -> {
                    invoice.setStatus(Invoice.Status.CANCELLED);
                    invoiceRepository.save(invoice);
                    return new StatusResponse(true, "Invoice cancelled");
                })
                .orElse(new StatusResponse(false, "Invoice not found"));
    }

    private String generateInvoiceNumber() {
        long count = invoiceRepository.count() + 1;
        return String.format("INV-%d-%06d", Year.now().getValue(), count);
    }

    private void checkAndUpdateInvoiceStatus(Invoice invoice) {
        BigDecimal totalPaid = paymentRepository.findByInvoiceId(invoice.getId())
                .stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalPaid.compareTo(invoice.getAmount()) >= 0) {
            invoice.setStatus(Invoice.Status.PAID);
            invoiceRepository.save(invoice);
        }
    }
}
