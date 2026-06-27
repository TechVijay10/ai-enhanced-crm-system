package com.crm.analytics.controller;

import com.crm.analytics.model.*;
import com.crm.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(analyticsService.getDashboardSummary());
    }

    @GetMapping("/revenue")
    public ResponseEntity<List<RevenueReport>> getRevenue(@RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(analyticsService.getRevenueByYear(year));
    }

    @GetMapping("/revenue/all")
    public ResponseEntity<List<RevenueReport>> getAllRevenue() {
        return ResponseEntity.ok(analyticsService.getAllRevenue());
    }

    @PostMapping("/revenue")
    public ResponseEntity<RevenueReport> saveRevenue(@RequestBody RevenueReport report) {
        return ResponseEntity.ok(analyticsService.saveRevenueReport(report));
    }

    @GetMapping("/reports")
    public ResponseEntity<List<AnalyticsReport>> getReports() {
        return ResponseEntity.ok(analyticsService.getAnalyticsReports());
    }

    @DeleteMapping("/revenue/{id}")
    public ResponseEntity<String> deleteRevenue(@PathVariable Long id) {
        analyticsService.deleteRevenueReport(id);
        return ResponseEntity.ok("Revenue report deleted successfully");
    }
}
