package com.nexis.billing.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long invoiceId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod;

    @Column(nullable = false)
    private LocalDateTime paymentDate;

    @Column(unique = true, nullable = false)
    private String transactionId;

    private String notes;

    public enum PaymentMethod {
        CASH, CARD, TRANSFER, CHECK
    }

    @PrePersist
    protected void onCreate() {
        paymentDate = LocalDateTime.now();
    }
}
