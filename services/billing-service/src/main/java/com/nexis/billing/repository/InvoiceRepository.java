package com.nexis.billing.repository;

import com.nexis.billing.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByStudentId(String studentId);
    List<Invoice> findByStatus(String status);
    List<Invoice> findByStudentIdAndStatus(String studentId, String status);
}
