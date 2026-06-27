package com.crm.task.service;

import com.crm.task.model.Task;
import com.crm.task.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public Task createTask(Task task) { return taskRepository.save(task); }

    public List<Task> getAllTasks() { return taskRepository.findAll(); }

    public Task getById(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found: " + id));
    }

    public Task updateTask(Long id, Task updated) {
        Task t = getById(id);
        t.setTitle(updated.getTitle());
        t.setDescription(updated.getDescription());
        t.setStatus(updated.getStatus());
        t.setPriority(updated.getPriority());
        t.setDueDate(updated.getDueDate());
        t.setCustomerId(updated.getCustomerId());
        t.setLeadId(updated.getLeadId());
        return taskRepository.save(t);
    }

    public void deleteTask(Long id) { taskRepository.deleteById(id); }

    public List<Task> getByStatus(String status) { return taskRepository.findByStatus(status); }

    public List<Task> getOverdueTasks() { return taskRepository.findOverdueTasks(LocalDateTime.now()); }

    public Map<String, Object> getTaskStats() {
        List<Object[]> rows = taskRepository.countByStatus();
        Map<String, Long> byStatus = new LinkedHashMap<>();
        rows.forEach(r -> byStatus.put((String) r[0], (Long) r[1]));
        return Map.of("total", taskRepository.count(),
                      "overdue", (long) taskRepository.findOverdueTasks(LocalDateTime.now()).size(),
                      "byStatus", byStatus);
    }
}
