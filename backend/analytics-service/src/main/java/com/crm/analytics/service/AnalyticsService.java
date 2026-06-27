package com.crm.analytics.service;

import com.crm.analytics.model.*;
import com.crm.analytics.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final RevenueReportRepository revenueRepo;
    private final AnalyticsReportRepository analyticsRepo;
    private final jakarta.persistence.EntityManager entityManager;

    private long getCount(String sql) {
        try {
            return ((Number) entityManager.createNativeQuery(sql).getSingleResult()).longValue();
        } catch (Exception e) {
            return 0;
        }
    }

    /** Returns revenue records sorted by year ASC, month ASC (chronological order). */
    public List<RevenueReport> getRevenueByYear(Integer year) {
        return revenueRepo.findByYearOrderByMonthAsc(year != null ? year : 2025);
    }

    /** Returns ALL revenue records sorted chronologically (year ASC, month ASC). */
    public List<RevenueReport> getAllRevenue() {
        return revenueRepo.findAllByOrderByYearAscMonthAsc();
    }

    /** Live dashboard summary — all values come from real DB counts. */
    public Map<String, Object> getDashboardSummary() {
        long totalCustomers  = getCount("SELECT COUNT(*) FROM customers");
        long activeCustomers = getCount("SELECT COUNT(*) FROM customers WHERE status = 'ACTIVE'");
        long totalLeads      = getCount("SELECT COUNT(*) FROM leads");
        long convertedLeads  = getCount("SELECT COUNT(*) FROM leads WHERE status = 'CONVERTED'");

        // Customers created in last 30 days
        long newCustomers = getCount(
            "SELECT COUNT(*) FROM customers WHERE created_at >= SYSTIMESTAMP - INTERVAL '30' DAY"
        );

        // Real revenue/profit totals from revenue_reports table
        List<RevenueReport> reports = revenueRepo.findAll();
        double totalRevenue = reports.stream()
            .mapToDouble(r -> r.getRevenue() != null ? r.getRevenue().doubleValue() : 0).sum();
        double totalProfit = reports.stream()
            .mapToDouble(r -> r.getProfit() != null ? r.getProfit().doubleValue() : 0).sum();

        double conversionRate = totalLeads > 0
            ? Math.round((convertedLeads * 100.0 / totalLeads) * 100.0) / 100.0
            : 0.0;

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalRevenue",    totalRevenue);
        summary.put("totalProfit",     totalProfit);
        summary.put("totalLeads",      totalLeads);
        summary.put("convertedLeads",  convertedLeads);
        summary.put("newCustomers",    newCustomers);
        summary.put("conversionRate",  conversionRate);
        summary.put("totalCustomers",  totalCustomers);
        summary.put("activeCustomers", activeCustomers);
        return summary;
    }

    /**
     * Generates Analytics Reports DYNAMICALLY from live data.
     * Each revenue_report row becomes one monthly analytics report entry
     * enriched with live lead and customer counts.
     * This completely bypasses the old (stale) analytics_reports seed table.
     */
    public List<AnalyticsReport> getAnalyticsReports() {
        // Fetch all revenue records in chronological order
        List<RevenueReport> revenueRecords = revenueRepo.findAllByOrderByYearAscMonthAsc();
        if (revenueRecords.isEmpty()) {
            return new ArrayList<>();
        }

        // Live counts from DB
        long totalLeads     = getCount("SELECT COUNT(*) FROM leads");
        long convertedLeads = getCount("SELECT COUNT(*) FROM leads WHERE status = 'CONVERTED'");
        long totalCustomers = getCount("SELECT COUNT(*) FROM customers");
        long newCustomers   = getCount(
            "SELECT COUNT(*) FROM customers WHERE created_at >= SYSTIMESTAMP - INTERVAL '30' DAY"
        );

        List<AnalyticsReport> dynamicReports = new ArrayList<>();
        long fakeId = 1L;
        for (RevenueReport r : revenueRecords) {
            dynamicReports.add(AnalyticsReport.builder()
                .id(fakeId++)
                .reportType("MONTHLY")
                .reportMonth(r.getMonth())
                .reportYear(r.getYear())
                .totalRevenue(r.getRevenue() != null ? r.getRevenue() : BigDecimal.ZERO)
                .totalLeads((int) totalLeads)
                .convertedLeads((int) convertedLeads)
                .newCustomers((int) newCustomers)
                .reportData(
                    String.format(
                        "Revenue: %.0f | Expenses: %.0f | Profit: %.0f | Customers: %d",
                        r.getRevenue()  != null ? r.getRevenue().doubleValue()  : 0,
                        r.getExpenses() != null ? r.getExpenses().doubleValue() : 0,
                        r.getProfit()   != null ? r.getProfit().doubleValue()   : 0,
                        totalCustomers
                    )
                )
                .build());
        }
        return dynamicReports;
    }

    public RevenueReport saveRevenueReport(RevenueReport report) {
        return revenueRepo.save(report);
    }

    public void deleteRevenueReport(Long id) {
        revenueRepo.deleteById(id);
    }
}
