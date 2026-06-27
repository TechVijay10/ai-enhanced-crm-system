package com.crm.notification.service;

import com.crm.notification.model.Notification;
import com.crm.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public Notification create(Notification notification) {
        Notification saved = notificationRepository.save(notification);
        messagingTemplate.convertAndSend("/topic/notifications/" + saved.getUserId(), saved);
        return saved;
    }

    public List<Notification> getByUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnread(Long userId) {
        return notificationRepository.findByUserIdAndIsRead(userId, 0);
    }

    public Notification markRead(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        n.setIsRead(1);
        return notificationRepository.save(n);
    }

    public void markAllRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsRead(userId, 0);
        unread.forEach(n -> n.setIsRead(1));
        notificationRepository.saveAll(unread);
    }

    public void delete(Long id) { notificationRepository.deleteById(id); }

    public Map<String, Long> getUnreadCount(Long userId) {
        return Map.of("unreadCount", notificationRepository.countByUserIdAndIsRead(userId, 0));
    }
}
