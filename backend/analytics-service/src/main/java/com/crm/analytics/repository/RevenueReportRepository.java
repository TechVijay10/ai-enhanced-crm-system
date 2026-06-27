package com.crm.analytics.repository;

import com.crm.analytics.model.RevenueReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RevenueReportRepository extends JpaRepository<RevenueReport, Long> {
    List<RevenueReport> findByYearOrderByMonthAsc(Integer year);
    List<RevenueReport> findAllByOrderByYearAscMonthAsc();
    @Query("SELECT SUM(r.revenue) FROM RevenueReport r WHERE r.year = :year")
    Double getTotalRevenueByYear(Integer year);
}
