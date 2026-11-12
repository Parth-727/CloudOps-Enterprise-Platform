package com.cloudops.backend.controller;

import com.cloudops.backend.entity.ServiceEntity;
import com.cloudops.backend.entity.DeploymentEntity;
import com.cloudops.backend.service.CloudOpsService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DashboardController {

    private final CloudOpsService cloudOpsService;

    public DashboardController(CloudOpsService cloudOpsService) {
        this.cloudOpsService = cloudOpsService;
    }

    @GetMapping("/status")
    public Map<String, Object> getStatus() {
        return Map.of(
            "application", "CloudOps Enterprise Platform",
            "status", "UP",
            "backend", "Spring Boot",
            "version", "1.0.0",
            "message", "Backend is running successfully"
        );
    }

    @GetMapping("/dashboard/summary")
    public Map<String, Object> getDashboardSummary() {
        return cloudOpsService.getDashboardSummary();
    }

    @GetMapping("/services")
    public List<ServiceEntity> getServices() {
        return cloudOpsService.getAllServices();
    }

    @GetMapping("/deployments")
    public List<DeploymentEntity> getDeployments() {
        return cloudOpsService.getAllDeployments();
    }

    @PostMapping("/services")
    @ResponseStatus(HttpStatus.CREATED)
    public ServiceEntity createService(
            @Valid @RequestBody ServiceEntity service) {
        return cloudOpsService.createService(service);
    }

    @PostMapping("/deployments")
    @ResponseStatus(HttpStatus.CREATED)
    public DeploymentEntity createDeployment(
            @Valid @RequestBody DeploymentEntity deployment) {
        return cloudOpsService.createDeployment(deployment);
    }
}
