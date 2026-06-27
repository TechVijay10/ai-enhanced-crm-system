package com.crm.notification.controller;

import com.crm.notification.model.Notification;
import com.crm.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<Notification> create(@RequestBody Notification n) { return ResponseEntity.ok(notificationService.create(n)); }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getByUser(@PathVariable Long userId) { return ResponseEntity.ok(notificationService.getByUser(userId)); }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnread(@PathVariable Long userId) { return ResponseEntity.ok(notificationService.getUnread(userId)); }

    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable Long userId) { return ResponseEntity.ok(notificationService.getUnreadCount(userId)); }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markRead(@PathVariable Long id) { return ResponseEntity.ok(notificationService.markRead(id)); }

    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<String> markAllRead(@PathVariable Long userId) {
        notificationService.markAllRead(userId);
        return ResponseEntity.ok("All notifications marked read");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        notificationService.delete(id);
        return ResponseEntity.ok("Notification deleted");
    }
}
