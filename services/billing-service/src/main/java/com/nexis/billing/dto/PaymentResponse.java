package com.nexis.billing.dto;

import com.nexis.billing.entity.Payment;
import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
@Data
@NoArgsConstructor
public class PaymentResponse {
    private Long id;
    private Long invoiceId;
    private BigDecimal amount;
    private String paymentMethod;
    private String paymentDate;
    private String transactionId;

    public PaymentResponse(Payment payment) {
        this.id = payment.getId();
        this.invoiceId = payment.getInvoiceId();
        this.amount = payment.getAmount();
        this.paymentMethod = payment.getPaymentMethod().name();
        this.paymentDate = payment.getPaymentDate().toString();
        this.transactionId = payment.getTransactionId();
    }
}
