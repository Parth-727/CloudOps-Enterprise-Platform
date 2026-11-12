package com.cloudops.backend.service;

import com.cloudops.backend.entity.ServiceEntity;
import com.cloudops.backend.entity.DeploymentEntity;
import com.cloudops.backend.repository.ServiceRepository;
import com.cloudops.backend.repository.DeploymentRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class CloudOpsService {

    private final ServiceRepository serviceRepository;
    private final DeploymentRepository deploymentRepository;

    public CloudOpsService(
            ServiceRepository serviceRepository,
            DeploymentRepository deploymentRepository) {
        this.serviceRepository = serviceRepository;
        this.deploymentRepository = deploymentRepository;
    }

    public List<ServiceEntity> getAllServices() {
        return serviceRepository.findAll();
    }

    public List<DeploymentEntity> getAllDeployments() {
        return deploymentRepository.findAll();
    }

    public Map<String, Object> getDashboardSummary() {
        long totalServices = serviceRepository.count();
        long activeServices = serviceRepository.countByStatusIgnoreCase("Running");
        long totalDeployments = deploymentRepository.count();
        long failedDeployments = deploymentRepository.countByStatusIgnoreCase("Failed");

        return Map.of(
            "totalServices", totalServices,
            "activeServices", activeServices,
            "deployments", totalDeployments,
            "failedDeployments", failedDeployments,
            "systemHealth", failedDeployments > 0 ? "Degraded" : "Operational",
            "uptime", "99.9%"
        );
    }

    @Transactional
    public ServiceEntity createService(ServiceEntity service) {
        service.setId(null);
        return serviceRepository.save(service);
    }

    @Transactional
    public DeploymentEntity createDeployment(DeploymentEntity deployment) {
        deployment.setId(null);
        return deploymentRepository.save(deployment);
    }
}
