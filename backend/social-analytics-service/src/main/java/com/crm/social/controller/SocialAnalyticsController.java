package com.crm.social.controller;

import com.crm.social.model.SocialSource;
import com.crm.social.service.SocialAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/social")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SocialAnalyticsController {

    private final SocialAnalyticsService socialAnalyticsService;

    @PostMapping
    public ResponseEntity<SocialSource> save(@RequestBody SocialSource source) {
        return ResponseEntity.ok(socialAnalyticsService.save(source));
    }

    @GetMapping
    public ResponseEntity<List<SocialSource>> getAll() {
        return ResponseEntity.ok(socialAnalyticsService.getAll());
    }

    @GetMapping("/platforms")
    public ResponseEntity<List<Map<String, Object>>> getPlatformSummary() {
        return ResponseEntity.ok(socialAnalyticsService.getPlatformSummary());
    }

    @GetMapping("/campaigns")
    public ResponseEntity<List<Map<String, Object>>> getCampaignSummary() {
        return ResponseEntity.ok(socialAnalyticsService.getCampaignSummary());
    }

    @DeleteMapping("/campaigns/{name}")
    public ResponseEntity<String> deleteByCampaign(@PathVariable String name) {
        socialAnalyticsService.deleteByCampaignName(name);
        return ResponseEntity.ok("Campaign deleted successfully");
    }
}
