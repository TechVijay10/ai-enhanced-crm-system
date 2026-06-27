package com.crm.recommendation.controller;

import com.crm.recommendation.model.CustomerBehavior;
import com.crm.recommendation.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<Map<String, Object>> getRecommendation(@PathVariable Long customerId) {
        return ResponseEntity.ok(recommendationService.getRecommendation(customerId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllRecommendations() {
        return ResponseEntity.ok(recommendationService.getAllRecommendations());
    }

    @PostMapping("/behavior")
    public ResponseEntity<CustomerBehavior> saveBehavior(@RequestBody CustomerBehavior behavior) {
        return ResponseEntity.ok(recommendationService.saveBehavior(behavior));
    }

    @GetMapping("/behavior")
    public ResponseEntity<List<CustomerBehavior>> getAllBehavior() {
        return ResponseEntity.ok(recommendationService.getAllBehavior());
    }

    @DeleteMapping("/behavior/{customerId}")
    public ResponseEntity<String> deleteBehavior(@PathVariable Long customerId) {
        recommendationService.deleteBehaviorByCustomerId(customerId);
        return ResponseEntity.ok("Behavior data deleted successfully");
    }
}
