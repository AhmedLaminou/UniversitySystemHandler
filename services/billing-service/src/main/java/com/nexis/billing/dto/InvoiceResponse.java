package com.nexis.billing.dto;

import com.nexis.billing.entity.Invoice;
import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
@Data
@NoArgsConstructor
public class InvoiceResponse {
    private Long id;
    private String invoiceNumber;
    private String studentId;
    private BigDecimal amount;
    private String description;
    private String dueDate;
    private String status;
    private String createdAt;

    public InvoiceResponse(Invoice invoice) {
        this.id = invoice.getId();
        this.invoiceNumber = invoice.getInvoiceNumber();
        this.studentId = invoice.getStudentId();
        this.amount = invoice.getAmount();
        this.description = invoice.getDescription();
        this.dueDate = invoice.getDueDate().toString();
        this.status = invoice.getStatus().name();
        this.createdAt = invoice.getCreatedAt().toString();
    }
}
