package com.helpdesk.repository;

import com.helpdesk.model.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, String> {

    List<Ticket> findAllByOrderByCreatedAtDesc();

    Page<Ticket> findByStatus(String status, Pageable pageable);

    @Query("SELECT t FROM Ticket t WHERE " +
           "(:query IS NULL OR LOWER(t.id) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.subject) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:category IS NULL OR t.category = :category) AND " +
           "(:priority IS NULL OR t.priority = :priority)")
    Page<Ticket> searchTickets(
            @Param("query") String query,
            @Param("status") String status,
            @Param("category") String category,
            @Param("priority") String priority,
            Pageable pageable
    );

    long countByStatus(String status);

    long countByCategory(String category);

    @Query("SELECT t.category, COUNT(t) FROM Ticket t GROUP BY t.category")
    List<Object[]> countTicketsByCategory();

    @Query("SELECT t.priority, COUNT(t) FROM Ticket t GROUP BY t.priority")
    List<Object[]> countTicketsByPriority();
}
