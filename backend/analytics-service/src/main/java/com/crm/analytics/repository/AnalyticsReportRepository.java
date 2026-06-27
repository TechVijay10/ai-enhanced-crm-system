package com.crm.analytics.repository;

import com.crm.analytics.model.AnalyticsReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnalyticsReportRepository extends JpaRepository<AnalyticsReport, Long> {
    List<AnalyticsReport> findByReportYearOrderByReportMonthDesc(Integer year);
    List<AnalyticsReport> findByReportType(String reportType);
}
