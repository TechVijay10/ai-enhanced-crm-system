package com.crm.lead.repository;

import com.crm.lead.model.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
    List<Lead> findByStatus(String status);
    List<Lead> findByPriority(String priority);
    List<Lead> findByAssignedTo(Long userId);
    List<Lead> findBySource(String source);

    @Query("SELECT l FROM Lead l WHERE LOWER(l.firstName) LIKE LOWER(CONCAT('%',:kw,'%')) " +
           "OR LOWER(l.lastName) LIKE LOWER(CONCAT('%',:kw,'%')) " +
           "OR LOWER(l.email) LIKE LOWER(CONCAT('%',:kw,'%')) " +
           "OR LOWER(l.company) LIKE LOWER(CONCAT('%',:kw,'%'))")
    List<Lead> searchLeads(String kw);

    @Query("SELECT COUNT(l) FROM Lead l WHERE l.status = 'CONVERTED'")
    Long countConverted();

    @Query("SELECT l.source, COUNT(l) FROM Lead l GROUP BY l.source")
    List<Object[]> countBySource();

    @Query("SELECT l.status, COUNT(l) FROM Lead l GROUP BY l.status")
    List<Object[]> countByStatus();
}
