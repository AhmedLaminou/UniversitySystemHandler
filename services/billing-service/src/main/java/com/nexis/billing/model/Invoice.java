package com.nexis.billing.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "student_id", nullable = false)
    private String studentId;
    
    @Column(nullable = false)
    private String description;
    
    @Column(nullable = false)
    private Double amount;
    
    @Column(name = "due_date")
    private LocalDate dueDate;
    
    @Column(nullable = false)
    private String status = "pending"; // pending, paid, overdue
    
    @Column(name = "payment_date")
    private LocalDate paymentDate;
    
    @Column(name = "created_at")
    private LocalDate createdAt = LocalDate.now();
}
