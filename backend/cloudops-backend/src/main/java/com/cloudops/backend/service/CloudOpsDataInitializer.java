package com.cloudops.backend.service;

import com.cloudops.backend.entity.ServiceEntity;
import com.cloudops.backend.entity.DeploymentEntity;
import com.cloudops.backend.repository.ServiceRepository;
import com.cloudops.backend.repository.DeploymentRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class CloudOpsDataInitializer implements CommandLineRunner {

    private final ServiceRepository serviceRepository;
    private final DeploymentRepository deploymentRepository;

    public CloudOpsDataInitializer(
            ServiceRepository serviceRepository,
            DeploymentRepository deploymentRepository) {
        this.serviceRepository = serviceRepository;
        this.deploymentRepository = deploymentRepository;
    }

    @Override
    public void run(String... args) {

        if (serviceRepository.count() == 0) {
            serviceRepository.save(new ServiceEntity(
                "Frontend Service", "Running", "Production"));

            serviceRepository.save(new ServiceEntity(
                "Backend Service", "Running", "Production"));

            serviceRepository.save(new ServiceEntity(
                "Database Service", "Pending", "Development"));

            serviceRepository.save(new ServiceEntity(
                "Monitoring Service", "Running", "Production"));
        }

        if (deploymentRepository.count() == 0) {
            deploymentRepository.save(new DeploymentEntity(
                "CloudOps Frontend", "Successful", "Production"));

            deploymentRepository.save(new DeploymentEntity(
                "CloudOps Backend", "Successful", "Development"));

            deploymentRepository.save(new DeploymentEntity(
                "CloudOps Infrastructure", "Pending", "Staging"));
        }

        System.out.println("CloudOps database initialization completed.");
    }
}
