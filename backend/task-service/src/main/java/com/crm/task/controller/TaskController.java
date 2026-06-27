package com.crm.task.controller;

import com.crm.task.model.Task;
import com.crm.task.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<Task> create(@RequestBody Task task) { return ResponseEntity.ok(taskService.createTask(task)); }

    @GetMapping
    public ResponseEntity<List<Task>> getAll(@RequestParam(required = false) String status) {
        return status != null ? ResponseEntity.ok(taskService.getByStatus(status))
                              : ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getById(@PathVariable Long id) { return ResponseEntity.ok(taskService.getById(id)); }

    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable Long id, @RequestBody Task task) {
        return ResponseEntity.ok(taskService.updateTask(id, task));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok("Task deleted");
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<Task>> getOverdue() { return ResponseEntity.ok(taskService.getOverdueTasks()); }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() { return ResponseEntity.ok(taskService.getTaskStats()); }
}
